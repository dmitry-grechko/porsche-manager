-- FLAT·SIX 981 Garage — flexible service records + service planning.
--
-- 1. service_records.items moves from a flat string[] to a flexible array of
--    line-item objects (name / description / partNumber / cost). The column is
--    already jsonb, so no type change is needed — older string[] rows are
--    normalised in the data layer (lib/db/service-records.ts). We add an
--    optional free-text `notes` column for an overall note on the record.
--
-- 2. service_plans is a new per-vehicle table for work an owner is planning
--    ahead of time (browse parts, gather how-to links, then knock it all out in
--    one session). Each plan holds flexible plan-items with optional part
--    numbers and reference links. A plan can later be "started" — the app
--    pre-fills a new service_record from it (see startPlanAsRecord()).
--
-- RLS mirrors the existing tables: a user can only ever touch their own rows.

-- ---------------------------------------------------------------------------
-- service_records: overall note for the visit (per-item detail lives in items).
-- ---------------------------------------------------------------------------
alter table public.service_records
  add column if not exists notes text;

-- ---------------------------------------------------------------------------
-- service_plans : planned/upcoming maintenance for a vehicle.
-- user_id is denormalized so RLS is a simple auth.uid() = user_id check.
--
-- items shape (jsonb array), kept DIY-simple but inspired by a shop work-order:
--   {
--     "id":          "uuid-ish string (client generated, stable for the row)",
--     "name":        "Spark plugs",            -- required
--     "description": "Replace all 6, gap-check","-- optional, the actual job
--     "partNumber":  "94917022000",            -- optional OEM number
--     "links":       [{"label":"FCP how-to","url":"https://…"}], -- optional refs
--     "done":        false                       -- ticked off while wrenching
--   }
-- ---------------------------------------------------------------------------
create table if not exists public.service_plans (
  id             uuid primary key default gen_random_uuid(),
  vehicle_id     uuid not null references public.vehicles (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  title          text not null,
  notes          text,
  -- 'planning' | 'ordered' | 'scheduled' | 'done' — soft status, free-form safe.
  status         text not null default 'planning',
  target_date    date,            -- when the owner intends to do the work
  target_mileage integer,         -- or the odometer they're targeting
  items          jsonb not null default '[]'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists service_plans_vehicle_id_idx on public.service_plans (vehicle_id);
create index if not exists service_plans_user_id_idx on public.service_plans (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — full CRUD restricted to the owner.
-- ---------------------------------------------------------------------------
alter table public.service_plans enable row level security;

create policy "service_plans_all_own" on public.service_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Keep updated_at fresh on every update.
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists service_plans_touch_updated_at on public.service_plans;
create trigger service_plans_touch_updated_at
  before update on public.service_plans
  for each row execute function public.touch_updated_at();
