# GACHARGE! — Gemini Round 2 (run order)

Round 1 was judged **too generic** (looked like SD Gundam fan art). Round 2 tests the more ownable
directions and a much bigger, weirder roster. All prompts already exist in the design docs; this file only
says **what to run, in what order, and where to save it**. Save everything to `docs/mockups/round2/`.

Global rules (repeat to Gemini if it drifts): original designs only — **no V-fins, no twin-eye faceplates,
no beam sabers**, nothing resembling Gundam / Transformers / Medabots / Digimon / Zoids. Toys are ~10 cm.

## Step 1 — Style test (8 images) → owner picks a direction

From [`ART_DIRECTION_V2.md`](ART_DIRECTION_V2.md): run the key-visual prompt of each of the six identities
and the combined **"KORORIN CAPSULE"** prompt from the *Recommendation* section.
Save as `style-1-dagashi.jpg`, `style-2-capsule-body.jpg`, `style-3-tin-spark.jpg`, `style-4-runner-kit.jpg`,
`style-5-blister.jpg`, `style-6-superflat.jpg`, `style-kororin.jpg`.
**Stop and let the owner pick.** From here on, replace the `Style:` line at the end of every prompt below
with the chosen direction's style line.

## Step 2 — NOVABLAZE (5 images)

From [`NOVABLAZE_CONCEPTS.md`](NOVABLAZE_CONCEPTS.md):
1. The *Lineup comparison prompt* (8 concepts on one sheet) → `nova-lineup.jpg`.
2. Individual sheets for the top 4: **01 Kapsule Core**, **12 Bomber Nova**, **11 Daruma Hanabi**,
   **02 Starfall Five** → `nova-01-kapsule-core.jpg`, `nova-12-bomber.jpg`, `nova-11-daruma.jpg`,
   `nova-02-starfall.jpg`.
3. If the owner likes it: the hybrid (Kapsule Core body + Bomber Nova goggle head + spinning Starfall star coin
   in the chest) → `nova-hybrid.jpg`.

## Step 3 — Roster (up to 9 images)

- From [`ROSTER_HEROIC_FUN.md`](ROSTER_HEROIC_FUN.md): display cards **A–E** → `roster-card-A.jpg` … `roster-card-E.jpg`.
- From [`ROSTER_EDGY_VILLAINS.md`](ROSTER_EDGY_VILLAINS.md) §5: villain lineup → `villains.jpg`;
  Rust Legion lineup with purified insets → `rust-legion.jpg`; AOGIRI 3-concept sheet → `aogiri.jpg`;
  Dark Side Series card → `roster-card-dark.jpg`.

## Step 4 — Notes

Write `docs/mockups/round2/NOTES.md`: chosen style, favourite NOVABLAZE, top 10 toys, anything Gemini drew
that looks like an existing franchise (flag it), and ideas the images suggested. Then
`git pull --rebase`, commit, push.
