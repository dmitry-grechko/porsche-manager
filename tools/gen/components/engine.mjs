// 981 MA1 3.4L water-cooled flat-six (MA1.21) — FULL PART COVERAGE BUILD.
// Every major assembly-level component is a distinctly-named, individually-
// selectable node (or a named group with named sub-parts), so the app can place
// clickable hotspots and isolate/highlight a part OR a whole assembly.
//
// Right-hand coords, viewed from above / 3-4 front:
//   X = bank spread (the two opposed banks of 3 cylinders sit at +X / -X)
//   Y = up
//   Z = fore/aft; +Z is the FRONT accessory face (crank pulley, alternator, belt);
//       -Z is the REAR where the transaxle bellhousing bolts on.
//
// TOP-LEVEL ASSEMBLY GROUPS (each a named sub-group; targetable as an assembly,
// with individually-named children targetable as sub-parts):
//   structure       crankcase, cylinder heads L/R, sump/oil pan, motor mounts,
//                   starter motor, bellhousing
//   rotating        crankshaft, pistons (x6 group), connecting rods (group),
//                   crank pulley / vibration damper, flywheel
//   valvetrain      cam covers L/R, intake + exhaust camshafts, timing chain +
//                   tensioner, VarioCam actuator
//   induction       intake manifold/plenum, throttle body, MAF sensor, AOS
//   fuelIgnition    fuel rail, injectors (group of 6), coil packs (group of 6),
//                   spark plugs (group of 6)
//   accessoryDrive  alternator, A/C compressor, water pump, serpentine belt,
//                   tensioner pulley, idler pulley
//   lubeCooling     oil filter housing, oil filler neck, oil pump, thermostat
//                   housing, coolant unions/hoses
// Water-cooled: NO cooling fins, NO central fan.

import {
  group, box, roundBox, cyl, cylArc, capsule, lathe, tube, torus, torusArc, sphere, at, rot,
} from '../lib/primitives.mjs';

export const meta = {
  id: 'engine',
  label: '3.4L Flat-Six (MA1)',
  system: 'Engine',
  node: 'engine',
  hotspot3d: '0 1.2 0',
};

const HALF_PI = Math.PI / 2;

export function build() {
  const engine = group('engine');
  // add(mesh, parent) — defaults parent to engine root.
  const add = (m, p = engine) => { p.add(m); return m; };

  // ====================================================================
  // STRUCTURE — crankcase, cylinder heads L/R, sump/oil pan, motor mounts,
  // starter motor, transaxle bellhousing. The RIGHT side of the case is left
  // partially open (cutaway) so the bores / piston crowns inside read.
  // ====================================================================
  const structure = group('structure');

  // ---- crankcase
  const crankcase = group('crankcase');
  add(roundBox('crankcaseMain', 3.0, 1.7, 2.35, 'block'), crankcase);
  add(at(box('crankcaseSeam', 3.04, 0.14, 2.4, 'castDark'), 0, 0, 0), crankcase);
  add(at(box('crankcaseWebFront', 2.9, 1.4, 0.1, 'castDark'), 0, 0, 1.2), crankcase);
  add(at(box('crankcaseWebRear', 2.9, 1.4, 0.1, 'castDark'), 0, 0, -1.2), crankcase);
  for (const zz of [-0.9, -0.3, 0.3, 0.9]) {
    for (const s of [1, -1]) {
      add(rot(at(cyl(`caseBolt_${s > 0 ? 'R' : 'L'}_${zz}`, 0.07, 0.07, 0.14, 'bolt', 10), s * 1.52, 0, zz), 0, 0, HALF_PI), crankcase);
    }
  }
  // cutaway bores on the RIGHT bank (open shells so we see inside)
  for (let i = 0; i < 3; i++) {
    const z = (i - 1) * 0.72;
    add(rot(at(cylArc(`bore_${i}`, 0.36, 0.36, 0.95, 'bore', 28, Math.PI * 0.35, Math.PI * 1.5, true), 1.18, 0.1, z), 0, 0, HALF_PI), crankcase);
  }
  structure.add(crankcase);

  // ---- sump / oil pan (own node) + drain plug + ribs
  const sump = group('sump');
  add(at(roundBox('oilPan', 2.4, 0.75, 1.9, 'cast'), 0, -1.05, 0), sump);
  for (let i = 0; i < 5; i++) {
    add(at(box(`sumpRib_${i}`, 0.06, 0.6, 1.85, 'castDark'), -0.9 + i * 0.45, -1.05, 0), sump);
  }
  add(at(cyl('oilDrainPlug', 0.1, 0.1, 0.16, 'bolt', 12), 0.7, -1.45, 0.35), sump);
  structure.add(sump);

  // ---- cylinder heads (one per bank), each a targetable node
  function makeHead(dir, side) {
    const head = group(`cylHead_${side}`);
    add(at(roundBox(`headCasting_${side}`, 1.0, 1.2, 2.25, 'block'), dir * 1.35, 0.05, 0), head);
    add(at(box(`headDeck_${side}`, 0.3, 1.1, 2.2, 'castDark'), dir * 1.85, 0.05, 0), head); // outboard deck
    for (let i = 0; i < 3; i++) {
      const z = (i - 1) * 0.72;
      add(rot(at(cyl(`portBoss_${side}_${i}`, 0.2, 0.2, 0.35, 'block', 14), dir * 1.95, 0.35, z), 0, 0, HALF_PI), head);
    }
    structure.add(head);
  }
  makeHead(1, 'R');
  makeHead(-1, 'L');

  // ---- motor mounts (one each side) + rubber bushings
  const mounts = group('motorMounts');
  for (const s of [1, -1]) {
    const sk = s > 0 ? 'R' : 'L';
    const mount = group(`motorMount_${sk}`);
    add(at(roundBox(`motorMountLug_${sk}`, 0.42, 0.45, 0.55, 'cast'), s * 1.7, -0.75, -0.4), mount);
    add(rot(at(cyl(`motorMountBush_${sk}`, 0.17, 0.17, 0.36, 'damper', 16), s * 2.0, -0.75, -0.4), 0, 0, HALF_PI), mount);
    add(rot(at(cyl(`motorMountBolt_${sk}`, 0.05, 0.05, 0.42, 'bolt', 10), s * 2.0, -0.75, -0.4), 0, 0, HALF_PI), mount);
    mounts.add(mount);
  }
  structure.add(mounts);

  // ---- transaxle bellhousing (rear) + starter motor
  const bell = group('bellhousing');
  add(rot(at(cyl('bellTaper', 1.0, 1.5, 1.1, 'cast', 32), 0, -0.1, -1.85), HALF_PI, 0, 0), bell);
  add(rot(at(cyl('bellSnout', 0.55, 0.55, 0.5, 'castDark', 24), 0, -0.1, -2.55), HALF_PI, 0, 0), bell);
  add(rot(at(torus('bellFlange', 1.45, 0.08, 'cast', 12, 40), 0, -0.1, -1.32), HALF_PI, 0, 0), bell);
  for (let b = 0; b < 12; b++) {
    const a = (b / 12) * Math.PI * 2;
    add(at(cyl(`bellBolt_${b}`, 0.045, 0.045, 0.12, 'bolt', 8),
      Math.cos(a) * 1.42, -0.1 + Math.sin(a) * 1.42, -1.32), bell);
  }
  for (let r = 0; r < 12; r++) {
    const a = (r / 12) * Math.PI * 2;
    add(rot(at(box(`bellRib_${r}`, 0.05, 0.1, 1.0, 'castDark'),
      Math.cos(a) * 1.15, -0.1 + Math.sin(a) * 1.15, -1.85), 0, 0, a), bell);
  }
  structure.add(bell);

  const starterMotor = group('starterMotor');
  add(rot(at(cyl('starterBody', 0.22, 0.22, 0.6, 'cast', 18), 1.1, -0.5, -1.7), HALF_PI, 0, 0), starterMotor);
  add(rot(at(cyl('starterNose', 0.14, 0.14, 0.25, 'castDark', 14), 1.1, -0.5, -1.35), HALF_PI, 0, 0), starterMotor);
  add(rot(at(cyl('starterSolenoid', 0.1, 0.1, 0.4, 'cast', 12), 1.1, -0.28, -1.7), HALF_PI, 0, 0), starterMotor);
  structure.add(starterMotor);

  engine.add(structure);

  // ====================================================================
  // ROTATING ASSEMBLY — crankshaft, pistons (x6 group), connecting rods
  // (group), crank pulley / vibration damper, flywheel.
  // ====================================================================
  const rotating = group('rotating');

  // ---- crankshaft: main journal shaft with counterweight discs along it
  const crankshaft = group('crankshaft');
  add(rot(at(cyl('crankMainShaft', 0.16, 0.16, 2.2, 'steel', 18), 0, 0, 0), HALF_PI, 0, 0), crankshaft);
  for (let i = 0; i < 4; i++) {
    const z = -0.9 + i * 0.6;
    add(rot(at(cyl(`crankWeb_${i}`, 0.34, 0.34, 0.12, 'steel', 20), 0, 0, z), HALF_PI, 0, 0), crankshaft);
  }
  for (let i = 0; i < 3; i++) {
    const z = (i - 1) * 0.72;
    add(rot(at(cyl(`crankPin_${i}`, 0.12, 0.12, 0.2, 'steel', 14), 0.18, 0, z), HALF_PI, 0, 0), crankshaft);
  }
  rotating.add(crankshaft);

  // ---- pistons (group of 6: 3 per bank). Short cylinder crown + wrist pin.
  const pistons = group('pistons');
  for (const s of [1, -1]) {
    const sk = s > 0 ? 'R' : 'L';
    for (let i = 0; i < 3; i++) {
      const z = (i - 1) * 0.72;
      const px = s * 1.0;
      add(rot(at(cyl(`piston_${sk}_${i}`, 0.34, 0.34, 0.3, 'piston', 24), px, 0.1, z), 0, 0, HALF_PI), pistons);
      add(rot(at(cyl(`pistonPin_${sk}_${i}`, 0.06, 0.06, 0.4, 'steel', 10), px - 0.18, 0.1, z), HALF_PI, 0, 0), pistons);
    }
  }
  rotating.add(pistons);

  // ---- connecting rods (group of 6): I-beam stub from pin to crank
  const conRods = group('conRods');
  for (const s of [1, -1]) {
    const sk = s > 0 ? 'R' : 'L';
    for (let i = 0; i < 3; i++) {
      const z = (i - 1) * 0.72;
      add(rot(at(box(`conRod_${sk}_${i}`, 0.55, 0.13, 0.09, 'steel'), s * 0.6, 0.05, z), 0, 0, s * 0.25), conRods);
      add(rot(at(torus(`conRodBigEnd_${sk}_${i}`, 0.13, 0.05, 'steel', 8, 16), s * 0.3, 0.0, z), 0, HALF_PI, 0), conRods);
    }
  }
  rotating.add(conRods);

  // ---- crank pulley / vibration damper (front face)
  const crankPulleyG = group('crankPulley');
  const FZ = 1.32;
  const crankC = [0, -0.5];
  const pulley = lathe('crankPulleyDisc', [
    [0.16, -0.16], [0.16, -0.12], [0.5, -0.12], [0.5, -0.06],
    [0.46, -0.02], [0.5, 0.02], [0.46, 0.06], [0.5, 0.1],
    [0.5, 0.13], [0.16, 0.13], [0.16, 0.16],
  ], 'polished', 36);
  add(rot(at(pulley, crankC[0], crankC[1], FZ), HALF_PI, 0, 0), crankPulleyG);
  add(rot(at(torus('crankDamperRing', 0.42, 0.07, 'damper', 12, 40), crankC[0], crankC[1], FZ), 0, 0, 0), crankPulleyG);
  add(rot(at(cyl('crankHubCap', 0.18, 0.18, 0.2, 'polished', 20), crankC[0], crankC[1], FZ + 0.05), HALF_PI, 0, 0), crankPulleyG);
  for (let b = 0; b < 8; b++) {
    const a = (b / 8) * Math.PI * 2;
    add(rot(at(cyl(`crankBolt_${b}`, 0.035, 0.035, 0.1, 'bolt', 8),
      crankC[0] + Math.cos(a) * 0.28, crankC[1] + Math.sin(a) * 0.28, FZ + 0.16), HALF_PI, 0, 0), crankPulleyG);
  }
  rotating.add(crankPulleyG);

  // ---- flywheel (rear, between crank rear and bellhousing) + ring gear teeth
  const flywheel = group('flywheel');
  add(rot(at(cyl('flywheelDisc', 0.78, 0.78, 0.16, 'steel', 36), 0, 0, -1.18), HALF_PI, 0, 0), flywheel);
  add(rot(at(torus('flywheelRingGear', 0.8, 0.06, 'cast', 12, 48), 0, 0, -1.18), 0, 0, 0), flywheel);
  add(rot(at(cyl('flywheelHub', 0.2, 0.2, 0.22, 'castDark', 18), 0, 0, -1.12), HALF_PI, 0, 0), flywheel);
  rotating.add(flywheel);

  engine.add(rotating);

  // ====================================================================
  // VALVETRAIN — cam covers L/R, intake + exhaust camshafts (per bank),
  // timing chain + tensioner, VarioCam actuator.
  // ====================================================================
  const valvetrain = group('valvetrain');

  // ---- cam covers (one per bank), each a targetable node
  function makeCamCover(dir, side) {
    const cover = group(`camCover_${side}`);
    add(at(roundBox(`camCoverBody_${side}`, 1.0, 0.55, 2.2, 'cover'), dir * 1.7, 0.62, 0), cover);
    add(at(roundBox(`camCoverCrown_${side}`, 0.66, 0.2, 2.12, 'cover'), dir * 1.7, 0.95, 0), cover);
    for (let r = 0; r < 4; r++) {
      add(at(box(`camRib_${side}_${r}`, 0.9, 0.05, 2.14, 'cover'), dir * 1.7, 0.85 - r * 0.12, 0), cover);
    }
    for (const zz of [-0.95, -0.32, 0.32, 0.95]) {
      add(rot(at(cyl(`camBolt_${side}_${zz}`, 0.06, 0.06, 0.14, 'bolt', 10), dir * 2.2, 0.62, zz), 0, 0, HALF_PI), cover);
    }
    valvetrain.add(cover);
  }
  makeCamCover(1, 'R');
  makeCamCover(-1, 'L');

  // ---- camshafts: per bank an intake + exhaust shaft with lobe discs.
  // Grouped so we can target camshaft_intake / camshaft_exhaust as assemblies.
  const camIntake = group('camshaft_intake');
  const camExhaust = group('camshaft_exhaust');
  function makeCam(parent, name, dir, yOff) {
    add(rot(at(cyl(`${name}Shaft`, 0.07, 0.07, 2.1, 'steel', 14), dir * 1.7, 0.55 + yOff, 0), HALF_PI, 0, 0), parent);
    for (let i = 0; i < 6; i++) {
      const z = -0.9 + i * 0.36;
      add(rot(at(cyl(`${name}Lobe_${i}`, 0.11, 0.11, 0.07, 'steel', 12), dir * 1.7, 0.55 + yOff, z), HALF_PI, 0, 0), parent);
    }
  }
  makeCam(camIntake, 'camIntake_R', 1, 0.12);
  makeCam(camIntake, 'camIntake_L', -1, 0.12);
  makeCam(camExhaust, 'camExhaust_R', 1, -0.05);
  makeCam(camExhaust, 'camExhaust_L', -1, -0.05);
  valvetrain.add(camIntake);
  valvetrain.add(camExhaust);

  // ---- timing chain (front, loops between crank sprocket and cam sprockets) +
  // tensioner. Drawn as a closed tube loop with sprocket discs.
  const timing = group('timingChain');
  add(rot(at(cyl('crankSprocket', 0.18, 0.18, 0.08, 'steel', 24), 0, 0, 1.0), HALF_PI, 0, 0), timing);
  for (const s of [1, -1]) {
    const sk = s > 0 ? 'R' : 'L';
    add(rot(at(cyl(`camSprocket_${sk}`, 0.16, 0.16, 0.08, 'steel', 24), s * 1.7, 0.6, 1.0), HALF_PI, 0, 0), timing);
    // chain run from crank up to this bank's cam sprocket (closed loop)
    add(tube(`timingChainLoop_${sk}`, [
      [0, 0.18, 1.05], [s * 0.6, 0.4, 1.05], [s * 1.7, 0.76, 1.05],
      [s * 1.86, 0.6, 1.05], [s * 1.7, 0.44, 1.05], [s * 0.5, 0.0, 1.05],
      [0, -0.18, 1.05], [0, 0.0, 1.05],
    ], 0.035, 'damper', 60, 8, true), timing);
  }
  const tensioner = group('timingChainTensioner');
  for (const s of [1, -1]) {
    const sk = s > 0 ? 'R' : 'L';
    add(rot(at(cyl(`chainTensionerBody_${sk}`, 0.09, 0.09, 0.34, 'cast', 14), s * 0.95, 0.3, 1.05), 0, 0, s * 0.5), tensioner);
    add(rot(at(box(`chainTensionerShoe_${sk}`, 0.5, 0.06, 0.08, 'cover'), s * 1.1, 0.45, 1.05), 0, 0, s * 0.6), tensioner);
  }
  timing.add(tensioner);
  valvetrain.add(timing);

  // ---- VarioCam actuator (cam-phasing solenoid on each cover front)
  const varioCam = group('varioCamActuator');
  for (const s of [1, -1]) {
    const sk = s > 0 ? 'R' : 'L';
    add(rot(at(cyl(`varioCamSolenoid_${sk}`, 0.13, 0.13, 0.32, 'cover', 16), s * 1.7, 0.7, 1.15), HALF_PI, 0, 0), varioCam);
    add(rot(at(cyl(`varioCamConnector_${sk}`, 0.07, 0.07, 0.14, 'damper', 10), s * 1.7, 0.9, 1.18), HALF_PI, 0, 0), varioCam);
  }
  valvetrain.add(varioCam);

  engine.add(valvetrain);

  // ====================================================================
  // INDUCTION — intake manifold/plenum, throttle body, MAF sensor, AOS.
  // ====================================================================
  const induction = group('induction');

  // ---- intake manifold (central distribution box + twin curved bridge tubes +
  // outboard plenum caps + runner stubs)
  const intakeManifold = group('intakeManifold');
  add(at(roundBox('plenumBox', 0.95, 0.7, 0.95, 'plenum'), 0, 1.85, 0.1), intakeManifold);
  add(at(roundBox('plenumBoxLid', 0.8, 0.16, 0.8, 'plenum'), 0, 2.22, 0.1), intakeManifold);
  for (const s of [1, -1]) {
    const sk = s > 0 ? 'R' : 'L';
    add(tube(`intakeTube_${sk}`, [
      [s * 0.42, 1.95, 0.1], [s * 0.85, 1.95, 0.1], [s * 1.25, 1.78, 0.1],
      [s * 1.5, 1.5, 0.05], [s * 1.62, 1.2, 0.0],
    ], 0.26, 'plenum', 36, 22), intakeManifold);
    add(rot(at(torus(`tubeClampInner_${sk}`, 0.28, 0.045, 'polished', 10, 28), s * 0.5, 1.95, 0.1), 0, 0, HALF_PI), intakeManifold);
    add(rot(at(torus(`tubeClampOuter_${sk}`, 0.28, 0.045, 'polished', 10, 28), s * 1.6, 1.25, 0.0), 0.5, 0, HALF_PI), intakeManifold);
    add(at(roundBox(`plenumCap_${sk}`, 0.55, 0.85, 2.0, 'plenum'), s * 1.78, 0.95, 0.0), intakeManifold);
    add(at(roundBox(`plenumCapCrown_${sk}`, 0.3, 0.2, 1.7, 'plenum'), s * 1.78, 1.45, 0.0), intakeManifold);
    add(rot(at(box(`porschePlate_${sk}`, 1.5, 0.04, 0.34, 'polished'), s * 2.07, 0.95, 0.0), 0, HALF_PI, 0), intakeManifold);
    for (let i = 0; i < 3; i++) {
      const z = (i - 1) * 0.72;
      add(tube(`runner_${sk}_${i}`, [
        [s * 1.78, 0.55, z], [s * 1.8, 0.35, z], [s * 1.82, 0.12, z],
      ], 0.11, 'plenum', 16, 14), intakeManifold);
      add(rot(at(torus(`runnerClamp_${sk}_${i}`, 0.13, 0.03, 'polished', 8, 20), s * 1.81, 0.18, z), 0, 0, HALF_PI), intakeManifold);
    }
  }
  induction.add(intakeManifold);

  // ---- throttle body (enters the plenum box from the rear) + clamp
  const throttleBody = group('throttleBody');
  add(rot(at(cyl('throttleBodyBore', 0.3, 0.3, 0.6, 'cast', 24), 0, 1.85, -0.55), HALF_PI, 0, 0), throttleBody);
  add(rot(at(torus('throttleClamp', 0.32, 0.04, 'polished', 10, 28), 0, 1.85, -0.28), HALF_PI, 0, 0), throttleBody);
  add(rot(at(cyl('throttleMotor', 0.12, 0.12, 0.22, 'cover', 14), 0.32, 1.85, -0.55), 0, 0, HALF_PI), throttleBody);
  induction.add(throttleBody);

  // ---- intake snorkel + MAF sensor housing on it
  const mafSensor = group('mafSensor');
  add(tube('intakeSnorkel', [
    [0, 1.85, -0.85], [0, 2.05, -1.2], [0.25, 2.2, -1.45], [0.7, 2.25, -1.5],
  ], 0.24, 'plenum', 24, 18), mafSensor);
  add(rot(at(cyl('mafBody', 0.26, 0.26, 0.34, 'cast', 20), 0.45, 2.23, -1.48), 0, 0.5, HALF_PI), mafSensor);
  add(rot(at(box('mafConnector', 0.1, 0.12, 0.14, 'damper'), 0.45, 2.42, -1.48), 0, 0, 0), mafSensor);
  induction.add(mafSensor);

  // ---- air-oil separator (AOS) canister + breather hose
  const aos = group('airOilSeparator');
  add(at(capsule('aosCanister', 0.22, 0.4, 'cover', 18), -1.6, 0.55, -0.7), aos);
  add(tube('aosHose', [
    [-1.6, 0.85, -0.7], [-1.4, 1.1, -0.4], [-0.9, 1.2, 0.0], [-0.3, 1.4, 0.2],
  ], 0.07, 'hose2', 20, 10), aos);
  induction.add(aos);

  engine.add(induction);

  // ====================================================================
  // FUEL & IGNITION — fuel rail, injectors (group of 6), coil packs (group of
  // 6), spark plugs (group of 6).
  // ====================================================================
  const fuelIgnition = group('fuelIgnition');

  // ---- fuel rail (one per bank) + feed line
  const fuelRail = group('fuelRail');
  for (const s of [1, -1]) {
    const sk = s > 0 ? 'R' : 'L';
    add(rot(at(cyl(`fuelRailTube_${sk}`, 0.06, 0.06, 2.0, 'polished', 14), s * 1.5, 0.45, 0), HALF_PI, 0, 0), fuelRail);
  }
  add(tube('fuelFeedLine', [
    [1.5, 0.45, -1.0], [0.9, 0.7, -1.1], [0, 0.8, -1.0], [-1.5, 0.45, -1.0],
  ], 0.04, 'polished', 30, 10), fuelRail);
  fuelIgnition.add(fuelRail);

  // ---- injectors (group of 6): body below the rail into the head
  const injectors = group('injectors');
  for (const s of [1, -1]) {
    const sk = s > 0 ? 'R' : 'L';
    for (let i = 0; i < 3; i++) {
      const z = (i - 1) * 0.72;
      add(rot(at(cyl(`injector_${sk}_${i}`, 0.05, 0.04, 0.3, 'cover', 12), s * 1.5, 0.25, z), 0, 0, 0), injectors);
      add(rot(at(cyl(`injectorConnector_${sk}_${i}`, 0.06, 0.06, 0.1, 'damper', 8), s * 1.5, 0.42, z), 0, 0, 0), injectors);
    }
  }
  fuelIgnition.add(injectors);

  // ---- coil packs (group of 6) + connectors
  const coilPacks = group('coilPacks');
  for (const s of [1, -1]) {
    const sk = s > 0 ? 'R' : 'L';
    for (let i = 0; i < 3; i++) {
      const z = (i - 1) * 0.72;
      add(at(capsule(`coilPack_${sk}_${i}`, 0.16, 0.3, 'cover', 14), s * 1.7, 1.12, z), coilPacks);
      add(at(box(`coilConnector_${sk}_${i}`, 0.13, 0.12, 0.16, 'damper'), s * 1.7, 1.34, z), coilPacks);
    }
  }
  fuelIgnition.add(coilPacks);

  // ---- spark plugs (group of 6): plug stub down into the head
  const sparkPlugs = group('sparkPlugs');
  for (const s of [1, -1]) {
    const sk = s > 0 ? 'R' : 'L';
    for (let i = 0; i < 3; i++) {
      const z = (i - 1) * 0.72;
      add(at(cyl(`sparkPlug_${sk}_${i}`, 0.045, 0.045, 0.34, 'steel', 10), s * 1.7, 0.78, z), sparkPlugs);
    }
  }
  fuelIgnition.add(sparkPlugs);

  engine.add(fuelIgnition);

  // ====================================================================
  // ACCESSORY DRIVE (+Z face) — alternator, A/C compressor, water pump,
  // serpentine belt, tensioner pulley, idler pulley.
  // ====================================================================
  const accessoryDrive = group('accessoryDrive');
  const altC = [0.95, 0.5];
  const wpC = [-0.95, 0.45];
  const acC = [0.2, 1.0];        // A/C compressor (top center of front face)
  const tens1 = [-0.55, -0.15];
  const tens2 = [0.55, 0.05];

  // ---- alternator
  const alternator = group('alternator');
  add(rot(at(cyl('alternatorBody', 0.33, 0.33, 0.66, 'cast', 24), altC[0], altC[1], FZ - 0.18), HALF_PI, 0, 0), alternator);
  add(rot(at(cyl('alternatorEnd', 0.3, 0.35, 0.16, 'castDark', 24), altC[0], altC[1], FZ - 0.5), HALF_PI, 0, 0), alternator);
  for (let r = 0; r < 10; r++) {
    const a = (r / 10) * Math.PI * 2;
    add(rot(at(box(`altFin_${r}`, 0.04, 0.28, 0.02, 'castDark'),
      altC[0] + Math.cos(a) * 0.18, altC[1] + Math.sin(a) * 0.18, FZ - 0.55), 0, 0, a), alternator);
  }
  add(rot(at(cyl('alternatorPulley', 0.2, 0.2, 0.16, 'polished', 18), altC[0], altC[1], FZ + 0.2), HALF_PI, 0, 0), alternator);
  accessoryDrive.add(alternator);

  // ---- A/C compressor
  const acCompressor = group('acCompressor');
  add(rot(at(cyl('acCompressorBody', 0.32, 0.32, 0.5, 'cast', 22), acC[0], acC[1], FZ - 0.15), HALF_PI, 0, 0), acCompressor);
  add(rot(at(cyl('acCompressorClutch', 0.26, 0.26, 0.14, 'castDark', 20), acC[0], acC[1], FZ + 0.18), HALF_PI, 0, 0), acCompressor);
  add(rot(at(cyl('acCompressorPulley', 0.22, 0.22, 0.16, 'polished', 18), acC[0], acC[1], FZ + 0.26), HALF_PI, 0, 0), acCompressor);
  add(rot(at(box('acCompressorPort', 0.16, 0.16, 0.2, 'castDark'), acC[0] + 0.3, acC[1], FZ - 0.15), 0, 0, 0), acCompressor);
  accessoryDrive.add(acCompressor);

  // ---- water pump
  const waterPump = group('waterPump');
  add(rot(at(cyl('waterPumpBody', 0.3, 0.3, 0.3, 'cast', 22), wpC[0], wpC[1], FZ - 0.1), HALF_PI, 0, 0), waterPump);
  add(rot(at(cyl('waterPumpPulley', 0.24, 0.24, 0.16, 'polished', 18), wpC[0], wpC[1], FZ + 0.12), HALF_PI, 0, 0), waterPump);
  add(rot(at(cyl('waterPumpHubBolt', 0.05, 0.05, 0.18, 'bolt', 8), wpC[0], wpC[1], FZ + 0.22), HALF_PI, 0, 0), waterPump);
  accessoryDrive.add(waterPump);

  // ---- tensioner pulley + arm/housing
  const tensionerPulley = group('tensionerPulley');
  add(rot(at(cyl('tensionerPulleyWheel', 0.17, 0.17, 0.15, 'damper', 18), tens1[0], tens1[1], FZ + 0.05), HALF_PI, 0, 0), tensionerPulley);
  add(rot(at(box('tensionerArm', 0.5, 0.12, 0.1, 'cast'), -0.3, -0.35, FZ + 0.05), 0, 0, 0.6), tensionerPulley);
  add(rot(at(cyl('tensionerHousing', 0.16, 0.16, 0.2, 'cast', 16), -0.85, -0.55, FZ), HALF_PI, 0, 0), tensionerPulley);
  accessoryDrive.add(tensionerPulley);

  // ---- idler pulley
  const idlerPulley = group('idlerPulley');
  add(rot(at(cyl('idlerPulleyWheel', 0.15, 0.15, 0.15, 'damper', 18), tens2[0], tens2[1], FZ + 0.05), HALF_PI, 0, 0), idlerPulley);
  add(rot(at(cyl('idlerPulleyBolt', 0.04, 0.04, 0.16, 'bolt', 8), tens2[0], tens2[1], FZ + 0.14), HALF_PI, 0, 0), idlerPulley);
  accessoryDrive.add(idlerPulley);

  // ---- serpentine belt: closed tube loop threading the pulleys + rib loop
  const serpentineBelt = group('serpentineBelt');
  add(tube('serpentineBeltRun', [
    [crankC[0], crankC[1] - 0.5, FZ + 0.05],
    [tens2[0] + 0.18, tens2[1] - 0.15, FZ + 0.05],
    [altC[0], altC[1] - 0.22, FZ + 0.05],
    [altC[0] + 0.22, altC[1], FZ + 0.05],
    [acC[0] + 0.24, acC[1] - 0.1, FZ + 0.05],
    [acC[0] - 0.24, acC[1] - 0.1, FZ + 0.05],
    [wpC[0] + 0.26, wpC[1] + 0.1, FZ + 0.05],
    [wpC[0] - 0.05, wpC[1] + 0.26, FZ + 0.05],
    [wpC[0] - 0.26, wpC[1], FZ + 0.05],
    [tens1[0] - 0.18, tens1[1] + 0.1, FZ + 0.05],
    [crankC[0] - 0.5, crankC[1], FZ + 0.05],
  ], 0.05, 'belt', 90, 10, true), serpentineBelt);
  accessoryDrive.add(serpentineBelt);

  engine.add(accessoryDrive);

  // ====================================================================
  // LUBRICATION & COOLING — oil filter housing, oil filler neck, oil pump,
  // thermostat housing, coolant unions/hoses.
  // ====================================================================
  const lubeCooling = group('lubeCooling');

  // ---- oil filter housing (cylindrical cap, front-right) + grip flutes
  const oilFilterHousing = group('oilFilterHousing');
  add(rot(at(cyl('oilFilterBody', 0.28, 0.28, 0.5, 'cast', 22), 1.25, 0.85, 0.55), 0.4, 0, 0), oilFilterHousing);
  add(rot(at(cyl('oilFilterCap', 0.3, 0.3, 0.12, 'castDark', 22), 1.25, 1.08, 0.65), 0.4, 0, 0), oilFilterHousing);
  for (let r = 0; r < 6; r++) {
    const a = (r / 6) * Math.PI * 2;
    add(at(box(`oilFilterFlute_${r}`, 0.04, 0.12, 0.04, 'castDark'),
      1.25 + Math.cos(a) * 0.28, 1.1, 0.66 + Math.sin(a) * 0.1), oilFilterHousing);
  }
  lubeCooling.add(oilFilterHousing);

  // ---- oil filler neck + tan/gold cap
  const oilFillerNeck = group('oilFillerNeck');
  add(at(cyl('oilFillerTube', 0.18, 0.2, 0.28, 'cast', 18), 1.0, 1.55, -0.55), oilFillerNeck);
  add(at(lathe('oilFillerCap', [
    [0.0, 0.0], [0.22, 0.0], [0.23, 0.08], [0.18, 0.12], [0.1, 0.13], [0.0, 0.13],
  ], 'oilcap', 24), 1.0, 1.7, -0.55), oilFillerNeck);
  // dipstick lives with lubrication
  add(rot(at(cyl('dipstickTube', 0.045, 0.045, 0.95, 'steel', 10), 1.45, 0.55, -0.95), 0.35, 0, 0), oilFillerNeck);
  add(at(sphere('dipstickHandle', 0.1, 'yellow', 14), 1.6, 1.05, -1.12), oilFillerNeck);
  lubeCooling.add(oilFillerNeck);

  // ---- oil pump (low on the front of the case, driven off the crank)
  const oilPump = group('oilPump');
  add(rot(at(cyl('oilPumpBody', 0.26, 0.26, 0.3, 'cast', 20), 0, -0.55, 0.95), HALF_PI, 0, 0), oilPump);
  add(rot(at(cyl('oilPumpDriveGear', 0.18, 0.18, 0.1, 'steel', 20), 0, -0.55, 1.12), HALF_PI, 0, 0), oilPump);
  add(at(box('oilPickupTube', 0.06, 0.5, 0.06, 'cast'), 0, -0.85, 0.5), oilPump);
  add(at(box('oilPickupStrainer', 0.3, 0.08, 0.4, 'castDark'), 0, -1.05, 0.3), oilPump);
  lubeCooling.add(oilPump);

  // ---- thermostat housing (coolant outlet, front of block) + neck
  const thermostatHousing = group('thermostatHousing');
  add(rot(at(cyl('thermostatBody', 0.2, 0.2, 0.3, 'cast', 20), -0.4, -0.2, 1.05), 0.4, 0, 0), thermostatHousing);
  add(rot(at(cyl('thermostatCap', 0.22, 0.22, 0.1, 'castDark', 18), -0.4, -0.05, 1.18), 0.4, 0, 0), thermostatHousing);
  add(rot(at(cyl('thermostatNeck', 0.12, 0.12, 0.3, 'cast', 14), -0.4, -0.45, 1.2), 0.8, 0, 0), thermostatHousing);
  lubeCooling.add(thermostatHousing);

  // ---- coolant unions / hoses (ribbed metal cross-union + arching hoses)
  const coolantPlumbing = group('coolantPlumbing');
  for (let i = 0; i < 8; i++) {
    add(rot(at(cyl(`coolantUnionRib_${i}`, 0.13, 0.13, 0.05, 'polished', 16), 1.0 - i * 0.07, 0.7, 1.0), 0, 0, HALF_PI), coolantPlumbing);
  }
  add(rot(at(cyl('coolantUnionPipe', 0.1, 0.1, 0.7, 'tank', 18), 0.65, 0.7, 1.0), 0, 0, HALF_PI), coolantPlumbing);
  add(tube('coolantHoseUpper', [
    [1.3, 0.9, 0.5], [0.9, 1.3, 0.0], [0.2, 1.45, -0.6], [-0.6, 1.3, -0.9], [-1.3, 1.0, -0.8],
  ], 0.12, 'hose', 40, 14), coolantPlumbing);
  add(tube('coolantHoseLower', [
    [-1.35, 0.2, 0.6], [-1.5, 0.0, 0.0], [-1.3, -0.3, -0.6], [-0.8, -0.5, -1.0],
  ], 0.1, 'hose', 32, 14), coolantPlumbing);
  add(rot(at(torus('coolantClamp1', 0.13, 0.025, 'polished', 8, 20), 1.28, 0.92, 0.46), 0.6, 0, 0), coolantPlumbing);
  add(rot(at(torus('coolantClamp2', 0.11, 0.025, 'polished', 8, 20), -1.33, 0.22, 0.56), 0.6, 0, 0), coolantPlumbing);
  lubeCooling.add(coolantPlumbing);

  engine.add(lubeCooling);

  // ====================================================================
  // EXHAUST HEADER STUBS — full exhaust is its own component; keep stubs so the
  // exhaust ports read on the model (not a selectable assembly part here).
  // ====================================================================
  const headers = group('headerStubs');
  for (let i = 0; i < 3; i++) {
    const z = (i - 1) * 0.72;
    for (const s of [1, -1]) {
      const sk = s > 0 ? 'R' : 'L';
      add(tube(`headerStub_${sk}_${i}`, [
        [s * 1.85, -0.35, z], [s * 1.95, -0.8, z * 0.6], [s * 1.4, -1.15, -0.2], [s * 0.8, -1.35, -1.0],
      ], 0.1, 'exhaust', 22, 12), headers);
      add(rot(at(torus(`headerFlange_${sk}_${i}`, 0.13, 0.03, 'exhaustC', 8, 18), s * 1.86, -0.35, z), 0, 0, HALF_PI), headers);
    }
  }
  add(rot(at(cyl('headerCollector', 0.22, 0.22, 1.0, 'exhaust', 18), 0, -1.45, -1.4), Math.PI / 2.4, 0, 0), headers);
  engine.add(headers);

  return engine;
}
