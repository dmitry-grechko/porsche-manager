/** The single account allowed to see the admin usage panel. */
export const ADMIN_EMAIL = 'grechkoda@gmail.com';

export function isAdminEmail(email?: string | null): boolean {
  return !!email && email.trim().toLowerCase() === ADMIN_EMAIL;
}

// ---- Admin overview shape (returned by /api/admin/overview, rendered by AdminPanel) ----
export interface AdminUser {
  email: string;
  joined: string;        // ISO date
  vehicleCount: number;
  vehicles: string[];    // model names
}

export interface AdminOverview {
  totalUsers: number;
  usersWithCar: number;
  totalVehicles: number;
  users: AdminUser[];
  /** true when served from demo placeholder data rather than the real DB. */
  demo?: boolean;
}
