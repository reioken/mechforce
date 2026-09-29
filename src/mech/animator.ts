import * as THREE from 'three';
import type { MechModel } from './builder';
import type { MechBlueprint } from './types';

/**
 * Procedural animation for toy mechs. Gameplay writes an AnimState every tick;
 * the animator turns it into joint rotations with per-joint smoothing, plus
 * squash & stretch "impulses" for juicy jumps, landings and hits.
 */

export interface AnimState {
  /** Planar velocity in the mech's local frame: x = toward its left (+X), z = forward. */
  localVel: { x: number; z: number };
  /** Planar speed normalized to the mech's max run speed (0..1+). */
  speed: number;
  grounded: boolean;
  vy: number;
  boosting: boolean;
  dashing: boolean;
  /** 0..1 blend of the right-arm aim pose. */
  aimR: number;
  /** 0..1 blend of the left-arm aim pose. */
  aimL: number;
  /** Radians, positive = aiming upward. */
  aimPitch: number;
  /** Relative yaw of the look/lock target (radians, + = to the mech's left). */
  lookYaw: number;
  /** Current action pose name (see ACTIONS) or null. */
  action: string | null;
  /** 0..1 progress through the action. */
  actionT: number;
  /** Seconds since spawn (drives idle cycles). */
  time: number;
}

export function defaultAnimState(): AnimState {
  return {
    localVel: { x: 0, z: 0 },
    speed: 0,
    grounded: true,
    vy: 0,
    boosting: false,
    dashing: false,
    aimR: 0,
    aimL: 0,
    aimPitch: 0,
    lookYaw: 0,
    action: null,
    actionT: 0,
    time: 0,
  };
}

export interface MechAnimator {
  update(dt: number, s: AnimState): void;
  /** Squash/stretch kick: 'jump' | 'land' | 'hit' | 'fire' | 'spawn'. */
  impulse(kind: string, strength?: number): void;
}

type V3 = [number, number, number];
export type Pose = Partial<Record<string, V3>>;

interface ActionKey {
  t: number;
  pose: Pose;
}

/** Keyframed action poses for humanoids. Joint names with L/R are explicit. */
export const HUMANOID_ACTIONS: Record<string, { keys: ActionKey[]; stiffness?: number }> = {
  shoot: {
    stiffness: 40,
    keys: [
      { t: 0, pose: { shoulderR: [-1.6, 0, 0], elbowR: [-0.05, 0, 0] } },
      { t: 0.25, pose: { shoulderR: [-1.9, 0, 0], elbowR: [-0.5, 0, 0], _body: [-0.08, 0, 0] } },
      { t: 1, pose: { shoulderR: [-1.6, 0, 0], elbowR: [-0.05, 0, 0] } },
    ],
  },
  heavyShot: {
    stiffness: 30,
    keys: [
      { t: 0, pose: { shoulderR: [-1.55, 0, 0], shoulderL: [-1.3, 0, -0.3], elbowL: [-0.6, 0, 0], thighL: [-0.5, 0, 0], kneeL: [0.6, 0, 0], thighR: [0.3, 0, 0], kneeR: [0.4, 0, 0], _body: [0.05, 0, 0] } },
      { t: 0.2, pose: { shoulderR: [-2.1, 0, 0], elbowR: [-0.6, 0, 0], _body: [-0.25, 0, 0] } },
      { t: 1, pose: { shoulderR: [-1.55, 0, 0], _body: [0, 0, 0] } },
    ],
  },
  slash1: {
    stiffness: 55,
    keys: [
      { t: 0, pose: { shoulderR: [-1.9, 0.9, 0.9], elbowR: [-1.2, 0, 0], waist: [0, -0.7, 0], _body: [0.1, 0, 0] } },
      { t: 0.35, pose: { shoulderR: [-1.4, -0.6, 0.2], elbowR: [-0.25, 0, 0], waist: [0, 0.7, 0], _body: [0.25, 0, 0] } },
      { t: 1, pose: { shoulderR: [-1.0, -0.8, 0.1], elbowR: [-0.4, 0, 0], waist: [0, 0.5, 0], _body: [0.15, 0, 0] } },
    ],
  },
  slash2: {
    stiffness: 55,
    keys: [
      { t: 0, pose: { shoulderR: [-1.2, -0.9, 0.2], elbowR: [-0.9, 0, 0], waist: [0, 0.8, 0] } },
      { t: 0.35, pose: { shoulderR: [-1.6, 0.8, 1.0], elbowR: [-0.2, 0, 0], waist: [0, -0.7, 0], _body: [0.2, 0, 0] } },
      { t: 1, pose: { shoulderR: [-1.2, 0.8, 1.0], elbowR: [-0.4, 0, 0], waist: [0, -0.5, 0], _body: [0.1, 0, 0] } },
    ],
  },
  slash3: {
    stiffness: 50,
    keys: [
      { t: 0, pose: { shoulderR: [-3.0, 0, 0.2], shoulderL: [-2.8, 0, -0.2], elbowR: [-0.5, 0, 0], elbowL: [-0.5, 0, 0], _body: [-0.2, 0, 0], thighL: [-0.4, 0, 0], kneeL: [0.4, 0, 0] } },
      { t: 0.4, pose: { shoulderR: [-0.7, 0, 0.1], shoulderL: [-0.7, 0, -0.1], elbowR: [-0.2, 0, 0], elbowL: [-0.2, 0, 0], _body: [0.5, 0, 0], thighL: [-0.9, 0, 0], kneeL: [0.9, 0, 0], thighR: [0.4, 0, 0], kneeR: [0.5, 0, 0], _bodyPos: [0, -0.12, 0] } },
      { t: 1, pose: { shoulderR: [-0.6, 0, 0.1], shoulderL: [-0.6, 0, -0.1], _body: [0.4, 0, 0], thighL: [-0.8, 0, 0], kneeL: [0.9, 0, 0], _bodyPos: [0, -0.1, 0] } },
    ],
  },
  punch: {
    stiffness: 60,
    keys: [
      { t: 0, pose: { shoulderR: [-0.8, 0, 0.3], elbowR: [-2.0, 0, 0], waist: [0, -0.5, 0] } },
      { t: 0.3, pose: { shoulderR: [-1.65, 0, 0], elbowR: [-0.05, 0, 0], waist: [0, 0.45, 0], _body: [0.2, 0, 0] } },
      { t: 1, pose: { shoulderR: [-1.5, 0, 0], elbowR: [-0.2, 0, 0], waist: [0, 0.3, 0], _body: [0.1, 0, 0] } },
    ],
  },
  punchL: {
    stiffness: 60,
    keys: [
      { t: 0, pose: { shoulderL: [-0.8, 0, -0.3], elbowL: [-2.0, 0, 0], waist: [0, 0.5, 0] } },
      { t: 0.3, pose: { shoulderL: [-1.65, 0, 0], elbowL: [-0.05, 0, 0], waist: [0, -0.45, 0], _body: [0.2, 0, 0] } },
      { t: 1, pose: { shoulderL: [-1.5, 0, 0], elbowL: [-0.2, 0, 0], waist: [0, -0.3, 0], _body: [0.1, 0, 0] } },
    ],
  },
  uppercut: {
    stiffness: 55,
    keys: [
      { t: 0, pose: { shoulderR: [0.3, 0, 0.3], elbowR: [-1.8, 0, 0], _body: [0.3, 0, 0], _bodyPos: [0, -0.12, 0], kneeL: [0.8, 0, 0], kneeR: [0.8, 0, 0], thighL: [-0.6, 0, 0], thighR: [-0.6, 0, 0] } },
      { t: 0.35, pose: { shoulderR: [-2.9, 0, 0.1], elbowR: [-0.4, 0, 0], _body: [-0.25, 0, 0], _bodyPos: [0, 0.1, 0] } },
      { t: 1, pose: { shoulderR: [-2.7, 0, 0.1], elbowR: [-0.4, 0, 0], _body: [-0.15, 0, 0] } },
    ],
  },
  spin: {
    stiffness: 70,
    keys: [
      { t: 0, pose: { shoulderR: [-1.4, 0, 1.2], shoulderL: [-1.4, 0, -1.2], _body: [0.15, 0, 0], _bodyYaw: [0, 0, 0] } },
      { t: 1, pose: { shoulderR: [-1.4, 0, 1.2], shoulderL: [-1.4, 0, -1.2], _body: [0.15, 0, 0], _bodyYaw: [Math.PI * 4, 0, 0] } },
    ],
  },
  thrust: {
    stiffness: 60,
    keys: [
      { t: 0, pose: { shoulderR: [-0.9, 0, 0.2], elbowR: [-1.6, 0, 0], waist: [0, -0.6, 0], thighL: [-0.3, 0, 0] } },
      { t: 0.3, pose: { shoulderR: [-1.6, 0, 0], elbowR: [0, 0, 0], waist: [0, 0.4, 0], _body: [0.35, 0, 0], thighL: [-0.8, 0, 0], kneeL: [0.6, 0, 0], thighR: [0.5, 0, 0] } },
      { t: 1, pose: { shoulderR: [-1.55, 0, 0], elbowR: [-0.1, 0, 0], waist: [0, 0.3, 0], _body: [0.25, 0, 0] } },
    ],
  },
  charge: {
    stiffness: 20,
    keys: [
      { t: 0, pose: { shoulderR: [0.4, 0, 0.5], shoulderL: [0.4, 0, -0.5], elbowR: [-1.4, 0, 0], elbowL: [-1.4, 0, 0], _body: [0.2, 0, 0], _bodyPos: [0, -0.1, 0], thighL: [-0.5, 0, 0.25], thighR: [-0.5, 0, -0.25], kneeL: [0.9, 0, 0], kneeR: [0.9, 0, 0] } },
      { t: 1, pose: { shoulderR: [0.5, 0, 0.6], shoulderL: [0.5, 0, -0.6], elbowR: [-1.6, 0, 0], elbowL: [-1.6, 0, 0], _body: [0.25, 0, 0], _bodyPos: [0, -0.12, 0], thighL: [-0.55, 0, 0.3], thighR: [-0.55, 0, -0.3], kneeL: [1.0, 0, 0], kneeR: [1.0, 0, 0] } },
    ],
  },
  cast: {
    stiffness: 35,
    keys: [
      { t: 0, pose: { shoulderR: [-1.55, 0, -0.15], shoulderL: [-1.55, 0, 0.15], elbowR: [-0.1, 0, 0], elbowL: [-0.1, 0, 0], _body: [-0.1, 0, 0], thighL: [-0.4, 0, 0.2], thighR: [0.3, 0, -0.2], kneeL: [0.4, 0, 0], kneeR: [0.3, 0, 0] } },
      { t: 1, pose: { shoulderR: [-1.55, 0, -0.15], shoulderL: [-1.55, 0, 0.15], elbowR: [-0.1, 0, 0], elbowL: [-0.1, 0, 0], _body: [-0.15, 0, 0], thighL: [-0.4, 0, 0.2], thighR: [0.3, 0, -0.2], kneeL: [0.4, 0, 0], kneeR: [0.3, 0, 0] } },
    ],
  },
  slam: {
    stiffness: 45,
    keys: [
      { t: 0, pose: { shoulderR: [-3.0, 0, 0.4], shoulderL: [-3.0, 0, -0.4], elbowR: [-0.8, 0, 0], elbowL: [-0.8, 0, 0], _body: [-0.2, 0, 0], thighL: [-0.9, 0, 0], thighR: [-0.9, 0, 0], kneeL: [1.3, 0, 0], kneeR: [1.3, 0, 0] } },
      { t: 0.5, pose: { shoulderR: [-3.0, 0, 0.4], shoulderL: [-3.0, 0, -0.4], _body: [-0.1, 0, 0] } },
      { t: 0.65, pose: { shoulderR: [-0.3, 0, 0.3], shoulderL: [-0.3, 0, -0.3], elbowR: [-0.1, 0, 0], elbowL: [-0.1, 0, 0], _body: [0.5, 0, 0], _bodyPos: [0, -0.15, 0], thighL: [-0.9, 0, 0.3], thighR: [-0.9, 0, -0.3], kneeL: [1.3, 0, 0], kneeR: [1.3, 0, 0] } },
      { t: 1, pose: { shoulderR: [-0.3, 0, 0.3], shoulderL: [-0.3, 0, -0.3], _body: [0.4, 0, 0], _bodyPos: [0, -0.13, 0], thighL: [-0.8, 0, 0.3], thighR: [-0.8, 0, -0.3], kneeL: [1.2, 0, 0], kneeR: [1.2, 0, 0] } },
    ],
  },
  guard: {
    stiffness: 40,
    keys: [
      { t: 0, pose: { shoulderR: [-1.3, 0, 0.4], shoulderL: [-1.3, 0, -0.4], elbowR: [-1.7, -0.5, 0], elbowL: [-1.7, 0.5, 0], _body: [0.1, 0, 0], _bodyPos: [0, -0.05, 0], thighL: [-0.4, 0, 0.1], thighR: [0.2, 0, -0.1], kneeL: [0.5, 0, 0], kneeR: [0.5, 0, 0] } },
      { t: 1, pose: { shoulderR: [-1.3, 0, 0.4], shoulderL: [-1.3, 0, -0.4], elbowR: [-1.7, -0.5, 0], elbowL: [-1.7, 0.5, 0], _body: [0.1, 0, 0], _bodyPos: [0, -0.05, 0], thighL: [-0.4, 0, 0.1], thighR: [0.2, 0, -0.1], kneeL: [0.5, 0, 0], kneeR: [0.5, 0, 0] } },
    ],
  },
  hit: {
    stiffness: 45,
    keys: [
      { t: 0, pose: { _body: [-0.45, 0, 0.1], head: [-0.4, 0, 0], shoulderR: [0.2, 0, 0.7], shoulderL: [0.2, 0, -0.7], elbowR: [-0.6, 0, 0], elbowL: [-0.6, 0, 0], waist: [-0.2, 0.2, 0] } },
      { t: 1, pose: { _body: [-0.1, 0, 0], head: [-0.1, 0, 0], shoulderR: [0, 0, 0.3], shoulderL: [0, 0, -0.3] } },
    ],
  },
  down: {
    stiffness: 22,
    keys: [
      { t: 0, pose: { _body: [-0.9, 0, 0], _bodyPos: [0, 0.1, -0.2], head: [-0.4, 0, 0], shoulderR: [-2.5, 0, 0.8], shoulderL: [-2.5, 0, -0.8], thighL: [-0.6, 0, 0.3], thighR: [-0.9, 0, -0.3], kneeL: [0.5, 0, 0], kneeR: [0.9, 0, 0] } },
      { t: 0.25, pose: { _body: [-1.5, 0, 0], _bodyPos: [0, 0.18, -0.6], head: [0.2, 0, 0], shoulderR: [-2.9, 0, 0.9], shoulderL: [-2.9, 0, -0.9], thighL: [-0.3, 0, 0.2], thighR: [-0.5, 0, -0.2], kneeL: [0.3, 0, 0], kneeR: [0.6, 0, 0] } },
      { t: 1, pose: { _body: [-1.52, 0, 0], _bodyPos: [0, 0.16, -0.62], head: [0.25, 0, 0], shoulderR: [-2.9, 0, 0.9], shoulderL: [-2.9, 0, -0.9], thighL: [-0.25, 0, 0.2], thighR: [-0.5, 0, -0.2], kneeL: [0.3, 0, 0], kneeR: [0.6, 0, 0] } },
    ],
  },
  getup: {
    stiffness: 25,
    keys: [
      { t: 0, pose: { _body: [-1.5, 0, 0], _bodyPos: [0, 0.16, -0.6] } },
      { t: 0.5, pose: { _body: [0.6, 0, 0], _bodyPos: [0, -0.2, 0], thighL: [-1.2, 0, 0.2], thighR: [-1.2, 0, -0.2], kneeL: [1.8, 0, 0], kneeR: [1.8, 0, 0], shoulderR: [-0.4, 0, 0.3], shoulderL: [-0.4, 0, -0.3] } },
      { t: 1, pose: {} },
    ],
  },
  victory: {
    stiffness: 18,
    keys: [
      { t: 0, pose: { shoulderR: [-2.9, 0, 0.2], elbowR: [-0.4, 0, 0], shoulderL: [0, 0, -0.35], elbowL: [-1.6, 0, 0], _body: [-0.1, 0, 0], head: [-0.2, 0, 0], thighL: [-0.1, 0, 0.2], thighR: [0.05, 0, -0.2] } },
      { t: 1, pose: { shoulderR: [-3.0, 0, 0.15], elbowR: [-0.2, 0, 0], shoulderL: [0, 0, -0.35], elbowL: [-1.6, 0, 0], _body: [-0.12, 0, 0], head: [-0.25, 0, 0], thighL: [-0.1, 0, 0.2], thighR: [0.05, 0, -0.2] } },
    ],
  },
  pose: {
    stiffness: 16,
    keys: [
      { t: 0, pose: { shoulderR: [-1.5, 0.6, 0.2], elbowR: [-0.2, 0, 0], shoulderL: [-0.2, 0, -0.6], elbowL: [-1.4, 0, 0], waist: [0, 0.35, 0], thighL: [-0.3, 0, 0.35], thighR: [0.2, 0, -0.35], kneeL: [0.3, 0, 0], head: [0.05, -0.2, 0] } },
      { t: 1, pose: { shoulderR: [-1.55, 0.65, 0.2], elbowR: [-0.15, 0, 0], shoulderL: [-0.2, 0, -0.6], elbowL: [-1.4, 0, 0], waist: [0, 0.4, 0], thighL: [-0.3, 0, 0.35], thighR: [0.2, 0, -0.35], kneeL: [0.3, 0, 0], head: [0.05, -0.25, 0] } },
    ],
  },
};

const GUN_WEAPONS = new Set(['rifle', 'bazooka', 'gatling', 'staff']);
const BLADE_WEAPONS = new Set(['saber', 'sword', 'hammer', 'drill', 'claws']);

export class HumanoidAnimator implements MechAnimator {
  private cur = new Map<string, THREE.Euler>();
  private phase = 0;
  private squash = 0;
  private squashVel = 0;
  private bodyRot = new THREE.Euler();
  private bodyPos = new THREE.Vector3();
  private stance: 'gun' | 'blade' | 'fists';
  private readonly target = new Map<string, V3>();

  constructor(private readonly model: MechModel, bp: MechBlueprint) {
    this.stance = GUN_WEAPONS.has(bp.weaponR ?? '') ? 'gun' : BLADE_WEAPONS.has(bp.weaponR ?? '') ? 'blade' : 'fists';
    for (const [name, j] of model.joints) this.cur.set(name, j.rotation.clone());
  }

  impulse(kind: string, strength = 1): void {
    switch (kind) {
      case 'jump':
        this.squashVel += 3.2 * strength;
        break;
      case 'land':
        this.squashVel -= 4.5 * strength;
        break;
      case 'hit':
        this.squashVel -= 2.5 * strength;
        break;
      case 'fire':
        this.squashVel -= 1.2 * strength;
        break;
      case 'spawn':
        this.squash = -0.6;
        this.squashVel = 6;
        break;
    }
  }

  update(dt: number, s: AnimState): void {
    const T = this.target;
    T.clear();
    const set = (j: string, x: number, y = 0, z = 0) => T.set(j, [x, y, z]);
    const add = (j: string, x: number, y = 0, z = 0) => {
      const v = T.get(j) ?? [0, 0, 0];
      T.set(j, [v[0] + x, v[1] + y, v[2] + z]);
    };

    // ---- base: idle breathing + stance
    const breathe = Math.sin(s.time * 2.4);
    set('hips', 0);
    set('waist', 0.02 * breathe);
    set('chest', -0.02 * breathe);
    set('head', 0.03 * breathe, clamp(s.lookYaw, -0.9, 0.9) * 0.6, 0);
    const armOut = 0.14 + 0.03 * breathe;
    set('shoulderL', 0.05, 0, armOut);
    set('shoulderR', 0.05, 0, -armOut);
    set('elbowL', -0.3);
    set('elbowR', -0.3);
    set('handL', 0);
    set('handR', 0);
    if (this.stance === 'gun') {
      set('shoulderR', -0.35, 0.1, -0.12);
      set('elbowR', -1.2);
      set('handR', 0.1);
    } else if (this.stance === 'blade') {
      set('shoulderR', -0.25, 0, -0.3);
      set('elbowR', -0.9);
      set('handR', 0.5);
    } else {
      set('shoulderR', -0.5, 0, -0.2);
      set('shoulderL', -0.5, 0, 0.2);
      set('elbowR', -1.7);
      set('elbowL', -1.7);
    }
    set('thighL', -0.05, 0, 0.08);
    set('thighR', 0.05, 0, -0.08);
    set('kneeL', 0.12 + 0.02 * breathe);
    set('kneeR', 0.12 + 0.02 * breathe);
    set('footL', -0.07);
    set('footR', -0.07);

    let bodyX = 0;
    let bodyZ = 0;
    let bodyY = 0;
    let bodyPy = 0.004 * breathe;
    let bodyPz = 0;

    // ---- locomotion
    const vf = s.localVel.z;
    const vl = s.localVel.x;
    const spd = clamp(s.speed, 0, 1.4);
    if (s.grounded && !s.dashing) {
      const dir = Math.atan2(vl, vf);
      const back = vf < -0.1 ? -1 : 1;
      const lateral = Math.abs(Math.sin(dir));
      this.phase += dt * (5 + 8 * spd) * back * (spd > 0.05 ? 1 : 0);
      const ph = this.phase;
      const amt = clamp(spd, 0, 1);
      const pitchAmt = amt * (1 - lateral * 0.7);
      const rollAmt = amt * lateral;
      add('thighL', -Math.sin(ph) * 0.8 * pitchAmt, 0, Math.max(0, Math.sin(ph)) * 0.35 * rollAmt);
      add('thighR', Math.sin(ph) * 0.8 * pitchAmt, 0, -Math.max(0, -Math.sin(ph)) * 0.35 * rollAmt);
      add('kneeL', Math.max(0, Math.cos(ph)) * 1.1 * amt);
      add('kneeR', Math.max(0, -Math.cos(ph)) * 1.1 * amt);
      if (this.stance === 'fists') {
        add('shoulderL', Math.sin(ph) * 0.3 * amt);
        add('shoulderR', -Math.sin(ph) * 0.3 * amt);
      } else {
        add('shoulderL', Math.sin(ph) * 0.6 * amt);
        if (this.stance === 'blade') add('shoulderR', -Math.sin(ph) * 0.4 * amt);
      }
      add('waist', 0, Math.sin(ph) * 0.18 * amt, 0);
      bodyPy += Math.abs(Math.cos(ph)) * 0.05 * amt - 0.03 * amt;
      bodyX += 0.16 * clamp(vf / 6, -1, 1);
      bodyZ -= 0.14 * clamp(vl / 6, -1, 1);
    } else if (!s.grounded && !s.dashing) {
      // Airborne
      const rising = s.vy > 0;
      if (s.boosting) {
        set('thighL', -0.1, 0, 0.1);
        set('thighR', 0.15, 0, -0.1);
        set('kneeL', 0.35);
        set('kneeR', 0.55);
        set('footL', 0.5);
        set('footR', 0.5);
        bodyX += 0.22 * clamp(vf / 6, -1, 1);
        bodyZ -= 0.22 * clamp(vl / 6, -1, 1);
      } else if (rising) {
        set('thighL', -0.9, 0, 0.1);
        set('thighR', -0.3, 0, -0.1);
        set('kneeL', 1.4);
        set('kneeR', 0.9);
        add('shoulderL', 0.3, 0, 0.3);
        if (this.stance === 'fists') add('shoulderR', 0.3, 0, -0.3);
      } else {
        set('thighL', -0.35, 0, 0.18);
        set('thighR', -0.1, 0, -0.18);
        set('kneeL', 0.6);
        set('kneeR', 0.4);
        add('shoulderL', -0.2, 0, 0.55);
        if (this.stance === 'fists') add('shoulderR', -0.2, 0, -0.55);
      }
    }
    if (s.dashing) {
      const d = Math.hypot(vf, vl) || 1;
      bodyX += 0.5 * (vf / d);
      bodyZ -= 0.5 * (vl / d);
      set('thighL', 0.5, 0, 0.1);
      set('thighR', 0.8, 0, -0.1);
      set('kneeL', 1.0);
      set('kneeR', 1.3);
      set('footL', 0.6);
      set('footR', 0.6);
      add('shoulderL', 0.8, 0, 0.3);
      if (this.stance !== 'gun') add('shoulderR', 0.8, 0, -0.3);
    }

    // ---- aim overlays
    if (s.aimR > 0.001) {
      blendInto(T, 'shoulderR', [-Math.PI / 2 - s.aimPitch, 0.05, 0], s.aimR);
      blendInto(T, 'elbowR', [-0.05, 0, 0], s.aimR);
      blendInto(T, 'handR', [0, 0, 0], s.aimR);
      add('chest', 0, 0.25 * s.aimR, 0);
    }
    if (s.aimL > 0.001) {
      blendInto(T, 'shoulderL', [-Math.PI / 2 - s.aimPitch, -0.05, 0], s.aimL);
      blendInto(T, 'elbowL', [-0.05, 0, 0], s.aimL);
      add('chest', 0, -0.25 * s.aimL, 0);
    }

    // ---- action pose override
    let stiffness = 16;
    let bodyYaw = 0;
    if (s.action) {
      const act = HUMANOID_ACTIONS[s.action];
      if (act) {
        const pose = samplePose(act.keys, clamp(s.actionT, 0, 1));
        for (const [j, v] of Object.entries(pose)) {
          if (!v) continue;
          if (j === '_body') {
            bodyX = v[0];
            bodyY = v[1];
            bodyZ = v[2];
          } else if (j === '_bodyPos') {
            bodyPy = v[1];
            bodyPz = v[2];
          } else if (j === '_bodyYaw') {
            bodyYaw = v[0];
          } else {
            T.set(j, v);
          }
        }
        stiffness = act.stiffness ?? 30;
      }
    }

    // ---- apply with smoothing
    const k = 1 - Math.exp(-stiffness * dt);
    for (const [name, joint] of this.model.joints) {
      const t = T.get(name);
      const c = this.cur.get(name)!;
      const tx = t ? t[0] : 0;
      const ty = t ? t[1] : 0;
      const tz = t ? t[2] : 0;
      c.x += (tx - c.x) * k;
      c.y += (ty - c.y) * k;
      c.z += (tz - c.z) * k;
      joint.rotation.set(c.x, c.y, c.z);
    }

    const kb = 1 - Math.exp(-14 * dt);
    this.bodyRot.x += (bodyX - this.bodyRot.x) * kb;
    this.bodyRot.z += (bodyZ - this.bodyRot.z) * kb;
    this.bodyRot.y = bodyYaw !== 0 ? bodyYaw : this.bodyRot.y + (bodyY - this.bodyRot.y) * kb;
    this.bodyPos.y += (bodyPy - this.bodyPos.y) * kb;
    this.bodyPos.z += (bodyPz - this.bodyPos.z) * kb;

    // ---- squash & stretch spring
    this.squashVel += (-this.squash * 180 - this.squashVel * 16) * dt;
    this.squash += this.squashVel * dt;
    const sq = clamp(this.squash, -0.45, 0.45);

    const body = this.model.body;
    body.rotation.set(this.bodyRot.x, this.bodyRot.y, this.bodyRot.z);
    body.position.set(0, this.bodyPos.y, this.bodyPos.z);
    body.scale.set(1 - sq * 0.5, 1 + sq, 1 - sq * 0.5);
  }
}

function samplePose(keys: ActionKey[], t: number): Pose {
  if (t <= keys[0].t) return keys[0].pose;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t <= b.t) {
      const u = easeOutCubic((t - a.t) / Math.max(1e-6, b.t - a.t));
      const out: Pose = {};
      const names = new Set([...Object.keys(a.pose), ...Object.keys(b.pose)]);
      for (const n of names) {
        const va = a.pose[n] ?? b.pose[n] ?? [0, 0, 0];
        const vb = b.pose[n] ?? a.pose[n] ?? [0, 0, 0];
        out[n] = [va[0] + (vb[0] - va[0]) * u, va[1] + (vb[1] - va[1]) * u, va[2] + (vb[2] - va[2]) * u];
      }
      return out;
    }
  }
  return keys[keys.length - 1].pose;
}

function blendInto(T: Map<string, V3>, j: string, v: V3, w: number): void {
  const c = T.get(j) ?? [0, 0, 0];
  T.set(j, [c[0] + (v[0] - c[0]) * w, c[1] + (v[1] - c[1]) * w, c[2] + (v[2] - c[2]) * w]);
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function clamp(v: number, a: number, b: number): number {
  return v < a ? a : v > b ? b : v;
}
