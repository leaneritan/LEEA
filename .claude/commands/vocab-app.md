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

Reference: `public/lessons/ow-l4-u8-vocab-1.html` (103 slides, ~250 onclick handlers).

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
- [ ] Leo app at `public/learn/<lesson-id>.html` (13 tabs, all 4 save/restore rules)
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
