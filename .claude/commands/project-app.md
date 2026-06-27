# project-app

Build the **Project component** for a single unit — the teacher slideshow + the Leo learner app (modal home-grid pattern). Reads source content from the planner PDF. Projects are 2-page LP sections featuring a Be the Expert topic, a Prepare phase (Choose + Research + Report Plan), a Share phase (Present + Q&A), a Project Rubric, and a Now I Can checklist.

> **Scope note.** This skill builds both the teacher slideshow AND the Leo learner app. The Project pattern is extracted from Unit 8 Project (PR #127). Projects appear in every level (1-6).

## Usage

```
/project-app <course-path> <unit-number>
```

Examples:

```
/project-app english/our-world/level-4 u8
/project-app english/our-world/level-5 u3
/project-app english/our-world/level-1 u4
```

## What this skill does

1. **Verifies prerequisites**
   - `docs/lesson-plans/<course-path>/index.json` must have `pdf_offset` and the `project` section page range for the unit
   - The planner PDF must be available (not a Git LFS pointer)
2. **Reads sources** (in order):
   - `docs/lesson-plans/<course-path>/planner.pdf` for the Project pages (typically 2 pages: Be the Expert + Prepare + Share + Project Rubric + Now I Can)
   - `content/.../<unit>/vocabulary.json` — for any content vocabulary listed on the Project pages
3. **Generates the teacher slideshow** at `public/lessons/<lesson-id>.html` (~13 slides, 1920×1080 LEEA shell, project-blue accent `--project: #0369A1`)
4. **Generates the Leo learner app** at `public/learn/<lesson-id>.html` (8-module modal home-grid)
5. **Registers both lessons**:
   - `content/.../<unit>/lessons/project.teacher.json` (teacher)
   - `content/.../<unit>/lessons/project-app.learner.json` (learner)
   - Updates `src/data/lessons.ts` to import + add to the `lessons[]` array
6. **Validates**: `npm run validate:content`
7. **Commits and pushes** — does NOT auto-create a PR.

## Lesson ID convention

```
<course-prefix>-l<level>-u<unit>-project       (teacher)
<course-prefix>-l<level>-u<unit>-project-app   (learner record id)
```

Component keys: `project` (teacher) ↔ `project-app` (learner).

---

## ⚠️ FOUR UNIVERSAL LEEA APP RULES (apply to EVERY learner app)

These four rules are non-negotiable across every LEEA learner app — mission, project, reader, writing, vocab, grammar, song, opener. They exist because the whole point of building in HTML is interactivity.

### Rule A — Vocab Foundations at the top of every app

EVERY learner app opens with vocabulary modules before any content modules:

1. **🎓 Academic Language** — flashcards (3D-flip, Practice + Quiz dual mode) for the unit's academic words. Quiz covers every word, 70% pass.
2. **🌟 Lesson Words** — flashcards + quiz for the content/related words that appear in THIS lesson. ≥2 questions per word, 75% pass.

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

- A text area alone is NOT interactive
- A checklist alone is NOT interactive
- Reading facts is NOT interactive

Examples for project modules:
- **Choose a topic** → After choosing, interactive matching (match hobby → what you need, sort hobbies by category), THEN note-taking
- **Research notes** → Guided research with fill-in structured fields, drag facts into categories, sentence builders with word chips, THEN free text
- **Write a report** → Sentence starters as chip builders (drag words into slots), word bank visible, THEN free text area
- **Present & Rubric** → Self-evaluation as tap-to-rate (1-3 stars per criterion) with feedback per rating, NOT just a checklist
- **Now I Can** → Tap-to-rate confidence scales + interactive review MCQs, NOT just checkboxes

**The test:** if Leo could complete the module by just reading and tapping "Mark Complete", it's not interactive enough.

---

## Locked patterns the skill must follow

### Teacher slideshow shell

Reference: `public/lessons/ow-l4-u8-project.html` (~13 slides, single inline `<script>`).

- 1920×1080 LEEA deck shell (`#wrap` / `#deck` / `.slide.active` / `#nav` bar / `#tn-panel` teacher notes)
- Accent color: `--project: #0369A1` (blue)
- Font: Outfit (Google Fonts)
- Slide flow follows the LP Project pages: Title → Objectives → Be the Expert → Prepare: Choose → Prepare: Research → Prepare: Report Plan → Report Template → Share: Present → Share: Q&A → Project Rubric → Now I Can → Wrap Up → Mark Done
- **Be the Expert** section: the LP features a hobby or topic with sidebar facts (e.g. Geodes for Unit 8). These become 1-2 slides with verbatim facts.
- **Prepare phase**: Choose a topic → Research notes → Report plan
- **Share phase**: Present to class → Q&A
- **Project Rubric**: the LP's rubric criteria (Content, Language, Presentation, Collaboration)
- **Now I Can**: unit-end self-assessment checklist from the LP
- Teacher notes panel uses verbatim LP instructions
- Final slide is **Mark Done** that writes to `leea.lessonProgress.v1`
- Source pill on content slides citing LP page: `📖 LP pp.X-Y`

### Leo learner app — 8 modules (UPDATED — was 6, now includes Vocab Foundations + interactive modules)

```
🎴 VOCAB FOUNDATIONS (always-on, purple ALWAYS tag)
  m1 — 🎓 Academic Language     (flashcards + quiz, 70% pass)
  m2 — 🌟 Project Words         (flashcards + quiz on lesson content words, 75% pass)

💎 EXPLORE
  m3 — 💎 Be the Expert         (interactive facts + 4Q quiz on the Be the Expert topic)

📋 PREPARE YOUR REPORT
  m4 — 🔍 Choose & Research     (interactive matching/sorting + guided note-taking)
  m5 — 📝 Write Your Report     (sentence chip builders + word bank + free text)

🗣️ PRESENT & REVIEW
  m6 — 🗣️ Present & Rubric      (interactive star-rating per criterion + feedback)
  m7 — 🏆 Now I Can             (confidence scales + interactive review MCQs)

⚽ FINAL
  m8 — ⚽ Can Leo Score?        (8Q mixed quiz, 75% gate = need 6/8)
```

### App shell

- Nunito + Oswald fonts
- Project-blue hero: `linear-gradient(135deg, #0C4A6E, #0369A1)`
- Modal home-grid with `.mod-card` cards, badge states (new/prog/done)
- Progress bar in hero
- `?hw=` homework banner support
- `← Home` button in header

### Storage namespacing (LOCKED)

```text
SAVE_PREFIX:     leea-<level>-<unit>-project-
HOMEWORK_ID:     leo-<level>-<unit>-project
MODULE_COUNT:    8
Per-module done: m{N}-done                 (boolean)
Per-module badge: badge state via badge-m{N}
Quiz scores:     m1-quiz-score, m2-quiz-score, m8-quiz-score
m4 state:        m4-hobby, m4-details, m4-how, m4-visuals
m5 state:        m5-details, m5-how, m5-visuals
m6 state:        m6-ratings (star ratings per criterion)
m7 state:        m7-confidence, m7-q1, m7-q2
```

### All four LEEA save/restore rules

- **Rule 1**: Auto-save the done-key when a module finishes
- **Rule 2**: Save quiz score to localStorage when quiz ends
- **Rule 3**: Restore result view on reopen — never restart a completed module from zero. Text areas restore their saved content. Checklists restore checked state. Quiz shows result screen if already completed.
- **Rule 4**: ↺ Redo clears saved state before re-initializing

### Module details

#### M1 — Academic Language (Vocab Foundations)
- 3D-flip flashcards for all unit academic words (Practice + Quiz dual mode)
- Quiz: ≥1 question per word, 70% pass
- Tab completes when BOTH Practice visited + Quiz passed

#### M2 — Project Words (Vocab Foundations)
- 3D-flip flashcards for content words in this lesson (Practice + Quiz dual mode)
- Quiz: ≥2 questions per word, 75% pass
- Tab completes when BOTH Practice visited + Quiz passed

#### M3 — Be the Expert
- 4-6 fact cards about the topic (verbatim from LP Be the Expert sidebar)
- **Interactive**: fact-matching game (match fact → topic), true/false with shake feedback, tap-to-reveal with scoring
- 4-question MCQ quiz on the facts (75% pass)
- Dad card with encouraging intro

#### M4 — Choose & Research
- Hobby/topic chips for selection (8-12 options from unit theme)
- **Interactive BEFORE text areas**: after choosing, match hobby → what you need (drag/tap), sort research questions into categories, sentence builders with word chips
- THEN structured text areas for: details, how to do it, visuals
- Sentence frames from LP as prompts
- Auto-saves all text on input

#### M5 — Write Your Report
- Three sections: Details, How, Visuals
- Pulls saved notes from M4 as reference (read-only info card)
- **Interactive**: sentence starters as chip builders (drag words into slots), word bank visible alongside text areas
- Word count display

#### M6 — Present & Rubric
- Presentation tips (step-by-step from LP)
- **Interactive**: tap-to-rate 1-3 stars per criterion (Content, Language, Presentation, Collaboration) with feedback message per rating level
- NOT just a checklist — star rating requires engagement

#### M7 — Now I Can
- **Interactive**: tap-to-rate confidence scales (😕 → 🙂 → 😎) per unit goal
- 2 review MCQ questions with green/red feedback
- NOT just checkboxes

#### M8 — Final Quiz
- 8 mixed questions (MCQ) covering Be the Expert facts + unit content + project process
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

Read the planner.pdf Project pages: `pdf_offset + section.project.start` to `pdf_offset + section.project.end` (typically 2 pages).

Extract:
- **Be the Expert topic + facts** (verbatim from sidebar)
- **Content Vocabulary** listed on the Project pages (if any)
- **Prepare phase instructions** (Choose, Research, Report Plan — verbatim prompts and sentence frames)
- **Report template** (the LP's report structure)
- **Share phase instructions** (Present tips, Q&A prompts)
- **Project Rubric criteria** (typically: Content, Language, Presentation, Collaboration — with descriptors)
- **Now I Can checklist** (4 items, verbatim)
- **Content objective** and **Language objective**

### Step 1 — Check existing project files as templates

Before generating, read both reference files:
- `public/lessons/ow-l4-u8-project.html` (teacher deck)
- `public/learn/ow-l4-u8-project.html` (learner app)

### Step 2 — Generate the teacher slideshow

File: `public/lessons/<lesson-id>.html`

~13 slides following the LP phases. Project accent color (`--project: #0369A1`). Teacher notes verbatim from LP.

### Step 3 — Generate the Leo learner app

File: `public/learn/<lesson-id>.html`

8-module modal home-grid (2 Vocab Foundations + 6 content modules). Each module has save/restore. Final quiz uses 75% gate (6/8).

### Step 4 — Register both lessons

Create:
- `content/.../<unit>/lessons/project.teacher.json`
- `content/.../<unit>/lessons/project-app.learner.json`

Update `src/data/lessons.ts` with both imports.

### Step 5 — Validate

```bash
npm run validate:content
```

### Step 6 — Commit and push

Push to the current working branch. Do NOT create a PR.

## Output checklist

- [ ] Teacher slideshow at `public/lessons/<lesson-id>.html` (~13 slides, project-blue accent)
- [ ] Leo app at `public/learn/<lesson-id>.html` (8 modules, modal home-grid)
- [ ] **Vocab Foundations** — m1 Academic + m2 Project Words (flashcards + quiz each)
- [ ] Be the Expert with interactive fact games — NOT just reading cards
- [ ] Choose & Research with interactive matching/sorting BEFORE text areas
- [ ] Write Your Report with sentence chip builders + word bank
- [ ] Present & Rubric with star-rating interaction — NOT just checklist
- [ ] Now I Can with confidence scales + review MCQs — NOT just checkboxes
- [ ] **Every module has Save + Redo footer buttons**
- [ ] **Every module is interactive** (Rule D test passes)
- [ ] All four save/restore rules
- [ ] Teacher JSON + learner JSON registered
- [ ] `src/data/lessons.ts` updated
- [ ] `npm run validate:content` ✅
- [ ] Commit pushed; no auto-PR

## Important constraints

- Never modify `src/lib/supabase.ts`
- Projects appear in all levels (1-6). The Be the Expert topic and Now I Can items vary per unit — always read from LP, never guess.
- The learner app must work fully offline (no external API calls)
- Report writing text areas must auto-save on input (no data loss)
- M5 (Write Your Report) MUST pull saved notes from M4 (Choose & Research) as read-only reference
- Japanese drafts stay `needsReview: true` until the parent confirms
