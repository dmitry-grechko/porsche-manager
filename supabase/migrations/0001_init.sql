-- FLAT·SIX 981 Garage — initial schema.
-- Per-user data only: profiles, vehicles, service_records.
-- Components / faults / OEM catalog stay static in the app (shared reference data).
-- Row Level Security enforces that a user can only ever touch their own rows.

-- ---------------------------------------------------------------------------
-- profiles : one row per auth user, created automatically on signup.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  units        text not null default 'imperial', -- app shows miles via fmtMiles()
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- vehicles : a user's garage (one user -> many vehicles).
-- Mirrors the Vehicle type in lib/types.ts.
-- ---------------------------------------------------------------------------
create table if not exists public.vehicles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  body         text not null default 'boxster', -- BodyType: 'boxster' | 'cayman'
  vin          text,
  model        text,
  year         text,
  engine       text,
  trans        text,
  mileage      integer,
  color_name   text,
  color_hex    text,
  interior_hex text,
  plate        text,
  is_primary   boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists vehicles_user_id_idx on public.vehicles (user_id);

-- ---------------------------------------------------------------------------
-- service_records : maintenance log entries for a vehicle.
-- user_id is denormalized so RLS is a simple auth.uid() = user_id check.
-- ---------------------------------------------------------------------------
create table if not exists public.service_records (
  id          uuid primary key default gen_random_uuid(),
  vehicle_id  uuid not null references public.vehicles (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  date        date not null,
  mileage     integer,
  title       text not null,
  system      text,
  diy         boolean not null default true,
  cost        text,
  items       jsonb not null default '[]'::jsonb, -- string[] of checklist items
  created_at  timestamptz not null default now()
);
create index if not exists service_records_vehicle_id_idx on public.service_records (vehicle_id);
create index if not exists service_records_user_id_idx on public.service_records (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.vehicles        enable row level security;
alter table public.service_records enable row level security;

-- profiles: a user can read/insert/update only their own row.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- vehicles: full CRUD restricted to the owner.
create policy "vehicles_all_own" on public.vehicles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- service_records: full CRUD restricted to the owner.
create policy "service_records_all_own" on public.service_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user signs up.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
