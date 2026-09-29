import * as THREE from 'three';
import { toonMaterial, type ToonMaterial } from '../engine/toon';
import { radialSprite, starSprite } from '../engine/textures';
import { fxRng } from '../engine/rng';
import type { MechModel } from '../mech/builder';

/**
 * Battle visual effects, all pooled:
 *  - additive billboard particles (glows, stars, streak sparks)
 *  - cel-shaded instanced smoke puffs with ink outlines (anime explosions)
 *  - bouncing plastic debris
 *  - shockwave rings, sword-slash arcs, beams, ribbon trails, afterimages, scorch decals
 *
 * Presets live in `burst()`; gameplay should prefer presets over raw emitters.
 */

const MAX_SPRITES = 3000;
const MAX_PUFFS = 400;
const MAX_DEBRIS = 260;

type SpriteKind = 0 | 1 | 2; // 0 glow, 1 star, 2 streak

interface Sprite {
  alive: boolean;
  kind: SpriteKind;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  gravity: number;
  drag: number;
  life: number;
  maxLife: number;
  size0: number;
  size1: number;
  color: THREE.Color;
  color1: THREE.Color;
  alpha: number;
  rot: number;
  spin: number;
  stretch: number;
}

interface Puff {
  alive: boolean;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  grow: number;
  color: THREE.Color;
  rise: number;
}

interface Debris {
  alive: boolean;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  spin: THREE.Vector3;
  life: number;
  size: number;
  color: THREE.Color;
  bounces: number;
}

interface Timed {
  obj: THREE.Object3D;
  life: number;
  maxLife: number;
  update: (t: number, dt: number) => void;
  dispose?: () => void;
}

export interface BurstOpts {
  color?: THREE.ColorRepresentation;
  color2?: THREE.ColorRepresentation;
  scale?: number;
  dir?: THREE.Vector3;
  count?: number;
}

export type BurstKind =
  | 'hit'
  | 'hitHeavy'
  | 'crit'
  | 'muzzle'
  | 'explosion'
  | 'bigExplosion'
  | 'dust'
  | 'land'
  | 'dash'
  | 'deploy'
  | 'ko'
  | 'heal'
  | 'buff'
  | 'charge'
  | 'chargeReady'
  | 'guard'
  | 'parry'
  | 'electric'
  | 'fire'
  | 'ice'
  | 'sparkle'
  | 'thruster'
  | 'poison'
  | 'water';

// ---------------------------------------------------------------- shaders

const spriteVert = /* glsl */ `
  attribute vec3 iPos;
  attribute vec4 iColor;
  attribute vec4 iMisc; // size, rot, kind, stretch
  attribute vec3 iVel;
  varying vec4 vColor;
  varying vec2 vUv;
  varying float vKind;
  void main() {
    vColor = iColor;
    vUv = uv;
    vKind = iMisc.z;
    vec4 mv = modelViewMatrix * vec4( iPos, 1.0 );
    vec2 corner = position.xy * iMisc.x;
    if ( iMisc.z > 1.5 ) {
      // Streak: align quad with view-space velocity.
      vec3 vv = ( modelViewMatrix * vec4( iVel, 0.0 ) ).xyz;
      vec2 d = length( vv.xy ) > 1e-4 ? normalize( vv.xy ) : vec2( 1.0, 0.0 );
      vec2 n = vec2( -d.y, d.x );
      corner = d * position.x * iMisc.x * ( 1.0 + iMisc.w ) + n * position.y * iMisc.x * 0.22;
    } else {
      float c = cos( iMisc.y ), s = sin( iMisc.y );
      corner = mat2( c, s, -s, c ) * corner;
    }
    mv.xy += corner;
    gl_Position = projectionMatrix * mv;
  }
`;

const spriteFrag = /* glsl */ `
  uniform sampler2D uGlow;
  uniform sampler2D uStar;
  varying vec4 vColor;
  varying vec2 vUv;
  varying float vKind;
  void main() {
    float a;
    if ( vKind < 0.5 ) a = texture2D( uGlow, vUv ).a;
    else if ( vKind < 1.5 ) a = texture2D( uStar, vUv ).a;
    else {
      vec2 p = vUv * 2.0 - 1.0;
      a = smoothstep( 1.0, 0.0, abs( p.y ) ) * smoothstep( 1.0, 0.3, abs( p.x ) );
    }
    gl_FragColor = vec4( vColor.rgb * a * vColor.a, 0.0 );
  }
`;

const instOutlineVert = /* glsl */ `
  uniform float uThickness;
  #include <common>
  #include <fog_pars_vertex>
  void main() {
    mat4 im = instanceMatrix;
    vec4 mvPosition = modelViewMatrix * im * vec4( position, 1.0 );
    vec3 n = normalize( normalMatrix * mat3( im ) * normal );
    float dist = max( -mvPosition.z, 0.1 );
    mvPosition.xyz += n * uThickness * 0.0042 * pow( dist, 0.82 );
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const instOutlineFrag = /* glsl */ `
  uniform vec3 uColor;
  #include <common>
  #include <fog_pars_fragment>
  void main() {
    gl_FragColor = vec4( uColor, 1.0 );
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

// ---------------------------------------------------------------- class

export class Vfx {
  readonly group = new THREE.Group();
  /** Multiplies dt for all effects (hitstop can slow effects too). */
  timeScale = 1;
  /** Ground height lookup for debris bounces. */
  groundAt: (x: number, z: number) => number = () => 0;

  private sprites: Sprite[] = [];
  private spriteMesh: THREE.Mesh;
  private sPos: THREE.InstancedBufferAttribute;
  private sColor: THREE.InstancedBufferAttribute;
  private sMisc: THREE.InstancedBufferAttribute;
  private sVel: THREE.InstancedBufferAttribute;
  private spriteGeo: THREE.InstancedBufferGeometry;
  private freeSprite = 0;

  private puffs: Puff[] = [];
  private puffMesh: THREE.InstancedMesh;
  private puffOutline: THREE.InstancedMesh;
  private debris: Debris[] = [];
  private debrisMesh: THREE.InstancedMesh;
  private debrisOutline: THREE.InstancedMesh;
  private timed: Timed[] = [];
  private tmpM = new THREE.Matrix4();
  private tmpQ = new THREE.Quaternion();
  private tmpS = new THREE.Vector3();
  private tmpV = new THREE.Vector3();

  constructor() {
    this.group.name = 'vfx';

    // Sprites
    const quad = new THREE.PlaneGeometry(1, 1);
    this.spriteGeo = new THREE.InstancedBufferGeometry();
    this.spriteGeo.index = quad.index;
    this.spriteGeo.setAttribute('position', quad.getAttribute('position'));
    this.spriteGeo.setAttribute('uv', quad.getAttribute('uv'));
    this.sPos = new THREE.InstancedBufferAttribute(new Float32Array(MAX_SPRITES * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.sColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_SPRITES * 4), 4).setUsage(THREE.DynamicDrawUsage);
    this.sMisc = new THREE.InstancedBufferAttribute(new Float32Array(MAX_SPRITES * 4), 4).setUsage(THREE.DynamicDrawUsage);
    this.sVel = new THREE.InstancedBufferAttribute(new Float32Array(MAX_SPRITES * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.spriteGeo.setAttribute('iPos', this.sPos);
    this.spriteGeo.setAttribute('iColor', this.sColor);
    this.spriteGeo.setAttribute('iMisc', this.sMisc);
    this.spriteGeo.setAttribute('iVel', this.sVel);
    this.spriteGeo.instanceCount = 0;
    const spriteMat = new THREE.ShaderMaterial({
      uniforms: {
        uGlow: { value: radialSprite('rgba(255,255,255,1)', 'rgba(255,255,255,0)', 'vfxglow') },
        uStar: { value: starSprite() },
      },
      vertexShader: spriteVert,
      fragmentShader: spriteFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.spriteMesh = new THREE.Mesh(this.spriteGeo, spriteMat);
    this.spriteMesh.frustumCulled = false;
    this.spriteMesh.renderOrder = 10;
    this.group.add(this.spriteMesh);
    for (let i = 0; i < MAX_SPRITES; i++) {
      this.sprites.push({
        alive: false, kind: 0, pos: new THREE.Vector3(), vel: new THREE.Vector3(), gravity: 0, drag: 0, life: 0, maxLife: 1,
        size0: 1, size1: 1, color: new THREE.Color(), color1: new THREE.Color(), alpha: 1, rot: 0, spin: 0, stretch: 0,
      });
    }

    // Toon smoke puffs (instanced icospheres + instanced outline hull)
    const puffGeo = new THREE.IcosahedronGeometry(1, 2);
    const puffMat = toonMaterial({ color: 0xffffff, rim: 0.2, spec: 0 });
    this.puffMesh = new THREE.InstancedMesh(puffGeo, puffMat, MAX_PUFFS);
    this.puffMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.puffMesh.count = 0;
    this.puffMesh.frustumCulled = false;
    this.puffMesh.castShadow = false;
    this.puffMesh.setColorAt(0, new THREE.Color(1, 1, 1));
    this.puffOutline = this.makeInstancedOutline(puffGeo, MAX_PUFFS, 0x2a1c24, 1.1);
    this.puffOutline.instanceMatrix = this.puffMesh.instanceMatrix;
    this.group.add(this.puffMesh, this.puffOutline);
    for (let i = 0; i < MAX_PUFFS; i++) {
      this.puffs.push({ alive: false, pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 0, maxLife: 1, size: 1, grow: 1, color: new THREE.Color(), rise: 0 });
    }

    // Debris (instanced rounded chips)
    const debGeo = new THREE.BoxGeometry(1, 0.6, 0.8);
    const debMat = toonMaterial({ color: 0xffffff, spec: 0.5 });
    this.debrisMesh = new THREE.InstancedMesh(debGeo, debMat, MAX_DEBRIS);
    this.debrisMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.debrisMesh.count = 0;
    this.debrisMesh.frustumCulled = false;
    this.debrisMesh.castShadow = true;
    this.debrisMesh.setColorAt(0, new THREE.Color(1, 1, 1));
    this.debrisOutline = this.makeInstancedOutline(debGeo, MAX_DEBRIS, 0x14101c, 1);
    this.debrisOutline.instanceMatrix = this.debrisMesh.instanceMatrix;
    this.group.add(this.debrisMesh, this.debrisOutline);
    for (let i = 0; i < MAX_DEBRIS; i++) {
      this.debris.push({ alive: false, pos: new THREE.Vector3(), vel: new THREE.Vector3(), rot: new THREE.Euler(), spin: new THREE.Vector3(), life: 0, size: 0.1, color: new THREE.Color(), bounces: 0 });
    }
  }

  private makeInstancedOutline(geo: THREE.BufferGeometry, count: number, color: number, thickness: number): THREE.InstancedMesh {
    const mat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uColor: { value: new THREE.Color(color) }, uThickness: { value: thickness } }]),
      vertexShader: instOutlineVert,
      fragmentShader: instOutlineFrag,
      side: THREE.BackSide,
      fog: true,
    });
    const m = new THREE.InstancedMesh(geo, mat, count);
    m.count = 0;
    m.frustumCulled = false;
    return m;
  }

  // ------------------------------------------------------------ emitters

  sprite(o: {
    pos: THREE.Vector3;
    vel?: THREE.Vector3;
    kind?: SpriteKind;
    life?: number;
    size?: number;
    sizeEnd?: number;
    color?: THREE.ColorRepresentation;
    colorEnd?: THREE.ColorRepresentation;
    alpha?: number;
    gravity?: number;
    drag?: number;
    rot?: number;
    spin?: number;
    stretch?: number;
  }): void {
    const s = this.allocSprite();
    s.alive = true;
    s.kind = o.kind ?? 0;
    s.pos.copy(o.pos);
    if (o.vel) s.vel.copy(o.vel);
    else s.vel.set(0, 0, 0);
    s.life = s.maxLife = o.life ?? 0.4;
    s.size0 = o.size ?? 0.5;
    s.size1 = o.sizeEnd ?? s.size0 * 0.2;
    s.color.set(o.color ?? 0xffffff);
    s.color1.set(o.colorEnd ?? o.color ?? 0xffffff);
    s.alpha = o.alpha ?? 1;
    s.gravity = o.gravity ?? 0;
    s.drag = o.drag ?? 0;
    s.rot = o.rot ?? fxRng.range(0, Math.PI * 2);
    s.spin = o.spin ?? 0;
    s.stretch = o.stretch ?? 0;
  }

  private allocSprite(): Sprite {
    for (let n = 0; n < MAX_SPRITES; n++) {
      const i = (this.freeSprite + n) % MAX_SPRITES;
      if (!this.sprites[i].alive) {
        this.freeSprite = (i + 1) % MAX_SPRITES;
        return this.sprites[i];
      }
    }
    // Steal the oldest-ish slot.
    const i = this.freeSprite;
    this.freeSprite = (i + 1) % MAX_SPRITES;
    return this.sprites[i];
  }

  puff(pos: THREE.Vector3, o: { vel?: THREE.Vector3; size?: number; grow?: number; life?: number; color?: THREE.ColorRepresentation; rise?: number } = {}): void {
    let p = this.puffs.find((q) => !q.alive);
    if (!p) p = this.puffs[Math.floor(fxRng.next() * this.puffs.length)];
    p.alive = true;
    p.pos.copy(pos);
    if (o.vel) p.vel.copy(o.vel);
    else p.vel.set(0, 0, 0);
    p.size = o.size ?? 0.4;
    p.grow = o.grow ?? 1.6;
    p.life = p.maxLife = o.life ?? 0.6;
    p.color.set(o.color ?? 0xf4f0ec);
    p.rise = o.rise ?? 0.8;
  }

  chip(pos: THREE.Vector3, o: { vel?: THREE.Vector3; size?: number; color?: THREE.ColorRepresentation; life?: number } = {}): void {
    let d = this.debris.find((q) => !q.alive);
    if (!d) d = this.debris[Math.floor(fxRng.next() * this.debris.length)];
    d.alive = true;
    d.pos.copy(pos);
    if (o.vel) d.vel.copy(o.vel);
    else d.vel.set(fxRng.range(-3, 3), fxRng.range(3, 7), fxRng.range(-3, 3));
    d.rot.set(fxRng.range(0, 6), fxRng.range(0, 6), fxRng.range(0, 6));
    d.spin.set(fxRng.range(-14, 14), fxRng.range(-14, 14), fxRng.range(-14, 14));
    d.size = o.size ?? 0.1;
    d.color.set(o.color ?? 0xdddddd);
    d.life = o.life ?? 2.2;
    d.bounces = 0;
  }

  /** Expanding ring. `axis` = normal of the ring plane (default up = ground ring). */
  ring(pos: THREE.Vector3, o: { color?: THREE.ColorRepresentation; radius?: number; life?: number; width?: number; axis?: THREE.Vector3; intensity?: number } = {}): void {
    const r = o.radius ?? 2;
    const w = o.width ?? 0.18;
    const geo = new THREE.RingGeometry(1 - w, 1, 48, 1);
    const color = new THREE.Color(o.color ?? 0xffffff).multiplyScalar(o.intensity ?? 2);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    const axis = o.axis ?? new THREE.Vector3(0, 1, 0);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), axis.clone().normalize());
    this.group.add(mesh);
    const life = o.life ?? 0.45;
    this.timed.push({
      obj: mesh,
      life,
      maxLife: life,
      update: (t) => {
        const k = 1 - Math.pow(1 - t, 3);
        mesh.scale.setScalar(0.1 + r * k);
        mat.opacity = 1 - t;
      },
      dispose: () => {
        geo.dispose();
        mat.dispose();
      },
    });
  }

  /** Glowing arc for sword swings: center, radius, start/end angles in the plane defined by basis. */
  slash(center: THREE.Vector3, o: { radius?: number; from?: number; to?: number; color?: THREE.ColorRepresentation; yaw?: number; tilt?: number; life?: number; width?: number } = {}): void {
    const radius = o.radius ?? 1.2;
    const from = o.from ?? -1.2;
    const to = o.to ?? 1.2;
    const width = o.width ?? 0.35;
    const segs = 24;
    const geo = new THREE.BufferGeometry();
    const pos: number[] = [];
    const alpha: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      const a = from + (to - from) * u;
      const w = width * Math.sin(u * Math.PI) * (0.4 + 0.6 * u);
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      pos.push(sa * radius, 0, ca * radius, sa * (radius - w), 0, ca * (radius - w));
      alpha.push(u, u * 0.3);
      if (i < segs) {
        const b = i * 2;
        idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('alpha', new THREE.Float32BufferAttribute(alpha, 1));
    geo.setIndex(idx);
    const color = new THREE.Color(o.color ?? 0xffffff);
    const mat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: color.multiplyScalar(2.2) }, uFade: { value: 1 }, uCut: { value: 0 } },
      vertexShader: `attribute float alpha; varying float vA; void main(){ vA = alpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uFade; uniform float uCut; varying float vA; void main(){ float a = smoothstep(uCut, uCut + 0.25, vA) * vA * uFade; gl_FragColor = vec4(mix(uColor, vec3(3.0), vA*vA) * a, 0.0); }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(center);
    mesh.rotation.set(o.tilt ?? 0, o.yaw ?? 0, 0, 'YXZ');
    this.group.add(mesh);
    const life = o.life ?? 0.22;
    this.timed.push({
      obj: mesh,
      life,
      maxLife: life,
      update: (t) => {
        mat.uniforms.uFade.value = 1 - t * 0.6;
        mat.uniforms.uCut.value = t;
        mesh.scale.setScalar(1 + t * 0.15);
      },
      dispose: () => {
        geo.dispose();
        mat.dispose();
      },
    });
  }

  /** Straight energy beam; returns a handle you can re-aim each frame. */
  beam(from: THREE.Vector3, to: THREE.Vector3, o: { color?: THREE.ColorRepresentation; width?: number; life?: number } = {}): { set(a: THREE.Vector3, b: THREE.Vector3): void; kill(): void } {
    const width = o.width ?? 0.35;
    const color = new THREE.Color(o.color ?? 0x66ccff);
    const core = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 12, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1).multiplyScalar(3), transparent: true, depthWrite: false }));
    const glow = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 16, 1, true), new THREE.MeshBasicMaterial({ color: color.clone().multiplyScalar(2.2), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    const g = new THREE.Group();
    g.add(core, glow);
    this.group.add(g);
    const place = (a: THREE.Vector3, b: THREE.Vector3) => {
      const len = a.distanceTo(b);
      g.position.copy(a).add(b).multiplyScalar(0.5);
      g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.tmpV.copy(b).sub(a).normalize());
      g.scale.set(1, len, 1);
    };
    place(from, to);
    const life = o.life ?? 0.35;
    const entry: Timed = {
      obj: g,
      life,
      maxLife: life,
      update: (t) => {
        const w = width * (t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85) * (0.9 + 0.2 * Math.sin(t * 90));
        core.scale.set(w * 0.35, 1, w * 0.35);
        glow.scale.set(w, 1, w);
      },
      dispose: () => {
        core.geometry.dispose();
        glow.geometry.dispose();
        (core.material as THREE.Material).dispose();
        (glow.material as THREE.Material).dispose();
      },
    };
    this.timed.push(entry);
    return {
      set: place,
      kill: () => {
        entry.life = Math.min(entry.life, 0.05);
      },
    };
  }

  /** Ghostly copy of a mech's current pose, fading out (dash afterimage). */
  afterimage(model: MechModel, color: THREE.ColorRepresentation = 0x7fe3ff, life = 0.32): void {
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(1.4), transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false });
    const g = new THREE.Group();
    model.root.updateMatrixWorld(true);
    for (const piece of model.pieces) {
      const m = new THREE.Mesh(piece.geometry, mat);
      m.matrixAutoUpdate = false;
      m.matrix.copy(piece.matrixWorld);
      g.add(m);
    }
    this.group.add(g);
    this.timed.push({
      obj: g,
      life,
      maxLife: life,
      update: (t) => {
        mat.opacity = 0.45 * (1 - t);
      },
      dispose: () => mat.dispose(),
    });
  }

  /** Scorch mark on the ground. */
  decal(pos: THREE.Vector3, radius = 1, life = 6): void {
    const mat = new THREE.MeshBasicMaterial({ map: radialSprite('rgba(20,10,10,0.8)', 'rgba(20,10,10,0)', 'scorch'), transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(pos.x, this.groundAt(pos.x, pos.z) + 0.03, pos.z);
    this.group.add(mesh);
    this.timed.push({
      obj: mesh,
      life,
      maxLife: life,
      update: (t) => {
        mat.opacity = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
      },
      dispose: () => {
        mesh.geometry.dispose();
        mat.dispose();
      },
    });
  }

  /** Generic timed object (custom effects built by movesets). */
  addTimed(obj: THREE.Object3D, life: number, update: (t: number, dt: number) => void, dispose?: () => void): void {
    this.group.add(obj);
    this.timed.push({ obj, life, maxLife: life, update, dispose });
  }

  // ------------------------------------------------------------ presets

  burst(kind: BurstKind, pos: THREE.Vector3, o: BurstOpts = {}): void {
    const sc = o.scale ?? 1;
    const c1 = new THREE.Color(o.color ?? 0xffe27a);
    const c2 = new THREE.Color(o.color2 ?? 0xffffff);
    const R = fxRng;
    const rv = (s: number) => new THREE.Vector3(R.range(-1, 1), R.range(-1, 1), R.range(-1, 1)).normalize().multiplyScalar(s);
    switch (kind) {
      case 'hit': {
        this.sprite({ pos, kind: 1, size: 1.1 * sc, sizeEnd: 0.2, life: 0.14, color: c2.clone().multiplyScalar(3) });
        this.sprite({ pos, kind: 0, size: 1.4 * sc, sizeEnd: 0.3, life: 0.18, color: c1.clone().multiplyScalar(2) });
        for (let i = 0; i < 8; i++) this.sprite({ pos, kind: 2, vel: rv(R.range(6, 12) * sc), size: 0.18 * sc, sizeEnd: 0.05, life: R.range(0.12, 0.24), drag: 6, color: c1.clone().multiplyScalar(3), stretch: 2.5 });
        break;
      }
      case 'hitHeavy':
      case 'crit': {
        const big = kind === 'crit' ? 1.35 : 1;
        this.sprite({ pos, kind: 1, size: 2.2 * sc * big, sizeEnd: 0.4, life: 0.2, color: c2.clone().multiplyScalar(4), spin: 3 });
        this.sprite({ pos, kind: 0, size: 3 * sc * big, sizeEnd: 0.6, life: 0.26, color: c1.clone().multiplyScalar(2.5) });
        for (let i = 0; i < 16; i++) this.sprite({ pos, kind: 2, vel: rv(R.range(8, 16) * sc), size: 0.24 * sc, sizeEnd: 0.05, life: R.range(0.16, 0.32), drag: 5, color: c1.clone().multiplyScalar(3), stretch: 3 });
        this.ring(pos, { color: c1, radius: 1.6 * sc * big, life: 0.28, axis: rv(1), width: 0.12, intensity: 2.5 });
        for (let i = 0; i < 4; i++) this.puff(pos.clone().add(rv(0.3 * sc)), { vel: rv(2 * sc), size: 0.28 * sc, grow: 2, life: 0.45, color: 0xfff6e8 });
        break;
      }
      case 'muzzle': {
        this.sprite({ pos, kind: 1, size: 0.9 * sc, sizeEnd: 0.1, life: 0.08, color: c2.clone().multiplyScalar(3) });
        this.sprite({ pos, kind: 0, size: 1.0 * sc, sizeEnd: 0.2, life: 0.1, color: c1.clone().multiplyScalar(2.2) });
        break;
      }
      case 'explosion':
      case 'bigExplosion': {
        const b = kind === 'bigExplosion' ? 2.2 : 1;
        const s = sc * b;
        this.sprite({ pos, kind: 0, size: 5 * s, sizeEnd: 1, life: 0.25, color: new THREE.Color(1, 0.85, 0.5).multiplyScalar(3) });
        this.sprite({ pos, kind: 1, size: 3.5 * s, sizeEnd: 0.5, life: 0.18, color: new THREE.Color(3, 3, 3) });
        const n = Math.round(10 * b);
        for (let i = 0; i < n; i++) {
          const d = rv(R.range(0.2, 1.0) * s);
          this.puff(pos.clone().add(d.clone().multiplyScalar(0.4)), { vel: d.multiplyScalar(4), size: R.range(0.35, 0.6) * s, grow: 1.8, life: R.range(0.5, 0.9), color: i < n / 2 ? 0xffb347 : 0x6d6070, rise: 1.2 });
        }
        for (let i = 0; i < n * 2; i++) this.sprite({ pos, kind: 2, vel: rv(R.range(8, 18) * s), size: 0.2 * s, sizeEnd: 0.05, life: R.range(0.25, 0.5), drag: 3, gravity: -12, color: new THREE.Color(1, 0.7, 0.3).multiplyScalar(3), stretch: 3 });
        this.ring(pos.clone().setY(this.groundAt(pos.x, pos.z) + 0.1), { color: 0xffc070, radius: 3.4 * s, life: 0.4, width: 0.1, intensity: 2 });
        if (pos.y - this.groundAt(pos.x, pos.z) < 1.5) this.decal(pos, 1.2 * s);
        break;
      }
      case 'dust':
      case 'land': {
        const n = kind === 'land' ? 7 : 3;
        const g = this.groundAt(pos.x, pos.z);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + R.range(-0.3, 0.3);
          this.puff(new THREE.Vector3(pos.x + Math.cos(a) * 0.3 * sc, g + 0.1, pos.z + Math.sin(a) * 0.3 * sc), { vel: new THREE.Vector3(Math.cos(a) * 2.2 * sc, 0.4, Math.sin(a) * 2.2 * sc), size: 0.16 * sc, grow: 1.4, life: 0.45, color: 0xefe6da, rise: 0.4 });
        }
        break;
      }
      case 'dash': {
        const dir = o.dir ?? new THREE.Vector3(0, 0, 1);
        for (let i = 0; i < 10; i++) this.sprite({ pos: pos.clone().add(rv(0.4)), kind: 2, vel: dir.clone().multiplyScalar(-R.range(6, 12)).add(rv(1)), size: 0.14, sizeEnd: 0.02, life: R.range(0.15, 0.3), drag: 4, color: c1.clone().multiplyScalar(2.5), stretch: 4 });
        this.ring(pos, { color: c1, radius: 1.2, life: 0.25, axis: dir, width: 0.15, intensity: 1.8 });
        break;
      }
      case 'thruster': {
        const dir = o.dir ?? new THREE.Vector3(0, -1, 0);
        this.sprite({ pos, kind: 0, vel: dir.clone().multiplyScalar(R.range(3, 6)), size: 0.45 * sc, sizeEnd: 0.05, life: 0.14, color: c1.clone().multiplyScalar(2.5), colorEnd: new THREE.Color(1, 0.3, 0.1) });
        break;
      }
      case 'deploy': {
        this.sprite({ pos, kind: 0, size: 6 * sc, sizeEnd: 0.5, life: 0.35, color: c1.clone().multiplyScalar(3) });
        this.sprite({ pos, kind: 1, size: 4 * sc, sizeEnd: 0.2, life: 0.3, color: new THREE.Color(3, 3, 3), spin: 4 });
        for (let i = 0; i < 24; i++) this.sprite({ pos, kind: 1, vel: rv(R.range(3, 8)), size: 0.35, sizeEnd: 0.05, life: R.range(0.4, 0.8), drag: 3, gravity: -6, color: (i % 2 ? c1 : c2).clone().multiplyScalar(2.5) });
        this.ring(pos.clone().setY(this.groundAt(pos.x, pos.z) + 0.1), { color: c1, radius: 3, life: 0.5, width: 0.12 });
        this.burst('land', pos, { scale: 1.4 });
        break;
      }
      case 'ko': {
        this.burst('bigExplosion', pos, { scale: 0.7 * sc });
        const cols = [o.color ?? 0xffffff, o.color2 ?? 0x888888];
        for (let i = 0; i < 16; i++) this.chip(pos.clone().add(rv(0.3)), { vel: rv(R.range(4, 8)).add(new THREE.Vector3(0, 5, 0)), size: R.range(0.08, 0.18), color: cols[i % 2] });
        break;
      }
      case 'heal':
      case 'buff': {
        const col = kind === 'heal' ? new THREE.Color(0x6bff9a) : c1;
        for (let i = 0; i < 16; i++) {
          const a = R.range(0, Math.PI * 2);
          const r = R.range(0.2, 0.7);
          this.sprite({ pos: pos.clone().add(new THREE.Vector3(Math.cos(a) * r, R.range(-0.4, 0.6), Math.sin(a) * r)), kind: i % 3 === 0 ? 1 : 0, vel: new THREE.Vector3(0, R.range(1.5, 3), 0), size: R.range(0.15, 0.35), sizeEnd: 0.02, life: R.range(0.5, 0.9), color: col.clone().multiplyScalar(2.5) });
        }
        this.ring(pos.clone().setY(this.groundAt(pos.x, pos.z) + 0.08), { color: col, radius: 1.3, life: 0.5 });
        break;
      }
      case 'charge': {
        const d = rv(R.range(1.2, 1.8) * sc);
        this.sprite({ pos: pos.clone().add(d), kind: 2, vel: d.clone().multiplyScalar(-5), size: 0.12, sizeEnd: 0.04, life: 0.2, color: c1.clone().multiplyScalar(3), stretch: 2 });
        break;
      }
      case 'chargeReady': {
        this.sprite({ pos, kind: 1, size: 1.8 * sc, sizeEnd: 0.2, life: 0.25, color: c1.clone().multiplyScalar(4), spin: 6 });
        this.ring(pos, { color: c1, radius: 1.3 * sc, life: 0.3, axis: new THREE.Vector3(0, 0, 1) });
        break;
      }
      case 'guard': {
        this.sprite({ pos, kind: 0, size: 1.6 * sc, sizeEnd: 1.0, life: 0.18, color: new THREE.Color(0x7fd7ff).multiplyScalar(2) });
        this.ring(pos, { color: 0x7fd7ff, radius: 1.1 * sc, life: 0.22, axis: o.dir ?? new THREE.Vector3(0, 0, 1), width: 0.25 });
        break;
      }
      case 'parry': {
        this.sprite({ pos, kind: 1, size: 2.8 * sc, sizeEnd: 0.1, life: 0.3, color: new THREE.Color(4, 4, 4), spin: 10 });
        this.ring(pos, { color: 0xffffff, radius: 2.2, life: 0.35, axis: o.dir ?? new THREE.Vector3(0, 0, 1), width: 0.08, intensity: 3 });
        break;
      }
      case 'electric': {
        for (let i = 0; i < 12; i++) this.sprite({ pos: pos.clone().add(rv(0.3 * sc)), kind: 2, vel: rv(R.range(4, 10)), size: 0.1 * sc, sizeEnd: 0.03, life: R.range(0.06, 0.16), color: new THREE.Color(0x9fd8ff).multiplyScalar(3.5), stretch: 4 });
        this.sprite({ pos, kind: 0, size: 1.2 * sc, sizeEnd: 0.3, life: 0.12, color: new THREE.Color(0x9fd8ff).multiplyScalar(2) });
        break;
      }
      case 'fire': {
        for (let i = 0; i < 6; i++) this.sprite({ pos: pos.clone().add(rv(0.25 * sc)), kind: 0, vel: new THREE.Vector3(R.range(-0.5, 0.5), R.range(1.5, 3.5), R.range(-0.5, 0.5)), size: R.range(0.3, 0.6) * sc, sizeEnd: 0.05, life: R.range(0.25, 0.5), color: new THREE.Color(1, 0.8, 0.2).multiplyScalar(3), colorEnd: new THREE.Color(1, 0.15, 0.05) });
        break;
      }
      case 'ice': {
        for (let i = 0; i < 10; i++) this.sprite({ pos: pos.clone().add(rv(0.3 * sc)), kind: 1, vel: rv(R.range(1, 4)), size: R.range(0.15, 0.35) * sc, sizeEnd: 0.02, life: R.range(0.3, 0.6), gravity: -4, color: new THREE.Color(0xbff4ff).multiplyScalar(2.5) });
        for (let i = 0; i < 5; i++) this.chip(pos.clone(), { vel: rv(R.range(2, 5)).add(new THREE.Vector3(0, 3, 0)), size: R.range(0.05, 0.12), color: 0xcff7ff, life: 1.2 });
        break;
      }
      case 'poison': {
        for (let i = 0; i < 5; i++) this.puff(pos.clone().add(rv(0.3 * sc)), { vel: new THREE.Vector3(0, 0.6, 0), size: 0.2 * sc, grow: 1.5, life: 0.7, color: 0x9d5cff, rise: 0.8 });
        break;
      }
      case 'water': {
        for (let i = 0; i < 10; i++) this.sprite({ pos, kind: 0, vel: rv(R.range(2, 5)).add(new THREE.Vector3(0, 3, 0)), size: R.range(0.15, 0.3) * sc, sizeEnd: 0.05, life: R.range(0.3, 0.6), gravity: -14, color: new THREE.Color(0x6ed3ff).multiplyScalar(2) });
        break;
      }
      case 'sparkle': {
        for (let i = 0; i < (o.count ?? 10); i++) this.sprite({ pos: pos.clone().add(rv(R.range(0.2, 1.2) * sc)), kind: 1, size: R.range(0.2, 0.5) * sc, sizeEnd: 0, life: R.range(0.3, 0.7), color: (i % 2 ? c1 : c2).clone().multiplyScalar(2.5), spin: R.range(-4, 4) });
        break;
      }
    }
  }

  // ------------------------------------------------------------ update

  update(dtReal: number, camera: THREE.Camera): void {
    const dt = dtReal * this.timeScale;
    // Sprites
    let n = 0;
    const pa = this.sPos.array as Float32Array;
    const ca = this.sColor.array as Float32Array;
    const ma = this.sMisc.array as Float32Array;
    const va = this.sVel.array as Float32Array;
    const tmpC = new THREE.Color();
    for (const s of this.sprites) {
      if (!s.alive) continue;
      s.life -= dt;
      if (s.life <= 0) {
        s.alive = false;
        continue;
      }
      s.vel.y += s.gravity * dt;
      if (s.drag) s.vel.multiplyScalar(Math.max(0, 1 - s.drag * dt));
      s.pos.addScaledVector(s.vel, dt);
      s.rot += s.spin * dt;
      const t = 1 - s.life / s.maxLife;
      const size = s.size0 + (s.size1 - s.size0) * t;
      tmpC.copy(s.color).lerp(s.color1, t);
      const a = s.alpha * (t < 0.1 ? 1 : 1 - (t - 0.1) / 0.9);
      pa[n * 3] = s.pos.x;
      pa[n * 3 + 1] = s.pos.y;
      pa[n * 3 + 2] = s.pos.z;
      ca[n * 4] = tmpC.r;
      ca[n * 4 + 1] = tmpC.g;
      ca[n * 4 + 2] = tmpC.b;
      ca[n * 4 + 3] = a;
      ma[n * 4] = size;
      ma[n * 4 + 1] = s.rot;
      ma[n * 4 + 2] = s.kind;
      ma[n * 4 + 3] = s.stretch;
      va[n * 3] = s.vel.x;
      va[n * 3 + 1] = s.vel.y;
      va[n * 3 + 2] = s.vel.z;
      n++;
    }
    this.spriteGeo.instanceCount = n;
    this.sPos.needsUpdate = true;
    this.sColor.needsUpdate = true;
    this.sMisc.needsUpdate = true;
    this.sVel.needsUpdate = true;

    // Puffs
    let pn = 0;
    for (const p of this.puffs) {
      if (!p.alive) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.alive = false;
        continue;
      }
      const t = 1 - p.life / p.maxLife;
      p.vel.multiplyScalar(Math.max(0, 1 - 3.5 * dt));
      p.vel.y += p.rise * dt;
      p.pos.addScaledVector(p.vel, dt);
      // Grow fast then shrink to nothing (cartoon puff).
      const s = p.size * (t < 0.3 ? 1 + (p.grow - 1) * (t / 0.3) : p.grow * (1 - (t - 0.3) / 0.7));
      this.tmpS.setScalar(Math.max(0.001, s));
      this.tmpM.compose(p.pos, this.tmpQ.identity(), this.tmpS);
      this.puffMesh.setMatrixAt(pn, this.tmpM);
      this.puffMesh.setColorAt(pn, p.color);
      pn++;
    }
    this.puffMesh.count = pn;
    this.puffOutline.count = pn;
    this.puffMesh.instanceMatrix.needsUpdate = true;
    if (this.puffMesh.instanceColor) this.puffMesh.instanceColor.needsUpdate = true;

    // Debris
    let dn = 0;
    for (const d of this.debris) {
      if (!d.alive) continue;
      d.life -= dt;
      if (d.life <= 0) {
        d.alive = false;
        continue;
      }
      d.vel.y -= 22 * dt;
      d.pos.addScaledVector(d.vel, dt);
      const g = this.groundAt(d.pos.x, d.pos.z) + d.size * 0.3;
      if (d.pos.y < g) {
        d.pos.y = g;
        if (d.bounces < 3 && Math.abs(d.vel.y) > 1.5) {
          d.vel.y = -d.vel.y * 0.45;
          d.vel.x *= 0.6;
          d.vel.z *= 0.6;
          d.spin.multiplyScalar(0.5);
          d.bounces++;
        } else {
          d.vel.set(0, 0, 0);
          d.spin.set(0, 0, 0);
        }
      }
      d.rot.x += d.spin.x * dt;
      d.rot.y += d.spin.y * dt;
      d.rot.z += d.spin.z * dt;
      const shrink = d.life < 0.4 ? d.life / 0.4 : 1;
      this.tmpS.setScalar(d.size * shrink);
      this.tmpQ.setFromEuler(d.rot);
      this.tmpM.compose(d.pos, this.tmpQ, this.tmpS);
      this.debrisMesh.setMatrixAt(dn, this.tmpM);
      this.debrisMesh.setColorAt(dn, d.color);
      dn++;
    }
    this.debrisMesh.count = dn;
    this.debrisOutline.count = dn;
    this.debrisMesh.instanceMatrix.needsUpdate = true;
    if (this.debrisMesh.instanceColor) this.debrisMesh.instanceColor.needsUpdate = true;

    // Timed
    for (let i = this.timed.length - 1; i >= 0; i--) {
      const e = this.timed[i];
      e.life -= dt;
      if (e.life <= 0) {
        e.obj.removeFromParent();
        e.dispose?.();
        this.timed.splice(i, 1);
        continue;
      }
      e.update(1 - e.life / e.maxLife, dt);
    }
    void camera;
  }

  clear(): void {
    for (const s of this.sprites) s.alive = false;
    for (const p of this.puffs) p.alive = false;
    for (const d of this.debris) d.alive = false;
    for (const e of this.timed) {
      e.obj.removeFromParent();
      e.dispose?.();
    }
    this.timed.length = 0;
  }

  get puffMaterial(): ToonMaterial {
    return this.puffMesh.material as ToonMaterial;
  }
}
