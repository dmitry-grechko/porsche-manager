/**
 * Small client-side id generator for jsonb array rows (plan items, etc.).
 * crypto.randomUUID where available, otherwise a timestamp+counter fallback.
 * These ids only need to be stable within a document, not globally unique.
 */
let counter = 0;

export function uid(prefix = 'it'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}
