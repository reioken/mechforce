import * as THREE from 'three';

/**
 * Procedural canvas textures (no external image assets needed).
 * All return sRGB CanvasTextures, cached by key.
 */

const cache = new Map<string, THREE.Texture>();

function canvasTex(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, repeat?: [number, number]): THREE.CanvasTexture {
  const hit = cache.get(key) as THREE.CanvasTexture | undefined;
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  cache.set(key, t);
  return t;
}

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Warm wooden floor planks, stylized (flat bands + few grain strokes). */
export function woodPlanks(base = '#c98d57', repeat: [number, number] = [4, 4]): THREE.CanvasTexture {
  return canvasTex(`wood${base}${repeat}`, 512, 512, (g, w, h) => {
    const r = seeded(7);
    const rows = 4;
    const ph = h / rows;
    const baseC = new THREE.Color(base);
    for (let i = 0; i < rows; i++) {
      const offset = (i % 2) * w * 0.5;
      for (let k = -1; k < 2; k++) {
        const x0 = offset + k * w;
        const shade = 0.88 + r() * 0.2;
        const c = baseC.clone().multiplyScalar(shade);
        g.fillStyle = `#${c.getHexString()}`;
        g.fillRect(x0, i * ph, w, ph);
        // grain
        g.strokeStyle = `rgba(90,45,20,0.18)`;
        g.lineWidth = 2;
        for (let s = 0; s < 5; s++) {
          const y = i * ph + 8 + r() * (ph - 16);
          g.beginPath();
          g.moveTo(x0, y);
          g.bezierCurveTo(x0 + w * 0.3, y + (r() - 0.5) * 12, x0 + w * 0.6, y + (r() - 0.5) * 12, x0 + w, y);
          g.stroke();
        }
        // knot
        if (r() < 0.5) {
          g.fillStyle = 'rgba(100,50,25,0.25)';
          g.beginPath();
          g.ellipse(x0 + r() * w, i * ph + ph / 2, 14, 6, 0, 0, Math.PI * 2);
          g.fill();
        }
        // seam
        g.fillStyle = 'rgba(60,30,15,0.55)';
        g.fillRect(x0 + w - 3, i * ph, 3, ph);
      }
      g.fillStyle = 'rgba(60,30,15,0.6)';
      g.fillRect(0, i * ph + ph - 3, w, 3);
    }
  }, repeat);
}

/** Round braided rug with concentric colored rings. */
export function rugTexture(colors = ['#e85d75', '#f7c548', '#5bc0eb', '#9bc53d', '#fde74c', '#7d5ba6']): THREE.CanvasTexture {
  return canvasTex(`rug${colors.join()}`, 512, 512, (g, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const rings = 14;
    for (let i = rings; i > 0; i--) {
      g.fillStyle = colors[i % colors.length];
      g.beginPath();
      g.arc(cx, cy, (i / rings) * (w / 2), 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = 'rgba(0,0,0,0.15)';
      g.lineWidth = 3;
      g.stroke();
      // braid dashes
      g.strokeStyle = 'rgba(255,255,255,0.18)';
      g.setLineDash([6, 8]);
      g.lineWidth = 2;
      g.beginPath();
      g.arc(cx, cy, (i / rings) * (w / 2) - 8, 0, Math.PI * 2);
      g.stroke();
      g.setLineDash([]);
    }
  });
}

/** Alphabet block face: colored field, inset border, big letter. */
export function blockFace(letter: string, bg: string, fg: string): THREE.CanvasTexture {
  return canvasTex(`block${letter}${bg}${fg}`, 256, 256, (g, w, h) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = fg;
    g.lineWidth = 14;
    g.strokeRect(22, 22, w - 44, h - 44);
    g.fillStyle = fg;
    g.font = `900 170px "Dela Gothic One", "Arial Black", sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(letter, w / 2, h / 2 + 8);
  });
}

/** Subtle grid/checker for training rooms and debug. */
export function checker(a = '#dfe6f2', b = '#c9d3e6', n = 8, repeat: [number, number] = [8, 8]): THREE.CanvasTexture {
  return canvasTex(`chk${a}${b}${n}${repeat}`, 256, 256, (g, w, h) => {
    const s = w / n;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        g.fillStyle = (x + y) % 2 ? a : b;
        g.fillRect(x * s, y * s, s, s);
      }
    }
  }, repeat);
}

/** Soft radial blob (particles, glows, shadows). Linear space alpha mask. */
export function radialSprite(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)', key = 'radial'): THREE.CanvasTexture {
  return canvasTex(`${key}${inner}${outer}`, 128, 128, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grd.addColorStop(0, inner);
    grd.addColorStop(1, outer);
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
  });
}

/** Four-point anime sparkle / hit star. */
export function starSprite(): THREE.CanvasTexture {
  return canvasTex('star4', 128, 128, (g, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    g.fillStyle = '#fff';
    g.beginPath();
    const R = w * 0.48;
    const r = w * 0.09;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const rad = i % 2 === 0 ? R : r;
      g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    }
    g.closePath();
    g.fill();
    const grd = g.createRadialGradient(cx, cy, 0, cx, cy, w * 0.25);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
  });
}

/** Gradient sky dome texture (vertical). */
export function skyGradient(top: string, mid: string, bottom: string): THREE.CanvasTexture {
  return canvasTex(`sky${top}${mid}${bottom}`, 16, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, top);
    grd.addColorStop(0.55, mid);
    grd.addColorStop(1, bottom);
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
  });
}
