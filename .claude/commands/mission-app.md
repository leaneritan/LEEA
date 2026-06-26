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

## Locked patterns the skill must follow

### Teacher slideshow shell

Reference: `public/lessons/ow-l4-u8-mission.html` (~16 slides, single inline `<script>`).

- 1920×1080 LEEA deck shell (`#wrap` / `#deck` / `.slide.active` / `#nav` bar / `#tn-panel` teacher notes)
- Accent color: `--mission: #237a3a` (green)
- Font: Outfit (Google Fonts)
- Slide flow follows the LP Mission page phases: Title → Objectives → Be the Expert → Think → Pair → Share → Wrap Up → Mark Done
- **Be the Expert** section: the LP features a National Geographic Explorer or a specific topic with "Be the Expert" sidebar facts. These become 3-5 slides with verbatim facts + interactive elements.
- **Think**: personal reflection prompts from the LP
- **Pair**: partner discussion prompts from the LP
- **Share**: class sharing + conclusion prompts from the LP
- Teacher notes panel uses verbatim LP instructions
- Final slide is **Mark Done** that writes to `leea.lessonProgress.v1`
- Source pill on content slides citing LP page: `📖 LP p.X`

### Leo learner app — 4 modules (LOCKED via Unit 8 Mission)

Reference: `public/learn/ow-l4-u8-mission.html` (~638 lines, 4 modules).

```
💎 EXPLORE
  m1 — 💎 Be the Expert       (facts + 4Q quiz on the Be the Expert topic)

💬 THINK, PAIR, SHARE
  m2 — 🧠 Think                (personal reflection text areas)
  m3 — 🗣️ Pair & Share         (partner discussion prompts + share frames)

⚽ FINAL
  m4 — ⚽ Can Leo Score?       (6Q mixed quiz, 75% gate = need 5/6)
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
MODULE_COUNT:    4
Per-module done: m{N}-done                 (boolean)
Per-module badge: badge state via badge-m{N}
Quiz score:      m4-quiz-score
```

### All four LEEA save/restore rules

- **Rule 1**: Auto-save the done-key when a module finishes
- **Rule 2**: Save quiz score to localStorage when quiz ends
- **Rule 3**: Restore result view on reopen — never restart a completed module from zero
- **Rule 4**: ↺ Redo clears saved state before re-initializing

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

4-module modal home-grid. Each module has save/restore. Final quiz uses 75% gate.

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
- [ ] Leo app at `public/learn/<lesson-id>.html` (4 modules, modal home-grid)
- [ ] Be the Expert facts verbatim from LP
- [ ] Think/Pair/Share prompts verbatim from LP
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
