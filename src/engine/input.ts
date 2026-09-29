/**
 * Unified input: keyboard + mouse + gamepad mapped to abstract actions.
 *
 * - Battle code reads `move`, `look`, `down(a)` and `consumePress(a, window)`
 *   (press buffering so inputs made slightly early still count).
 * - UI code subscribes to `onNav` which delivers menu navigation events with
 *   key-repeat, from whichever device the player is using.
 * - `lastDevice` lets the UI show the right button prompts.
 */

export type Action =
  | 'jump'
  | 'dash'
  | 'shoot'
  | 'melee'
  | 'special'
  | 'swap'
  | 'ultimate'
  | 'lock'
  | 'guard'
  | 'pause'
  | 'confirm'
  | 'back'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'tabL'
  | 'tabR'
  | 'info';

export const ALL_ACTIONS: Action[] = [
  'jump', 'dash', 'shoot', 'melee', 'special', 'swap', 'ultimate', 'lock', 'guard',
  'pause', 'confirm', 'back', 'up', 'down', 'left', 'right', 'tabL', 'tabR', 'info',
];

export type Device = 'keyboard' | 'gamepad';

export type NavEvent = { action: Action; repeat: boolean };

/** Keyboard bindings by KeyboardEvent.code. Mouse buttons use 'Mouse0'..'Mouse2'. */
export const DEFAULT_KEY_BINDINGS: Record<Action, string[]> = {
  jump: ['Space'],
  dash: ['ShiftLeft', 'ShiftRight'],
  shoot: ['KeyJ', 'Mouse0'],
  melee: ['KeyK', 'Mouse2'],
  special: ['KeyL', 'KeyE'],
  swap: ['KeyQ', 'KeyU'],
  ultimate: ['KeyF', 'KeyI'],
  lock: ['Tab', 'Mouse1', 'KeyR'],
  guard: ['KeyC', 'ControlLeft'],
  pause: ['Escape', 'KeyP'],
  confirm: ['Enter', 'Space', 'KeyJ'],
  back: ['Escape', 'Backspace', 'KeyK'],
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  tabL: ['KeyQ', 'PageUp'],
  tabR: ['KeyE', 'PageDown'],
  info: ['Tab', 'KeyI'],
};

/** Standard-mapping gamepad button indices. */
export const DEFAULT_PAD_BINDINGS: Record<Action, number[]> = {
  jump: [0],
  dash: [1],
  shoot: [2, 7],
  melee: [3],
  special: [5],
  swap: [4],
  ultimate: [6],
  lock: [11, 10],
  guard: [],
  pause: [9],
  confirm: [0],
  back: [1],
  up: [12],
  down: [13],
  left: [14],
  right: [15],
  tabL: [4],
  tabR: [5],
  info: [8, 3],
};

const NAV_ACTIONS: Action[] = ['up', 'down', 'left', 'right', 'confirm', 'back', 'tabL', 'tabR', 'info', 'pause'];
const STICK_DEADZONE = 0.22;
const NAV_REPEAT_DELAY = 0.34;
const NAV_REPEAT_RATE = 0.075;

export class Input {
  readonly move = { x: 0, y: 0 };
  /** Look delta accumulated since the last `takeLook()` (mouse px scaled / stick). */
  private lookAccum = { x: 0, y: 0 };
  /** Right stick held value (for continuous camera orbit). */
  readonly lookStick = { x: 0, y: 0 };

  lastDevice: Device = 'keyboard';
  /** When true, battle actions are read; menus use nav events either way. */
  gameplayEnabled = false;
  mouseSensitivity = 1;

  private keys = new Set<string>();
  private tapped = new Set<string>();
  private padButtons: boolean[] = [];
  private padIndex = -1;

  private downNow = new Set<Action>();
  private downPrev = new Set<Action>();
  private pressTime = new Map<Action, number>();
  private releaseTime = new Map<Action, number>();
  private holdStart = new Map<Action, number>();
  private time = 0;

  private navHeld = new Map<Action, number>();
  private navListeners = new Set<(e: NavEvent) => void>();
  private deviceListeners = new Set<(d: Device) => void>();

  keyBindings = structuredClone(DEFAULT_KEY_BINDINGS);
  padBindings = structuredClone(DEFAULT_PAD_BINDINGS);

  private pointerLockTarget: HTMLElement | null = null;

  attach(target: Window = window): void {
    target.addEventListener('keydown', (e) => {
      if (isTypingTarget(e.target)) return;
      if (e.code === 'Tab' || e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
      if (!e.repeat) {
        this.keys.add(e.code);
        this.tapped.add(e.code);
      }
      this.setDevice('keyboard');
    });
    target.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });
    target.addEventListener('blur', () => {
      this.keys.clear();
    });
    target.addEventListener('mousedown', (e) => {
      const code = `Mouse${e.button}`;
      this.keys.add(code);
      this.tapped.add(code);
      this.setDevice('keyboard');
      if (this.gameplayEnabled && this.pointerLockTarget && document.pointerLockElement !== this.pointerLockTarget) {
        this.pointerLockTarget.requestPointerLock?.();
      }
    });
    target.addEventListener('mouseup', (e) => {
      this.keys.delete(`Mouse${e.button}`);
    });
    target.addEventListener('contextmenu', (e) => {
      if (this.gameplayEnabled) e.preventDefault();
    });
    target.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement) {
        this.lookAccum.x += e.movementX * 0.0025 * this.mouseSensitivity;
        this.lookAccum.y += e.movementY * 0.0025 * this.mouseSensitivity;
      }
    });
    target.addEventListener('gamepadconnected', (e) => {
      this.padIndex = (e as GamepadEvent).gamepad.index;
    });
  }

  /** Element that receives pointer lock during gameplay (the canvas). */
  setPointerLockTarget(el: HTMLElement | null): void {
    this.pointerLockTarget = el;
  }

  releasePointer(): void {
    if (document.pointerLockElement) document.exitPointerLock?.();
  }

  onNav(cb: (e: NavEvent) => void): () => void {
    this.navListeners.add(cb);
    return () => this.navListeners.delete(cb);
  }

  onDeviceChange(cb: (d: Device) => void): () => void {
    this.deviceListeners.add(cb);
    return () => this.deviceListeners.delete(cb);
  }

  /** Call once per rendered frame before simulation steps. */
  update(dt: number): void {
    this.time += dt;
    this.pollGamepad();

    this.downPrev = this.downNow;
    this.downNow = new Set();
    for (const a of ALL_ACTIONS) {
      if (this.rawDown(a)) this.downNow.add(a);
    }
    for (const a of ALL_ACTIONS) {
      const wasTapped = this.keyBindings[a].some((k) => this.tapped.has(k));
      if ((this.downNow.has(a) && !this.downPrev.has(a)) || wasTapped) {
        this.pressTime.set(a, this.time);
        this.holdStart.set(a, this.time);
      }
      if (!this.downNow.has(a)) {
        if (this.downPrev.has(a)) this.releaseTime.set(a, this.time);
        if (!wasTapped) this.holdStart.delete(a);
      }
    }
    this.tapped.clear();

    // Movement vector (keyboard)
    let mx = 0;
    let my = 0;
    if (this.keys.has('KeyA')) mx -= 1;
    if (this.keys.has('KeyD')) mx += 1;
    if (this.keys.has('KeyW')) my += 1;
    if (this.keys.has('KeyS')) my -= 1;
    if (!this.gameplayEnabled) {
      mx = 0;
      my = 0;
    }
    // Camera keys (keyboard-only players)
    let lx = 0;
    let ly = 0;
    if (this.gameplayEnabled) {
      if (this.keys.has('ArrowLeft')) lx -= 1;
      if (this.keys.has('ArrowRight')) lx += 1;
      if (this.keys.has('ArrowUp')) ly -= 1;
      if (this.keys.has('ArrowDown')) ly += 1;
    }

    const pad = this.getPad();
    if (pad) {
      const ax = applyDeadzone(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
      if (ax.len > 0) {
        mx = ax.x;
        my = -ax.y;
        this.setDevice('gamepad');
      }
      const rx = applyDeadzone(pad.axes[2] ?? 0, pad.axes[3] ?? 0);
      if (rx.len > 0) {
        lx = rx.x;
        ly = rx.y;
        this.setDevice('gamepad');
      }
    }
    const len = Math.hypot(mx, my);
    if (len > 1) {
      mx /= len;
      my /= len;
    }
    this.move.x = mx;
    this.move.y = my;
    this.lookStick.x = lx;
    this.lookStick.y = ly;

    this.updateNav(dt);
  }

  down(a: Action): boolean {
    return this.downNow.has(a);
  }

  pressed(a: Action): boolean {
    return this.pressTime.get(a) === this.time;
  }

  released(a: Action): boolean {
    return this.releaseTime.get(a) === this.time;
  }

  /**
   * True if `a` was pressed within the last `window` seconds and not yet consumed.
   * Consuming prevents the same press from triggering twice.
   */
  consumePress(a: Action, window = 0.12): boolean {
    const t = this.pressTime.get(a);
    if (t === undefined) return false;
    if (this.time - t <= window) {
      this.pressTime.delete(a);
      return true;
    }
    return false;
  }

  /** Seconds the action has been held (0 if not held). */
  heldFor(a: Action): number {
    const t = this.holdStart.get(a);
    return t === undefined ? 0 : this.time - t;
  }

  takeLook(): { x: number; y: number } {
    const r = { x: this.lookAccum.x, y: this.lookAccum.y };
    this.lookAccum.x = 0;
    this.lookAccum.y = 0;
    return r;
  }

  /** Vibrate the active gamepad if supported. */
  rumble(strong: number, weak: number, ms: number): void {
    const pad = this.getPad() as (Gamepad & { vibrationActuator?: any }) | null;
    const act = pad?.vibrationActuator;
    if (act?.playEffect) {
      act.playEffect('dual-rumble', {
        startDelay: 0,
        duration: ms,
        strongMagnitude: Math.min(1, strong),
        weakMagnitude: Math.min(1, weak),
      }).catch(() => {});
    }
  }

  private rawDown(a: Action): boolean {
    for (const k of this.keyBindings[a]) if (this.keys.has(k)) return true;
    for (const b of this.padBindings[a]) if (this.padButtons[b]) return true;
    return false;
  }

  private getPad(): Gamepad | null {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return null;
    const pads = navigator.getGamepads();
    if (this.padIndex >= 0 && pads[this.padIndex]) return pads[this.padIndex];
    for (const p of pads) {
      if (p && p.connected) {
        this.padIndex = p.index;
        return p;
      }
    }
    return null;
  }

  private pollGamepad(): void {
    const pad = this.getPad();
    if (!pad) {
      this.padButtons = [];
      return;
    }
    const next: boolean[] = [];
    let any = false;
    for (let i = 0; i < pad.buttons.length; i++) {
      const b = pad.buttons[i];
      next[i] = b.pressed || b.value > 0.5;
      if (next[i] && !this.padButtons[i]) any = true;
    }
    this.padButtons = next;
    if (any) this.setDevice('gamepad');
  }

  private setDevice(d: Device): void {
    if (this.lastDevice !== d) {
      this.lastDevice = d;
      for (const cb of this.deviceListeners) cb(d);
    }
  }

  private updateNav(dt: number): void {
    // Left stick acts as a d-pad in menus.
    const pad = this.getPad();
    const stick = pad ? applyDeadzone(pad.axes[0] ?? 0, pad.axes[1] ?? 0) : { x: 0, y: 0, len: 0 };
    const stickDir: Partial<Record<Action, boolean>> = {
      left: stick.x < -0.5,
      right: stick.x > 0.5,
      up: stick.y < -0.5,
      down: stick.y > 0.5,
    };
    for (const a of NAV_ACTIONS) {
      const isDown = this.downNow.has(a) || !!stickDir[a];
      if (!isDown) {
        this.navHeld.delete(a);
        continue;
      }
      const held = this.navHeld.get(a);
      if (held === undefined) {
        this.navHeld.set(a, 0);
        this.emitNav({ action: a, repeat: false });
      } else if (a === 'up' || a === 'down' || a === 'left' || a === 'right') {
        const t = held + dt;
        this.navHeld.set(a, t);
        if (t > NAV_REPEAT_DELAY) {
          this.navHeld.set(a, NAV_REPEAT_DELAY - NAV_REPEAT_RATE);
          this.emitNav({ action: a, repeat: true });
        }
      }
    }
  }

  private emitNav(e: NavEvent): void {
    for (const cb of this.navListeners) cb(e);
  }
}

function applyDeadzone(x: number, y: number): { x: number; y: number; len: number } {
  const len = Math.hypot(x, y);
  if (len < STICK_DEADZONE) return { x: 0, y: 0, len: 0 };
  const scaled = Math.min(1, (len - STICK_DEADZONE) / (1 - STICK_DEADZONE));
  return { x: (x / len) * scaled, y: (y / len) * scaled, len: scaled };
}

function isTypingTarget(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
}

export const input = new Input();
