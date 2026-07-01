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
7. **Commits and pushes** — does NOT auto-create a PR. Leaneritan reviews + merges.
8. **NEVER creates a `writing.design.md`** per the standing rule in `docs/design-decisions.md` ("No doc unless something reads it"). The skill IS the design.

## Lesson ID convention

```
<course-prefix>-l<level>-u<unit>-writing       (teacher)
<course-prefix>-l<level>-u<unit>-writing-leo   (learner record id)
```

Component keys: `writing` (teacher) ↔ `writing-app` (learner).

---

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

Each modal-open triggers `restore_m{N}()` which repaints saved state. If a module has no state (m3 warm-up, m4 phrase bank), the function can be a no-op. Required for any module with form inputs, chart fills, quiz progress, or check-list state.

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

Do NOT auto-create a PR. Leaneritan reviews + merges.

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
