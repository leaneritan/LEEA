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

Japanese fields are required for learning cards and charts, but they may begin as empty `needsReview` placeholders until reviewed.

Cards and charts read the global Japanese ON/OFF setting from the app shell. Avoid duplicate per-card Japanese toggles.

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

I Know and I Don't Know are student-specific views built from Leo's confidence/progress state.

Search should match:

- English word/title
- normalized word
- Japanese word
- Japanese reading
- meaning/definition
- tags/source labels

Search results should deduplicate by global item id and show all matching source tags.

Search/browse result item types should route to their reference views:

```text
vocabulary -> vocabulary card
academic -> academic card
glossary -> glossary/support card
grammar -> grammar chart/card
```

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
  "studentId": "leo",
  "wordId": "global_relative",
  "confidence": "known",
  "markedKnownAt": "2026-06-06T00:00:00.000Z",
  "sourceContext": "OW4-U8-V1"
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

Grammar cards always use the four-tab model:

```text
Tab 1 - Chart & Samples
Tab 2 - Level Up
Tab 3 - Quiz
Tab 4 - Master Quiz
```

Tabs 1-3 read the global Japanese ON/OFF shell setting. Tab 4 reveals Japanese automatically after each answered question, regardless of toggle state. There is no duplicate card-level Japanese button.

## Lesson Assembly

Lessons are ordered block lists.

```json
{
  "id": "ow-l4-u8-vocab-1",
  "subject": "english",
  "course": "our-world",
  "level": 4,
  "unit": 8,
  "component": "vocab-1",
  "title": "Vocabulary 1",
  "status": "draft",
  "blocks": [
    {
      "type": "wordCard",
      "wordId": "global_alone"
    },
    {
      "type": "chooseWithFeedback",
      "id": "alone-meaning-check"
    }
  ]
}
```

Teacher lessons are for Neritan to teach. Learner lessons and review cards are for Leo's independent homework/practice.

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
