import * as THREE from 'three';
import { Renderer } from '../engine/renderer';
import { toonMaterial, addOutlines, toonGlobals } from '../engine/toon';
import { woodPlanks, rugTexture, blockFace } from '../engine/textures';
import { buildMech, type MechModel } from '../mech/builder';
import { defaultAnimState } from '../mech/animator';
import type { MechBlueprint } from '../mech/types';

/** Visual test bench: `?sandbox` renders a lineup of toys on a bedroom floor. */
export function runSandbox(canvas: HTMLCanvasElement): void {
  const renderer = new Renderer(canvas);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f3d9b8');
  scene.fog = new THREE.Fog('#f3d9b8', 30, 110);

  const hemi = new THREE.HemisphereLight('#dfe9ff', '#9a7560', 1.9);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff1dc', 2.4);
  sun.position.set(14, 30, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera as THREE.OrthographicCamera;
  sc.left = -25; sc.right = 25; sc.top = 25; sc.bottom = -25; sc.near = 1; sc.far = 90;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), toonMaterial({ map: woodPlanks('#c98d57', [14, 14]), spec: 0, rim: 0 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const rug = new THREE.Mesh(new THREE.CircleGeometry(13, 64), toonMaterial({ map: rugTexture(), spec: 0, rim: 0 }));
  rug.rotation.x = -Math.PI / 2;
  rug.position.y = 0.02;
  rug.receiveShadow = true;
  scene.add(rug);

  const blockColors: [string, string][] = [['#ff5a5f', '#fff4d6'], ['#3d7cf0', '#fff4d6'], ['#ffc53d', '#6b3fa0'], ['#4cc38a', '#fff4d6']];
  const letters = ['M', 'E', 'C', 'H', 'F', 'O'];
  const blocks: [number, number, number, number][] = [[-9, 0, -6, 0.3], [-6.2, 0, -7.5, -0.2], [-7.6, 3, -6.8, 0.5], [9, 0, -5, 0.8], [7, 0, -9, 0.1]];
  blocks.forEach(([x, y, z, r], i) => {
    const [bg, fg] = blockColors[i % blockColors.length];
    const mats = [0, 1, 2, 3, 4, 5].map((f) => toonMaterial({ map: blockFace(letters[(i + f) % letters.length], bg, fg), spec: 0.25 }));
    const b = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), mats);
    b.position.set(x, y + 1.5, z);
    b.rotation.y = r;
    b.castShadow = true;
    b.receiveShadow = true;
    addOutlines(b, 0x2a1a14, 1.4);
    scene.add(b);
  });

  const lineup: { bp: MechBlueprint; action: string | null; actionT?: number; x: number; aim?: number }[] = [
    {
      x: -4.2,
      action: 'pose',
      bp: {
        frame: 'humanoid', scale: 1, head: 'hero', torso: 'hero', arms: 'standard', legs: 'standard', back: 'thrusters', weaponR: 'rifle', weaponL: 'shield',
        palette: { main: '#f4f4fa', sub: '#2f6bff', accent: '#ffc933', dark: '#30324a', glow: '#35f0ff' },
      },
    },
    {
      x: -1.4,
      action: null,
      aim: 1,
      bp: {
        frame: 'humanoid', scale: 1.05, head: 'mono', torso: 'heavy', arms: 'heavy', legs: 'heavy', back: 'cannons', weaponR: 'bazooka',
        palette: { main: '#5d8a4e', sub: '#3c5a36', accent: '#e0b44a', dark: '#2a2f2a', glow: '#ff3b6b' },
      },
    },
    {
      x: 1.4,
      action: 'slash1',
      actionT: 0.4,
      bp: {
        frame: 'humanoid', scale: 1, head: 'samurai', torso: 'knight', arms: 'spiked', legs: 'standard', back: 'cape', weaponR: 'saber', deco: ['scarf'],
        palette: { main: '#e03a3a', sub: '#2a2438', accent: '#ffcf40', dark: '#231d2e', glow: '#fff36b' },
        finish: 'plastic',
      },
    },
    {
      x: 4.2,
      action: 'victory',
      bp: {
        frame: 'humanoid', scale: 0.95, head: 'skull', torso: 'core', arms: 'spiked', legs: 'spiked', back: 'wings', weaponR: 'claws', deco: ['shoulderSpikes', 'tail'],
        palette: { main: '#3a2d5c', sub: '#8e2de2', accent: '#39ff9f', dark: '#17121f', glow: '#39ff9f' },
        finish: 'holo',
      },
    },
    {
      x: 7,
      action: 'cast',
      bp: {
        frame: 'humanoid', scale: 0.9, head: 'knight', torso: 'knight', arms: 'round', legs: 'hover', back: 'wings', weaponR: 'staff',
        palette: { main: '#e8e2d0', sub: '#4a8cff', accent: '#f5c542', dark: '#39364a', glow: '#8ffcff' },
        finish: 'chrome',
      },
    },
    {
      x: -7,
      action: 'punch',
      actionT: 0.5,
      bp: {
        frame: 'humanoid', scale: 0.95, head: 'beast', torso: 'hero', arms: 'heavy', legs: 'spiked', weaponR: 'claws', deco: ['tail'],
        palette: { main: '#ff9a2e', sub: '#fff1d6', accent: '#3a2a20', dark: '#3a2a20', glow: '#6bff7a' },
        finish: 'clear',
      },
    },
  ];

  const mechs: { m: MechModel; action: string | null; actionT?: number; aim?: number }[] = [];
  for (const l of lineup) {
    const m = buildMech(l.bp);
    m.root.position.set(l.x, 0, 0);
    m.root.rotation.y = -0.25 + l.x * 0.03;
    scene.add(m.root);
    mechs.push({ m, action: l.action, actionT: l.actionT, aim: l.aim });
  }

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
  const params = new URLSearchParams(location.search);
  const cam = params.get('cam');
  if (cam === 'close') {
    camera.position.set(-2.6, 1.5, 4.2);
    camera.lookAt(-2.4, 0.85, 0);
  } else if (cam === 'right') {
    camera.position.set(4.6, 1.5, 4.2);
    camera.lookAt(4.4, 0.85, 0);
  } else {
    camera.position.set(0.5, 2.6, 11);
    camera.lookAt(0.5, 1.0, 0);
  }

  const state = defaultAnimState();
  let last = performance.now();
  let t = 0;
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    toonGlobals.uTime.value = t;
    for (const it of mechs) {
      state.time = t + it.m.root.position.x;
      state.action = it.action;
      state.actionT = it.actionT ?? Math.min(1, (t % 3) / 1.2);
      state.aimR = it.aim ?? 0;
      it.m.animator.update(dt, state);
    }
    renderer.render(scene, camera, dt);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  (window as any).__sandboxReady = true;
}
