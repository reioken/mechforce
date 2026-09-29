import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Anime / toy-plastic cel shading.
 *
 * `toonMaterial()` extends MeshToonMaterial (so shadows, fog and vertex colors keep
 * working) with a hard-edged rim light, a hard specular "plastic shine" highlight,
 * per-object hit flash, and collectible "finishes" (chrome, gold, clear, holo...)
 * used for rare capsule variants.
 *
 * `addOutlines()` gives meshes an inverted-hull ink line.
 */

export type Finish = 'plastic' | 'matte' | 'metal' | 'chrome' | 'gold' | 'clear' | 'holo' | 'pearl';

const FINISH_ID: Record<Finish, number> = {
  plastic: 0,
  matte: 0,
  metal: 1,
  chrome: 2,
  gold: 2,
  clear: 3,
  holo: 4,
  pearl: 5,
};

/** Global uniforms shared by every toon material (animated finishes). */
export const toonGlobals = {
  uTime: { value: 0 },
};

let gradientCache: THREE.DataTexture | null = null;

/** Three-band ramp: shade / soft mid / lit. Nearest-filtered for crisp terminators. */
export function toonGradient(): THREE.DataTexture {
  if (gradientCache) return gradientCache;
  const bands = [0, 0, 0, 0, 0.42, 1, 1, 1];
  const data = new Uint8Array(bands.length * 4);
  bands.forEach((b, i) => {
    const v = Math.round(b * 255);
    data.set([v, v, v, 255], i * 4);
  });
  const tex = new THREE.DataTexture(data, bands.length, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  gradientCache = tex;
  return tex;
}

export interface ToonOptions {
  color?: THREE.ColorRepresentation;
  vertexColors?: boolean;
  finish?: Finish;
  emissive?: THREE.ColorRepresentation;
  emissiveIntensity?: number;
  map?: THREE.Texture | null;
  opacity?: number;
  transparent?: boolean;
  side?: THREE.Side;
  rimColor?: THREE.ColorRepresentation;
  rim?: number;
  rimWidth?: number;
  spec?: number;
  specSize?: number;
  fog?: boolean;
}

export type ToonMaterial = THREE.MeshToonMaterial & {
  userData: {
    uniforms: {
      uFlash: { value: number };
      uFlashColor: { value: THREE.Color };
      uRim: { value: number };
      uRimColor: { value: THREE.Color };
      uRimWidth: { value: number };
      uSpec: { value: number };
      uSpecSize: { value: number };
      uFinish: { value: number };
      uTint: { value: THREE.Color };
      uTintAmt: { value: number };
    };
    finish: Finish;
  };
};

export function toonMaterial(opts: ToonOptions = {}): ToonMaterial {
  const finish = opts.finish ?? 'plastic';
  const isClear = finish === 'clear';
  const mat = new THREE.MeshToonMaterial({
    color: opts.color ?? 0xffffff,
    gradientMap: toonGradient(),
    vertexColors: !!opts.vertexColors,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 1,
    map: opts.map ?? null,
    transparent: opts.transparent ?? isClear,
    opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide,
    depthWrite: !isClear,
    fog: opts.fog ?? true,
  }) as ToonMaterial;

  const defaults = finishDefaults(finish);
  const uniforms = {
    uFlash: { value: 0 },
    uFlashColor: { value: new THREE.Color(1, 1, 1) },
    uRim: { value: opts.rim ?? defaults.rim },
    uRimColor: { value: new THREE.Color(opts.rimColor ?? defaults.rimColor) },
    uRimWidth: { value: opts.rimWidth ?? 0.62 },
    uSpec: { value: opts.spec ?? defaults.spec },
    uSpecSize: { value: opts.specSize ?? defaults.specSize },
    uFinish: { value: FINISH_ID[finish] },
    uTint: { value: new THREE.Color(0, 0, 0) },
    uTintAmt: { value: 0 },
  };
  mat.userData = { uniforms, finish };

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms, toonGlobals);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform float uFlash;
uniform vec3 uFlashColor;
uniform float uRim;
uniform vec3 uRimColor;
uniform float uRimWidth;
uniform float uSpec;
uniform float uSpecSize;
uniform int uFinish;
uniform float uTime;
uniform vec3 uTint;
uniform float uTintAmt;`,
      )
      .replace('#include <opaque_fragment>', `${TOON_EXTRA_GLSL}\n#include <opaque_fragment>`);
  };
  mat.customProgramCacheKey = () => `mf-toon-${finish === 'clear' ? 'c' : 'o'}`;
  return mat;
}

function finishDefaults(f: Finish): { rim: number; rimColor: number; spec: number; specSize: number } {
  switch (f) {
    case 'matte':
      return { rim: 0.12, rimColor: 0xffffff, spec: 0, specSize: 0.95 };
    case 'metal':
      return { rim: 0.3, rimColor: 0xdfe8ff, spec: 0.55, specSize: 0.86 };
    case 'chrome':
      return { rim: 0.45, rimColor: 0xffffff, spec: 0.9, specSize: 0.9 };
    case 'gold':
      return { rim: 0.45, rimColor: 0xfff1b0, spec: 0.9, specSize: 0.9 };
    case 'clear':
      return { rim: 0.6, rimColor: 0xffffff, spec: 0.8, specSize: 0.9 };
    case 'holo':
      return { rim: 0.5, rimColor: 0xffffff, spec: 0.7, specSize: 0.9 };
    case 'pearl':
      return { rim: 0.4, rimColor: 0xfff0ff, spec: 0.6, specSize: 0.9 };
    default:
      return { rim: 0.22, rimColor: 0xffffff, spec: 0.42, specSize: 0.93 };
  }
}

const TOON_EXTRA_GLSL = /* glsl */ `
{
  vec3 N_ = normalize( normal );
  vec3 V_ = normalize( vViewPosition );
  float ndv_ = clamp( dot( N_, V_ ), 0.0, 1.0 );
  float lit_ = 1.0;
  vec3 L_ = normalize( vec3( 0.3, 1.0, 0.4 ) );
  #if NUM_DIR_LIGHTS > 0
    L_ = directionalLights[ 0 ].direction;
    float sunLum_ = max( dot( directionalLights[ 0 ].color, vec3( 0.3333 ) ), 1e-4 );
    lit_ = clamp( dot( directLight.color, vec3( 0.3333 ) ) / sunLum_, 0.0, 1.0 ) * step( 0.0, dot( N_, L_ ) );
  #endif

  vec3 base_ = diffuseColor.rgb;

  // Collectible finishes -------------------------------------------------
  if ( uFinish == 2 ) {
    // Chrome / gold: banded fake studio reflection tinted by base color.
    vec3 R_ = reflect( -V_, N_ );
    float t_ = R_.y;
    float band_ = t_ > 0.08 ? mix( 0.85, 1.35, smoothstep( 0.08, 0.7, t_ ) ) : mix( 0.18, 0.55, smoothstep( -0.9, -0.05, t_ ) );
    band_ = floor( band_ * 5.0 + 0.5 ) / 5.0;
    outgoingLight = base_ * band_ * ( 0.75 + 0.25 * lit_ ) + base_ * 0.08;
  } else if ( uFinish == 1 ) {
    // Metal: darker diffuse with view banding
    float b_ = smoothstep( 0.2, 0.8, ndv_ );
    outgoingLight *= mix( 0.7, 1.08, floor( b_ * 3.0 + 0.5 ) / 3.0 );
  } else if ( uFinish == 4 ) {
    // Holographic: iridescent hue that slides with view angle and time.
    vec3 hue_ = 0.5 + 0.5 * cos( 6.28318 * ( ndv_ * 1.3 + vec3( 0.0, 0.33, 0.67 ) + uTime * 0.07 ) );
    outgoingLight = mix( outgoingLight, outgoingLight * 0.5 + hue_ * ( 0.55 + 0.45 * lit_ ), 0.6 );
  } else if ( uFinish == 5 ) {
    vec3 hue_ = 0.5 + 0.5 * cos( 6.28318 * ( ndv_ * 0.6 + vec3( 0.0, 0.2, 0.45 ) ) );
    outgoingLight = mix( outgoingLight, outgoingLight * ( 0.8 + 0.4 * hue_ ), 0.5 );
  }

  // Hard rim light
  float rimF_ = 1.0 - ndv_;
  float rim_ = smoothstep( uRimWidth, uRimWidth + 0.06, rimF_ );
  outgoingLight += uRimColor * rim_ * uRim * ( 0.3 + 0.7 * lit_ );

  // Hard specular "plastic shine"
  vec3 H_ = normalize( L_ + V_ );
  float nh_ = max( dot( N_, H_ ), 0.0 );
  float spec_ = smoothstep( uSpecSize, uSpecSize + 0.015, nh_ ) * uSpec * lit_;
  outgoingLight += vec3( spec_ );

  if ( uFinish == 3 ) {
    // Clear plastic: fresnel opacity + bright edges
    diffuseColor.a *= mix( 0.38, 0.95, pow( rimF_, 1.6 ) );
    outgoingLight = outgoingLight * 1.05 + base_ * 0.12;
  }

  outgoingLight = mix( outgoingLight, uTint, uTintAmt );
  outgoingLight = mix( outgoingLight, uFlashColor, uFlash );
}
`;

// ---------------------------------------------------------------------------
// Glow (unlit HDR emissive for visors, beam cores, capsule lights).

const glowCache = new Map<string, THREE.MeshBasicMaterial>();

/** Unlit HDR color; intensity > 1 feeds the bloom pass. */
export function glowMaterial(color: THREE.ColorRepresentation, intensity = 2.5, opts: { transparent?: boolean; opacity?: number; additive?: boolean; shared?: boolean } = {}): THREE.MeshBasicMaterial {
  const key = `${new THREE.Color(color).getHexString()}|${intensity}|${opts.transparent}|${opts.opacity}|${opts.additive}`;
  if (opts.shared !== false) {
    const hit = glowCache.get(key);
    if (hit) return hit;
  }
  const c = new THREE.Color(color).multiplyScalar(intensity);
  const m = new THREE.MeshBasicMaterial({
    color: c,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
    blending: opts.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: !opts.additive,
    toneMapped: true,
  });
  if (opts.shared !== false) glowCache.set(key, m);
  return m;
}

// ---------------------------------------------------------------------------
// Outlines (inverted hull with smoothed normals, roughly constant screen width)

const outlineGeoCache = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();
const outlineMatCache = new Map<string, THREE.ShaderMaterial>();

export function outlineGeometry(src: THREE.BufferGeometry): THREE.BufferGeometry {
  let g = outlineGeoCache.get(src);
  if (g) return g;
  const tmp = new THREE.BufferGeometry();
  tmp.setAttribute('position', src.getAttribute('position'));
  if (src.index) tmp.setIndex(src.index);
  g = mergeVertices(tmp, 1e-3);
  g.computeVertexNormals();
  outlineGeoCache.set(src, g);
  return g;
}

export function outlineMaterial(color: THREE.ColorRepresentation = 0x15101f, thickness = 1): THREE.ShaderMaterial {
  const key = `${new THREE.Color(color).getHexString()}|${thickness}`;
  const hit = outlineMatCache.get(key);
  if (hit) return hit;
  const m = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      { uColor: { value: new THREE.Color(color) }, uThickness: { value: thickness } },
    ]),
    vertexShader: /* glsl */ `
      uniform float uThickness;
      #include <common>
      #include <fog_pars_vertex>
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec3 n = normalize( normalMatrix * normal );
        float dist = max( -mvPosition.z, 0.1 );
        // Roughly constant pixel width that thins slightly with distance.
        float w = uThickness * 0.0042 * pow( dist, 0.82 );
        mvPosition.xyz += n * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      #include <common>
      #include <fog_pars_fragment>
      void main() {
        gl_FragColor = vec4( uColor, 1.0 );
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `,
    side: THREE.BackSide,
    fog: true,
  });
  outlineMatCache.set(key, m);
  return m;
}

/**
 * Adds an outline hull as a child of every mesh under `root` (skips meshes
 * flagged `userData.noOutline`, glow materials and clear plastic).
 */
export function addOutlines(root: THREE.Object3D, color: THREE.ColorRepresentation = 0x15101f, thickness = 1): void {
  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || m.userData.isOutline || m.userData.noOutline) return;
    const mat = m.material as THREE.Material;
    if ((mat as THREE.MeshBasicMaterial).isMeshBasicMaterial) return;
    if ((mat as ToonMaterial).userData?.finish === 'clear') return;
    meshes.push(m);
  });
  for (const m of meshes) {
    const hull = new THREE.Mesh(outlineGeometry(m.geometry), outlineMaterial(color, thickness));
    hull.userData.isOutline = true;
    hull.castShadow = false;
    hull.receiveShadow = false;
    hull.raycast = () => {};
    hull.renderOrder = m.renderOrder;
    m.add(hull);
  }
}
