// Rear brake assembly (id 'rbrakes'). 299 mm disc, smaller caliper. Reuses the
// shared makeBrake builder from frontBrake.mjs to demonstrate extensibility.

import { makeBrake } from './frontBrake.mjs';

export const meta = {
  id: 'rbrakes',
  label: 'Rear Brake (299mm)',
  system: 'Brakes',
  node: 'rearBrake',
  hotspot3d: '0 0.7 0',
};

export function build() {
  return makeBrake({ node: 'rearBrake', discR: 0.85, discT: 0.13, pistons: 4 });
}
