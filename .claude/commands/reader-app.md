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
4. **Generates the Leo learner app** at `public/learn/<lesson-id>.html` (6-module modal home-grid)
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

## ⚠️ FOUR UNIVERSAL LEEA APP RULES (apply to EVERY learner app)

These four rules are non-negotiable across every LEEA learner app — mission, project, reader, writing, vocab, grammar, song, opener. They exist because the whole point of building in HTML is interactivity.

### Rule A — Vocab Foundations at the top of every app

EVERY learner app opens with vocabulary modules before any content modules:

1. **🎓 Academic Language** — flashcards (3D-flip, Practice + Quiz dual mode) for the unit's academic words. Quiz covers every word, 70% pass.
2. **🌟 Lesson Words** — flashcards + quiz for the content/related words that appear in THIS lesson (recycled from unit + reader-specific). ≥2 questions per word, 75% pass.

Both sit in a **🎴 VOCAB FOUNDATIONS** section at the top of the home grid with the purple `ALWAYS` corner tag. Words come from `vocabulary.json`.

### Rule B — Save + Redo buttons on every module

Every module footer has two buttons:
- **↺ Redo** (left) — two-tap armed pattern (first tap arms 3s, second tap clears saved state + re-inits)
- **✅ Mark Complete** (right) — writes `m{N}-done` to localStorage

No module is exempt.

### Rule C — Lesson words as flashcard + quiz set (always)

Every lesson introduces words. Those words get their own flashcard practice + quiz module using the canonical LEEA 3D-flip + `.qz-prog` / `.qz-card` / `.mcq-opts` pattern.

### Rule D — Every module must be interactive

**This is why we build in HTML instead of PDF.** Every module must have something Leo *does* — drag, sort, match, tap-to-choose, build sentences from chips, play a mini-game, solve a puzzle.

Examples for reader modules:
- **Read Along** → NOT just displaying text. Tap-to-gloss highlighted words, comprehension Qs gate next page unlock, signal-word highlighting
- **Comprehension** → Sequence ordering with drag/tap-cycle, T/F with shake feedback, MCQ with green/red — all interactive
- **Retell** → NOT just a text area. Sentence-ordering drag activity, story-event matching, THEN free retelling text area

**The test:** if Leo could complete the module by just reading and tapping "Mark Complete", it's not interactive enough.

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

### Leo learner app — 6 modules

```
🎴 VOCAB FOUNDATIONS (always-on, purple ALWAYS tag)
  m1 — 🎓 Academic Language     (flashcards + quiz, 70% pass)
  m2 — 🌟 Reader Words          (flashcards + quiz on reader vocabulary, 75% pass)

📗 READ THE STORY
  m3 — 📗 Read Along            (page-by-page with tap-to-gloss + comprehension Qs gating next page)

📝 AFTER YOU READ
  m4 — 📝 Comprehension         (sequence ordering drag/tap-cycle, T/F with shake, MCQ)
  m5 — 💬 Retell & Discuss      (sentence-ordering drag + story-event matching + free retelling)

⚽ FINAL
  m6 — ⚽ Can Leo Score?        (8Q mixed quiz, 75% gate = need 6/8)
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
MODULE_COUNT:    6
Per-module done: m{N}-done                 (boolean)
Per-module badge: badge state via badge-m{N}
Quiz scores:     m1-quiz-score, m2-quiz-score, m6-quiz-score
m3 state:        m3-page (current page), m3-answers (comprehension answers)
m4 state:        m4-answers (comprehension answers)
m5 state:        m5-order (sentence ordering), m5-retell (text)
```

### All four LEEA save/restore rules

- **Rule 1**: Auto-save the done-key when a module finishes
- **Rule 2**: Save quiz score to localStorage when quiz ends
- **Rule 3**: Restore result view on reopen — never restart a completed module from zero. Story restores to last read page. Comprehension shows completed answers. Retell restores text.
- **Rule 4**: ↺ Redo clears saved state before re-initializing

### Module details

#### M1 — Academic Language (Vocab Foundations)
- 3D-flip flashcards for all unit academic words (Practice + Quiz dual mode)
- Quiz: ≥1 question per word, 70% pass
- Tab completes when BOTH Practice visited + Quiz passed

#### M2 — Reader Words (Vocab Foundations)
- 3D-flip flashcards for words that appear in the reader (recycled from unit vocab + reader-specific)
- Quiz: ≥2 questions per word, 75% pass
- Words cross-referenced against `vocabulary.json` — use existing word data, don't create duplicates

#### M3 — Read Along
- Page-by-page story display (verbatim from the reader booklet)
- **Interactive**: tap-to-gloss highlighted content words (yellow `.tag` highlights), comprehension Qs gate next page unlock
- Between pages: 1-2 MCQ/T-F comprehension check questions from LP "While You Read" with green/red shake feedback
- Next page stays locked (faded) until current page's question answered correctly
- Tracks current page for restore

#### M4 — Comprehension
- LP "After You Read" activities converted to interactive exercises:
  - **Sequence ordering**: drag or tap-cycle to reorder story events (not just MCQ)
  - **True/False**: with shake feedback on wrong answer
  - **MCQ**: with green/red feedback
- Mix of activity types based on what the LP provides

#### M5 — Retell & Discuss
- **Interactive first**: sentence-ordering drag activity (put retelling sentences in order), story-event → character matching game
- THEN retelling sentence frames from LP (fill-in-the-blank with word bank)
- THEN free text area for Leo's own retelling
- Connection to unit theme ("How does this story connect to [unit theme]?")

#### M6 — Final Quiz
- 8 mixed questions (MCQ + T/F) covering story comprehension + vocabulary
- 75% gate (need 6/8 to pass)
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

6-module modal home-grid (2 Vocab Foundations + 4 content modules). Each module has save/restore. Final quiz uses 75% gate (6/8).

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
- [ ] Leo app at `public/learn/<lesson-id>.html` (6 modules, modal home-grid)
- [ ] **Vocab Foundations** — m1 Academic + m2 Reader Words (flashcards + quiz each)
- [ ] Story text verbatim from reader booklet (if available)
- [ ] Read Along with tap-to-gloss + comprehension Qs gating pages — interactive
- [ ] Comprehension with drag/tap-cycle sequence ordering — NOT just MCQ
- [ ] Retell with sentence-ordering drag + matching BEFORE free text
- [ ] **Every module has Save + Redo footer buttons**
- [ ] **Every module is interactive** (Rule D test passes)
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
