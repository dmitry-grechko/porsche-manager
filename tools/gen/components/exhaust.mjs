// Exhaust & sport system (id 'exhaust'). Tubular headers from each bank (3 runners
// per side) merge into collectors, into catalytic converters, then pipes back to
// two rear mufflers with twin tailpipe tips. Titanium/steel palette.

import { group, box, cyl, tube, at, rot } from '../lib/primitives.mjs';

export const meta = {
  id: 'exhaust',
  label: 'Exhaust & Sport System',
  system: 'Exhaust',
  node: 'exhaust',
  hotspot3d: '0 -0.6 -1.6',
};

export function build() {
  const exhaust = group('exhaust');
  const add = (m, p = exhaust) => { p.add(m); return m; };

  function bankSide(dir, side) {
    const g = group(`headerBank_${side}`);
    // three primary runners merging downward to a collector
    for (let i = 0; i < 3; i++) {
      const z = (i - 1) * 0.55;
      add(tube(`primary_${side}_${i}`, [
        [dir * 1.5, 0.4, z],
        [dir * 1.55, 0.0, z * 0.7],
        [dir * 1.2, -0.4, -0.1],
        [dir * 0.95, -0.6, -0.6],
      ], 0.085, 'exhaust', 20, 10), g);
    }
    // collector
    add(rot(at(cyl(`collector_${side}`, 0.16, 0.2, 0.7, 'exhaust', 20), dir * 0.95, -0.75, -0.9), Math.PI / 2.3, 0, 0), g);
    // catalytic converter (boxy bright canister)
    add(rot(at(cyl(`cat_${side}`, 0.22, 0.22, 0.85, 'exhaustC', 20), dir * 0.8, -0.95, -1.5), Math.PI / 2.1, 0, 0), g);
    exhaust.add(g);
  }
  bankSide(1, 'R');
  bankSide(-1, 'L');

  // mid pipes back to mufflers
  for (const [dir, side] of [[1, 'R'], [-1, 'L']]) {
    add(tube(`midpipe_${side}`, [
      [dir * 0.8, -1.05, -1.9],
      [dir * 0.7, -1.1, -2.3],
      [dir * 0.6, -1.1, -2.7],
    ], 0.1, 'exhaustD', 16, 10));
  }

  // two rear mufflers
  for (const [dir, side] of [[1, 'R'], [-1, 'L']]) {
    add(rot(at(cyl(`muffler_${side}`, 0.4, 0.4, 0.9, 'exhaustD', 24), dir * 0.6, -1.1, -3.2), Math.PI / 2, 0, 0));
    // twin tailpipe tips per side
    for (let t = 0; t < 2; t++) {
      add(rot(at(cyl(`tip_${side}_${t}`, 0.13, 0.13, 0.4, 'exhaustC', 18), dir * (0.45 + t * 0.3), -1.0, -3.75), Math.PI / 2, 0, 0));
    }
  }

  // PSE valve actuator box on a muffler
  add(at(box('pseValve', 0.22, 0.2, 0.25, 'exhaustD'), 0.6, -0.75, -3.2));

  // rubber mounting hangers that suspend the system from the body
  for (const [dir, side] of [[1, 'R'], [-1, 'L']]) {
    add(at(box(`hanger_${side}`, 0.08, 0.28, 0.1, 'exhaustD'), dir * 0.6, -0.78, -2.6));
  }

  return exhaust;
}
