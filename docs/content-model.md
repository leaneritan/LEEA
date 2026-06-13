# Content Model Draft

This is a first draft. It is intentionally small, editable, and source-first.

## Folder Shape

```text
content/
  registry.json
  subjects/
    english/
      subject.json
      reference/
        vocabulary-index.json
        grammar-index.json
      courses/
        our-world/
        joyful-work/
        special-training/
```

Future subjects can follow the same pattern.

## Home Subject UI State

Home subject panels and the app sidebar should support persisted collapsed/expanded state.

```json
{
  "studentId": "leo",
  "homeSubjectPanels": {
    "english": true,
    "math": false,
    "science": false
  },
  "sidebarCollapsed": false
}
```

For subject panels, `true` means expanded and `false` means collapsed.

First version can store this locally. Later it should live in Supabase user settings.

## Registry

The registry says what exists and what is live.

```json
{
  "schemaVersion": 1,
  "subjects": [
    {
      "id": "english",
      "title": "English",
      "status": "planned",
      "courses": []
    }
  ]
}
```

Lesson status values:

```text
draft
live
assigned
locked
archived
```

## Vocabulary Reference

Every learned word gets one global reference card. If the same word appears in multiple books or lessons, it should still have one global item with multiple source tags.

```json
{
  "id": "global_relative",
  "type": "vocabulary",
  "word": "relative",
  "normalizedWord": "relative",
  "displayEmoji": "family emoji",
  "emojiDescription": "family members",
  "partOfSpeech": "noun",
  "syllables": "rel-a-tive",
  "meaning": "a person in your family",
  "example": "I have many relatives.",
  "japanese": {
    "word": "",
    "reading": "",
    "meaning": "",
    "needsReview": true
  },
  "sources": [
    {
      "subject": "english",
      "course": "our-world",
      "level": 4,
      "unit": 8,
      "component": "vocab-1",
      "lessonId": "ow-l4-u8-vocab-1",
      "tag": "OW4-U8-V1",
      "lessonStatus": "draft"
    }
  ],
  "tags": ["vocabulary", "content", "OW4-U8-V1"]
}
```

Japanese fields are required for learning cards and charts. They should not be left blank. If Japanese has not been parent-confirmed yet, add a careful draft and mark it with `needsReview: true` / `jp_tags: ["needs-review"]`.

Cards and charts read the global Japanese ON/OFF setting from the app shell. Avoid duplicate per-card Japanese toggles.

### Vocabulary JSON structure

The unit vocabulary JSON (`vocabulary.json`) uses named word-list ID arrays that the validator checks:

```json
{
  "wordIds":         ["..."],   // all word IDs in this unit
  "vocab1WordIds":   ["..."],   // tag OW4-U8-V1
  "vocab2WordIds":   ["..."],   // tag OW4-U8-V2
  "academicWordIds": ["..."],   // type: "academic"
  "contentWordIds":  ["..."],   // type: "content"
  "relatedWordIds":  ["..."],   // type: "related"
  "words":           [...]      // the full card objects
}
```

Every word ID must appear in `wordIds` AND in `content/subjects/english/reference/vocabulary-index.json`. The validator will fail if they are out of sync.

## Reference Browse Tree

Reference opens in source-tree mode by default.

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
  - Punctuation
  - Nouns
  - Articles
  - Word Order
```

Units/components inside levels can be collapsed.

First real build target:

```text
subject: english
course: our-world
level: 4
unit: 8
```

Reference also exposes:

```text
Vocabulary
Grammar
I Know
I Don't Know
Search
```

Search lives at `/reference/search` as its own sidebar route. Keep `/reference` as the browse-first Reference library page.

Vocabulary includes all word-like reference objects:

```text
vocabulary
academic
content
related
glossary/support
```

When a unit adds word-like reference objects, the data change is not complete until:

- the unit JSON includes the objects and their ID lists
- `content/subjects/english/reference/vocabulary-index.json` includes the IDs
- `src/data/reference.ts` exposes any needed source-tree filters
- the Reference source tree lists the cards under real sections, not placeholder links

Grammar includes all grammar-point reference objects.

When a grammar workbook answer key is available, the unit grammar chart should be used as the source for the grammar reference chart. Exercises can be used as source-backed samples and quizzes. Each grammar reference should target:

- 10 Tab 1 sample sentences for Chart & Samples
- 10 Tab 2 mixed/level-up sample sentences
- 10 Tab 3 quiz questions
- 10 Master Quiz questions

I Know and I Don't Know are student-specific views built from Leo's confidence/progress state.

Search should match:

- English word/title
- normalized word
- Japanese word
- Japanese reading
- meaning/definition
- tags/source labels

Search also includes Junior High search-only dictionary entries from `content/subjects/english/junior-high/sanseido-index.json`. These entries use `{ "w": string, "u": string }`, where `w` is the searchable word and `u` is the link to open. They are not LEEA cards.

Search results should deduplicate by global item id and show all matching source tags. Results must clearly tag their type/source, such as Vocabulary, Academic, Grammar, Junior High, Sanseido, and source tags like `OW4-U8-G1`.

Reference browse/search controls should show useful counts. Mixed search results should be visually scannable with subtle type-aware card edges and badges for Vocabulary, Academic, Content, Related, Glossary, Grammar, and Junior High.

Reference level colors must stay consistent and visually distinct anywhere levels appear: Level 1 green, Level 2 teal, Level 3 blue, Level 4 purple, Level 5 orange, Level 6 red. The source tree hierarchy is `Level -> Unit -> Vocabulary/Grammar`; Vocabulary nests Vocabulary 1, Vocabulary 2, Academic, and Glossary, and Grammar nests grammar-point cards.

Leo's Reference confidence state is stored locally in the same shape expected for Supabase. The browser key is `leea.referenceConfidence.v1`; its value is a map of `ReferenceConfidenceRecord` objects keyed by `wordId`. Keep the record fields aligned with the expanded confidence shape below. Older bare word-ID arrays are migration-only and should not be written by new code.

Search ranking should prefer direct word/title matches, then meaning/rule/pattern matches, then exact source/type tags. Broad lesson/topic tags should not cause unrelated cards from the same section to appear for a shorter query.

Search/browse result item types should route to their reference views:

```text
vocabulary -> vocabulary card
academic -> academic card
glossary -> glossary/support card
grammar -> grammar chart/card
junior-high -> Sanseido link from u
```

## Content Validation

Run this after changing reference content:

```bash
npm run validate:content
```

The validator checks:

- vocabulary IDs, ID lists, and `vocabulary-index.json`
- required Japanese display fields on vocabulary cards
- rich academic-card fields, exactly three `when_to_use` contexts, collocation counts, non-examples, and `miniQuiz.options[]`
- grammar-card Japanese fields
- Sanseido junior-high `{ "w", "u" }` search-only entries
- every lesson JSON in the unit `lessons/` folder is imported by `src/data/lessons.ts` (no orphaned lesson files)
- every `mode: "learner"` lesson's component ends with `-app` and has a matching teacher lesson with the base component in the same course/level/unit (so the buttons surface on the teacher card)

If the validator fails, fix the content or update this documented model in the same change.

## Academic Cards

Academic words are thinking and study terms from Lesson Planner "Academic Language" sections, such as analyze, clause, contraction, accuracy, sequence, definition, description, and details. They are reused across units and subjects, so each academic word has one global `type: "academic"` card with multiple `sources[]` as needed.

Academic routing is by `type`, not tags. A `type: "academic"` item always renders the rich academic card, even when the word appears inside a lesson.

Academic rich cards use the light-card base fields plus these required fields:

- `meaning`
- `jp_meaning`
- `when_to_use`: exactly three contexts, one test context, one school context, and one real-world context
- `jp_when_to_use`
- `how_to_use`: `{ "structure": string, "patterns": string[] }`
- `jp_how_to_use`
- `examples`: each with `{ "en": string, "jp": string, "context": "test" | "school" | "real-world" }`
- `collocations`: five to six common partner phrases
- `jp_note`
- `practice_prompt`
- `jp_practice_prompt`
- `nonExamples`: two to three non-examples, each with `{ "en": string, "jp": string }`
- `miniQuiz`: one to two multiple-choice checks with `prompt`, English-only `options[]`, `correct`, `explanation`, and `jp`

Mini-quizzes are part of the rich academic card. They must test use, not memorized definition. Distractors should be common real learner errors. The renderer must be interactive: tap an option, color the chosen answer green if correct or red if wrong, then show the explanation. Never render the answer as a static answer key before the learner responds.

Academic tags should include `academic`, the source tag such as `OW4-U8-G1`, and a course-level academic tag such as `OW4-AC`. Japanese fields are required and should not be blank. Known confirmed Unit 8 Japanese: `analyze` = `分析（ぶんせき）する`; `clause` = `節（せつ）`. For other Japanese, Codex may draft support text, but it must stay marked for review until the parent approves it.

Japanese draft rules: use junior-high school grammar terms such as 主語, 動詞（どうし）, 節（せつ）, and 関係代名詞（かんけいだいめいし）. Use furigana only for harder kanji, inline with parentheses. Put the richest Japanese support in `jp_when_to_use`, `jp_note`, and quiz explanations. Codex drafts Japanese; parent review is required before it is treated as final.

Academic card display rules:

- source tags such as `OW4-U8-OP` and `OW4-U8-G1` appear beside the word title to save vertical space
- `syllables`, `ipa`, `partOfSpeech` / `pos`, and category render as compact pill chips
- part-of-speech chips use distinct colors for noun, verb, adverb, adjective, and mixed forms
- academic emoji should be large in the visual panel so the card does not waste empty space

Breadcrumbs are navigation, not decoration. They should be clickable links:

```text
Home -> English -> Reference -> current item
```

Breadcrumb text remains English-only.

## Current List Context

Vocabulary card view should receive a current list context so Previous and Next work.

```json
{
  "wordId": "global_relative",
  "listContext": {
    "id": "OW4-U8-V1",
    "wordIds": ["global_alone", "global_avatar", "global_relative"],
    "currentIndex": 2
  }
}
```

## Word Confidence

Leo's confidence state should be stored separately from the vocabulary reference.

Simple first version:

```json
{
  "studentId": "leo",
  "wordId": "global_relative",
  "knows": true
}
```

Expanded later:

```json
{
  "id": "reference-confidence-leo-global_relative",
  "studentId": "leo",
  "wordId": "global_relative",
  "knows": true,
  "confidence": "known",
  "markedKnownAt": "2026-06-06T00:00:00.000Z",
  "sourceContext": "OW4-U8-V1",
  "createdAt": "2026-06-06T00:00:00.000Z",
  "updatedAt": "2026-06-06T00:00:00.000Z"
}
```

Possible confidence values:

```text
new
learning
known
needs-review
```

## Academy Stats

Home dashboard stat cards should read from named variables, not inline numbers.

Current starter variables:

```ts
totalWords = 312
grammarPoints = 24
knownWords = 186
wordsToReview = 42
```

Later these should be calculated from reference data plus Leo's Supabase progress/confidence records.

`src/data/registry.ts` also exports `academyStats` which includes `liveLessons` and `assignedLessons`. These two fields are currently hardcoded placeholder stubs (`liveLessons: 3`, `assignedLessons: 2`) — they are not wired to real lesson or assignment data yet. Do not copy these hardcoded values into other components. When the stats UI is built, replace them with computed values from `lessons.ts` and `assignments.ts`.

## Grammar Reference

Grammar points live separately from vocabulary and can be reused at the top of every grammar practice tab.

Course/unit grammar source data lives beside the unit vocabulary data:

```text
content/subjects/english/courses/our-world/level-4/unit-8/grammar.json
```

Current Unit 8 grammar points:

```text
OW4-U8-G1 - Describing people with who
OW4-U8-G2 - Direct and indirect objects
```

```json
{
  "id": "ow_l4_u8_g1_who_clauses",
  "subject": "english",
  "course": "our-world",
  "level": 4,
  "unit": 8,
  "component": "grammar-1",
  "lessonId": "ow-l4-u8-grammar-1",
  "tag": "OW4-U8-G1",
  "title": "Describing people with who",
  "shortName": "who clauses",
  "rule": "Use who to give more information about a person.",
  "pattern": "person + who + verb phrase",
  "chart": {
    "title": "Use who to describe people",
    "intro_examples": [
      { "text": "I have a classmate who likes math.", "jp": "" }
    ],
    "rows": [
      { "form": "One person", "pattern": "person + who + singular verb", "example": "The girl who sits next to me is smart.", "jp": "" }
    ],
    "note_rule": "Who connects a person to extra information about that person.",
    "note_exception": "",
    "note_exception_detail": ""
  },
  "tab1_samples": [
    { "text": "I have a classmate who likes math.", "jp": "" }
  ],
  "tab2_levelup": {
    "rules": [
      {
        "title": "Who must describe a person",
        "jp_title": "",
        "subtitle": "Put who right after the person you want to explain.",
        "jp_subtitle": "",
        "transforms": [{ "from": "I have a classmate likes math.", "to": "I have a classmate who likes math." }],
        "examples": [{ "text": "A cousin who lives in Osaka is visiting us.", "jp": "" }]
      }
    ],
    "mixed_samples": [
      { "kind": "affirmative", "text": "I met a scientist who studies insects.", "jp": "" }
    ]
  },
  "tab3_quiz": [
    {
      "stem": ["I have a cousin ", " lives in Canada."],
      "answers": ["where", "who", "what", "when"],
      "correct": 1,
      "explanation": { "title": "Use who for people", "body": "A cousin is a person." },
      "jp": ""
    }
  ],
  "tab4_master": [
    {
      "type": "build",
      "cue": "",
      "bank": ["I", "have", "a", "friend", "who", "plays", "soccer"],
      "correct": ["I", "have", "a", "friend", "who", "plays", "soccer"],
      "jp": ""
    }
  ],
  "japanese": {
    "title": "",
    "rule": "",
    "pattern": "",
    "needsReview": true
  },
  "examples": [
    {
      "sentence": "A photographer is a person who takes photos.",
      "highlight": "who takes photos"
    }
  ]
}
```

The `chart` field may optionally include a `workbookChart` object (`GrammarWorkbookChart`) when the source is a workbook answer key. `workbookChart` holds the structured table (label, columns, rows, rule, and a `seeHowItWorks` block) so the renderer can display the original workbook chart layout. The plain `chart` fields (`intro_examples`, `rows`, `note_rule`) are always required alongside it.

Grammar cards always use the four-tab model:

```text
Tab 1 - Chart & Samples
Tab 2 - Level Up
Tab 3 - Quiz
Tab 4 - Master Quiz
```

Tabs 1-3 read the global Japanese ON/OFF shell setting. Tab 4 reveals Japanese automatically after each answered question, regardless of toggle state. There is no duplicate card-level Japanese button.

## Lesson Assembly

Teacher lessons are Neritan-facing teaching experiences. They are allowed to be specific: an opener can be a slide deck, a grammar lesson can be a workbook-style chart flow, and a reading lesson can be an annotation experience.

Do not force every teacher lesson into one generic template. Keep the lesson registry/metadata consistent, but let the lesson surface fit the source material and Leo's needs.

```json
{
  "id": "ow-l4-u8-opener",
  "subject": "english",
  "course": "our-world",
  "level": 4,
  "unit": 8,
  "component": "opener",
  "mode": "teacher",
  "title": "Unit 8 Opener",
  "status": "draft",
  "source": {
    "type": "html-slides",
    "file": "opener (1).html",
    "embedPath": "/lessons/ow-l4-u8-opener.html",
    "slideCount": 21
  }
}
```

Reusable activity blocks are still useful, but they should emerge from repeated patterns:

- grammar chart
- vocabulary card/reveal
- mini quiz
- sort/match
- caption writing
- teacher note
- Leo response/check
- progress/save

Teacher lessons are for Neritan to teach. Learner lessons and review cards are for Leo's independent homework/practice.

Learner apps should be registered as separate `mode: "learner"` lessons, not folded into the teacher lesson record. Uploaded standalone HTML apps can live in `public/learn/...` and keep their own local progress keys while the surrounding LEEA route provides assignment, review, and later Supabase wiring.

Learner app `source` fields describe how LEEA reads the app's local progress:

- `storagePrefix` — full localStorage key prefix the app writes under, such as `leea-4-8-vocab-1-`
- `moduleCount` — number of modules/tabs
- `moduleKeyFormat` — done-key pattern appended to the prefix; `{n}` is 1-based, `{i}` is 0-based; default `m{n}-done` (opener style), the vocab app uses `tab-{i}-done`
- `moduleKeys` — explicit per-module done-key suffixes, takes precedence over `moduleKeyFormat`; use when module IDs are non-numeric (`"ma"`) or the suffix is not `-done` (the song app uses `["m1-complete", "m2-complete", "ma-complete", "m3-complete", "m4-complete", "m5-complete", "m6-complete"]`)
- `moduleLabels` — display labels per module, in order; falls back to `Module N`
- `scoreKey` — quiz score key after the prefix, default `score`; the song app stores the quiz at `m6-score`
- `homeworkId` — the app's homework namespace; LEEA also treats `leea-{homeworkId}-done` as the done flag
- `captionKey` — key after the prefix holding Leo's written caption, if the app has one (opener: `m5-caption`)

**Song app example** (non-numeric module IDs + non-default score key):

```json
{
  "storagePrefix": "leea-4-8-song-",
  "moduleCount": 7,
  "moduleKeys": ["m1-complete", "m2-complete", "ma-complete", "m3-complete", "m4-complete", "m5-complete", "m6-complete"],
  "moduleLabels": ["Listen & Sing", "Song Words", "Academic Words", "Word Review", "Use It Again", "Write a Line", "Quiz"],
  "scoreKey": "m6-score",
  "homeworkId": "leo-4-8-song"
}
```

Score is rendered as a percent. The reader prefers `scoreData.percent`, falls back to `Math.round(score / total * 100)` if both are present, and only treats `score` as a percent for legacy apps that omit `total`.

A learner lesson with `status: "live"` is not auto-assigned — Neritan assigns it from the teacher card. Use `status: "assigned"` only when the app should be homework immediately on load.

Leo mode should stay scalable as more units and levels are added: group learner apps by course/level/unit in collapsible sections, and show component cues with emoji plus color-coded chips/edges for opener, vocabulary, grammar, reading, writing, and review. The list shows every learner lesson, not only assigned ones — the hero handles "what to do now", the list handles "Leo's full library to revisit".

A learner app can be auto-assigned by setting its lesson JSON `status` to `assigned` — `seedAssignments` picks this up on load. The Teacher Menu Assign button also writes the same assignment record to local storage. Home should surface assigned learner homework first. If no learner homework is waiting, Home should show Coming Up Next from unfinished current-unit work. Later, assignment state should also sync to Supabase.

On the Neritan Teacher Menu, learner apps do not render as their own cards. The teacher slide card for the same component carries the app controls (Assign/Assigned, Review, Unassign) inside a tinted "Leo's App" group, next to the teaching controls Open and Mark Done. The pairing rule is component naming: teacher `opener` ↔ learner `opener-app` within the same course/level/unit. Register new learner apps with the `{component}-app` component name or their buttons will not appear on the teacher card.

Home current-focus progress counts unique unit components, not raw teacher/learner routes. A teacher slide lesson and a Leo learner app for the same component should appear as one lesson/component in Home progress.

The local assignment/review loop should exist before Supabase is wired: Neritan assigns a learner app, Leo completes it, Neritan reviews saved module/score/caption progress, and the assignment status becomes `reviewed` or `needs-redo`. The local record should stay close to the future Supabase rows.

Navigation ownership:

- Home is the high-level launcher for all subjects and modes.
- English owns the detailed course, level, and unit browser.
- Neritan's Teacher Menu owns teaching controls and lesson completion tracking.

Teacher lesson progress is tracked under Neritan. The first version can be local storage, but it should match a future Supabase `lesson_progress` row:

```json
{
  "lessonId": "ow-l4-u8-opener",
  "teacherId": "neritan",
  "studentId": "leo",
  "status": "done",
  "completedAt": "2026-06-08T00:00:00.000Z",
  "updatedAt": "2026-06-08T00:00:00.000Z"
}
```

## Assignment

Assignments connect Neritan view and Leo view.

```json
{
  "id": "assignment_ow4_u8_v1_leo",
  "studentId": "leo",
  "lessonId": "ow-l4-u8-vocab-1",
  "assignedBy": "neritan",
  "status": "assigned",
  "dueDate": null,
  "progress": 0
}
```
