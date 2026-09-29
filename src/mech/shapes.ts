import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/**
 * Cached primitive geometry factories used to assemble toy mechs and props.
 * All geometries are unit-centered; placement happens via PartSpec transforms.
 * Geometries are shared and must never be mutated after creation.
 */

const cache = new Map<string, THREE.BufferGeometry>();

function cached(key: string, make: () => THREE.BufferGeometry): THREE.BufferGeometry {
  let g = cache.get(key);
  if (!g) {
    g = make();
    // Normalize attribute set so merges succeed: position, normal, uv (non-indexed ok).
    if (!g.getAttribute('uv')) {
      const n = g.getAttribute('position').count;
      g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
    }
    cache.set(key, g);
  }
  return g;
}

const r3 = (n: number) => Math.round(n * 1000) / 1000;

/** Rounded box. `bevel` is absolute radius (clamped to the smallest half-extent). */
export function box(w: number, h: number, d: number, bevel = 0.04, seg = 2): THREE.BufferGeometry {
  const b = Math.min(bevel, Math.min(w, h, d) * 0.49);
  return cached(`box${r3(w)},${r3(h)},${r3(d)},${r3(b)},${seg}`, () =>
    b <= 0.0005 ? new THREE.BoxGeometry(w, h, d) : new RoundedBoxGeometry(w, h, d, seg, b),
  );
}

export function cyl(rTop: number, rBot: number, h: number, seg = 16, open = false): THREE.BufferGeometry {
  return cached(`cyl${r3(rTop)},${r3(rBot)},${r3(h)},${seg},${open}`, () => new THREE.CylinderGeometry(rTop, rBot, h, seg, 1, open));
}

export function sphere(r: number, wSeg = 20, hSeg = 14): THREE.BufferGeometry {
  return cached(`sph${r3(r)},${wSeg},${hSeg}`, () => new THREE.SphereGeometry(r, wSeg, hSeg));
}

/** Partial sphere (dome) — thetaLength in radians from the top. */
export function dome(r: number, thetaLength = Math.PI / 2, seg = 20): THREE.BufferGeometry {
  return cached(`dome${r3(r)},${r3(thetaLength)},${seg}`, () => new THREE.SphereGeometry(r, seg, Math.max(6, Math.round(seg / 2)), 0, Math.PI * 2, 0, thetaLength));
}

export function cone(r: number, h: number, seg = 16): THREE.BufferGeometry {
  return cached(`cone${r3(r)},${r3(h)},${seg}`, () => new THREE.ConeGeometry(r, h, seg));
}

export function capsule(r: number, len: number, seg = 12): THREE.BufferGeometry {
  return cached(`cap${r3(r)},${r3(len)},${seg}`, () => new THREE.CapsuleGeometry(r, len, 4, seg));
}

export function torus(r: number, tube: number, seg = 24, arc = Math.PI * 2): THREE.BufferGeometry {
  return cached(`tor${r3(r)},${r3(tube)},${seg},${r3(arc)}`, () => new THREE.TorusGeometry(r, tube, 8, seg, arc));
}

export function octa(r: number): THREE.BufferGeometry {
  return cached(`oct${r3(r)}`, () => new THREE.OctahedronGeometry(r, 0));
}

export function ico(r: number, detail = 0): THREE.BufferGeometry {
  return cached(`ico${r3(r)},${detail}`, () => new THREE.IcosahedronGeometry(r, detail));
}

/**
 * Extruded 2D outline in the XY plane (centered on Z). Great for fins, V-crests,
 * blades, wings and horns — the "flat plastic runner part" look.
 */
export function extrude(points: [number, number][], depth: number, bevel = 0.01, key?: string): THREE.BufferGeometry {
  const k = key ?? `ext${points.map((p) => `${r3(p[0])}:${r3(p[1])}`).join(';')}|${r3(depth)}|${r3(bevel)}`;
  return cached(k, () => {
    const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 1,
      curveSegments: 6,
    });
    g.translate(0, 0, -depth / 2);
    g.computeVertexNormals();
    return g;
  });
}

/** Lathe (revolved profile), profile points are [radius, y]. */
export function lathe(profile: [number, number][], seg = 18, key?: string): THREE.BufferGeometry {
  const k = key ?? `lat${profile.map((p) => `${r3(p[0])}:${r3(p[1])}`).join(';')}|${seg}`;
  return cached(k, () => new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg));
}

/** Wedge / prism: triangle cross-section extruded along Z. */
export function wedge(w: number, h: number, d: number): THREE.BufferGeometry {
  return extrude([[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2]], d, Math.min(w, h, d) * 0.08, `wedge${r3(w)},${r3(h)},${r3(d)}`);
}

/** Hexagonal prism (bolts, gems, capsule caps). */
export function hexPrism(r: number, h: number): THREE.BufferGeometry {
  return cyl(r, r, h, 6);
}
