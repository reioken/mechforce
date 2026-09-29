# MECHFORCE — Session Handoff

This file lets a fresh Claude session (e.g. a local session with Chrome) pick up the project. Read it fully
before doing anything.

## The request (from the project owner)

> Recreate the game *Gotcha Force* (GameCube) — an obscure anime mecha toy arena fighter — as a **spiritual
> remake**. You collect gacha toys, build your army, take teams into battle, each character with its own
> moveset. Deep-research the game first. Add modern sensibilities and gameplay changes that make it more fun for
> modern players (maybe **roguelite** elements). It should **look REALLY awesome** and **feel super good to
> play**, with lots of variety in the toys/mechs, really cool designs, **combinations and fusions**, maybe more.
> Brainstorm with multiple agents. Needs a **good UI**, an **anime story**, **anime cutscenes** and **anime
> character designs** — like Gotcha Force.

**Latest instruction (overrides earlier plans):** *Do not build the game's art procedurally the way the
placeholder toys look. First make art mockups with Gemini (in Chrome).* → Follow
[`docs/ART_MOCKUP_BRIEF.md`](ART_MOCKUP_BRIEF.md).

## Where things stand

| Area | Status | Where |
|---|---|---|
| Research | 6 researchers ran; notes in `research_notes/Gotcha Force remake research/*.md`. A synthesized report will be pushed as `reports/Gotcha Force remake research.md` by the cloud session. | `research_notes/`, `reports/` |
| Engine skeleton | Vite + TypeScript + Three.js + Preact. Cel-shaded toon material (rim, spec, hit-flash, chrome/gold/clear/holo finishes), ink outlines, bloom + anime grade post chain, unified keyboard/mouse/gamepad input, seeded RNG, canvas textures, VFX system (particles, toon smoke, debris, rings, slashes, beams, afterimages). | `src/engine/`, `src/battle/vfx.ts` |
| Mech builder | Blueprint-driven SD mech assembler + procedural animator. **Placeholder art** — keep the rig/animation/blueprint *architecture*, but the look must be redone to match the approved mockups. | `src/mech/` |
| Audio | A procedural Web Audio engine (music tracks, SFX, stingers) is being built in the cloud session and will be pushed to `src/audio/`. | `src/audio/` |
| Art mockups | **Next step.** Not started. | `docs/ART_MOCKUP_BRIEF.md` → `docs/mockups/` |
| Game design doc | Not started — do the multi-agent brainstorm after the mockups (they will shape it). | `docs/GDD.md` (to create) |

### Key research facts (short version)

- Gotcha Force: Capcom, 2003, from the Gundam-vs team. Hero Kou + partner **G-Red** (from destroyed planet Mega
  Borg) vs the **Death Force** led by **Desbrain** ("Galactic Emperor" in the West). 14 kids with animal motifs,
  200+ collectible **Borgs**, squads limited by cost, final battle with giant Borgs.
- Metacritic 56 (users 8.6); ~25k sold in Japan. Loved for the collecting + chaotic battles; criticised for the
  camera, repetitive missions, grinding for random unlocks, AI allies stealing kills, friendly fire, thin story,
  weak English dub, frame drops. Now a ~$250+ cult classic with a Dolphin netplay scene.
- Modern levers: Slay-the-Spire/Hades run structure, pick-1-of-3 rewards, Hades-style narrative progression
  across runs, cost-capped squads (PokéRogue/Gundam EXVS team cost), fusion with previews and skill choice
  (SMT/Cassette Beasts), core-robot + armor combining (GaoGaiGar/Gridman), non-predatory gacha with pity and
  no real money, game-feel numbers (hitstop, trauma shake, input buffering).

## How to continue (local session)

1. `git fetch origin && git checkout claude/sharp-lamport-qj717v && git pull`
2. `npm install`
3. Make sure Chrome with the Claude extension is connected, and that you're signed in to Gemini.
4. Kick-off prompt suggestion:
   > Read `docs/HANDOFF.md` and `docs/ART_MOCKUP_BRIEF.md`. Using Gemini in Chrome, generate the Phase 1
   > mockups, save them to `docs/mockups/`, show me the options and help me pick a style direction. Then do
   > Phases 2–3 in that style, write `docs/mockups/NOTES.md`, commit and push.
5. After the mockups are approved: run the multi-agent brainstorm (combat, roguelite/meta, roster & fusions,
   anime story & cast, art direction & UI) using the research + mockups, write `docs/GDD.md`, then implement.

**Coordination:** the cloud session may still push the research report and `src/audio/`. Always
`git pull --rebase` before committing, and keep mockup work inside `docs/mockups/` to avoid conflicts.

## Dev commands

- `npm run dev` — dev server (Vite). `?sandbox` shows the placeholder toy lineup.
- `npm run typecheck`, `npm test`
- `node scripts/shot.mjs "?sandbox" shots/x.png --wait 5000` — headless Chromium screenshot (SwiftShader WebGL).
