'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client. Reads the user's session from cookies and attaches
 * the JWT to every request, so Row Level Security applies automatically.
 * Used by the client-side data layer (lib/db/*) and the magic-link login form.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
