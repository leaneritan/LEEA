# reader-app

Build the **Unit Reader component** for a single unit — the teacher slideshow + the Leo learner app. Reads source content from the planner PDF + the unit reader booklet. Unit Readers are the short graded-reader stories at the end of each unit, typically 1 LP page covering pre-reading, during-reading, and post-reading activities.

> **Scope note.** This skill builds both the teacher slideshow AND the Leo learner app. The Reader pattern will be locked after Unit 8 Reader is built — this skill defines the target shape based on the LP structure and existing LEEA conventions.

## Usage

```
/reader-app <course-path> <unit-number>
```

Examples:

```
/reader-app english/our-world/level-4 u8
/reader-app english/our-world/level-5 u3
/reader-app english/our-world/level-1 u4
```

## What this skill does

1. **Verifies prerequisites**
   - `docs/lesson-plans/<course-path>/index.json` must have `pdf_offset` and the `reader` section page range for the unit
   - The planner PDF must be available (not a Git LFS pointer)
   - The unit reader booklet PDF should be available in `docs/lesson-plans/<course-path>/supporting/` (filename pattern: `*reader*` or `*Reader*`)
2. **Reads sources** (in order):
   - `docs/lesson-plans/<course-path>/planner.pdf` for the Reader page (typically 1 page: Before You Read + While You Read + After You Read)
   - Unit reader booklet PDF from `supporting/` — for the verbatim story text, illustrations, and comprehension questions
   - `content/.../<unit>/vocabulary.json` — for recycled vocabulary that appears in the reader
3. **Generates the teacher slideshow** at `public/lessons/<lesson-id>.html` (~12-16 slides, 1920×1080 LEEA shell)
4. **Generates the Leo learner app** at `public/learn/<lesson-id>.html` (5-module modal home-grid)
5. **Registers both lessons**:
   - `content/.../<unit>/lessons/reader.teacher.json` (teacher)
   - `content/.../<unit>/lessons/reader-app.learner.json` (learner)
   - Updates `src/data/lessons.ts` to import + add to the `lessons[]` array
6. **Validates**: `npm run validate:content`
7. **Commits and pushes** — does NOT auto-create a PR.

## Lesson ID convention

```
<course-prefix>-l<level>-u<unit>-reader       (teacher)
<course-prefix>-l<level>-u<unit>-reader-app   (learner record id)
```

Component keys: `reader` (teacher) ↔ `reader-app` (learner).

---

## Locked patterns the skill must follow

### Teacher slideshow shell

- 1920×1080 LEEA deck shell (`#wrap` / `#deck` / `.slide.active` / `#nav` bar / `#tn-panel` teacher notes)
- Accent color: `--reader: #7C3AED` (purple) — differentiated from mission (green) and project (blue)
- Font: Outfit (Google Fonts)
- Slide flow follows the LP Reader page phases:
  1. **Title** — reader title + cover illustration description
  2. **Objectives** — content + language objectives from LP
  3. **Before You Read** — pre-reading activities (predictions, vocabulary preview, cover study)
  4. **Vocabulary Preview** — key words from the reader that recycle unit vocabulary
  5. **While You Read** — page-by-page reading with comprehension check questions
  6. **After You Read** — post-reading activities (retell, sequence, discuss, extend)
  7. **Wrap Up** — summary + connection to unit theme
  8. **Mark Done** — writes to `leea.lessonProgress.v1`
- Teacher notes panel uses verbatim LP instructions
- Source pill on content slides citing LP page: `📖 LP p.X`

### Leo learner app — 5 modules (target shape)

```
📖 BEFORE YOU READ
  m1 — 📖 Vocabulary Preview    (recycled unit words + reader-specific words, flashcards + quiz)

📗 READ THE STORY
  m2 — 📗 Read Along            (page-by-page story text with comprehension Qs between pages)

📝 AFTER YOU READ
  m3 — 📝 Comprehension         (sequence ordering, T/F, MCQ based on LP After You Read activities)
  m4 — 💬 Retell & Discuss      (retelling frames + discussion prompts from LP)

⚽ FINAL
  m5 — ⚽ Can Leo Score?        (6-8Q mixed quiz, 75% gate)
```

### App shell

- Nunito + Oswald fonts
- Reader-purple hero: `linear-gradient(135deg, #4C1D95, #7C3AED)`
- Modal home-grid with `.mod-card` cards, badge states (new/prog/done)
- Progress bar in hero
- `?hw=` homework banner support
- `← Home` button in header

### Storage namespacing

```text
SAVE_PREFIX:     leea-<level>-<unit>-reader-
HOMEWORK_ID:     leo-<level>-<unit>-reader
MODULE_COUNT:    5
Per-module done: m{N}-done                 (boolean)
Per-module badge: badge state via badge-m{N}
Quiz score:      m5-quiz-score
m2 state:        m2-page (current page), m2-answers (comprehension answers)
m3 state:        m3-answers (comprehension answers)
m4 state:        m4-retell (text), m4-discuss (text)
```

### All four LEEA save/restore rules

- **Rule 1**: Auto-save the done-key when a module finishes
- **Rule 2**: Save quiz score to localStorage when quiz ends
- **Rule 3**: Restore result view on reopen — never restart a completed module from zero. Story restores to last read page. Comprehension shows completed answers. Retell restores text.
- **Rule 4**: ↺ Redo clears saved state before re-initializing

### Module details

#### M1 — Vocabulary Preview
- Flashcards for key words that appear in the reader (recycled from unit vocab + any reader-specific words)
- 4-question quiz on the vocabulary
- Words cross-referenced against `vocabulary.json` — use existing word data, don't create duplicates

#### M2 — Read Along
- Page-by-page story display (verbatim from the reader booklet)
- Each page has a "Read" card with the text
- Between pages: 1-2 comprehension check questions from LP "While You Read" prompts
- Next page unlocks only after answering current page's question
- Tracks current page for restore

#### M3 — Comprehension
- LP "After You Read" activities converted to interactive exercises:
  - Sequence ordering (drag or tap-cycle to reorder story events)
  - True/False questions about the story
  - MCQ comprehension questions
- Mix of activity types based on what the LP provides

#### M4 — Retell & Discuss
- Retelling sentence frames from LP (fill-in-the-blank or free text)
- Discussion prompts (open-ended text areas)
- Connection to unit theme ("How does this story connect to [unit theme]?")

#### M5 — Final Quiz
- 6-8 mixed questions (MCQ + T/F) covering story comprehension + vocabulary
- 75% gate to pass
- Score saved to localStorage

### JavaScript safety contract

- ONE inline `<script>` block per file
- All text content in backtick template strings or HTML entities
- Never escape apostrophes inside `onclick` — use `data-text` + helper
- No `confirm()` — use two-tap "armed" pattern for destructive actions

---

## Step-by-step

### Step 0 — Confirm prerequisites + read sources

```bash
test -s docs/lesson-plans/<course-path>/index.json
```

Read the planner.pdf Reader page: `pdf_offset + section.reader` (typically 1 page, e.g. page 28 of the unit).

Also check `docs/lesson-plans/<course-path>/supporting/` for the reader booklet PDF. If it exists, read it for the verbatim story text. If it doesn't exist, note this for the user — the story text will need to be provided manually.

Extract from LP:
- **Reader title**
- **Before You Read activities** (predictions, vocabulary, cover study)
- **While You Read comprehension Qs** (per-page questions)
- **After You Read activities** (retell, sequence, discuss, extend)
- **Vocabulary** recycled from the unit
- **Content objective** and **Language objective**

Extract from reader booklet (if available):
- **Full story text** (verbatim, page by page)
- **Illustration descriptions** (for context)
- **End-of-book comprehension questions** (if any)

### Step 1 — Check existing reader files as templates

Before generating, check if any reader files exist as reference:
```bash
ls public/lessons/ow-*-reader*.html public/learn/ow-*-reader*.html 2>/dev/null
```

If none exist yet, use the mission and project apps as structural templates (modal home-grid pattern).

### Step 2 — Generate the teacher slideshow

File: `public/lessons/<lesson-id>.html`

~12-16 slides following the LP phases. Reader accent color (`--reader: #7C3AED`). Teacher notes verbatim from LP.

### Step 3 — Generate the Leo learner app

File: `public/learn/<lesson-id>.html`

5-module modal home-grid. Each module has save/restore. Final quiz uses 75% gate.

### Step 4 — Register both lessons

Create:
- `content/.../<unit>/lessons/reader.teacher.json`
- `content/.../<unit>/lessons/reader-app.learner.json`

Update `src/data/lessons.ts` with both imports.

### Step 5 — Validate

```bash
npm run validate:content
```

### Step 6 — Commit and push

Push to the current working branch. Do NOT create a PR.

## Output checklist

- [ ] Teacher slideshow at `public/lessons/<lesson-id>.html` (~12-16 slides, reader-purple accent)
- [ ] Leo app at `public/learn/<lesson-id>.html` (5 modules, modal home-grid)
- [ ] Story text verbatim from reader booklet (if available)
- [ ] Before/While/After reading activities from LP
- [ ] Vocabulary recycled from unit `vocabulary.json`
- [ ] All four save/restore rules (page tracking, text areas, quiz)
- [ ] Teacher JSON + learner JSON registered
- [ ] `src/data/lessons.ts` updated
- [ ] `npm run validate:content` ✅
- [ ] Commit pushed; no auto-PR

## Important constraints

- Never modify `src/lib/supabase.ts`
- Unit Readers appear in all levels (1-6). Story content and complexity vary by level.
- The reader story text must be **verbatim** from the booklet — never paraphrased
- The learner app must work fully offline (no external API calls)
- Vocabulary in M1 should cross-reference `vocabulary.json` — use existing word data and emojis, never create duplicate entries
- If the reader booklet PDF is not available in `supporting/`, pause and tell the user — the story text is essential and cannot be fabricated
- Japanese drafts stay `needsReview: true` until the parent confirms
- The reader is the LAST teaching component in each unit. Now I Can appears in the Project (not the Reader). The reader focuses purely on extensive reading practice.
