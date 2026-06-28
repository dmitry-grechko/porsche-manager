// Minimal, robust glTF 2.0 -> GLB serializer for headless Node.
//
// Walks a THREE.Object3D hierarchy (Groups + Meshes built from THREE geometry
// classes, which are pure math and work without a renderer) and writes a single
// self-contained .glb: one scene, a node tree that preserves names, indexed
// POSITION + NORMAL accessors, and pbrMetallicRoughness materials (embedded,
// no external textures).
//
// We deliberately avoid three's GLTFExporter so there is nothing to polyfill
// (no DOM, Blob, FileReader, ImageData). This keeps the pipeline deterministic.

import { writeFileSync } from 'node:fs';
import { materialToGltf } from './materials.mjs';

const COMP_FLOAT = 5126;
const COMP_USHORT = 5123;
const COMP_UINT = 5125;
const ARRAY_BUFFER = 34962;
const ELEMENT_ARRAY_BUFFER = 34963;

function pad4(n) { return (4 - (n % 4)) % 4; }

/**
 * Serialize a THREE.Object3D root to a GLB ArrayBuffer/Buffer and write to disk.
 * @param {THREE.Object3D} root  root group (its name becomes the root node name)
 * @param {string} filePath      absolute output path
 * @returns {{nodes:number, meshes:number, bytes:number, nodeNames:string[]}}
 */
export function writeGLB(root, filePath) {
  root.updateMatrixWorld(true);

  const gltf = {
    asset: { version: '2.0', generator: 'porsche-gen' },
    scene: 0,
    scenes: [{ nodes: [] }],
    nodes: [],
    meshes: [],
    materials: [],
    accessors: [],
    bufferViews: [],
    buffers: [],
  };

  // Material dedup keyed by JSON of the gltf material.
  const matCache = new Map();
  function materialIndex(spec) {
    const m = materialToGltf(spec);
    const key = JSON.stringify(m);
    if (matCache.has(key)) return matCache.get(key);
    const idx = gltf.materials.length;
    gltf.materials.push(m);
    matCache.set(key, idx);
    return idx;
  }

  // Binary accumulation.
  const chunks = [];
  let byteOffset = 0;
  function pushBuffer(typedArray, target) {
    const buf = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    // align start to 4 bytes
    const padStart = pad4(byteOffset);
    if (padStart) { chunks.push(Buffer.alloc(padStart)); byteOffset += padStart; }
    const viewIndex = gltf.bufferViews.length;
    gltf.bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: buf.length,
      ...(target ? { target } : {}),
    });
    chunks.push(buf);
    byteOffset += buf.length;
    return viewIndex;
  }

  function addAccessor(typedArray, componentType, type, count, min, max, target) {
    const viewIndex = pushBuffer(typedArray, target);
    const accessor = {
      bufferView: viewIndex,
      componentType,
      count,
      type,
    };
    if (min) accessor.min = min;
    if (max) accessor.max = max;
    gltf.accessors.push(accessor);
    return gltf.accessors.length - 1;
  }

  let meshCount = 0;

  // Convert one THREE.Mesh -> gltf mesh index. Geometry is baked into a single
  // primitive. Local node transform carries placement, so we use local geometry.
  function buildMesh(mesh) {
    const geom = mesh.geometry;
    if (!geom.attributes.normal) geom.computeVertexNormals();
    const pos = geom.attributes.position;
    const nor = geom.attributes.normal;

    // positions
    const posArr = new Float32Array(pos.array.slice(0, pos.count * 3));
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < pos.count; i++) {
      for (let c = 0; c < 3; c++) {
        const v = posArr[i * 3 + c];
        if (v < min[c]) min[c] = v;
        if (v > max[c]) max[c] = v;
      }
    }
    const posAcc = addAccessor(posArr, COMP_FLOAT, 'VEC3', pos.count, min, max, ARRAY_BUFFER);

    const norArr = new Float32Array(nor.array.slice(0, nor.count * 3));
    const norAcc = addAccessor(norArr, COMP_FLOAT, 'VEC3', nor.count, null, null, ARRAY_BUFFER);

    // indices
    let idxAcc;
    if (geom.index) {
      const idxSrc = geom.index.array;
      const count = geom.index.count;
      let typed, compType;
      if (pos.count > 65535) { typed = new Uint32Array(idxSrc); compType = COMP_UINT; }
      else { typed = new Uint16Array(idxSrc); compType = COMP_USHORT; }
      idxAcc = addAccessor(typed, compType, 'SCALAR', count, null, null, ELEMENT_ARRAY_BUFFER);
    } else {
      // non-indexed -> generate sequential indices
      const count = pos.count;
      let typed, compType;
      if (count > 65535) { typed = new Uint32Array(count); compType = COMP_UINT; }
      else { typed = new Uint16Array(count); compType = COMP_USHORT; }
      for (let i = 0; i < count; i++) typed[i] = i;
      idxAcc = addAccessor(typed, compType, 'SCALAR', count, null, null, ELEMENT_ARRAY_BUFFER);
    }

    const matIdx = materialIndex(mesh.userData.material || { color: 0x888888 });
    const meshIndex = gltf.meshes.length;
    gltf.meshes.push({
      name: mesh.name || `mesh_${meshIndex}`,
      primitives: [{
        attributes: { POSITION: posAcc, NORMAL: norAcc },
        indices: idxAcc,
        material: matIdx,
        mode: 4,
      }],
    });
    meshCount++;
    return meshIndex;
  }

  // Recursively emit nodes preserving names + local transforms.
  function buildNode(obj) {
    const nodeIndex = gltf.nodes.length;
    const node = { name: obj.name || `node_${nodeIndex}` };
    gltf.nodes.push(node);

    // local TRS
    const p = obj.position, q = obj.quaternion, s = obj.scale;
    if (p.x || p.y || p.z) node.translation = [p.x, p.y, p.z];
    if (q.x || q.y || q.z || q.w !== 1) node.rotation = [q.x, q.y, q.z, q.w];
    if (s.x !== 1 || s.y !== 1 || s.z !== 1) node.scale = [s.x, s.y, s.z];

    if (obj.isMesh && obj.geometry) {
      node.mesh = buildMesh(obj);
    }

    const childIndices = [];
    for (const child of obj.children) {
      childIndices.push(buildNode(child));
    }
    if (childIndices.length) node.children = childIndices;
    return nodeIndex;
  }

  const rootIndex = buildNode(root);
  gltf.scenes[0].nodes.push(rootIndex);

  // Assemble BIN.
  const binTail = pad4(byteOffset);
  if (binTail) chunks.push(Buffer.alloc(binTail));
  const bin = Buffer.concat(chunks);
  gltf.buffers.push({ byteLength: bin.length });

  // JSON chunk (pad with spaces to 4 bytes).
  let jsonStr = JSON.stringify(gltf);
  const jsonPad = pad4(Buffer.byteLength(jsonStr));
  jsonStr += ' '.repeat(jsonPad);
  const jsonBuf = Buffer.from(jsonStr, 'utf8');

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // 'glTF'
  header.writeUInt32LE(2, 4);          // version
  const totalLen = 12 + 8 + jsonBuf.length + 8 + bin.length;
  header.writeUInt32LE(totalLen, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonBuf.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4); // 'JSON'

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(bin.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4); // 'BIN\0'

  const glb = Buffer.concat([header, jsonHeader, jsonBuf, binHeader, bin]);
  writeFileSync(filePath, glb);

  return {
    nodes: gltf.nodes.length,
    meshes: meshCount,
    bytes: glb.length,
    nodeNames: gltf.nodes.map((n) => n.name),
  };
}
