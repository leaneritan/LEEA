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
4. **Generates the Leo learner app** at `public/learn/<lesson-id>.html` (6-module modal home-grid)
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

### Leo learner app — 6 modules (LOCKED via Unit 8 Project)

Reference: `public/learn/ow-l4-u8-project.html` (~570 lines, 6 modules).

```
💎 EXPLORE
  m1 — 💎 Be the Expert       (facts about the topic + 4Q quiz)

📋 PREPARE YOUR REPORT
  m2 — 🔍 Choose & Research   (hobby/topic chips + text areas for notes)
  m3 — 📝 Write Your Report   (3-part report: details, how, visuals — pulls notes from m2)

🗣️ PRESENT & REVIEW
  m4 — 🗣️ Present & Rubric    (presentation steps + 4-item self-check rubric)
  m5 — 🏆 Now I Can           (4-item unit checklist + 2 review questions)

⚽ FINAL
  m6 — ⚽ Can Leo Score?      (8Q mixed quiz, 75% gate = need 6/8)
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
MODULE_COUNT:    6
Per-module done: m{N}-done                 (boolean)
Per-module badge: badge state via badge-m{N}
Quiz score:      m6-quiz-score
m2 state:        m2-hobby, m2-details, m2-how, m2-visuals
m3 state:        m3-details, m3-how, m3-visuals
m4 state:        m4-chk (checklist items checked)
m5 state:        m5-chk, m5-q1, m5-q2 (checklist + review answers)
```

### All four LEEA save/restore rules

- **Rule 1**: Auto-save the done-key when a module finishes
- **Rule 2**: Save quiz score to localStorage when quiz ends
- **Rule 3**: Restore result view on reopen — never restart a completed module from zero. Text areas restore their saved content. Checklists restore checked state. Quiz shows result screen if already completed.
- **Rule 4**: ↺ Redo clears saved state before re-initializing

### Module details

#### M1 — Be the Expert
- 4-6 fact cards about the topic (verbatim from LP Be the Expert sidebar)
- 4-question MCQ quiz on the facts (75% pass)
- Dad card with encouraging intro

#### M2 — Choose & Research
- Hobby/topic chips for selection (8-12 options from unit theme)
- Text areas for: details about the topic, how to do it, what visuals to use
- Sentence frames from LP as prompts
- Auto-saves all text on input

#### M3 — Write Your Report
- Three sections: Details, How, Visuals
- Pulls saved notes from M2 as reference (read-only info card)
- Text areas for each section with sentence starters from LP
- Word count display

#### M4 — Present & Rubric
- Presentation tips (step-by-step from LP)
- 4-item self-check rubric matching LP Project Rubric criteria
- Checklist with tap-to-check

#### M5 — Now I Can
- 4-item unit goals checklist from LP Now I Can
- 2 review questions (MCQ or open-ended)

#### M6 — Final Quiz
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

6-module modal home-grid. Each module has save/restore. Final quiz uses 75% gate (6/8).

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
- [ ] Leo app at `public/learn/<lesson-id>.html` (6 modules, modal home-grid)
- [ ] Be the Expert facts verbatim from LP
- [ ] Prepare/Share prompts and sentence frames verbatim from LP
- [ ] Project Rubric criteria from LP
- [ ] Now I Can checklist from LP
- [ ] All four save/restore rules (text areas, checklists, quiz)
- [ ] Teacher JSON + learner JSON registered
- [ ] `src/data/lessons.ts` updated
- [ ] `npm run validate:content` ✅
- [ ] Commit pushed; no auto-PR

## Important constraints

- Never modify `src/lib/supabase.ts`
- Projects appear in all levels (1-6). The Be the Expert topic and Now I Can items vary per unit — always read from LP, never guess.
- The learner app must work fully offline (no external API calls)
- Report writing text areas must auto-save on input (no data loss)
- M3 (Write Your Report) MUST pull saved notes from M2 (Choose & Research) as read-only reference
- Japanese drafts stay `needsReview: true` until the parent confirms
