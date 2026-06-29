import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { DEMO_MODE } from '@/lib/demo';
import { ADMIN_EMAIL, isAdminEmail, type AdminOverview, type AdminUser } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// Placeholder data so the panel is fully testable in demo mode (no DB/auth).
function demoOverview(): AdminOverview {
  const users: AdminUser[] = [
    { email: ADMIN_EMAIL, joined: '2026-06-18', vehicleCount: 1, vehicles: ['Boxster S (981)'] },
    { email: 'alex.driver@example.com', joined: '2026-06-21', vehicleCount: 1, vehicles: ['Cayman S (981)'] },
    { email: 'sam@example.com', joined: '2026-06-24', vehicleCount: 2, vehicles: ['Boxster GTS (981)', 'Cayman GT4'] },
    { email: 'newbie@example.com', joined: '2026-06-27', vehicleCount: 0, vehicles: [] },
  ];
  return {
    totalUsers: users.length,
    usersWithCar: users.filter((u) => u.vehicleCount > 0).length,
    totalVehicles: users.reduce((n, u) => n + u.vehicleCount, 0),
    users,
    demo: true,
  };
}

export async function GET() {
  if (DEMO_MODE) return NextResponse.json(demoOverview());

  // 1) Verify the caller is the admin, using their own session.
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2) Read across ALL users with the service-role key (bypasses RLS).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server.' },
      { status: 500 },
    );
  }
  const admin = createServiceClient(url, serviceKey, { auth: { persistSession: false } });

  const [{ data: profiles, error: pErr }, { data: vehicles, error: vErr }] = await Promise.all([
    admin.from('profiles').select('id, display_name, created_at').order('created_at', { ascending: true }),
    admin.from('vehicles').select('user_id, model'),
  ]);
  if (pErr || vErr) {
    return NextResponse.json({ error: (pErr ?? vErr)?.message ?? 'Query failed' }, { status: 500 });
  }

  const byUser = new Map<string, string[]>();
  for (const v of vehicles ?? []) {
    const list = byUser.get(v.user_id) ?? [];
    list.push(v.model || 'Vehicle');
    byUser.set(v.user_id, list);
  }

  const users: AdminUser[] = (profiles ?? []).map((p) => {
    const models = byUser.get(p.id) ?? [];
    return {
      email: p.display_name ?? '(unknown)',     // profiles.display_name is seeded with the signup email
      joined: p.created_at,
      vehicleCount: models.length,
      vehicles: models,
    };
  });

  const overview: AdminOverview = {
    totalUsers: users.length,
    usersWithCar: users.filter((u) => u.vehicleCount > 0).length,
    totalVehicles: (vehicles ?? []).length,
    users,
  };
  return NextResponse.json(overview);
}
