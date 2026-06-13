# Vocab — Scan, Build, Wire

How to take a unit's vocabulary from the planner PDF into a fully wired set of LEEA reference cards.

For the schema reference, see `docs/content-model.md`. For PDF page math, see `docs/pdf-mapping.md`. This doc is the workflow.

## Word types in one unit

Each NatGeo unit has several word groups. They map to LEEA word types:

| PDF section | LEEA type | Example tag |
|---|---|---|
| Vocabulary 1 (left column of vocab-1 spread) | `vocabulary` | `OW4-U8-V1` |
| Vocabulary 2 (left column of vocab-2 spread) | `vocabulary` | `OW4-U8-V2` |
| Academic Language (sidebar of any teacher page) | `academic` | source + `OW<level>-AC` |
| Content Vocabulary (sidebar of any teacher page) | `content` | source tag of that page |
| Words shown but not target (related photos/captions) | `related` | source tag |

Glossary/support words are reserved for tooltips and quick cards. The type exists in code but no glossary cards exist yet. Skip unless the planner explicitly calls them out.

## Step 1 — Scan vocab from the PDF

Read every page of the unit. For each spread, copy from the **left column**:

- For vocab-1 / vocab-2 pages: the "Vocabulary 1" or "Vocabulary 2" word list (verbatim)
- For all teacher pages (opener, song, grammar, reading, writing): the "Academic Language" and "Content Vocabulary" lists

Capture per word:
- Exact spelling and any multi-word phrase form (e.g. `take photos`, `comic book`)
- The source — which component the word came from
- Whether it is target vocab, academic, content, or related

Write a scratch list before touching JSON. Confirm it against the planner's Scope and Sequence chart at the front of the PDF.

## Step 2 — Build vocabulary.json

Location: `content/subjects/english/courses/<course>/level-<n>/unit-<n>/vocabulary.json`

Each word becomes one object in `words[]`. Use the clean schema only — do not write the legacy flat fields (`emoji`, `sample`, `jp_word`, `jp_reading`, `jp_sentence`, `jp_tags`).

```json
{
  "id": "global_<normalized_word>",
  "type": "vocabulary",
  "word": "alone",
  "normalizedWord": "alone",
  "displayEmoji": "🧍",
  "emojiDescription": "person standing alone",
  "partOfSpeech": "adjective/adverb",
  "syllables": "a-lone",
  "meaning": "without other people",
  "example": "Sometimes I like to read alone.",
  "japanese": {
    "word": "ひとりで",
    "reading": "ひとりで",
    "meaning": "他の人と一緒ではなく、自分だけで。",
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
  "tags": ["vocabulary", "target", "vocab-1", "<theme>", "OW4-U8-V1"]
}
```

Notes:
- `id` uses `global_` prefix so the same word in another unit becomes a second `sources[]` entry on the same card — never a duplicate card
- `normalizedWord` is the word in lowercase, no punctuation, multi-word phrases joined with spaces (`take photos`)
- `displayEmoji` is the visual; one emoji is the common case, but the field is a plain string — multi-emoji values like `"🔋⚡"` are allowed when two emojis help picture the word
- `emojiDescription` is what the emoji shows
- `japanese.needsReview: true` until the parent has confirmed the Japanese
- `tags[]` should include the type, the component name, a topical tag, and the source tag

Update the unit's word ID lists at the top of the file:

```json
{
  "wordIds":         ["global_alone", "global_avatar", ...],
  "vocab1WordIds":   ["global_alone", "global_avatar", ...],
  "vocab2WordIds":   ["global_bug", ...],
  "academicWordIds": ["global_analyze", "global_clause", ...],
  "contentWordIds":  ["global_trilobite", ...],
  "relatedWordIds":  ["global_musical_instrument", ...]
}
```

Every word in `words[]` must appear in `wordIds`. Every word in a sub-list must also be in `wordIds`.

## Step 3 — Wire to reference indexes

Add every new word ID to:

```text
content/subjects/english/reference/vocabulary-index.json
```

It is a flat list under `words`. The validator fails if `wordIds` and the index are out of sync.

Then in `src/data/reference.ts`, add unit-specific filter exports if this is a new unit:

```ts
export const unit8Vocab1Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((s) => s.tag === "OW4-U8-V1")
);
```

Pattern: one filter per component vocab list, one filter for the unit's academic words, one for content/related/glossary. Other unit filter exports already exist — copy that pattern.

If a new course or level is introduced, the source tree in `ReferencePage.tsx` also needs a new branch. Do not leave placeholder labels pointing back to `/reference`.

## Step 4 — Validate

```bash
npm run validate:content
```

The validator checks:
- every word has the required fields (id, type, word, normalizedWord, meaning, example, displayEmoji-or-emoji)
- nested `japanese.word`, `japanese.reading`, `japanese.meaning` present
- non-empty `sources[]` with `subject`, `course`, `component`, `tag` on each
- non-empty `tags[]`
- `wordIds` and `vocabulary-index.json` agree

For `type: "academic"` words, the validator is stricter — see `docs/content-model.md` for the rich academic schema (three `when_to_use` contexts, 5–6 collocations, miniQuiz, etc.).

If validation fails, fix the data or update the documented schema. Do not weaken the validator.

## Source tag format

```text
OW<level>-U<unit>-<component>     e.g. OW4-U8-V1, OW4-U8-G1, OW4-U8-OP
OW<level>-AC                       course-level academic tag
JF<year>-L<lesson>-U<unit>-V<n>   Joyful Work
TG-<topic>-<sub>                   Training Ground
```

The component code maps:
- `V1` vocab-1, `V2` vocab-2
- `G1` grammar-1, `G2` grammar-2
- `OP` opener
- `SG` song
- `RD` reading
- `WR` writing
- `MI` mission (end-of-unit mission section)
- `PJ` project (end-of-unit project section)
- `RDR` unit reader (the bundled NatGeo reader book, distinct from `RD` reading)

For mission/project/reader sources, omit `lessonId` (these sections do not have their own teacher lessons or Leo apps) and use `component: "mission" | "project" | "reader"` in `sources[]`.

Always include the source tag in `sources[].tag` AND in `tags[]`. Search uses both.
