import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { toonMaterial, addOutlines, type ToonMaterial } from '../engine/toon';
import { hashString } from '../engine/rng';
import { getPart, type HumanoidDims, type JointParts, type SlotResult } from './registry';
import type { BuildContext, MechBlueprint, MechPalette, PartSpec, Proportions, SocketName } from './types';
import { HumanoidAnimator, type MechAnimator } from './animator';
import './parts/humanoid';

/**
 * Builds a rigged, cel-shaded capsule-toy mech from a blueprint.
 *
 * Every joint's primitives are baked into (at most) two merged meshes — one
 * vertex-colored toon mesh and one glow mesh — plus an outline hull, so a whole
 * mech is ~30 draw calls regardless of part count.
 */

export const NAMED_COLORS: Record<string, string> = {
  white: '#f3f1f6',
  black: '#1c1a26',
  metal: '#a7afc2',
  skin: '#f4c9a3',
};

export const DEFAULT_PROPORTIONS: Proportions = { head: 1, bulk: 1, arms: 1, legs: 1, shoulders: 1 };

export class MechModel {
  /** World-placed root (position/yaw set by gameplay). */
  readonly root = new THREE.Group();
  /** Child of root for lean/tilt/squash without fighting gameplay transforms. */
  readonly body = new THREE.Group();
  readonly joints = new Map<string, THREE.Object3D>();
  readonly sockets = new Map<SocketName, { joint: THREE.Object3D; pos: THREE.Vector3 }>();
  readonly materials: ToonMaterial[] = [];
  readonly glowMaterials: THREE.MeshBasicMaterial[] = [];
  /** Joint-level meshes (used for the KO "pop apart" effect). */
  readonly pieces: THREE.Mesh[] = [];
  height = 1.6;
  radius = 0.45;
  animator!: MechAnimator;

  constructor(readonly blueprint: MechBlueprint) {
    this.root.add(this.body);
  }

  joint(name: string): THREE.Object3D {
    const j = this.joints.get(name);
    if (!j) throw new Error(`Mech has no joint "${name}"`);
    return j;
  }

  /** World position of a socket (falls back to chest height). */
  socketWorld(name: SocketName, out = new THREE.Vector3()): THREE.Vector3 {
    const s = this.sockets.get(name);
    if (!s) {
      this.root.getWorldPosition(out);
      out.y += this.height * 0.6;
      return out;
    }
    return s.joint.localToWorld(out.copy(s.pos));
  }

  hasSocket(name: SocketName): boolean {
    return this.sockets.has(name);
  }

  setFlash(amount: number, color?: THREE.ColorRepresentation): void {
    for (const m of this.materials) {
      m.userData.uniforms.uFlash.value = amount;
      if (color !== undefined) m.userData.uniforms.uFlashColor.value.set(color);
    }
  }

  setTint(color: THREE.ColorRepresentation, amount: number): void {
    for (const m of this.materials) {
      m.userData.uniforms.uTint.value.set(color);
      m.userData.uniforms.uTintAmt.value = amount;
    }
  }

  setOpacity(opacity: number): void {
    for (const m of [...this.materials, ...this.glowMaterials]) {
      m.transparent = opacity < 1 || (m as ToonMaterial).userData?.finish === 'clear';
      m.opacity = opacity;
      m.depthWrite = opacity >= 1;
    }
  }

  dispose(): void {
    this.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && !m.userData.isOutline && !m.userData.sharedGeometry) m.geometry.dispose();
    });
    for (const m of this.materials) m.dispose();
    for (const m of this.glowMaterials) m.dispose();
    this.root.removeFromParent();
  }
}

export function resolveColor(key: string, palette: MechPalette): string {
  if (key in palette) return (palette as unknown as Record<string, string>)[key];
  if (key in NAMED_COLORS) return NAMED_COLORS[key];
  return key;
}

export function humanoidDims(p: Proportions): HumanoidDims {
  const thigh = 0.24 * p.legs;
  const shin = 0.26 * p.legs;
  const footH = 0.09;
  const chestW = 0.54 * p.bulk;
  return {
    thigh,
    shin,
    footH,
    hipY: thigh + shin + footH,
    waistH: 0.12,
    chestH: 0.38,
    chestW,
    chestD: 0.36 * p.bulk,
    headS: 0.42 * p.head,
    shoulderX: (chestW / 2 + 0.1) * p.shoulders,
    shoulderY: 0.3,
    upperArm: 0.22 * p.arms,
    foreArm: 0.24 * p.arms,
    hipX: 0.13 * p.bulk,
  };
}

/** Create the humanoid joint hierarchy. */
function humanoidRig(model: MechModel, d: HumanoidDims): void {
  const J = (name: string, parent: THREE.Object3D, x: number, y: number, z: number) => {
    const o = new THREE.Group();
    o.name = name;
    o.position.set(x, y, z);
    parent.add(o);
    model.joints.set(name, o);
    return o;
  };
  const hips = J('hips', model.body, 0, d.hipY, 0);
  const waist = J('waist', hips, 0, 0.02, 0);
  const chest = J('chest', waist, 0, d.waistH, 0);
  J('head', chest, 0, d.chestH + 0.01, 0.01);
  for (const S of ['L', 'R'] as const) {
    const x = S === 'L' ? 1 : -1;
    const sh = J(`shoulder${S}`, chest, x * d.shoulderX, d.shoulderY, 0);
    const el = J(`elbow${S}`, sh, 0, -d.upperArm - 0.04, 0);
    J(`hand${S}`, el, 0, -d.foreArm, 0);
    const th = J(`thigh${S}`, hips, x * d.hipX, -0.02, 0);
    const kn = J(`knee${S}`, th, 0, -d.thigh, 0);
    J(`foot${S}`, kn, 0, -d.shin, 0);
  }
  model.height = d.hipY + 0.02 + d.waistH + d.chestH + d.headS * 0.95;
  model.radius = Math.max(0.36, d.shoulderX + 0.1);
}

const tmpMat = new THREE.Matrix4();
const tmpQuat = new THREE.Quaternion();
const tmpEuler = new THREE.Euler();
const tmpScale = new THREE.Vector3();
const tmpPos = new THREE.Vector3();
const mirrorMat = new THREE.Matrix4().makeScale(-1, 1, 1);

function specMatrix(spec: PartSpec): THREE.Matrix4 {
  const [px, py, pz] = spec.pos ?? [0, 0, 0];
  const [rx, ry, rz] = spec.rot ?? [0, 0, 0];
  const s = spec.scale ?? 1;
  if (typeof s === 'number') tmpScale.set(s, s, s);
  else tmpScale.set(s[0], s[1], s[2]);
  tmpQuat.setFromEuler(tmpEuler.set(rx, ry, rz));
  return tmpMat.compose(tmpPos.set(px, py, pz), tmpQuat, tmpScale);
}

function bakedGeometry(spec: PartSpec, color: THREE.Color, mirror: boolean): THREE.BufferGeometry {
  let g = spec.geo.index ? spec.geo.toNonIndexed() : spec.geo.clone();
  // Keep only position/normal/uv for merge compatibility.
  for (const name of Object.keys(g.attributes)) {
    if (name !== 'position' && name !== 'normal' && name !== 'uv') g.deleteAttribute(name);
  }
  if (!g.getAttribute('uv')) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.getAttribute('position').count * 2), 2));
  g.clearGroups();
  const m = specMatrix(spec).clone();
  if (mirror) {
    m.premultiply(mirrorMat);
  }
  g.applyMatrix4(m);
  if (mirror) {
    // Mirroring flips triangle winding; swap two vertices of each triangle.
    flipWinding(g);
  }
  const n = g.getAttribute('position').count;
  const colors = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return g;
}

function flipWinding(g: THREE.BufferGeometry): void {
  for (const name of ['position', 'normal', 'uv'] as const) {
    const attr = g.getAttribute(name) as THREE.BufferAttribute | undefined;
    if (!attr) continue;
    const size = attr.itemSize;
    const arr = attr.array as Float32Array;
    for (let t = 0; t < attr.count; t += 3) {
      for (let k = 0; k < size; k++) {
        const a = (t + 1) * size + k;
        const b = (t + 2) * size + k;
        const tmp = arr[a];
        arr[a] = arr[b];
        arr[b] = tmp;
      }
    }
    attr.needsUpdate = true;
  }
}

export interface BuildOptions {
  /** Outline color (defaults to deep ink). */
  outline?: THREE.ColorRepresentation;
  outlineThickness?: number;
  castShadow?: boolean;
}

export function buildMech(bp: MechBlueprint, opts: BuildOptions = {}): MechModel {
  const model = new MechModel(bp);
  const p: Proportions = { ...DEFAULT_PROPORTIONS, ...bp.proportions };
  let seed = hashString(JSON.stringify(bp));
  const ctx: BuildContext = {
    palette: bp.palette,
    p,
    rand: () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    },
  };

  // Frames other than humanoid are registered by their own modules (see frames/*).
  const frame = FRAMES[bp.frame] ?? FRAMES.humanoid;
  const results = frame.assemble(model, bp, ctx);

  // Collect parts per joint.
  const byJoint: JointParts = {};
  for (const r of results) {
    for (const [j, parts] of Object.entries(r.joints)) {
      (byJoint[j] ??= []).push(...parts);
    }
    if (r.sockets) {
      for (const [name, s] of Object.entries(r.sockets)) {
        if (!s) continue;
        const joint = model.joints.get(s.joint);
        if (joint) model.sockets.set(name as SocketName, { joint, pos: new THREE.Vector3(...s.pos) });
      }
    }
  }

  const mat = toonMaterial({ vertexColors: true, finish: bp.finish ?? 'plastic' });
  model.materials.push(mat);
  const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(1, 1, 1), toneMapped: true });
  model.glowMaterials.push(glowMat);

  const colorCache = new Map<string, THREE.Color>();
  const colorOf = (key: string) => {
    let c = colorCache.get(key);
    if (!c) {
      c = new THREE.Color(resolveColor(key, bp.palette));
      colorCache.set(key, c);
    }
    return c;
  };

  for (const [jointName, parts] of Object.entries(byJoint)) {
    const joint = model.joints.get(jointName);
    if (!joint) continue;
    const solid: THREE.BufferGeometry[] = [];
    const glow: THREE.BufferGeometry[] = [];
    for (const spec of parts) {
      const isGlow = spec.glow || spec.color === 'glow';
      const base = colorOf(spec.color === 'glow' ? 'glow' : spec.color);
      const c = isGlow ? base.clone().multiplyScalar(spec.glowIntensity ?? 2.5) : base;
      const list = isGlow ? glow : solid;
      list.push(bakedGeometry(spec, c, false));
      if (spec.mirror) list.push(bakedGeometry(spec, c, true));
    }
    if (solid.length) {
      const g = mergeGeometries(solid, false);
      solid.forEach((s) => s.dispose());
      if (g) {
        const mesh = new THREE.Mesh(g, mat);
        mesh.castShadow = opts.castShadow ?? true;
        mesh.receiveShadow = true;
        mesh.name = `${jointName}-solid`;
        joint.add(mesh);
        model.pieces.push(mesh);
      }
    }
    if (glow.length) {
      const g = mergeGeometries(glow, false);
      glow.forEach((s) => s.dispose());
      if (g) {
        const mesh = new THREE.Mesh(g, glowMat);
        mesh.name = `${jointName}-glow`;
        mesh.userData.noOutline = true;
        joint.add(mesh);
      }
    }
  }

  addOutlines(model.body, opts.outline ?? 0x14101c, opts.outlineThickness ?? 1);
  model.root.scale.setScalar(bp.scale);
  model.height *= bp.scale;
  model.radius *= bp.scale;
  model.animator = frame.animator(model, bp);
  return model;
}

// ---------------------------------------------------------------- frames

export interface FrameDef {
  assemble(model: MechModel, bp: MechBlueprint, ctx: BuildContext): SlotResult[];
  animator(model: MechModel, bp: MechBlueprint): MechAnimator;
}

export const FRAMES: Record<string, FrameDef> = {
  humanoid: {
    assemble(model, bp, ctx) {
      const d = humanoidDims(ctx.p);
      humanoidRig(model, d);
      const out: SlotResult[] = [];
      const add = (r: SlotResult | undefined) => r && out.push(r);
      add(getPart('head', bp.head)?.({ ctx, d }) ?? getPart('head', 'hero')!({ ctx, d }));
      add(getPart('torso', bp.torso)?.({ ctx, d }) ?? getPart('torso', 'hero')!({ ctx, d }));
      const arms = getPart('arms', bp.arms) ?? getPart('arms', 'standard')!;
      add(arms({ ctx, d, side: 'L' }));
      add(arms({ ctx, d, side: 'R' }));
      add(getPart('legs', bp.legs)?.({ ctx, d }) ?? getPart('legs', 'standard')!({ ctx, d }));
      add(getPart('back', bp.back)?.({ ctx, d }));
      add(getPart('weapon', bp.weaponR)?.({ ctx, d, side: 'R' }));
      add(getPart('weapon', bp.weaponL)?.({ ctx, d, side: 'L' }));
      for (const deco of bp.deco ?? []) add(getPart('deco', deco)?.({ ctx, d }));
      return out;
    },
    animator(model, bp) {
      return new HumanoidAnimator(model, bp);
    },
  },
};

export function registerFrame(kind: string, def: FrameDef): void {
  FRAMES[kind] = def;
}
