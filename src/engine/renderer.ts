import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

export type Quality = 'low' | 'medium' | 'high';

/**
 * Owns the WebGL renderer and post-processing chain:
 *   scene (MSAA, HDR) -> bloom -> anime grade (vignette, speed lines, flash) -> tone map/sRGB.
 * One Renderer is shared by every game mode; modes hand it a scene + camera.
 */
export class Renderer {
  readonly gl: THREE.WebGLRenderer;
  readonly composer: EffectComposer;
  readonly renderPass: RenderPass;
  readonly bloom: UnrealBloomPass;
  readonly grade: ShaderPass;
  readonly output: OutputPass;
  quality: Quality = 'high';
  private width = 1;
  private height = 1;

  constructor(readonly canvas: HTMLCanvasElement) {
    this.gl = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.gl.shadowMap.enabled = true;
    this.gl.shadowMap.type = THREE.PCFShadowMap;
    this.gl.toneMapping = THREE.NeutralToneMapping;
    this.gl.toneMappingExposure = 1.0;
    this.gl.outputColorSpace = THREE.SRGBColorSpace;

    const rt = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      samples: 4,
    });
    this.composer = new EffectComposer(this.gl, rt);
    this.renderPass = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
    this.composer.addPass(this.renderPass);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.45, 0.92);
    this.composer.addPass(this.bloom);
    this.grade = new ShaderPass(GradeShader);
    this.composer.addPass(this.grade);
    this.output = new OutputPass();
    this.composer.addPass(this.output);

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  get aspect(): number {
    return this.width / this.height;
  }

  setQuality(q: Quality): void {
    this.quality = q;
    this.gl.shadowMap.enabled = q !== 'low';
    this.bloom.enabled = q !== 'low';
    this.resize();
  }

  resize(): void {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.width = w;
    this.height = h;
    const maxDpr = this.quality === 'high' ? 2 : this.quality === 'medium' ? 1.5 : 1;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    this.gl.setPixelRatio(dpr);
    this.gl.setSize(w, h, false);
    this.composer.setPixelRatio(dpr);
    this.composer.setSize(w, h);
    this.grade.uniforms.uAspect.value = w / h;
  }

  render(scene: THREE.Scene, camera: THREE.Camera, dt: number): void {
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const pc = camera as THREE.PerspectiveCamera;
      if (Math.abs(pc.aspect - this.aspect) > 1e-4) {
        pc.aspect = this.aspect;
        pc.updateProjectionMatrix();
      }
    }
    this.renderPass.scene = scene;
    this.renderPass.camera = camera;
    this.grade.uniforms.uTime.value += dt;
    this.composer.render(dt);
  }

  /** Full-screen color flash (hit impacts, super moves). 0..1 */
  flash(color: THREE.ColorRepresentation, amount: number): void {
    this.grade.uniforms.uFlashColor.value.set(color);
    this.grade.uniforms.uFlash.value = Math.max(this.grade.uniforms.uFlash.value, amount);
  }

  /** Radial anime speed lines overlay. 0..1 */
  setSpeedLines(amount: number): void {
    this.grade.uniforms.uSpeed.value = amount;
  }

  /** Called every frame to decay transient effects. */
  tickEffects(dt: number): void {
    const u = this.grade.uniforms;
    u.uFlash.value = Math.max(0, u.uFlash.value - dt * 4.0);
  }
}

/** Vignette + radial speed lines + flash + subtle saturation boost (applied pre-tonemap). */
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uFlash: { value: 0 },
    uFlashColor: { value: new THREE.Color(1, 1, 1) },
    uSpeed: { value: 0 },
    uVignette: { value: 0.28 },
    uSaturation: { value: 1.12 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAspect;
    uniform float uFlash;
    uniform vec3 uFlashColor;
    uniform float uSpeed;
    uniform float uVignette;
    uniform float uSaturation;
    varying vec2 vUv;

    float hash( float n ) { return fract( sin( n ) * 43758.5453123 ); }

    void main() {
      vec4 c = texture2D( tDiffuse, vUv );
      vec3 col = c.rgb;

      float l = dot( col, vec3( 0.2126, 0.7152, 0.0722 ) );
      col = mix( vec3( l ), col, uSaturation );

      vec2 p = ( vUv - 0.5 ) * vec2( uAspect, 1.0 );
      float r = length( p );
      col *= 1.0 - uVignette * smoothstep( 0.45, 1.25, r );

      if ( uSpeed > 0.001 ) {
        float a = atan( p.y, p.x );
        float seg = floor( a * 38.0 / 3.14159 );
        float rnd = hash( seg + floor( uTime * 24.0 ) * 13.1 );
        float line = step( 0.62, rnd ) * smoothstep( 0.28, 0.85, r ) * uSpeed;
        col = mix( col, vec3( 1.0 ), line * 0.75 );
      }

      col = mix( col, uFlashColor * 1.5, clamp( uFlash, 0.0, 1.0 ) );
      gl_FragColor = vec4( col, c.a );
    }
  `,
};
