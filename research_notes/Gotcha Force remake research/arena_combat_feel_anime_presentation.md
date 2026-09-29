# Arena Mecha Combat, Game Feel, Anime Presentation & Toon Rendering: Designer Reference for a Gotcha Force Successor

Scope note: This covers combat mechanics from reference games, game-feel numbers, anime presentation conventions, and cel-shading in WebGL/Three.js. Where a claim comes from a search-engine excerpt rather than a page I fetched and read, it is marked "(search excerpt)". Several key wikis blocked automated fetching: NamuWiki, the atwiki EXVS pages, GameFAQs guides, Fandom wikis, TV Tropes and Medium. For EXVS I used a Japanese verification blog (dragonicfighter.net) and a Dengeki Online article instead. Frame counts assume 60 fps, so 1 frame ≈ 16.7 ms.

---

## 1. Arena mecha combat systems: how the reference games handle lock-on, homing vs. dodging, melee tracking, i-frames, stagger/knockdown, boost economy, team play, comebacks and cost/ticket systems

### Takeaway
The strongest ideas to carry over come from four games.
- **Gundam EXVS:**
  - A shared team cost pool of 6000. Suits cost 1500–3000, and destroyed suits drain their cost from the pool.
  - A "cost over" rule: a suit that respawns with too little cost left comes back with HP scaled by (remaining cost ÷ suit cost).
  - A two-state lock model. Red lock means the shot keeps tracking the target; green lock means it fires at the target's last position.
  - Step-dodges cut homing, and each unit has a boost gauge. Emptying it (overheating) leaves the suit badly exposed when it lands.
  - A hidden "down value" of 5 forces a knockdown, which is followed by invincibility.
- **Custom Robo:**
  - Loadouts are built from 5 part slots.
  - A separate endurance bar knocks the robo down when it runs out, followed by about 3 seconds of "Rebirth" invincibility.
- **Kid Icarus Uprising:** a team life gauge drains by the *value of the weapon* the defeated player carried, and a stronger "angel" unit spawns when the gauge runs out.
- **Armored Core VI:** a stagger meter, plus a "direct hit" damage multiplier that rewards follow-up hits on a staggered target.

### Cited Findings

#### Gundam Extreme VS series (EXVS / Maxi Boost ON / EXVS2)

**Format, cost and cost over**
- It is a 2v2 game. Each team gets a 6000-point resource meter. When a mobile suit is shot down its cost is deducted from the meter, and the first team to reach 0 loses — [Wikipedia: MSG Extreme Vs.](https://en.wikipedia.org/wiki/Mobile_Suit_Gundam:_Extreme_Vs.)
- Cost tiers:
  - Original EXVS: suits cost 3000, 2500, 2000 or 1000. Higher-cost machines are more powerful and cheaper ones are much weaker. In Maxi Boost the 1000-cost units were raised by 500 to 1500 — [Wikipedia](https://en.wikipedia.org/wiki/Mobile_Suit_Gundam:_Extreme_Vs.)
  - Maxi Boost ON uses 3000/2500/2000/1500 — [NamuWiki MBON system (search excerpt)](https://en.namu.wiki/w/%EA%B8%B0%EB%8F%99%EC%A0%84%EC%82%AC%20%EA%B1%B4%EB%8B%B4%20EXTREME%20VS%20MAXI%20BOOST%20ON/%EC%8B%9C%EC%8A%A4%ED%85%9C)
- **Cost-over respawn HP formula (EXVS2 XB)**
  - Formula: respawn HP = max HP × (remaining team cost ÷ suit cost), rounded up to the next 10.
  - Worked example: a 3000-cost suit with 680 HP respawning with 500 cost left gets 680 × 500/3000 = 113.3, which rounds up to 120 HP.
  - Source: [dragonicfighter.net durability specs](https://www.dragonicfighter.net/entry/2021/04/07/125350)
- Strategy: the 3000-cost player should usually "die first" so they respawn at full health for the final exchange. A cheaper partner who dies after the 3000 has fallen comes back "severely overcosted" and must focus on surviving — [DualShockers MBON tips](https://www.dualshockers.com/mobile-suit-gundam-extreme-maxiboost-beginner-tips-tricks/)

**Comeback levers (EXVS2 XB)**
- **Guts correction (根性補正):** below 50% HP, a suit's attack and defense rise. The boost is slight for 3000/2500 suits and very large for 2000/1500 suits ("are you awakened?" level). The HP readout turns yellow below 40% and red below 20% — [dragonicfighter.net](https://www.dragonicfighter.net/entry/2021/04/07/125350)
- **Awakening/burst gauge:** it fills when you *take* damage. The fill rate depends on cost and max HP: high-HP suits gain less per HP point, but gain appears normalized to the percentage of HP lost — [dragonicfighter.net](https://www.dragonicfighter.net/entry/2021/04/07/125350)
- **Healing:** activating any burst heals 50 HP. The "R awakening cross burst" heals 20% of the damage dealt — [dragonicfighter.net](https://www.dragonicfighter.net/entry/2021/04/07/125350)
- **Self-revival:** some suits revive once at 0 HP with 100 HP. Others permanently transform or power up below an HP threshold (listed as about 260 HP for several) — [dragonicfighter.net](https://www.dragonicfighter.net/entry/2021/04/07/125350)

**Controls and bursts**
- Four buttons: Shoot, Melee, Jump, Search. Chords give the sub-weapon (Shoot+Melee), special shooting (Shoot+Jump) and special melee (Melee+Jump). Holding Shoot or Melee gives up to two charge attacks. "Extreme Action" lets you dash-cancel attacks to string combos — [Wikipedia](https://en.wikipedia.org/wiki/Mobile_Suit_Gundam:_Extreme_Vs.)
- **EX Burst (original EXVS):**
  - Pressing all three buttons with the gauge more than half full activates it. It refills the boost gauge, refills ammo (with exceptions) and makes reloads 1.5× faster.
  - You can burst while overheated to regain boost and escape or close out a kill.
  - Source: [Cost Over forum EXVS thread (search excerpt)](https://www.tapatalk.com/groups/cost_over/gundam-extreme-vs-general-discussion-topic-t214.html)
- **Burst types (MBON):**
  - Extend Burst: uses half the gauge to escape an enemy's attack.
  - Shooting Burst: boosts ranged weapons.
  - Fighting Burst: boosts melee and refunds extra boost.
  - Blocking (down then up on the stick) takes 0 damage and builds burst meter.
  - Source: [DualShockers](https://www.dualshockers.com/mobile-suit-gundam-extreme-maxiboost-beginner-tips-tricks/)

**Boost economy**
- Boost Dash (BD) is a direction plus a double-tap of boost. Landing regenerates the boost gauge — [DualShockers](https://www.dualshockers.com/mobile-suit-gundam-extreme-maxiboost-beginner-tips-tricks/)
- Emptying the gauge causes an **Overheat**, which leaves an extremely limited set of actions. On landing the suit pauses "for an even longer period of time than normal", which leaves it open to most attacks — [Cost Over forum (search excerpt)](https://www.tapatalk.com/groups/cost_over/gundam-extreme-vs-general-discussion-topic-t214.html)
- Landing has built-in recovery (着地硬直), and hitting that landing is the basic way to punish.
  - Players counter with **landing shift** (着地ずらし): they boost or jump again right at the moment of landing, and opponents try to read that.
  - The "BD-step" (step during BD) dodges all weapons without stopping, but it burns boost fast.
  - Source: [Dengeki Online EXVS2 techniques](https://dengekionline.com/elem/000/001/908/1908214/)
- The basic combo "Zunda" is Boost Dash → main shot → Boost Dash → main shot → BD → main shot, ending in a knockdown — [DualShockers](https://www.dualshockers.com/mobile-suit-gundam-extreme-maxiboost-beginner-tips-tricks/)

**Dodging vs. homing**
- A step (double-tapping a direction) has the property of breaking all attacks' homing. MBON lets you step during a BD, which makes it easier to shake off homing — [NamuWiki MBON system (search excerpt)](https://en.namu.wiki/w/%EA%B8%B0%EB%8F%99%EC%A0%84%EC%82%AC%20%EA%B1%B4%EB%8B%B4%20EXTREME%20VS%20MAXI%20BOOST%20ON/%EC%8B%9C%EC%8A%A4%ED%85%9C)
- "Rainbow step": cancelling a melee string with a step produces a rainbow trail. It works as a feint or bait in close combat — [Mecha Damashii review (search excerpt)](https://www.mechadamashii.com/reviews/reviews-gundam-extreme-versus-910/); [DualShockers](https://www.dualshockers.com/mobile-suit-gundam-extreme-maxiboost-beginner-tips-tricks/)
- **Axis alignment (軸合わせ):** beam and other straight-line weapons hit a boost-dashing enemy if you line up with their direction of travel. Two teammates attacking from perpendicular angles (an "L-shape" crossfire) exploit this — [Dengeki Online](https://dengekionline.com/elem/000/001/908/1908214/)

**Lock-on model (EXVS2, verified by a community tester)**
Source for everything in this block: [dragonicfighter.net red-lock specs](https://www.dragonicfighter.net/entry/2019/10/20/164522).
- **Green lock (out of range)**
  - Shots fire toward where the enemy was when you pressed the button. Technically they do not "not home"; the game simply stops updating the enemy's position.
  - Melee in green lock loses all tracking and whiffs in place, and moves that branch only on hit become unavailable.
- **Red lock (in range)**
  - The enemy's position is tracked continuously, so the muzzle keeps facing the target up close and projectiles keep chasing at range.
  - Red/green is checked **at the moment the button is pressed**, so the target escaping into green range mid-motion does not cancel the homing.
  - If the target moves beyond a set angle from the shooter's front, homing gives up. Missiles stop chasing if you pass close by, but will chase "forever" if you hold mid-range.
- **Lock range shape:** it is not a sphere. There are dead zones directly above and below the unit, and the limit angles differ per unit. Red-lock range is "not very related to cost".
- **Melee lock:** officially the "range where melee easily hits". In practice it is systemically the same as red lock, set roughly to the reach of the unit's neutral melee.
- **Yellow lock = the target is invincible.** It happens when:
  - the target's **down value reaches 5**;
  - the target has lain on the ground in a down state for a set time;
  - the target burst-escaped during hitstun;
  - certain weapons or states apply.
  - It exists as an anti-infinite, anti-lockdown safeguard.
- **Double lock:** when your partner locks the same enemy, an arc appears beside the marker, placed on the side where your partner is. Enemy markers left and right of each other signal a crossfire chance.
- **Red-lock preservation:** red-lock status carries through cancels. Muzzle correction and homing re-apply on *every* cancel. The exception is charge-shot cancels. If the first attack started in green lock, the follow-ups won't home either.

**Threat indicators**
- A yellow indicator means an enemy has locked onto you; a red indicator means the opponent has fired at you. If both enemies are locked on you, move back toward your partner — [DualShockers](https://www.dualshockers.com/mobile-suit-gundam-extreme-maxiboost-beginner-tips-tricks/)

#### Custom Robo (N64 / GameCube)
- There are 5 part types: Chassis (the robo), Gun (right hand), Bomb (left hand), Pod (backpack) and Legs (attachments to legs and feet). Chassis models come in groups with shared traits — [Wikipedia: Custom Robo Battle Revolution](https://en.wikipedia.org/wiki/Custom_Robo_Battle_Revolution)
- **Match opening:** robos launch from a Robocannon as cubes with six numbered sides that set how long they take to transform. The first robo to transform attacks first, and being attacked forces an immediate transform — [Wikipedia: CRBR](https://en.wikipedia.org/wiki/Custom_Robo_Battle_Revolution)
- **HP and knockdown:**
  - HP runs from 1000 to 0.
  - An endurance bar sits above HP. When it empties, the robo is "downed" and stays fallen for a couple of seconds.
  - After getting up it enters "rebirth" mode, "a temporary state of invincibility lasting 3 seconds".
  - Sources: [Wikipedia: Custom Robo](https://en.wikipedia.org/wiki/Custom_Robo); [Wikipedia: CRBR](https://en.wikipedia.org/wiki/Custom_Robo_Battle_Revolution)
- A knockdown happens when a robo takes significant damage in a short time or is hit by special high-impact attacks. A downed robo can still take damage, but at a reduced rate — [Robopedia: Custom Robo gameplay (search excerpt)](https://customrobo.fandom.com/wiki/Custom_Robo_gameplay)
- Players generally try to land a follow-up on a downed robo, usually a Bomb or melee depending on distance, "because a few extra gun shots don't usually add a lot of damage". Some Illegal robos skip the vulnerable down period and go straight into Rebirth — [GameFAQs N64 guide by Terotrous (search excerpt)](https://gamefaqs.gamespot.com/n64/197016-custom-robo/faqs/69365)
- Holosseums (arenas) come in varied sizes and layouts, some with hazards such as ice or lava. Players can customize arenas with Holosseum decks — [Wikipedia: CRBR](https://en.wikipedia.org/wiki/Custom_Robo_Battle_Revolution)
- **Handicap (sources conflict):**
  - The series article says the opponent's starting HP can be cut by up to 75% (to 250) — [Wikipedia: Custom Robo](https://en.wikipedia.org/wiki/Custom_Robo)
  - The CRBR article's wording, as summarized, reads as a maximum 250 HP *reduction* — [Wikipedia: CRBR](https://en.wikipedia.org/wiki/Custom_Robo_Battle_Revolution)

#### Cyber Troopers Virtual-On
- **Twin sticks:** each stick has a trigger and a top button. The sticks steer like a bulldozer (both forward to move, opposite directions to turn) — [Wikipedia: Virtual On](https://en.wikipedia.org/wiki/Virtual_On:_Cyber_Troopers) (search excerpt)
- **Three weapon slots from trigger combinations:**
  - Left trigger: an often-defensive left weapon.
  - Right trigger: an offensive right weapon.
  - Both triggers: a potent center weapon.
  - Source: [Time Extension](https://www.timeextension.com/guides/suit-up-with-virtual-on-segas-mecha-masterpiece)
- **Dashes:**
  - Play is built around "fixed-length vectored dashes with a menu of very specific attacks".
  - The original arcade game had "a small movement freeze at the end of each dash attack". This produced "a very tactical ballet" of trying to wrong-foot the opponent.
  - Oratorio Tangram added single-press dash cancels, right-angle "Watari" dashes, and turbo attacks made by combining dash and trigger inputs.
  - Source: [Time Extension](https://www.timeextension.com/guides/suit-up-with-virtual-on-segas-mecha-masterpiece)
- **V-Armor** (search excerpts; I could not tell whether each detail comes from HG101 or Wikipedia):
  - It lets heavy VRs compete with fast ones, working like a guard meter that repels long-range shots.
  - Strong-armor VRs ignore everything except strong or close-range hits; weak-armor VRs only deflect weak shots fired from long range.
  - It is less effective while dashing or jumping and more effective during crouch attacks.
  - Specific attacks strip it.
  - Sources: [Hardcore Gaming 101: Oratorio Tangram](https://www.hardcoregaming101.net/virtual-on-oratorio-tangram/); [Wikipedia](https://en.wikipedia.org/wiki/Virtual_On:_Cyber_Troopers)

#### Medarot / Medabots (part-break system)
- Each side fields 1–3 Medarots, and the first one selected is the "leader". The battle ends when the leader's head armor reaches 0. Turn timing is driven by each Medarot's leg speed plus each action's charge and cooldown times — [Medapedia: Battle system](https://medarot.meowcorp.us/wiki/Battle_system)
- Part roles:
  - The head has limited ammo, and destroying it shuts the Medabot down (the Medal ejects).
  - The right and left arms have unlimited uses until destroyed.
  - The legs affect movement by terrain and build the Medaforce meter.
  - Source: [Medabots Wiki (search excerpt)](https://medabots.fandom.com/wiki/Medabot)

#### Armored Core VI (stagger / "ACS")
- Stagger stuns the target and leaves it vulnerable briefly. It is triggered by depleting or filling the target's Impact (ACS) meter; sources phrase it differently — [DualShockers AC6 impact guide (search excerpt)](https://www.dualshockers.com/armored-core-6-impact-meter-guide/)
- **Direct Hit Adjustment:**
  - It is a per-weapon damage multiplier against staggered targets. OS Tuning adds up to +15%.
  - Melee, shotguns and miniguns tend to have high direct-hit values, while long-range rifles have low ones. The intended loop is to stagger with high-impact weapons and then cash in with high direct-hit weapons.
  - Source: [Prima Games (search excerpt)](https://primagames.com/tips/armored-core-6-how-to-make-the-most-of-enemy-acs-stagger-in-ac6)

#### Kid Icarus: Uprising (value-weighted team gauge; closest analog to EXVS cost)
- In Light vs. Dark, each team shares a life gauge that drops whenever a member is defeated. The more valuable the defeated player's weapon, the bigger the drop, so a powerful weapon is double-edged — [Wikipedia (search excerpt)](https://en.wikipedia.org/wiki/Kid_Icarus:_Uprising); [Icaruspedia](https://www.kidicaruswiki.org/wiki/Together_Mode)
- When the gauge empties, the team's last defeated member respawns as the angel (Pit or Dark Pit) with a random weapon and more power and health. The match ends when an angel is defeated — [search excerpt from the same sources](https://www.kidicaruswiki.org/wiki/Together_Mode)

#### Gundam Breaker 4 (part mixing)
- It has more than 250 parts. Each part is designed with *equal strength and fixed parameters*, so players can mix for looks and playstyle "without worrying about performance disparities" — [ONE Esports (search excerpt)](https://www.oneesports.gg/gaming/gundam-breaker-4-customization-endless/)
- **Assembly slots:**
  - Head, left arm, right arm, body, shield, backpack, legs, Builder Parts, left and right close-range weapons, and left and right long-range weapons.
  - The two arms can differ, and most weapon types can be dual-wielded. Parts can be resized and repositioned.
  - There are up to 8 Builder Parts slots.
  - EX Skills attach to parts, and a part upgraded to 5 stars "masters" its EX skill so it can be used on any build.
  - Sources: [ONE Esports (search excerpt)](https://www.oneesports.gg/gaming/gundam-breaker-4-customization-endless/); [Gundam Breaker Wiki: GB4 Builders Parts](https://gundambreaker.miraheze.org/wiki/GB4_Builders_Parts)

#### Daemon X Machina
- **Adaptive lock-on:** it locks nearby enemies with no button press. Enemies show blue cubes and the current target a red cube — [Twinfinite review (search excerpt)](https://twinfinite.net/reviews/daemon-x-machina-review-not-meching-around/)
- **Weapons and parts** (search excerpt): [TheGamer tips](https://www.thegamer.com/daemon-x-machina-beginner-tips-tricks-before-playing/); [Nintendo Insider](https://www.nintendo-insider.com/daemon-x-machina-review/)
  - Players can pick up weapons from downed enemy mechs and equip them immediately.
  - Head parts set lock-on distance and type; body parts affect memory, lock-on time and flight speed.

#### Mega Man Battle Network (counter-hit reward loop)
- The Custom Gauge takes about 8–10 seconds to fill before new chips can be chosen — [MMKB: Custom Gauge (search excerpt)](https://megaman.fandom.com/wiki/Custom_Gauge)
- **Counter hits:**
  - Hitting an enemy *during its attack* (a counter) paralyzes it and grants **Full Synchro**, which doubles the next chip attack.
  - Enemies flash while they are counterable.
  - Full Synchro ends if you use a chip attack that isn't a counter or if you take a hit.
  - Source: [MMKB: Synchronization (search excerpt)](https://megaman.fandom.com/wiki/Synchronization)

#### Splatoon (movement as a resource)
- Swim form moves faster than walking, climbs inked walls, and refills ink ammo faster — [Wikipedia: Splatoon (search excerpt)](https://en.wikipedia.org/wiki/Splatoon_(video_game))
- The team reframed "hiding" in ink as "swimming/diving". That reframing led programmers to add camera shake, effects artists to add splashes, and sound staff to add splashing and *muffled BGM while submerged* — [Iwata Asks: Splatoon (search excerpt)](https://iwataasks.nintendo.com/interviews/wiiu/splatoon/0/3/)

#### God of War 2018: lock-on, melee tracking and multi-enemy management (primary GDC 2019 slides)
Source for everything in this block: [Mihir Sheth, "Evolving Combat in God of War for a New Perspective" (GDC 2019 PDF)](https://sms.playstation.com/media/documents/GDC2019_SMS__mihirsheth_evolvingcombat.pdf).
- **Aggression tokens**
  - Enemies are scored by priority, whether the player targets them, and "Action Rank" (on or off screen, angle from the camera, distance). Tokens from a fixed pool are then handed out in score order.
  - Each enemy type claims a different number of tokens. The talk's example uses a pool of 14. Enemies who get no tokens become non-aggressive, and in a Draugr pack only 2 were aggressive at a time. Token counts change per difficulty.
- **Off-screen indicators**
  - Flashing the screen edges was misread as a damage indicator.
  - They switched to arrows circling the hero: red for incoming attacks, subtle white for nearby idle enemies, and a different (purple) color for ranged attacks.
- **"Suck To Target" (STT)** is a motion-warp that pulls the attacker toward the target. Its range scales with the target's angle (wider angle, shorter range), so side targets get missed more. It was cut back sharply on the hardest difficulty.
- **Aim assist** for ranged combat has two parts, both "tuned very liberally":
  - Aim Friction slows the reticle over targets.
  - Zoom Snapping snaps to a nearby target when you pull aim.
- **Lock-on** was absent for most of development. It was added near ship because playtesters wanted it.
- **Strike Assist and hit reactions**
  - Hit reactions snap the victim's knockback trajectory toward a blend between the camera's facing vector and the original trajectory, so enemies are pulled back on screen. The blend is set per attack.
  - Basic hit-reaction translation, and even Kratos's attack translation, were reduced.
  - A "float height" cap keeps juggled enemies from rising out of frame.

### Inferences
- **Cost pool for a many-robot team game.**
  - EXVS's cost system maps directly onto Gotcha Force-style squads. Give each robot a cost, deduct it from a team pool of about 6000 when the robot is destroyed, and scale respawn HP by remaining pool ÷ robot cost.
  - This makes "who dies first" a strategic decision. It also naturally penalizes stacking expensive units, which is what Kid Icarus does with weapon value.
  - One key difference: EXVS has 2 players with respawns, whereas a Gotcha Force successor with many borgs per player may want a *pool plus bench* hybrid.
- **Two-state lock model is cheap to build and legible.**
  - Implement red/green lock as a range check at the moment of firing. In green, fire at a snapshot of the target's position; in red, fire at a live reference to the target.
  - Add a homing give-up angle and dead cones directly above and below.
  - Make a step or dodge set a flag that clears homing on all projectiles currently tracking the dodger. This is EXVS's "step cuts homing", and it gives a clear read-and-react skill without i-frames.
- **Knockdown safety valve.**
  - Combine EXVS's down value (a per-hit value that forces a down at 5) with Custom Robo's endurance bar and about 3 s Rebirth invincibility, and show invincibility as a visible "yellow lock".
  - This prevents infinites in a 3D arena with many attackers. That matters more when 2+ enemies can juggle one robot.
- **Boost economy creates the core mind game.**
  - Landing recovery, overheat penalties and BD-step boost costs turn every airborne phase into a resource decision.
  - A "landing shift" option (re-boost at the moment of landing) gives defenders a counterplay.
- **Comeback tools.** Guts damage and defense scaling below 50% HP (stronger for cheap units) and burst meter filled by damage taken are proven. Also consider MMBN's counter-hit doubling and AC6's stagger then direct-hit multiplier as skill-based comeback tools.
- **Multi-enemy readability.** GoW's token system and off-screen arrows are directly relevant to a 3D arena with many robots on screen. Use them for CPU enemies, and use arrows for off-screen *locking* and *firing* threats, matching EXVS's yellow and red warnings.

### Gaps
- EXVS numbers I could not verify because the atwiki, NamuWiki and GameFAQs pages blocked fetching:
  - boost gauge capacity and cost per action;
  - step i-frame and homing-cut frame counts;
  - burst durations and damage multipliers;
  - per-weapon down values beyond the threshold of 5;
  - down-value decay rate;
  - wake-up invincibility duration in frames.
- Custom Robo: air-dash counts, jump counts and per-part stats; exact down duration beyond "a couple of seconds". The Fandom and GameFAQs pages were blocked.
- No sources found in this pass for Zoids games, Mega Man Legends lock-on, or Virtual-On "leaning".
- Virtual-On V-gauge and weapon-energy recharge numbers were not found.
- Splatoon exact swim speeds and ink-refill rates were not retrieved.

---

## 2. Game feel / "juice": concrete numbers for hitstop, shake, camera, knockback, buffering, coyote time, canceling and aim assist

### Takeaway
Hitstop should scale with damage and have a cap.
- **Smash:** Ultimate uses about 0.65 × damage + 6 frames, capped at 30.
- **Capcom:** fighting games often use 8/12/16 frames for light, medium and heavy attacks; its beat 'em ups used a flat 5–8 frames.

Presentation details matter as much as duration: the victim shakes horizontally on the ground and vertically in the air, the shake fades, hurtboxes stay put, and projectiles give no hitstop to the shooter.

For camera shake, use trauma: a 0–1 value, with shake = trauma² or trauma³ driven by Perlin noise, rotation-only in 3D. For input forgiveness, the reference points are a 9–10 frame buffer (Smash) and 0.1 s of coyote time (Celeste).

### Cited Findings

#### Hitstop (hit-pause)
**Sakurai (Famitsu column, translated)** — source for this group: [Source Gaming](https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/)
- More damage means longer hitstop, but a cap ensures it "will never exceed this limit".
- Both characters freeze "for the exact same amount of time".
- Projectiles get comparatively less hitstop, and electric attacks get more.
- Marth's sword gets extra hitstop at the tip and less at the edge.
- Victims vibrate while their hurtboxes stay static, and the attacker "also vibrates slightly".
- Grounded characters vibrate side to side and airborne ones up and down.
- Vibration starts large and shrinks, and its intensity is scaled by camera distance.
- "We take four frames to smoothly transition from the initial flinch to the hurt animation."

**Sakurai's YouTube video (8 hitstop techniques)** — sources: [Nintendo Wire (search excerpt)](https://nintendowire.com/news/2022/12/12/this-week-in-sakurai-12-5-12-11-fine-tuning-hit-stop-and-cheating-the-system/); [GoNintendo](https://www.gonintendo.com/contents/13581-sakurai-s-latest-game-dev-video-features-8-hit-stop-techniques)
1. Shake the character being hit more.
2. Don't move the hitbox.
3. Shake horizontally on the ground and vertically in the air.
4. Gradually lessen the shake.
5. Control the amount of hitstop.
6. Interpolate frames into the damage pose.
7. Keep the attacker moving just a little.
8. Scale the shake with camera distance.

A separate Sakurai video, "Stop for Big Moments! [Design Specifics]", covers stopping time for big moments — [YouTube](https://www.youtube.com/watch?v=OdVkEOzdCPw) (title only; not reviewed).

**Smash hitlag formulas (frames)** — source for this group: [SmashWiki: Hitlag](https://www.ssbwiki.com/Hitlag)
- Melee: ⌊⌊⌊d/3 + 3⌋ × e⌋ × c⌋, capped at 20.
- Brawl and Smash 4: ⌊⌊(d × 0.3846154 + 5) × h × e⌋ × c⌋, capped at 30 (20 for a crouch-cancelling victim).
- Ultimate: ⌊⌊⌊(d × 0.65 + 6) × h × e × s⌋ × p⌋ × c⌋.
- Modifiers:
  - e: electric ×1.5
  - c: crouch cancel ×0.67
  - s: shielding ×0.67
  - p: player-count scaling from 1.0 down to 0.75
  - h: per-hitbox multiplier

**Capcom fighting games (SFV "Shadaloo" column)** — source for this group: [Capcom Fighters Network: Basics of Attacking, Damage Part II](https://game.capcom.com/cfn/sfv/column/131545)
- Hit and block stop are "usually systematic per game". Example: light/medium/heavy = **8F/12F/16F**.
- Multi-hit moves may get shortened hitstop "to prevent it from feeling too heavy".
- Projectiles cause no hitstop for the attacker.
- Worked example: startup 3, active 4, recovery 5, hitstun 13 and hitstop 8 give the attacker +4 on hit.

**Capcom beat 'em ups (measured)** — source for this group: [Shane Sicienski: Hitstop in Capcom Beat 'Em Ups](https://shane-sicienski.com/blog/blog-post-title-one-55pmn)
- Final Fight: a flat 6 frames on every attack.
- Captain Commando: 8 frames.
- Knights of the Round: 6 frames on the ground, 7 in the air.
- Warriors of Fate: jab 5 frames; a multi-hit special at 2 frames per impact.
- The Punisher uses *asymmetric* hitstop, with the attacker frozen for less time than the target:
  - jab: 6 vs 8 frames
  - cross: 8 vs 10 frames
  - air attacks: 10 vs 11 frames
- Thrown enemies get 0 frames in several of these games.

**Vlambeer's "Art of Screenshake"** — source: [Pepwuper talk summary (search excerpt)](https://pepwuper.com/jan-willem-nijman-co-founder-of-vlambeer-on-the-art-of-screenshake/); talk video: [YouTube (INDIGO 2013)](https://www.youtube.com/watch?v=AJdEqssNZ-U)
- Nijman turns a simple platformer into a fun prototype with about 30 tricks, including:
  - bigger bullets and a higher fire rate;
  - lower accuracy;
  - enemy hit animations and knockback;
  - gun kickback;
  - permanence (bodies and shells stay);
  - a camera that leads in the facing direction;
  - smoke;
  - "sleep": pausing for a frame or two when enemies die, the player is hit, or things explode.

#### Knockback curve (Smash)
Source for this group: [SmashWiki: Knockback](https://www.ssbwiki.com/Knockback)
- Formula: ((((p/10 + p·d/20) × 200/(w+100) × 1.4) + 18) × s) + b) × r.
  - p: the target's damage % after the hit
  - d: the hit's damage
  - w: weight
  - s: knockback scaling ÷ 100
  - b: base knockback
  - r: ratios
- Launch speed = knockback × 0.03, decaying by 0.051 per frame.
- Tumble starts at about 80 knockback units.
- Base knockback sets the minimum launch power; knockback scaling sets how launch power grows with accumulated damage.

#### Screen shake and camera (Squirrel Eiserloh, GDC 2016 "Juicing Your Cameras With Math")
Source for this group: [archive.org transcript](https://archive.org/stream/GDC2016Eiserloh/GDC2016-Eiserloh_djvu.txt)
- **Trauma model**
  - Keep a trauma value in [0,1]. Events add to it (for example +0.2 or +0.5), and it decays linearly.
  - Shake = trauma² or trauma³. With the cube, trauma 0.30/0.60/0.90 gives 3%/22%/73% shake.
- **2D:** use translation plus rotation, e.g. `angle = maxAngle*shake*rand(-1,1)` and `offset = maxOffset*shake*rand(-1,1)`.
- **3D:** use rotation only (yaw, pitch and roll scaled by shake). Translational shake in 3D is "super lame".
- **Noise:** use Perlin noise rather than random values. It "feels better" and "automagically works with pause and slow-motion".
- **Smoothing:** `x += (target - x) * weight`. At 60 fps, weight 0.01 is slow, 0.1 reasonably fast and 0.5 incredibly fast. Multiply the weight by the time scale so it works with slow-motion.

#### Input buffering, coyote time and forgiveness
- **Smash buffer:** Melee barely buffers. Brawl and Smash 4 buffer 10 frames at the end of most moves. Ultimate buffers **9 frames** and adds a *hold* buffer, where holding an input through the end of an animation buffers it. The downside is unintended buffered actions, made worse online by input delay — [SmashWiki: Buffer](https://www.ssbwiki.com/Buffer)
- **Celeste's forgiveness list:**
  - coyote time;
  - jump buffering, so the jump fires on the exact landing frame;
  - half gravity at the jump apex while jump is held;
  - corner correction on head bonks and dashes;
  - lift momentum kept "for a few frames";
  - wall jumps allowed 2 px from a wall (about 5 px for super wall jumps).
  - The philosophy is to widen timing and positioning windows so "everything is fudged a tiny bit in the player's favor".
  - Source: [Maddy Thorson thread](https://threadreaderapp.com/thread/1238338574220546049.html)
- **Celeste source constants** (pixels in a 320×180 game) — source: [Celeste Player.cs (official source release)](https://github.com/NoelFB/Celeste/blob/master/Source/Player/Player.cs)
  - `JumpGraceTime = 0.1f`: coyote time of 100 ms.
  - `VarJumpTime = .2f`: variable jump-height window.
  - `HalfGravThreshold = 40f`: vertical-speed band for half gravity at the apex.
  - `UpwardCornerCorrection = 4` and `DashCornerCorrection = 4` pixels.
  - `DashTime = .15f` and `DashCooldown = .2f`.
  - `Gravity = 900f`, `MaxFall = 160f`, `JumpSpeed = -105f`.
  - `WallJumpCheckDist = 3`.
  - Jump buffering is consumed via `Input.Jump.ConsumeBuffer()`, but the buffer duration is defined outside this file.

#### Aim assist, auto-targeting and animation canceling
- **God of War:**
  - Aim Friction (the reticle slows over targets) and Zoom Snapping (it snaps to a nearby target on aim) were tuned "very liberally".
  - Melee uses a Suck-To-Target motion warp whose range shrinks as the angle to the target grows.
  - Strike Assist bends knockback trajectories toward the camera's center.
  - Source: [GDC 2019 PDF](https://sms.playstation.com/media/documents/GDC2019_SMS__mihirsheth_evolvingcombat.pdf)
- **Canceling examples:**
  - EXVS "Extreme Action" dash-cancels attacks into combos — [Wikipedia](https://en.wikipedia.org/wiki/Mobile_Suit_Gundam:_Extreme_Vs.)
  - EXVS step-cancels melee ("rainbow step") — [DualShockers](https://www.dualshockers.com/mobile-suit-gundam-extreme-maxiboost-beginner-tips-tricks/)
  - Virtual-On OT has single-press dash cancels and turbo attacks — [Time Extension](https://www.timeextension.com/guides/suit-up-with-virtual-on-segas-mecha-masterpiece)

### Inferences
These are starter values derived from the cited numbers, not sourced facts.
- **Hitstop table (60 Hz):**
  - Chip or rapid shots: 0–2 f on the victim only, since the shooter gets no hitstop per Capcom and projectiles get less per Sakurai.
  - Light melee: 5–8 f (83–133 ms).
  - Medium: about 10–12 f.
  - Heavy or charged: 14–16 f.
  - KO or finisher: 20–30 f (Smash's cap), optionally followed by slow motion.
  - An Ultimate-style formula also works: `frames = min(30, floor(damage*0.65 + 6))`, with damage scaled so that a "heavy" hit is about 15–20.
  - Shorten hitstop per hit for multi-hit moves.
  - Consider The Punisher's asymmetry: the attacker resumes 1–2 f before the victim, which feels snappier.
- **Victim shake:** amplitude falls off linearly to 0 across the hitstop. Shake horizontally when grounded and vertically when airborne, offset only the mesh (never the hurtbox), and give the attacker a tiny shake too. Blend into the hurt pose over about 4 frames (Sakurai).
- **Camera:** use trauma-based rotational shake in 3D. Starting points: +0.2 trauma for light hits and explosions nearby, +0.5 for heavy hits or taking a KO hit, shake = trauma², Perlin noise at roughly 15–25 Hz, a maximum of about 2–4° pitch and yaw and slightly less roll. Scale by camera distance per Sakurai.
- **Knockback:** knockback grows with accumulated damage (Smash) or with the down value (EXVS). A decaying launch speed (Smash's constant per-frame decay) gives a readable arc. Keep victims on screen with GoW-style trajectory bending toward the camera's center.
- **Buffers:** about 8–10 frame (133–167 ms) press buffer for attacks, dodges and boost, and about 100 ms coyote time for jump or boost off ledges. Drop the hold buffer, or limit it, to avoid unintended actions, especially with network latency in browser play.
- **Browser implementation:** run the simulation at a fixed 60 Hz timestep so frame-based numbers transfer directly. Handle 120/144 Hz monitors by interpolating rendering. Implement hitstop as a per-entity freeze counter plus an optional global time scale, which works naturally with Perlin-noise shake (Eiserloh).

### Gaps
- No verified numbers found for:
  - camera punch or zoom (FOV kick magnitudes and durations);
  - flash-on-hit duration (commonly 1–3 frames, but unsourced here);
  - particle counts;
  - sound layering practice (transient, body, tail) — no source retrieved.
- Steve Swink's *Game Feel* and the Hollow Knight and Celeste GDC talks were not retrieved, so no quotes or numbers from them.
- The full numbered list of Nijman's 30 tricks and any "sleep" durations in ms were not retrieved; the GitHub recreation README did not list them.
- Celeste's jump-buffer duration is not in Player.cs. A figure claiming a "4-frame buffer" appeared only on a low-quality aggregator and was excluded.
- Charged-attack feedback conventions (charge tiers, audio pitch rise, flash at full charge) were not sourced.

---

## 3. Anime presentation in games: super cut-ins, dramatic finishes, UI motion, episode conventions and impact frames

### Takeaway
The best-documented technique is Guilty Gear Xrd's approach, and it is directly usable.
- Hold poses with no interpolation between key frames ("limited animation"), give models around 500 bones and heavy scale animation, and deform the mesh on each key to break perfect 3D perspective.
- Author the cel look through hand-edited normals, vertex-color shadow thresholds, a per-character light vector and a shadow "tint" texture.
- Use 3D's camera freedom mainly for supers and finishes.

Around that, genre conventions give a vocabulary:
- screen freeze + darken + zoom + portrait cut-in for supers;
- matchup- and stage-specific "dramatic finishes";
- snappy, lag-free animated menus in a strict palette (Persona 5);
- eyecatches and "next episode" previews;
- single-frame monochrome "impact frames".

### Cited Findings

#### Guilty Gear Xrd (primary GDC 2015 handout by Junya C. Motomura)
Source for everything in this block: [Motomura GDC 2015 handout PDF](https://www.ggxrd.com/Motomura_Junya_GuiltyGearXrd.pdf); talk: [GDC Vault](https://www.gdcvault.com/play/1022031/GuiltyGearXrd-s-Art-Style-The).
- **Why 3D:** the main payoff was "freedom … on the camera". "For special attacks and finish scenes, the camera moves around the 3D space and shows the action from a more dramatic perspective." The game itself stays on a 2D plane.
- **Principle:** "Kill everything 3D". Every shading decision should be an artist's intention, because "correct" math "is just not good enough".
- **Models:**
  - About 40,000 triangles per character, built to survive extreme close-ups.
  - No normal maps. Data lives in vertex normals, vertex colors and UVs because vertex data is resolution-independent.
- **Shading:**
  - The cel shader is a `step` of the light vector against the normal, with a threshold. The team took full control of all three inputs.
  - A vertex-color channel offsets the threshold, which works as painted "occlusion". A value of 0 means always shaded.
  - There is **no global lighting**: each character has a dedicated light vector tuned for their idle pose, animated per frame in cutscenes.
  - Normals were **hand-edited on every major feature**, especially faces.
- **Color:**
  - The shaded color is base texture × "Tint" texture, representing how much light the material passes; skin shades lean red, for example.
  - The textures are flat color lookups, not painted detail.
- **Lines:**
  - Outlines use an **inverted hull** generated in the shader and expanded along normals. Vertex colors control width, including erasing lines.
  - The team preferred this over post-process outlines because it previews in the modeling viewport and gives per-vertex control.
  - Inner lines use **axis-aligned "beams" on the texture with UVs laid along them**, where UV overlap sets thickness. This gives jaggy-free lines at any zoom, at the cost of distorted UVs.
- **Animation:**
  - The team uses **"Limited Animation"**: "we just stopped using interpolations between key frames. Every frame now is a key frame". Full animation "didn't convey the sense that it was 2D".
  - Rigs have about **500 bones** per character and no physics simulation.
  - Heavy **scale animation** covers exaggeration, hiding and revealing parts, and squash and stretch.
  - Animators **deform the mesh every key frame to add imperfection**, since perfect perspective reads as rigid 3D: "Expressiveness over accuracy."

#### Super-move cut-ins and screen freeze
- **Convention history:** from Street Fighter III on, activating a Super Art brings a zoom-in, screen freeze and flashing lights. SFIV added full-motion zoom-ins for Ultras.
- The "Super Move Portrait Attack", or cut-in, flashes a character portrait or face close-up before the attack. This conveys determination that the in-game model can't.
- Source: [TV Tropes: Super Move Portrait Attack (search excerpt)](https://tvtropes.org/pmwiki/pmwiki.php/Main/SuperMovePortraitAttack)

#### Dragon Ball FighterZ: Dramatic Finishes
- A special cutscene plays on a KO when specific conditions line up: the right character matchup (e.g., SSJ Goku vs. Frieza), the right stage (e.g., Planet Namek) and the finishing condition.
- It either recreates a manga or anime scene or shows original "what-if" content, so the fight's end plays out "as the story you know".
- Source: [esports.net](https://www.esports.net/news/fighting-games/dragon-ball-fighterz-dramatic-finishes/)

#### Super Robot Wars
- When a unit attacks, the defender chooses to block, evade or counter, and then the battle animation plays. The stories replay anime plots, altered to fit crossover casts.
- Z3 was the first SRW with HD sprites.
- Source: [Wikipedia: Super Robot Wars](https://en.wikipedia.org/wiki/Super_Robot_Wars)
- Battle cut-ins make the robot briefly resemble its anime counterpart's art style, and recent entries (e.g., SRW 30) refined their cut-in graphics and effects. This comes from a search excerpt, and it is unclear which result page it came from; the candidates are [Bandai Namco SRW30 page](https://en.bandainamcoent.eu/super-robot/super-robot-wars-30) and [TV Tropes: Super Robot Wars](https://tvtropes.org/pmwiki/pmwiki.php/VideoGame/SuperRobotWars). Treat it as unverified.

#### Persona 5 UI (art director Masayoshi Sutou, Famitsu interview translation)
Source for this group: [Tumblr translation](https://www.tumblr.com/sillyfudgemonkeys/150291106694/persona-5-developer-interview-about-ui-design); [Persona Central (search excerpt)](https://personacentral.com/persona-5-interview-ui-design-sound-music/)
- **Series palettes:** Persona 3's UI key color is teal, Persona 4's is vivid yellow, and Persona 5's is crimson red. After trying alternatives, Sutou settled on black and white text.
- **Motion and latency:** "Each entry on the menu screen is animated". Because the UI data is kept resident in memory, "it will pop up without any lag whatsoever, this was something that I was very particular about."
- **Aim:** a UI that would stand out even in non-gaming (including women's) magazines.

#### Episode conventions
- An **eyecatch** is a short bumper going into or out of a commercial break, either humorous with a musical sting or a simple image with the series name. Examples:
  - One Piece uses Wanted posters of the episode's focus character.
  - Katekyo Hitman Reborn! uses a different eyecatch per arc.
  - Source: [TV Tropes: Eye Catch (search excerpt)](https://tvtropes.org/pmwiki/pmwiki.php/Main/EyeCatch)
- **"On the Next…" previews:** nearly every anime ends episodes with a narrated preview, sometimes played for comedy (e.g., Baccano!) — [TV Tropes: On the Next (search excerpt)](https://tvtropes.org/pmwiki/pmwiki.php/Main/OnTheNext)

#### Evolution sequences (Pokémon)
- Pressing B during a level-up evolution cutscene cancels it. This does not work for stone or trade evolutions.
- It is absent in Legends: Arceus and Z-A, where evolution isn't automatic.
- Source: [Bulbapedia: Evolution prevention (search excerpt)](https://bulbapedia.bulbagarden.net/wiki/Evolution_prevention)

#### Impact frames
- Impact frames are "usually monochromatic or otherwise chromatically stylized drawings hidden within sequences to give them extra oomph". They usually "flash for a fraction of a second", though some animators "flaunt them" — [Sakuga Blog glossary](https://blog.sakugabooru.com/glossary/impact-frames/)
- Common looks are pure black-and-white silhouettes, inverted colors, or saturated primaries that break visual continuity — [BrainVoyage (search excerpt; lower-quality source)](https://brainvoyage.blog/impact-frames-meaning-animation-guide)

#### Presentation via audio (Splatoon)
- Reframing ink as "swimming" led to camera shake, splash effects and *muffled BGM while submerged*. This is a cross-discipline example of presentation reinforcing a mechanic — [Iwata Asks (search excerpt)](https://iwataasks.nintendo.com/interviews/wiiu/splatoon/0/3/)

### Inferences
- **Limited animation in Three.js.** Step the animation: advance `AnimationMixer` only every 2nd or 3rd render tick, or build clips with discrete (non-interpolated) keyframe tracks. Per GG Xrd, this is what "reads 2D". Keep gameplay hitboxes on the fixed 60 Hz sim so stepping affects visuals only. Three.js discrete interpolation support was not verified in this research pass.
- **Super move cut-in template** (sequence from the SF/TV Tropes conventions; timings are my guesses):
  1. Global time freeze (0.4–0.8 s).
  2. Darken or desaturate the world (the attacker stays lit).
  3. Diagonal portrait band sliding in with speed lines.
  4. Camera push-in on the attacker.
  5. Release into the attack with hitstop and impact frames on contact.
- **Dramatic Finish analog for toy robots.** Trigger a special KO cutscene when a specific robot KOs a specific rival on a specific arena. This is cheap to author with a scripted camera plus stepped animation, and it rewards collection.
- **Impact frame in WebGL.** For 1–2 frames on a heavy or KO hit, render a full-screen post pass that thresholds luminance to black and white or inverts it, optionally masking only the characters. Offer an accessibility toggle for flashing.
- **Episode framing.** Chapter "episodes" with a title card, a mid-episode eyecatch (e.g., a robot "Wanted poster" or trading-card bumper) and a "Next time…" preview match anime grammar. Persona 5's lesson applies: animated UI must open instantly, so preload menu assets.

### Gaps
- Could not retrieve sources on:
  - Persona 5's angles and typography: its ransom-note lettering, tilted layouts and transition timings. The Medium analyses were blocked.
  - Danganronpa or Ace Attorney portrait and VN conventions.
  - Episode structure in Tokyo Mirage Sessions, Kill la Kill IF or MMBN.
  - Digimon evolution sequences.
  - Gundam game cut-in conventions.
  - SRW cut-in production details.
  - Speed-line implementation.
- No GDC or technical talk on DBFZ's camera work for dramatic finishes was found.
- The GG Xrd handout gives no exact frame-hold rate (e.g., animating "on 2s" or "on 3s") and no full vertex-color channel map.
- No primary source found on standard super-freeze durations.

---

## 4. Cel-shading / toon rendering practical for WebGL / Three.js

### Takeaway
Three.js provides two built-in starting points.
- `MeshToonMaterial` uses a gradient-map ramp, which requires `NearestFilter`.
- The example `OutlineEffect` implements inverted-hull outlines. It renders the scene twice, with back faces pushed out along normals, using thickness scaled in screen space (default 0.003).

A custom `ShaderMaterial` adds GG Xrd-style control plus Roystan-style extras:
- `smoothstep(0, 0.01, N·L)` banding;
- a painted vertex-color threshold offset;
- a per-character light vector;
- smoothstep-banded specular for a toy-plastic shine;
- a Fresnel rim (rimAmount 0.6, threshold 0.2).

Bloom via `UnrealBloomPass` costs 5 mip levels of separable blur, so budget it at reduced resolution.

### Cited Findings
- **MeshToonMaterial**
  - It uses a `gradientMap` for toon shading, and you must set the texture's `minFilter` and `magFilter` to `NearestFilter` — [three.js docs: MeshToonMaterial](https://threejs.org/docs/pages/MeshToonMaterial.html)
  - Tutorials build a 4-step ramp (e.g., #444, #888, #bbb, #fff) or a `DataTexture` with nearest filtering — [sbcode MeshToonMaterial (search excerpt)](https://sbcode.net/threejs/meshtoonmaterial/)
- **OutlineEffect (inverted hull)**
  - It renders the scene normally, then again with `BackSide` outline materials whose vertices are displaced along normals. Multiplying by `pos.w` keeps the width uniform on screen.
  - Defaults: `defaultThickness: 0.003`, `defaultColor: [0,0,0]`, `defaultAlpha: 1.0`, `defaultKeepAlive: false`. Per-material overrides go in `userData.outlineParameters`.
  - Shadow maps are disabled during the outline pass. Cached outline materials are pruned after 60 unused frames.
  - Source: [three.js OutlineEffect.js](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/effects/OutlineEffect.js)
- **Inverted hull cost:** it doubles draw calls per outlined object — [search excerpt from outline/toon-shading articles](https://moonjump.com/game-dev-mechanics-toon-shading-cel-shading-how-it-works/); consistent with OutlineEffect's two-pass render above.
- **Post-process outlines**
  - A common approach combines scene normals and depth for edge detection. A more robust variant writes per-surface IDs as a vertex attribute to a buffer and marks an edge wherever neighboring pixels' IDs differ.
  - Source: [Omar Shehata: Better outline rendering using surface IDs with WebGL (search excerpt)](https://omar-shehata.medium.com/better-outline-rendering-using-surface-ids-with-webgl-e13cdab1fd94)
- **Why GG Xrd chose inverted hull over post-process:** it previews exactly in the modeling tool and gives per-vertex width control through vertex colors, including erasing lines — [Motomura GDC 2015 handout](https://www.ggxrd.com/Motomura_Junya_GuiltyGearXrd.pdf)
- **Custom toon shader in Three.js (Roystan-style)** — source for this group: [Maya Nedeljković Batić: Custom Toon Shader in Three.js](https://www.maya-ndljk.com/blog/threejs-basic-toon-shader)
  - Light/shadow band: `smoothstep(0.0, 0.01, NdotL)`.
  - Specular: `pow(NdotH * lightIntensity, 1000.0 / uGlossiness)` banded with `smoothstep(0.05, 0.1, spec)`.
  - Rim: `rimDot = 1 - dot(viewDir, normal)`, masked by `pow(NdotL, rimThreshold)`, with **rimAmount 0.6** and **rimThreshold 0.2**.
  - Ambient comes from three.js's `ambientLightColor`.
  - Received shadows use `#include <shadowmap_pars_fragment>` and `getShadow()`, multiplied into NdotL.
- **GG Xrd shading controls to port** (see section 3):
  - a vertex-color threshold offset;
  - a per-character light direction uniform instead of scene lights;
  - a shadow tint texture (shaded color = base × tint);
  - hand-edited normals, especially on faces;
  - no normal maps.
  - Source: [Motomura GDC 2015 handout](https://www.ggxrd.com/Motomura_Junya_GuiltyGearXrd.pdf)
- **UnrealBloomPass cost**
  - The documented example constructor is `new UnrealBloomPass(resolution, 1.5, 0.4, 0.85)`, i.e. strength 1.5, radius 0.4 and luminance threshold 0.85. The strength parameter defaults to 1, and radius must be in [0,1].
  - Internally it uses `nMips = 5` levels, starting at half resolution, with separable blur kernel sizes `[6, 10, 14, 18, 22]` and a high-pass `smoothWidth` of 0.01.
  - Source: [three.js UnrealBloomPass.js](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/postprocessing/UnrealBloomPass.js)

### Inferences
- **Recommended pipeline for a toy-robot look in the browser**
  - **Characters:** a custom `ShaderMaterial` extending the toon shader above.
    - Use a 2-tone band, plus an optional third band for toy-plastic "core shadow".
    - Paint a vertex-color R channel as a shadow-threshold offset (GG Xrd).
    - Add a sharp, small specular highlight via smoothstep, with high glossiness, for plastic.
    - Add a thin Fresnel rim in the team color.
    - Use a per-robot light vector uniform so every robot reads well regardless of arena lighting.
  - **Outlines:** use inverted hull (OutlineEffect-style, screen-space width via `pos.w`) for robots, with thickness controlled by a vertex color. Use cheaper or no outlines for the environment, or a single post-process normal/depth or ID edge pass for the environment only.
  - **Hard-edged meshes:** mecha have hard edges, and a plain hull shows gaps along split normals. Bake smoothed normals into a separate attribute used only for hull expansion. This is a widely used fix, though no source was retrieved here.
- **Performance budget**
  - Inverted hull doubles character draw calls; with around 10–20 robots on screen that means 20–40 extra draws.
  - Mitigate by merging each robot's parts into one or a few meshes, using `InstancedMesh` for identical projectiles and effects, and skipping outlines on distant or tiny objects.
  - Bloom adds roughly 12+ full-screen and fractional-screen passes (5 mips × 2 blur directions + high-pass + composite).
  - For low-end devices, render bloom at reduced resolution, raise the threshold so only emissive VFX (beam sabers, muzzle flashes, booster flames) bloom, or make it a quality toggle.
- **Consistency with hitstop and impact frames.** Implement post-process "impact frames" and a super-flash darken in the same composer chain as bloom, to avoid extra passes.

### Gaps
- No benchmark data for Three.js outline or bloom costs on mobile or integrated GPUs; the performance numbers above are architectural estimates.
- I did not retrieve three.js forum threads on smoothed-normal hulls or on the `EffectComposer` vs. `pmndrs/postprocessing` library performance comparison.
- Toy-plastic material references (e.g., stylized specular in Nintendo or Level-5 games) were not sourced.
- No retrieved source covers WebGPU (TSL) toon or outline equivalents in current three.js.
