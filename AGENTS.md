# AGENTS.md - How to Work in LEEA

This repo is **LEEA**, Leo's Elite Education Academy.

LEEA is for a father teaching his son. English is the first subject, but the architecture must allow future subjects such as math and science.

Use the full name consistently:

```text
LEEA = Leo's Elite Education Academy
```

Do not shorten the product heading to "Leo's Elite Academy".

## Golden Rules

1. **Do not rush into UI.** Read source material and design the data first.
2. **Source scan comes before lesson generation.** For each unit/topic, scan the lesson planner, book, or workbook before building.
3. **Reference first.** Vocabulary cards, academic cards, glossary/support cards, and grammar charts are reusable reference objects.
4. **Japanese ON/OFF is for learning content.** Main navigation stays English-only. Japanese belongs in cards, charts, instructions, and feedback when helpful.
5. **Reference data must be visible.** When adding vocabulary, academic, content, related, glossary/support, or grammar reference data, update the reference indexes and browse/source-tree wiring in the same change.
6. **Teacher lessons are specific.** Do not force every Neritan lesson into one generic template. Use the source lesson/deck style when that is the best teaching experience.
7. **Reusable blocks grow from repetition.** Build shared chart, quiz, card, sorter, save, and feedback blocks only when the same pattern appears across lessons or Leo apps.
8. **Teacher progress lives under Neritan.** Teacher lessons are opened and marked done from the teacher menu; the local progress shape should stay ready for Supabase.
9. **Do, not reveal.** Leo should choose, build, sort, fix, type, speak, answer, or complete.
10. **Keep it maintainable by one parent plus AI.** Avoid architecture that becomes another job.
11. **Validate content before delivery.** Run `npm run validate:content` after reference data changes, before typecheck/build/PR.

## Subject Structure

```text
LEEA
- English
  - Our World
  - Joyful Work
  - Training Ground
  - Reference
- Math
  - planned later
- Science
  - planned later
```

Our World has six levels. First build target:

```text
Our World > Level 4 > Unit 8
```

## Views

```text
Neritan view
- open teacher lessons
- preview Leo apps
- assign learner apps
- track Leo progress
- track school test results and academic goals under `/teacher/progress`

Leo view
- see next assignment
- complete learner apps
- review completed work
- use Reference

Reference
- search and browse all English vocabulary and grammar
- open vocabulary cards and grammar charts
- show I Know / I Don't Know lists
```

Home is a high-level launcher for all subjects and modes. Keep detailed English course/level/unit browsing inside the English area, not on Home. Neritan's Teacher Menu owns teacher lesson tracking, including collapsible level/unit groups and Mark Done state.

Our World also has checkpoint material after each three-unit band. Treat Review and Extra Reading after Units 1-3, 4-6, and 7-9 as first-class checkpoint lessons, not as part of Unit 3, 6, or 9. In the Neritan Teacher Menu they appear at the end of the matching band (`Units 1-3`, `Units 4-6`, `Units 7-9`) after the unit cards. Until their deck/app files are generated, show them as planned checkpoint cards rather than broken lesson links.

Teacher lessons are only for teaching. Learner apps are for Leo's independent homework/practice.

Learner apps live as separate `mode: "learner"` lesson records from teacher lessons, even when they cover the same component. They open from Leo mode and may embed uploaded standalone HTML apps from `public/learn/...` while keeping local progress keys ready for Supabase.

Lesson record filenames must make the mode explicit: teacher records use `<component>.teacher.json` and Leo records use `<component>.learner.json` under the unit `lessons/` folder, for example `vocab1.teacher.json` and `vocab1.learner.json`. The shared curriculum content still lives in `vocabulary.json` / `grammar.json`; these lesson records only describe the teacher route, Leo route, assignment/progress keys, and menu behavior. The validator enforces the filename suffixes.

The Neritan Teacher Menu shows only teacher slide cards — learner apps never render as separate boxes there. Each teacher card carries the controls for Leo's matching app (Assign/Assigned, Review, Unassign) inside a tinted `app-controls` group labeled "Leo's App", next to the teaching controls Open and Mark Done. The counterpart is found by component name: teacher `opener` pairs with learner `opener-app` in the same level/unit, so new learner apps must follow the `{component}-app` naming to surface their buttons on the teacher card. Open stays the primary black button; Unassign renders as a quiet ghost button. Component labels and card left edges share the same accent color per component type.

Leo mode should group learner apps by course/level/unit with collapsible sections. Learner app cards should show a clear component cue, such as emoji plus color-coded chip/edge for opener, vocabulary, grammar, reading, writing, and review.

Checkpoint learner apps use the same assignment/review loop as unit apps. Use teacher components `review` and `extra-reading`, with learner counterparts `review-app` and `extra-reading-app`. Source tags use band notation such as `OW4-R7-9` and `OW4-ER7-9`.

Leo's page must feel like Leo's, not a smaller copy of the teacher dashboard. The top of `/leo` is always a `LeoHomeworkHero` card with "Hi Leo 👋" greeting, a single big Start/Keep Going button, and three states: one assignment, multiple assignments ("and X more"), and a celebratory caught-up state. The grouped browser below the hero is the **full Leo library** — it shows every `mode: "learner"` lesson grouped by course/level/unit, not only the currently assigned ones. Cards without an active assignment get the `leo-app-card-available` modifier (softer styling) and a "Not assigned" status. Cards Leo has finished get a `leo-app-card-done` quiet green accent.

Use `getComponentMeta(component)` from `src/components/componentMeta.ts` as the single source of truth for emoji/label/tone. The Leo hero, Home's `NextCard`, and any future surface that names a lesson must read from it — do not duplicate the emoji/label/tone map. Home's `.next-card` carries the same per-component tone as the Leo hero through `--next-accent` and `--next-accent-deep` so the path from Home → Leo's view stays visually unbroken.

Reusable activity templates live under two parallel folders: `public/components/*` for teacher slide decks (e.g. `charts.js` → `buildDndSorter`) and `public/components/*` for Leo learner apps (e.g. `sunshine.js` → `buildSunshine`). Same self-contained vanilla JS pattern, same `window.build*` global. When a learner app HTML references a `/components/*.js` helper, the file must exist in this repo — content validation does not yet catch dangling references, but the app's init function will silently no-op if the global is undefined. The reusable templates are documented in `docs/chart-templates.md` with API, behaviour, and Codex notes; add a new section there whenever a new template is built. Do not duplicate template logic inline in a lesson HTML when a shared helper exists. The hero is color-coded by lesson component (opener gold, vocab green, grammar blue, reading amber, writing plum, song coral/pink `#d94f7b`, review green) through a single `--hero-accent` CSS variable that drives the left edge, background tint, greeting, meter, and "more" link. Adding a new component type: add a `.leo-hero-card-<tone>` block in `globals.css` and add an entry in `getComponentMeta` in `src/components/componentMeta.ts` (the single source of truth — not inside `LeoHomeworkHero.tsx`). Do not add competing primary buttons to the hero or restyle Leo's view in the muted Neritan palette.

A learner lesson can be auto-assigned by setting its `status` to `assigned` in the lesson JSON — `seedAssignments` picks this up on load. Use `status: "live"` when Neritan should assign it manually from the teacher card instead. Home should show assigned learner homework first; when multiple homework records are open, show the most recently updated `assigned` or `needs-redo` record first. When no homework is waiting, it should show Coming Up Next based on unfinished current-unit work. Home must use `getLearnerAppProgress(source)` to decide whether a learner app is done so apps with custom `moduleKeys` or `scoreKey` stay accurate.

Use `public/brand/leea_brand_mark.png` for small square LEEA brand marks in the app shell and Home hero. Keep `public/brand/leea_brand_logo.png` as the full transparent logo asset. Do not recreate the mark in CSS or inline SVG.

Learner app progress is read through `getLearnerAppProgress(source)`. The lesson JSON `source` describes the app's localStorage shape:

- `storagePrefix` — the full `leea-…-` prefix the app writes under.
- `moduleCount` — how many completable activities the app has.
- `moduleLabels` — display labels per module, in order.
- `moduleKeyFormat` (default `m{n}-done`, `{n}` 1-based / `{i}` 0-based) — for apps with regular numeric module IDs (opener style).
- `moduleKeys` — explicit per-module done-key suffixes. **Takes precedence over `moduleKeyFormat`.** Use when module IDs are non-numeric (`"ma"`) or the suffix is not `-done` (e.g. song uses `m1-complete`, `ma-complete`, …).
- `scoreKey` (default `score`) — the quiz score key suffix when the app stores its score elsewhere (e.g. song stores the quiz at `m6-score`).
- `homeworkId` — the cloud namespace; also enables the `leea-{homeworkId}-done` "homework finished" flag.
- `captionKey` — key holding Leo's written caption, if the app has one.

`getLearnerAppProgress` accepts either boolean or `{done, timestamp}` values at module keys (both are truthy when complete). It returns `score` as a **percent**: it prefers `scoreData.percent`, falls back to `Math.round(score/total * 100)` if both are present, and only treats `score` as a percent for legacy apps that store no `total`. Do not hardcode app-specific keys or labels in TypeScript — they belong in the lesson JSON.

### Learner app save/restore contract

Every module or quiz in a learner HTML app must follow this contract:

**1. Auto-save the done-key when the module finishes.**
The completion function (e.g. `finishQuiz()`, `finish()`) must save the module's done-key immediately — do not rely on the student clicking a "Mark complete" button to write that key. `getLearnerAppProgress` reads the done-key to count `completedModules`; if the key is missing, the teacher card shows the wrong count.

```js
// At the end of the quiz finish function:
lSave(SAVE_PREFIX + 'm7-done', true);       // opener pattern
lSave(SAVE_PREFIX + 'm6-complete', {...});   // song/vocab pattern
```

**2. Persist quiz score to localStorage when the quiz finishes.**
Call `saveScore(score, total, true, { ...extra })` inside the quiz finish function so the result can be restored. Do not only display the result — always write it.

**3. Restore result view on modal/tab reopen — never restart a completed module from zero.**
When a modal opens or a tab switches to a completed module, check for saved state first. If `score.done === true` (or `moduleId-complete` exists), show the result view using a dedicated `restoreXResult()` function. Only call `initX()` (which resets everything) when there is no saved state or the user explicitly taps ↺ Redo.

```js
// Modal pattern (opener style):
function openModal(id) {
  if (id === 'm7' && !m7Started) {
    const saved = lLoad(SAVE_PREFIX + 'score');
    if (saved && saved.done) restoreM7Result(saved);
    else initM7();
  }
  ...
}

// Tab pattern (vocab style):
window.showTab = function(n) {
  origShowTab(n);
  if (n === 11) { if (!restoreQuizResult()) initQuiz(); }
  ...
};
```

**4. ↺ Redo clears saved state before re-initializing.**
The redo path must remove the saved score and done-key before calling `initX()`, otherwise the restore check will immediately show the old result again.

```js
// "Try again" inline button:
onclick="lSave('score', null); initQuiz()"
// or doRedo / resetModule clears: localStorage.removeItem('leea-' + prefix + 'score')
```

Home current-focus progress counts unit components, not every route. If a teacher lesson and Leo learner app cover the same component, such as `opener` and `opener-app`, they count as one lesson/component in the Home progress total.

Before Supabase is connected, Neritan assignment/review uses local storage with Supabase-shaped records. The assignment loop is: Neritan assigns a learner app, Leo completes it, Neritan reviews saved module/score/caption progress, then marks it reviewed or needs redo.

Assignment state is read through the shared helpers `readAssignments(learnerLessons)` and `getOpenAssignmentCount(...)` in `src/data/assignments.ts`. Mutate state only through `assignLesson(lessonId, current)` and `unassignLesson(lessonId, current)` from the same module — they keep an `leea.assignments.unassigned.v1` set so `seedAssignments` does not resurrect an auto-assigned lesson after Neritan explicitly unassigns it. Do not duplicate localStorage read/seed logic inside components. Sidebar and dashboard numbers must come from real records, never hardcoded values. UI typography rule: at most one uppercase letter-spaced label per card region — component labels and group labels are uppercase, meta text and pills are sentence case.

Teacher lesson "Mark Done" state is tracked separately in `src/data/lessonProgress.ts`. It uses `leea.lessonProgress.v1` in localStorage and stores `LessonProgressRecord` objects shaped to match a future Supabase row (`lessonId`, `teacherId`, `studentId`, `status`, `completedAt`, `updatedAt`).

Academic test tracking lives under Neritan at `/teacher/progress`. Store periodic school test results through `src/data/academicProgress.ts`, using `leea.academicProgress.testResults.v1` and `leea.academicProgress.goals.v1`. Records are local-first but Supabase-shaped: `studentId`, `schoolYear`, `term`, `testName`, `testDate`, `rank`, `studentCount`, `subjects[]` with score/average/maxScore, notes, `createdAt`, and `updatedAt`. Keep this multi-subject from the start: Japanese, Social Studies, Math, Science, and English.

`src/data/registry.ts` holds named stat variables (`totalWords`, `grammarPoints`, `knownWords`, `wordsToReview`) plus `academyStats`. The `liveLessons` and `assignedLessons` fields in `academyStats` are currently hardcoded stub values — they must be replaced with real computed counts before the stats section can be trusted. Do not add new hardcoded numbers here; wire to real lesson and assignment data instead.

Leo's app card list uses a third CSS variable layer: `.leo-app-card-{tone}` classes set `--leo-component`, `--leo-component-soft`, and `--leo-component-ink` on each card. The tone comes from `getComponentMeta(lesson.component).tone`. All three surfaces (Leo hero `--hero-accent`, Home next-card `--next-accent`/`--next-accent-deep`, Leo app card `--leo-component`) are driven by `getComponentMeta` — do not add per-surface hardcoded color maps.

## Current Build Status — Unit 8 (Our World Level 4)

These lesson pairs are registered in `src/data/lessons.ts` and live on the working branch:

| Component | Teacher file | Learner file | Learner status |
|---|---|---|---|
| opener | `public/lessons/ow-l4-u8-opener.html` | `public/learn/ow-l4-u8-opener.html` | `assigned` (auto-seeds) |
| vocab-1 | `public/lessons/ow-l4-u8-vocab-1.html` | `public/learn/ow-l4-u8-vocab-1.html` | `live` (Neritan assigns) |
| song | `public/lessons/ow-l4-u8-song.html` | `public/learn/ow-l4-u8-song.html` | `live` (Neritan assigns) |

Still to build in priority order: grammar-1 (OW4-U8-G1), grammar-2 (OW4-U8-G2), reading, writing.

Target file paths when built:

| Component | Teacher file | Learner file |
|---|---|---|
| grammar-1 | `public/lessons/ow-l4-u8-grammar-1.html` | `public/learn/ow-l4-u8-grammar-1.html` |
| grammar-2 | `public/lessons/ow-l4-u8-grammar-2.html` | `public/learn/ow-l4-u8-grammar-2.html` |
| reading | `public/lessons/ow-l4-u8-reading.html` | `public/learn/ow-l4-u8-reading.html` |
| writing | `public/lessons/ow-l4-u8-writing.html` | `public/learn/ow-l4-u8-writing.html` |

### Grammar lesson HTML structure (no existing template — follow this spec)

Grammar is the first component type with no existing example. Use this spec:

**Teacher lesson** (`public/lessons/ow-l4-u8-grammar-1.html`):
- Slide-based deck, same HTML/CSS shell as `public/lessons/ow-l4-u8-opener.html`
- Slides: intro (grammar rule name + unit context) → grammar box (verbatim examples from PDF) → Notice activity → Build activity → Fix activity → Use activity → wrap-up
- Grammar box appears on every slide as a collapsible sticky reference panel
- Mark Done button saves to `leea.lessonProgress.v1`

**Learner app** (`public/learn/ow-l4-u8-grammar-1.html`):
- Four-tab layout: **Chart & Samples** | **Level Up** | **Quiz** | **Master Quiz**
- `SAVE_PREFIX = 'leea-4-8-grammar-1-'`
- `HOMEWORK_ID = 'leo-4-8-grammar-1'`
- Tab 1 (Chart & Samples): rule table + 6–10 source-backed sample sentences. No save needed — it is reference only.
- Tab 2 (Level Up): deeper rules, transforms, mixed samples. No save needed.
- Tab 3 (Quiz): multiple choice, 10 questions, follows global Japanese ON/OFF. Save score with `saveScore(score, 10, true, { trophy, text, sub, wrongQuestions })`. Restore result on re-open (Rule 3). ↺ Redo clears saved state (Rule 4). Done-key: `m3-done`.
- Tab 4 (Master Quiz): mix of multiple-choice and build-order questions, 10 items. Japanese shown automatically after each answer regardless of toggle. Save score to `m4-score`. Done-key: `m4-done`. Restore on re-open.
- `moduleCount: 4`, `moduleKeys: ["t1-done", "t2-done", "m3-done", "m4-done"]` in the registry lesson JSON.

Tabs 1 and 2 auto-save their done-key when the user opens the tab (they are reference tabs — opening counts as done). Tabs 3 and 4 save only when the quiz finishes.

## Main Layers

```text
1. Subject layer
2. Course layer
3. Reference layer
4. Activity block layer
5. Lesson layer
6. Registry/assignment layer
7. Progress layer
```

## Reference Rules

Reference opens in source-tree mode by default:

```text
Reference
- Our World
  - Level 1
  - Level 2
  - Level 3
  - Level 4
  - Level 5
  - Level 6
- Joyful Work
  - Year 1
  - Year 2
  - Year 3
- Training Ground
```

Reference also has pages/tabs:

```text
Vocabulary
Grammar
I Know
I Don't Know
Search
```

Search is its own sidebar route at `/reference/search`. Keep `/reference` focused on browse/source-tree, vocabulary, grammar, I Know, and I Don't Know. Do not put the full search box back at the top of the default Reference page.

Clicking vocabulary opens the vocabulary card. Clicking grammar opens the grammar chart/card.

Reference search must search everything together when the search box has a query:

- LEEA vocabulary, academic, content, related, and glossary cards
- LEEA grammar points
- Junior High search-only dictionary links from `content/subjects/english/junior-high/sanseido-index.json`

Search results must show clear type/source tags such as Vocabulary, Academic, Grammar, Junior High, Sanseido, and source tags like `OW4-U8-G1`. Clicking an internal vocabulary or grammar result opens the LEEA card. Clicking a Sanseido junior-high result opens its `u` link from the JSON. Sanseido entries are search-only; do not create LEEA cards for all of them.

Reference browse/search controls should show useful counts, and mixed search results should use subtle type-aware color cues such as card edges and badges for Vocabulary, Academic, Content, Related, Glossary, Grammar, and Junior High.

Reference level colors must stay consistent and visually distinct everywhere levels are listed: Level 1 green, Level 2 teal, Level 3 blue, Level 4 purple, Level 5 orange, Level 6 red. The source tree, Vocabulary, Grammar, I Know, and I Don't Know views all nest as `Course -> Level -> Unit -> Vocabulary/Grammar`; Vocabulary nests Vocabulary 1, Vocabulary 2, Academic, and Glossary, while Grammar nests grammar-point cards. Keep the hierarchy visually obvious with different styling for level, unit, category, and subgroup rows.

For checkpoint content, the Reference source tree nests it under the level band after the unit entries, for example `Level 4 -> Units 7-9 -> Review 7-9` and `Extra Reading 7-9`. New checkpoint vocabulary, glossary, academic, reading, and grammar-support items should keep their `OW<level>-R<start>-<end>` or `OW<level>-ER<start>-<end>` source tags.

Leo's Reference `I Know` / `I Don't Know` state is local-first but Supabase-shaped. Use `src/components/useKnownWordIds.ts` and its `leea.referenceConfidence.v1` records (`id`, `studentId`, `wordId`, `knows`, `confidence`, `sourceContext`, `markedKnownAt`, `createdAt`, `updatedAt`). Do not store new confidence state as a bare array of word IDs; that shape was temporary and is only supported for migration.

Reference search should rank direct word/title matches above meaning/rule matches. Broad lesson/topic tags such as `collecting` must not make every card in that section appear for a shorter query such as `collect`; source tags such as `OW4-U8-G1` can match by exact code or code prefix.

If a source tree label exists, it should list real cards or clearly say the section is empty. Do not leave placeholder links such as Academic or Glossary pointing back to `/reference`.

Academic words are thinking/study terms from Lesson Planner "Academic Language" sections. They are global cards reused across units and subjects, so duplicate academic words must merge into one `type: "academic"` item with multiple `sources[]`. Academic cards always render the rich academic card by `type`, never by tags and never as light vocabulary cards.

Academic rich cards require the light-card base fields plus `meaning`, `jp_meaning`, exactly three `when_to_use` contexts, `jp_when_to_use`, `how_to_use`, `jp_how_to_use`, `examples`, `collocations`, `jp_note`, `practice_prompt`, and `jp_practice_prompt`. Also include `nonExamples` and `miniQuiz` when building new academic cards. `examples[]` use `{ en, jp, context }`, with context set to `test`, `school`, or `real-world`. `miniQuiz[]` uses `{ prompt, options[], correct, explanation, jp }`; options stay English-only, and the renderer must show the explanation only after the learner taps an option. Add the source tag, such as `OW4-U8-G1`, and the course-level `OW4-AC` tag.

All cards need Japanese. Vocabulary, academic, content, related, glossary, and grammar reference items should not ship with blank Japanese display fields. If the Japanese is not parent-confirmed, add a careful draft and mark it with `needsReview: true` / `jp_tags: ["needs-review"]`. Confirmed examples: analyze = `分析（ぶんせき）する`; clause = `節（せつ）`.

Academic Japanese uses junior-high school grammar terms such as 主語, 動詞（どうし）, 節（せつ）, and 関係代名詞（かんけいだいめいし） when relevant. Use furigana only for harder kanji, inline with parentheses. Codex may draft Japanese for review, but the parent does the final pass.

Academic card layout should be compact and type-aware: source chips such as `OW4-U8-OP` sit beside the word title, syllables and part of speech render as pill chips, and part-of-speech chips use distinct colors by grammar role. Academic emoji should be large enough to use the visual panel space.

## Content Validation

Run this whenever reference content changes:

```text
npm run validate:content
```

The validator checks that vocabulary IDs and indexes line up, every card has Japanese display fields, academic cards have the full rich schema and mini-quiz shape, grammar cards have Japanese support, Sanseido junior-high entries are valid search-only links, every lesson JSON under the unit `lessons/` folder is imported by `src/data/lessons.ts`, and every `mode: "learner"` lesson's component ends with `-app` AND has a matching teacher-mode lesson with the base component in the same course/level/unit. Do not weaken the validator to make bad content pass; fix the content or update the documented rule in the same PR.

Vocabulary cards need:

- Previous
- Next
- position in current list, such as 3 / 14
- I Know
- related lesson button, disabled until the lesson is live
- one global Japanese ON/OFF control from the shell, not a second card-level Japanese button
- Japanese content hidden when Japanese is OFF and visible when Japanese is ON

Grammar cards need:

- source-backed chart data
- chart tabs: Chart & Samples / Level Up / Quiz / Master Quiz
- when a grammar workbook answer key is available, use the unit grammar chart as the chart source
- each grammar reference should target 10 Tab 1 sample sentences, 10 Tab 2 mixed/level-up sample sentences, 10 Tab 3 quiz questions, and 10 Master Quiz questions
- one global Japanese ON/OFF control from the shell
- Tabs 1-3 use the global Japanese ON/OFF
- Tab 4 reveals Japanese automatically after each answer, regardless of toggle state
- related lesson button, disabled until the lesson is live

## Navigation Rules

Navigation must stay consistent across every route.

- The left sidebar can collapse.
- Collapsed/open state can be local at first, then Supabase later.
- Breadcrumbs should be clickable minimalist buttons.
- Main/sidebar/breadcrumb labels stay English-only.

## Lesson Generation from Planner PDFs

The lesson-building workflow is documented in six focused docs under `docs/`:

- `docs/build-order.md` — master per-unit pipeline (read this first)
- `docs/pdf-mapping.md` — `index.json`, `pdf_offset`, page math
- `docs/vocab.md` — scan + build + wire vocabulary
- `docs/grammar.md` — scan + build + wire grammar
- `docs/components.md` — locked Leo app structure per component type
- `docs/teacher-slides.md` — teacher slideshow conventions

NatGeo lesson planner PDFs live in `docs/lesson-plans/` organised by subject → course → level (or year). Each level folder holds:

```
docs/lesson-plans/
  english/
    our-world/
      level-4/
        planner.pdf       ← added by the user (Git LFS, ~70 MB)
        index.json        ← maps unit → component → PDF page range
        supporting/       ← audio scripts, worksheets, etc.
    joyful-work/
      year-1/ ...
    training-ground/ ...
```

PDFs are tracked with Git LFS via `.gitattributes` (`docs/lesson-plans/**/*.pdf`). The user must add PDFs locally via `git clone` + `git add` + `git push` — they cannot be uploaded through the web UI at 70 MB.

`index.json` format (page numbers are PDF page numbers, 1-indexed from the start of the file):

```json
{
  "course": "Our World",
  "level": 4,
  "pdf": "planner.pdf",
  "units": {
    "u8": {
      "theme": "That's Really Interesting!",
      "pdf_offset": 0,
      "sections": {
        "opener":    "1-2",
        "vocab-1":   "3-6",
        "song":      "7-8",
        "grammar-1": "9-12",
        "vocab-2":   "13-14",
        "grammar-2": "15-16",
        "reading":   "17-20",
        "writing":   "21-23"
      }
    }
  }
}
```

`pdf_offset` is 0 when the page numbers above are already relative to the full level PDF. If the unit was measured from an excerpt, set `pdf_offset = (unit start page in full PDF) - 1`.

To generate a lesson pair from the planner, run the `/generate-lesson` skill:

```
/generate-lesson english/our-world/level-4 u8 grammar-1
```

The skill reads the index, reads the correct PDF pages, extracts content, and generates both the teacher HTML and learner app HTML following all LEEA conventions. Full instructions are in `.claude/commands/generate-lesson.md`.

**Planner PDF availability:** Our World Levels 1-6 have `planner.pdf` files and supporting files checked in through Git LFS:

| Level | Planner path | Supporting path |
|---|---|---|
| 1 | `docs/lesson-plans/english/our-world/level-1/planner.pdf` | `docs/lesson-plans/english/our-world/level-1/supporting/` |
| 2 | `docs/lesson-plans/english/our-world/level-2/planner.pdf` | `docs/lesson-plans/english/our-world/level-2/supporting/` |
| 3 | `docs/lesson-plans/english/our-world/level-3/planner.pdf` | `docs/lesson-plans/english/our-world/level-3/supporting/` |
| 4 | `docs/lesson-plans/english/our-world/level-4/planner.pdf` | `docs/lesson-plans/english/our-world/level-4/supporting/` |
| 5 | `docs/lesson-plans/english/our-world/level-5/planner.pdf` | `docs/lesson-plans/english/our-world/level-5/supporting/` |
| 6 | `docs/lesson-plans/english/our-world/level-6/planner.pdf` | `docs/lesson-plans/english/our-world/level-6/supporting/` |

If a cloud session sees only a tiny pointer file instead of a real PDF, run:

```bash
git lfs pull
```

**Updating pdf_offset:** Some `index.json` files still have placeholder or excerpt-based page ranges. When building a lesson, verify the unit start page in the full `planner.pdf` and set `pdf_offset = (unit start page in full PDF) - 1` when section page numbers are unit-relative. The skill adds this offset to every section page number automatically.

## Source Tags

Use exact source tags so duplicate words can appear once in search but retain every source.

```text
OW4-U8-V1        Our World Level 4 Unit 8 Vocabulary 1
OW4-U8-G1        Our World Level 4 Unit 8 Grammar 1
OW4-U8-G2        Our World Level 4 Unit 8 Grammar 2
OW4-U8-OP        Our World Level 4 Unit 8 Opener
JF1-L1-U2-V1     Joyful Work Year 1 Lesson 1 Unit 2 Vocabulary 1
TG-PUNCT-COMMA   Training Ground punctuation comma lesson
```
