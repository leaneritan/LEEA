# mission-app

Build the **Mission component** for a single unit — the teacher slideshow + the Leo learner app (modal home-grid pattern). Reads source content from the planner PDF + the unit's `vocabulary.json`. Missions are 1-page LP sections (Levels 4-6) featuring a National Geographic Explorer and a thinking routine (Think, Pair, Share).

> **Scope note.** This skill builds both the teacher slideshow AND the Leo learner app. The Mission pattern is extracted from Unit 8 Mission (PRs #124 + #126). For Levels 1-3, the equivalent section is **Value** — use `/value-app` (not yet built) instead.

## Usage

```
/mission-app <course-path> <unit-number>
```

Examples:

```
/mission-app english/our-world/level-4 u8
/mission-app english/our-world/level-5 u3
/mission-app english/our-world/level-6 u1
```

## What this skill does

1. **Verifies prerequisites**
   - `docs/lesson-plans/<course-path>/index.json` must have `pdf_offset` and the `mission` section page range for the unit
   - The planner PDF must be available (not a Git LFS pointer)
2. **Reads sources** (in order):
   - `docs/lesson-plans/<course-path>/planner.pdf` for the Mission page (typically 1 page: Be the Expert + Think + Pair + Share)
   - `content/.../<unit>/vocabulary.json` — for any content vocabulary listed on the Mission page
3. **Generates the teacher slideshow** at `public/lessons/<lesson-id>.html` (~16 slides, 1920×1080 LEEA shell, mission-green accent `--mission: #237a3a`)
4. **Generates the Leo learner app** at `public/learn/<lesson-id>.html` (4-module modal home-grid: Be the Expert, Think, Pair & Share, Final Quiz)
5. **Registers both lessons**:
   - `content/.../<unit>/lessons/mission.teacher.json` (teacher)
   - `content/.../<unit>/lessons/mission-app.learner.json` (learner)
   - Updates `src/data/lessons.ts` to import + add to the `lessons[]` array
6. **Validates**: `npm run validate:content`
7. **Commits and pushes** — does NOT auto-create a PR.

## Lesson ID convention

```
<course-prefix>-l<level>-u<unit>-mission       (teacher)
<course-prefix>-l<level>-u<unit>-mission-app   (learner record id)
```

Component keys: `mission` (teacher) ↔ `mission-app` (learner).

---

## ⚠️ FOUR UNIVERSAL LEEA APP RULES (apply to EVERY learner app)

These four rules are non-negotiable across every LEEA learner app — mission, project, reader, writing, vocab, grammar, song, opener. They exist because the whole point of building in HTML is interactivity.

### Rule A — Vocab Foundations at the top of every app

EVERY learner app opens with vocabulary modules before any content modules:

1. **🎓 Academic Language** — flashcards (3D-flip, Practice + Quiz dual mode) for the unit's academic words. Quiz covers every word, 70% pass.
2. **🌟 Lesson Words** — flashcards + quiz for the content/related words that appear in THIS lesson. ≥2 questions per word, 75% pass.

Both sit in a **🎴 VOCAB FOUNDATIONS** section at the top of the home grid with the purple `ALWAYS` corner tag. Words come from `vocabulary.json` — use existing word data (id, emoji, meaning, example, JP), never create duplicates.

If the LP Mission page lists Content Vocabulary, those words appear here. If it doesn't, pull the most relevant content words from the unit's `vocabulary.json` that appear in the lesson content.

### Rule B — Save + Redo buttons on every module

Every module footer has two buttons:
- **↺ Redo** (left) — two-tap armed pattern (first tap arms 3s, second tap clears saved state + re-inits)
- **✅ Mark Complete** (right) — writes `m{N}-done` to localStorage

No module is exempt. Even quiz modules get a Redo button.

### Rule C — Lesson words as flashcard + quiz set (always)

This is the mechanism for Rule A. Every lesson introduces words. Those words get their own flashcard practice + quiz module. The flashcard pattern is the canonical LEEA 3D-flip (`.flashcard-wrap` / `.flashcard` / `.fc-jp` with JP reveal). The quiz pattern is `.qz-prog` / `.qz-card` / `.mcq-opts`.

### Rule D — Every module must be interactive

**This is why we build in HTML instead of PDF.** Every module must have something Leo *does* — drag, sort, match, tap-to-choose, build sentences from chips, play a mini-game, solve a puzzle. A text area alone is NOT interactive. A checklist alone is NOT interactive.

Examples of what "interactive" means per module type:
- **Be the Expert facts** → NOT just reading facts. Interactive fact quiz, match-the-fact-to-the-topic, true/false with shake feedback
- **Think/Reflect** → NOT just a text area. Guided prompts with sentence-chip builders, tap-to-rank opinion scales, drag-to-sort ideas, THEN a text area for Leo's own thoughts
- **Pair/Share** → NOT just reading prompts. Role-play dialogue builder with chip slots, agree/disagree tap buttons, sentence completion from word bank
- **Choose a topic** → NOT just tapping a chip. After choosing, interactive matching (match hobby → what you need, sort hobbies by category)
- **Research notes** → NOT just text areas. Guided research with fill-in structured fields, drag facts into categories, sentence builders with word chips
- **Write a report** → sentence starters as chip builders (drag words into slots), THEN free text area. Word bank visible.
- **Present & Rubric** → NOT just a checklist. Self-evaluation as tap-to-rate (1-3 stars per criterion), with feedback per rating
- **Comprehension** → sequence ordering (drag/tap-cycle), match, MCQ with shake feedback — never just static Q&A

**The test:** if Leo could complete the module by just reading and tapping "Mark Complete", it's not interactive enough. Every module must require Leo to make choices, build things, or solve problems before completion unlocks.

---

## Locked patterns the skill must follow

### Teacher slideshow shell

Reference: `public/lessons/ow-l4-u8-mission.html` (~16 slides, single inline `<script>`).

- 1920×1080 LEEA deck shell (`#wrap` / `#deck` / `.slide.active` / `#nav` bar / `#tn-panel` teacher notes)
- Accent color: `--mission: #237a3a` (green)
- Font: Outfit (Google Fonts)
- Slide flow follows the LP Mission page phases: Title → Objectives → Be the Expert → Think → Pair → Share → Wrap Up → Mark Done
- **Be the Expert** section: the LP features a National Geographic Explorer or a specific topic with "Be the Expert" sidebar facts. These become 3-5 slides with verbatim facts + **interactive elements** (tap-to-reveal, match, sort — not static cards).
- **Think**: personal reflection prompts from the LP — with interactive sentence builders
- **Pair**: partner discussion prompts from the LP — with role-play dialogue slots
- **Share**: class sharing + conclusion prompts from the LP
- Teacher notes panel uses verbatim LP instructions
- Final slide is **Mark Done** that writes to `leea.lessonProgress.v1`
- Source pill on content slides citing LP page: `📖 LP p.X`

### Leo learner app — 7 modules (UPDATED — was 4, now includes Vocab Foundations + interactive modules)

```
🎴 VOCAB FOUNDATIONS (always-on, purple ALWAYS tag)
  m1 — 🎓 Academic Language     (flashcards + quiz, 70% pass)
  m2 — 🌟 Mission Words         (flashcards + quiz on lesson content words, 75% pass)

💎 EXPLORE
  m3 — 💎 Be the Expert         (interactive facts + 4Q quiz on the Be the Expert topic)

💬 THINK, PAIR, SHARE
  m4 — 🧠 Think                 (sentence builders + opinion scales + text area)
  m5 — 🗣️ Pair & Share          (dialogue builder + agree/disagree + share frames)

⚽ FINAL
  m6 — ⚽ Can Leo Score?        (8Q mixed quiz, 75% gate = need 6/8)
```

### App shell

- Nunito + Oswald fonts
- Mission-green hero: `linear-gradient(135deg, #14532D, #237a3a)`
- Modal home-grid with `.mod-card` cards, badge states (new/prog/done)
- Progress bar in hero
- `?hw=` homework banner support
- `← Home` button in header

### Storage namespacing (LOCKED)

```text
SAVE_PREFIX:     leea-<level>-<unit>-mission-
HOMEWORK_ID:     leo-<level>-<unit>-mission
MODULE_COUNT:    6
Per-module done: m{N}-done                 (boolean)
Per-module badge: badge state via badge-m{N}
Quiz scores:     m1-quiz-score, m2-quiz-score, m6-quiz-score
```

### All four LEEA save/restore rules

- **Rule 1**: Auto-save the done-key when a module finishes
- **Rule 2**: Save quiz score to localStorage when quiz ends
- **Rule 3**: Restore result view on reopen — never restart a completed module from zero
- **Rule 4**: ↺ Redo clears saved state before re-initializing

### Save + Redo footer on EVERY module

Every module modal has a footer with:
- Left: `↺ Redo` button (two-tap armed)
- Right: `✅ Mark Complete` button (writes done key)

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

Read the planner.pdf Mission page: `pdf_offset + section.mission.start` to `pdf_offset + section.mission.end`.

Extract:
- **National Geographic Explorer name + topic** (or Be the Expert topic)
- **Be the Expert sidebar facts** (verbatim)
- **Content Vocabulary** listed on the Mission page (if any)
- **Think prompts** (verbatim questions)
- **Pair prompts** (verbatim partner discussion frames)
- **Share prompts** (verbatim class sharing frames)
- **Content objective** and **Language objective**

### Step 1 — Check existing mission files as templates

Before generating, read both reference files:
- `public/lessons/ow-l4-u8-mission.html` (teacher deck)
- `public/learn/ow-l4-u8-mission.html` (learner app)

### Step 2 — Generate the teacher slideshow

File: `public/lessons/<lesson-id>.html`

~16 slides following the LP phases. Mission accent color (`--mission: #237a3a`). Teacher notes verbatim from LP.

### Step 3 — Generate the Leo learner app

File: `public/learn/<lesson-id>.html`

6-module modal home-grid with Vocab Foundations at top. Every module has save/restore + Redo/Mark Complete footer. Every module is interactive (Rule D). Final quiz uses 75% gate (6/8).

### Step 4 — Register both lessons

Create:
- `content/.../<unit>/lessons/mission.teacher.json`
- `content/.../<unit>/lessons/mission-app.learner.json`

Update `src/data/lessons.ts` with both imports.

### Step 5 — Validate

```bash
npm run validate:content
```

### Step 6 — Commit and push

Push to the current working branch. Do NOT create a PR.

## Output checklist

- [ ] Teacher slideshow at `public/lessons/<lesson-id>.html` (~16 slides, mission-green accent)
- [ ] Leo app at `public/learn/<lesson-id>.html` (6 modules, modal home-grid)
- [ ] **Vocab Foundations** — m1 Academic + m2 Mission Words (flashcards + quiz each)
- [ ] Be the Expert facts verbatim from LP — with interactive quiz, not just reading
- [ ] Think module has sentence builders / opinion scales — NOT just text areas
- [ ] Pair & Share has dialogue builder / agree-disagree — NOT just reading prompts
- [ ] **Every module has Save + Redo footer buttons**
- [ ] **Every module is interactive** (Rule D test passes)
- [ ] All four save/restore rules
- [ ] Teacher JSON + learner JSON registered
- [ ] `src/data/lessons.ts` updated
- [ ] `npm run validate:content` ✅
- [ ] Commit pushed; no auto-PR

## Important constraints

- Never modify `src/lib/supabase.ts`
- Mission is **Levels 4-6 only**. Levels 1-3 use "Value" instead.
- The learner app must work fully offline (no external API calls)
- Do not expand Think/Pair/Share beyond what the LP provides
- Japanese drafts stay `needsReview: true` until the parent confirms
