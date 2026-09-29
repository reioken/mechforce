import { box, cyl, sphere, cone, extrude, capsule, torus, dome, lathe, wedge, hexPrism, ico } from '../shapes';
import { registerPart, sx, type PartArgs, type SlotResult } from '../registry';
import type { PartSpec } from '../types';

/**
 * Humanoid part library — chunky SD ("super-deformed") capsule-toy proportions.
 * Coordinates: +Y up, +Z forward (the mech faces +Z), left side = +X.
 * Arms hang along -Y from the shoulder; a hand's "forward" when aiming is -Y.
 */

const P = (
  geo: PartSpec['geo'],
  color: PartSpec['color'],
  pos: [number, number, number] = [0, 0, 0],
  rot?: [number, number, number],
  extra: Partial<PartSpec> = {},
): PartSpec => ({ geo, color, pos, rot, ...extra });

// ---------------------------------------------------------------- HEADS

registerPart('head', 'hero', ({ d }): SlotResult => {
  const s = d.headS;
  const vfin = extrude([[0, 0], [0.045, -0.02], [0.34, 0.2], [0.3, 0.235]], 0.03, 0.008);
  const parts: PartSpec[] = [
    P(box(s * 0.92, s * 0.82, s * 0.9, 0.08), 'main', [0, s * 0.5, 0]),
    P(box(s * 0.25, s * 0.2, s * 0.85, 0.04), 'main', [0, s * 0.92, -0.02]),
    P(box(s * 0.66, s * 0.36, 0.06, 0.03), 'dark', [0, s * 0.42, s * 0.44]),
    // Angry hero eyes
    P(box(s * 0.2, s * 0.07, 0.03, 0.01), 'glow', [s * 0.14, s * 0.47, s * 0.475], [0, 0, 0.22], { glowIntensity: 3 }),
    P(box(s * 0.2, s * 0.07, 0.03, 0.01), 'glow', [-s * 0.14, s * 0.47, s * 0.475], [0, 0, -0.22], { glowIntensity: 3 }),
    P(box(s * 0.2, s * 0.13, 0.08, 0.025), 'sub', [0, s * 0.2, s * 0.44]),
    P(box(s * 0.16, s * 0.12, 0.06, 0.02), 'sub', [0, s * 0.72, s * 0.46]),
    P(sphere(s * 0.05), 'glow', [0, s * 0.73, s * 0.5], undefined, { glowIntensity: 2 }),
    P(vfin, 'accent', [0.01, s * 0.72, s * 0.49], [0.15, 0, 0]),
    P(vfin, 'accent', [-0.01, s * 0.72, s * 0.49], [0.15, Math.PI, 0]),
    P(cyl(s * 0.14, s * 0.14, 0.08, 14), 'sub', [s * 0.48, s * 0.48, 0], [0, 0, Math.PI / 2], { mirror: true }),
    P(cyl(s * 0.08, s * 0.08, 0.1, 12), 'accent', [s * 0.51, s * 0.48, 0], [0, 0, Math.PI / 2], { mirror: true }),
  ];
  return { joints: { head: parts }, sockets: { eye: { joint: 'head', pos: [0, s * 0.47, s * 0.5] } } };
});

registerPart('head', 'visor', ({ d }): SlotResult => {
  const s = d.headS;
  const parts: PartSpec[] = [
    P(box(s * 0.9, s * 0.86, s * 0.92, 0.14), 'main', [0, s * 0.5, 0]),
    P(box(s * 0.84, s * 0.2, 0.08, 0.04), 'glow', [0, s * 0.52, s * 0.43], undefined, { glowIntensity: 2.6 }),
    P(box(s * 0.94, s * 0.08, s * 0.95, 0.03), 'sub', [0, s * 0.66, 0]),
    P(box(s * 0.5, s * 0.14, 0.08, 0.03), 'dark', [0, s * 0.24, s * 0.43]),
    P(cyl(0.012, 0.012, s * 0.5, 6), 'dark', [s * 0.3, s * 1.05, -s * 0.1], [0, 0, -0.25]),
    P(sphere(0.03), 'glow', [s * 0.36, s * 1.28, -s * 0.1]),
    P(box(0.06, s * 0.3, s * 0.4, 0.02), 'accent', [s * 0.47, s * 0.52, 0], undefined, { mirror: true }),
  ];
  return { joints: { head: parts }, sockets: { eye: { joint: 'head', pos: [0, s * 0.52, s * 0.48] } } };
});

registerPart('head', 'mono', ({ d }): SlotResult => {
  const s = d.headS;
  const parts: PartSpec[] = [
    P(dome(s * 0.52, Math.PI * 0.62, 22), 'main', [0, s * 0.28, 0]),
    P(cyl(s * 0.5, s * 0.52, s * 0.12, 22), 'dark', [0, s * 0.24, 0]),
    P(torus(s * 0.36, 0.035, 20, Math.PI * 0.9), 'dark', [0, s * 0.46, s * 0.1], [0, 0, Math.PI * 0.05]),
    P(sphere(s * 0.1), 'glow', [0, s * 0.46, s * 0.46], undefined, { glowIntensity: 4 }),
    P(box(s * 0.18, s * 0.12, s * 0.2, 0.02), 'sub', [0, s * 0.18, s * 0.38]),
    P(cyl(0.03, 0.03, s * 0.3, 8), 'dark', [s * 0.14, s * 0.12, s * 0.4], [0.8, 0, 0], { mirror: true }),
    P(extrude([[0, 0], [0.05, 0], [0.02, 0.32], [0, 0.32]], 0.02, 0.005), 'accent', [s * 0.2, s * 0.64, -s * 0.05], [0, 0, -0.35]),
  ];
  return { joints: { head: parts }, sockets: { eye: { joint: 'head', pos: [0, s * 0.46, s * 0.5] } } };
});

registerPart('head', 'knight', ({ d }): SlotResult => {
  const s = d.headS;
  const plume = extrude([[0, 0], [0.06, 0.02], [0.02, 0.32], [-0.2, 0.34], [-0.34, 0.18], [-0.1, 0.1]], 0.05, 0.01);
  const parts: PartSpec[] = [
    P(cyl(s * 0.46, s * 0.44, s * 0.8, 20), 'main', [0, s * 0.46, 0]),
    P(dome(s * 0.46, Math.PI / 2, 20), 'main', [0, s * 0.86, 0]),
    P(box(s * 0.12, s * 0.5, 0.05, 0.02), 'dark', [0, s * 0.48, s * 0.44]),
    P(box(s * 0.62, s * 0.09, 0.05, 0.02), 'glow', [0, s * 0.58, s * 0.43], undefined, { glowIntensity: 3 }),
    P(box(s * 0.08, s * 0.9, s * 0.95, 0.03), 'accent', [0, s * 0.62, 0]),
    P(plume, 'sub', [0, s * 1.1, 0], [0, Math.PI / 2, 0]),
    P(cone(s * 0.08, s * 0.2, 8), 'accent', [0, s * 0.96, s * 0.3], [1.1, 0, 0]),
  ];
  return { joints: { head: parts }, sockets: { eye: { joint: 'head', pos: [0, s * 0.58, s * 0.48] } } };
});

registerPart('head', 'samurai', ({ d }): SlotResult => {
  const s = d.headS;
  const crescent = extrude(
    [[0, 0], [0.1, 0.05], [0.28, 0.22], [0.42, 0.46], [0.3, 0.3], [0.12, 0.14], [0, 0.1]],
    0.025,
    0.006,
  );
  const parts: PartSpec[] = [
    P(box(s * 0.8, s * 0.72, s * 0.84, 0.1), 'main', [0, s * 0.46, 0]),
    P(dome(s * 0.6, Math.PI * 0.42, 22), 'dark', [0, s * 0.6, -0.02]),
    P(cyl(s * 0.7, s * 0.8, s * 0.1, 22), 'dark', [0, s * 0.62, -0.02]),
    P(box(s * 0.3, s * 0.4, s * 0.5, 0.04), 'sub', [s * 0.5, s * 0.46, -s * 0.12], [0, 0, 0.35], { mirror: true }),
    P(box(s * 0.6, s * 0.24, 0.07, 0.03), 'dark', [0, s * 0.3, s * 0.42]),
    P(box(s * 0.18, s * 0.06, 0.03, 0.01), 'glow', [s * 0.13, s * 0.5, s * 0.43], [0, 0, 0.3], { glowIntensity: 3 }),
    P(box(s * 0.18, s * 0.06, 0.03, 0.01), 'glow', [-s * 0.13, s * 0.5, s * 0.43], [0, 0, -0.3], { glowIntensity: 3 }),
    P(crescent, 'accent', [0.02, s * 0.74, s * 0.42], [0.1, 0, 0]),
    P(crescent, 'accent', [-0.02, s * 0.74, s * 0.42], [0.1, Math.PI, 0]),
    P(sphere(s * 0.07), 'sub', [0, s * 0.76, s * 0.44]),
  ];
  return { joints: { head: parts }, sockets: { eye: { joint: 'head', pos: [0, s * 0.5, s * 0.46] } } };
});

registerPart('head', 'skull', ({ d }): SlotResult => {
  const s = d.headS;
  const horn = extrude([[0, 0], [0.08, 0], [0.2, 0.2], [0.22, 0.42], [0.12, 0.2]], 0.06, 0.012);
  const parts: PartSpec[] = [
    P(sphere(s * 0.48, 20, 14), 'main', [0, s * 0.58, 0], undefined, { scale: [1, 0.9, 1] }),
    P(box(s * 0.62, s * 0.3, s * 0.6, 0.06), 'main', [0, s * 0.24, s * 0.08]),
    P(box(s * 0.2, s * 0.14, 0.06, 0.03), 'dark', [s * 0.14, s * 0.52, s * 0.42], [0, 0, 0.2], { mirror: true }),
    P(sphere(s * 0.055), 'glow', [s * 0.14, s * 0.52, s * 0.45], undefined, { mirror: true, glowIntensity: 5 }),
    P(box(s * 0.44, s * 0.05, 0.05, 0.01), 'dark', [0, s * 0.2, s * 0.39]),
    P(box(0.03, s * 0.12, 0.05, 0.01), 'dark', [s * 0.1, s * 0.22, s * 0.4], undefined, { mirror: true }),
    P(horn, 'accent', [s * 0.3, s * 0.8, 0], [0, -0.3, -0.3], { mirror: true }),
  ];
  return { joints: { head: parts }, sockets: { eye: { joint: 'head', pos: [0, s * 0.52, s * 0.48] } } };
});

registerPart('head', 'beast', ({ d }): SlotResult => {
  const s = d.headS;
  const ear = extrude([[0, 0], [0.14, 0], [0.04, 0.26]], 0.05, 0.012);
  const parts: PartSpec[] = [
    P(box(s * 0.86, s * 0.74, s * 0.84, 0.12), 'main', [0, s * 0.48, 0]),
    P(box(s * 0.5, s * 0.3, s * 0.36, 0.08), 'sub', [0, s * 0.32, s * 0.48]),
    P(sphere(s * 0.07), 'black', [0, s * 0.43, s * 0.66]),
    P(box(s * 0.18, s * 0.1, 0.04, 0.02), 'glow', [s * 0.18, s * 0.58, s * 0.42], [0, 0, 0.25], { mirror: true, glowIntensity: 3 }),
    P(cone(0.022, 0.08, 6), 'white', [s * 0.12, s * 0.14, s * 0.58], [Math.PI, 0, 0], { mirror: true }),
    P(ear, 'main', [s * 0.24, s * 0.82, 0], [0, 0, -0.15], { mirror: true }),
    P(ear, 'accent', [s * 0.25, s * 0.84, 0.03], [0, 0, -0.15], { mirror: true, scale: 0.6 }),
  ];
  return { joints: { head: parts }, sockets: { eye: { joint: 'head', pos: [0, s * 0.4, s * 0.62] } } };
});

registerPart('head', 'ninja', ({ d }): SlotResult => {
  const s = d.headS;
  const tail = extrude([[0, 0], [0.05, -0.02], [0.42, -0.1], [0.4, -0.02], [0.04, 0.05]], 0.02, 0.005);
  const parts: PartSpec[] = [
    P(box(s * 0.84, s * 0.84, s * 0.86, 0.16), 'main', [0, s * 0.5, 0]),
    P(box(s * 0.88, s * 0.14, s * 0.9, 0.04), 'sub', [0, s * 0.66, 0]),
    P(box(s * 0.62, s * 0.08, 0.04, 0.01), 'glow', [0, s * 0.5, s * 0.43], undefined, { glowIntensity: 3.2 }),
    P(box(s * 0.7, s * 0.3, 0.06, 0.04), 'dark', [0, s * 0.25, s * 0.41]),
    P(box(s * 0.16, s * 0.12, 0.03, 0.01), 'accent', [0, s * 0.67, s * 0.46]),
    P(tail, 'sub', [0, s * 0.66, -s * 0.44], [0, Math.PI / 2 + 0.4, 0]),
    P(tail, 'sub', [0, s * 0.62, -s * 0.44], [0.15, Math.PI / 2 + 0.7, 0]),
  ];
  return { joints: { head: parts }, sockets: { eye: { joint: 'head', pos: [0, s * 0.5, s * 0.46] } } };
});

// ---------------------------------------------------------------- TORSOS

registerPart('torso', 'hero', ({ d }): SlotResult => {
  const { chestW: w, chestH: h, chestD: dp, waistH } = d;
  const chest: PartSpec[] = [
    P(box(w, h * 0.66, dp, 0.07), 'main', [0, h * 0.64, 0]),
    P(box(w * 0.3, h * 0.24, 0.05, 0.02), 'accent', [w * 0.24, h * 0.72, dp / 2], [0, 0.12, 0], { mirror: true }),
    P(box(0.012, h * 0.2, 0.02), 'dark', [w * 0.2, h * 0.72, dp / 2 + 0.03], undefined, { mirror: true }),
    P(box(0.012, h * 0.2, 0.02), 'dark', [w * 0.27, h * 0.72, dp / 2 + 0.03], undefined, { mirror: true }),
    P(box(w * 0.22, h * 0.26, 0.06, 0.02), 'sub', [0, h * 0.54, dp / 2 - 0.01]),
    P(box(w * 0.64, h * 0.34, dp * 0.84, 0.05), 'dark', [0, h * 0.2, 0]),
    P(box(w * 0.5, h * 0.12, dp * 0.9, 0.03), 'sub', [0, h * 0.98, -0.02]),
  ];
  const waist: PartSpec[] = [
    P(box(w * 0.78, waistH, dp * 0.86, 0.04), 'white', [0, waistH * 0.5, 0]),
    P(box(w * 0.18, waistH * 0.8, 0.05, 0.02), 'accent', [0, waistH * 0.5, dp * 0.43]),
    P(wedge(w * 0.34, waistH * 1.3, 0.06), 'sub', [w * 0.18, -waistH * 0.1, dp * 0.42], [0, 0, Math.PI / 2 + Math.PI], { mirror: true }),
    P(box(w * 0.22, waistH * 1.4, dp * 0.6, 0.03), 'main', [w * 0.42, -waistH * 0.05, 0], [0, 0, 0.12], { mirror: true }),
  ];
  return {
    joints: { chest, waist },
    sockets: {
      chest: { joint: 'chest', pos: [0, h * 0.6, dp / 2 + 0.04] },
      back: { joint: 'chest', pos: [0, h * 0.6, -dp / 2 - 0.05] },
    },
  };
});

registerPart('torso', 'heavy', ({ d }): SlotResult => {
  const { chestW: w, chestH: h, chestD: dp, waistH } = d;
  const chest: PartSpec[] = [
    P(box(w * 1.12, h * 0.78, dp * 1.1, 0.1), 'main', [0, h * 0.6, 0]),
    P(box(w * 0.9, h * 0.22, 0.06, 0.03), 'sub', [0, h * 0.78, dp * 0.55]),
    P(box(w * 0.14, h * 0.14, 0.05, 0.02), 'accent', [w * 0.36, h * 0.42, dp * 0.55], undefined, { mirror: true }),
    P(cyl(0.05, 0.05, 0.05, 10), 'glow', [0, h * 0.5, dp * 0.56], [Math.PI / 2, 0, 0], { glowIntensity: 2.5 }),
    P(box(w * 0.7, h * 0.3, dp * 0.9, 0.05), 'dark', [0, h * 0.14, 0]),
  ];
  const waist: PartSpec[] = [
    P(box(w * 0.9, waistH * 1.1, dp * 0.95, 0.05), 'dark', [0, waistH * 0.5, 0]),
    P(box(w * 0.3, waistH * 1.2, 0.08, 0.03), 'sub', [0, waistH * 0.3, dp * 0.46]),
    P(box(w * 0.28, waistH * 1.5, dp * 0.7, 0.04), 'main', [w * 0.5, -waistH * 0.1, 0], [0, 0, 0.15], { mirror: true }),
  ];
  return {
    joints: { chest, waist },
    sockets: {
      chest: { joint: 'chest', pos: [0, h * 0.5, dp * 0.6] },
      back: { joint: 'chest', pos: [0, h * 0.6, -dp * 0.55 - 0.05] },
    },
  };
});

registerPart('torso', 'knight', ({ d }): SlotResult => {
  const { chestW: w, chestH: h, chestD: dp, waistH } = d;
  const chest: PartSpec[] = [
    P(box(w, h * 0.7, dp, 0.08), 'main', [0, h * 0.62, 0]),
    P(box(w * 0.08, h * 0.5, 0.05, 0.01), 'accent', [0, h * 0.62, dp / 2 + 0.01]),
    P(box(w * 0.4, h * 0.08, 0.05, 0.01), 'accent', [0, h * 0.72, dp / 2 + 0.01]),
    P(box(w * 0.66, h * 0.3, dp * 0.84, 0.05), 'dark', [0, h * 0.18, 0]),
    P(torus(w * 0.28, 0.03, 16, Math.PI), 'accent', [0, h * 0.94, 0], [0, 0, 0]),
  ];
  const skirt = extrude([[-0.1, 0], [0.1, 0], [0.08, -0.22], [-0.08, -0.22]], 0.04, 0.01);
  const waist: PartSpec[] = [
    P(box(w * 0.8, waistH, dp * 0.88, 0.03), 'sub', [0, waistH * 0.5, 0]),
    P(skirt, 'main', [0, waistH * 0.2, dp * 0.44], [0.12, 0, 0]),
    P(skirt, 'main', [w * 0.34, waistH * 0.2, dp * 0.2], [0.1, 0.9, 0.15], { mirror: true }),
    P(skirt, 'main', [0, waistH * 0.2, -dp * 0.44], [-0.12, 0, 0]),
  ];
  return {
    joints: { chest, waist },
    sockets: {
      chest: { joint: 'chest', pos: [0, h * 0.6, dp / 2 + 0.04] },
      back: { joint: 'chest', pos: [0, h * 0.6, -dp / 2 - 0.05] },
    },
  };
});

registerPart('torso', 'core', ({ d }): SlotResult => {
  const { chestW: w, chestH: h, chestD: dp, waistH } = d;
  const chest: PartSpec[] = [
    P(box(w * 0.94, h * 0.7, dp, 0.12), 'main', [0, h * 0.62, 0]),
    P(cyl(w * 0.2, w * 0.2, 0.08, 20), 'dark', [0, h * 0.62, dp / 2], [Math.PI / 2, 0, 0]),
    P(cyl(w * 0.14, w * 0.14, 0.1, 20), 'glow', [0, h * 0.62, dp / 2 + 0.01], [Math.PI / 2, 0, 0], { glowIntensity: 3 }),
    P(torus(w * 0.2, 0.025, 20), 'accent', [0, h * 0.62, dp / 2 + 0.04]),
    P(box(w * 0.6, h * 0.3, dp * 0.84, 0.05), 'dark', [0, h * 0.18, 0]),
  ];
  const waist: PartSpec[] = [
    P(box(w * 0.74, waistH, dp * 0.84, 0.04), 'sub', [0, waistH * 0.5, 0]),
    P(box(w * 0.2, waistH * 1.3, dp * 0.6, 0.03), 'main', [w * 0.4, 0, 0], [0, 0, 0.12], { mirror: true }),
  ];
  return {
    joints: { chest, waist },
    sockets: {
      chest: { joint: 'chest', pos: [0, h * 0.62, dp / 2 + 0.06] },
      back: { joint: 'chest', pos: [0, h * 0.6, -dp / 2 - 0.05] },
    },
  };
});

// ---------------------------------------------------------------- ARMS

function armCommon(a: PartArgs, opts: { pauldron: 'box' | 'round' | 'spike' | 'big'; fist: number; forearmScale: number }): SlotResult {
  const S = a.side ?? 'L';
  const x = sx(S);
  const { upperArm: ua, foreArm: fa } = a.d;
  const shoulder: PartSpec[] = [];
  if (opts.pauldron === 'round') {
    shoulder.push(P(sphere(0.13), 'main', [x * 0.03, 0.01, 0]));
    shoulder.push(P(torus(0.1, 0.025, 16), 'accent', [x * 0.1, 0.01, 0], [0, Math.PI / 2, 0]));
  } else if (opts.pauldron === 'big') {
    shoulder.push(P(box(0.28, 0.24, 0.32, 0.07), 'main', [x * 0.05, 0.03, 0]));
    shoulder.push(P(box(0.29, 0.05, 0.33, 0.02), 'accent', [x * 0.05, -0.08, 0]));
    shoulder.push(P(box(0.12, 0.1, 0.34, 0.03), 'sub', [x * 0.14, 0.12, 0]));
  } else if (opts.pauldron === 'spike') {
    shoulder.push(P(box(0.22, 0.2, 0.26, 0.06), 'main', [x * 0.03, 0.02, 0]));
    shoulder.push(P(cone(0.05, 0.2, 8), 'accent', [x * 0.1, 0.16, 0], [0, 0, -x * 0.6]));
    shoulder.push(P(cone(0.04, 0.14, 8), 'accent', [x * 0.12, 0.12, 0.08], [0.3, 0, -x * 0.8]));
  } else {
    shoulder.push(P(box(0.21, 0.2, 0.25, 0.055), 'main', [x * 0.03, 0.02, 0]));
    shoulder.push(P(box(0.22, 0.045, 0.26, 0.02), 'accent', [x * 0.03, -0.07, 0]));
  }
  shoulder.push(P(cyl(0.058, 0.058, ua, 12), 'dark', [0, -ua / 2 - 0.02, 0]));
  const fs = opts.forearmScale;
  const elbow: PartSpec[] = [
    P(sphere(0.07), 'dark', [0, 0, 0]),
    P(box(0.15 * fs, fa, 0.16 * fs, 0.045), 'main', [0, -fa / 2 + 0.01, 0]),
    P(box(0.16 * fs, 0.055, 0.17 * fs, 0.02), 'sub', [0, -fa + 0.04, 0]),
    P(box(0.03, fa * 0.5, 0.1, 0.01), 'accent', [x * 0.075 * fs, -fa * 0.45, 0]),
  ];
  const f = opts.fist;
  const hand: PartSpec[] = [
    P(box(0.11 * f, 0.1 * f, 0.11 * f, 0.03), 'dark', [0, -0.04 * f, 0]),
    P(box(0.04 * f, 0.06 * f, 0.1 * f, 0.015), 'dark', [-x * 0.06 * f, -0.03 * f, 0.01]),
  ];
  return {
    joints: { [`shoulder${S}`]: shoulder, [`elbow${S}`]: elbow, [`hand${S}`]: hand },
    sockets: { [S === 'R' ? 'muzzleR' : 'muzzleL']: { joint: `hand${S}`, pos: [0, -0.1 * f, 0] } },
  };
}

registerPart('arms', 'standard', (a) => armCommon(a, { pauldron: 'box', fist: 1, forearmScale: 1 }));
registerPart('arms', 'round', (a) => armCommon(a, { pauldron: 'round', fist: 1, forearmScale: 0.95 }));
registerPart('arms', 'heavy', (a) => armCommon(a, { pauldron: 'big', fist: 1.45, forearmScale: 1.3 }));
registerPart('arms', 'spiked', (a) => armCommon(a, { pauldron: 'spike', fist: 1.1, forearmScale: 1.05 }));

// ---------------------------------------------------------------- LEGS

function legCommon(a: PartArgs, S: 'L' | 'R', o: { bulk: number; knee: 'pad' | 'spike' | 'round'; foot: 'boot' | 'claw' | 'thruster' }): Record<string, PartSpec[]> {
  const x = sx(S);
  const { thigh, shin, footH } = a.d;
  const b = o.bulk;
  const thighP: PartSpec[] = [
    P(cyl(0.075 * b, 0.07 * b, thigh, 12), 'dark', [0, -thigh / 2, 0]),
    P(box(0.14 * b, thigh * 0.5, 0.16 * b, 0.03), 'white', [0, -thigh * 0.3, 0]),
  ];
  const kneeP: PartSpec[] = [
    P(box(0.18 * b, shin, 0.2 * b, 0.05), 'main', [0, -shin / 2 + 0.02, 0.005]),
    P(box(0.19 * b, shin * 0.28, 0.21 * b, 0.03), 'sub', [0, -shin * 0.82, 0.005]),
    P(box(0.025, shin * 0.5, 0.05), 'accent', [x * 0.09 * b, -shin * 0.45, 0.06]),
  ];
  if (o.knee === 'pad') kneeP.push(P(box(0.13 * b, 0.12, 0.07, 0.025), 'sub', [0, -0.02, 0.1 * b]));
  if (o.knee === 'spike') kneeP.push(P(cone(0.05, 0.16, 8), 'accent', [0, 0, 0.12 * b], [Math.PI / 2, 0, 0]));
  if (o.knee === 'round') kneeP.push(P(sphere(0.075 * b), 'accent', [0, -0.01, 0.07 * b]));
  const footP: PartSpec[] = [];
  if (o.foot === 'thruster') {
    footP.push(P(cyl(0.1 * b, 0.07 * b, footH * 1.4, 12), 'dark', [0, -footH * 0.35, 0]));
    footP.push(P(sphere(0.06 * b), 'glow', [0, -footH, 0], undefined, { glowIntensity: 3 }));
  } else {
    footP.push(P(box(0.19 * b, footH * 1.05, 0.32 * b, 0.035), 'main', [0, -footH * 0.48, 0.05]));
    footP.push(P(box(0.2 * b, footH * 0.5, 0.1 * b, 0.02), o.foot === 'claw' ? 'dark' : 'accent', [0, -footH * 0.7, 0.19 * b]));
    footP.push(P(box(0.16 * b, footH * 0.45, 0.1 * b, 0.02), 'dark', [0, -footH * 0.72, -0.12 * b]));
    if (o.foot === 'claw') {
      footP.push(P(cone(0.03, 0.1, 6), 'white', [0.05 * b, -footH * 0.8, 0.27 * b], [Math.PI / 2, 0, 0], { mirror: true }));
    }
  }
  return { [`thigh${S}`]: thighP, [`knee${S}`]: kneeP, [`foot${S}`]: footP };
}

function legs(o: { bulk: number; knee: 'pad' | 'spike' | 'round'; foot: 'boot' | 'claw' | 'thruster' }) {
  return (a: PartArgs): SlotResult => ({ joints: { ...legCommon(a, 'L', o), ...legCommon(a, 'R', o) } });
}

registerPart('legs', 'standard', legs({ bulk: 1, knee: 'pad', foot: 'boot' }));
registerPart('legs', 'heavy', legs({ bulk: 1.3, knee: 'round', foot: 'boot' }));
registerPart('legs', 'spiked', legs({ bulk: 1.05, knee: 'spike', foot: 'claw' }));
registerPart('legs', 'hover', legs({ bulk: 0.9, knee: 'pad', foot: 'thruster' }));

// ---------------------------------------------------------------- BACKPACKS

registerPart('back', 'thrusters', ({ d }): SlotResult => {
  const { chestH: h, chestD: dp } = d;
  const z = -dp / 2;
  const nozzle = lathe([[0.02, 0], [0.065, 0.02], [0.075, 0.14], [0.06, 0.16]], 14);
  const chest: PartSpec[] = [
    P(box(0.34, 0.3, 0.14, 0.05), 'sub', [0, h * 0.62, z - 0.06]),
    P(box(0.08, 0.34, 0.1, 0.03), 'main', [0.14, h * 0.66, z - 0.12], [0.25, 0, 0], { mirror: true }),
    P(nozzle, 'dark', [0.1, h * 0.36, z - 0.12], [Math.PI, 0, 0], { mirror: true }),
    P(sphere(0.045), 'glow', [0.1, h * 0.24, z - 0.12], undefined, { mirror: true, glowIntensity: 3 }),
  ];
  return {
    joints: { chest },
    sockets: {
      thrusterL: { joint: 'chest', pos: [0.1, h * 0.2, z - 0.12] },
      thrusterR: { joint: 'chest', pos: [-0.1, h * 0.2, z - 0.12] },
    },
  };
});

registerPart('back', 'wings', ({ d }): SlotResult => {
  const { chestH: h, chestD: dp } = d;
  const z = -dp / 2;
  const wing = extrude([[0, 0], [0.5, 0.3], [0.62, 0.34], [0.46, 0.12], [0.56, 0.06], [0.36, -0.02], [0.4, -0.12], [0.1, -0.08]], 0.03, 0.008);
  const chest: PartSpec[] = [
    P(box(0.26, 0.26, 0.12, 0.04), 'dark', [0, h * 0.62, z - 0.05]),
    P(wing, 'main', [0.08, h * 0.66, z - 0.1], [0.1, -0.35, 0.2], { mirror: true }),
    P(extrude([[0, 0], [0.4, 0.22], [0.3, 0.05]], 0.02, 0.006), 'accent', [0.1, h * 0.62, z - 0.13], [0.1, -0.35, 0.05], { mirror: true }),
    P(cyl(0.04, 0.06, 0.12, 10), 'dark', [0, h * 0.4, z - 0.1], [Math.PI, 0, 0]),
    P(sphere(0.04), 'glow', [0, h * 0.32, z - 0.1], undefined, { glowIntensity: 3 }),
  ];
  return {
    joints: { chest },
    sockets: {
      thrusterL: { joint: 'chest', pos: [0.02, h * 0.3, z - 0.1] },
      thrusterR: { joint: 'chest', pos: [-0.02, h * 0.3, z - 0.1] },
    },
  };
});

registerPart('back', 'cannons', ({ d }): SlotResult => {
  const { chestH: h, chestD: dp } = d;
  const z = -dp / 2;
  const chest: PartSpec[] = [
    P(box(0.36, 0.28, 0.16, 0.05), 'dark', [0, h * 0.6, z - 0.07]),
    P(box(0.12, 0.14, 0.44, 0.03), 'main', [0.2, h * 1.02, z - 0.02], undefined, { mirror: true }),
    P(cyl(0.045, 0.045, 0.36, 12), 'dark', [0.2, h * 1.02, z + 0.3], [Math.PI / 2, 0, 0], { mirror: true }),
    P(cyl(0.055, 0.055, 0.05, 12), 'accent', [0.2, h * 1.02, z + 0.46], [Math.PI / 2, 0, 0], { mirror: true }),
    P(box(0.04, 0.3, 0.06, 0.01), 'dark', [0.2, h * 0.82, z - 0.06], undefined, { mirror: true }),
  ];
  return {
    joints: { chest },
    sockets: {
      back: { joint: 'chest', pos: [0.2, h * 1.02, z + 0.5] },
      thrusterL: { joint: 'chest', pos: [0.1, h * 0.4, z - 0.12] },
      thrusterR: { joint: 'chest', pos: [-0.1, h * 0.4, z - 0.12] },
    },
  };
});

registerPart('back', 'cape', ({ d }): SlotResult => {
  const { chestH: h, chestD: dp, chestW: w } = d;
  const cape = extrude([[-w * 0.5, 0], [w * 0.5, 0], [w * 0.7, -0.72], [w * 0.25, -0.66], [0, -0.74], [-w * 0.25, -0.66], [-w * 0.7, -0.72]], 0.025, 0.008);
  const chest: PartSpec[] = [
    P(cape, 'sub', [0, h * 0.92, -dp / 2 - 0.04], [0.14, 0, 0]),
    P(sphere(0.05), 'accent', [w * 0.42, h * 0.92, 0.02], undefined, { mirror: true }),
  ];
  return {
    joints: { chest },
    sockets: {
      thrusterL: { joint: 'chest', pos: [0.1, h * 0.4, -dp / 2 - 0.1] },
      thrusterR: { joint: 'chest', pos: [-0.1, h * 0.4, -dp / 2 - 0.1] },
    },
  };
});

// ---------------------------------------------------------------- WEAPONS
// Hand-local: barrel/length along -Y (aims forward when the arm is raised).

registerPart('weapon', 'rifle', ({ side }): SlotResult => {
  const S = side ?? 'R';
  const parts: PartSpec[] = [
    P(box(0.09, 0.3, 0.12, 0.02), 'dark', [0, -0.12, 0.02]),
    P(box(0.07, 0.16, 0.06, 0.015), 'main', [0, -0.08, 0.08]),
    P(cyl(0.025, 0.025, 0.26, 10), 'dark', [0, -0.36, 0.02]),
    P(cyl(0.035, 0.035, 0.04, 10), 'accent', [0, -0.49, 0.02]),
    P(box(0.05, 0.1, 0.05, 0.01), 'sub', [0, -0.12, -0.07]),
    P(box(0.03, 0.03, 0.05), 'glow', [0, -0.18, 0.1], undefined, { glowIntensity: 2 }),
  ];
  return { joints: { [`hand${S}`]: parts }, sockets: { [S === 'R' ? 'muzzleR' : 'muzzleL']: { joint: `hand${S}`, pos: [0, -0.53, 0.02] } } };
});

registerPart('weapon', 'bazooka', ({ side }): SlotResult => {
  const S = side ?? 'R';
  const parts: PartSpec[] = [
    P(cyl(0.075, 0.075, 0.62, 14), 'main', [0, -0.18, 0.1]),
    P(cyl(0.09, 0.08, 0.1, 14), 'dark', [0, -0.5, 0.1]),
    P(cyl(0.085, 0.085, 0.06, 14), 'accent', [0, 0.1, 0.1]),
    P(box(0.06, 0.12, 0.06, 0.01), 'dark', [0, -0.06, 0.02]),
    P(box(0.05, 0.14, 0.05, 0.01), 'sub', [0.07, -0.14, 0.1]),
  ];
  return { joints: { [`hand${S}`]: parts }, sockets: { [S === 'R' ? 'muzzleR' : 'muzzleL']: { joint: `hand${S}`, pos: [0, -0.56, 0.1] } } };
});

registerPart('weapon', 'saber', ({ side }): SlotResult => {
  const S = side ?? 'R';
  // Blade extends forward (+Z) from a fist grip.
  const parts: PartSpec[] = [
    P(cyl(0.03, 0.03, 0.18, 8), 'metal', [0, -0.04, 0.02], [Math.PI / 2, 0, 0]),
    P(box(0.08, 0.04, 0.04, 0.01), 'accent', [0, -0.04, 0.12]),
    P(capsule(0.035, 0.62, 10), 'glow', [0, -0.04, 0.48], [Math.PI / 2, 0, 0], { glowIntensity: 3.2 }),
  ];
  return { joints: { [`hand${S}`]: parts }, sockets: { melee: { joint: `hand${S}`, pos: [0, -0.04, 0.8] } } };
});

registerPart('weapon', 'sword', ({ side }): SlotResult => {
  const S = side ?? 'R';
  const blade = extrude([[-0.045, 0], [0.045, 0], [0.04, 0.62], [0, 0.72], [-0.04, 0.62]], 0.018, 0.006);
  const parts: PartSpec[] = [
    P(cyl(0.025, 0.025, 0.16, 8), 'dark', [0, -0.04, 0.0], [Math.PI / 2, 0, 0]),
    P(box(0.2, 0.04, 0.05, 0.01), 'accent', [0, -0.04, 0.09]),
    P(blade, 'metal', [0, -0.04, 0.1], [Math.PI / 2, 0, 0]),
  ];
  return { joints: { [`hand${S}`]: parts }, sockets: { melee: { joint: `hand${S}`, pos: [0, -0.04, 0.8] } } };
});

registerPart('weapon', 'shield', ({ side }): SlotResult => {
  const S = side ?? 'L';
  const x = sx(S);
  const kite = extrude([[0, 0.2], [0.16, 0.14], [0.14, -0.14], [0, -0.3], [-0.14, -0.14], [-0.16, 0.14]], 0.04, 0.012);
  const parts: PartSpec[] = [
    P(kite, 'sub', [x * 0.12, -0.12, 0.02], [0, Math.PI / 2, 0]),
    P(extrude([[0, 0.12], [0.08, 0.08], [0.07, -0.08], [0, -0.18], [-0.07, -0.08], [-0.08, 0.08]], 0.03, 0.01), 'accent', [x * 0.15, -0.12, 0.02], [0, Math.PI / 2, 0]),
    P(hexPrism(0.035, 0.04), 'glow', [x * 0.17, -0.1, 0.02], [0, 0, Math.PI / 2], { glowIntensity: 2 }),
  ];
  return { joints: { [`elbow${S}`]: parts } };
});

registerPart('weapon', 'gatling', ({ side }): SlotResult => {
  const S = side ?? 'R';
  const parts: PartSpec[] = [
    P(box(0.14, 0.2, 0.16, 0.03), 'dark', [0, -0.1, 0.04]),
    P(cyl(0.022, 0.022, 0.34, 8), 'metal', [0.035, -0.34, 0.04]),
    P(cyl(0.022, 0.022, 0.34, 8), 'metal', [-0.035, -0.34, 0.04]),
    P(cyl(0.022, 0.022, 0.34, 8), 'metal', [0, -0.34, 0.075]),
    P(cyl(0.022, 0.022, 0.34, 8), 'metal', [0, -0.34, 0.005]),
    P(cyl(0.07, 0.07, 0.03, 12), 'accent', [0, -0.46, 0.04]),
    P(box(0.12, 0.1, 0.1, 0.02), 'main', [0, -0.08, 0.13]),
  ];
  return { joints: { [`hand${S}`]: parts }, sockets: { [S === 'R' ? 'muzzleR' : 'muzzleL']: { joint: `hand${S}`, pos: [0, -0.52, 0.04] } } };
});

registerPart('weapon', 'hammer', ({ side }): SlotResult => {
  const S = side ?? 'R';
  const parts: PartSpec[] = [
    P(cyl(0.025, 0.025, 0.56, 8), 'dark', [0, -0.04, 0.2], [Math.PI / 2, 0, 0]),
    P(box(0.3, 0.2, 0.2, 0.04), 'main', [0, -0.04, 0.5]),
    P(box(0.32, 0.06, 0.22, 0.02), 'accent', [0, -0.04, 0.5]),
    P(cyl(0.09, 0.09, 0.04, 12), 'sub', [0.17, -0.04, 0.5], [0, 0, Math.PI / 2], { mirror: true }),
  ];
  return { joints: { [`hand${S}`]: parts }, sockets: { melee: { joint: `hand${S}`, pos: [0, -0.04, 0.55] } } };
});

registerPart('weapon', 'drill', ({ side }): SlotResult => {
  const S = side ?? 'R';
  const drill = lathe([[0.12, 0], [0.11, 0.08], [0.08, 0.2], [0.05, 0.32], [0.001, 0.46]], 10);
  const parts: PartSpec[] = [
    P(cyl(0.12, 0.1, 0.08, 14), 'dark', [0, -0.06, 0]),
    P(drill, 'accent', [0, -0.08, 0], [Math.PI, 0, 0]),
    P(torus(0.1, 0.018, 16), 'main', [0, -0.18, 0], [Math.PI / 2, 0, 0]),
    P(torus(0.07, 0.015, 16), 'main', [0, -0.3, 0], [Math.PI / 2, 0, 0]),
  ];
  return { joints: { [`hand${S}`]: parts }, sockets: { melee: { joint: `hand${S}`, pos: [0, -0.5, 0] } } };
});

registerPart('weapon', 'claws', ({ side }): SlotResult => {
  const S = side ?? 'R';
  const claw = extrude([[0, 0], [0.03, 0], [0.02, -0.22], [-0.01, -0.26]], 0.02, 0.005);
  const parts: PartSpec[] = [
    P(claw, 'white', [0.035, -0.08, 0.05], [0, Math.PI / 2, 0]),
    P(claw, 'white', [0, -0.08, 0.05], [0, Math.PI / 2, 0]),
    P(claw, 'white', [-0.035, -0.08, 0.05], [0, Math.PI / 2, 0]),
  ];
  return { joints: { [`hand${S}`]: parts }, sockets: { melee: { joint: `hand${S}`, pos: [0, -0.3, 0.05] } } };
});

registerPart('weapon', 'staff', ({ side }): SlotResult => {
  const S = side ?? 'R';
  const parts: PartSpec[] = [
    P(cyl(0.02, 0.02, 0.9, 8), 'accent', [0, -0.04, 0.1], [Math.PI / 2 - 0.2, 0, 0]),
    P(torus(0.08, 0.015, 16), 'accent', [0, 0.05, 0.54], [0.2, 0, 0]),
    P(ico(0.06), 'glow', [0, 0.05, 0.54], undefined, { glowIntensity: 3.5 }),
  ];
  return { joints: { [`hand${S}`]: parts }, sockets: { [S === 'R' ? 'muzzleR' : 'muzzleL']: { joint: `hand${S}`, pos: [0, 0.05, 0.54] } } };
});

// ---------------------------------------------------------------- DECO

registerPart('deco', 'scarf', ({ d }): SlotResult => {
  const tail = extrude([[0, 0], [0.08, 0], [0.12, -0.5], [0.02, -0.46]], 0.02, 0.006);
  return {
    joints: {
      chest: [
        P(torus(d.headS * 0.36, 0.05, 18), 'sub', [0, d.chestH * 0.98, 0], [Math.PI / 2, 0, 0]),
        P(tail, 'sub', [0.06, d.chestH * 0.95, -d.chestD * 0.5], [0.5, 0.1, 0.1]),
        P(tail, 'sub', [-0.04, d.chestH * 0.95, -d.chestD * 0.5], [0.7, -0.2, -0.05]),
      ],
    },
  };
});

registerPart('deco', 'horns', ({ d }): SlotResult => {
  const s = d.headS;
  return {
    joints: {
      head: [P(cone(0.05, 0.24, 8), 'accent', [s * 0.3, s * 0.95, 0.02], [0, 0, -0.5], { mirror: true })],
    },
  };
});

registerPart('deco', 'antenna', ({ d }): SlotResult => {
  const s = d.headS;
  return {
    joints: {
      head: [
        P(cyl(0.01, 0.01, s * 0.6, 6), 'dark', [s * 0.25, s * 1.1, -s * 0.2], [0, 0, -0.3], { mirror: true }),
        P(sphere(0.035), 'glow', [s * 0.34, s * 1.38, -s * 0.2], undefined, { mirror: true }),
      ],
    },
  };
});

registerPart('deco', 'shoulderSpikes', ({ d }): SlotResult => ({
  joints: {
    shoulderL: [P(cone(0.04, 0.16, 6), 'accent', [0.1, 0.14, 0.06], [0, 0, -0.4]), P(cone(0.04, 0.16, 6), 'accent', [0.1, 0.14, -0.06], [0, 0, -0.4])],
    shoulderR: [P(cone(0.04, 0.16, 6), 'accent', [-0.1, 0.14, 0.06], [0, 0, 0.4]), P(cone(0.04, 0.16, 6), 'accent', [-0.1, 0.14, -0.06], [0, 0, 0.4])],
  },
}));

registerPart('deco', 'tail', ({ d }): SlotResult => ({
  joints: {
    waist: [
      P(cone(0.08, 0.5, 10), 'main', [0, 0.02, -d.chestD * 0.55], [-2.0, 0, 0]),
      P(cone(0.05, 0.14, 8), 'accent', [0, -0.18, -d.chestD * 0.55 - 0.42], [-2.3, 0, 0]),
    ],
  },
}));

