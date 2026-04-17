import * as THREE from 'three';

export type Sides = 4 | 6 | 8 | 12 | 20;

export interface SceneControls {
  speed: number;
  count: number;
  color: string;
  sides: Sides;
  detail: number;
}

export interface SceneHandle {
  update(partial: Partial<SceneControls>): void;
  destroy(): void;
}

interface Polyhedron {
  mesh: THREE.LineSegments;
  rotationVelocity: THREE.Vector3;
  fallSpeed: number;
  driftSeed: number;
}

const SPAWN_HALF_HEIGHT = 8;
const SPAWN_HALF_WIDTH = 9;
const SPAWN_DEPTH = 6;

function buildGeometry(sides: Sides, detail: number): THREE.BufferGeometry {
  const radius = 1;
  switch (sides) {
    case 4:
      return new THREE.TetrahedronGeometry(radius, detail);
    case 6: {
      const seg = Math.max(1, detail + 1);
      return new THREE.BoxGeometry(radius * 1.4, radius * 1.4, radius * 1.4, seg, seg, seg);
    }
    case 8:
      return new THREE.OctahedronGeometry(radius, detail);
    case 12:
      return new THREE.DodecahedronGeometry(radius, detail);
    case 20:
      return new THREE.IcosahedronGeometry(radius, detail);
  }
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function initHeroScene(canvas: HTMLCanvasElement, initial: SceneControls): SceneHandle {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0c12, 0.04);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const state: SceneControls = { ...initial };
  const group = new THREE.Group();
  scene.add(group);

  const mouse = new THREE.Vector2(0, 0);
  const mouseTarget = new THREE.Vector2(0, 0);

  let polyhedra: Polyhedron[] = [];
  let edgeGeometry: THREE.BufferGeometry | null = null;
  let material: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({
    color: state.color,
    transparent: true,
    opacity: 0.85,
  });

  function disposeMeshes() {
    polyhedra.forEach((p) => {
      group.remove(p.mesh);
      (p.mesh.geometry as THREE.BufferGeometry).dispose();
    });
    polyhedra = [];
    if (edgeGeometry) {
      edgeGeometry.dispose();
      edgeGeometry = null;
    }
  }

  function rebuild() {
    disposeMeshes();
    const source = buildGeometry(state.sides, state.detail);
    edgeGeometry = new THREE.EdgesGeometry(source, 1);
    source.dispose();

    const rand = seededRandom(state.sides * 1000 + state.count);
    for (let i = 0; i < state.count; i++) {
      const mesh = new THREE.LineSegments(edgeGeometry, material);

      mesh.position.set(
        (rand() - 0.5) * SPAWN_HALF_WIDTH * 2,
        (rand() - 0.5) * SPAWN_HALF_HEIGHT * 2,
        (rand() - 0.5) * SPAWN_DEPTH - 1
      );

      const scale = 0.5 + rand() * 0.9;
      mesh.scale.setScalar(scale);
      mesh.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI);

      polyhedra.push({
        mesh,
        rotationVelocity: new THREE.Vector3(
          (rand() - 0.5) * 0.6,
          (rand() - 0.5) * 0.6,
          (rand() - 0.5) * 0.3
        ),
        fallSpeed: 0.4 + rand() * 0.9,
        driftSeed: rand() * Math.PI * 2,
      });
      group.add(mesh);
    }
  }

  function respawnAbove(p: Polyhedron, rand: () => number) {
    p.mesh.position.x = (rand() - 0.5) * SPAWN_HALF_WIDTH * 2;
    p.mesh.position.y = SPAWN_HALF_HEIGHT + rand() * 2;
    p.mesh.position.z = (rand() - 0.5) * SPAWN_DEPTH - 1;
  }

  const recycleRand = seededRandom(0xc0ffee);

  function updateMaterial() {
    material.color.set(state.color);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function onPointerMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    mouseTarget.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseTarget.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointerMove);
  resize();
  rebuild();

  const clock = new THREE.Clock();
  let raf = 0;
  let running = true;

  function tick() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.getElapsedTime();

    mouse.x += (mouseTarget.x - mouse.x) * 0.05;
    mouse.y += (mouseTarget.y - mouse.y) * 0.05;

    group.rotation.y = mouse.x * 0.25;
    group.rotation.x = -mouse.y * 0.15;

    const spd = state.speed;
    for (const p of polyhedra) {
      p.mesh.rotation.x += p.rotationVelocity.x * dt * spd;
      p.mesh.rotation.y += p.rotationVelocity.y * dt * spd;
      p.mesh.rotation.z += p.rotationVelocity.z * dt * spd;
      p.mesh.position.y -= p.fallSpeed * dt * spd;
      p.mesh.position.x += Math.sin(elapsed * 0.3 + p.driftSeed) * 0.002 * spd;
      if (p.mesh.position.y < -SPAWN_HALF_HEIGHT - 1) {
        respawnAbove(p, recycleRand);
      }
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);

  function update(partial: Partial<SceneControls>) {
    const needsRebuild =
      (partial.sides !== undefined && partial.sides !== state.sides) ||
      (partial.count !== undefined && partial.count !== state.count) ||
      (partial.detail !== undefined && partial.detail !== state.detail);

    Object.assign(state, partial);

    if (partial.color !== undefined) updateMaterial();
    if (needsRebuild) rebuild();
  }

  function destroy() {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    disposeMeshes();
    material.dispose();
    renderer.dispose();
  }

  return { update, destroy };
}
