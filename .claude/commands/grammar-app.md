# grammar-app

Build one **grammar component** (grammar-1 or grammar-2) **teacher slideshow** for a single unit, using all locked LEEA grammar patterns. Reads from the planner PDF + the unit's `grammar.json` + the Student Book + the Workbook Answer Key. Personalizes samples with Leo's interests (soccer + movies — see "Leo personalization" below).

> **Scope note.** This skill builds the **teacher slideshow only**. The Leo learner app is a separate, later session — the grammar-app structure for the Leo side will be locked after grammar-2's Leo app is built (mirroring how vocab-app was locked only after vocab-2 proved the pattern).

> **Naming note.** This single skill handles both grammar-1 and grammar-2 — choose with the third arg. Each grammar component teaches a different grammar point; only the architectural patterns (spine, no-leaps, mini-games for academic vocab, JS safety) are shared.

## Usage

```
/grammar-app <course-path> <unit-number> <grammar-1|grammar-2>
```

Examples:

```
/grammar-app english/our-world/level-4 u8 grammar-1
/grammar-app english/our-world/level-4 u8 grammar-2
/grammar-app english/our-world/level-5 u3 grammar-2
```

## What this skill does

1. **Verifies prerequisites**
   - `grammar.json` for the unit must already exist. There is no `/grammar-unit-scanner` skill (unlike `/vocab-unit-scanner`) — if it's missing, scan the source PDFs (planner + workbook answer key) and build it manually, matching an existing unit's `grammar.json` schema (see Unit 7/8 for reference), including a full `examples[]` array with a `highlight` entry for every sample sentence in both `tab1_samples` and `tab2_levelup.mixed_samples` — see `docs/content-model.md`.
   - **⚠️ If you build grammar.json from scratch**, you MUST also wire it into `src/data/reference.ts` in the same commit — three edits: (1) import, (2) extend `UnitGrammarPoint` union, (3) spread into `grammarPoints` array + add filter export. See `docs/grammar.md` Step 3 for the exact code. Missing any of the three edits causes the Grammar section to silently not appear in the reference tree with no build error or warning.
   - For grammar-1: the chosen grammar point must be `vocab1WordIds`-aligned (uses words/structures from V1). For grammar-2: aligned with V2 + sometimes G1.
   - `docs/lesson-plans/<course-path>/index.json` must have a `pdf_offset` and the section page range for the chosen component
2. **Reads sources** (the more, the richer the deck):
   - `docs/lesson-plans/<course-path>/planner.pdf` pages for the chosen grammar section (typically 4 pages for grammar-1, 2 pages for grammar-2)
   - `docs/lesson-plans/<course-path>/supporting/*sb*` (Student Book) — for the grammar box + the dialogue captions in the spread
   - `docs/lesson-plans/<course-path>/supporting/*ak-wb*` (Workbook Answer Key) — for the join-the-sentences items and any sort/match items
   - `content/.../<unit>/vocabulary.json` and `content/.../<unit>/grammar.json` — for the official cards and to cross-link vocab callbacks
3. **Writes a design doc FIRST**, then generates the slideshow:
   - **Design doc** (mandatory before any HTML): `docs/lesson-plans/<course-path>/<component>.design.md`
   - **Teacher slideshow**: `public/lessons/<lesson-id>.html` (~42 slides, custom shell, bespoke per-slide interaction, spine-driven)
4. **Registers the lesson** (the JSON typically already exists from a prior draft — update `slideCount`, `subtitle`, and `objectives` if needed):
   - `content/.../<unit>/lessons/<component-key>.json` (teacher) — mode: `teacher`, status: `draft`
5. **Validates**
   - `npm run validate:content` (teacher/learner pairing rule enforced — fine if the Leo app already exists from an earlier draft)
   - `npx tsc --noEmit`
   - `node` syntax-check on the inlined `<script>` (catches `\\'` escape errors before they ship — broke Grammar 1 once)
6. **Commits** with a clear message and **pushes** to the working branch. Does NOT auto-create a PR — Leaneritan reviews + merges.

## Lesson ID convention

```
<course-prefix>-l<level>-u<unit>-<component>
```

Examples: `ow-l4-u8-grammar-1`, `ow-l4-u8-grammar-2`, `ow-l5-u3-grammar-1`.

## Locked patterns the skill must follow

### Teacher slideshow shell

Reference: `public/lessons/ow-l4-u8-grammar-1.html` (42 slides, FC Leo United spine, single script block).

- 1920×1080 deck with scaling wrapper (`#scaler` / `#deck` / `.slide.active` pattern from vocab-2/grammar-1)
- Nav bar with prev/next/notes/progress · right-side teacher notes panel (press **N**)
- Per-unit theme colors at the top of `<style>`. For Our World use the level color from `docs/design-decisions.md` (L1 green · L2 teal · L3 blue · L4 purple · L5 orange · L6 red). **In Unit 8 specifically:** green primary, blue accent (not the inverse — earlier drafts got this wrong)
- **Every activity slide has a bespoke interaction** (DO not REVEAL). Default mechanics:
  - watch-it-happen sentence transformations (see "no leaps" below)
  - tap-to-choose with green/red feedback
  - chip → slot sentence builders
  - tap-to-fix (error spotter — find and tap the wrong word)
  - sort into zones (`pickChart('classification sort', { tiles, zones })` — picker resolves to `buildDndSorter`)
  - embodied vocab mini-game per academic/content word (the word *does* its meaning)
  - tap-to-label parts (PERSON / who / verb phrase) with color-coded chips
- **One allowed reveal**: the Grammar Box / TR audio slide. Mark it with the TR code from the planner (e.g. `TR 8.4`)
- Slide flow follows the Lesson Planner phases verbatim: Warm Up → Present → Grammar in Depth → Practice → Apply → Extend → Recap → Wrap Up → Formative
- Final slide is **Mark Done** that writes to `leea.lessonProgress.v1` (same record shape as `lessonProgress.ts`). No save/restore on the teacher deck — Neritan marks done from the teacher dashboard
- Source pill at the bottom of every chart / rule / sample slide citing: `📖 Book p.X · TR Y.Y` (and `Workbook p.Z` where the item came from the AK)

### THE SPINE — mandatory throughline (this is the make-or-break rule)

Every grammar deck has **ONE spine** — a single throughline that runs through all ~42 slides. The spine must clear four tests:

1. **Load-bearing.** The target grammar must be the ONLY tool that solves the problem on screen. Without producing or parsing the structure, Leo cannot progress the spine.
2. **Accumulates.** Clues / slots / recruits / pieces stack across the deck. The spine state is visible and grows — never a buffet of unrelated drills.
3. **Earned payoff.** The final slide(s) resolve the spine with a reveal/celebration the grammar made possible.
4. **Threads the LP beats verbatim.** The LP's Practice items, Recap joins, Apply survey, and Wrap Up photos must be the **literal mechanism** of the spine — not decorative drills the spine sits beside.

Calibration: at the level of *"FC Leo United — Leo is the manager building a Champions League squad; each who-clause fills one of 16 tactical-board slots; the LP's Practice items 1-5 = staff hires, the Apply survey = starting XI, Recap joins = bonus staff, formative check = final 4 recruits; payoff = the full XI on the Bernabéu pitch"* (Grammar 1, PR #76). Match that bar with your own idea — do not default to a generic mystery / quiz / sort buffet.

### THE TWO BARS — detailed + creative

Hit both at once. Most decks trade one for the other; don't.

- **Detailed = no leaps.** When a sentence transforms, the learner must **watch it happen**, never cut to the finished answer. Each join uses 3 step buttons (e.g. *erase period · erase pronoun · insert who*). The tricky case (e.g. middle-position) is shown wrong first with a red shake, then re-positioned. Verb agreement is a toggle Leo watches the verb-s appear and disappear. There must be no slide where an A1-A2 learner thinks "where did that come from?"
- **Creative = grammar is load-bearing.** A soccer photo stapled to a pronoun swap is not creative — it's the same drill in a jersey. It is creative when the structure is the only tool that solves the problem on screen.

### SCOPE DISCIPLINE — teach ONLY what the LP teaches (people-only style)

This is the #1 thing decks get wrong. Each grammar point has a **strict scope** defined by the LP:

- Grammar 1 (Unit 8, *who* for people): **PEOPLE ONLY.** No *which*, no *that* as relative pronouns. No who-vs-which/that sorting. No introduction of *whose*. (This caused both a slideshow rebuild and an app cleanup pass on Grammar 1.)
- Grammar 2 (Unit 8, direct + indirect objects with *give/show/send/buy*): **only the verbs the LP lists.** Do not preview passive voice, do not introduce pronouns the LP hasn't shown yet.

**Rule:** if a structure is not in the LP for this lesson, it is NOT in the deck — not in any MCQ distractor, not in any sort tile, not in any error-spotter case. The slideshow and the Leo app must agree on scope.

### Embodied mini-games for academic + content vocabulary

Academic Language and any newly-introduced Content Vocabulary are **presented through a mini-game**, never a flat card. Apply the Tier rule:

- **Academic words** (e.g. clause, contraction) → embodied "the word performs its meaning" mini-game
- **Newly-introduced Content Vocabulary** (e.g. trilobite) → its **own embodied mini-game** — tight, not a real-estate hog
- **Recycled words** (already taught in V1/V2 etc.) → brief refresh card is fine

Reference mini-game patterns from Grammar 1 (`ow-l4-u8-grammar-1.html` s7-s9):
- 📦 **clause** — drag subject-chip + verb-chip into the clause-box; box closes and labels itself CLAUSE
- 🤝 **contraction** — two pills (`she` + `is`) magnet-snap with an apostrophe → `she's`. Same for `who + is = who's`. Pre-loads any later item that uses the contraction.
- 🦗🪨 **trilobite** — brush a rock 5 times to reveal the imprint (embodied, tight; ties to the LP photo on p.136 Morocco)

Assign **one emoji per word at the start** and use it on every slide the word appears.

### Watch-it-happen sentence transformations

Every join-the-sentences slide uses the 3-step button pattern. Reference (Grammar 1 s12-13 + s19-23):

```
[Sentence A]. [Pronoun] [Sentence B].
                                       ↓ Step 1: tap to erase the period
[Sentence A] [Pronoun] [Sentence B].
                                       ↓ Step 2: tap to erase the pronoun (or contraction)
[Sentence A] _______ [Sentence B].
                                       ↓ Step 3: tap to insert the target structure
[Sentence A] who [Sentence B].
```

Buttons stay visible and disabled after firing. The final form lands in a `.join-final` box with a ✅. Pair each LP Practice item with a "recruit-toast" (or whatever your spine's reward unit is) when the third step fires.

### Wrong-first for tricky cases

When the LP flags a tricky case (e.g. middle-*who*, plural-vs-singular agreement), the deck shows the natural wrong attempt FIRST with a red shake, THEN reorders / corrects. The error is the teacher — the learner watches the fix. Reference: Grammar 1 s15.

### LP items verbatim → spine slots (DEFAULT)

The LP's Practice items, Recap joins, Apply survey items, and Wrap Up photos must appear **verbatim** in the deck, each mapped to ONE spine slot. Do not rewrite the LP — only personalize SAMPLES (extra sentences, swap chips, Apply scenarios). Reference: Grammar 1 mapped all 5 Practice items + both Recap joins + the 6 survey questions to FC Leo United slots.

### Soccer-overlay variant — when Leaneritan explicitly approves it

For specific decks, Leaneritan may direct: *"copy the activities and make them about soccer — same structure, soccer-led content."* This OVERRIDES the verbatim rule above for that build. Locked in for Unit 8 Grammar 2 (`docs/lesson-plans/english/our-world/level-4/grammar-2.design.md` "Soccer-overlay note").

**When the soccer-overlay variant is approved:**
- LP activity *types* preserved exactly (rewrite-the-sentence keeps that mechanic; game-board with coin token keeps that; list-3-gifts keeps the frame).
- LP sentence *content* gets rewritten into a soccer scenario that maps 1-to-1 onto the LP item:
  - LP *"My cousin sent a dinosaur book to him"* → *"A fan sent a Real Madrid scarf to Bellingham"* (same grammar, soccer surface).
  - LP toy-dinosaur-to-Aziz Preteach → toy-ball-to-Salah Preteach.
  - LP classroom-pencils Wrap Up → dressing-room boots/playbook/towels exchange.
- Density mandate stays in effect — every concept slide carries 3-5 sample sentences, Practice has 4 LP items + 4 bonus soccer items, Apply has 8 rolls, etc.
- The design.md MUST include a "Soccer-overlay note" section explicitly calling out the override and showing the LP-item → soccer-rewrite mapping table so reviewers can verify the LP shape was preserved.

**Default unless told otherwise: verbatim.** Soccer-overlay needs explicit user approval per build.

### Soccer freshness (web-search at build time)

- **Web-search current 2025-26 stats and squads** — do not rely on memory. Transfer windows shift between seasons.
- Vary players across **3+ leagues**: Premier League, La Liga, Bundesliga, Ligue 1, Serie A, Champions League, World Cup. Five leagues is the target (PL + La Liga + Serie A + Ligue 1 + Bundesliga is what Grammar 1 hit).
- Cross-check player hobbies against the unit's vocabulary cards (e.g. Bellingham collects Marvel comic books, Salah collects Egyptian football memorabilia) so the surface stays coherent across components (Vocab 2 → Grammar 1 → Reading).

### Emoji safety

✅ and directional emojis (← → ↓) belong **only** in feedback text — never inside answer-choice options (the emoji-giveaway bug).

### JavaScript safety contract (locked — these have bitten this project)

- **ONE `<script>` block** in the file. Multiple tags break function references at build time.
- All sentence content in **backtick template strings** OR **HTML entities** (`&apos;`) so apostrophes (`it's, they're, who's`) are safe.
- **Never escape apostrophes inside `onclick`.** Use a `data-text` attribute + a helper that reads `this.dataset.text`.
- **Never use `confirm()` anywhere.** Use a two-tap "armed" pattern for destructive actions.
- Wrap any DOM read/write in `try/catch` with a null check before touching the element.
- The mandatory `node -e` script-check must parse cleanly before commit:
  ```bash
  node -e "$(awk '/<script>/{f=1;next}/<\/script>/{f=0}f' public/lessons/<lesson-id>.html)"
  ```
  Runtime `window is not defined` / `document is not defined` is the GREEN signal (the JS parsed; it just can't run DOM in Node). A `SyntaxError` is the red signal.

## Leo personalization (mandatory in samples)

Same rule as `/vocab-app`:

- **Soccer leagues** — pull samples from at least 3 of these per lesson: Premier League, La Liga, Bundesliga, Ligue 1, Serie A, Champions League, World Cup
- **Current players** (2025–26): Haaland (Man City), Salah (Liverpool), Saka (Arsenal), Bellingham (Real Madrid), Lamine Yamal (Barcelona), Vinicius Jr. (Real Madrid), Pedri (Barcelona), Kane (Bayern Munich), Musiala (Bayern Munich), Wirtz (Bayern Munich), Kvaratskhelia (PSG), Cherki (PSG), Dembélé (PSG), Lautaro (Inter), Palmer (Chelsea), Trent (Liverpool/Madrid), Donnarumma (PSG), Theo Hernández (AC Milan), Rodri (Man City), Foden (Man City), Saliba (Arsenal), Van Dijk (Liverpool). Ronaldo and Messi allowed when genuinely relevant (e.g. World Cup, age-as-dinosaur callback).
- **Movies** — Dark Knight (Batman), Avatar (Jake Sully, Neytiri), John Wick, Marvel (Iron Man, Spider-Man, Thor, Captain America), Ice Age (Sid, Manny, Diego)
- **Always web-search current stats** when a sample names a specific player + club
- **Never overwrite the LP's verbatim content** (objectives, Grammar Box, the official Practice items, sample readings, Recap joins). Soccer/movies show up only in extra sample sentences, swap chips, Apply scenarios, photo cards, and Extend prompts.

## Step-by-step

### Step 0 — Confirm prerequisites + read sources

```bash
test -s content/subjects/english/courses/<course>/level-<n>/unit-<n>/grammar.json
test -s docs/lesson-plans/<course-path>/index.json
```

If `grammar.json` is missing for the unit, stop and tell Leaneritan it needs to be built manually first (no `/grammar-unit-scanner` skill exists) — scan the source PDFs and build it matching an existing unit's schema, including full `examples[].highlight` coverage per `docs/content-model.md`.

Use the Read tool with the `pages` parameter (max 20 per call). Combine the absolute page from `pdf_offset + section.start` to `pdf_offset + section.end`.

Read:
1. The planner.pdf pages for the chosen component (grammar-1 = 4 pages: Warm Up + Present + Practice + Apply/Extend/Wrap Up/Recap; grammar-2 = 2 pages)
2. The Student Book pages for the same spread — captures the Grammar Box wording verbatim + the dialogue context + the photo (the photo often is the Content Vocab callback, e.g. trilobite)
3. The Workbook AK pages — usually carries Join-the-Sentences items and a sort/label exercise tied to the grammar point
4. The unit's vocabulary.json + grammar.json — for the official cards and for cross-component personalization (e.g. recycling a V1 word into a Practice item)

### Step 1 — Write the design doc FIRST (mandatory before any HTML)

File: `docs/lesson-plans/<course-path>/<component>.design.md`

The design doc must contain:

1. **The lesson** — course, level, unit, spread, LP page numbers, objective verbatim, target pattern in one line, Academic Language list, Content Vocabulary list, recycled words list, **hard scope line** (the "people only" / "give-show-send-buy only" / etc. constraint)
2. **The spine** in 3-4 sentences — what it is, why it's load-bearing, why it accumulates, what the payoff is
3. **LP → spine mapping table** — every LP item (Practice, Recap, Apply survey, Wrap Up) mapped to a spine slot
4. **The two bars proof** — short paragraph explaining why this spine clears Detailed (no leaps) + Creative (load-bearing)
5. **Emoji map** — one emoji per Academic / Content / recycled word with its mini-game one-liner
6. **No-leaps proofs** — the sentence transformations shown step-by-step in pseudo-text (so reviewers can audit before the HTML lands)
7. **42-slide table** — `# | Slide | LP beat it serves | Spine role + the prior step that makes it understandable (the "no-leaps" proof)`
8. **JS safety contract** — short list (single script block, backticks, data-text, no confirm, try/catch)
9. **Soccer freshness snapshot** — the current 2025-26 player roles used in this deck, with leagues represented

Do **not** wait for approval — commit the design file and proceed to build in the same pass.

### Step 2 — Build the slideshow

File: `public/lessons/<lesson-id>.html`

Follow the design table row for row. Target ~42 slides. Single script block. Source pills on every rule/sample slide.

### Step 3 — Update the lesson JSON (if it exists from a prior draft)

File: `content/subjects/english/courses/<course>/level-<n>/unit-<n>/lessons/<component-key>.json`

Update `slideCount`, `subtitle` (include spine name + scope discipline note), and `objectives` (remove any objectives that contradict scope — e.g. Grammar 1 had "distinguish who from that/which" which violated scope and had to be removed).

### Step 4 — Validate

```bash
npm run validate:content
npx tsc --noEmit
node -e "$(awk '/<script>/{f=1;next}/<\/script>/{f=0}f' public/lessons/<lesson-id>.html)"
```

All three must pass before commit.

### Step 5 — Commit and push

Commit message format:

```
Add Unit <n> <component> teacher slideshow — <spine name>

Spine: <one-line>.
42 slides. Single script block. Scope: <people-only / give-show-send-buy-only>.
LP items verbatim. Embodied mini-games for: <academic words>.

Leagues represented: Premier League · La Liga · ...
Movies referenced: ...

Validation: validate:content + tsc + node script-check all pass.

https://claude.ai/code/session_<id>
```

Push to the current working branch. Do NOT create a PR — Leaneritan reviews + merges.

## Output checklist

- [ ] Design doc at `docs/lesson-plans/<course-path>/<component>.design.md` — spine + emoji map + slide-by-slide table
- [ ] Teacher slideshow at `public/lessons/<lesson-id>.html` (~42 slides, single script block, bespoke per-slide interaction)
- [ ] **The spine is load-bearing** — every LP item is a slot in the spine, not a decorative drill
- [ ] **No leaps** — every sentence transformation has 3+ step buttons; tricky cases shown wrong-first
- [ ] **Scope discipline** — the deck contains NO structure outside the LP's scope for this lesson (no which/that if grammar-1 is who-only; no extra verbs if grammar-2 is give/show/send/buy)
- [ ] **Academic + content vocab as mini-games** — each gets its own embodied game, not a card
- [ ] **LP items verbatim** — Practice / Recap / Apply / Wrap Up sentences exactly as written
- [ ] Soccer samples from 3+ leagues (target 5); current 2025-26 stats web-searched
- [ ] Teacher JSON updated: `slideCount`, `subtitle`, `objectives` (no scope-violating objectives)
- [ ] `npm run validate:content` ✅
- [ ] `npx tsc --noEmit` ✅
- [ ] `node -e "$(awk '<script> extract)"` ✅ (catches `\\'` escape bugs)
- [ ] Commit pushed; no auto-PR

## Important constraints

- Never modify `src/lib/supabase.ts`
- If this skill ever registers its own learner JSON (rather than folding grammar practice into an existing vocab app), read `docs/supabase.md` first — `learner_progress` (Leo's app) and `teacher_lesson_progress` (the parent's checklist) are separate tables that only stay in sync automatically if the learner `component` matches the teacher `component` once `-app` is stripped
- Never override the LP's verbatim content (objectives, Grammar Box, official Practice items, Recap joins)
- Japanese drafts stay `needsReview: true` until the parent confirms
- Teacher slides have NO save/restore (Neritan marks done from the dashboard); the Leo app (separate skill, later) follows the four save/restore rules
- Don't introduce future grammar (the #1 source of deck rebuilds — see Grammar 1's which/that contamination)
- The `node -e` script-check is mandatory — Grammar 1 Leo app shipped broken once because three `\\'` escapes blew up the whole `<script>` and made the app unclickable. Don't repeat that bug
- The design doc is mandatory and lands BEFORE the HTML, not after — it forces the spine to be defended before 2000 lines of HTML get written against the wrong throughline
