# vocab

Scan one unit's vocabulary from the planner PDF, build `vocabulary.json`, wire it to Reference search, source tree, and indexes, then validate.

## Usage

```
/vocab <course-path> <unit-number>
```

Examples:

```
/vocab english/our-world/level-4 7
/vocab english/our-world/level-5 3
/vocab english/joyful-work/year-2 4
```

The first arg is the path under `docs/lesson-plans/` (so the planner PDF is at `docs/lesson-plans/<course-path>/planner.pdf`). The second is the unit number.

## What this skill does

Follows `docs/vocab.md` end to end:

1. Read `docs/lesson-plans/<course-path>/index.json` → find the unit's PDF page range and `pdf_offset`
2. Read the unit's pages from `planner.pdf` (in batches of max 20)
3. Extract every word group: Vocabulary 1, Vocabulary 2, Academic Language, Content Vocabulary, Related Vocabulary, plus any Mission / Project / Reader section content words
4. Present a **scratch list** grouped by type with source tags — pause for user approval
5. After approval: build `content/subjects/english/courses/<course>/level-<n>/unit-<n>/vocabulary.json`
6. For words that already exist as `global_<id>` in another unit, **do not duplicate** — those words go into the unit's `wordIds` / sub-lists with a fresh `sources[]` entry pointing at this unit. The cross-unit merge happens at runtime in `reference.ts` and at validation time in `scripts/validate-content.mjs`
7. Update `content/subjects/english/reference/vocabulary-index.json` with new IDs
8. Update `src/data/reference.ts`:
   - Import the new unit vocabulary file
   - Add it to `mergeWordsAcrossUnits([...])`
   - Add four filter exports: `unit<N>Vocab1Items`, `unit<N>Vocab2Items`, `unit<N>AcademicItems`, `unit<N>GlossaryItems`
9. Update `scripts/validate-content.mjs`:
   - Add the new unit path to `unitVocabularyPaths`
10. Update `src/components/ReferencePage.tsx` source tree:
    - Add a sibling node under the matching Level / Course for the new unit
    - Same five sub-sections: Vocabulary 1 / Vocabulary 2 / Grammar / Academic / Glossary
    - Grammar shows a placeholder if `grammar.json` for this unit does not exist yet
    - Keep the existing build target open by default; the new unit collapses unless it is the current target
11. Update `docs/lesson-plans/<course-path>/index.json` for this unit with the verified page range and `pdf_offset` if the entry is empty or still has `pdf_offset: 0` from an excerpt
12. Run `npm run validate:content` and `npx tsc --noEmit`
13. Commit with a clear message and push to the current working branch

## Word schema (clean — no legacy flat fields)

```json
{
  "id": "global_<normalized>",
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
      "unit": 7,
      "component": "vocab-1",
      "lessonId": "ow-l4-u7-vocab-1",
      "tag": "OW4-U7-V1",
      "lessonStatus": "draft"
    }
  ],
  "tags": ["vocabulary", "target", "vocab-1", "<theme>", "OW4-U7-V1"]
}
```

`japanese.needsReview` stays `true` until the parent has confirmed the Japanese draft.

For mission / project / reader content words, **omit `lessonId`** (there is no teacher lesson) and use `component: "mission" | "project" | "reader"` with tag `OW<level>-U<unit>-MI | -PJ | -RDR`.

## Academic words — rich schema required

For `type: "academic"`, the validator requires the full rich card:

- `meaning`, `jp_meaning`
- `when_to_use` — exactly 3 entries, one each for `test`, `school`, `real-world`
- `jp_when_to_use` — same 3 contexts
- `how_to_use` — `{ structure, patterns[] }` (patterns non-empty)
- `jp_how_to_use` — `{ structure }` (`needsReview: true`)
- `examples` — 3+ entries each `{ en, jp, context }` with context in the same 3 values
- `collocations` — 5–6 strings
- `nonExamples` — 2–3 entries each `{ en, jp }`
- `practice_prompt`, `jp_practice_prompt`
- `jp_note`
- `miniQuiz` — 1+ entries each `{ prompt, options[], correct, explanation, jp }`
- Flat duplicates also required by the validator: `jp_word`, `jp_reading`, `jp_sentence`, `jp_meaning`, `jp_note`, `jp_practice_prompt`
- `tags[]` must include `OW<level>-AC` AND every source tag in this card's `sources[]`

Take the academic word's depth seriously — the rich card is the main academic teaching surface.

## Source-tag codes

| Code | Section | Level band |
|---|---|---|
| `V1` | vocab-1 | all |
| `V2` | vocab-2 | all |
| `G1` | grammar-1 | all |
| `G2` | grammar-2 | all |
| `OP` | opener | all |
| `SG` | song | all |
| `RD` | reading | all |
| `WR` | writing | all |
| `MI` | mission | **Levels 4-6 only** |
| `VL` | value | **Levels 1-3 only** |
| `LT` | let's talk | **Levels 4-6 only** |
| `PJ` | project | all |
| `RDR` | unit reader | all |

Format: `<COURSE><LEVEL>-U<UNIT>-<CODE>` e.g. `OW4-U7-V1`, `OW2-U3-VL`, `OW5-U2-LT`.
Course-level academic tag: `<COURSE><LEVEL>-AC` e.g. `OW4-AC`.

**Important:** Use `MI` only when the planner page actually labels the section **MISSION** (Levels 4-6). Use `VL` when it says **VALUE** (Levels 1-3). Never invent a Mission tag for a Level 1-3 unit.

## Step-by-step

### Step 1 — Verify the planner PDF

Read `docs/lesson-plans/<course-path>/index.json`. If the unit's entry is empty or the unit start has not been verified, read the candidate first page of the unit in `planner.pdf` to confirm.

If `planner.pdf` is a Git LFS pointer (very small file), tell the user the PDF is not pushed yet and show them the `git lfs pull` or local cp + push command. Stop.

### Step 2 — Read unit pages

Compute absolute pages from `pdf_offset + section pages`. Read all pages from opener through writing (max 20 per Read call). Also read mission / project / reader / extra pages at the end of the unit if they exist — that is where extra Content Vocabulary lives.

### Step 3 — Extract word lists

For each spread:
- Left column: Vocabulary 1 / Vocabulary 2 list (when on a vocab page), Academic Language list, Content Vocabulary list, Related Vocabulary
- Confirm against the Scope and Sequence chart at the front of the PDF if accessible

### Step 4 — Present scratch list

Show the user a grouped scratch list:

- Vocabulary 1 (count) — list
- Vocabulary 2 (count) — list
- Academic Language (count) — each with source(s)
- Content Vocabulary (count) — each with source(s)
- Related Vocabulary (count) — each with source(s)
- Total

Flag any words that already exist as `global_<id>` in another unit's `vocabulary.json` — those will merge sources rather than duplicate.

**Wait for user approval.** Do not write JSON until the user confirms.

### Step 5 — Assign emojis

For each word, pick a `displayEmoji`. The field is a string — one or more emojis are allowed. Use a multi-emoji string like `"🔋⚡"` when two emojis genuinely help a learner picture the word; use one when one is enough. If a word has no obvious emoji (abstract terms like `typical`, `simple`, `use`), pick a defensible one and call it out for the user. The user may correct it before approval.

### Step 6 — Build vocabulary.json

Create `content/subjects/english/courses/<course>/level-<n>/unit-<n>/vocabulary.json` with:

- Header: `schemaVersion`, `subject`, `course`, `level`, `unit`, `unitTitle`, `source` block
- ID lists: `wordIds`, `vocab1WordIds`, `vocab2WordIds`, `academicWordIds`, `contentWordIds`, `relatedWordIds`
- `words[]` — full objects in the clean schema

### Step 7 — Wire to indexes and React

In order:

1. Append new IDs to `content/subjects/english/reference/vocabulary-index.json` (skip any that are already present from another unit)
2. Add the new unit's vocabulary path to `sourceFiles[]` in the index
3. Update `src/data/reference.ts`:
   - `import unit<N>Vocabulary from "../../content/.../unit-<n>/vocabulary.json"`
   - Add to the `mergeWordsAcrossUnits([...])` call
   - Add four `unit<N>*Items` filter exports modeled on the existing pattern
4. Update `scripts/validate-content.mjs`:
   - Add the new unit path to `unitVocabularyPaths`
5. Update `src/components/ReferencePage.tsx`:
   - Import the four new filter exports
   - Add a new `<details>` node under the matching Level with five sub-sections (Vocab 1 / Vocab 2 / Grammar / Academic / Glossary)
   - Grammar shows placeholder if no `grammar.json` yet
6. Update `docs/lesson-plans/<course-path>/index.json` if the unit's page range or `pdf_offset` were not yet verified

### Step 8 — Validate

```bash
npm run validate:content
npx tsc --noEmit
```

Fix any errors. Do not weaken the validator or the type checker.

### Step 9 — Commit and push

Commit message format:

```
Add Unit <n> vocabulary (<word count> words) and wire to Reference search

<one paragraph summary of what's in the file, dedupes, source tag codes used>

https://claude.ai/code/session_01LSVuC4UycupLr2DsLV8Pxd
```

Push to the current working branch. Do not create a PR automatically — the user merges when ready.

## Output checklist

- [ ] `vocabulary.json` created at correct path with N words
- [ ] All Japanese fields drafted with `needsReview: true`
- [ ] `vocabulary-index.json` updated (only new IDs)
- [ ] `reference.ts` imports + filter exports added
- [ ] `validate-content.mjs` path list updated
- [ ] `ReferencePage.tsx` source tree updated
- [ ] `docs/lesson-plans/.../index.json` unit entry verified
- [ ] `npm run validate:content` passes — report the new card count
- [ ] `npx tsc --noEmit` clean
- [ ] Commit + push to working branch

## Important constraints

- Never modify `src/lib/supabase.ts`
- One global card per word, merged across units by `id` — never create duplicate cards for the same word
- Japanese drafts must be careful and marked `needsReview: true` — the parent confirms
- Academic words require the full rich schema (see above)
- Do not register academic words without the `OW<level>-AC` tag
