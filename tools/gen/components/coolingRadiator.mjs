// Front radiator + condenser stack (id 'cooling'). Dark finned core between two
// alloy end tanks, an A/C condenser layered in front, inlet/outlet hose stubs,
// and a cooling fan shroud behind. Dark core + alloy tank palette.

import { group, box, cyl, at, rot } from '../lib/primitives.mjs';

export const meta = {
  id: 'cooling',
  label: 'Front Radiator & Condenser',
  system: 'Cooling',
  node: 'coolingRadiator',
  hotspot3d: '0 0 0',
};

export function build() {
  const rad = group('coolingRadiator');
  const add = (m, p = rad) => { p.add(m); return m; };

  // radiator core (dark)
  add(at(box('radCore', 2.4, 1.4, 0.18, 'core'), 0, 0, 0));
  // fin striations on core face
  for (let i = 0; i < 18; i++) {
    add(at(box(`fin_${i}`, 0.02, 1.3, 0.2, 'tank'), -1.15 + i * 0.135, 0, 0.01), rad);
  }
  // alloy end tanks (top/bottom)
  add(at(box('tankTop', 2.5, 0.22, 0.26, 'tank'), 0, 0.78, 0));
  add(at(box('tankBottom', 2.5, 0.22, 0.26, 'tank'), 0, -0.78, 0));

  // A/C condenser layered in front
  add(at(box('condenser', 2.2, 1.2, 0.1, 'plastic'), 0, 0, 0.22));

  // fan shroud + fan behind
  add(at(box('fanShroud', 1.4, 1.4, 0.16, 'plastic'), 0.4, 0, -0.2));
  add(rot(at(cyl('fanHub', 0.18, 0.18, 0.22, 'cover', 16), 0.4, 0, -0.32), Math.PI / 2, 0, 0));
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    add(rot(at(box(`fanBlade_${i}`, 0.5, 0.14, 0.04, 'cover'), 0.4 + Math.cos(a) * 0.4, Math.sin(a) * 0.4, -0.32), 0, 0, a), rad);
  }

  // inlet / outlet hose stubs
  add(rot(at(cyl('hoseInlet', 0.13, 0.13, 0.4, 'hose', 14), 1.0, 0.78, 0.1), Math.PI / 2, 0, 0));
  add(rot(at(cyl('hoseOutlet', 0.13, 0.13, 0.4, 'hose', 14), -1.0, -0.78, 0.1), Math.PI / 2, 0, 0));

  return rad;
}
