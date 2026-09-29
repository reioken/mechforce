# GACHARGE! — Art mockup notes

Mockups generated with Gemini (Pro model, image tool) on 2026-09-29, following [`../ART_MOCKUP_BRIEF.md`](../ART_MOCKUP_BRIEF.md).
All images are **candidates for review**, not final art.

## Style direction

**Phase 1 (key art + battle, styles A/B/C):** no single winner was picked. After seeing the six Phase 1 images,
the decision was to take **four directions** into Phases 2–3 so they can be compared on real content:

| Suffix | Direction | Reference images attached in Gemini |
|---|---|---|
| `-A` | A — Saturday-Morning Cel | `key-art-A.jpg` |
| `-AB` | A+B blend | `key-art-A.jpg` + `key-art-B.jpg` |
| `-B` | B — Neo Super Robot | `key-art-B.jpg` |
| `-C` | C — Toy-Photo Real | `key-art-C.jpg` + `battle-C.jpg` (the key art alone missed the 3D-toy look) |

**Recommendation after Phases 2–3:** use **A as the base style** for characters, mechs, story art and in-game
models. It is the most consistent across images, gets labels and callouts right most often, and is closest to
the existing cel-shaded toon renderer. Take the **A+B graphic language for UI, super-move cut-ins and cards**
(colour-coded slanted panels, halftone, flame eyes, holo frames); A+B produced the best hub, cut-in and card.
Use **C's depth of field and warm window light as an in-game camera/post effect** rather than as an art style.
Pure **B** has the most energy but produced the most text glitches. Final single-direction pick is still open.
When it is made, generate the remaining brief images (04, 05, 07–10, 13–16, 18, 20) in that style only.

## How the images were made

- Phase 1: brief prompts used verbatim, with `{STYLE}` replaced by the direction's style line.
- Phases 2–3: `Same art style and same characters as the attached image(s).` + brief prompt verbatim + the
  direction's style line. For A+B the prefix was `Same characters as the attached images.` with this style line:
  *"Style: a blend of the two attached images — the early-2000s TV anime cel look of the first (clean black ink
  lines, 2-tone cel shading, bright saturated primaries, soft painted backgrounds) pushed with the energy of the
  second (thick confident linework, neon accent glows, dramatic perspective and impact frames on action moments)."*
- Phases 2–3 were done as a **6-image subset** per direction: 03 hero sheet, 06 NOVABLAZE sheet, 11 capsule pull,
  12 hub, 17 super-move cut-in, 19 album card.
- **Files are `.jpg`**: Gemini delivers JPEG; converting to PNG adds size without quality. Names otherwise follow
  the brief, with a style suffix. The hero sheet keeps the brief's filename `char-sora` even though the hero is
  now Hikaru.
- **Aspect ratios:** Gemini offers no 3:2 or 2:3 option. For `-A`, sheets were forced to 4:3 and the card to 3:4.
  For `-AB`, `-B` and `-C` the ratio was left on automatic, and Gemini followed the brief's 3:2 / 2:3 from the
  prompt text.

## Per-image notes (keep / change)

### Phase 1

| File | Keep | Change |
|---|---|---|
| `key-art-A.jpg` | Cleanest title visual; logo with katakana rendered well; hero, NOVABLAZE, glowing capsule machine and seaside sunset all as briefed. | NOVABLAZE reads too big for a 10 cm toy next to the kid; the capsule in his hand holds a tiny *kid* figure instead of a toy robot. |
| `battle-A.jpg` | Best readability and toy-scale cues (bed, ABC blocks, pencil cup, giant red sneaker, braided rug); complete HUD (portrait, HP/boost, squad icons with points, lock-on + enemy HP, special gauge with prompts, minimap). | Squad costs (130/20/20 pts) don't read as a cost-capped squad. |
| `key-art-B.jpg` | Most energy; strongest, most "logo-like" GACHARGE! mark. | Scale of desk/toy is off; composition crowds the capsule machine behind the kid. |
| `battle-B.jpg` | Impact frames, slash ring, neon lock-on; GACHARGE! logo printed on the giant sneaker is a fun in-world touch; extra grey grunt robots could inspire the Rustlings. | HUD text errors ("Orange Dino: 4pts" twice); busiest frame to read. |
| `key-art-C.jpg` | Warm light, bokeh capsule in the foreground, good logo. | Ignored the "glossy 3D plastic toy" direction; reads as soft painted anime, too close to A. |
| `battle-C.jpg` | The only image that nails C: tilt-shift depth of field and warm window light make the toys feel tiny. Worth copying as an in-engine camera effect. | NOVABLAZE lost its golden V-crest and reads as a different robot; PlayStation-style button glyphs. |

### 03 · Hero sheet — `char-sora-*.jpg`

| File | Keep | Change |
|---|---|---|
| `char-sora-A.jpg` | Most faithful sheet: boy + girl (girl clearly different with a bob), front/back, all 6 labelled expressions each, clean grey background; best candidate for reuse. | Wrist dial reads as a generic blue gauntlet; make the gacha-handle shape clearer. |
| `char-sora-AB.jpg` | Girl version has her own wild brown hair; nice "gacha wrist dial" callout. | Each expression row is missing one expression (boy: sly, girl: shocked). |
| `char-sora-B.jpg` | Punchy linework; all 6 expressions per version. | Girl version is nearly identical to the boy (same spiky hair); decorative capsule corners make it less clean for reuse. |
| `char-sora-C.jpg` | Labelled callouts; the vinyl-figure look of the kid is interesting for merch. | Girl version identical to boy; C's rule says the kids stay 2D anime, but the full-body figures came out 3D. |

### 06 · NOVABLAZE sheet — `mech-novablaze-sheet-*.jpg`

| File | Keep | Change |
|---|---|---|
| `mech-novablaze-sheet-A.jpg` | **Best reference sheet overall:** callouts (V-crest, cyan optics, scarf, arm blaster, saber holder, boots), 10 cm scale bar, 4 poses, head unit, capsule packaging, heel stamp GC-001, ball joint. Matches key art A. | Nothing major. Use it as the modelling reference if A wins. |
| `mech-novablaze-sheet-AB.jpg` | Very clean; cyan FX on poses; heel close-up "GC-001 NOVABLAZE"; "fits standard 2-inch capsule" is a nice product detail. | It invented "Series: GC (Gashapon Charge)". *Gashapon* is a Bandai trademark, so keep it out of all text. |
| `mech-novablaze-sheet-B.jpg` | Comic-panel action poses with SFX lettering; joint callout list; heel stamp. | Smeared, garbled area top-right (action-poses header); nonsense text "CAL ETER PALETTI". |
| `mech-novablaze-sheet-C.jpg` | Glossy toy-plastic render, looks like a real product shot; heel stamps shown. | Front view and head close-up are blurred/ghosted; stray sketch of the kid in the corner; loosest layout. |

### 11 · Capsule pull — `capsule-pull-*.jpg`

| File | Keep | Change |
|---|---|---|
| `capsule-pull-A.jpg` | All UI text correct; cozy shop; Hikaru cheering in the background; golden capsule and holo reveal read instantly. | Invented a "STAMINA" meter; revealed toy is generic. |
| `capsule-pull-AB.jpg` | Most spectacular reveal (crystal holo robot, 超レア! lettering, burst). | "Guaranteed Rare in 3" appears twice; revealed robot leans too close to a well-known mobile-suit look. Keep designs original. |
| `capsule-pull-B.jpg` | First-person hand in Hikaru's red sleeve with star patch, which sells "you are pulling". | Coin counter shows 0 while pulls cost 100; the reveal is NOVABLAZE again instead of a new toy. |
| `capsule-pull-C.jpg` | Warm depth of field, cash register, Hikaru + NOVABLAZE watching; physical, toy-shop feel. | Whose hand turns the crank is unclear; revealed robot is again too mobile-suit-like. |

### 12 · Main hub — `ui-hub-*.jpg`

| File | Keep | Change |
|---|---|---|
| `ui-hub-A.jpg` | All 7 menu items correct; counters; Hikaru leaning with NOVABLAZE on his shoulder; "Kororin Dagashi" signage. | Grandma Tetsu is a generic granny (no round sunglasses or gold tooth). The hub prompt doesn't describe her, so add her look or generate sheet 05 first. |
| `ui-hub-AB.jpg` | Best UI of the set: colour-coded slanted panels, big コロリン駄菓子 sign, clear currencies. | Same generic Grandma Tetsu. |
| `ui-hub-B.jpg` | All 7 menu items correct; speed-line burst, alternating gold/grey slanted panels; "Gold Coins" and "Capsule Tokens" counters; NOVABLAZE on Hikaru's shoulder. | The menu sits in the middle and covers the shop; generic Grandma Tetsu. |
| `ui-hub-C.jpg` | Warm golden-hour shop with DOF; menu on the right leaves the characters room. | Menu panels are low-contrast (dark blue on warm background); generic Grandma Tetsu. |

### 17 · Super-move cut-in — `cutscene-super-*.jpg`

| File | Keep | Change |
|---|---|---|
| `cutscene-super-A.jpg` | Correct text plus katakana 灼熱のノヴァ・バスター; diagonal split as briefed; fiery eyes. | Logo in the corner isn't needed in a cut-in. |
| `cutscene-super-AB.jpg` | **Best cut-in:** flame eyes, neon beam, clean lettering. Use as the template for all super moves. | Nothing major. |
| `cutscene-super-B.jpg` | Glowing blue eyes, charged plasma orb. | Attack name broken: "NOVA" shrank to an unreadable squiggle. |
| `cutscene-super-C.jpg` | Same energy as A+B plus a blurred bedroom behind NOVABLAZE, which keeps the toy scale even in a cut-in. | Warmer palette makes it less distinct from the battle scene. |

### 19 · Album card — `album-card-*.jpg`

| File | Keep | Change |
|---|---|---|
| `album-card-A.jpg` | Presented inside an open album page, a nice idea for the Album screen. | Card is small and not clean for reuse; moves renamed ("Dual Claw"). Regenerate the card alone, full frame. |
| `album-card-AB.jpg` | **Best card:** holo frame, subtitle 忍者騎士・蒼霧, all fields, move stats; horned helmet is closest to the crescent crest. | Invented "Vol. 2" text. |
| `album-card-B.jpg` | Busy holo frame; all fields present. | Rarity shows 3½ stars instead of 4; dice icon next to cost is unexplained. |
| `album-card-C.jpg` | 3D toy mid-leap on ABC blocks with DOF; "Windblade Ninja" subtitle; premium collector feel. | AOGIRI lost the knight armour, crescent crest and fins, and reads as a plain ninja. |

## Ideas the images suggested

- **Album screen as a real binder:** cards slotted into album pages (`album-card-A`).
- **Brand on props:** the GACHARGE! logo on the giant sneaker in `battle-B`. In-world product placement for arenas.
- **Grey grunt robots** in `battle-B` fit the Rust Legion **Rustlings** as a basic enemy.
- **Card subtitles in kanji** (忍者騎士・蒼霧 "ninja knight, blue mist") give every toy a Japanese title for flavour.
- **"Fits standard 2-inch capsule"** callout (`mech-novablaze-sheet-AB`): toy specs as collectible lore on album cards.
- **Camera:** tilt-shift depth of field and warm window light from `battle-C` as the in-battle post effect.

## Consistency issues to fix in the next round

- Grandma Tetsu: generate sheet 05 first, then attach it wherever she appears.
- AOGIRI: define the crescent crest, knight armour and cape-fins in a mech sheet before more cards.
- Keep new toys clearly original (avoid mobile-suit-style V-fin faces on anything except NOVABLAZE's brief crest).
- Watch generated text: missing words, duplicated labels and invented series names turned up in almost every
  direction.
