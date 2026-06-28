// Front brake assembly (id 'fbrakes'). 315 mm vented steel disc with drilled
// face + alloy hat, a red 4-pot fixed monobloc caliper straddling the disc,
// and brake pads. Reusable for rear brakes via opts (smaller disc, sliding caliper).

import { group, box, cyl, at, rot, THREE } from '../lib/primitives.mjs';

export function makeBrake(opts) {
  const {
    node = 'frontBrake',
    discR = 1.0,
    discT = 0.16,
    pistons = 4,
    bolts = 10,
  } = opts || {};

  const brake = group(node);
  const add = (m, p = brake) => { p.add(m); return m; };

  // vented disc: two faces + a ring of vane gap implied by thickness
  add(rot(at(cyl('disc', discR, discR, discT, 'disc', 40), 0, 0, 0), 0, 0, Math.PI / 2));
  // alloy hat (center bell)
  add(rot(at(cyl('hat', discR * 0.42, discR * 0.42, discT + 0.12, 'hat', 28), 0, 0, 0), 0, 0, Math.PI / 2));
  // wheel-bolt holes hint: small studs around the hat
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    add(rot(at(cyl(`stud_${i}`, 0.05, 0.05, discT + 0.18, 'steel', 10),
      Math.cos(a) * discR * 0.28, Math.sin(a) * discR * 0.28, 0), 0, 0, Math.PI / 2));
  }
  // drilled holes ring (cosmetic dimples)
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    add(rot(at(cyl(`drill_${i}`, 0.04, 0.04, discT + 0.02, 'cover', 8),
      Math.cos(a) * discR * 0.72, Math.sin(a) * discR * 0.72, 0), 0, 0, Math.PI / 2));
  }

  // caliper: red body straddling top of disc (an arch over the rim)
  const cal = group('caliper');
  add(at(box('caliperOuter', 0.34, 0.7, 0.9, 'caliper'), discT / 2 + 0.18, discR * 0.78, 0), cal);
  add(at(box('caliperInner', 0.34, 0.7, 0.9, 'caliper'), -(discT / 2 + 0.18), discR * 0.78, 0), cal);
  add(at(box('caliperBridge', 0.05, 0.5, 0.9, 'caliper'), 0, discR * 0.95, 0), cal);
  // pistons
  for (let i = 0; i < pistons / 2; i++) {
    const z = (i - (pistons / 2 - 1) / 2) * 0.42;
    add(rot(at(cyl(`pistonO_${i}`, 0.1, 0.1, 0.12, 'steel', 14), discT / 2 + 0.05, discR * 0.78, z), 0, 0, Math.PI / 2), cal);
    add(rot(at(cyl(`pistonI_${i}`, 0.1, 0.1, 0.12, 'steel', 14), -(discT / 2 + 0.05), discR * 0.78, z), 0, 0, Math.PI / 2), cal);
  }
  brake.add(cal);

  // pads (dark) between caliper halves
  add(at(box('padOuter', 0.04, 0.45, 0.8, 'pad'), discT / 2 + 0.03, discR * 0.78, 0));
  add(at(box('padInner', 0.04, 0.45, 0.8, 'pad'), -(discT / 2 + 0.03), discR * 0.78, 0));

  return brake;
}

export const meta = {
  id: 'fbrakes',
  label: 'Front Brake (315mm)',
  system: 'Brakes',
  node: 'frontBrake',
  hotspot3d: '0 0.78 0',
};

export function build() {
  return makeBrake({ node: 'frontBrake', discR: 1.0, pistons: 4 });
}
