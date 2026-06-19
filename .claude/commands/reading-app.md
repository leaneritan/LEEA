# reading-app

Build the **Reading component** for a single unit — the teacher slideshow + the Leo learner app (landing screen with one card per source: 📘 Student Book, 📒 Workbook, future 📕 Extra-Reading). Reads source content from the planner PDF + the Student Book PDF + the Workbook AK PDF + the audioscript .docx + the unit's `vocabulary.json`. Adds any source-only words to `vocabulary.json` BEFORE building the Leo app vocab tabs.

> **Scope note.** This skill builds both the teacher slideshow AND the Leo learner app — the Reading app pattern is locked via Unit 8 Reading (PRs #80 + #81 + #82). Future reading lessons should use this skill directly.

## Usage

```
/reading-app <course-path> <unit-number>
```

Examples:

```
/reading-app english/our-world/level-4 u8
/reading-app english/our-world/level-5 u3
```

## What this skill does

1. **Verifies prerequisites**
   - `docs/lesson-plans/<course-path>/index.json` must have `pdf_offset` and the `reading` section page range for the unit
   - `vocabulary.json` for the unit must exist
2. **Reads sources** (in this order):
   - `docs/lesson-plans/<course-path>/planner.pdf` for the Reading pages (typically 4 pages: Warm Up + Present + ¶ comprehension + Practice/Apply + Wrap Up + Formative)
   - `docs/lesson-plans/<course-path>/supporting/*Student-Book.pdf` for the SB reading passage (~p.140-141 of each unit)
   - `docs/lesson-plans/<course-path>/supporting/*ak-wb.pdf` for the WB reading exercises (~p.100-101 of each unit)
   - `docs/lesson-plans/<course-path>/supporting/*audioscript*.docx` for the TR audio transcripts (verbatim passage source)
   - `content/.../<unit>/vocabulary.json` for known reference words
3. **Cross-checks WB-only words** against `vocabulary.json` + the global `vocabulary-index.json`. Any unfamiliar WB-only word that would block Leo's comprehension gets ADDED FIRST (full schema entry, source-tagged `OW<level>-U<unit>-RD-WB`).
4. **Writes the design doc** at `docs/lesson-plans/<course-path>/reading.design.md`.
5. **Generates the teacher slideshow** at `public/lessons/<lesson-id>.html` (~44 slides, single inline `<script>`, passage verbatim, spine-driven).
6. **Generates the Leo learner app** at `public/learn/<lesson-id>.html` (landing screen → SB + WB modes, ~11 modules total, all save/restore rules per mode).
7. **Registers both lessons** + updates `src/data/lessons.ts`.
8. **Validates** (`npm run validate:content` + `npx tsc --noEmit` + `node -e` script-parse-check on both HTML files).
9. **Commits and pushes** — does NOT auto-create a PR.

## Lesson ID convention

```
<course-prefix>-l<level>-u<unit>-reading       (teacher)
<course-prefix>-l<level>-u<unit>-reading-leo   (learner record id)
```

Component keys: `reading` (teacher) ↔ `reading-app` (learner).

## Locked patterns the skill must follow

### Teacher slideshow shell

Reference: `public/lessons/ow-l4-u8-reading.html` (44 slides, "Leo's First Geocache Hunt" spine, single inline script).

- 1920×1080 LEEA shell (#scaler + .slide + nav bar + teacher notes panel)
- Unit color per `docs/design-decisions.md` — for Unit 8 use green primary + blue accent
- ~44 slides — content-heavy, but every slide must justify itself against the spine AND an LP beat
- **The passage from the source (Student Book TR pages) appears verbatim** — never paraphrased
- Single inline `<script>` block, no `confirm()`, all apostrophe-bearing strings use HTML entities or backtick template strings (no `\\'` escapes inside `onclick`)
- Final slide is **Mark Done** that writes to `leea.lessonProgress.v1`
- Source pill on every passage / chart / rule slide: `📖 SB p.X · TR Y.Y`

### THE SPINE — mandatory throughline

Every reading deck has ONE spine. Must:
1. **Make reading-for-sequence load-bearing** — the strategy + signal words are the only tools that solve the on-screen problem.
2. **Accumulate** — a visible flowchart / clue list / step board that fills as each paragraph + comprehension check completes. No reset-every-slide.
3. **End with a payoff the reading earned** — the cache is found, the mystery is solved, the final scene is captioned.
4. **Thread LP beats verbatim** — Warm Up, Present, Read Together (¶-by-¶), Think Aloud, Strategy, Practice (Activity 2), Apply (Activity 3), Wrap Up (Activity 4 importance sort), Extend, Recap, Formative.

Calibration: at the level of *"Leo's First Geocache Hunt at Mount Fuji — empty 5-step flowchart fills as each paragraph + comp Q completes; compass interactive at s6 returns at s29 for the LP Think Aloud; payoff at s42 = cache FOUND scene with all 5 captioned steps + Leo's chosen treasure"*. Match that bar or beat it.

### NO LEAPS = NO UNKNOWN-WORD AMBUSH

Every word that would block Leo's comprehension is taught BEFORE he meets it in the passage. The vocab plan applies a tier rule:

- **Academic Language word** → embodied mini-game where the word performs its meaning (e.g. sequence = drag chips into 1-2-3-4 order)
- **Comprehension-blocking NEW content words** → proper tight mini-games (consolidated where possible — Unit 8 paired hiders+seekers into ONE mini-game, treasure+ornament into another)
- **Guessable / already-known content words** → first-encounter gloss tags inline in the passage (tap-to-pop)
- **Graphic-literacy element** (compass / map / etc.) → unified with its content-word mini-game and REUSED at the LP Think Aloud beat

Assign **one emoji per content word** at the start and use it on every slide the word appears.

### Read-Together pattern — paragraph-by-paragraph with flowchart unlock

Each paragraph in the passage gets ~5 slides:
1. **Passage display** — the paragraph verbatim with yellow `.tag` highlights on gloss words
2. **Audio cue** — "Play TR <track>" callout
3. **Quick gloss cards** — for any guessable words tagged in the passage
4. **Comprehension Q** (LP verbatim) — tap-to-reveal answer
5. **Flowchart unlock** — one spine slot fills with the LP-verbatim wording for that paragraph

The next paragraph stays in `.locked` style (faded + non-interactive) until Leo answers the current ¶'s comp Q correctly.

### Wrong-first for the tricky case

If the LP flags a tricky case (e.g. middle-*who* in Grammar 1, dropping *to* in Pattern B in Grammar 2), show the natural wrong attempt FIRST with a red shake, then re-position. The error is the teacher; Leo watches the fix.

### Reading Strategy taught explicitly

The LP's reading strategy (Identify Sequence of Events for Unit 8) gets its own slide with the signal words explicit (first / next / before / after / then / finally / last), then a "signal word hunt" slide with 5 sentences mixing topics (cooking + soccer) for Leo to tap the signal word in.

### JavaScript safety contract

- ONE inline `<script>` block (+ external `src` tags for charts.js / etc.)
- All passage + sample sentences in backtick template strings OR HTML entities
- Never escape apostrophes inside `onclick` — use `data-text` + helper
- No `confirm()`. Two-tap "armed" pattern for destructive actions
- `try/catch` around all DOM access with null check
- `node -e "$(awk '<script> extract)"` must pass before commit (runtime `window is not defined` = green parse signal)

## Leo learner app shell (LOCKED via Unit 8 Reading)

Reference: `public/learn/ow-l4-u8-reading.html` (landing → SB 6 tabs + WB 5 tabs = 11 modules).

### Landing-screen mode pattern

App opens to a `.landing-screen` with one card per source. See the `landing-screen-modes` template in `docs/chart-templates.md`.

- Minimum 2 cards (📘 SB + 📒 WB). Future readings may add 📕 Extra-Reading as a 3rd.
- Each `.mode-card` shows live progress (`mc-prog` pill, e.g. *"3 / 6 done"*)
- Tap card → enters that mode pane with a `◀ Back to menu` pill in a thin top bar
- `enterMode(m)` saves `last-mode` to localStorage; on reload, app restores Leo to his last view
- The header pill aggregates totals across all modes (e.g. *"7 / 11 done"*)

### Tab structure per mode

Each mode's tab strip starts with a **Vocab tab** (the source's words — flashcards + quiz, applies `flashcard-shell` from `docs/chart-templates.md`).

**SB tabs (Hide and Seek pattern):**
| # | Tab | What Leo does |
|---|---|---|
| 0 | 📖 Read | Passage paragraph-by-paragraph. ¶2 only unlocks after Leo answers ¶1's comp Q. Yellow tap-to-gloss tags on guessable words. |
| 1 | 🎯 Strategy | 7 signal words + 5 tap-the-signal-word sentences |
| 2 | 📋 Order | LP Activity 2 — order the 5 cache-discovery steps (tap-cycle 1-5, Check button verifies) |
| 3 | 🏷️ Label | LP Activity 3 — match labels to photos + the LP follow-up ("which N help you find?") |
| 4 | ✅ Quiz | 10-question scored formative |
| 5 | 📚 Vocab | Practice + Quiz dual mode on all SB-spread words (academic + content) |

(Vocab is tabId=5 internally but appears FIRST in the visual nav — see `landing-screen-modes` template for the DOM trick.)

**WB tabs (Workbook pattern):**
| # | Tab | What Leo does |
|---|---|---|
| 0 | 📚 Vocab | Practice + Quiz on the WB-spread words (incl. any WB-only words added to `vocabulary.json` first) |
| 1 | 📖 Read | The WB passage verbatim, bolded content words match the Vocab tab |
| 2 | ✅ T / F | WB Activity 2 (or equivalent) — 4 items with shake-on-wrong |
| 3 | 🗓️ Timeline | WB Activity 4 (or equivalent) — match game |
| 4 | 🏆 Quiz | 6-question scored quiz (vocab + comprehension + sequence) |

### Storage namespacing (locked)

```text
SAVE_PREFIX:     leea-<level>-<unit>-reading-
SB tabs:         tab-{i}-done                (i = 0..5)
WB tabs:         wb-tab-{i}-done             (i = 0..4)
SB tab state:    tab-{i}-state               (varies per tab)
WB tab state:    wb-tab-{i}-state
SB quiz score:   score                       (Tab 4)
WB quiz score:   wb-score                    (Tab 4)
Mode tracker:    last-mode                   (landing | sb | wb)
Tab trackers:    last-tab, wb-last-tab
homeworkId:      leo-<level>-<unit>-reading
moduleCount:     11                          (SB 6 + WB 5)
```

### Parallel function sets

Keep parallel registries instead of one parameterized function. SB uses `showTab` / `markComplete` / `doRedo` / `TAB_INIT` / `TAB_RESET` / `TAB_RESTORE`. WB uses `wbShowTab` / `wbMarkComplete` / `wbDoRedo` / `WB_INIT` / `WB_RESET` / `WB_RESTORE`. Simpler to read; keeps locked SB code untouched when WB is added. Add a third mode? Add `erShowTab` etc.

### All four LEEA save/restore rules per mode

- **Rule 1:** `markComplete(i)` writes `tab-{i}-done` (SB) or `wb-tab-{i}-done` (WB)
- **Rule 2:** Quiz tab writes `{score, total, percent, answers, done}` to `score` (SB) / `wb-score` (WB)
- **Rule 3:** Each tab has `TAB_RESTORE[i]` (or `WB_RESTORE[i]`) that replays prior state — never restart from zero
- **Rule 4:** Two-tap "armed" Redo (first tap arms 3s, second tap clears keys + re-inits)

## Reference rule — pre-add WB-only words

If the workbook reading uses words Leo hasn't met yet (cross-check against `vocabulary.json.wordIds` and `vocabulary-index.json`):
1. Add full schema word entry to `content/.../<unit>/vocabulary.json` `words` array
2. Add the global ID to `wordIds` AND `contentWordIds` arrays
3. Add the global ID to `content/subjects/english/reference/vocabulary-index.json`
4. Source tag: `OW<level>-U<unit>-RD-WB`
5. Run `npm run validate:content` BEFORE building the WB Vocab tab to confirm reference is clean

Reference example: Unit 8 Reading WB ("Video Games: Then and Now") added 5 words — arcade, console, portable, virtual reality, headset — see `content/.../unit-8/vocabulary.json`.

## Step-by-step

### Step 0 — Confirm prerequisites + read sources

```bash
test -s docs/lesson-plans/<course-path>/index.json
test -s content/.../<unit>/vocabulary.json
```

Read in order:
1. Planner Reading pages (use `pdf_offset + section.reading.start` to `pdf_offset + section.reading.end`)
2. Student Book PDF — the actual passage spread (verbatim text)
3. Workbook AK PDF — the WB reading exercises (the workbook has its OWN reading on a related topic)
4. Audioscript .docx — the TR transcripts (for verbatim passage source for both SB and WB)
5. `vocabulary.json` — current state of reference

### Step 1 — Identify NEW words + add to reference

Cross-check every content word in the WB passage against `vocabulary.json.wordIds`. Any unknown one Leaneritan would expect Leo not to know → add it FIRST. Validate.

### Step 2 — Write design doc

File: `docs/lesson-plans/<course-path>/reading.design.md`. Must contain:
1. The spine (load-bearing + accumulating + earned payoff + threading LP beats)
2. Vocab plan (which words get mini-games vs gloss cards) + emoji map
3. The verbatim SB passage
4. The verbatim WB passage (if WB reading included)
5. LP-verbatim Practice answer key (e.g. 5-step canonical order)
6. 44-row slide table for the teacher slideshow
7. List of WB-only words added to reference + their source tag

### Step 3 — Build teacher slideshow

File: `public/lessons/<lesson-id>.html` (~44 slides per the design table row-by-row).

### Step 4 — Build Leo app

File: `public/learn/<lesson-id>.html`. Landing → SB mode → WB mode. Apply `landing-screen-modes` + `flashcard-shell` templates from `docs/chart-templates.md`.

### Step 5 — Register both lessons

Add files:
```text
content/.../<unit>/lessons/reading.json           (teacher, status: draft)
content/.../<unit>/lessons/reading-learner.json   (learner, status: live)
```

`reading-learner.json` `moduleCount` = SB tabs + WB tabs (typically 11). `moduleLabels` prefix with `SB · ` and `WB · `. `moduleKeyFormat`: `tab-{i}-done · wb-tab-{i}-done`.

Update `src/data/lessons.ts` to import both.

### Step 6 — Validate

```bash
npm run validate:content
npx tsc --noEmit
node -e "$(awk '/<script>/{f=1;next}/<\/script>/{f=0}f' public/lessons/<lesson-id>.html)"
node -e "$(awk '/<script>/{f=1;next}/<\/script>/{f=0}f' public/learn/<lesson-id>.html)"
```

All four must pass.

### Step 7 — Commit and push

Push to the working branch. Do NOT auto-create a PR — Leaneritan reviews + merges.

## Output checklist

- [ ] Design doc at `docs/lesson-plans/<course-path>/reading.design.md`
- [ ] Teacher slideshow ~44 slides, passage verbatim
- [ ] Leo app with landing → SB + WB modes (or 1 mode if no WB reading exists)
- [ ] Vocab tab present FIRST visually in each mode (Practice + Quiz dual mode)
- [ ] WB-only words added to `vocabulary.json` + `vocabulary-index.json` BEFORE WB tabs built
- [ ] All four save/restore rules per mode
- [ ] Storage namespaced per mode (SB = `tab-N-done`, WB = `wb-tab-N-done`)
- [ ] Single inline `<script>` block per file
- [ ] `npm run validate:content` ✅
- [ ] `npx tsc --noEmit` ✅
- [ ] `node -e` parse-check on BOTH HTML files ✅
- [ ] Commit pushed; no auto-PR

## Important constraints

- Never modify `src/lib/supabase.ts`
- Never paraphrase the passage — verbatim from the TR transcript only
- Don't introduce structures Leo hasn't learned (instructions stay A1-A2)
- The WB reading is usually a DIFFERENT topic from the SB reading (Unit 8: SB = Geocaching, WB = Video Games). Each gets its own Vocab tab + its own scope.
- Don't merge SB and WB into one tab strip — the landing-screen pattern keeps them clean and switchable
- Future: when Extra-Reading checkpoint app is built, add a 3rd `📕 Extra-Reading` card to the landing screen — do NOT redesign the shell
