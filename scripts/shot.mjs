#!/usr/bin/env node
/**
 * Screenshot harness: boots the Vite dev server, opens the game in headless
 * Chromium (SwiftShader WebGL) and captures PNGs.
 *
 *   node scripts/shot.mjs "?sandbox" shots/sandbox.png --wait 4000 --size 1280x720
 *   node scripts/shot.mjs "?scene=battle" shots/battle.png --keys "KeyW:1500,KeyJ:200" --frames 3
 *
 * Options:
 *   --wait ms        wait after load before capturing (default 3500)
 *   --size WxH       viewport (default 1280x720)
 *   --keys list      comma list of Key:durationMs presses performed after the wait
 *   --frames n       capture n screenshots spaced by --every ms (suffix -0, -1 ...)
 *   --every ms       spacing between frames (default 400)
 *   --eval js        JS evaluated in page after load (before keys)
 *   --url base       use an already-running server instead of starting one
 */
import { chromium } from 'playwright';
import { createServer } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const query = args[0] ?? '';
const out = args[1] ?? 'shots/shot.png';
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const wait = Number(opt('wait', 3500));
const [w, h] = opt('size', '1280x720').split('x').map(Number);
const keys = opt('keys', '');
const frames = Number(opt('frames', 1));
const every = Number(opt('every', 400));
const evalJs = opt('eval', '');
let base = opt('url', '');

let server = null;
if (!base) {
  server = await createServer({ server: { port: 5199 + Math.floor(Math.random() * 400), strictPort: false }, logLevel: 'error' });
  await server.listen();
  const addr = server.httpServer.address();
  base = `http://localhost:${addr.port}/`;
}

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: w, height: h } });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}\n${e.stack ?? ''}`));

await page.goto(base + query, { waitUntil: 'load' });
await page.waitForTimeout(wait);
if (evalJs) await page.evaluate(evalJs);
for (const k of keys.split(',').filter(Boolean)) {
  const [key, dur] = k.split(':');
  if (key === 'wait') {
    await page.waitForTimeout(Number(dur));
    continue;
  }
  await page.keyboard.down(key);
  await page.waitForTimeout(Number(dur ?? 100));
  await page.keyboard.up(key);
}
fs.mkdirSync(path.dirname(out), { recursive: true });
for (let i = 0; i < frames; i++) {
  const file = frames > 1 ? out.replace(/\.png$/, `-${i}.png`) : out;
  await page.screenshot({ path: file });
  console.log(`saved ${file}`);
  if (i < frames - 1) await page.waitForTimeout(every);
}
const errors = logs.filter((l) => l.startsWith('[error]') || l.startsWith('[pageerror]'));
if (logs.length) console.log(logs.slice(-40).join('\n'));
await browser.close();
if (server) await server.close();
process.exit(errors.length ? 1 : 0);
