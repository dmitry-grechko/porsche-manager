import type { EnginePart, PartsManifest } from '@/lib/types';

/** The inspectable assemblies available in the X-RAY view. */
export interface XrayAssembly {
  id: 'engine' | 'trans' | 'exhaust';
  label: string;
  /** GLB rendered by <GLBViewer src>. */
  glb: string;
  /** Parts manifest fetched lazily when this assembly is first inspected. */
  manifest: string;
}

export const XRAY_ASSEMBLIES: XrayAssembly[] = [
  { id: 'engine', label: 'Engine', glb: '/models/components/engine.glb', manifest: '/models/components/engine-parts.json' },
  { id: 'trans', label: 'Transaxle', glb: '/models/components/trans.glb', manifest: '/models/components/trans-parts.json' },
  { id: 'exhaust', label: 'Exhaust', glb: '/models/components/exhaust.glb', manifest: '/models/components/exhaust-parts.json' },
];

/**
 * Fetch + cache a parts manifest per assembly. Resolves to [] if the manifest
 * 404s (pipeline hasn't generated it yet) so the viewer just shows no pins.
 */
const cache = new Map<string, Promise<EnginePart[]>>();

export function loadAssemblyParts(manifest: string): Promise<EnginePart[]> {
  let p = cache.get(manifest);
  if (!p) {
    p = fetch(manifest)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => ((d as PartsManifest | null)?.parts ?? []))
      .catch(() => []);
    cache.set(manifest, p);
  }
  return p;
}

/** A part is primary unless explicitly tagged 'sub'. */
export function isPrimary(p: EnginePart): boolean {
  return p.tier !== 'sub';
}

/** Sub-parts whose `parent` points at the given primary id. */
export function childrenOf(parts: EnginePart[], parentId: string): EnginePart[] {
  return parts.filter((p) => p.tier === 'sub' && p.parent === parentId);
}
