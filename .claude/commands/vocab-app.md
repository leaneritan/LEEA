# vocab-app

Build one **vocab component** (vocab-1 or vocab-2) end-to-end for a single unit — the Neritan teacher slideshow + the paired Leo learner app — using all locked LEEA vocabulary patterns. Reads source content from the planner PDF + the unit's `vocabulary.json` + the Grammar / Student Book workbook PDFs in `supporting/`. Personalizes samples with Leo's interests (soccer + movies — see "Leo personalization" below).

> **Naming note:** this is the per-lesson app builder. The companion skill `/vocab-unit-scanner` produces the unit's `vocabulary.json` and must run first. Vocab-1 and vocab-2 share the locked structure, so this single skill handles both — choose which with the third arg.

## Usage

```
/vocab-app <course-path> <unit-number> <vocab-1|vocab-2>
```

Examples:

```
/vocab-app english/our-world/level-4 u8 vocab-1
/vocab-app english/our-world/level-4 u8 vocab-2
/vocab-app english/our-world/level-5 u3 vocab-1
/vocab-app english/joyful-work/year-2 u4 vocab-2
```

## What this skill does

1. **Verifies prerequisites**
   - `vocabulary.json` for the unit must already exist (run `/vocab-unit-scanner` first if it doesn't)
   - For vocab-1: `vocab1WordIds` must be non-empty. For vocab-2: `vocab2WordIds` must be non-empty
   - `docs/lesson-plans/<course-path>/index.json` must have a `pdf_offset` and the section page range for the chosen component
2. **Reads sources** (the more, the richer the deck):
   - `docs/lesson-plans/<course-path>/planner.pdf` pages for the chosen vocab section
   - `docs/lesson-plans/<course-path>/supporting/*sb*` (Student Book) — for the original lesson-spread context and any photo/dialogue captions
   - `docs/lesson-plans/<course-path>/supporting/*ak-wb*` (Workbook Answer Key) — for additional exercise items
   - `content/.../<unit>/vocabulary.json` — for the official word data (id, emoji, meaning, example, Japanese)
3. **Generates two HTML files** following the locked patterns below:
   - **Teacher slideshow**: `public/lessons/<lesson-id>.html` (~100 slides, custom shell, bespoke per-word mini-games)
   - **Leo learner app**: `public/learn/<lesson-id>.html` (13-tab structure, vocab1 shell)
4. **Registers both lessons**:
   - `content/.../<unit>/lessons/<component-key>.json` (teacher) + `<component-key>-learner.json` (learner)
   - Updates `src/data/lessons.ts` to import + add to the `lessons[]` array
5. **Validates**
   - `npm run validate:content` (teacher/learner pairing rule enforced)
   - `npx tsc --noEmit`
   - `node` syntax-check on the inlined `<script>` (catches `\\'` escape errors and similar before they ship)
6. **Commits** with a clear message and **pushes** to the working branch. Does NOT auto-create a PR — Leaneritan reviews + merges.

## Lesson ID convention

```
<course-prefix>-l<level>-u<unit>-<component>
```

Examples: `ow-l4-u8-vocab-1`, `ow-l4-u8-vocab-2`, `ow-l5-u3-vocab-1`.

## Locked patterns the skill must follow

### Teacher slideshow shell (custom per word — DO NOT REVEAL)

Reference: `public/lessons/ow-l4-u8-vocab-1.html` (103 slides, ~250 onclick handlers) and `public/lessons/ow-l4-u8-vocab-2.html` (34 slides — same density adapted for 5 words).

- 1920×1080 deck with scaling wrapper. Nav bar with prev/next/notes/progress. Right-side teacher notes panel (press **N**).
- Per-unit theme colors at the top of `<style>`. For Our World use the level color from `docs/design-decisions.md` ("Levels use one stable color progression: L1 green · L2 teal · L3 blue · L4 purple · L5 orange · L6 red").
- **Every activity slide has a bespoke interaction** (DO not REVEAL). Default mechanics:
  - tap-to-choose with green/red feedback
  - drag-to-build / tap-to-build a sentence (use chip → slot UI)
  - tap-to-fix (find and correct the mistake)
  - sort into zones (`buildDndSorter` from `public/teach/components/charts.js`)
  - embodied vocab game per word (the word *does* its meaning)
  - tap-to-label parts (subject / verb / target word)
- **One allowed reveal**: the Grammar Box / "Listen and Read" audio slide. Mark it with the TR code from the planner.
- Slide flow follows the Lesson Planner phases verbatim per `docs/components.md` vocab-1: Warm Up → Present → Practice → Apply → Extend → Wrap Up → Recap. The Present section is the heavy lift — bespoke mini-game per word.
- Final slide is **Mark Done** that writes to `leea.lessonProgress.v1` (same record shape as `lessonProgress.ts`). No save/restore on the teacher deck — Neritan marks done from the teacher dashboard.
- Source pill at the bottom of every chart / rule / sample slide citing both: `Student Book p. X / TR Y.Y · Workbook p. Z` (per the v4 grammar-1 rule in `docs/components.md`).

### Per-word Present slides — MANDATORY right-panel mini-game (one per target word)

This is the single most important rule for vocab decks. Every target word gets its own dedicated Present slide with a two-column layout:

- **Left column** (40% width): the word card (with a small click-feedback animation), the click-to-reveal button, and the revealed content (definition + example + Dad/Leo dialogue).
- **Right column** (60% width): a **bespoke mini-game with a clear goal, a running score counter, and a win message**. NOT a click-feedback. NOT a reveal. NOT a static info box. A real interactive challenge the learner plays.

A mini-game is anything with:
1. A goal stated up front ("Tap all 6 bugs", "Stack the bones in order", "Match 4 mascots to 4 years")
2. Live score / progress feedback (`X / N` counter)
3. A win state with a celebration message
4. Wrong-answer feedback (shake + miss counter, or reset)

Reference mini-game patterns (from `ow-l4-u8-vocab-2.html` s6-s10):
- **Catch-the-X grid** — N right answers + M distractors in a tile grid, tap the right ones (e.g. bug → 🐞🐝🦋 vs ⚽📚🪨)
- **Hero Hunt / Pick-the-set** — same grid but each correct tap reveals a name (e.g. comic book → 🕷️ Spider-Man, 🦇 Batman, 🛡️ Captain America)
- **Sequence builder** — 5 ordered slots + a bank of choices; correct order locks, wrong shakes (e.g. dinosaur → stack the T-Rex bones)
- **Multi-round classification** — emoji shown, 3 MCQ options, advance through 3 rounds (e.g. fossil → name what you dug up: ammonite / dinosaur bone / trilobite)
- **Pair match** — two rows, tap one from each, correct pair locks (e.g. stuffed animal → 4 World Cup mascots ↔ 4 years)
- **Embodied / "do the word"** — the mechanic acts out the word's meaning (dig 5 times to reveal a fossil; click to make the dino ROAR; hug the stuffed animal)

A click-to-reveal animation on the word card (spin, flip, shake) is fine as flavour, but it is NOT the mini-game. The mini-game lives in the right column and the learner must actually play it.

Each per-word slide must include — below the mini-game — a compact "How do we use" box (2 bullets max) and a source pill citing Book p.X · TR Y.Y. No oversized emoji decoration cards, no standalone soccer banners (fold the soccer reference into Dad/Leo dialogue or the "How do we use" bullets).

Add a CSS block `.mg-wrap / .mg-head / .mg-grid / .mg-btn / .mg-score / .mg-win / .mg-source` (see vocab-2 reference) — keep classes named the same across decks so future skills can reuse the patterns.

Verify before commit: open the deck, click through s_present_1 … s_present_N. Each must have a working game with a score going up and a win message firing. If any per-word slide is just a reveal + info box → it is not done.

### Leo learner app — 13 tabs (LOCKED via vocab-1)

Reference: `public/learn/ow-l4-u8-vocab-1.html` (1596 lines, 13 tabs).

Vocab1 tab strip — exact names and order:

| # | Tab | What Leo does |
|---|---|---|
| 0 | 📚 Academic | Flashcards (practice + quiz mode) for the unit's academic + related words |
| 1 | 🔥 Warm Up | Hobby/topic chips + a yes-no question or two |
| 2 | 🎯 Present | Per-word dialogue card with Dad bubble + yes-no check |
| 3 | 🃏 Flashcards | Tap-to-flip flashcards for the target vocab list |
| 4 | 🧠 Sort | Drag-to-sort using `buildDndSorter` (e.g. hobby/not, alive/not) |
| 5 | 📖 Reading | Short reading with blanks Leo fills from a word bank |
| 6 | 📝 Practice | MCQ practice items with right/wrong feedback |
| 7 | 🔤 Unscramble | Scrambled-letter word puzzles, type the word |
| 8 | 🔗 Match | Match cards (word → meaning, or word → image) |
| 9 | ☀️ Apply | Sunshine organizer using `buildSunshine` from `public/learn/components/sunshine.js` — Leo writes a sentence per ray using one target word each |
| 10 | 🎭 Wrap Up | Flip-and-answer review or self-eval |
| 11 | ✅ Quiz | Scored MCQ formative quiz (10+ items) — score saved to `score` key per Rule 2 |
| 12 | ⚽ Dribble! | Soccer MCQ with goal counter + dribbling defenders (8 shots) |

Adding a new tab type is forbidden in vocab-app — they belong in component-specific skills. If a unit's vocab has a genuinely novel mechanic, add it as a sub-activity *within* the existing tab.

### Shell + save/restore (Leo app)

Match `public/learn/ow-l4-u8-vocab-1.html` shell:

- Header (component-toned background) with logo + title + subtitle + progress pill `X / 13 done`
- Horizontal scrollable tab nav at top with check marks on completed tabs
- `tab-content` body with `tab-body` (max-width 800, centered) and `tab-footer` (Redo on left, Mark Complete on right)
- All four save/restore rules per `AGENTS.md`:
  - **Rule 1**: `markComplete(tab)` writes `tab-{i}-done` key
  - **Rule 2**: Quiz tab writes `{score, total, percent, answers, done}` to `score` key
  - **Rule 3**: Each tab has a `TAB_RESTORE[i]` function that replays prior answer state — never restart a completed activity from zero
  - **Rule 4**: Two-tap "armed" Redo pattern (first tap arms 3 s, second tap clears keys and re-inits)
- Storage contract per `AGENTS.md`:
  ```text
  SAVE_PREFIX:     leea-<level>-<unit>-<component>-      (e.g. leea-4-8-vocab-2-)
  moduleCount:     13
  moduleKeyFormat: tab-{i}-done                          (0-based)
  scoreKey:        score                                  (Tab 11)
  homeworkId:      leo-<level>-<unit>-<component>        (e.g. leo-4-8-vocab-2)
  ```

### Reusable components to use

| Helper | Where | Tab |
|---|---|---|
| `buildDndSorter` | `public/teach/components/charts.js` | Tab 4 Sort |
| `buildSunshine`  | `public/learn/components/sunshine.js` | Tab 9 Apply |
| `buildWordWeb`   | `public/teach/components/wordweb.js` | Optional in Wrap Up or Extend if the vocab list themes it |

Load each via `<script src="…">` in `<head>`. Don't inline-duplicate logic that already lives in these components.

### Flashcards Tab + Academic Tab — MANDATORY Practice + Quiz dual mode (PR #77 lock)

Tab 0 (Academic) AND Tab 3 (Flashcards) must implement the `flashcard-shell` pattern from `docs/chart-templates.md`. Per Leaneritan: "Flash card just like academy needs quiz."

**Required pieces (inline in the Leo app — no external helper yet, extraction pending):**
- `.fc-controls` strip with two `.mode-btn` buttons: 📖 Practice + 🧠 Quiz
- Practice mode: tap-to-flip flashcard (front: emoji + word + part of speech; back: definition + 🇯🇵 Japanese toggle + sample sentence with the target word bolded)
- Quiz mode: emoji + definition shown, Leo types the word, ✓ check, "Starts with X" clue, live progress
- **Tab completes only when BOTH modes are done** (`visited >= N` AND `quizSolved >= N`)
- `tab-N-state` stores `{ visited, solved, mode }` so Leo returns to the same mode with progress intact

### Match Tab — MANDATORY transcript-driven sentences + recap table (PR #79 lock)

Tab 8 (Match) pairs each word with its **verbatim transcript sentence** from the TR audio (not generic word ↔ meaning). Per Leaneritan: "I need to match the transcript so Leo knows how to pronounce in practice."

**Required pieces:**
- `MATCH_PAIRS` data pulled from the transcript file (`supporting/ow2e_ame_sb_level<N>_audioscript_website.docx`), section TR `<unit>.5` for vocab-2 (TR 8.5 = Vocab 2 Activity 1)
- Each pair carries `{key, l: "emoji + word", r: "verbatim sentence", ipa: "/IPA/"}`
- Section title + dad-hint call out the TR source explicitly so Leo sees the audio link
- On match completion AND on RESTORE if already done: render a `recap-table` (see `docs/chart-templates.md`) with columns **Word · TR sentence · Pronunciation (IPA)**
- Same recap-table shape across every vocab component — consistent for Leo

## Leo personalization (mandatory in samples)

Per the working rule from the Grammar 1 build:

- **Soccer leagues** — pull samples from at least 3 of these per lesson: Premier League, La Liga, Bundesliga, Ligue 1, Serie A, Champions League, World Cup
- **Current players** (2025–26): Haaland (Man City), Salah (Liverpool), Saka (Arsenal), Bellingham (Real Madrid), Lamine Yamal (Barcelona), Vinicius Jr. (Real Madrid), Rodrygo (Real Madrid), Pedri (Barcelona), Kane (Bayern Munich), Musiala (Bayern Munich), Wirtz (Bayern Munich), Kvaratskhelia (PSG), Cherki (PSG), Dembélé (PSG), Lautaro (Inter), Palmer (Chelsea), Trent (Liverpool). Ronaldo and Messi allowed when genuinely relevant (e.g. World Cup).
- **Movies** — Dark Knight (Batman), Avatar (Jake Sully, Neytiri), John Wick, Marvel (Iron Man, Spider-Man, Thor, Captain America), Ice Age (Sid, Manny, Diego)
- **Always web-search current stats** when a sample names a specific player + club — transfer windows shift between seasons
- **Never overwrite the planner's verbatim content** (objectives, Grammar Box, the official word list, sample readings, the Lesson Planner Practice items). Soccer/movies show up only in extra sample sentences, swap chips, Apply slots, photo cards, quiz prompts, and Dribble! questions.

## Step-by-step

### Step 0 — Confirm prerequisites

```bash
# vocabulary.json exists with the right list populated
test -s content/subjects/english/courses/<course>/level-<n>/unit-<n>/vocabulary.json
# index.json has the section page range and pdf_offset
```

If vocabulary.json is missing for the unit, stop and tell Leaneritan to run `/vocab-unit-scanner` first.

### Step 1 — Read the source pages

Use the Read tool with the `pages` parameter (max 20 per call). Combine the absolute page from `pdf_offset + section.start` to `pdf_offset + section.end`.

Read:
1. The planner.pdf pages for the chosen component (vocab-1 = 4 pages; vocab-2 = 2 pages)
2. The Student Book PDF (`supporting/*Student-Book.pdf`) for the same unit pages — these give Leo's-side spread photos, dialogue captions, and the order of the target words in the lesson
3. The Workbook Answer Key (`supporting/*ak-wb*.pdf`) for the workbook exercises tied to this vocab — usually 1 page per vocab spread, often with great gap-fill / matching items perfect for Practice and Reading tabs

### Step 2 — Extract per-word content from the unit's vocabulary.json

```ts
import unitVocab from "content/.../<unit>/vocabulary.json";
const targetIds = component === "vocab-1" ? unitVocab.vocab1WordIds : unitVocab.vocab2WordIds;
const targetWords = targetIds.map(id => unitVocab.words.find(w => w.id === id));
const academicWords = unitVocab.academicWordIds.map(id => unitVocab.words.find(w => w.id === id));
```

Use each word's `displayEmoji`, `word`, `meaning`, `example`, `japanese.{word,reading,meaning}` exactly as stored — these are the locked single source of truth across Reference, teacher slides, and Leo apps (see `docs/components.md` "Reading vocab and grammar from the unit JSON").

### Step 3 — Generate the teacher slideshow

File: `public/lessons/<lesson-id>.html`

Follow the v3/v4 Unit 8 Vocab 1 deck as the template. Pack ~100 slides across the canonical phases. Per-word Present mini-games are the heaviest lift — every target word needs its own bespoke embodied game (NOT a flashcard reveal). Pull soccer + movie variations from the personalization list to keep sample density high.

Don't change the planner's objectives, instructions, or order. Personalize SAMPLES only.

### Step 4 — Generate the Leo learner app

File: `public/learn/<lesson-id>.html`

Copy the vocab-1 shell (header + tab nav + per-tab footer with Redo + Mark Complete). Customize each of the 13 tabs for the unit's target words. Keep all four save/restore rules. Load `charts.js`, `sunshine.js`, and (if used) `wordweb.js` in `<head>`.

### Step 5 — Register both lessons

Add files:

```text
content/subjects/english/courses/<course>/level-<n>/unit-<n>/lessons/<component-key>.json
content/subjects/english/courses/<course>/level-<n>/unit-<n>/lessons/<component-key>-learner.json
```

Teacher entry: `mode: "teacher"`, `status: "draft"`, `component: "<vocab-1|vocab-2>"`, `source.type: "html-slides"`, `slideCount`.

Learner entry: `mode: "learner"`, `status: "live"` (Neritan assigns), `component: "<vocab-1|vocab-2>-app"`, full `source` block with `storagePrefix`, `moduleCount: 13`, `moduleKeyFormat: "tab-{i}-done"`, `scoreKey: "score"`, `homeworkId`.

Update `src/data/lessons.ts` to import both and add to the `lessons[]` array.

### Step 6 — Validate

```bash
npm run validate:content     # 90+ cards, teacher↔learner pairing rule
npx tsc --noEmit             # types clean
node -e "$(awk '/<script>/{f=1;next}/<\/script>/{f=0}f' public/learn/<lesson-id>.html)"
                              # catches \\' escape errors that broke Grammar 1 Leo app
```

### Step 7 — Commit and push

Commit message format:

```
Add Unit <n> <component> teacher + Leo app

Teacher: <N> slides, custom shell, bespoke per-word mini-games (DO not REVEAL).
Leo app: 13 tabs (Academic / Warm Up / Present / Flashcards / Sort / Reading /
Practice / Unscramble / Match / Apply / Wrap Up / Quiz / Dribble!).

Source material:
- planner.pdf pp. X-Y (lesson spread)
- supporting/*Student-Book.pdf (photos, dialogue captions)
- supporting/*ak-wb.pdf p. Z (workbook exercises)
- vocabulary.json (X target words: …)

Soccer leagues represented: Premier League · La Liga · Bundesliga · Ligue 1.
Movies: …

Validation: validate:content + tsc + node script-check all pass.

https://claude.ai/code/session_<id>
```

Push to the current working branch. Do NOT create a PR — Leaneritan reviews + merges.

## Output checklist

- [ ] Teacher slideshow at `public/lessons/<lesson-id>.html` (~100 slides, bespoke per-word games)
- [ ] EVERY target word has a Present slide with a right-panel mini-game (goal + score + win) — not just a click-to-reveal
- [ ] Leo app at `public/learn/<lesson-id>.html` (13 tabs, all 4 save/restore rules)
- [ ] **Academic Tab 0 AND Flashcards Tab 3 have Practice + Quiz dual mode** — tab completes only when BOTH modes done (PR #77)
- [ ] **Match Tab 8 uses verbatim TR transcript sentences** (`MATCH_PAIRS` pulled from `supporting/...audioscript_website.docx`)
- [ ] **Match completion + RESTORE both render the `recap-table`** with Word · TR sentence · Pronunciation columns (PR #79)
- [ ] Teacher JSON registered with `component: "<vocab-1|vocab-2>"`, `mode: "teacher"`, `slideCount`
- [ ] Learner JSON registered with `component: "<vocab-1|vocab-2>-app"`, `mode: "learner"`, full `source` block
- [ ] `src/data/lessons.ts` updated with both imports
- [ ] Soccer samples from 3+ leagues; movies referenced
- [ ] Planner content verbatim (objectives, instructions, Grammar Box, official word list)
- [ ] `npm run validate:content` ✅
- [ ] `npx tsc --noEmit` ✅
- [ ] `node -e "$(awk '<script> extract)"` ✅ (catches `\\'` escape bugs before shipping)
- [ ] Commit pushed; no auto-PR

## Important constraints

- Never modify `src/lib/supabase.ts`
- Never override per-word `displayEmoji` — read from `vocabulary.json` so Reference, teacher slides, and Leo apps stay consistent
- Japanese drafts stay `needsReview: true` until the parent confirms
- Teacher slides have NO save/restore (Neritan marks done from the dashboard); Leo apps follow all 4 rules
- Quiz tab (Tab 11) is the ONLY tab that writes to the `score` key
- Don't add or remove tabs — 13 is locked. If a vocab list needs a novel mechanic, fit it as a sub-activity inside an existing tab
- The `node -e` script-check is mandatory — Grammar 1 Leo app shipped broken because three `\\'` escapes blew up the whole `<script>` and made the app unclickable. Don't repeat that bug
