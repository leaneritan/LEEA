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

Teacher lessons are only for teaching. Learner apps are for Leo's independent homework/practice.

Learner apps live as separate `mode: "learner"` lesson records from teacher lessons, even when they cover the same component. They open from Leo mode and may embed uploaded standalone HTML apps from `public/learn/...` while keeping local progress keys ready for Supabase.

The Neritan Teacher Menu shows only teacher slide cards — learner apps never render as separate boxes there. Each teacher card carries the controls for Leo's matching app (Assign/Assigned, Review, Unassign) inside a tinted `app-controls` group labeled "Leo's App", next to the teaching controls Open and Mark Done. The counterpart is found by component name: teacher `opener` pairs with learner `opener-app` in the same level/unit, so new learner apps must follow the `{component}-app` naming to surface their buttons on the teacher card. Open stays the primary black button; Unassign renders as a quiet ghost button. Component labels and card left edges share the same accent color per component type.

Leo mode should group learner apps by course/level/unit with collapsible sections. Learner app cards should show a clear component cue, such as emoji plus color-coded chip/edge for opener, vocabulary, grammar, reading, writing, and review.

A learner lesson can be auto-assigned by setting its `status` to `assigned` in the lesson JSON — `seedAssignments` picks this up on load. The Teacher Menu also has an Assign button that writes the same record to local storage manually. Home should show assigned learner homework first; when no homework is waiting, it should show Coming Up Next based on unfinished current-unit work.

Home current-focus progress counts unit components, not every route. If a teacher lesson and Leo learner app cover the same component, such as `opener` and `opener-app`, they count as one lesson/component in the Home progress total.

Before Supabase is connected, Neritan assignment/review uses local storage with Supabase-shaped records. The assignment loop is: Neritan assigns a learner app, Leo completes it, Neritan reviews saved module/score/caption progress, then marks it reviewed or needs redo.

Assignment state is read through the shared helpers `readAssignments(learnerLessons)` and `getOpenAssignmentCount(...)` in `src/data/assignments.ts`. Do not duplicate localStorage read/seed logic inside components. Sidebar and dashboard numbers must come from real records, never hardcoded values. UI typography rule: at most one uppercase letter-spaced label per card region — component labels and group labels are uppercase, meta text and pills are sentence case.

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

Clicking vocabulary opens the vocabulary card. Clicking grammar opens the grammar chart/card.

Reference search must search everything together when the search box has a query:

- LEEA vocabulary, academic, content, related, and glossary cards
- LEEA grammar points
- Junior High search-only dictionary links from `content/subjects/english/junior-high/sanseido-index.json`

Search results must show clear type/source tags such as Vocabulary, Academic, Grammar, Junior High, Sanseido, and source tags like `OW4-U8-G1`. Clicking an internal vocabulary or grammar result opens the LEEA card. Clicking a Sanseido junior-high result opens its `u` link from the JSON. Sanseido entries are search-only; do not create LEEA cards for all of them.

Reference browse/search controls should show useful counts, and mixed search results should use subtle type-aware color cues such as card edges and badges for Vocabulary, Academic, Content, Related, Glossary, Grammar, and Junior High.

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
