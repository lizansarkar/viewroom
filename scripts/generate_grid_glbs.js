import fs from 'fs';
import path from 'path';

// Polyfill FileReader & Blob for Node BEFORE importing GLTFExporter
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsDataURL(blob) {
      const buf = Buffer.isBuffer(blob) ? blob : Buffer.from(blob);
      this.result = `data:application/octet-stream;base64,${buf.toString('base64')}`;
      if (this.onload) this.onload();
    }
    readAsArrayBuffer(blob) {
      this.result = Buffer.isBuffer(blob) ? blob.buffer : blob;
      if (this.onload) this.onload();
    }
  };
}

const THREE = await import('three');
const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');

const modelsDir = path.resolve(process.cwd(), 'public/models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

function parseGLTF(exporter, input, options) {
  return new Promise((resolve, reject) => {
    exporter.parse(
      input,
      (gltf) => resolve(gltf),
      (err) => reject(err),
      options
    );
  });
}

function gltfToGlb(gltfJson) {
  const jsonString = JSON.stringify(gltfJson);
  let jsonBuffer = Buffer.from(jsonString, 'utf8');
  
  const remainder = jsonBuffer.length % 4;
  if (remainder !== 0) {
    const pad = 4 - remainder;
    jsonBuffer = Buffer.concat([jsonBuffer, Buffer.alloc(pad, 0x20)]);
  }

  const jsonChunkLength = jsonBuffer.length;
  const totalLength = 12 + 8 + jsonChunkLength;

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46544c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);

  const jsonChunkHeader = Buffer.alloc(8);
  jsonChunkHeader.writeUInt32LE(jsonChunkLength, 0);
  jsonChunkHeader.writeUInt32LE(0x4e4f534a, 4);

  return Buffer.concat([header, jsonChunkHeader, jsonBuffer]);
}

async function exportToGLB(object3D, filename) {
  const exporter = new GLTFExporter();
  try {
    const gltfJson = await parseGLTF(exporter, object3D, { binary: false, embedImages: true });
    const glbBuffer = gltfToGlb(gltfJson);
    const filePath = path.join(modelsDir, filename);
    fs.writeFileSync(filePath, glbBuffer);
    console.log(`Successfully generated ${filename} (${glbBuffer.length} bytes)`);
  } catch (err) {
    console.error(`Error exporting ${filename}:`, err);
  }
}

// 1. WATCH GLB
function createWatchModel() {
  const group = new THREE.Group();
  const caseGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.4, 32);
  const caseMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
  const caseMesh = new THREE.Mesh(caseGeo, caseMat);
  caseMesh.rotation.x = Math.PI / 2;
  group.add(caseMesh);

  const dialGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.04, 32);
  const dialMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.4, roughness: 0.3 });
  const dialMesh = new THREE.Mesh(dialGeo, dialMat);
  dialMesh.rotation.x = Math.PI / 2;
  dialMesh.position.z = 0.21;
  group.add(dialMesh);

  const bezelGeo = new THREE.TorusGeometry(1.75, 0.1, 16, 48);
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
  const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
  bezelMesh.position.z = 0.22;
  group.add(bezelMesh);

  const strapMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
  const topStrap = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.8, 0.14), strapMat);
  topStrap.position.set(0, 2.8, 0);
  const botStrap = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.8, 0.14), strapMat);
  botStrap.position.set(0, -2.8, 0);
  group.add(topStrap);
  group.add(botStrap);

  return group;
}

// 2. HEADPHONES GLB
function createHeadphonesModel() {
  const group = new THREE.Group();
  const headbandMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
  const cupMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.5, roughness: 0.3 });
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });

  const headbandGeo = new THREE.TorusGeometry(1.8, 0.15, 16, 48, Math.PI);
  const headband = new THREE.Mesh(headbandGeo, headbandMat);
  headband.rotation.z = Math.PI;
  headband.position.y = 0.8;
  group.add(headband);

  [-1.8, 1.8].forEach((x) => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.5, 32), cupMat);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(x, -0.5, 0);
    group.add(cup);

    const cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.25, 32), cushionMat);
    cushion.rotation.z = Math.PI / 2;
    cushion.position.set(x * 0.88, -0.5, 0);
    group.add(cushion);
  });
  return group;
}

// 3. CHAIR GLB
function createChairModel() {
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 });
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 2.2), cushionMat);
  seat.position.y = 0;
  group.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 0.3), cushionMat);
  back.position.set(0, 1.05, -0.95);
  group.add(back);

  [[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.05, 1.6, 16), woodMat);
    leg.position.set(x, -0.8, z);
    group.add(leg);
  });

  return group;
}

// 4. PHONE GLB
function createPhoneModel() {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.1, roughness: 0.1 });
  const cameraMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 0.18), bodyMat);
  group.add(body);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.48, 3.08), screenMat);
  screen.position.z = 0.095;
  group.add(screen);

  const camBump = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.08), cameraMat);
  camBump.position.set(-0.35, 1.05, -0.1);
  group.add(camBump);

  return group;
}

// 5. SPEAKER GLB
function createSpeakerModel() {
  const group = new THREE.Group();
  const fabricMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
  const capMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.6, 32), fabricMat);
  group.add(body);

  const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.2, 32), capMat);
  topCap.position.y = 1.3;
  group.add(topCap);

  const botCap = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.2, 32), capMat);
  botCap.position.y = -1.3;
  group.add(botCap);

  return group;
}

// 6. CAMERA GLB
function createCameraModel() {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.88, roughness: 0.2 });
  const gripMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });
  const lensMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.9, roughness: 0.15 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.7, 1.0), bodyMat);
  group.add(body);

  const grip = new THREE.Mesh(new THREE.BoxGeometry(2.62, 1.0, 1.02), gripMat);
  grip.position.y = -0.25;
  group.add(grip);

  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.2, 32), lensMat);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, 0, 0.75);
  group.add(lens);

  return group;
}

async function run() {
  await exportToGLB(createWatchModel(), 'watch.glb');
  await exportToGLB(createHeadphonesModel(), 'headphones.glb');
  await exportToGLB(createChairModel(), 'chair.glb');
  await exportToGLB(createPhoneModel(), 'phone.glb');
  await exportToGLB(createSpeakerModel(), 'speaker.glb');
  await exportToGLB(createCameraModel(), 'camera.glb');
}

run();
