import type { BuildContext, PartSpec, SocketName } from './types';

/**
 * Part registry. Each slot maps a part name to a builder that returns primitive
 * specs grouped by joint name, plus optional sockets.
 *
 * Humanoid joint names: hips, waist, chest, head, shoulderL/R, elbowL/R, handL/R,
 * thighL/R, kneeL/R, footL/R. Other frames define their own joints.
 */

export type JointParts = Record<string, PartSpec[]>;

export interface SlotResult {
  joints: JointParts;
  sockets?: Partial<Record<SocketName, { joint: string; pos: [number, number, number] }>>;
}

/** Humanoid dimensions shared by all humanoid part builders (world units, scale 1). */
export interface HumanoidDims {
  hipY: number;
  thigh: number;
  shin: number;
  footH: number;
  waistH: number;
  chestH: number;
  chestW: number;
  chestD: number;
  headS: number;
  shoulderX: number;
  shoulderY: number;
  upperArm: number;
  foreArm: number;
  hipX: number;
}

export type Side = 'L' | 'R';

export interface PartArgs {
  ctx: BuildContext;
  d: HumanoidDims;
  /** For arms/weapons: which side. +1 = left (+X), -1 = right (-X). */
  side?: Side;
}

export type PartBuilder = (a: PartArgs) => SlotResult;

export type Slot = 'head' | 'torso' | 'arms' | 'legs' | 'back' | 'weapon' | 'deco';

const registry: Record<Slot, Map<string, PartBuilder>> = {
  head: new Map(),
  torso: new Map(),
  arms: new Map(),
  legs: new Map(),
  back: new Map(),
  weapon: new Map(),
  deco: new Map(),
};

export function registerPart(slot: Slot, name: string, fn: PartBuilder): void {
  registry[slot].set(name, fn);
}

export function getPart(slot: Slot, name: string | undefined): PartBuilder | undefined {
  if (!name) return undefined;
  return registry[slot].get(name);
}

export function listParts(slot: Slot): string[] {
  return [...registry[slot].keys()];
}

export const sx = (side: Side | undefined) => (side === 'R' ? -1 : 1);
