# writing-app

Build the **Writing component** for a single unit — Leo's learner app (modal home-grid pattern) plus a teacher slideshow shell. Reads source content from the planner PDF + the Student Book PDF + the Workbook AK PDF + the unit's `vocabulary.json`. Generates a 13-module modal app following the locked pattern from PR #103 (Unit 8 Writing rebuild), with the always-on Vocab Foundations rule at the top.

> **Scope note.** This skill is extracted from PR #103's Unit 8 Writing rebuild. The Leo learner app pattern is locked; the teacher slideshow shell follows the universal LEEA deck conventions from `/grammar-app` and `/reading-app`. Future writing lessons should use this skill directly — do not hand-build modal apps per unit.

## Usage

```
/writing-app <course-path> <unit-number>
```

Examples:

```
/writing-app english/our-world/level-4 u8
/writing-app english/our-world/level-4 u7
/writing-app english/our-world/level-5 u3
```

## What this skill does

1. **Verifies prerequisites**
   - `docs/lesson-plans/<course-path>/index.json` must have `pdf_offset` and the `writing` section page range for the unit
   - `content/.../<unit>/vocabulary.json` must exist with academic + content words populated
2. **Reads sources** (in order):
   - `docs/lesson-plans/<course-path>/planner.pdf` for the Writing pages (Warm Up + Present + Read the Model + Plan + Write + Edit + Share + Recap)
   - `docs/lesson-plans/<course-path>/supporting/*Student-Book.pdf` for the model passage (~p.142 of each unit) — verbatim, never paraphrased
   - `docs/lesson-plans/<course-path>/supporting/*ak-wb.pdf` for the WB writing exercises (~p.102-103 of each unit)
   - `docs/lesson-plans/<course-path>/supporting/*audioscript*.docx` if the writing has TR audio
   - `content/.../<unit>/vocabulary.json` — for academic + content word data (id, emoji, meaning, sample, JP)
3. **Generates the Leo learner app** at `public/learn/<lesson-id>.html` (~1,800 lines, 13-module modal home-grid, all save/restore rules).
4. **Generates the teacher slideshow** at `public/lessons/<lesson-id>.html` (follow the deck conventions in `/reading-app` and `/grammar-app` — 1920×1080 scaler, nav bar, notes panel, ~40-45 slides centered on the writing-genre spine).
5. **Registers both lessons**:
   - `content/.../<unit>/lessons/writing.json` (teacher) + `writing.learner.json` (learner)
   - Updates `src/data/lessons.ts` to import + add to the `lessons[]` array
6. **Validates**:
   - `npm run validate:content`
   - `node` parse check on both inline `<script>` blocks
   - `npm run build`
7. **Commits and pushes** — then **creates a PR** (AGENTS.md golden rule 0 — every push gets a PR; never reuse a merged one). Leaneritan reviews + merges.
8. **NEVER creates a `writing.design.md`** per the standing rule in `docs/design-decisions.md` ("No doc unless something reads it"). The skill IS the design.

## Lesson ID convention

```
<course-prefix>-l<level>-u<unit>-writing       (teacher)
<course-prefix>-l<level>-u<unit>-writing-leo   (learner record id)
```

Component keys: `writing` (teacher) ↔ `writing-app` (learner).

---

## Leo app — the companion to the slides

Leo does the app **alone after Neritan teaches the deck**, so it is built *from the deck*, not from a fresh plan — the same rule as `grammar-app.md` → *Leo app — the companion to the slides*. Read the deck slide by slide first (dump every `.slide`'s text, its games and the answers in its markup and notes), then check it against **`docs/teacher-slides.md` → Level 5 deck anatomy**, which maps each deck feature to what the app does: the title slide's word list (same words, same emojis) becomes the word tab, each word's mini-game is replayed, Dad 💬 / Leo 💬 frames become typed items, the soccer transfer slide becomes a soccer block with the deck's own dated claims, and the Can-do / formative slide shapes the final quiz. The deck's items go in verbatim first, then more of the same shape — several activities per tab. Write the slide → tab map into the app's header comment and the PR.

**Reference check at upload (AGENTS.md rule 5a).** Every word card the deck presents — academic, content, related, and any words the deck chose where the planner prints none — must be in Reference with this lesson's source tag. Add a full card for a missing word; add the tag to an existing card's `sources`; list them all in the teacher JSON's `referenceLinks`.

**Writing specifics — fill the locked modules from the deck.** Keep the modal home grid and storage names, but every module's content comes from the deck's slides. In the L5 U1 Writing deck (`public/lessons/ow-l5-u1-writing.html`, "Safe not Sorry!") that means:

| Deck stage | Slides | App content |
|---|---|---|
| Word Desk | related words (the five senses), academic (senses · emotions · experience), content (forecaster · heavy), each with its game and a check slide | the vocab modules: these words only, their games replayed |
| Warm Up | point-to-it five senses; brainstorm chart (sight / sound / touch); same word, different senses | sense sorts |
| Present | the sandstorm sentences; time words (first, next, then, after, before, soon) | sort + order the events |
| Read the Model | read 3 times: the story, circle sense and emotion words, underline time words, count them | paragraph reading + find blocks |
| Plan | two-column chart; sort nine words; WB p. 10 steps | the planning chart Leo fills |
| Be the Expert | irregular past (told, saw, went, came, heard, shook): match, sort, choose | match + mcq |
| Write · Edit | show don't tell; two teacher models; fix the wrong past verbs | typed rewrite + fix |
| Share · Recap · Formative | soccer transfer; match writing tools to the model; Can-do and the 4–1 rubric | soccer block, match, final quiz |

**No dead ends (AGENTS.md learner contract rule 7).** Hand-pick every wrong option — never random, never one that also fits. Accept every logical answer and wording. Give sorts, order games and tap hunts a two-tap 👀 Show the answers. Check answer keys against the book's answer key, not only the deck.

**Reference build:** `public/learn/ow-l5-u1-writing.html` (companion to `public/lessons/ow-l5-u1-writing.html`). Start from it, not from a blank file. Its header comment holds the slide → module map. Every module is a list of blocks (flash, mcq, match, typed, sort, order, find, read, tap, plan, choice, check, view, narrative, quiz) that save as Leo answers and restore their own DOM. A module's `m{n}-done` saves itself when all its blocks are done, and that same check enables Mark complete. Lessons from that build:

- **WB "write your narrative in your notebook" is the SB story.** In L5 U1 that is WB Act 3: it became the story in m6, so m8–m12 hold the WB's *other* activities (Acts 1, 2, 4, 5, 6). Map each WB activity to exactly one module, and say in the header comment where any activity went.
- **The story box is a `narrative` block with a live meter** for the deck's own Edit checklist: sentences, time words, sense words and feelings. It also flags wrong irregular past forms (goed → went, seed → saw, telled → told, "I seen" → I saw). "I'm finished" counts only when every target is met. The draft saves as he types. **Run the deck's model stories and the SB model through the meter before shipping** — every one must pass, and the deck's mistake sentences must be flagged.
- **Read 2 / Read 3 hunts are `tap` blocks, and their answers come from the book, not the deck.** Use the SB answer key's own circles and underlines. In L5 U1 the book circles 8 (turned on the radio to listen · we could hear the strong winds · scary · crash · shook · quiet · saw · happy) and underlines 5 (Last year · First · Next · Then · Soon). The first build used the deck's own counts (12 and 7) and had to be corrected. Words the deck points at but the book does not mark go in as `x` extras: tapping one explains, and it is never counted wrong. Every hunt has a two-tap **👀 Show the answers** button so Leo is never stuck, and Dad's view records when it was used. Check the model text against the book too: the deck had "on the roof too. Then, suddenly," where the book prints "on the roof, too. Then suddenly,".
- **Plans travel forward.** A module that writes from an earlier plan shows it in a `view` block (m6 shows the m5 chart; m12 shows the m10 choice and table plus the m11 events). **Views redraw every time the module opens**: the first build drew them once per page load, so a plan filled after opening the story module stayed blank until reload (PR #524).
- **Quizzes keep their gates and allow a retry.** 70% for m1, 75% for m2, 80% for m13. A pass is never taken back by a lower retry, and m13 writes `score` with `done: true` only on a pass.
- **Do not copy a slide's mistake into the app.** The deck's soccer slide had "It rained heavy". The app reused the slide's stats but not that sentence, and the PR said so.

## Locked patterns the skill must follow

### Always-on Vocab Foundations rule (from `docs/design-decisions.md`)

EVERY learner app — including writing — MUST open with two modules above SB and WB:

1. **🎓 Academic Language** — flashcards for ALL academic words in the unit + a quiz that covers every word (≥ 1 question per word, 70% pass threshold).
2. **🌟 Related Vocab** — flashcards for the related/content words + a quiz with **≥ 2 questions per word** (so a 6-word set becomes a 12-Q quiz, 75% pass threshold).

Both modules sit in a dedicated **🎴 VOCAB FOUNDATIONS** section at the very top of the home grid with the purple `ALWAYS` corner tag. Card style is the canonical LEEA 3D-flip flashcard (`.flashcard-wrap` / `.flashcard` / `.fc-jp` with JP reveal). Quiz style is the canonical `.qz-prog` / `.qz-card` / `.fo-btns` / `.mcq-opts` pattern.

This rule is non-negotiable. If the unit has 0 academic words it's a CONTENT bug — pause and surface it, do not skip the module.

### Modal home-grid app shell (LOCKED via PR #103)

Reference: `public/learn/ow-l4-u8-writing.html` (1,816 lines, 13 modules).

```
🎴 VOCAB FOUNDATIONS (always-on, purple tag)
  m1 — 🎓 Academic Language       (flashcards + Q quiz, 70% pass)
  m2 — 🌟 Related Vocab            (flashcards + 2×Q quiz, 75% pass)

📘 STUDENT BOOK (orange)
  m3 — 📐 What is <Genre> Writing? (warm-up + concept + model + structure)
  m4 — 💬 Key Expressions          (genre-specific phrase bank)
  m5 — 📋 Plan My Chart            (graphic organizer for the genre)
  m6 — ✏️ Write!                   (sentence starters + ref chart + textarea)
  m7 — ✅ Edit Checklist           (skill-of-the-week + 4-item check + share)

📓 WORKBOOK pp. X-Y (blue)
  m8 — 📋 N Steps                  (WB Act 1 — process steps)
  m9 — 🕸️ Word Map                 (WB Act 2 — graphic organizer fill)
  m10 — 🔍 Define / Analyze         (WB Act 3)
  m11 — 🔬 Compare / Contrast       (WB Act 4)
  m12 — 📝 Draft on New Topic       (WB Act 5 — second draft)

⚽ FINAL
  m13 — ⚽ Can Leo Score?          (10-Q mixed quiz, 80% gate)
```

13 modules total. The SB and WB module counts are fixed at 5 + 5; if a unit's WB has fewer activities, consolidate, do not shrink the count. The final quiz module count is fixed at 1.

### Chart usage — call `pickChart`, do not hardcode builders (PR #107)

The picker maps LP cue words to the right chart template. From inside any module:

```js
el.innerHTML = pickChart('4-column chart', {
  id: 'm5-leo-chart', mode: 'fill',
  columns: ['Hobby', 'What it is', 'How', 'Examples'],
  storageKey: 'leea-' + SAVE_PREFIX + 'fcc-leo'
});
```

Match the LP's actual cue word in the call. Available cues: `3-col / 4-col / N-col chart`, `sunshine organizer`, `word web / word map`, `step flowchart`, `dnd sorter / classification sort`. Full table in `docs/chart-templates.md`. Hardcoded `buildFourColChart(...)` calls are now an anti-pattern — only used if the genre has a one-off chart not in the picker.

Load order in `<head>`:

```html
<script src="/components/charts.js"></script>
<script src="/components/sunshine.js"></script>
<script src="/components/wordweb.js"></script>
<script src="/components/flowchart.js"></script>
<script src="/components/chart-picker.js"></script>
```

### Storage namespacing (LOCKED)

```text
SAVE_PREFIX:  leea-<level>-<unit>-writing-
HOMEWORK_ID:  leo-<level>-<unit>-writing
MODULE_COUNT: 13

Per-module badge state: m{N}-state             (new | prog | done)
Per-module done flag:   m{N}-done              (boolean)
Quiz score:             m1-quiz-score, m2-quiz-score, m13-quiz-score / m13-score
Module-specific state:  m3-ans / m4-ans / m5 chart / m6-draft / m7-its + m7-chk / etc.
Final score (homework): score                  (with HOMEWORK_ID-score mirror)
```

Every save writes BOTH keys: `leea-<SAVE_PREFIX>-<key>` AND `leea-<HOMEWORK_ID>-<key>`. The HOMEWORK_ID mirror is what the LEEA shell reads to track completion in Neritan's dashboard.

### Per-module `restore_mN()` pattern

Each modal-open triggers `restore_m{N}()` which repaints saved state — including for m3/m4-style modules that only track per-question `mcq-opt` answers (`M3_ANS`/`M4_ANS`-style objects guarded by `if (ANS[qk]) return;`). Restoring the data object alone is not enough: the buttons must also be re-disabled and the objectively-correct one re-marked, or a reopened module shows fresh, clickable-looking buttons that silently do nothing when tapped. Use a shared `restoreAnsweredButtons(groupPrefix, answeredObj, btnClass)` helper (see `ow-l4-u8-writing.html` for the reference implementation) rather than a no-op. m8's step-reveal + quiz-section visibility must also restore (if any `M8_ANS` keys are saved, all 6 steps were necessarily opened — reopen them and reveal the quiz section on restore instead of leaving them collapsed).

### Every module needs a Mark Complete + Redo footer

This is not optional for any module, including ones whose completion is fully automatic (quiz pass, word count, filled-field threshold). Every module's footer needs: a `"Mark <Module> complete ✓"` button, disabled until that module's own completion check passes, using the exact same check that would have auto-saved the done-key; and a two-tap-armed `"↺ Redo"` button that clears that module's saved keys and resets its DOM to fresh (see `m1Redo`/`m5Redo`/`m13Redo` in `ow-l4-u8-writing.html` for the two-tap pattern and per-module-shape reset logic). A prior generation of this app shipped 10 of 13 modules with no button at all — this was reported as a real bug, not a nice-to-have.

### Final quiz (m13) — locked shape

10 mixed questions covering academic vocab + genre concept + WB content. Mix of `mcq` (3-option) + `tf` (binary). Need **8/10 (80%)** to write `done: true` to the homework key.

```js
// Question shape
{ type:'mcq', tag:'ACADEMIC', q:'...', opts:['a','b','c'], ans:1 }
{ type:'tf',  tag:'ITS/IT\'S', q:'...', opts:['its','it\'s'], ans:0 }
```

Tags appear above each question for visual variety; pick from `ACADEMIC` / `EXPLANATION` / `STRUCTURE` / `CONTENT` / `PLANNING` / `PROCESS` / `ITS/IT'S` / etc. Match the unit's writing focus.

### Review mode

`?review=1` hides `appRoot` and shows `reviewScreen` with all of Leo's saved work (chart fills, drafts, word maps, etc.) — read-only, for Neritan to grade. Required.

### Homework banner

When the URL has `?hw=`, show the `#hwBanner` reading *"🎯 Homework mode — your progress will be saved to Neritan."* Required.

### Mobile-first sizing

`max-width: 680px` on `.home`, `.mbox`, `.rv-screen`. Hero is sticky-orange. Progress bar yellow. All buttons + cards designed for thumb-touch first.

---

## Step-by-step

### Step 0 — Confirm prerequisites + read sources

```bash
test -s docs/lesson-plans/<course-path>/index.json
test -s content/subjects/english/courses/<course-path>/<unit>/vocabulary.json
```

Read in order:
1. Planner Writing pages (use `pdf_offset + section.writing.start` to `pdf_offset + section.writing.end`)
2. Student Book PDF — the model passage spread (verbatim text needed)
3. Workbook AK PDF — the WB writing exercises
4. Audioscript .docx — if the writing has TR audio
5. `vocabulary.json` — academic + content + related word data

### Step 1 — Extract design inputs from the LP

From the planner pages, extract:
- **Writing genre** (Explanation · Narrative · Procedural · Opinion · etc.) — this becomes the m3 title and shapes the quiz tags
- **Model passage title + verbatim text** — appears in m3 inline
- **Graphic organizer cue** — determines which chart picker resolves (4-col / 3-col / word web / step flowchart)
- **Genre-specific phrases** for m4 (e.g. *for example* / *such as* for Explanation; *first / then / finally* for Procedural)
- **Skill of the week** for m7 (e.g. *its* vs *it's* for Unit 8 Writing)
- **WB activity titles + question stems** for m8–m12

### Step 2 — Build the Leo learner app

File: `public/learn/<lesson-id>.html`

Mirror the structure of `public/learn/ow-l4-u8-writing.html` (the PR #103 reference). Substitute:
- Hero title + genre
- Academic + Related word data from `vocabulary.json`
- Model passage verbatim
- Graphic organizer choice (via `pickChart`)
- WB activity content per module

Keep the CSS variable palette + the `.flashcard-wrap` + `.qz-card` + `.mod-card` classes IDENTICAL across units. Visual consistency across all writing lessons is part of the rule.

### Step 3 — Build the teacher slideshow

File: `public/lessons/<lesson-id>.html`

Follow the universal teacher-deck conventions from `/grammar-app` and `/reading-app`:
- 1920×1080 scaler, nav bar, teacher notes panel
- Slides organized around the same writing-genre spine the learner app uses (Warm Up → Present → Read Model → Plan → Write → Edit → Share → Wrap Up → Formative)
- The model passage appears verbatim
- Source pill on every slide
- Final "Mark Done" writes to `leea.lessonProgress.v1`

Until the writing teacher-deck pattern is fully locked (no equivalent of PR #103 exists for the teacher side yet), keep the deck content-focused and avoid bespoke mini-games per slide — those can be added when the pattern hardens.

### Step 4 — Register both lessons

Add to `content/.../<unit>/lessons/`:
- `writing.json` (teacher) — `{ id, subject, course, level, unit, component: "writing", mode: "teacher", title, subtitle, source: { embedPath }, ... }`
- `writing.learner.json` — same shape with `component: "writing-app"`, `mode: "learner"`, `homeworkId: "leo-<level>-<unit>-writing"`, `moduleCount: 13`, `moduleKeyFormat: "m{n}-done"`, `moduleLabels: ["Academic Language", "Related Vocab", "What is <Genre> Writing?", "Key Expressions", "Plan My Chart", "Write!", "Edit Checklist", "<WB Act 1>", "<WB Act 2>", "<WB Act 3>", "<WB Act 4>", "<WB Act 5>", "Can Leo Score?"]`

Update `src/data/lessons.ts` — import both JSONs and add to the `lessons[]` array.

Confirm `component: "writing"` (teacher) and `component: "writing-app"` (learner) actually match once the `-app` suffix is stripped — this is what lets the parent's "Mark Done" checklist auto-update when Leo finishes his app. See `docs/supabase.md` for why this matters; a mismatch here fails silently (no error, the checklist just never updates).

### Step 5 — Validate

```bash
npm run validate:content
node -e "$(awk '/<script>/{f=1;next}/<\/script>/{f=0}f' public/learn/<lesson-id>.html)"   # parse-check the inline JS
node -e "$(awk '/<script>/{f=1;next}/<\/script>/{f=0}f' public/lessons/<lesson-id>.html)"
npm run build
```

All four must pass before commit.

### Step 6 — Commit + push

```bash
git checkout -b claude/u<level>-u<unit>-writing
git add -A
git commit -m "Unit <unit> Writing: build via /writing-app (modal home-grid + Vocab Foundations)"
git push -u origin claude/u<level>-u<unit>-writing
```

Then create a PR (AGENTS.md golden rule 0 — every push gets a PR; never reuse a merged one). Leaneritan reviews + merges.

---

## What NOT to do

- ❌ Do not create a `writing.design.md` file. The PR #104 rule applies: no doc unless something reads it.
- ❌ Do not hardcode `buildFourColChart(...)` etc. Use `pickChart` so the chart-cue layer stays the single source of truth.
- ❌ Do not shrink the module count below 13. The Vocab Foundations + SB 5 + WB 5 + final quiz = 13 is locked.
- ❌ Do not put the Academic/Related modules anywhere other than the very top of the home grid. The `ALWAYS` corner tag must be visible.
- ❌ Do not add a second JP toggle inside any flashcard or quiz. The global topbar toggle is the only one.
- ❌ Do not paraphrase the model passage. Verbatim only.
- ❌ Do not skip the `?review=1` review mode or the `?hw=` banner. Both are required for the LEEA shell integration.
- ❌ Do not register the learner JSON without a real `homeworkId`, and do not let its `component` diverge from the teacher lesson's `component` (minus `-app`) — either mistake silently breaks the auto Mark-Done propagation described in `docs/supabase.md`, with no error surfaced anywhere.

## When the writing has features this skill doesn't cover

If the unit's writing has a genre/structure that doesn't fit the 13-module shape (e.g. dialogue writing, poetry, picture composition), pause and surface the gap before generating. The shape is locked by PR #103; deviations need a conversation, not a quiet customization. Capture the resolution in `docs/design-decisions.md` so the next agent has the answer.
