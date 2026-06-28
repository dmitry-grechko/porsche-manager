// 7-speed PDK transaxle (id 'trans'). Large brushed-aluminium gearbox casing
// bolted to the rear face of the engine: tapering main case, a big clutch /
// torque-converter bell housing at the engine end, ribbed casting detail, a
// mounting flange, side selector housing and drain/fill plugs.

import { group, box, cyl, torus, at, rot } from '../lib/primitives.mjs';

export const meta = {
  id: 'trans',
  label: 'PDK Transaxle',
  system: 'Transmission',
  node: 'transaxle',
  hotspot3d: '0 0 -1.4',
};

export function build() {
  const trans = group('transaxle');
  const add = (m, p = trans) => { p.add(m); return m; };

  // bell housing (engine end) — large conical/cylindrical alloy mass
  add(rot(at(cyl('bellHousing', 1.35, 1.05, 0.9, 'alu', 32), 0, 0, 1.1), Math.PI / 2, 0, 0));
  // mounting flange ring to engine
  add(rot(at(torus('bellFlange', 1.32, 0.09, 'aluDark', 10, 32), 0, 0, 1.55), 0, 0, 0));

  // main gearbox case — tapering box
  add(at(box('gearCase', 1.7, 1.6, 1.6, 'alu'), 0, -0.05, 0.05));
  // tail taper toward rear
  add(rot(at(cyl('tailCase', 0.55, 0.9, 1.1, 'alu', 24), 0, -0.1, -1.0), Math.PI / 2, 0, 0));
  // final-drive / differential housing (bulge low between the output flanges)
  add(rot(at(cyl('finalDrive', 0.62, 0.62, 0.95, 'alu', 28), 0, -0.42, -0.2), 0, 0, Math.PI / 2));
  add(at(box('rearMount', 0.7, 0.7, 0.4, 'aluDark'), 0, -0.1, -1.6));

  // ribbed casting detail down the case sides
  for (let i = 0; i < 5; i++) {
    const z = 0.7 - i * 0.34;
    add(at(box(`ribR_${i}`, 0.06, 1.3, 0.12, 'aluDark'), 0.88, -0.05, z), trans);
    add(at(box(`ribL_${i}`, 0.06, 1.3, 0.12, 'aluDark'), -0.88, -0.05, z), trans);
  }
  // top ribs
  for (let i = 0; i < 4; i++) {
    add(at(box(`ribTop_${i}`, 1.4, 0.07, 0.1, 'aluDark'), 0, 0.78, 0.55 - i * 0.34), trans);
  }

  // mechatronic / selector housing on top
  add(at(box('selectorHousing', 0.9, 0.45, 0.8, 'aluDark'), 0.1, 0.95, 0.2));
  // mechatronic control connector block on the selector housing
  add(at(box('mechatronic', 0.34, 0.22, 0.4, 'aluDark'), 0.5, 1.08, 0.45));
  // output flanges to driveshafts (sides)
  add(rot(at(cyl('outputFlangeR', 0.28, 0.28, 0.3, 'alu', 20), 1.0, -0.3, -0.2), 0, 0, Math.PI / 2));
  add(rot(at(cyl('outputFlangeL', 0.28, 0.28, 0.3, 'alu', 20), -1.0, -0.3, -0.2), 0, 0, Math.PI / 2));

  // drain & fill plugs
  add(at(cyl('drainPlug', 0.1, 0.1, 0.08, 'aluDark', 12), 0, -0.82, -0.1));
  add(rot(at(cyl('fillPlug', 0.1, 0.1, 0.08, 'aluDark', 12), 0.86, -0.4, -0.3), 0, 0, Math.PI / 2));

  return trans;
}
