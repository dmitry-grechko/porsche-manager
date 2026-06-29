// Suspension & steering (id 'susp'). Authored directly in UNIFIED-SCENE CAR-SPACE
// so the four corners line up with the brakes/driveline (see AXLE in
// components/garage/xray-assemblies.ts): front axle z=+1.5, rear axle z=-1.5,
// half-track x=±0.82, hub centre y=-0.35. Coil springs sit ABOVE the hubs/rotors.
// No brake rotors/calipers here — those belong to the fbrakes/rbrakes assemblies.
//
// Coordinate convention: +Z = front, -Z = rear, +Y = up, +X = right.

import { group, box, cyl, torus, at, rot } from '../lib/primitives.mjs';

export const meta = {
  id: 'susp',
  label: 'Suspension & Steering',
  system: 'Suspension',
  node: 'suspension',
  hotspot3d: '0 0 0',
};

// Shared car-space anchors. TRACK is wide so the corners stack cleanly OUTSIDE
// the driveshafts (≈0.87) and just INSIDE the rotors (≈1.3): driveshaft → susp →
// rotor. FRONT/REAR_Z are 1.58 so that at worldScale 0.95 the wheelbase lands at
// z = ±1.5, matching the brakes' hotspots.
const FRONT_Z = 1.58;
const REAR_Z = -1.58;
const TRACK = 1.1;
const HUB_Y = -0.35;

// Materials (inline specs — no shared-lib edits).
const SPRING = { color: 0xc23535, metalness: 0.55, roughness: 0.42 }; // red coil
const STRUT = { color: 0x8a8d92, metalness: 0.9, roughness: 0.4 };
const SHOCK = { color: 0x6f7377, metalness: 0.85, roughness: 0.45 };
const HUB = { color: 0xbfc3c9, metalness: 0.9, roughness: 0.4 };

// A coil spring as a stack of red tori around a vertical axis. Kept slim so it
// doesn't visually dominate the all-systems view.
function coilSpring(name, x, y, z, { r = 0.09, turns = 5, pitch = 0.07, tube: t = 0.017 } = {}) {
  const g = group(name);
  for (let i = 0; i < turns; i++) {
    g.add(rot(at(torus(`${name}_c${i}`, r, t, SPRING, 8, 16), x, y + i * pitch, z), Math.PI / 2, 0, 0));
  }
  return g;
}

export function build() {
  const susp = group('suspension');
  const add = (m, p = susp) => { p.add(m); return m; };

  // ── FRONT corners: MacPherson strut + coil + shock + lower arm + knuckle ──
  // NOTE: no disc/rotor here — the brake rotor lives in the fbrakes assembly. The
  // wheel-hub/bearing is drawn as a slim upright KNUCKLE, pulled inboard so it
  // doesn't sit on top of (and duplicate) the brake rotor at the wheel corner.
  for (const [side, sx] of [['Left', -1], ['Right', 1]]) {
    const x = sx * TRACK;
    const kx = x; // corner at the wheel line (outboard of the central driveshafts)
    // Wheel hub & bearing → compact steering knuckle/upright (box, not a disc)
    add(at(box(`frontWheelHub${side}`, 0.09, 0.2, 0.1, HUB), kx, HUB_Y, FRONT_Z));
    // Strut body (vertical), from just above the knuckle up to the top mount
    add(at(cyl(`frontStrut${side}`, 0.042, 0.05, 0.58, STRUT, 12), kx, HUB_Y + 0.4, FRONT_Z));
    // Shock absorber (thin piston rod inside the lower strut)
    add(at(cyl(`frontShockAbsorber${side}`, 0.025, 0.025, 0.36, SHOCK, 10), kx, HUB_Y + 0.16, FRONT_Z));
    // Coil spring around the strut — top sits above the rotor line
    add(coilSpring(`frontCoilSpring${side}`, kx, HUB_Y + 0.06, FRONT_Z));
    // Lower control arm — from knuckle inward toward the subframe
    add(rot(at(box(`frontLowerControlArm${side}`, 0.5, 0.045, 0.1, 'cast'), kx * 0.55, HUB_Y - 0.08, FRONT_Z - 0.05), 0, sx * 0.32, 0));
    // ARB drop link (sub) — connects the sway bar to the strut
    add(at(cyl(`frontArbEndLink${side}`, 0.016, 0.016, 0.2, 'steel', 8), kx * 0.95, HUB_Y + 0.04, FRONT_Z - 0.16));
  }
  // Front anti-roll bar — bar across the front
  add(rot(at(cyl('frontAntiRollBar', 0.025, 0.025, TRACK * 1.85, 'steel', 12), 0, HUB_Y - 0.02, FRONT_Z - 0.18), 0, 0, Math.PI / 2));
  // Front subframe / crossmember
  add(at(box('frontSubframe', TRACK * 1.9, 0.08, 0.16, 'castDark'), 0, HUB_Y - 0.14, FRONT_Z - 0.08));

  // ── REAR corners: multilink arm set + coil + shock + knuckle (no rotor) ──
  for (const [side, sx] of [['Left', -1], ['Right', 1]]) {
    const x = sx * TRACK;
    const kx = x; // corner at the wheel line (outboard of the central driveshafts)
    // Wheel carrier / upright → slim box (NOT a disc; rotor lives in rbrakes)
    add(at(box(`rearWheelHub${side}`, 0.09, 0.2, 0.1, HUB), kx, HUB_Y, REAR_Z));
    // Shock absorber (vertical)
    add(at(cyl(`rearShockAbsorber${side}`, 0.03, 0.035, 0.52, SHOCK, 12), kx, HUB_Y + 0.3, REAR_Z));
    // Coil spring (inboard, as on the 981 rear)
    add(coilSpring(`rearCoilSpring${side}`, kx - sx * 0.1, HUB_Y + 0.06, REAR_Z));
    // Multi-link control-arm SET — upper / lower / toe / camber links as a named group
    const arms = group(`rearControlArmSet${side}`);
    add(rot(at(box(`rearArmLower_${side}`, 0.62, 0.05, 0.1, 'cast'), x * 0.62, HUB_Y - 0.05, REAR_Z + 0.02), 0, sx * 0.3, 0), arms);
    add(rot(at(box(`rearArmUpper_${side}`, 0.5, 0.045, 0.08, 'cast'), x * 0.66, HUB_Y + 0.16, REAR_Z + 0.04), 0, sx * 0.28, 0), arms);
    add(rot(at(box(`rearArmToe_${side}`, 0.58, 0.04, 0.07, 'castDark'), x * 0.62, HUB_Y - 0.02, REAR_Z - 0.18), 0, sx * 0.34, 0), arms);
    add(rot(at(box(`rearArmCamber_${side}`, 0.54, 0.04, 0.07, 'castDark'), x * 0.64, HUB_Y + 0.04, REAR_Z + 0.2), 0, sx * 0.3, 0), arms);
    susp.add(arms);
  }
  add(rot(at(cyl('rearAntiRollBar', 0.022, 0.022, TRACK * 1.8, 'steel', 12), 0, HUB_Y + 0.05, REAR_Z + 0.22), 0, 0, Math.PI / 2));
  add(at(box('rearSubframe', TRACK * 1.95, 0.09, 0.5, 'castDark'), 0, HUB_Y - 0.12, REAR_Z));

  // ── Steering (front) ──
  add(rot(at(cyl('steeringRack', 0.035, 0.035, TRACK * 1.7, 'cast', 12), 0, HUB_Y + 0.16, FRONT_Z - 0.2), 0, 0, Math.PI / 2));
  for (const [side, sx] of [['Left', -1], ['Right', 1]]) {
    add(at(cyl(`tieRod${side}`, 0.016, 0.016, 0.3, 'steel', 8), sx * TRACK * 0.78, HUB_Y + 0.05, FRONT_Z - 0.12), susp);
  }
  // Steering column / intermediate shaft up toward the cabin (no wheel — removed)
  add(rot(at(cyl('steeringColumn', 0.02, 0.02, 0.6, 'castDark', 10), -0.34, HUB_Y + 0.4, FRONT_Z - 0.5), 0.7, 0, 0));

  return susp;
}
