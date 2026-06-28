#!/usr/bin/env node
// Verifies the parts manifests against their GLBs:
//   - engine-parts.json   -> engine.glb
//   - trans-parts.json     -> trans.glb
//   - exhaust-parts.json   -> exhaust.glb
// For each: GLB is a valid glTF v2 binary (magic, version, length, JSON chunk),
// every EnginePart.node exists as a node name in the GLB, manifest.glb matches,
// ids are unique, and every tier:'sub' part points at an existing primary parent.
// Reports node/mesh count + file size. Exits non-zero on any failure.

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', '..', 'public', 'models', 'components');

// manifest file -> { glb file, expected manifest.glb path }
const MANIFESTS = [
  { parts: 'engine-parts.json', glb: 'engine.glb', glbPath: '/models/components/engine.glb' },
  { parts: 'trans-parts.json', glb: 'trans.glb', glbPath: '/models/components/trans.glb' },
  { parts: 'exhaust-parts.json', glb: 'exhaust.glb', glbPath: '/models/components/exhaust.glb' },
];

function parseGLB(filePath) {
  const buf = readFileSync(filePath);
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error('bad magic (not glTF)');
  if (buf.readUInt32LE(4) !== 2) throw new Error('not glTF v2');
  if (buf.readUInt32LE(8) !== buf.length) throw new Error('header length != file length');
  const jsonLen = buf.readUInt32LE(12);
  if (buf.readUInt32LE(16) !== 0x4e4f534a) throw new Error('first chunk not JSON');
  const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'));
  return { json, bytes: buf.length };
}

function fmtBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function verifyManifest({ parts, glb, glbPath }) {
  const GLB = join(DIR, glb);
  const PARTS = join(DIR, parts);
  const { json, bytes } = parseGLB(GLB);
  const nodeNames = new Set((json.nodes || []).map((n) => n.name).filter(Boolean));
  const manifest = JSON.parse(readFileSync(PARTS, 'utf8'));

  const errors = [];
  if (manifest.glb !== glbPath) {
    errors.push(`manifest.glb is "${manifest.glb}", expected "${glbPath}"`);
  }
  if (!Array.isArray(manifest.parts) || manifest.parts.length === 0) {
    errors.push('manifest.parts is empty or not an array');
  }

  const ids = new Set();
  for (const part of manifest.parts || []) {
    for (const f of ['id', 'node', 'label', 'assembly', 'system']) {
      if (!part[f]) errors.push(`part ${part.id || '?'} missing required field "${f}"`);
    }
    if (ids.has(part.id)) errors.push(`duplicate part id "${part.id}"`);
    ids.add(part.id);
    if (part.node && !nodeNames.has(part.node)) {
      errors.push(`part "${part.id}" -> node "${part.node}" NOT FOUND in GLB`);
    }
  }
  // tier:'sub' parts must reference an existing primary parent id
  for (const part of manifest.parts || []) {
    if (part.tier === 'sub') {
      if (!part.parent) errors.push(`sub part "${part.id}" missing "parent"`);
      else if (!ids.has(part.parent)) {
        errors.push(`sub part "${part.id}" -> parent "${part.parent}" not in manifest`);
      }
    }
  }

  const primary = (manifest.parts || []).filter((p) => p.tier !== 'sub').length;
  const sub = (manifest.parts || []).filter((p) => p.tier === 'sub').length;

  console.log(`\n${parts} verification:\n`);
  console.log(`  GLB         : ${GLB}`);
  console.log(`  nodes       : ${(json.nodes || []).length}`);
  console.log(`  meshes      : ${(json.meshes || []).length}`);
  console.log(`  size        : ${fmtBytes(bytes)}`);
  console.log(`  parts       : ${(manifest.parts || []).length} (primary ${primary}, sub ${sub})`);
  console.log(`  named nodes : ${nodeNames.size}`);

  if (errors.length) {
    console.error(`\n  FAILED with ${errors.length} error(s):`);
    for (const e of errors) console.error('    - ' + e);
  } else {
    console.log('  All manifest nodes exist in the GLB. OK');
  }
  return errors.length;
}

let total = 0;
for (const m of MANIFESTS) total += verifyManifest(m);

if (total) {
  console.error(`\nFAILED: ${total} error(s) across manifests\n`);
  process.exit(1);
}
console.log('\nAll parts manifests validated against their GLBs. OK\n');
