# generate-lesson

Generate a LEEA teacher lesson and learner app HTML pair from a NatGeo lesson planner PDF.

## Usage

```
/generate-lesson <course-path> <unit> <component>
```

Examples:
```
/generate-lesson english/our-world/level-4 u8 grammar-1
/generate-lesson english/our-world/level-4 u8 reading
/generate-lesson english/our-world/level-4 u8 vocab-2
```

## What this skill does

1. Reads `docs/lesson-plans/<course-path>/index.json` to find the PDF page range for the requested unit + component.
2. Reads those pages from `docs/lesson-plans/<course-path>/planner.pdf` (max 20 pages per Read call).
3. Extracts the lesson content from the PDF.
4. Generates two HTML files following LEEA conventions:
   - `public/lessons/<lesson-id>.html` — Neritan's teacher slide deck
   - `public/learn/<lesson-id>.html` — Leo's learner app
5. Updates `src/data/registry.ts` if the lesson is not yet registered.
6. Adds any new vocabulary words to the relevant content JSON files.
7. Runs `npm run validate:content` to confirm everything is clean.
8. Updates AGENTS.md and docs/*.md if there are structural changes.

## Planner availability

Our World Levels 1-6 have planner PDFs and supporting files checked in through Git LFS:

| Level | Planner path | Supporting path |
|---|---|---|
| 1 | `docs/lesson-plans/english/our-world/level-1/planner.pdf` | `docs/lesson-plans/english/our-world/level-1/supporting/` |
| 2 | `docs/lesson-plans/english/our-world/level-2/planner.pdf` | `docs/lesson-plans/english/our-world/level-2/supporting/` |
| 3 | `docs/lesson-plans/english/our-world/level-3/planner.pdf` | `docs/lesson-plans/english/our-world/level-3/supporting/` |
| 4 | `docs/lesson-plans/english/our-world/level-4/planner.pdf` | `docs/lesson-plans/english/our-world/level-4/supporting/` |
| 5 | `docs/lesson-plans/english/our-world/level-5/planner.pdf` | `docs/lesson-plans/english/our-world/level-5/supporting/` |
| 6 | `docs/lesson-plans/english/our-world/level-6/planner.pdf` | `docs/lesson-plans/english/our-world/level-6/supporting/` |

If the PDF opens as a tiny Git LFS pointer instead of the real document, run `git lfs pull` before generating.

## Lesson ID convention

`ow-l{level}-u{unit}-{component}` — e.g. `ow-l4-u8-grammar-1`

## Step-by-step instructions

### Step 1 — Read the index

Read `docs/lesson-plans/<course-path>/index.json`. Get the page range for the requested unit + component. If `pdf_offset` is non-zero, add it to each page number.

### Step 2 — Read the PDF pages

Use the Read tool with the `pages` parameter. Read both the left-column (objectives, grammar rule, vocabulary list) and right-column (student-facing content, activities, grammar box, song lyrics, reading text).

Key things to extract per component:

**opener**: Unit theme, content objective, language objectives, photo discussion prompts, caption-writing task, 4 unit goals.

**vocab-1 / vocab-2**: Full vocabulary word list (bold words in the reading passage), the reading passage text, activity prompts (Warm Up, Present, Practice, Apply), graphic organizer type (sunshine, two-column chart, word web, etc.), formative assessment questions.

**song**: Song title, complete lyrics (verse + chorus, verbatim), vocabulary words used in the song, grammar structures used in the song, Use the Song activity prompts, Use It Again activity.

**grammar-1 / grammar-2**: Grammar rule name, grammar box example sentences (verbatim), practice activity sentences, academic language terms, content vocabulary, deeper grammar explanation from Be the Expert sidebar.

**reading**: Reading title, complete reading text (all paragraphs verbatim), content vocabulary list, reading strategy, comprehension questions (sequence/order activities, label activities), graphic organizer type.

**writing**: Writing type, model text title + full text (verbatim), four-column planning chart headings, writing checklist items, peer feedback sentence frames.

### Step 3 — Check existing lessons as templates

Before generating, read the most similar existing lesson for that component type to understand the expected structure and interaction patterns. Templates to reference:

- opener → `public/learn/ow-l4-u8-opener.html`
- vocab → `public/learn/ow-l4-u8-vocab-1.html`
- song → `public/learn/ow-l4-u8-song.html`
- grammar → no example yet — build from the grammar card pattern in AGENTS.md
- reading → no example yet — build as: listen-and-read, comprehension activities, graphic organizer
- writing → no example yet — build as: read model, plan chart, write, edit checklist

### Step 4 — Generate the teacher HTML

File: `public/lessons/ow-l{level}-u{unit}-{component}.html`

The teacher lesson is a slide deck for Neritan to use while teaching Leo. It should:
- Show each activity step from the PDF as a slide or panel
- Include the grammar box, vocabulary list, or reading text as reference
- Have a "Mark Done" button that saves to `leea.lessonProgress.v1`
- Follow the same HTML/CSS structure as existing teacher files in `public/lessons/`

### Step 5 — Generate the learner HTML

File: `public/learn/ow-l{level}-u{unit}-{component}.html`

The learner app is Leo's independent homework. It must follow ALL four save/restore rules:

**Rule 1** — Auto-save the done-key when a module finishes (do not wait for "Mark complete").
**Rule 2** — Save quiz score to localStorage when the quiz ends: `saveScore(score, total, true, { ...extras })`.
**Rule 3** — Restore result view on reopen — never restart a completed module from zero. Use a dedicated `restoreXResult()` function.
**Rule 4** — ↺ Redo clears saved state before re-initializing.

SAVE_PREFIX format: `{level}-{unit}-{component}-` e.g. `4-8-grammar-1-`
HOMEWORK_ID format: `leo-{level}-{unit}-{component}` e.g. `leo-4-8-grammar-1`

Component-specific learner app patterns:
- **grammar**: Chart & Samples tab → Level Up tab → Quiz tab → Master Quiz tab (four-tab model from design-decisions.md)
- **reading**: Read tab (full text with paragraph reveals) → Comprehension tab (sequence/ordering activities) → Graphic Organizer tab
- **writing**: Read Model tab → Plan tab (editable four-column chart) → Write tab (textarea with word count) → Edit Checklist tab

### Step 6 — Register the lesson

Add an entry to `src/data/registry.ts` with `status: 'live'` if the lesson is ready, or `status: 'draft'` if it needs review. Follow the existing pattern in registry.ts.

### Step 7 — Add vocabulary (if vocab component)

For vocab-1 or vocab-2 components:
- Check `content/subjects/english/vocabulary-index.json` for existing words
- Add any new words to the appropriate vocabulary JSON file
- Follow the vocabulary card schema from `docs/content-model.md`
- Mark Japanese fields as `needsReview: true` if adding Japanese drafts

### Step 8 — Add grammar card (if grammar component)

For grammar-1 or grammar-2 components:
- Add a grammar card entry to `content/subjects/english/grammar/`
- Include the grammar box examples as `samples`
- Follow the grammar card schema from `docs/content-model.md`

### Step 9 — Validate and update docs

Run `npm run validate:content`. Fix any errors before finishing.

Update AGENTS.md Unit 8 build status table to show the new component as built.
Update `docs/design-decisions.md` build status table.

### Output checklist

Report what was generated:
- [ ] Teacher lesson HTML created at: `public/lessons/<id>.html`
- [ ] Learner app HTML created at: `public/learn/<id>.html`
- [ ] Registry entry added / already existed
- [ ] Vocabulary words added (list them) / none needed
- [ ] Grammar card added / none needed
- [ ] validate:content passes
- [ ] MD files updated

## Important constraints

- Never modify `src/lib/supabase.ts`
- All save/restore rules must be implemented — do not skip Rule 2 or Rule 3
- Component tone must use the correct CSS variable block from `src/components/componentMeta.ts`
- Teacher lesson and learner app must be paired by the component naming convention (teacher `grammar-1` ↔ learner `grammar-1-app`)
- SAVE_PREFIX must be unique per lesson — never reuse another lesson's prefix
- The learner app must work fully offline (no external API calls)
- Do not hardcode dashboard numbers — read from registry or assignment helpers
