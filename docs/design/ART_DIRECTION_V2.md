# GACHARGE! — Art Direction V2: six ownable identities

Status: proposal, 2026-09-29. Follows up on [`../mockups/NOTES.md`](../mockups/NOTES.md) and
[`../ART_MOCKUP_BRIEF.md`](../ART_MOCKUP_BRIEF.md).

## 0. Diagnosis: why round 1 reads as "generic"

The owner's verdict: *"The direction in general is too generic. Not interesting or unique enough, should still fit
that Gotcha Force mold."* Looking at `key-art-A`, `battle-A`, `mech-novablaze-sheet-A` and `ui-hub-AB`, the cause is clear:

1. **The toys are drawn as tiny mecha rather than as toys.** NOVABLAZE is a textbook SD mobile suit: V-fin, visor eyes,
   white-red-gold trim, backpack, beam saber. Take away the kid and the desk and it could be any SD-Gundam fan work.
   Nothing on him says capsule, plastic, cheap, printed, collectable, or 100 yen.
2. **The rendering is the house style of the whole genre.** Clean black ink, 2-tone cel shading, painted sunset, speed
   lines, and chrome-and-red logo describe every mecha anime from 1995 to 2025. It does its job and could belong to any show.
3. **The graphic language is borrowed.** Slanted colour panels plus halftone is Persona/Gurren Lagann by default. It doesn't come
   out of our fiction (gacha, dagashi shop, capsules, toys).
4. **Scale gets lost.** In the key art the "palm-sized" toy reads as a small robot and not as a *toy*. The toy-scale
   fantasy is our strongest hook, and the art throws it away.

Gotcha Force worked because its Borgs were **dumb and specific**: a knight, a shark, a train, a kaiju, all with
toy logic, all popping out of capsules, all fighting in giant rooms. The mold to keep: **kid anime, toy logic, capsule
ritual, bright, collectable, and a sense of humour.** What we want to own is a style where one silhouette, one screenshot, or one UI
button would be recognisable as GACHARGE! with the logo cropped off.

**The test for every direction below:** *If you blur a screenshot, does it still read as "cheap, joyful Japanese
plastic toys fighting in a giant house" and not "robots fighting"?*

---

## Identity 1 — **DAGASHI PRINT** (駄菓子プリント)
*Showa candy-wrapper graphics, risograph misregistration, menko cards.*

**Pitch.** The whole game looks like it was printed on a 30-yen candy wrapper. It is set in Grandma Tetsu's dagashi shop,
so its look should come from the stuff sold there: umaibo wrappers, menko cards, ramune labels, sticker sheets, cheap
4-colour offset printing with the plates slightly out of register. Each toy is flat-coloured in 3–4 spot inks. Its details
are *printed on* (tampo) and not modelled, and it wears its sticker-sheet decals proudly, peeling corners and all. Shadows
are a halftone dot screen, and outlines are a second-colour ink that sits 1–2 px off the fill, like a bad print run. Every menu is a candy
wrapper, a prize ticket, or a shop price tag. The world is loud, flat, and warm, and it feels *handmade and cheap in the
best way*. No other mecha game looks like this.

**Design rules**
- Every toy uses a **max 4 spot inks** plus paper white. No gradients anywhere on the toy.
- **Details are print, not geometry:** eyes, vents, panel lines and emblems are tampo/sticker decals on simple forms.
  Faces are printed, so expressions swap by decal (a *sticker face*).
- **Misregistration line:** the ink outline is coloured (deep navy, magenta or brown, never black) and offset ~1–2 px
  from the fill on screen.
- **Halftone shading:** the shadow band is a dot screen in the shade ink, never a darker tint.
- **Sticker-sheet identity:** every toy ships with a sticker sheet (numbers, stars, mouths, eyes). Rare variants are
  *misprints*: shifted colours, inverted inks, glitter stock.
- **UI = dagashi ephemera:** buttons are wrapper strips with serrated (pinked) edges, reward chips are prize tickets
  (あたり!/はずれ), currency is a 10-yen coin stamp, and the album is a menko card binder.
- **Hand-lettered katakana** everywhere (shop-sign brush plus retro rounded gothic). The logo reads like a candy brand.

**Palette (spot inks)**
| Role | Hex |
|---|---|
| Paper | `#FFF4DC` |
| Tomato red | `#F0412B` |
| Ramune blue | `#1FA3E0` |
| Candy yellow | `#FFD23F` |
| Melon green | `#4CC26A` |
| Momo pink | `#FF7EB6` |
| Offset navy (line) | `#23305E` |
| Rust purple (villain ink) | `#6B2F8F` |

**Why it's unique.** Mecha anime is chrome, gradients, and black lines. This is paper, spot ink, and misregistration.
It is rooted in the fiction (the dagashi shop), it's instantly readable at thumbnail size, and nobody in the toy-robot
genre owns "printed ephemera" as a total look. It also makes the toys feel cheap and precious, which is exactly how a kid
feels about a 100-yen capsule.

**Three.js translation**
- `toonMaterial` with a 2-band ramp; in the shade band, sample a **screen-space halftone** (dot size by N·L,
  rotated 15°/45° per ink). This is cheap and runs in the fragment shader.
- **Misregistration**: render the inverted-hull outline (`addOutlines`) with a small **screen-space offset** in a
  coloured ink; optionally a second fill pass offset the other way at 30% for "double print".
- Decals via a per-toy **CanvasTexture sticker atlas** (`textures.ts` already builds canvas textures), projected with
  `DecalGeometry` or UV'd onto flat panels. Sticker faces change with state (hurt, charge, KO).
- Post: paper-grain overlay plus slight colour-plane shift (RGB offset) on impact frames only.
- Environments: the same halftone shader on props, with lower saturation than the toys, so toys always pop.

**Risks.** Halftone plus offset lines can shimmer in motion; lock the dot screen to object space or to a
camera-stable grid and test at 60 fps. Flatness can hurt depth reading in 3D arenas, so keep a clear rim light. It can
look "retro indie" rather than "big kid anime" if the characters lose energy, so pair it with punchy animation.

**Style line**
> `Style: Showa-era Japanese candy-wrapper print look — flat spot colors (tomato red, ramune blue, candy yellow, melon green, pink) on warm cream paper, risograph-style slight color misregistration, halftone dot shadows, colored offset outlines instead of black, toys covered in printed tampo details and peeling sticker decals, hand-lettered katakana, cheerful and loud like dagashi packaging.`

**Key visual prompt (paste-ready)**
> Key visual for a kids' video game titled "GACHARGE!", designed to look like a vintage Japanese dagashi candy wrapper printed in four spot inks. Center: a palm-sized toy robot named NOVABLAZE — clearly a cheap, chunky capsule toy, red and cream plastic, its round torso shaped like half of a gacha capsule, a big printed star sticker on its chest, sticker-decal eyes, a yellow printed scarf, one arm a simple cylinder blaster — striking a heroic pose on top of a giant open box of candy. Behind it, an 11-year-old boy with spiky black hair, orange goggles and a red bomber jacket with a star patch grins and holds up a transparent capsule; he is drawn larger and further back so the toy clearly fits in his hand. Around them: rolling capsules, candy, a 10-yen coin, a prize ticket saying "あたり!", starbursts. Flat colors only, halftone dot shading, slightly misregistered colored outlines like cheap offset printing, cream paper texture, serrated wrapper edges framing the whole image. At the top, a bold hand-lettered candy-brand logo "GACHARGE!" in red with a thick navy offset shadow, and small katakana "ガチャージ" underneath (render the logo and text exactly). Bright, joyful, 1970s–80s Japanese packaging energy. 16:9.

---

## Identity 2 — **CAPSULE BODY / GUMBALL GLASS** (カプセルボディ)
*Every toy is built around its own capsule. Translucent candy plastics, toy-commercial gloss.*

**Pitch.** The capsule is the toy's skeleton and not only its packaging. Every Kachibot's torso (or head, or belly, or shell)
is the **two halves of its own capsule**: a clear upper dome and a coloured lower cup, with the **Kira Core** (a glowing
marble-sized spark) floating visibly inside. Limbs clip onto the capsule's rim like add-ons. A knight's helmet is a capsule
dome, a turtle's shell is a capsule cup, and a tank turret is a capsule on its side. The rendering is a glossy late-80s
toy commercial: gumball-bright translucent plastics, a white seamless studio "sweep" for menus, hard specular stars, candy
subsurface glow. When a toy is KO'd it **snaps shut back into its capsule** and rolls away. That gives us the most recognisable
silhouette rule we could own, and it comes straight out of Gotcha Force.

**Design rules**
- **Capsule anatomy:** every toy contains one visible capsule (sizes S / M / L = point-cost tiers). Its seam line and lid
  ridge are always visible.
- **Clear-over-colour:** top half clear/tinted, bottom half opaque colour. The Kira Core is always visible through the clear half.
- **Kira Core colour = element** (fire red-orange, water cyan, wind mint, earth amber, spark yellow, rust purple).
- **KO = snap shut:** limbs fold in, capsule closes, rolls. Summon = capsule pops open and the toy unfolds.
- **Rarity is material:** common = opaque, rare = clear-tinted, super rare = glitter-fill, secret = glow-in-the-dark
  or chrome-plated capsule.
- **Rounded shape language:** circles and capsules first, rectangles second, spikes only on villains.
- **UI = capsule machine:** round buttons, the twist-handle dial as the main menu selector, capsule-window reveal frames.

**Palette**
| Role | Hex |
|---|---|
| Studio white | `#F7F9FC` |
| Gumball red | `#FF3B4E` |
| Soda cyan (clear tint) | `#5CE1FF` |
| Lemon clear | `#FFE66D` |
| Grape clear | `#B892FF` |
| Mint | `#6EF2B0` |
| Kira Core gold | `#FFB703` |
| Ink | `#1B1B3A` |

**Why it's unique.** Round capsule bodies break the angular V-fin mecha silhouette immediately. It is *our* mechanic
rendered as anatomy, it explains summon/KO/Twin-Twist visually (capsules clicking together), and it is a merch-ready product
design. You could sell the real thing.

**Three.js translation**
- The capsule is a shared `capsule()` / `dome()` primitive in `mech/shapes.ts`; `FrameKind` builders attach limbs to
  rim sockets. That keeps one procedural rule for the whole roster.
- Clear half: the existing `clear` finish (fresnel + fake refraction by sampling a blurred background or matcap). Avoid
  real `MeshPhysicalMaterial` transmission on mobile. The Kira Core is an additive `glowMaterial` sphere with a pulsing `uTime`.
- Hard star specular (existing `uSpec`) shaped like a 4-point sparkle.
- KO/summon animations are simple hinge rotations on the two halves, which are cheap and very readable.

**Risks.** Many round bodies can make the roster samey. Vary *where* the capsule sits (head, belly, shell, wheel, fist)
and the limb vocabulary. Transparency sorting in Three.js needs care (render clear halves last, depthWrite off). On its own
it's a *design rule*, not a full rendering style, so it combines well with 1 or 4.

**Style line**
> `Style: glossy late-1980s toy-commercial look — candy-bright translucent and opaque plastics, every toy robot's body built around a two-tone gacha capsule (clear dome on top, colored cup below) with a glowing marble-sized core visible inside, hard white star-shaped specular highlights, soft studio lighting, clean anime ink outlines on toys, 2D anime kid characters.`

**Key visual prompt (paste-ready)**
> Key visual for a kids' anime video game titled "GACHARGE!". On a giant sunlit school desk, a palm-sized toy robot hero named NOVABLAZE bursts out of an opening capsule: its chest IS a round two-tone gacha capsule — a clear upper dome over a red lower cup — with a glowing golden spark-core floating visibly inside; chunky red-and-white limbs clip onto the capsule rim, a small gold star-shaped crest on its round head, glowing cyan eyes, a long yellow scarf flying. Around it, a dozen other palm-sized toy robots also built around capsules (a turtle whose shell is a capsule, a knight whose helmet is a capsule dome, a tiny tank with a capsule turret) pop out of capsules bouncing across the desk. In the background an 11-year-old boy with spiky black hair, orange goggles and a red bomber jacket with a star patch twists the handle of a huge retro capsule machine, grinning; he is much larger than the toys, clearly showing they are toys. Glossy candy-colored translucent plastic, hard sparkle highlights, late-80s toy-commercial lighting, clean anime ink outlines, confetti and light rays. At the top, a bold glossy "GACHARGE!" logo whose letter "A" is shaped like a capsule, with small katakana "ガチャージ" underneath (render the logo and text exactly). Bright, fun, 16:9.

---

## Identity 3 — **TIN-SPARK SHOWA** (ブリキ・スパーク)
*Wind-up tin robots, lithographed metal, soft-vinyl kaiju villains.*

**Pitch.** Kachibots are the grandchildren of 1950s–60s Japanese tin toys: lithographed metal bodies with printed
rivets, gauges and smiling faces, tab-and-slot construction, **a big wind-up key in the back**, and sparking flint
guns. The Kira Spark literally *winds* them up. The villains are **sofubi (soft vinyl) kaiju** gone wrong: glossy,
swirly-sprayed, blobby vinyl, corrupted by purple rust that eats the tin. Battles have clockwork rhythm. Your
**boost is your spring tension** (the key spins down as you dash, and you re-wind by holding a button), and hits throw sparks
from the flint mechanism. Visually it's warm, nostalgic, and has a tactile *clank*. It suits Grandma Tetsu's hidden past as a champion of the
original tin-toy generation.

**Design rules**
- **Every toy has a wind-up key** (its Kira key), shaped as its personal emblem (star for NOVABLAZE, crescent for AOGIRI).
- **Lithograph surfaces:** details are printed onto the metal (gauges, windows, faces, cartoon pilots in cockpits).
  Edges are folded tin with visible tabs.
- **Pressed-metal shape language:** boxy-with-rounded-corners, cylinders, domes; no thin spikes (you can't press them).
- **Heroes = tin, villains = sofubi vinyl:** hard shiny metal vs. squishy swirly vinyl with sprayed gradients; purification
  turns vinyl into painted tin.
- **Sparks, not lasers:** weapons are flint sparkers, cork guns, spring punches and bells. Energy FX are yellow-white sparks
  and little smoke puffs.
- **UI = vintage box art + enamel badges:** tin-box lids with embossed borders, "MADE IN TSUMIKI TOWN" labels, enamel pins.

**Palette**
| Role | Hex |
|---|---|
| Tin silver | `#C9CED6` |
| Litho red | `#D7263D` |
| Litho blue | `#1B64B5` |
| Mustard | `#F4B942` |
| Cream enamel | `#F6EBD2` |
| Mint teal | `#3DBFA5` |
| Sofubi purple (villain) | `#8E3FD1` |
| Sofubi acid green (villain) | `#9BE564` |
| Line brown | `#3A2418` |

**Why it's unique.** No modern toy-robot game uses the tin-toy lineage, even though it's *the* origin of Japanese
robot toys (the space-toy boom predates Gundam by 25 years). The wind-up key is a signature silhouette element and a
gameplay meter in one. Tin vs. vinyl gives heroes and villains visibly different *materials*, not only different colours.

**Three.js translation**
- Tin: `toonMaterial` with the `metal` finish plus a **matcap-style anisotropic band** and a litho `map` (canvas texture
  per toy). Keep 3-band cel steps so it stays anime.
- Sofubi: `pearl` finish with a vertex-colour "airbrush" gradient and a soft wide spec.
- The wind-up key is a separate mesh with `rotation.z` driven by boost (spring tension). It's a great, cheap readability cue.
- VFX: spark sprites (`starSprite`) plus cartoon smoke puffs, ringing-bell hit stars.

**Risks.** It may skew "grandpa's toys" to kids; keep colours saturated and the animation bouncy, and avoid rust and
patina on heroes. Mechs are less "cool" and more "cute", so we need strong super-moves (TRI-GIGANT as a giant tin robot
toy-box). Space-toy tropes skew Western retro, so keep the Japanese lettering and dagashi context.

**Style line**
> `Style: 1960s Japanese wind-up tin toy robots brought to life in a bright kids' anime — lithographed printed-metal bodies with printed rivets, dials and cartoon faces, folded tin tabs, a big wind-up key on every robot's back, villains made of glossy swirly soft-vinyl kaiju plastic, warm cream and primary colors, cel shading with brown ink lines, sparks and smoke puffs.`

**Key visual prompt (paste-ready)**
> Key visual for a kids' anime video game titled "GACHARGE!". On the wooden counter of an old Japanese candy shop, a palm-sized wind-up tin toy robot hero named NOVABLAZE strikes a heroic pose: a lithographed red-and-cream metal body with printed rivets, a printed dial gauge on its chest, a gold star-shaped wind-up key spinning on its back and throwing yellow sparks, glowing cyan eyes, a long yellow cloth scarf, a stubby spark-gun arm. Facing it across the counter: a glossy purple-and-acid-green soft-vinyl kaiju toy covered in creeping purple rust, roaring. Behind NOVABLAZE, an 11-year-old boy with spiky black hair, orange goggles and a red bomber jacket with a star patch leans in, much larger than the toys, pumping his fist; behind him a towering retro capsule machine and jars of candy. Warm afternoon light, cel shading with warm brown ink lines, lithographed printed textures on the tin, spark bursts and cartoon smoke puffs. At the top, a "GACHARGE!" logo designed like an embossed vintage tin-toy box lid in red, cream and gold, with small katakana "ガチャージ" underneath (render the logo and text exactly). Bright, nostalgic but energetic, 16:9.

---

## Identity 4 — **RUNNER KIT** (ランナーキット)
*Model-kit sprues, numbered parts, instruction-manual graphics.*

**Pitch.** Every Kachibot arrives in its capsule **as a plastic runner** (sprue): flat parts on a frame, like a
cheap candy-toy kit. The Kira Spark snaps them together mid-air. The runner frame never goes away. It becomes the toy's
**weapon** (a sprue sword, a lattice shield, a runner-frame bow), and the leftover gate nubs are visible on every part
as a signature. The graphic language is the **assembly instruction sheet**: clean line drawings, numbered callouts (A3,
B7), exploded views, arrows with "click!" bubbles, flat pantone kit colours. Damage **pops parts off** back to their
numbered shapes, and Twin-Twist and TRI-GIGANT look like real parts-swap diagrams. It turns the combine fantasy into
something a kid can read in one glance.

**Design rules**
- **Every toy is made of ≤ 12 flat-ish parts with visible part numbers** stamped on the inside faces and gate nubs on the
  edges.
- **Runner weapons:** weapons use the sprue lattice language (rectangular frame plus round gates). Each toy's signature
  weapon is its own runner.
- **One runner colour per toy plus stickers:** like real candy kits, a toy is 1–2 plastic colours, with detail added by a
  sticker sheet.
- **Exploded-view combines:** every Twin-Twist and TRI-GIGANT has a diagram (dashed lines, arrows, "カチッ!").
- **Damage states are part loss:** armour pieces pop off with their number showing, and the toy fights on as a lighter frame.
- **UI = instruction manual:** white paper, black hairline drawings, numbered step boxes, warning triangles (⚠ 3才未満),
  a colour-guide swatch table for squad colours.
- **Roguelite rewards = spare parts bags** (Pull = a sealed polybag of parts).

**Palette**
| Role | Hex |
|---|---|
| Manual white | `#FAFAF7` |
| Manual black | `#111111` |
| Kit red | `#E53935` |
| Kit blue | `#1E63D6` |
| Kit yellow | `#FFC400` |
| Kit grey (frame / Rustling) | `#9AA3AD` |
| Callout cyan | `#00B8D9` |
| Rust purple | `#7A2E8E` |

**Why it's unique.** Gunpla culture exists, but no game uses the *runner and manual* itself as its visual system, and here
it's the cheap candy-toy version, not the premium model kit. It makes customisation, fusion and damage legible and fun, and
it gives a whole UI language that isn't Persona slants. Grey Rustlings can literally be unpainted grey runner parts.

**Three.js translation**
- The procedural builder in `mech/builder.ts` already assembles parts, so animate the **assembly** (parts fly from a
  flat runner layout to their sockets) on summon. It costs almost nothing.
- Gate nubs: tiny cylinders auto-placed on part edges by the builder. Part numbers go in a decal atlas.
- Runner weapons: `extrude()` a frame outline plus `cyl()` gates.
- Part-loss damage: detach meshes into a physics-lite tumble (reuse `vfx.ts` debris), and show a floating number tag.
- Manual UI in HTML/CSS: hairline SVG, very light to render.

**Risks.** It can feel cold or technical; counter this with sticker faces, bright kit colours and warm arenas. The
"model-kit" read may pull toward Gunpla, which is the very thing we want to escape, so keep the parts *chunky, candy-toy
cheap* (like 1980s mini-kits) and never plausible military engineering.

**Style line**
> `Style: cheap Japanese candy-toy model kit look — robots made of chunky flat snap-together plastic parts in 1–2 bright colors each, visible sprue gate nubs and stamped part numbers, weapons made from plastic runner frames, sticker-sheet details, clean anime cel shading with black ink lines, graphic overlays like an assembly instruction sheet (numbered callouts, exploded-view arrows, "click!" bubbles) on white paper.`

**Key visual prompt (paste-ready)**
> Key visual for a kids' anime video game titled "GACHARGE!", designed like a vibrant candy-toy assembly instruction sheet come to life. Center: a palm-sized toy robot hero named NOVABLAZE snapping itself together mid-air out of a flat red plastic runner frame — chunky red, white and yellow snap-fit parts flying into place with small stamped part numbers (A1, A2, B4) and little sprue nubs visible, glowing cyan eyes, a gold star crest, a yellow sticker-printed scarf; it grips a sword made from a leftover plastic runner frame. Dashed exploded-view lines and arrows connect the parts, with "カチッ!" click bubbles. An open capsule and a torn polybag lie on a giant white instruction sheet on a kid's desk. Behind, an 11-year-old boy with spiky black hair, orange goggles and a red bomber jacket with a star patch leans over the desk grinning, much larger than the toy. Bright flat kit colors, clean anime cel shading with black ink lines, white paper background with numbered step boxes and a small color-guide swatch table in the corner. At the top, a bold "GACHARGE!" logo built like a plastic runner (letters attached to a frame by little gates), in red, with small katakana "ガチャージ" underneath (render the logo and text exactly). Fun, clever, 16:9.

---

## Identity 5 — **BLISTER BROADCAST** (ブリスター放送)
*80s–90s toy commercials and packaging, tokusatsu miniature-set battles.*

**Pitch.** The whole game is a 1989 Saturday-morning toy block: the show, the commercial, and the packaging in one.
Every Kachibot is presented on its **blister card** (painted box-art, starburst "NEW!", "Battery not required!", feature
callouts such as "SPRING PUNCH ACTION!"). The menu is the toy aisle. Battles are shot like **tokusatsu miniatures**:
low camera, practical pyrotechnic explosions, sparks off plastic, a slightly overcranked slow-mo on big hits, and
cheerful commercial-style freeze frames with a chrome logo slam. Super moves are "commercial breaks" with a
kid-announcer VO, and eyecatch cards bracket every battle. It channels Gridman's love of tokusatsu and toys, but it's
framed through *advertising*, which none of the others do.

**Design rules**
- **Every toy has its box-art:** a painted hyper-heroic version on its card vs. the chunky real toy in-game. The gap
  is the joke and the charm.
- **Feature callouts are toy features:** "LIGHT-UP EYES!", "SPRING-LOADED MISSILE!", "COMBINES WITH 2 OTHERS!" (sold
  separately). Each maps to a real move.
- **Battles = miniature set:** fixed low "suitmation" camera angles, practical-looking fire and dust, visible scale cues,
  mild film grain.
- **UI = packaging:** blister-card frames, price stickers, starbursts, chrome-and-grid 80s logo plates, VHS timestamp
  on replays.
- **Eyecatch rhythm:** "GACHARGE!" eyecatch cards before and after fights (with a spinning capsule).
- **Colour:** saturated primaries plus hot magenta and electric teal, deep blue grid backgrounds.

**Palette**
| Role | Hex |
|---|---|
| Grid blue | `#101E5A` |
| Laser magenta | `#FF2E88` |
| Electric teal | `#00E0D1` |
| Chrome highlight | `#E8EEF5` |
| Starburst yellow | `#FFE14D` |
| Package red | `#EE2A24` |
| Pyro orange | `#FF8A1F` |
| Rust purple | `#5E2A84` |

**Why it's unique.** It has a strong *voice*, and the tone is playful. The "box-art vs. real toy" gap and the commercial
framing are pure Gotcha Force spirit (the Borgs were products). The risk of looking like Gundam drops because the reference
point is toy advertising and not anime.

**Three.js translation**
- Tokusatsu camera: low FOV, low height, slight handheld shake, **tilt-shift DOF** (the `battle-C` finding) as a
  post pass, overcrank = timeScale 0.4 on KO hits.
- Pyro FX: sprite-sheet fire and dust clouds that are *not* anime lines. It's the biggest asset cost of the six.
- Blister-card UI is 2D (HTML/CSS). Box-art is 2D illustration per toy (content cost).
- Replay filter: scanlines and a chroma-bleed shader, optional.

**Risks.** Box-art per toy is a big 2D illustration workload. Satire of advertising must stay loving, not cynical.
Retro-80s neon grid is a common aesthetic ("synthwave"), so keep it toy-aisle and Japanese, not outrun. Gemini text
rendering will struggle with dense package callouts.

**Style line**
> `Style: late-1980s Japanese toy commercial and toy packaging — painted heroic box-art, blister-card frames with starbursts and feature callouts, chrome logo with grid background, battles shot like a tokusatsu miniature set with low camera, practical pyrotechnic explosions and slight film grain, saturated primaries with hot magenta and electric teal, anime cel-shaded toys.`

**Key visual prompt (paste-ready)**
> Key visual for a kids' video game titled "GACHARGE!", designed as a late-1980s Japanese toy package and TV commercial. The whole image is framed like a giant blister card: a deep-blue grid background with a clear plastic blister bubble. Inside the bubble, a chunky palm-sized red-and-white toy robot hero named NOVABLAZE with a gold star crest, glowing cyan eyes and a yellow scarf strikes a pose; behind the bubble, a painted over-the-top heroic box-art version of the same robot blasts through an exploding miniature city made of toy blocks and cereal boxes, with practical pyrotechnic fire and sparks. Starburst stickers read "NEW!" and "KIRA SPARK ACTION!", and a small price sticker reads "100円". In the lower corner, an 11-year-old boy with spiky black hair, orange goggles and a red bomber jacket with a star patch points at the viewer like a kid in a TV commercial, grinning. Saturated red, hot magenta, electric teal and yellow, chrome highlights, anime cel-shaded characters, slight VHS film grain. At the top, a chrome-and-red 80s toy-logo "GACHARGE!" with a lightning streak, and small katakana "ガチャージ" underneath (render the logo and text exactly). Loud, fun, 16:9.

---

## Identity 6 — **SUPERFLAT SCRIBBLE** (スーパーフラット・ラクガキ)
*Murakami superflat plus Kenny Scharf cartoon-cosmic plus Jet Set Radio graffiti, drawn by a kid.*

**Pitch.** The Kira Spark is the kid's imagination, and it *draws on the world*. Toys are flat-coloured, thick-lined,
covered in faces, stars, and little eyeballs. Every surface hides a smiling character, like Scharf's cosmic cartoons
or Murakami's flowers. When toys battle, the space fills with **crayon and marker scribble FX** (hit sparks are drawn
stars, dash trails are marker streaks, shields are circled doodles). The Rust Legion is the opposite: grey, dripping, drawn in
smeared pencil, and purifying them *colours them in*. The UI is stickers slapped on a school notebook, with graffiti tags as
attack names. It's the most artful and "Splatoon-level ownable" direction, and the most distinct from mecha anime.

**Design rules**
- **Faces everywhere:** every toy has a secondary face (on the belly, shield, or fist), and props in arenas have faces
  that react to battles.
- **Flat colour and fat line:** variable-weight marker line (thick outer, thin inner), no cel shadow on toys, only one
  graphic highlight shape.
- **Imagination FX layer:** all VFX are hand-drawn doodle sprites (crayon, marker, felt-tip). Nothing glows realistically.
- **Colouring-in = purification:** Rust enemies are uncoloured pencil sketches with purple drips; defeat fills them with
  colour (a signature moment).
- **Pattern fills for rarity:** rares get superflat pattern fills (flowers, stars, polka dots, ice-cream swirls).
- **UI = notebook plus sticker bomb:** ruled paper, tape, graffiti tags, stickers overlapping.

**Palette**
| Role | Hex |
|---|---|
| Notebook white | `#FFFFFF` |
| Marker black | `#0D0D0D` |
| Hot pink | `#FF3EA5` |
| Sunflower | `#FFD000` |
| Sky marker | `#28B8FF` |
| Lime | `#8CE33B` |
| Tangerine | `#FF7A1A` |
| Pencil grey (Rust) | `#8C8C96` |
| Drip purple (Rust) | `#7B3FE4` |

**Why it's unique.** It is the furthest from mecha anime on this list, it's instantly recognisable in a single frame, and
the colouring-in purification is a story beat and a visual signature in one. It has Splatoon-style ownability.

**Three.js translation**
- Unlit/flat shading with one masked highlight; **variable-width outlines** via inverted hull thickness driven by vertex
  colour plus a screen-space Sobel pass for interior lines.
- Doodle VFX: billboard sprite sheets at 12 fps ("on twos") for a hand-drawn feel.
- Rust enemies: grey pencil hatch shader (screen-space hatching by luminance) with a **dissolve-to-colour** uniform
  on purification.
- Arena props with faces: simple decals plus eye blinks.

**Risks.** It's the furthest from Gotcha Force's "cool robot" appeal, and it can feel too young, too chaotic, or too
"art game". Readability can suffer in busy fights because everything has faces. Murakami and Scharf are strongly signature
artists, so we must borrow the *principle* (faces and pattern everywhere) and not their motifs (no Murakami flower, no Scharf
blobs as-is).

**Style line**
> `Style: superflat kids' cartoon drawn with thick variable-weight marker lines and flat bright colors (hot pink, sunflower yellow, sky blue, lime, tangerine) on white, no gradients, every object covered in little faces, stars and pattern fills, energy effects drawn as crayon and marker doodles, villains as grey pencil sketches with dripping purple, sticker-bombed notebook graphics.`

**Key visual prompt (paste-ready)**
> Key visual for a kids' video game titled "GACHARGE!", drawn in a superflat cartoon style with thick marker lines and flat bright colors. Center: a palm-sized toy robot hero named NOVABLAZE — chunky red and white, a round capsule-shaped chest with a smiling secondary face printed on it, a gold star crest, glowing cyan eyes, a long yellow scarf — leaping forward as crayon-drawn stars, marker streaks and doodled lightning explode out of its fist. The whole desk-top world around it is alive with little faces: smiling pencils, a grinning eraser, capsules with eyes rolling everywhere. On the right, grey pencil-sketch villain toys dripping purple rust are being colored in with bright color where NOVABLAZE's doodle energy touches them. Behind, an 11-year-old boy with spiky black hair, orange goggles and a red bomber jacket with a star patch cheers, drawn in the same flat marker style and much larger than the toys. Hot pink, sunflower yellow, sky blue, lime and tangerine on white notebook paper with tape and stickers at the edges. At the top, a graffiti-sticker style "GACHARGE!" logo with a thick black outline and a drop shadow, and small katakana "ガチャージ" underneath (render the logo and text exactly). Joyful, loud, 16:9.

---

## Comparison at a glance

| # | Identity | Ownability | Gotcha Force fit | Kid appeal | 3D cost | Gemini text risk |
|---|---|---|---|---|---|---|
| 1 | Dagashi Print | ★★★★★ | ★★★★ | ★★★★ | Low (shader) | Medium |
| 2 | Capsule Body | ★★★★ (design rule) | ★★★★★ | ★★★★★ | Low | Low |
| 3 | Tin-Spark Showa | ★★★★ | ★★★ | ★★★ | Medium | Low |
| 4 | Runner Kit | ★★★★ | ★★★★ | ★★★★ | Low | Medium |
| 5 | Blister Broadcast | ★★★★ | ★★★★ | ★★★★ | High (pyro, box-art) | High |
| 6 | Superflat Scribble | ★★★★★ | ★★ | ★★★★ | Medium | Medium |

---

## Recommendation: **"KORORIN CAPSULE"** = 2 + 1 + a dash of 4 and 3

Combine the identities by layer, so each one does the job it's best at:

| Layer | Source | What we take |
|---|---|---|
| **Toy anatomy** | 2 · Capsule Body | Every toy is built around its own two-tone capsule with a visible Kira Core. Summon = pop open; KO = snap shut and roll. |
| **Surface & rendering** | 1 · Dagashi Print | Spot-ink plastics, tampo/sticker details, sticker faces, halftone shadow band, coloured offset outline (not black). |
| **Weapons, damage, combines** | 4 · Runner Kit | Runner-frame signature weapons, gate nubs, part numbers; damage pops numbered parts off; Twin-Twist/TRI-GIGANT shown as exploded-view diagrams. |
| **Signature accessory** | 3 · Tin-Spark | The **Kira Key**: a wind-up key on every toy's back, shaped like its emblem, spinning with the boost gauge. |
| **UI** | 1 + 4 | Dagashi wrappers, prize tickets and price tags for the shop and meta; instruction-manual hairlines for squad/fusion screens. |
| **Camera/post** | 5 (lightly) + `battle-C` | Tilt-shift DOF and low toy-scale camera; eyecatch cards around battles. Skip box-art and pyro for cost. |
| **Villains** | 3 + 6 (idea only) | Rust Legion = sofubi-vinyl blobs crusted with purple rust and grey runner parts. Purification = the rust flakes off and ink colours print back on (a "reprint" sweep). |

Why: 2 answers "what makes our toys look different" (silhouette), 1 answers "what makes our frames look different"
(rendering + UI), and 4 and 3 give mechanics a visual language. All of it comes out of the fiction (dagashi shop,
capsules, cheap toys, kids), it's cheap to build on the existing `toon.ts` (halftone in shade band, offset hull,
decal atlas, clear finish), and it doesn't need content-heavy 2D box-art. Direction 6 is too far from the Gotcha
Force mold; 5 is great for trailers and marketing but not as the base style.

**NOVABLAZE redesign note.** His golden V-fin is the single biggest "generic Gundam" signal. Replace it with a
**Starcap crest**: a gold five-point star mounted on a capsule-lid ridge, with his head as a small clear dome over printed
sticker eyes. Keep red/cream, cyan eyes and the yellow scarf (now a printed flexible-vinyl strip with a halftone print). His chest
capsule is red-over-clear with a flame-orange Kira Core, and his signature weapon is the **Nova Runner**, a sprue-frame
blaster that snaps apart into a sword.

**Next step.** Regenerate 3 images in the combo before committing: (a) key art, (b) NOVABLAZE model sheet with
capsule anatomy + runner weapon + sticker sheet, (c) `battle` screenshot with the dagashi HUD. Use the combo style line:

> `Style: bright kids' anime about cheap Japanese capsule toys — every toy robot's body is built around its own two-tone gacha capsule (clear dome over a colored cup) with a glowing core visible inside, chunky candy-colored plastic in 3–4 flat spot colors with printed tampo details and sticker-decal faces, a wind-up key on each toy's back, weapons made from plastic runner frames, halftone dot shadows and slightly offset colored outlines like Showa-era candy-wrapper printing, UI styled like dagashi wrappers, prize tickets and toy instruction sheets, warm cream paper tones.`

**Combo key visual prompt (paste-ready)**
> Key visual for a kids' anime video game titled "GACHARGE!". On the wooden counter of a cozy Japanese dagashi candy shop, a palm-sized toy robot hero named NOVABLAZE bursts out of its capsule: its chest is a round two-tone gacha capsule (clear dome over a red cup) with a flame-orange glowing core floating inside, chunky red-and-cream plastic limbs clipped to the capsule rim, a small clear-dome head with printed sticker eyes glowing cyan, a gold five-point star crest, a yellow printed vinyl scarf, a gold star-shaped wind-up key spinning on its back, and a blaster made from a red plastic runner frame. Around it, three other capsule-bodied toy robots pop out of capsules (a turtle with a capsule shell, a ninja knight with a capsule-dome helmet, a little tank with a capsule turret). Behind, an 11-year-old boy with spiky black hair, orange goggles and a red bomber jacket with a star patch grins and twists the handle of a tall retro capsule machine; he is much larger than the toys. Jars of candy, a prize ticket saying "あたり!", 10-yen coins. Flat spot colors (tomato red, ramune blue, candy yellow, melon green) on warm cream, halftone dot shadows, slightly misregistered navy outlines like Showa candy-wrapper printing, serrated wrapper-strip borders at the edges. At the top, a bold hand-lettered candy-brand "GACHARGE!" logo in red with a navy offset shadow, the "A" shaped like a capsule, and small katakana "ガチャージ" underneath (render the logo and text exactly). Bright, joyful, unmistakably toy-like, 16:9.

---

## Kachibot Design DNA — 10 rules every toy must follow

1. **The Capsule Rule.** Every Kachibot is built around one visible two-tone capsule (clear top, coloured bottom) that
   forms its torso, head, shell, or core. Capsule size S/M/L maps to its point-cost tier.
2. **The Core Rule.** A glowing **Kira Core** is always visible through the clear half. Its colour is the toy's element.
   Hide it and the toy is "off".
3. **The Key Rule.** Every toy has a **Kira Key** on its back, shaped like its personal emblem (star, crescent, fang,
   gear...). It spins when the toy boosts.
4. **Cheap-Toy Honesty.** Max **4 plastic colours** plus stickers. Every part must look moldable in a 2-part mold: chunky,
   thick, rounded, no thin fins, no greebles, no realistic military detail. If it looks like it costs more than 300 yen, simplify.
5. **Print, don't sculpt.** Eyes, faces, vents, numbers and emblems are **tampo prints or sticker decals** on simple
   forms. Every toy has a sticker sheet with at least 3 swappable faces.
6. **The Runner Rule.** Every toy's signature weapon or accessory is made from its own **runner frame** (lattice plus gate nubs),
   and at least one gate nub stays visible on the body.
7. **One Toy Idea.** Each Kachibot is *a toy-thing + one twist* (a knight, a shark, a train, a kaiju, an alarm clock,
   a rice cooker...), readable as a silhouette at 64 px. No two toys share a head shape. Only NOVABLAZE may be a
   "classic hero robot".
8. **Stamped Identity.** Every toy carries a heel/base stamp `GC-###` and its kanji title (e.g. 忍者騎士・蒼霧) on the capsule
   seam. Collector lore lives on the toy itself.
9. **Visible Joints, Toy Poses.** Ball joints and peg holes are shown, and poses respect toy articulation (no rubber limbs).
   Animation is snappy with holds, like a kid moving a toy, and summon/KO always use the capsule open/snap-shut.
10. **Rarity is Material, not Shape.** Common = opaque, Rare = clear-tinted, Super Rare = glitter-fill, Kira Secret =
    glow-in-the-dark or chrome plating, Misprint = shifted inks. The same mold gets a new finish (maps directly to the
    existing `Finish` types in `src/engine/toon.ts`). Rust Legion toys follow the same rules, but are crusted in purple rust, sprouted grey
    runner scrap, and their Kira Core is cracked.
