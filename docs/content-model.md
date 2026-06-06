# Content Model Draft

This is a first draft. It is intentionally small and editable.

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

Home subject panels should support persisted collapsed/expanded state.

```json
{
  "studentId": "leo",
  "homeSubjectPanels": {
    "english": true,
    "math": false,
    "science": false
  }
}
```

`true` means expanded. `false` means collapsed.

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

```json
{
  "id": "global_clause",
  "type": "academic",
  "word": "clause",
  "normalizedWord": "clause",
  "emoji": "🧩",
  "ipa": "/klɔːz/",
  "syllables": "clause",
  "partOfSpeech": "noun",
  "meaning": "A group of words that has a subject and a verb.",
  "example": "The clause who collects fossils tells us more about the boy.",
  "japanese": {
    "word": "節",
    "reading": "せつ",
    "meaning": "主語と動詞を含む語のまとまり。"
  },
  "sources": [
    {
      "subject": "english",
      "course": "our-world",
      "level": 4,
      "unit": 8,
      "component": "grammar-1",
      "lessonId": "ow-l4-u8-grammar-1",
      "tag": "OW4-U8-G1"
    }
  ],
  "tags": ["academic", "grammar", "OW4-U8-G1"]
}
```

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

## Grammar Reference

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
  "japanese": {
    "title": "who を使って人を説明する",
    "rule": "人について、さらに説明を加えるときに who を使います。",
    "pattern": "人 + who + 動詞句"
  },
  "examples": [
    {
      "sentence": "A photographer is a person who takes photos.",
      "highlight": "who takes photos"
    }
  ]
}
```

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
