// Driveline (id 'driveline'). Rear-drive half-shaft / CV-joint / mount assembly
// for the mid-engine RWD 981, authored in UNIFIED-SCENE CAR-SPACE so it lines up
// with the brakes & suspension. The drivetrain leads from the engine/transaxle
// (rear-centre) OUTWARD through the half-shafts to just inside the suspension —
// forming the clean radial stack: driveshaft → suspension → rotor.
//
// Coordinate convention: +Z = front, -Z = rear, +Y = up, +X = right.
// Renders NO tires/rims/wheels — and (per request) NO front/rear wheel flanges.

import { group, box, cyl, sphere, at, rot } from '../lib/primitives.mjs';

export const meta = {
  id: 'driveline',
  label: 'Driveline',
  system: 'Transmission',
  node: 'driveline',
  hotspot3d: '0 0 0',
};

const REAR_Z = -1.58;       // ×0.95 worldScale → z = -1.5 (rear axle, matches brakes/susp)
const HUB_Y = -0.35;
const HALF_OUTER = 0.92;    // ×0.95 → world ≈ 0.87 — INSIDE the suspension (≈1.05)
const HALF_INNER = 0.18;

const SHAFT = { color: 0x8a8d92, metalness: 0.95, roughness: 0.3 };
const JOINT = { color: 0xbfc3c9, metalness: 0.9, roughness: 0.4 };

export function build() {
  const driveline = group('driveline');
  const add = (m, p = driveline) => { p.add(m); return m; };

  // Engine→PDK adapter / bellhousing interface (between engine and transaxle)
  add(rot(at(cyl('engineToPdkAdapter', 0.34, 0.34, 0.12, JOINT, 24), 0, HUB_Y + 0.18, -1.1), Math.PI / 2, 0, 0));

  // Engine mounts (hydraulic rubber) — left & right of the engine/transaxle
  const mounts = group('engineMounts');
  for (const sx of [-1, 1]) {
    add(at(box(`engMountBracket_${sx < 0 ? 'L' : 'R'}`, 0.16, 0.1, 0.14, 'cast'), sx * 0.55, HUB_Y + 0.1, -1.0), mounts);
    add(at(cyl(`engMountRubber_${sx < 0 ? 'L' : 'R'}`, 0.06, 0.06, 0.1, 'rubber', 12), sx * 0.55, HUB_Y - 0.02, -1.0), mounts);
  }
  driveline.add(mounts);

  // PDK / transmission rear mount
  add(at(box('pdkTransmissionMount', 0.3, 0.14, 0.18, 'cast'), 0, HUB_Y - 0.1, -1.9));
  add(at(cyl('pdkMountRubber', 0.07, 0.07, 0.12, 'rubber', 12), 0, HUB_Y - 0.22, -1.9));

  // Central differential nose / output housing where the shafts meet
  add(rot(at(cyl('diffOutput', 0.12, 0.12, 0.22, JOINT, 18), 0, HUB_Y, REAR_Z), 0, 0, Math.PI / 2));

  // Rear half-shafts: from the differential out toward the suspension/hub line.
  for (const sx of [-1, 1]) {
    const tag = sx < 0 ? 'L' : 'R';
    const mid = sx * (HALF_INNER + HALF_OUTER) / 2;
    add(rot(at(cyl(`rearHalfShaft_${tag}`, 0.03, 0.03, HALF_OUTER - HALF_INNER, SHAFT, 10), mid, HUB_Y, REAR_Z), 0, 0, Math.PI / 2));
    add(at(sphere(`innerCV_${tag}`, 0.07, JOINT, 12), sx * HALF_INNER, HUB_Y, REAR_Z));   // inner CV (by diff)
    add(at(sphere(`outerCV_${tag}`, 0.06, JOINT, 12), sx * HALF_OUTER, HUB_Y, REAR_Z));   // outer CV (feeds the hub)
  }

  // Lug bolts: 5-bolt circle at the right rear outer-CV/hub face (no wheel drawn)
  const lugs = group('lugBolts');
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    add(rot(at(cyl(`lug_${i}`, 0.016, 0.016, 0.1, 'bolt', 8),
      HALF_OUTER + 0.04, HUB_Y + Math.sin(a) * 0.06, REAR_Z + Math.cos(a) * 0.06), 0, 0, Math.PI / 2), lugs);
  }
  driveline.add(lugs);

  return driveline;
}
