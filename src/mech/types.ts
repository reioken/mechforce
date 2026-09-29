import type * as THREE from 'three';
import type { Finish } from '../engine/toon';

/**
 * Data model for procedurally assembled capsule-toy mechs.
 *
 * A MechBlueprint is pure data (serializable) — it lives in the toy roster and
 * in save files (fusions produce new blueprints). The builder turns it into a
 * rigged, cel-shaded Three.js model.
 */

export type ColorKey = 'main' | 'sub' | 'accent' | 'dark' | 'glow' | 'white' | 'black' | 'metal' | 'skin';

export interface MechPalette {
  /** Primary armor color. */
  main: string;
  /** Secondary armor color. */
  sub: string;
  /** Trim / details (often gold or yellow). */
  accent: string;
  /** Inner frame / joints. */
  dark: string;
  /** Eyes, visor, energy lines (rendered as HDR glow). */
  glow: string;
}

export type FrameKind = 'humanoid' | 'beast' | 'tank' | 'flyer' | 'serpent' | 'spider' | 'orb';

export interface Proportions {
  /** Multiplier on head size (SD look ≈ 1.0–1.3). */
  head: number;
  /** Torso width/bulk. */
  bulk: number;
  /** Arm length multiplier. */
  arms: number;
  /** Leg length multiplier. */
  legs: number;
  /** Shoulder width multiplier. */
  shoulders: number;
}

export interface MechBlueprint {
  frame: FrameKind;
  /** Overall scale; 1.0 = standard toy (~1.6 world units tall). */
  scale: number;
  proportions?: Partial<Proportions>;
  head: string;
  torso: string;
  arms: string;
  legs: string;
  back?: string;
  weaponR?: string;
  weaponL?: string;
  /** Extra decorations: horns, crest, scarf, antenna, etc. */
  deco?: string[];
  palette: MechPalette;
  finish?: Finish;
}

/** A primitive placed in a joint's local space. */
export interface PartSpec {
  geo: THREE.BufferGeometry;
  color: ColorKey | string;
  pos?: [number, number, number];
  rot?: [number, number, number];
  scale?: number | [number, number, number];
  /** Also emit a copy mirrored across X (x -> -x). */
  mirror?: boolean;
  /** Renders unlit/glowing regardless of color key. */
  glow?: boolean;
  /** Glow intensity multiplier. */
  glowIntensity?: number;
}

/** Named sockets where effects and projectiles originate (joint-local). */
export type SocketName = 'muzzleR' | 'muzzleL' | 'eye' | 'back' | 'chest' | 'thrusterL' | 'thrusterR' | 'melee';

export interface SocketSpec {
  joint: string;
  pos: [number, number, number];
}

export interface PartResult {
  parts: PartSpec[];
  sockets?: Partial<Record<SocketName, [number, number, number]>>;
}

export interface BuildContext {
  palette: MechPalette;
  p: Proportions;
  /** Deterministic variety per blueprint. */
  rand: () => number;
}
