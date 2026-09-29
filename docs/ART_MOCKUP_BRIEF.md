# GACHARGE! — Art Mockup Brief (Gemini)

**Purpose:** lock the art direction *before* any game art is built. Generate these mockups with Gemini's
image model (gemini.google.com → image generation / "Nano Banana") in Chrome, iterate, and save the keepers
into `docs/mockups/` using the filenames below. Add one line per image to `docs/mockups/NOTES.md`
(what works, what to change). The procedural toy mechs currently in the repo are **placeholders only** —
the mockups define the target look.

## The game in one paragraph

A spiritual successor to Capcom's *Gotcha Force* (GameCube, 2003). Kids collect palm-sized **capsule-toy
mechs** from gacha machines; the toys come alive and fight **3D arena battles staged at toy scale in giant
everyday places** — a bedroom floor, a kitchen counter, a schoolyard sandbox, a toy-shop shelf, a rooftop at
sunset, a villain fortress built from junk toys. You build squads under a point-cost limit, **fuse and combine**
toys into bigger forms, and push through a **roguelite campaign told like a Saturday-morning mecha anime**
(episodes, title cards, eyecatches, "next episode" previews, super-move cut-ins).

## Global rules (apply to every prompt)

- **Original designs only.** Never name or imitate Gotcha Force, Gundam, Transformers, Medabots, Pokémon or any
  other existing property in prompts. The only logo is our own: **GACHARGE!** (katakana ガチャージ).
- **Scale:** the mechs are ~10 cm toys. Always include scale cues (giant pencils, sneakers, cereal boxes,
  floor planks, dust motes the size of their heads).
- **Mechs:** chunky super-deformed (SD) proportions — head ≈ 1/3 of total height, big feet, big hands/weapons,
  readable silhouette, glowing eyes or visor, color-blocked capsule-toy plastic (subtle panel seams, small
  visible joints, a tiny stamped series number on the heel).
- **Kids:** 10–12 years old, big expressive anime eyes, one signature color and one signature prop each,
  silhouettes readable in black.
- **Heroes** use primary colors (red/blue/yellow/white); **villains** use secondaries (purple + acid green,
  purple + orange) with asymmetry and spikes.
- Aspect ratios: key art & screenshots **16:9**; character sheets **3:2**; cards **2:3**.
- For consistency after the style is chosen: **attach the approved key art (and prior character images) as
  reference images** and start prompts with *"Same art style and same characters as the attached image."*

## Names (title locked: **GACHARGE!**; the rest are working names, see `docs/NAMES.md`)

World terms: the living toys are **Kachibots**, sparked to life by the **Kira Spark**; kids summon them by
twisting a wrist **Kachi Dial** ("Twist it! Kachi-Kachi, KIRA ON!"). Hero team **Starcap Squad** (logo: a star
on a capsule lid). Hometown **Tsumiki Town**. Fusing two toys = **Twin-Twist**; three-toy super form =
**TRI-GIGANT**; super meter = **Kira Gauge**; a roguelite run = **Crank Run**.

| Role | Working name | Visual hook |
|---|---|---|
| Protagonist (boy **or** girl option) | **Hikaru Hoshino** | red bomber jacket with star patch, orange goggles, capsule belt, a chunky wrist "Kachi Dial" (a twistable gacha-handle dial) |
| Partner mech | **NOVABLAZE** ("NOVA!") | red-and-white SD hero robot, golden V-crest, cyan eyes, long yellow scarf, arm blaster + short beam saber |
| Rival | **Kyo Aonami** | cool rich kid, navy high-collar coat, silver hair over one eye, headphones |
| Rival mech | **AOGIRI** | sleek blue ninja-knight, crescent crest, twin blades, cape-like fins |
| Friend — builder | **Mei Kurumi** | techie girl, round glasses, tool-apron hoodie, screwdriver hair-pin; tank/artillery mech **BOOMBOX** |
| Friend — brawler | **Daigo "Dai" Oyama** | big gentle kid, headband, sleeveless jersey; dinosaur brawler mech **REXCRUSH** |
| Friend — support | **Pip Tanabe** | tiny shy kid in an oversized bunny hoodie; medic rabbit mech **MOCHI** |
| Mentor | **Grandma Tetsu** | runs the old candy & capsule shop "Kororin Dagashi", sunglasses, gold tooth, retired legend |
| Villain | **Emperor JUNKROWN** | a crowned tyrant made of broken, fused toys on a throne-capsule; one cracked glowing eye |
| Villain army | **the Rust Legion** (grunts: Rustlings) | abandoned toys corrupted with purple rust; after defeat they are *purified* and join you |
| Lieutenants | **Jester Jinx** (clown), **Dame Nightfall** (dark knight doll), **Hex-Kitty** (witch cat), **KAIJU-ZILL** (soft-vinyl kaiju) | one per act |

## Style directions to explore first

Append one of these suffixes to Phase 1 prompts, generate each, then choose one (or a blend):

- **A — Saturday-Morning Cel:** `Style: early-2000s TV anime cel look, clean black ink lines, 2-tone cel shading, bright saturated primaries, soft painted backgrounds, nostalgic kids' mecha anime.`
- **B — Neo Super Robot:** `Style: modern high-energy anime, bold flat colors and big graphic shapes, neon accent glows, thick confident linework, dramatic perspective and impact frames, sharp triangular highlights.`
- **C — Toy-Photo Real:** `Style: stylized 3D render of premium glossy plastic capsule toys, macro photography with shallow depth of field and tilt-shift, warm real-world lighting, cel-shaded outlines on the toys only, anime 2D characters composited in.`

---

## Phase 1 — Style exploration (6 images)

**01 · `key-art-A.png`, `key-art-B.png`, `key-art-C.png` — title-screen key visual**
> Anime key visual for a video game titled "GACHARGE!". An 11-year-old kid hero with spiky black hair, a red bomber jacket with a star patch and orange goggles on the forehead holds a glowing transparent gacha capsule up toward the viewer with a big confident grin. On the giant wooden school desk in front of him, a palm-sized red-and-white super-deformed toy robot with a golden V-shaped crest, glowing cyan eyes and a long flowing yellow scarf strikes a heroic pose with an arm blaster raised. Behind them a towering retro capsule-toy vending machine glows like a monument, colorful capsules spilling and bouncing out. Background: sunset over a small seaside town, light rays and sparkles. Dynamic low-angle perspective, speed lines, lens flare. Leave clear space at the top for a bold chrome-and-red "GACHARGE!" logo with small katakana ガチャージ underneath (render the logo). 16:9. {STYLE}

**02 · `battle-A.png`, `battle-B.png`, `battle-C.png` — in-game battle screenshot**
> Third-person gameplay screenshot of a 3D arena battle video game. Camera behind the player's palm-sized red-and-white SD toy robot with a yellow scarf, dashing across a giant wooden bedroom floor with a circular braided rug, giant alphabet building blocks, a toppled pencil cup and a sneaker the size of a building as cover. It locks on to a purple-and-green spiky villain toy robot firing a glowing beam; two allied toy robots (a blue ninja robot and an orange dinosaur robot) fight nearby. Bright hit sparks, anime smoke puffs, a shockwave ring, dust motes in sunbeams from a window. Clean game HUD: top-left player portrait with HP bar and boost gauge, a row of three small squad icons with point costs, a lock-on reticle on the enemy with its HP bar, bottom-right special-move gauge and button prompts, a small arena minimap. Cel-shaded 3D with ink outlines, vivid colors. 16:9. {STYLE}

→ **Stop here and pick a direction** (write the choice + reasons in `docs/mockups/NOTES.md`). Use the
winner as the reference image for everything below.

## Phase 2 — Characters & toys (9 images)

**03 · `char-sora.png` — protagonist sheet (boy + girl option)**
> Anime character design sheet on a light grey background: an 11-year-old protagonist named Hikaru shown twice — a boy version and a girl version wearing the same outfit (red bomber jacket with star patch, white T-shirt, black shorts, red-and-white sneakers, orange goggles, a belt with small capsule holders, a chunky blue wrist dial shaped like a gacha-machine handle). Each version: front view, back view, and a row of 6 expression headshots (grin, determined shout, shocked, sad, laughing, sly). Labels in clean small caps. 3:2.

**04 · `char-rival-friends.png` — rival + three friends lineup**
> Anime character lineup sheet, full body, front view, light background, with names in small caps: KYO (cool rival, silver hair over one eye, navy high-collar coat, headphones, arms crossed), MEI (techie girl, round glasses, hoodie with a tool apron, screwdriver hairpin, holding a tablet), DAI (big gentle kid, headband, sleeveless sports jersey, bandaged knuckles, huge smile), PIP (tiny shy kid in an oversized white bunny-ear hoodie, clutching a capsule). Each stands next to their own palm-sized SD toy robot: a sleek blue ninja-knight with twin blades; a boxy yellow tank robot with a speaker-shaped cannon; an orange dinosaur brawler robot with big fists; a round white medic rabbit robot with a cross emblem. 3:2.

**05 · `char-mentor-villains.png` — mentor, emperor, lieutenants**
> Anime character design sheet: GRANDMA TETSU, a tiny cheerful old lady who runs a retro candy-and-capsule shop, round sunglasses, gold tooth, apron covered in capsule-toy pins, holding a gleaming antique capsule; and the villains: EMPEROR JUNKROWN, a towering tyrant toy made of mismatched broken toy parts fused together with purple rust, a crooked crown, one cracked glowing green eye, seated on a throne shaped like a giant cracked capsule; and his four lieutenants: JESTER JINX (a lanky clown marionette toy with bomb juggling balls), DAME NIGHTFALL (a black-and-silver knight doll with a tattered cape and lance), HEX-KITTY (a witch-cat plush robot with a broom cannon), KAIJU-ZILL (a soft-vinyl kaiju toy with glowing spines). Villains use purple, acid green and orange. 3:2.

**06 · `mech-novablaze-sheet.png` — partner mech turnaround & poses**
> Mecha toy design sheet for NOVABLAZE, a palm-sized super-deformed hero toy robot: red-and-white armor, golden V-shaped crest, cyan eyes, a long yellow scarf, chunky boots, a blaster on the right forearm and a short glowing beam saber. Show front, side and back turnaround, plus 4 action poses (dash, blaster shot, saber slash, victory pose), close-ups of the head and the capsule it comes in, and small callouts of the joints and the stamped series number "GC-001" on the heel. Clean studio background. 3:2.

**07 · `capsule-series-01.png` — gashapon display card, 12 toys**
> A retro gashapon capsule-machine display card titled "GACHARGE! KACHIBOTS SERIES 01 — 12 KINDS + SECRET!", showing a numbered grid of 12 different palm-sized super-deformed toy robots with names and small rarity stars: a samurai with a crescent helmet, a white knight with a shield, a purple ninja, an orange dinosaur brawler, a green tank with a mono-eye, a jet-wing flyer, a witch robot with a staff, a cowboy robot with twin revolvers, a shark submarine robot, a bumblebee robot, a small dragon robot, and a pudding-dessert robot. A silhouetted "SECRET" slot at the end. Bright playful packaging design, halftone dots, capsule graphics. 2:3.

**08 · `rarity-variants.png` — chase variants**
> Product photo lineup of the same palm-sized super-deformed toy robot (red-and-white hero robot with golden V-crest and yellow scarf) in six collectible finishes, labelled: STANDARD (glossy painted plastic), CLEAR (translucent candy-red plastic showing the inner frame), CHROME (mirror silver), GOLD (shiny gold plating), HOLO (iridescent rainbow foil), GLOW (glow-in-the-dark green, shown glowing). Each stands on a small capsule base. Studio lighting, macro lens. 3:2.

**09 · `fusion-gattai.png` — combination sequence**
> Anime combination sequence in 4 panels: three palm-sized toy robots (a red hero robot, a blue ninja robot, an orange dinosaur robot) leap into the air in a spiral of light; they split into armor pieces; the pieces lock onto the red hero robot (dinosaur becomes chest armor and fists, ninja becomes wings and a helmet crest); final panel: a much bigger combined super robot "NOVABLAZE TRI-GIGANT" posing in front of a huge glowing capsule emblem, energy crackling, speed lines. 16:9.

**10 · `mech-villain-army.png` — Rust Legion enemies**
> Lineup of corrupted villain toy robots of the "Rust Legion" (Rustlings): broken, abandoned toys fused and mended with purple rust and glowing acid-green cracks — a wind-up tin robot grunt, a teddy-bear brute with button eyes, a doll-headed spider mech, a rusty toy tank, a jack-in-the-box launcher, a paper-plane drone swarm, and one giant boss: a soft-vinyl kaiju with glowing spines. Menacing but still toy-like and fun. Include a tiny "before/after purification" inset showing one of them restored to bright clean colors. 16:9.

## Phase 3 — Screens, UI & cutscenes (up to 12 images)

**11 · `capsule-pull.png` — capsule machine & reveal moment**
> Video game screen: the player's hand turns the crank of a glowing retro capsule machine in a cozy candy shop; a golden capsule rolls out and cracks open in a burst of light rays and confetti, revealing a sparkling holographic toy robot; big text "SUPER RARE!" with five stars; UI buttons "PULL x1 (100 coins)" and "PULL x10"; a pity counter "Guaranteed Rare in 3". Anime style, joyful. 16:9.

**12 · `ui-hub.png` — main hub**
> Video game main menu inside a warm retro candy-and-capsule shop after school (Kororin Dagashi): menu items on slanted bold panels — "STORY RUN", "SQUAD", "CAPSULES", "FUSION LAB", "ALBUM", "VERSUS", "SETTINGS"; the protagonist leans on the counter with their partner robot on their shoulder; Grandma Tetsu waves; capsule machines glow in the background; currency counters top-right. Bold anime UI with angled shapes, halftone, thick outlines. 16:9.

**13 · `ui-squad.png` — squad builder with cost limit**
> Video game squad-builder screen: a grid of collected toy robot cards on the right (each with portrait, name, rarity stars, element icon and a cost number), and on the left a squad of 5 slots with a big cost meter "SQUAD COST 27 / 30"; one selected card is enlarged showing the robot turning on a pedestal with stats (HP, ATK, SPD, BOOST), moveset icons (shot, melee, special, super) and a "FUSE" button. Clean, readable, controller-friendly anime UI. 16:9.

**14 · `ui-runmap.png` — roguelite run map**
> Video game roguelite route map styled like a kid's hand-drawn town map on graph paper with stickers: branching paths of nodes — sword icons (battles), skull (elite rival), capsule (gacha stop), wrench (workshop upgrade), fusion swirl, question mark (event), shopping bag (shop), bed (rest) — leading to a boss sticker at the top (a purple kaiju); the player's toy-robot token stands on the current node; side panel shows the squad, coins and collected "mod chips". 16:9.

**15 · `ui-reward.png` — post-battle reward (pick 1 of 3)**
> Video game post-battle results screen: big "VICTORY!" banner, the player's toy robots posing; a "CHOOSE 1" row of three holographic upgrade chips (e.g. "PIERCING BEAMS — shots pass through enemies", "AFTERBURNER — dashing leaves a fire trail", "BUDDY BOOST — swapping heals 10%"), each with an icon and rarity border; XP bars filling; coin counter. Bright anime UI. 16:9.

**16 · `cutscene-dialogue.png` — story scene with portraits**
> Anime visual-novel style story scene in a video game: a school rooftop at sunset background; large character portraits of HIKARU (determined, fist clenched) on the left and KYO (smirking, arms crossed) on the right; a dialogue box at the bottom with a name tag "KYO" and the line "Your toys are just plastic. Mine are weapons."; small partner robots peeking from the bottom corners. 16:9.

**17 · `cutscene-super.png` — super-move cut-in**
> Anime super-move cut-in frame: a diagonal slash splits the screen — top half is an extreme close-up of HIKARU's eyes blazing with determination, bottom half shows NOVABLAZE the red toy robot charging a gigantic beam with its scarf whipping; huge Japanese-anime-style attack name text "BLAZING NOVA BUSTER!!"; speed lines, impact frame colors, halftone. 16:9.

**18 · `cutscene-titlecard.png` — episode title card & eyecatch**
> Two frames side by side: (left) an anime episode title card — "EPISODE 1: THE CAPSULE THAT FELL FROM THE STARS" in bold hand-lettered type over a starry burst background with the red hero toy robot silhouette; (right) a playful anime "eyecatch" bumper — the GACHARGE! logo with the protagonist and partner robot doing a pose in front of a spinning capsule. 16:9.

**19 · `album-card.png` — collection album card**
> A collectible trading-card style entry for a toy robot collection album: card art of the blue ninja-knight toy robot "AOGIRI" mid-leap with twin blades, holographic foil frame, rarity 4 stars, number "GC-017", element icon (wind), cost 6, short flavor text, and three move icons. Clean card design. 2:3.

**20 · `arenas.png` — six arena concepts**
> Concept art grid of six video game battle arenas at toy scale, each labelled: KID'S BEDROOM FLOOR (rug, blocks, pencil cup), KITCHEN COUNTER (cereal box towers, sink canyon, fruit), SCHOOLYARD SANDBOX (bucket fortress, shovel ramps, pebbles), TOY SHOP SHELF (capsule machines as towers, price tags, glass), ROOFTOP AT SUNSET (water tank, antenna, city skyline), JUNKROWN FORTRESS (floating junk-toy citadel, purple rust, lightning). Consistent lighting and palette per arena. 16:9.

## Saving & notes

- Save chosen images at full resolution into `docs/mockups/` with the filenames above (keep alternates as
  `…-alt1.png`). Commit them with a message like `Add Gemini art mockups (phase 1)`.
- In `docs/mockups/NOTES.md` record: chosen style direction + why, per-image keep/change notes, and any new
  ideas the images suggested (names, mechanics, props).
- Images we may reuse directly in the game later (so generate them clean): character portraits/expression
  sheets (03–05), album card art (19), cutscene backgrounds (16), title key art (01).
