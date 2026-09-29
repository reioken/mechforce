# Modern Roguelite, Monster-Collector, Combining-Robot and Collection Design Patterns (for a Gotcha Force spiritual successor)

Scope: proven mechanics from 2015–2026 games (with classic precedents), what makes each one work, and how it could carry over to a roguelite team battler where you collect capsule-toy mechs, build squads, and fuse or combine them in 3D arenas. Everything under "Cited Findings" has a source. Everything under "Inferences" is my own design analysis or translation and is not a sourced fact. Community wikis (Fandom, wiki.gg, Akurasu) and fan sites are flagged where they are the only source.

---

## Q1. Roguelite structure: how Hades, Slay the Spire, Risk of Rain 2, Monster Train, Balatro, Dead Cells, Returnal, Vampire Survivors, Inscryption, Into the Breach, Loop Hero and Pokémon-like roguelites structure runs, and what makes them replayable

### Takeaway
Modern roguelites get their replayability from four layers stacked together:
1. **Readable branching.** Map icons and door symbols show the reward or risk before you commit.
2. **Frequent small drafts.** Most rewards are "pick 1 of 3, or skip."
3. **Explicit ways to combine or steer a build.** Examples: Duo Boons, evolutions and unions, duplicate fusion, and item printers.
4. **A layered mastery ladder plus meta-progression that makes losing productive.** Examples: Ascension, Heat, Covenant, Stakes and Boss Cells; Hades' reactive story; blueprints; a pilot who carries over between runs; eggs and candy in PokéRogue.

Budget-capped loadouts are already an established pattern (PokéRogue's 10-point starter budget, Hades II's Grasp). They map directly onto a cost-capped mech squad.

### Cited Findings

#### Run skeletons and branching maps
- **Slay the Spire (StS) map node types.** Each act's map uses 7 location types: Monster, Elite, Rest Site, Unknown, Treasure, Merchant and Boss — [Slay the Spire Wiki: Map Generation](https://slaythespire.wiki.gg/wiki/Map_Generation)
- **StS generation rules:**
  - The map is built on a 7×15 grid.
  - Elites do not spawn before floor 6.
  - Per the wiki, "Elite, Merchant and Rest Site cannot be consecutive."
  - No Rest Site on floor 14, but there is always a Rest Site right before the boss.
  - A Treasure room is guaranteed at the midpoint of Acts 1–3.
  - Early fights come from an "easy pool": the first 3 encounters in Act 1 and the first 2 in Acts 2–3.

  Sources: [Slay the Spire Wiki: Map Generation](https://slaythespire.wiki.gg/wiki/Map_Generation); [Steam guide: Map Generation in Slay the Spire](https://steamcommunity.com/sharedfiles/filedetails/?id=2830078257)
- **StS node trade-offs.**
  - Rest Sites offer a binary choice: heal 30% of max HP or upgrade one card.
  - Elites are high risk and high reward, with a guaranteed relic and more gold.
  - Unknown nodes can turn out to be an event, monster, merchant or treasure.

  Source: [Slay the Spire Wiki: Map Generation](https://slaythespire.wiki.gg/wiki/Map_Generation)
- **StS card rewards.** Each card reward lets you choose one of three cards or skip altogether. Rarity is rolled per card, and the odds depend on the encounter type (normal, elite or boss). Relics change the reward rules: Prayer Wheel adds a second card reward after normal fights, and N'loth's Gift triples the chance of rare cards — [Slay the Spire Wiki (Fandom): Card Rewards](https://slay-the-spire.fandom.com/wiki/Card_Rewards)
- **Hades door previews.** A symbol over every exit door previews the next chamber's reward: god boons by icon and colour, Centaur Heart (max HP), Daedalus Hammer (weapon upgrade) or Pom of Power (boon level-up). A skull marking flags a harder encounter. When there are several doors, the icons are what you choose between — [Game Rant: Hades Door Symbol Guide](https://gamerant.com/hades-door-symbol-guide/); [Inverse: Hades symbols guide](https://www.inverse.com/gaming/hades-symbol-meaning-guide-hera-dionysus-apollo-ares-aphrodite)
- **Dead Cells biome routing.** Biomes are arranged in levels, and you visit only one biome per level in a run. Each biome usually exits to 2–3 possible next zones, which sets the enemy types, loot quality and bosses you meet. At higher difficulty, Boss Cell doors open extra shops, treasure rooms or alternative paths — [Dead Cells Wiki (wiki.gg): Biomes](https://deadcells.wiki.gg/wiki/Biomes); [Dead Cells Wiki (Fandom): Biomes](https://deadcells.fandom.com/wiki/Biomes)
- **Balatro run structure.** A run is 8 Antes, each made of 3 Blinds (Small, Big, Boss). You can skip the Small or Big Blind to earn a Tag reward, but the Boss Blind is mandatory. The Ante 8 Boss at 100,000 chips is the standard win. Higher Stakes make the score curve steeper: faster at Green Stake and above, faster still at Purple and above — [Balatro Wiki: Blinds and Antes](https://balatrowiki.org/w/Blinds_and_Antes)
- **Monster Train battlefield.** The battlefield is a vertical train with 4 floors and a Pyre on the top floor. Enemies climb toward the Pyre, and you can only summon units on the first three floors — [Wikipedia: Monster Train](https://en.wikipedia.org/wiki/Monster_Train). Monster Train 2 released May 21, 2025 — [Wikipedia: Monster Train](https://en.wikipedia.org/wiki/Monster_Train)
- **Risk of Rain series: time as the enemy.** Difficulty rises with elapsed time, so players must choose between spending time building up and pushing through stages quickly before monsters get harder — [Wikipedia: Risk of Rain](https://en.wikipedia.org/wiki/Risk_of_Rain)
- **Vampire Survivors: a fixed run length.** When the stage timer runs out (30 minutes), all enemies are cleared and the Reaper spawns — [Wikipedia: Vampire Survivors](https://en.wikipedia.org/wiki/Vampire_Survivors)
- **Loop Hero: push-your-luck extraction.** Retreating while on the camp tile keeps 100% of collected resources. Retreating mid-loop keeps 60%. Dying keeps 30% — [PCGamesN: Loop Hero tips](https://www.pcgamesn.com/loop-hero/beginners-guide-tips-tricks); [Twinfinite: Loop Hero return to camp](https://twinfinite.net/guides/loop-hero-return-to-camp-how/)

#### Rewards, synergies and "combine" mechanics inside a run
- **Hades boon tiers and Duo Boons.** Boons come in Common, Rare, Epic and Heroic rarities.
  - Duo Boons combine two gods' powers. They only appear once you already hold specific prerequisite boons from both gods, and either god can offer one.
  - Taking a Duo Boon triggers dialogue between the two gods.
  - Legendary boons have longer prerequisite lists.
  - Keepsakes, a Well of Charon item and a Mirror talent can raise Duo odds.

  Sources: [Hades Wiki: Duo Boons](https://hades.fandom.com/wiki/Duo_Boons); [Hades Wiki: Boons](https://hades.fandom.com/wiki/Boons); [Hades Guides: Legendary & Duo Boons](https://hadesguides.com/hades/guides/legendary-duo-boons)
- **Vampire Survivors evolutions and unions.**
  - To evolve: max the base weapon (usually level 8), hold the required passive item, then open a boss chest after the 10-minute mark.
  - Unions merge two max-level weapons into one.
  - Only one evolution happens per chest.
  - Later and DLC evolutions also require the passive to be fully levelled.

  Sources: [Vampire Survivors Wiki: Evolution](https://vampire.survivors.wiki/w/Evolution); [Vampire Survivors Wiki (Fandom): Evolution](https://vampire-survivors.fandom.com/wiki/Evolution)
- **Inscryption's Mycologists fuse duplicates.**
  - Two copies of the same card merge into one. Attack and health add together, and all sigils (abilities) carry over. Example: a 3/2 Airborne Wolf plus a 4/2 Mighty Leap Wolf becomes a 7/4 Wolf with both sigils.
  - If you arrive with no duplicates, they give you a duplicate for next time.
  - In Act 3 they fuse any two cards, and beating them fuses your whole board into a "Mycobot."
  - Sacrifice Stones destroy one card to move its sigils onto another.

  Source: [Inscryption Wiki: The Mycologists](https://inscryption.fandom.com/wiki/The_Mycologists)
- **Risk of Rain 2 steering tools.**
  - A 3D Printer destroys one random item of the same rarity from your inventory and gives you a copy of the displayed item. It can be used indefinitely.
  - The Scrapper turns items into scrap that printers use first.
  - The difficulty meter was raised 10% on all difficulties when the Scrapper was added.
  - Most items stack linearly.

  Sources: [RoR2 Wiki: 3D Printers](https://riskofrain2.fandom.com/wiki/3D_Printers); [RoR2 Wiki (wiki.gg): Item Scrap](https://riskofrain2.wiki.gg/wiki/Item_Scrap); [RoR2 Wiki: Item Stacking](https://riskofrain2.fandom.com/wiki/Item_Stacking)
- **Balatro's jokers and balance philosophy (LocalThunk).**
  - Early versions had no Jokers, only card-level upgrades at a shop. Jokers were added as "passive" items.
  - "Every Joker has gone through some kind of balance change; sometimes effects are scrapped entirely, sometimes they're tweaked."
  - Balance is done by feel: "When you hang a picture, instead of making it perfectly level… it's better to just do it by feel."
  - He admits there is "possibly too much" randomness and frames good play as "mitigating risk and having a build that can't be easily countered while still being powerful enough to win."
  - The poker imagery is primarily an "onboarding tool," not the mechanical core.

  Source: [Rogueliker interview with LocalThunk](https://rogueliker.com/balatro-interview/)
- **Balatro's origins.** It was inspired by the Cantonese card game Big Two and by videos of Luck Be a Landlord — [TouchArcade interview](https://toucharcade.com/2024/03/18/balatro-interview-mobile-port-localthunk-dlc-plans-updates-new-jokers-demo-feedback/); [Game Informer interview](https://gameinformer.com/interview/2024/03/21/balatro-was-almost-called-joker-poker-and-other-details-from-its-creator)
- **Slay the Spire balance principles (GDC 2019, Anthony Giovannetti).** Key slides:
  - "Every card should have a place! (also avoid anything too warping)"
  - Being "Single Player + Rogue-like" is listed as a balance advantage.
  - The challenge: two developers balancing 3 characters, 250+ cards, 150+ items, 50+ combats and 50+ events.
  - "Data is evidence, but not a conclusion."

  Source: [GDC 2019 slides](https://media.gdcvault.com/gdc2019/presentations/Giovannetti_Anthony_SlayTheSpire.pdf). A talk summary adds that being single-player allows rare overpowered combos without hurting other players — [Class Central summary](https://www.classcentral.com/course/youtube-slay-the-spire-metrics-driven-design-and-balance-165888)
- **Duplicates merge into upgrades in auto-battlers.**
  - Teamfight Tactics: three copies of a 1-star unit become a 2-star, and three 2-stars (9 units) become a 3-star — [Wikipedia: Teamfight Tactics](https://en.wikipedia.org/wiki/Teamfight_Tactics)
  - Super Auto Pets: combining duplicate copies levels an animal up (better stats and ability), and levelling up also adds a higher-tier animal to the shop — [Wikipedia: Super Auto Pets](https://en.wikipedia.org/wiki/Super_Auto_Pets)

#### Difficulty ladders (mastery layers)
- **Slay the Spire Ascension.** A slide titled "Ascension: Player Skill Stratification" describes 20 Ascension levels, unlocked one after another, plus Custom and Daily modes — [GDC 2019 slides](https://media.gdcvault.com/gdc2019/presentations/Giovannetti_Anthony_SlayTheSpire.pdf)
- **Hades Pact of Punishment (Heat).** Players pick individual Conditions, each with multiple grades, and every grade adds Heat. The maximum is 63 Heat outside Hell Mode. Beating a boss at or above the target Heat drops Bounties (Diamonds, Ambrosia, Titan Blood), tracked separately per weapon. Guides note that bounties stop at around Heat 20 per weapon — [Hades Wiki: Pact of Punishment](https://hades.fandom.com/wiki/Pact_of_Punishment); [GameSkinny: Pact explained](https://www.gameskinny.com/tips/hades-pact-of-punishment-conditions-bounties-heat-explained/); [Hades Guides: Pact of Punishment](https://hadesguides.com/hades/guides/pact-of-punishment)
- **Monster Train Covenant.** 25 cumulative Covenant ranks. Some modifiers add extra copies of the primary and allied clans' starter cards to your deck. Winning at Covenant 25 unlocks the credits and Expert Challenges. Guides say the modifiers stack so that strategies viable at Covenant 10 can fail at 20 — [Monster Train Wiki: Covenant Ranks](https://monster-train.fandom.com/wiki/Covenant_Ranks); [Gunslinger's Revenge: Covenant guide](https://www.gunslingersrevenge.com/posts/reviews/monster-train-covenant-guide-2025.html)
- **Dead Cells Boss Stem Cells.** You earn a Boss Stem Cell by beating the Hand of the King and slot it in to go from 0BC up to 5BC. Higher levels cut and then remove healing fountains, limit flask charges and add the Malaise mechanic at 5BC, while raising loot quality and cell drops — [Dead Cells Wiki: Boss Stem Cell](https://deadcells.fandom.com/wiki/Boss_Stem_Cell); per-level details from a third-party guide: [LB Product: Dead Cells progression guide](https://game.lb-product.com/en/games/dead-cells/guides/dead-cells_progression-guide)

#### Meta-progression and "making death productive"
- **Hades: narrative that pays for dying.** Greg Kasavin: "It was an explicit goal of our early development, to take the pain out of dying and having to restart."
  - A conditional dialogue system "peeks at the moments players encounter mid run," for example meeting a character while Zagreus is below a health threshold, and plays one of several pre-written events. The team can weight events, but the order stays unpredictable.
  - Kasavin: "Reactivity has always been a goal of our narrative design, to have those moments where you feel the game is paying attention."

  Source: [Game Developer: How Supergiant weaves narrative rewards into Hades](https://www.gamedeveloper.com/design/how-supergiant-weaves-narrative-rewards-into-i-hades-i-cycle-of-perpetual-death)
- **Hades' premise came from the loop.** Per coverage of Kasavin's GDC Podcast interview, the team asked what situation would have a character die and return to the start again and again, and arrived at "what happens if you die in the Greek Underworld?" — [Game Developer: Roguelikes and narrative design with Greg Kasavin](https://www.gamedeveloper.com/design/roguelikes-and-narrative-design-with-i-hades-i-creative-director-greg-kasavin). I saw this in a search summary, not in a transcript.
- **Hades II Arcana: a budget-capped meta-loadout.**
  - 25 Arcana Cards. Only 9 are visible at first, and unlocking a card reveals its neighbours.
  - Each card costs 0–5 "Grasp." Grasp starts at 10 and can be raised with the Psyche resource (max 30 per wiki summaries).
  - The cards total about 56 Grasp, so you can never equip everything.
  - Guides report up to six saved presets.

  Sources: [Hades Wiki: Arcana Cards](https://hades.fandom.com/wiki/Arcana_Cards); [Frostilyte: Arcana & meta-progression](https://frostilyte.ca/2025/04/09/arcana-cards-meta-progression-in-hades-2-have-me-hooked/); [RogueRanker: Hades 2 Arcana](https://rogueranker.com/hades-2-arcana/)
- **Dead Cells Blueprints.** Blueprints found in runs are handed to the Collector at biome transitions and unlocked permanently by paying Cells. Once unlocked, the item joins the drop pool and shops — [Dead Cells Wiki: Blueprints](https://deadcells.fandom.com/wiki/Blueprints)
- **Into the Breach: one pilot carries over.** When a timeline fails (the power grid hits zero), you send one chosen pilot to a new, procedurally generated timeline with their XP and skills intact. Achievements earn coins that unlock new squads with different mech types — [PCGamesN: Into the Breach permadeath](https://www.pcgamesn.com/into-the-breach/permadeath); [Into the Breach Wiki: Pilots](https://intothebreach.fandom.com/wiki/Pilots)
- **PokéRogue (browser-based Pokémon roguelite).**
  - Each run starts at a Starter Select screen with a point budget, typically 10 in Classic mode.
  - Each species has a cost based on stat total and competitive usefulness.
  - Species-specific **Candies**, earned from battling, catching and hatching (shiny and boss Pokémon give more), lower a species' starter cost (for example Cyndaquil 3→2→1), unlock Passive abilities that stack with its normal ability, and buy species-specific eggs.

  Sources: [PokéRogue Wiki: Starters](https://wiki.pokerogue.net/starters:starters); [PokéRogue Wiki (fan): Candies](https://pokeroguewiki.com/candies/); [Shapes: PokéRogue Starters & Eggs](https://shapes.inc/fandom/pok-rogue/starters-and-eggs). The official wiki returned 403 to my fetch, so these details come from search summaries and fan wikis.
- **Slay the Spire 2 (Early Access March 5, 2026).** Mega Crit says it launched with "more content than Slay the Spire 1," up to 4-player co-op, and "multiplayer-specific cards, powerful team synergies." More content will be added during Early Access, with no timeline given — [Mega Crit: StS2 EA launch](https://www.megacrit.com/news/2026-03-05-early-access-launch/). Third-party coverage lists the five launch characters (Ironclad, Silent, Defect, Necrobinder, Regent) and co-op route sketching on the map — [Outlook Respawn](https://respawn.outlookindia.com/gaming/gaming-news/slay-the-spire-2-release-date-confirmed-early-access-in-march)

#### Team-battler roguelites closest to the concept
- **Dicefolk (2024), a creature-collecting tactical roguelite.** Up to three chimeras per side, but only the "lead" can attack directly. Rotating the team is itself a tactical mechanic, and some creatures have abilities that trigger on rotation — [Nintendo Life review](https://www.nintendolife.com/reviews/switch-eshop/dicefolk); [GodisaGeek review](https://godisageek.com/reviews/dicefolk-review/)
- **Monster Train and Into the Breach** (above): squad or deck defence with clan pairs, and mech squads with pilot carryover.

#### Development-process lessons from postmortems
- **Slay the Spire.** Tools included an internal playtester Slack, a "Feedbackbot," invited top Netrunner players, near-daily builds and an in-house metrics server. In Early Access they added weekly updates, Discord (18,168 pieces of feedback via Feedbackbot) and a beta branch. At GDC 2019 the game had sold over 1.5 million copies after 2.5 years of development including 1 year of Early Access. The talk's takeaways: iterate, don't be afraid to change things, lower the barrier to playtesters, update more often — [GDC 2019 slides](https://media.gdcvault.com/gdc2019/presentations/Giovannetti_Anthony_SlayTheSpire.pdf)
- **Monster Train (GDC 2021 postmortem).** An in-game feedback tool captured a screenshot, log file and save game. Feedback was sorted by frequency every few days. The team ran private and public betas and aimed to "embrace emergent fun," doubling down on what worked and dropping what didn't — [GDC 2021 Monster Train Postmortem slides](https://media.gdcvault.com/GDC+2021/GDC21+-+Monster+Train+Postmortem.pdf)

### Inferences
- **What reliably makes runs feel different.** Across these games:
  - Varied starting combinations: StS characters, Monster Train primary × allied clan, Balatro decks and stakes.
  - Decisions with visible stakes: map icons, door symbols.
  - Build-defining rewards offered in small, frequent drafts (1 of 3, with skip).
  - Recipes that let players aim at a specific goal (Duo Boons, evolutions, duplicate fusion, printers).
  - A difficulty ladder that re-tests the same content under new rules.

  Content volume alone isn't the driver. StS balanced 250+ cards with the principle that "every card should have a place."
- **A possible run skeleton for a toy-mech battler.**
  - 3 "shelves" (acts), such as Bedroom, Backyard and Toy Shop. Each is a StS-style branching map with about 12–16 nodes and icons shown in advance.
  - Node types: Arena Battle; Elite (a rival collector with a guaranteed rare capsule or relic); Workshop (the StS rest-site dilemma: repair the squad or upgrade one mech); Capsule Machine (shop or gacha with a visible lineup); Event (unknown); Fusion Lab (Mycologists-style merging); and a Boss diorama arena.
  - Reveal each shelf's boss at the start so players draft counters, as StS does by showing the boss icon at the top of the map.
- **Rewards after each battle.** Offer "pick 1 of 3 capsules, or skip for scrap," and make scrap useful at a RoR2-style "Capsule Swapper" printer that trades a random same-rarity mech or part for the one on display. Skipping then becomes a steering tool instead of a loss.
- **Combination as build-crafting.** Use the Duo Boon model: combo parts and "link" abilities only appear once the squad holds both prerequisites, such as two halves of a combiner. Use the Vampire Survivors model for weapon evolution: a max-level weapon part plus a specific catalyst part becomes an evolved weapon at a boss chest. This makes fusion and gattai moments discoverable and earned, and it gives players a named goal to route toward.
- **Squad budget.** PokéRogue's 10-point starter budget and Hades II's Grasp budget are modern proof that a cost-capped loadout reads well and creates interesting trade-offs. If the successor keeps a cost-capped team-building system like the original's, PokéRogue's candy pattern (duplicates lower a mech's cost across runs) gives old duplicates a permanent use.
- **Difficulty.** Offer both a curated sequential ladder (StS Ascension 1–20, Monster Train Covenant 1–25) and a Hades-style à-la-carte menu of "Tournament Rules" modifiers with per-mech bounties. The menu rewards mastering many mechs rather than one favourite, just as Hades bounties are tracked per weapon.
- **Meta-progression should mostly add variety, not raw power.** Dead Cells blueprints add items to the pool, Hades adds story, and Into the Breach adds squads. Candidates here: new capsule series added to pools, new commanders or kids, new arenas and story scenes. Into the Breach's pilot carryover suggests letting one "favourite toy" keep its XP into the next run.
- **Bounded run length.** Vampire Survivors (30:00 timer) and Balatro (8 antes) show that an explicit, known run length is a design tool. A Loop Hero-style "cash out at checkpoint" option could let short sessions still bank progress.

### Gaps
- I didn't find authoritative figures for average run length in minutes (Hades, StS, Balatro, Monster Train). Community estimates exist, but I didn't verify them.
- The Monster Train postmortem PDF is almost entirely about process. I found no primary source detailing its clan, champion and path design. The Monster Train Fandom wiki returned HTTP 402.
- I didn't get Hades dialogue line counts or detailed Mirror of Night and keepsake numbers from a primary source.
- Returnal's run structure (biomes, parasites, malignant items) wasn't researched beyond its suspend-save feature (see Q5).
- The PokéRogue official wiki blocked fetching (403). Its details come from fan sites and may be out of date.
- I found no numbers on StS2's run-structure changes (new node types and so on). Mega Crit's launch post gives no counts, and card and relic counts appear only on low-authority third-party sites, so I left them out.

---

## Q2. Monster collectors and team building: Pokémon, Digimon (DNA/Jogress), SMT/Persona fusion, Cassette Beasts, Yu-Gi-Oh, Monster Rancher, Dragon Quest Monsters, Monster Hunter Stories. How fusion rules stay understandable yet deep, and how fusion results are visualised

### Takeaway
Fusion systems fall along a spectrum of legibility:
- **Named recipes** (Yu-Gi-Oh named materials, Vampire Survivors evolutions).
- **Category charts** (SMT race × race → race; Yu-Gi-Oh "1 named + 1 Machine").
- **Rank ladders** (Dragon Quest Monsters: combining a monster of a given rank lifts the result one rank).
- **Fully additive "any + any" fusion** (Cassette Beasts' 14,400 procedural fusions; Inscryption's summed stats and sigils).

Modern entries keep depth but cut frustration by:
- letting players choose inherited skills (SMT IV onward, Persona 5, DQM talents);
- previewing results before committing (DQM offspring preview, Monster Hunter Stories 2's post-channeling table);
- protecting favourites (Persona's Compendium re-summon);
- carrying investment forward (half of DQM talent points carry over; Digimon's ABI rises with every digivolve or de-digivolve).

Cassette Beasts shows procedural fusion visuals are feasible for a small team if every creature is also authored as a modular kit.

### Cited Findings

#### Cassette Beasts (2023): in-battle procedural fusion
- **Scale.** Any two of the 120 monster forms can fuse, giving 14,400 possible fusions, each with a fully animated sprite — [RPGamer review](https://rpgamer.com/review/cassette-beasts-review/); [Nintendo Life dev feature](https://www.nintendolife.com/features/cassette-beasts-dev-on-doing-what-pokemon-doesnt-in-a-zelda-inspired-overworld)
- **Why fusion (Jay Baylis, director, Bytten Studio).** "We needed to have a unique angle that no other game would have. Fusion is something we kept coming back to."
- **How the visuals work.** "Every monster is designed twice: once as a bespoke animated character, and a second time as a modular character sprite with separate parts." Fusions assemble heads, legs, arms and tails from the modular versions.
- **Production cost.** "There are hundreds and hundreds of these parts, and… it really could feel like an endless task."
- **Design constraint.** "Since monsters all need to have similar-shaped heads when fused, I'd find myself often leaning towards designing monsters with round heads."
- **Balance stance.** Fusions combine two elemental types and add stats together, so the team chose to "encourage players to seek builds that are 'unbalanced'… there is a lot of fun for players in discovering strategies that are unexpectedly overpowered."

  Source for the last five points: [Game Developer: Cassette Beasts turns monsters into mixtapes](https://www.gamedeveloper.com/design/cassette-beasts-is-a-fun-rpg-that-turns-monster-into-mixtapes)
- **Toy framing.** Coverage describes the system as every monster having "an action figure and a Lego version, where you can swap parts around." This line appeared in a search summary of the RPGamer, Nintendo Life and Pocket Tactics coverage, and I didn't confirm which page it comes from — [RPGamer review](https://rpgamer.com/review/cassette-beasts-review/); [Pocket Tactics interview](https://www.pockettactics.com/cassette-beasts/interview)
- **Studio.** Bytten Studio had two full-time staff (Jay Baylis, Tom Coxon), both formerly of Chucklefish — [Wikipedia: Cassette Beasts](https://en.wikipedia.org/wiki/Cassette_Beasts). There is also an official web "Fusion Demo" for trying fusions — [cassettebeasts.com/fusion](https://www.cassettebeasts.com/fusion/)
- **Fusion rules in battle.**
  - A fusion meter fills from damage taken (about 1/6 of the health % lost), from type-advantaged hits and crits (with upgrades) and from victories (with upgrades). At 95% it rounds up to 100%.
  - You can only fuse on your own turn, and only after reaching Relationship level 1 with your partner. Relationship level 2 unlocks the exclusive "Fusion Power" move (10 AP).
  - A fusion combines both monsters' stats and all of their moves and gets 4 AP per turn, but can still make only one move per turn.
  - Fusion is temporary and battle-only. You can unfuse from the turn after fusing, at no turn cost. On unfusing, both monsters keep the fusion's remaining health proportion.

  Source: [Cassette Beasts Wiki: Fusion](https://wiki.cassettebeasts.com/wiki/Fusion)

#### Shin Megami Tensei and Persona: chart-based fusion with skill inheritance
- **SMT fusion basics.** Two-demon fusion produces a demon whose race and level depend on the two inputs (the "fusion chart"). Three-demon ("triad") fusion determines the result differently, by the components' species rather than their races — [Megami Tensei Wiki: Fusion](https://megamitensei.fandom.com/wiki/Fusion); [Megami Tensei Wiki: Three-demon fusion](https://megamitensei.fandom.com/wiki/Three-demon_fusion)
- **Skill inheritance.**
  - Older titles randomised inheritance with hidden weights. SMT IV onward gives "full control" over what the result inherits, including overwriting its starting skills.
  - Skills are typed ("Thrust," "Claw," "Bite," "Weapon," "Mouth," "Wings," "Eye," "Talk," "Maiden"), and each demon can only inherit certain types.
  - Some skills are exclusive and can't be inherited.

  Source: [Megami Tensei Wiki: Skill Inheritance](https://megamitensei.fandom.com/wiki/Skill_Inheritance)
- **Persona 5.**
  - Players pick inherited skills manually; random inheritance was removed.
  - Personas can be registered to the Compendium, for example just before fusing, and re-summoned later for a fee. This keeps a snapshot of a strong persona.
  - A "Group Guillotine" handles fusions of more than two.

  Sources: [Player.One: P5 fusion system](https://www.player.one/persona-5-fusion-system-manual-skill-inheritance-torture-item-creation-coming-p5-551625); [SuperCheats: Persona 5 Fusion Basics](https://www.supercheats.com/persona-5/walkthrough/fusion-basics)

#### Digimon (Cyber Sleuth): branching digivolution, de-digivolution and DNA/Jogress
- **Requirements.** Digivolving needs some combination of level, stat thresholds, ABI and CAM (camaraderie). — [Magic Game World: Cyber Sleuth digivolution](https://www.magicgameworld.com/story-cyber-sleuth-complete-edition-digivolution-evolution/)
- **ABI.** ABI only rises through digivolving or de-digivolving (or rare Miracle Meat). The gain is larger when moving to higher-tier Digimon and at higher levels, and de-digivolving doubles the level-based part. So cycling a Digimon down and up the tree is the intended way to raise its ceiling. — [Steam discussion: ABI](https://steamcommunity.com/app/1042550/discussions/0/3106892150606878600/)
- **DNA digivolution.** It fuses two Digimon into one, usually higher-level. Only one partner needs to meet the requirements, except the 100% CAM requirement, which both must meet — [GameFAQs board: DNA digivolutions](https://gamefaqs.gamespot.com/boards/177629-digimon-story-cyber-sleuth/73462498)
- Community sources only; I found no official documentation.

#### Dragon Quest Monsters: The Dark Prince (2023): synthesis with rank ladders and talent inheritance
- **Previewing and climbing ranks.** You pick two monsters (level 10+) and see their possible offspring before committing. Certain pairings always produce a monster one rank higher, so climbing ranks is easy to plan. Some S- and X-rank monsters require four-monster synthesis — [Game8: DQM synthesis guide](https://game8.co/games/DQM-Dark-Prince/archives/435994); [Game Rant: DQM synthesis guide](https://gamerant.com/dragon-quest-monsters-dqm-the-dark-prince-how-to-fuse-monsters-complete-synthesis-guide/)
- **Talents and points carried forward.**
  - The child inherits three Talents chosen by the player from the parents.
  - It gets half of the Talent Points invested in the parents' Talents plus half of their combined unspent points.
  - A mastered numbered Talent (e.g., "Frizz & Zap II") upgrades a tier in the child. Maxed or combined talents can evolve into special talents.

  Sources: [Game8: Talent Points](https://game8.co/games/DQM-Dark-Prince/archives/436710); [Dragon Quest Wiki: Monster synthesis](https://dragon-quest.org/wiki/Monster_synthesis)

#### Monster Rancher (classic precedent): combining in the Lab
- **Seed parent and inheritance.** Combining needs two frozen monsters and 500G. The first monster chosen is the "seed" and drives both the result and what it inherits. When the main breed is unchanged, techniques carry over at about a 2/3 truncated rate. Special techs are never inherited — [Legend Cup: MR2 combining guide](https://legendcup.com/faqmr2combining.php)
- **Items that nudge results.** Items used during combining (Monster Rancher 4's combine materials, CD fragments) bias the probabilities and add stats or traits — [GameFAQs: MR4 Combine Materials & Mystery Disks](https://gamefaqs.gamespot.com/ps2/914760-monster-rancher-4/faqs/77769/combine-materials-and-mystery-disks)

#### Yu-Gi-Oh!: explicit-materials fusion
- **Materials printed on the card.** A Fusion Summon needs a card effect (typically "Polymerization") that combines the monsters listed on the first line of the Fusion Monster's text.
  - Materials can be specifically named or generic by type. "Five-Headed Dragon" needs 5 Dragon-Type monsters; "Chimeratech Overdragon" needs "Cyber Dragon" plus 1 or more Machine-Type monsters.
  - Most modern Fusion Monsters use one named monster plus generic material.
  - "Contact Fusion" skips Polymerization.

  Sources: [Yugipedia: Fusion Monster](https://yugipedia.com/wiki/Fusion_Monster); [Yu-Gi-Oh! Wiki: Fusion Material](https://yugioh.fandom.com/wiki/Fusion_Material); [Yugipedia: Fusion Summon](https://yugipedia.com/wiki/Fusion_Summon)

#### Monster Hunter Stories 2: a visual inheritance grid
- **Rite of Channeling and gene bingo.**
  - The Rite sacrifices one Monstie to move a gene into another Monstie's 3×3 gene grid.
  - Three matching genes in a row (horizontal, vertical or diagonal) earn a "Bingo Bonus."
  - A "Post-Channeling" table previews the resulting bingo bonuses before you commit.
  - Rainbow "Free Bingo Genes" match any type.

  Sources: [Capcom official MHST2 manual: The Rite of Channeling](https://game.capcom.com/manual/MHST2/en/switch/page/9/3); [Shacknews: changing Monstie genes](https://www.shacknews.com/article/125518/how-to-change-monstie-genes-monster-hunter-stories-2-wings-of-ruin)

#### Duplicates as upgrades inside team battlers (cross-reference)
- **TFT / Super Auto Pets.** Three copies merge into a higher star level. In Super Auto Pets, levelling up also adds a higher-tier unit to the shop — [Wikipedia: Teamfight Tactics](https://en.wikipedia.org/wiki/Teamfight_Tactics); [Wikipedia: Super Auto Pets](https://en.wikipedia.org/wiki/Super_Auto_Pets)
- **Inscryption Mycologists.** Stats and sigils of duplicates are summed — [Inscryption Wiki](https://inscryption.fandom.com/wiki/The_Mycologists)

### Inferences
- **The legibility ladder applied to capsule mechs.** A hybrid is likely best:
  - **Chart rule for the result class** (SMT style): Frame Class × Frame Class → class. For example Striker × Tank → Guardian. This keeps hundreds of combinations predictable.
  - **Rank rule for the result tier** (DQM style): fusing a tier-N mech with another tier-N mech gives tier N+1, so upward progress is guaranteed.
  - **A few named "secret recipes"** (Yu-Gi-Oh / Vampire Survivors style) for legendary mechs that fans can hunt down and share.
  - **Additive, Mycologists-style fusion for duplicates**: two copies of the same mech merge with summed stats and combined abilities. Duplicates are then never dead weight.
- **Cut fusion regret with the modern trio.**
  1. Preview the outcome before committing: DQM's offspring preview, MHST2's post-channeling table.
  2. Let the player choose inherited skills or parts, with type restrictions like SMT's tagged skills. A "Drill" skill might only pass to mechs with a drill-compatible arm socket.
  3. Keep a Persona-style Compendium, or "Capsule Album," so a favourite mech can be re-bought or re-summoned after being used as a fusion ingredient.
- **Reward cycling instead of punishing it.** Digimon's ABI (grows every time you digivolve or de-digivolve) and DQM's half-carry of talent points both make repeated fusion a way to raise a mech's ceiling. A "Tune" stat that rises with each fusion generation fits a toy-modding fantasy.
- **Two layers of fusion suit a roguelite arena battler:**
  - **Temporary, in-battle fusion** (Cassette Beasts): a meter fills from damage taken and advantageous hits, and a bond or relationship level gates access. The fused form gets both movesets, but its action economy is limited (one action at a time), and splitting apart shares out the remaining health proportionally.
  - **Permanent Fusion Lab nodes between battles** (SMT / DQM / Mycologists).
- **Visuals.** Cassette Beasts' "author every creature twice" approach becomes much cheaper in 3D if every capsule mech is built on a standard socket skeleton (head, torso, two arms, legs, backpack) with a shared scale and a few fixed attachment standards. The "round heads" lesson is that standardised interfaces constrain individual designs. Plan for that constraint from day one, just as capsule toys and Custom Robo standardise parts (see Q3). Fusions can take palette, parts and silhouette from each parent, with a visible "A + B" name formula and type or element icons so the result is readable at a glance.
- **Balance stance.** StS ("single player + rogue-like" as an advantage) and Cassette Beasts ("encourage… 'unbalanced' builds") both suggest that in a single-player roguelite, discovering a broken fusion is a feature, as long as difficulty ladders exist to challenge optimised players.

### Gaps
- **Mainline Pokémon team-building** (6-member party, type chart, evolution) wasn't researched with sources. I treated it as common knowledge and don't cite it here.
- **Digimon DNA digivolution** comes only from community forums. Digimon Story: Time Stranger (2025) wasn't researched.
- **Monster Rancher's CD/disc-based monster generation** (a key "found-object" procedural precedent) and how the Monster Rancher 1 & 2 DX remaster handles it weren't verified in this pass.
- **Cassette Beasts' fusion part-selection algorithm** (which parent supplies which part, how colours blend) isn't documented in what I found. The fusion wiki page doesn't describe the visual pipeline.
- **Yu-Gi-Oh Master Duel's presentation** of fusion (animations, UI) wasn't researched.

---

## Q3. Combining robots: how "gattai" moments are staged (Getter Robo, Voltron, GaoGaiGar, Transformers combiners, Megazord, Gundam docking) and how games turn combining into gameplay

### Takeaway
Classic combining robots mix four ideas:
1. A ritualised, repeatable sequence (bank or stock footage, authorisation beats, name-calls).
2. A diegetic excuse for why enemies can't interrupt (GaoGaiGar's electromagnetic tornado).
3. Rules about which pieces and orders produce which form (Getter Robo's order-dependent forms; Scramble City's interchangeable limbs).
4. Toy-first engineering: Combattler V's sequence was designed so the toy could reproduce it.

Games make combining playable through:
- resource, adjacency and morale gating plus animation toggles (Super Robot Wars);
- scale-appropriate level design for the combined form (Transformers: Fall of Cybertron);
- squad-size-as-weapon-size trade-offs (The Wonderful 101).

A cautionary pattern: combined-form segments that switch to a different mini-game genre (Voltron 2011, Rita's Rewind) got mixed or critical reviews.

### Cited Findings

#### Anime and toy precedents (staging and rules)
- **Getter Robo: order decides the form.** Three Getter Machines (Eagle/red, Jaguar/white, Bear/yellow) combine in different orders into three robots:
  - Getter-1 = Red+White+Yellow: the iconic all-rounder.
  - Getter-2 = White+Yellow+Red: large drill arm.
  - Getter-3 = Yellow+Red+White: extending arms and shoulder missiles.

  Source: [Getter Robo Wiki: Getter Robo (Mecha)](https://getterrobo.fandom.com/wiki/Getter_Robo_(Mecha))
- **Combattler V (1976): a toy-feasible combination.** Described as the first realistically-combining giant robot: five vehicles merging in a sequence designed to be reproducible as a toy. Popy made the toys, which were later released abroad in Mattel's Shogun Warriors and Bandai America's Godaikin lines — [Wikipedia: Chōdenji Robo Combattler V](https://en.wikipedia.org/wiki/Ch%C5%8Ddenji_Robo_Combattler_V)
- **Super Sentai and toy sales (fan analysis, opinion).** A fan analysis argues that multi-gattai (multi-robot combination) has been "perhaps the most powerful innovation" for selling more mecha toys, with carrier-mecha concepts revived in several Sentai series — [Akizuki Sentai blog](https://akizukisentai.blogspot.com/2016/07/innovations-for-super-sentai-are-mainly.html). It's a blog, not an industry source.
- **Bank scenes.**
  - Robot combination and sortie scenes are typical "bank" (stock) scenes, reused to control cel-animation costs.
  - GaoGaiGar disguised its reuse: three stock angles for one attack, combination scenes trimmed to slightly different lengths per episode, and each stock shot used at most once per episode.

  Sources: [NamuWiki: bank scene](https://en.namu.wiki/w/%EB%B1%85%ED%81%AC%EC%8B%A0); [TV Tropes: Transformation Sequence](https://tvtropes.org/pmwiki/pmwiki.php/Main/TransformationSequence)
- **GaoGaiGar's "Final Fusion" ritual.**
  1. The GGG chief declares "Final Fusion, approved!"
  2. The operator calls "Program drive!" and slams a red DANGER button behind safety glass.
  3. GaiGar spins and releases green foam that forms an electromagnetic tornado around it "to prevent any interference to the combination."

  Sources: [GaoGaiGar Wiki: Final Fusion](https://gaogaigar.fandom.com/wiki/Final_Fusion); [Brave Saga Wiki: Final Fusion](https://bravesaga.fandom.com/wiki/Final_Fusion)
- **Transformers "Scramble City" standard.** The team leader forms the torso, and four members form interchangeable limbs: any limb can be either arm or leg on either side, so teams can be mixed and matched. The Combiner Wars toyline (from late 2014) revived this with Deluxe figures that work as an arm or a leg — [TFWiki: Combiner Wars (toyline)](https://tfwiki.net/wiki/Combiner_Wars_(toyline)); [TFWiki: Combiner](https://tfwiki.net/wiki/Combiner)

#### How games turn combining into gameplay
- **Super Robot Wars (SRW) combination attacks.**
  - All participating units normally have to be adjacent (diagonals count).
  - Every participant pays its own ammo or EN cost and must meet any morale (Will) minimum.
  - Everyone must be on the same terrain.
  - In SRW X and SRW T, a combination attack can still be used with some partners undeployed, at a damage penalty.
  - A combination attack's power is set by the initiating unit, not by its partners. A Getter-1 with a 2,200-power Getter Beam always produces a 3,520-power "Double Getter Beam," however strong the partners' own Getter Beams are.

  Sources: [Akurasu Wiki: SRW 30 Combination Attacks](https://akurasu.net/wiki/Super_Robot_Wars/30/Combination_Attacks); [Akurasu Wiki: SRW X Combination Attacks](http://www.akurasu.net/wiki/Super_Robot_Wars/X/Combination_Attacks)
- **SRW squads and animation controls.**
  - In the Original Generations games, two adjacent units can form a squad that attacks together, unlocking a pilot-specific "Twin Command" — [Wikipedia: SRW Original Generations](https://en.wikipedia.org/wiki/Super_Robot_Wars:_Original_Generations)
  - SRW lets players speed up battle animations (A), skip them (B) or toggle them off (D-pad in SRW 30) — [Game Rant: SRW 30 tips](https://gamerant.com/super-robot-wars-30-tips/); [Steam: SRW 30 animations discussion](https://steamcommunity.com/app/898750/discussions/0/3825287408055122419/)
- **Transformers: Fall of Cybertron (2012): a playable gestalt.**
  - Bruticus is playable. Coverage notes no earlier Transformers game had let players control a gestalt, and High Moon had avoided combiners before.
  - Bruticus appears at the end of the Combaticons' chapter, where his strength is "needed to punch through the Autobot lines."
  - Those segments are built for his size, keeping the scale so he towers over enemies.

  Sources: [TFWiki: Bruticus (WFC)](https://tfwiki.net/wiki/Bruticus_(WFC)); [Kotaku: The Combaticons combine to form Bruticus](https://kotaku.com/the-combaticons-combine-to-form-bruticus-in-transformer-5848306)
- **Voltron: Defender of the Universe (2011, THQ / Behaviour).** Most of the game is a top-down twin-stick shooter as the individual lions. Players "occasionally flick the left stick" to combine, and boss levels require forming Voltron. Some reviewers criticised the Voltron segments while praising the lion segments — [Wikipedia: Voltron: Defender of the Universe (video game)](https://en.wikipedia.org/wiki/Voltron:_Defender_of_the_Universe_(video_game))
- **Mighty Morphin Power Rangers: Rita's Rewind (2024).**
  - Levels end in a first-person Megazord boss fight described as Punch-Out-like: dodge, then alternate punch buttons for combos.
  - Critics said getting hit knocks you back and forces a re-approach. In multiplayer, control of the Megazord switches players after each hit, which slows the pace.
  - Some reviewers still found the Megazord and Zord segments a highlight of the fan service.

  Sources: [TheGamer review](https://www.thegamer.com/mighty-morphin-power-rangers-ritas-rewind-review/); [TechRaptor review](https://techraptor.net/gaming/reviews/mighty-morphin-power-rangers-ritas-rewind-review-power-of-friendship); [Co-Optimus co-op review](https://www.co-optimus.com/review/2511/page/1/mighty-morphin-power-rangers-rita-s-rewind-co-op-review.html)
- **The Wonderful 101 (PlatinumGames, Hideki Kamiya): the crowd becomes the weapon.** Drawing shapes combines the hero crowd into "Unite Morphs": a circle for a hand, a line for a sword, an "L" for a gun, a squiggle for a whip. The bigger the drawing, the bigger the weapon, so crowd size matters. Kamiya cited a children's story about forest animals huddling into the shape of a giant monster — [Wikipedia: The Wonderful 101](https://en.wikipedia.org/wiki/The_Wonderful_101); [W101 Wiki: Unite Morphs](https://the-wonderful-101.fandom.com/wiki/Unite_Morphs); [Unseen64: W101 development](https://www.unseen64.net/2014/10/24/wiiu-the-wonderful-101-beta-development/)
- **Abstract "combine" mechanics** (see Q1): Hades Duo Boons (two gods' powers fused, prerequisite-gated, with paired dialogue), Vampire Survivors unions (two max weapons into one), Inscryption Mycobot (fuses the whole board).

#### Modular toy-robot precedents (a basis for combination)
- **Custom Robo (GameCube, 2004).** Robos are built from 5 part slots: body, gun (right hand), bomb (left hand), pod (backpack) and legs. The series has about 200 parts including about 30 robos. Fights take place in "Holosseum" arenas of varied sizes and layouts, some with hazards like ice or lava, and each robo starts with 1,000 HP — [Wikipedia: Custom Robo (2004)](https://en.wikipedia.org/wiki/Custom_Robo_Battle_Revolution); [GameFAQs: Custom Robo guide](https://gamefaqs.gamespot.com/gamecube/914967-custom-robo/faqs/38047)
- **Gundam Breaker 4 (2024).**
  - Every part is chosen individually for stats and abilities.
  - Paint goes down to individual pieces, with finishes, weathering, decals and cosmetic parts, and you can resize and reshape individual parts.
  - "Builder parts" add weapons and abilities.
  - A new Diorama mode stages up to about half a dozen Gunpla with backdrops, props and effects.
  - The publisher's advertorial claims "over a quintillion" possible builds (marketing).

  Sources: [Shacknews review](https://www.shacknews.com/article/141155/gundam-breaker-4-slug); [TechRaptor review](https://techraptor.net/gaming/reviews/gundam-breaker-4-review-build-fighters); [PC Gamer](https://www.pcgamer.com/games/action/gundam-breaker-4-is-the-ideal-mech-building-sandbox-for-mobile-suit-sickos/); [ANN advertorial](https://www.animenewsnetwork.com/advertorial/2024-08-28/how-to-create-over-a-quintillion-uniquely-customized-gunpla-in-gundam-breaker-4/.214879)

### Inferences
- **Three combination rule families a toy-mech game could support, each with an anime precedent:**
  1. **Order-dependent forms** (Getter). The same three capsule mechs make different combined robots depending on which one is the "lead." The lead supplies head and torso, and with them the moveset and role. Cheap to build and rich in discovery.
  2. **A port standard** (Scramble City / Combiner Wars). Any "Core" class mech plus any four "Limb-capable" mechs forms a gestalt. Each limb contributes its weapon or passive to that arm or leg. This fits a capsule-toy fantasy (standard plugs) and a fusion system built on sockets (see Q2).
  3. **Set bonuses** (Voltron, Combattler, Sentai). A specific themed set of 3–5 mechs, often from one capsule series, forms a signature super robot. This pairs naturally with gashapon-style themed series (Q4) and gives collectors a named goal.
- **Gating.** Borrow SRW's rules: combination requires proximity in the arena, a shared resource cost (each component contributes meter), and a morale or "Hype" threshold earned through fighting. That turns the combination into a timed decision rather than a button you press whenever it's available. Hades' prerequisite-gated Duo Boons show a way to let combination abilities show up in draft offers only once you hold the pieces.
- **Staging in real-time 3D.**
  - Build a GaoGaiGar-style ritual: authorisation, button slam, shield vortex, assembly, pose and name-call. The shield vortex is the diegetic reason the combining robot can't be hit, much like a fighting game's super-move freeze.
  - Make the first viewing long and cinematic. After that, offer SRW-style toggles (full, short, off) and hold-to-speed-up.
  - Keep repeat viewings fresh with GaoGaiGar's trick of varied camera angles and cut lengths.
  - Because the theme is toys, show visible ports, snapping and chunky hinges. Combattler V's toy-feasible design and Gundam Breaker's plastic-model fantasy suggest the combination should look physically plausible.
- **Keep the combined form in the same game.**
  - The Voltron 2011 and Rita's Rewind criticism points to a risk: turning the combined form into a separate mini-game (QTE or first-person boxing). Better: the gestalt plays with the same core controls but bigger verbs, slower and heavier, in arenas and encounters scaled for it (Fall of Cybertron's lesson).
  - Rita's Rewind's multiplayer handoff problem suggests that in co-op, each player should keep control of their own limb or weapon rather than passing control around.
- **Risk and reward of combining.** Combining should trade squad width for power, as in The Wonderful 101 where more members means a bigger weapon. While combined, the squad shares one health pool. When the gestalt is broken or the timer ends, components drop out with proportional health, as in Cassette Beasts' unfuse rule. That creates a comeback-or-collapse moment.
- **Toy-economics echo.** Real gattai sequences were engineered so toys could reproduce them. A game about capsule toys can flip this: design combinations that could exist as physical gashapon sets, which is also a merchandising hook.

### Gaps
- I didn't find a verifiable source on SRW's persistent "Combine/Separate" unit commands (e.g., forming GaoGaiGar or Combattler from separately deployed units on the map: requirements, HP/EN handling). The SRW Fandom gameplay page returned HTTP 402.
- Earlier Power Rangers games (e.g., SNES-era Megazord fights, Battle for the Grid's Megazord characters) and Gundam core-block docking in games weren't researched with sources.
- No source was found for Voltron's "Form Blazing Sword" finisher convention or stock-footage use in the 1984 show. It's plausible but uncited, so I left it out.
- I found no design postmortem where a developer explains their combining-mechanic design decisions in depth. The findings above are mostly descriptive coverage and reviews.

---

## Q4. Non-predatory gacha and collection satisfaction: gashapon culture, pity, duplicate handling, rarity tells, reveal animations, gacha without real money, collection albums, and making pulls exciting but fair

### Takeaway
The excitement of a pull comes from:
- the physical ritual (turning the handle, the capsule dropping);
- a staged "reveal before the reveal" (Genshin's shooting-star colour, TCG Pocket's immersive cards);
- a visible, finite lineup.

Fairness comes from:
- currency earned only through play;
- visible odds and pity counters;
- duplicate protection or guaranteed new items (Astro Bot, Marvel Snap Snap Packs, PokéRogue's new-species pity);
- player-controlled odds boosts (spend more coins for a higher chance of something new, as in Smash Melee and Kid Icarus);
- turning duplicates into useful progress (Genshin constellations and Starglitter, PokéRogue candy, TFT-style merges).

Collection completion is psychologically powerful (endowed progress, goal gradient). Japan's 2012 kompu gacha ban and loot-box research show why completion loops tied to paid randomness are the predatory line to avoid.

### Cited Findings

#### Gashapon culture (the source fantasy)
- **Origins and pricing.** Capsule machines came to Japan in 1965, imported from the US gumball-toy tradition, at ¥10 per play. Bandai entered in 1977 at ¥100 with its own characters. Today's range is about ¥300–¥500. The article cites about 600,000 machines nationwide and about 300 new products a month — [Nippon.com: Gacha-Gacha: A Half-Century of Mystery Goodies](https://www.nippon.com/en/japan-topics/g01212/)
- **Four popularity waves:**
  1. From 1977: Bandai character goods (Kinnikuman erasers sold 180 million).
  2. 1995: full-colour figure series such as Ultraman.
  3. 2012: Koppu no Fuchiko (20M+ sold) plus smartphone sharing.
  4. 2019–present: specialty shops, with about 60% female customers.

  Source: [Nippon.com](https://www.nippon.com/en/japan-topics/g01212/)
- **The appeal.** An expert quoted there: "For children, it became their first experience of 'gambling' with their own allowance… But there was never any guarantee that the toy you want, the 'jackpot,' would drop." — [Nippon.com](https://www.nippon.com/en/japan-topics/g01212/)
- **Bandai Namco's own framing.** "The joy of turning the handle of a machine and receiving a high-quality product after doing so remains universal." They report a push into "product development for the mature fan base" and 312 dedicated stores opened in under four years (101 GASHAPON Department Stores + 211 GBO shops, as of Mar 31, 2024) — [Bandai Namco Integrated Report 2024: GASHAPON](https://www.bandainamco.co.jp/en/ir/library/feature05_01_2024.html)
- **Market size (sources disagree).** Bandai Namco gives Japan's capsule-toy market as ¥65B in FY2023.3 (+44%) and ¥80B in FY2024.3 (+23%), "closing in on the ¥100 billion level" — [Bandai Namco IR](https://www.bandainamco.co.jp/en/ir/library/feature05_01_2024.html). Nippon.com gives an annual value of about ¥40B — [Nippon.com](https://www.nippon.com/en/japan-topics/g01212/). The two probably use different years or definitions, so treat both as approximate.
- **Name and scale.** "GASHAPON" comes from the sound of turning the handle ("gasha") and the capsule dropping ("pon"). Wikipedia reports 3.711 billion Bandai Gashapon units sold as of March 2021 — [Wikipedia: Gashapon](https://en.wikipedia.org/wiki/Gashapon). Guinness World Records certified Gashapon as the "Largest capsule toy brand" by global FY2024 revenue — [Guinness World Records (Aug 2025)](https://www.guinnessworldrecords.com/news/2025/8/japanese-capsule-toy-brand-gashapon-rules-world-as-largest-of-its-kind)

#### In-game gacha without real money (precedents)
- **Super Smash Bros. Melee Lottery.** You insert up to 20 coins per pull, and each coin raises the chance of a trophy you don't own by a flat 5%, up to 99.9%. That chance falls as your collection grows. You always get a trophy — [SmashWiki: Lottery](https://www.ssbwiki.com/Lottery)
- **Kid Icarus: Uprising Idol Toss.**
  - Eggs come from finishing chapters or cost one Play Coin each.
  - Egg colour adds to the new-idol chance: white is base, green +5%, blue +10%, red +20%.
  - The machine displays the exact percentage chance of a new idol. Placing multiple eggs raises it, and each idol collected lowers it by about 0.3%.

  Source: [Divinipedia: Idol Toss](https://kidicarus.fandom.com/wiki/Idol_Toss)
- **Kirby and the Forgotten Land (2022).**
  - Gotcha Machines in Waddle Dee Town dispense capsule figures for Star Coins, and more figure capsules are hidden in stages.
  - Figures show rarity stars on their stands.
  - If a machine's non-rare figures are all collected, a warning asks whether you still want to turn the crank.
  - Results are random, so there's no way to guarantee the last figure.

  Sources: [Kirby Wiki: Gotcha Capsule](https://kirby.fandom.com/wiki/Gotcha_Capsule); [Pocket Tactics: Forgotten Land capsules](https://www.pockettactics.com/kirby-and-the-forgotten-land/capsules). Bandai later made real gachapon figures based on the game — [Kirby Informer](https://www.kirbyinformer.com/post/bandai-kirby-and-the-forgotten-land-gachapon-figures)
- **Astro Bot (2024) Gatcha Lab.** Unlocks after 16 puzzle pieces. Each pull costs 100 earned coins, and guides say it gives no duplicates, though you can occasionally get an "Empty Can." Completing it takes at least 16,900 coins — [Game8: Astro Bot Gatcha Lab](https://game8.co/games/Astro-Bot/archives/473656); [Push Square: Gatcha Lab prizes](https://www.pushsquare.com/guides/astro-bot-gatcha-lab-all-prizes-and-how-to-unlock)
- **PokéRogue egg gacha (inside a roguelite, no real money).**
  - Three machines: "Move UP!" (better rare egg-move odds), "Legendary UP!" (a daily featured legendary at 1/128 instead of 1/256) and "Shiny UP!" (1/64 instead of 1/128).
  - Vouchers are earned in play: gym leaders, Elite Four, champions, Classic clears, daily runs and Endless milestones. Regular = 1 pull, Plus = 5, Premium = 10, Gold = 25 with a guaranteed Epic.
  - Eggs hatch after 10 / 25 / 50 / 100 waves (Common / Rare / Epic / Legendary), and hatch progress carries across runs.
  - Pity: a Rare egg after 9 eggs without one, an Epic after 59, a Legendary after 412. The 10th egg of a tier is forced to be an unowned species after 9 duplicates.
  - Hatches unlock future starters and egg moves.

  Source: [PlayPokeRogue: How egg gacha works](https://playpokerogue.com/guides/how-does-egg-gacha-work-in-pokerogue/). This is a fan site, so figures may change with updates. Egg tiers map to starter costs: 1–3 Common, 4–5 Rare, 6–7 Epic, 8–10 Legendary — [PokéRogue Wiki (fan): Eggs](https://pokeroguewiki.com/eggs/)
- **Animal Crossing: New Horizons.** A capsule-toy machine is a furniture item (added in the 2.0 update, 7 colour variants, bought for Bells or Poki). It nods to real gashapon rather than being a gacha system — [Nookipedia: Capsule-toy machine (NH)](https://nookipedia.com/wiki/Item:Capsule-toy_machine_(New_Horizons)). Pocket Camp also had a capsule-toy machine item — [Pocket Camp Wiki](https://animalcrossingpocketcamp.fandom.com/wiki/Capsule-Toy_Machine)

#### Monetised gacha patterns worth studying for "feel" and fairness
- **Genshin Impact pity.** Guaranteed 4★ within 10 pulls and 5★ at 90 pulls. Community-measured "soft pity" (sharply rising odds) starts around pull 74 on character and standard banners and around 63 on the weapon banner. "Pity" and "soft pity" are player terms established by testing, not official ones — [Game8: Genshin pity system](https://game8.co/games/Genshin-Impact/archives/305937); [Dexerto: What is pity in Genshin](https://www.dexerto.com/genshin-impact/what-is-pity-in-genshin-impact-how-to-guarantee-a-5-star-wish-1588745/); [Genshin Impact Wiki: Wish](https://genshin-impact.fandom.com/wiki/Wish). The last one is a search snippet only; the page returned HTTP 402 to my fetch.
- **Genshin reveal animation.** The colour of the shooting star in the wish animation signals whether a 4★ or 5★ is waiting before the item is shown. A 2025 academic analysis reports that 10 of 13 respondents showed a higher heart rate when they saw the gold star. That's a very small sample, so treat it as illustrative — [Asia-Pacific Journal of IT & Multimedia: Analyzing the Gacha System in Genshin Impact (PDF)](https://www.ukm.my/apjitm/public/assets/article/2025/1401/04.pdf). Other gacha games use similar pre-reveal indicators — [Samurai Gamers: Wuthering Waves rarity indicator](https://samurai-gamers.com/wuthering-waves/wuwa-wish-rarity-indicator-guide/); [inkl/PC Gamer: Honkai: Star Rail pull animations](https://www.inkl.com/news/honkai-star-rail-s-gacha-animations-have-no-right-to-go-this-hard)
- **Genshin "Capturing Radiance"** (introduced with version 5.0). It's designed to reduce runs of lost 50/50s on featured characters. Coverage describes it as boosting the featured 5★ rate after losses — [Sportskeeda: Capturing Radiance guide](https://sportskeeda.com/esports/genshin-impact-capturing-radiance-guide-boosted-5-star-drop-rate-characters-explained). Low-quality sites claim specific odds (an effective 55% featured rate, a guarantee after two losses) and misdate 5.0 to August 2025 — [BitTopup](https://news.bittopup.com/news/capturing-radiance-50-50-22.5-double-loss-explained). Unverified.
- **Genshin duplicates.** A duplicate character becomes a Constellation upgrade (Stella Fortuna) plus Masterless Starglitter or Stardust, with more Starglitter after the 7th copy. Paimon's Bargains sells rotating 4★ characters for 34 Starglitter and certain weapons for 24 — [Game Rant: Paimon's Bargains](https://gamerant.com/genshin-impact-paimon-bargain-shop-currency-starglitter-rotations-characters-weapons-items/); [GameWith: Dupes guide](https://gamewith.net/genshin-impact/article/show/24206)
- **Pokémon TCG Pocket (2024).**
  - One free pack every 12 hours via a visible "pack stamina" timer.
  - Pack Points from opening packs can be exchanged for chosen cards from that expansion (a "spark" system).
  - Wonder Pick lets you choose among five face-down, shuffled cards from another player's opened pack, using Wonder Stamina, with Wishlist flags.
  - Rarity symbols: 1–4 diamonds, 1–3 stars, crown. 3★ cards are animated "immersive cards."
  - There's also a $9.99/month premium pass.

  Source: [Pokemon.com: Collecting cards & Wonder Picks guide](https://www.pokemon.com/us/strategy/a-guide-to-collecting-cards-and-using-wonder-picks-in-pokemon-trading-card-game-pocket). Sources disagree on Pack Points per pack: 5 per pack per [Game8](https://game8.co/games/Pokemon-TCG-Pocket/archives/474486), 10 per pack per [MMO Culture](https://mmoculture.com/tips-guides/pokemon-tcg-pocket-pack-points-system/). This may reflect an update.
- **TCG Pocket results.** About $1.3B player spending in its first year (AppMagic estimate), 10M downloads in its first 48 hours, and official anniversary stats of 18B+ packs opened, 12B+ battles and 96M trades — [Nintendo Life](https://www.nintendolife.com/news/2025/11/pokemon-tcg-pocket-pulled-in-almost-usd1-3-billion-in-its-first-year-alone). A GoNintendo headline says "2 billion+ battles" — [GoNintendo](https://gonintendo.com/contents/54418-pokemon-tcg-pocket-reaches-1-3-billion-in-revenue-2-billion-battles-and-490-million) — which conflicts with Nintendo Life's 12B+.
- **Marvel Snap collection progression.**
  - Collection Level rises when you upgrade cards' cosmetic rarity with Credits and Boosters, so progression comes from improving cards you already own.
  - From Collection Level 1006, Collector's Reserves arrive every 12 levels.
  - "Snap Packs" guarantee "1 unowned card (no duplicates!)" plus two bonus rewards, priced in Collector's Tokens by card series (e.g., a Series 3 pack costs 650 tokens, a seasonal Series 5 pack 5,000).

  Source: [Marvel Snap Zone: Reserves, Caches and Snap Packs](https://marvelsnapzone.com/cache-drop-rates-and-contents/)
- **Marvel Snap's earlier Spotlight Caches.** Their mystery slot could roll duplicates, refunded as tokens. Second Dinner acknowledged "there's room for improvement," and Snap Packs reportedly replaced them in 2025 — [Marvel Snap Zone: Spotlight Caches analysis](https://marvelsnapzone.com/spotlight-caches-early-analysis-and-breakdown/); [Pocket Tactics: Spotlight Cache](https://www.pockettactics.com/marvel-snap/spotlight-cache)

#### The predatory line (regulation and research)
- **Japan's kompu gacha ban.** In May 2012, Japan's Consumer Affairs Agency declared "complete gacha" illegal under the Act against Unjustifiable Premiums and Misleading Representations. The practice was paying for random draws to complete a set that unlocked a prize. The concern was gambling-like mechanics reaching minors, with publicised cases of students spending thousands of dollars. Companies pledged removal by May 31, and the guidelines took effect July 1, 2012 — [Game Developer: Why kompu gacha was banned](https://www.gamedeveloper.com/business/why-quot-kompu-gacha-quot-was-banned); [Japan Times](https://www.japantimes.co.jp/life/2012/05/16/digital/japans-social-gaming-industry-hindered-by-governments-anti-gambling-move/); [Serkan Toto](https://www.serkantoto.com/2012/05/18/gacha-regulation-official/)
- **Loot boxes and problem gambling.** Zendle & Cairns (2018, PLOS ONE, n = 7,422) found a link between loot-box spending and problem-gambling severity. It was stronger than the link with other in-game purchases, but the direction of causality is unclear. A 2019 replication found the link again — [PLOS ONE (2018)](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0206767); [PLOS ONE replication (2019)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6405116/)

#### Collection psychology
- **Endowed progress effect.** Nunes & Drèze (2006) gave car-wash customers either an 8-stamp card or a 10-stamp card with 2 stamps pre-filled; the work required was identical. 34% of the pre-filled group completed it versus 19% — [ResearchGate: The Endowed Progress Effect](https://www.researchgate.net/publication/23547282_The_Endowed_Progress_Effect_How_Artificial_Advancement_Increases_Effort); summary via [Learning Loop](https://learningloop.io/plays/psychology/endowed-progress-effect)
- **Goal-gradient effect.** Kivetz, Urminsky & Zheng (2006) found in café loyalty-card data that effort speeds up as people near a goal, driven by the proportion of work remaining — [secondary summary: Yu-kai Chou](https://yukaichou.com/behavioral-analysis/goal-gradient-hypothesis-hull-kivetz-motivation-acceleration/)

### Inferences
- **A "fair capsule machine" spec from the precedents:**
  1. **Only earned currency**, never real money (Melee, Kid Icarus, Kirby, Astro Bot, PokéRogue).
  2. **A visible, finite lineup per machine or series**, like a real gashapon machine front: 5–8 mechs plus one "secret" silhouette.
  3. **The odds of getting something new are shown as a number**, and the player can raise them by feeding extra tokens (Melee's +5% per coin, Idol Toss's displayed percentage and colour-coded eggs).
  4. **Duplicate protection**: no duplicates until a series is complete (Astro Bot), or a warning before pulling from a completed series (Kirby), or a forced new item after N duplicates (PokéRogue's 10th-egg rule).
  5. **Visible pity counters and a spark**: exchange points to pick any item from the series (TCG Pocket Pack Points; Marvel Snap Snap Packs' guaranteed-unowned rule).
  6. **Duplicates always convert into progress**: star-ups (TFT merges), cost reduction or passive unlocks (PokéRogue candy), or a currency for a shop that sells specific items (Genshin Starglitter).
- **Rarity tells for a capsule-toy game.** Use Genshin's pre-reveal principle with capsule-native signals: capsule shell colour or pattern as the capsule drops; how much the machine rattles; a glint through a translucent shell; a distinctive "pon" sound for rares. Then the capsule twists open to show the toy on its stand with rarity stars (Kirby's stands). High rarities could get TCG Pocket-style "immersive" animated reveals.
  - Rarity must not depend on colour alone. Add shape, icon and sound cues (see Q5 accessibility).
  - Multi-pulls need a fast-forward or skip-to-summary option.
- **Put the gacha inside the roguelite loop.** Following PokéRogue, capsule tokens could drop from bosses and milestones, and "egg-like" capsules could need N arena wins to "unbox," with progress carried across runs. Unboxed mechs join the permanent roster, which then feeds the squad budget and run starts. This ties gacha excitement to play performance rather than purchases.
- **Albums and completion without compulsion.**
  - Use endowed progress: start each series album with 1–2 slots filled from the tutorial set.
  - Use the goal gradient: show the fraction complete per series, and let the final item be bought with spark points.
  - Avoid kompu-gacha-style "complete the random set to get the prize" pressure, even without real money. Make set bonuses and combiner sets reachable through deterministic paths (sparks, fusion recipes, story rewards) rather than pure random pulls, so completionists aren't forced into long grinds.
- **Scope note.** TCG Pocket's $1.3B year shows the pack-opening feel (ritual, rarity tells, daily free pack) is very compelling. Its business model (premium pass, stamina timers) is exactly what a non-predatory design should drop while keeping the ritual.

### Gaps
- I couldn't verify whether Animal Crossing: New Horizons' capsule-toy machine is interactive (dispenses items) or purely decorative. Nookipedia confirms only its furniture data.
- I found no official HoYoverse statement of Capturing Radiance's exact probabilities or release date; secondary sources conflict.
- I found no published studies on how visible pity counters or duplicate protection affect player satisfaction or retention in non-monetised games. The principles above are inferred from precedents.
- The Genshin Wiki (Fandom) and Tropedia pages returned HTTP 402, so some details come from secondary guide sites.

---

## Q5. Modern quality-of-life expectations: save anywhere / suspend, difficulty and assist options, accessibility, controller support, tutorials that don't drag, auto-battle and skip, run-length expectations

### Takeaway
The current baseline is:
- an assist mode that removes stigma and can be toggled at any time (Hades God Mode);
- difficulty changeable at any time without losing progress (Xbox Accessibility Guidelines, Game Accessibility Guidelines);
- a mid-run suspend save (Returnal added one after launch);
- adjustable game and battle speed, auto-battle and animation skip (Bravely Default, Super Robot Wars);
- remappable controls, customisable subtitles, and interactive tutorials plus a failure-free practice mode (Game Accessibility Guidelines).

Onboarding works best when it uses familiar frames (Balatro's poker imagery) and reveals complexity gradually (Hades II's partly hidden Arcana, StS's sequential Ascension).

### Cited Findings

#### Difficulty and assist
- **Hades God Mode.**
  - It grants a "Deus Ex Machina" boon: 20% damage resistance, +2% after each death, capped at 80%. It can be toggled at any time in options without penalty.
  - It was added in a December 2019 Early Access update.
  - Kasavin: "It inherently feels bad to die in a game." The team wanted to "take the sting of failure and reduce that as much as possible." He called the genre's tension "The part where roguelikes can be brutally difficult is, ironically, directly at odds with the part where they're so replayable."
  - The name was chosen to fit a powerful protagonist and avoid stigma.
  - It makes the player gradually tougher instead of weakening enemies, so players still learn enemy patterns.

  Sources: [Inverse: Hades God Mode interview](https://www.inverse.com/gaming/hades-god-mode-interview); [Hades Wiki: God Mode](https://hades.fandom.com/wiki/God_Mode)
- **Game Accessibility Guidelines** (quoted, with tier):
  - "Offer a wide choice of difficulty levels" (Basic)
  - "Allow difficulty level to be altered during gameplay, either through settings or adaptive difficulty" (Intermediate)
  - "Include an option to adjust the game speed" (Basic)
  - "Offer a means to bypass gameplay elements that aren't part of the core mechanic, via settings or in-game skip option" (Intermediate)
  - "Do not make precise timing essential to gameplay – offer alternatives, actions that can be carried out while paused, or a skip mechanism" (Advanced)

  Source: [Game Accessibility Guidelines: Full list](https://gameaccessibilityguidelines.com/full-list/)
- **Xbox Accessibility Guidelines (XAG).** Topics include game difficulty options, time limits, UI navigation and focus, subtitles and captions, input, photosensitivity and more. A newer guideline recommends letting players change difficulty at any time without losing game progress — [Microsoft Learn: XAG version history](https://learn.microsoft.com/en-us/gaming/accessibility/xag-version-history). Subtitles should respect platform caption settings where possible and scale to at least 200% of a readable default — [Microsoft Learn: XAG 104 Subtitles and captions](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/104)

#### Saving and session control
- **Returnal Suspend Cycle.** Version 2.0 (Oct 2021) added "Suspend Cycle," a temporary snapshot of the current world, gear, upgrades and health. It's deleted when you resume, so it can't be used to save-scum. It isn't available during boss fights, cinematics, first-person sequences or combat. Housemarque stressed it isn't a regular save — [TheSixthAxis](https://www.thesixthaxis.com/2021/10/26/returnal-2-0-update-lets-you-save-the-game-mid-run-photo-mode-patch-notes/); [Can I Play That?](https://caniplaythat.com/2021/10/26/returnal-update-2-0-allows-players-to-suspend-a-cycle-and-return-later/)
- **Game Accessibility Guidelines on saving.** "Provide an autosave feature" and "Provide a manual save feature" (Intermediate) — [GAG full list](https://gameaccessibilityguidelines.com/full-list/)

#### Speed, auto-battle and skipping
- **Bravely Default (2012; HD remaster).** Battles can run at 2× or 4× speed via the D-pad mid-battle. Auto-battle repeats each character's previous commands and stays on between battles. The encounter rate is adjustable (0–200%, and 400% via an item) — [StrategyWiki: Bravely Default Battles](https://strategywiki.org/wiki/Bravely_Default/Battles); [VentureBeat: Bravely Default tips](https://venturebeat.com/2014/02/07/essential-bravely-default-tips-for-beginners/)
- **Super Robot Wars animations.** You can speed them up, skip them or toggle them off, both globally and per fight — [Game Rant: SRW 30 tips](https://gamerant.com/super-robot-wars-30-tips/)

#### Tutorials and onboarding
- **Game Accessibility Guidelines.** "Include interactive tutorials" (Basic) and "Include a means of practicing without failure, such as a practice level or sandbox mode" (Intermediate). Also "Allow controls to be remapped / reconfigured" (Basic) and "Provide subtitles for all important speech" (Basic) — [GAG full list](https://gameaccessibilityguidelines.com/full-list/)
- **Familiar frames.** LocalThunk describes Balatro's poker imagery as primarily an "onboarding tool," not the mechanical core — [Rogueliker interview](https://rogueliker.com/balatro-interview/)
- **Progressive reveal of complexity.**
  - Hades II shows only 9 of 25 Arcana at first, and unlocking reveals their neighbours — [Hades Wiki: Arcana Cards](https://hades.fandom.com/wiki/Arcana_Cards)
  - StS's 20 Ascension levels unlock one after another — [GDC 2019 slides](https://media.gdcvault.com/gdc2019/presentations/Giovannetti_Anthony_SlayTheSpire.pdf)
  - Cassette Beasts gates fusion behind Relationship level 1 and the Fusion Power move behind level 2 — [Cassette Beasts Wiki: Fusion](https://wiki.cassettebeasts.com/wiki/Fusion)

#### Run length and social play
- **Explicit bounds.** Vampire Survivors caps a run at 30 minutes before the Reaper — [Wikipedia](https://en.wikipedia.org/wiki/Vampire_Survivors). Balatro is 8 antes × 3 blinds — [Balatro Wiki](https://balatrowiki.org/w/Blinds_and_Antes).
- **Co-op arriving in the genre.** Slay the Spire 2 launched in Early Access (March 2026) with up to 4-player co-op and multiplayer-specific cards and team synergies — [Mega Crit](https://www.megacrit.com/news/2026-03-05-early-access-launch/)

### Inferences
- **QoL baseline for the toy-mech roguelite.**
  - A suspend-anywhere run save (Returnal learned post-launch that players expect it; its delete-on-resume design prevents save-scumming).
  - A no-stigma assist mode that scales with failure, like "Toy Armor" modelled on God Mode's +2% per loss.
  - Difficulty changeable at any time.
  - 1×/2×/4× speed for battles and animations.
  - Full, short or off combination and capsule-reveal animations (SRW model).
  - An optional "auto-pilot" for squadmates in real-time combat (Bravely Default's repeat-last-commands is the turn-based precedent).
  - Full remapping and customisable subtitles.
  - Rarity and element tells that don't rely on colour alone.
- **Onboarding.** Frame the rules through something familiar, as Balatro does with poker: a capsule-toy machine and a toy-battle tabletop metaphor. Then reveal systems gradually:
  - Run 1: squad basics and 1-of-3 capsule drafts.
  - After the first boss: Fusion Lab.
  - After a few runs: gattai combinations, gated like Cassette Beasts' relationship levels.
  - Later: a "Tournament Rules" difficulty ladder unlocked in sequence like Ascension.

  Add a failure-free "Practice Diorama" sandbox, per the Game Accessibility Guidelines' practice guideline, for testing fusions and combinations.
- **Run length.** An explicit, advertised target (e.g., "a full Toy Box Tour takes roughly 30–45 minutes") plus suspend-save fits the evidence from Vampire Survivors and Balatro. The specific minute target is my assumption and needs playtesting.
- **Co-op combining.** StS2's move into co-op suggests an opportunity where each player controls one component mech and they combine into a shared gestalt. Following the Rita's Rewind lesson from Q3, each player should keep control of a part of the combined robot rather than handing control around.

### Gaps
- I found no authoritative, citable data on player expectations for controller support, such as Steam Deck Verified requirements or controller-usage statistics for roguelites. I didn't research it in this pass.
- There is no sourced industry-wide figure for "expected" roguelite run length or session length. The figures above are per-game design bounds, not survey data.
- I didn't verify StS's own mid-run save-and-quit behaviour or Hades' checkpoint saving with sources, though both are widely known.
- The Hades II accessibility review ([Can I Play That?](https://caniplaythat.com/2025/11/05/hades-ii-accessibility-review/)) appeared in search results but wasn't read, so its specific findings aren't included.
