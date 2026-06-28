import { VEHICLE, RECORDS } from './data';
import type { Vehicle, ServiceRecord, ServicePlan } from './types';

/**
 * DEMO MODE — when `NEXT_PUBLIC_DEMO_MODE=true`, the app bypasses Supabase
 * entirely: the auth middleware never redirects to login, and the client data
 * layer (lib/db/*) serves in-memory placeholder data instead of hitting the DB.
 * This makes the whole front-end testable with no backend / no account.
 *
 * This module is edge-safe (no 'use client', no browser APIs at import time) so
 * the middleware can read the flag.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const DEMO_EMAIL = 'demo@flatsix.garage';
export const DEMO_TOKEN = 'demo-session-token';
const DEMO_VEHICLE_ID = 'demo-vehicle';

export type DemoVehicle = Vehicle & { id: string; isPrimary: boolean };

interface DemoStore {
  vehicles: DemoVehicle[];
  records: Record<string, ServiceRecord[]>;
  plans: Record<string, ServicePlan[]>;
}

// Lazily seeded, mutable in-memory store (per browser session). CRUD against it
// behaves like a real backend for the lifetime of the tab.
let store: DemoStore | null = null;
export function demoStore(): DemoStore {
  if (!store) {
    store = {
      vehicles: [{ ...VEHICLE, id: DEMO_VEHICLE_ID, isPrimary: true }],
      records: { [DEMO_VEHICLE_ID]: RECORDS.map((r) => ({ ...r })) },
      plans: { [DEMO_VEHICLE_ID]: [] },
    };
  }
  return store;
}

export function demoId(prefix = 'demo'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
