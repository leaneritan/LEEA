# vocab-unit-scanner

Scan one unit's vocabulary from the planner PDF, build `vocabulary.json`, wire it to Reference search, source tree, and indexes, then validate.

> **Naming note:** this skill is the **unit-level vocab scanner**. Future related skills (e.g. `/vocab-1-app`, `/song-app`, `/grammar-1-app`) build the per-lesson teacher slides + Leo apps that consume the `vocabulary.json` this skill produces.

## Usage

```
/vocab-unit-scanner <course-path> <unit-number>
```

Examples:

```
/vocab-unit-scanner english/our-world/level-4 7
/vocab-unit-scanner english/our-world/level-5 3
/vocab-unit-scanner english/joyful-work/year-2 4
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
10. Update `src/components/reference/ReferenceBrowse.tsx` source tree:
    - Add a sibling node under the matching Level / Course for the new unit
    - Same five sub-sections: Vocabulary 1 / Vocabulary 2 / Grammar / Academic / Glossary
    - Grammar shows a placeholder if `grammar.json` for this unit does not exist yet
    - Keep the existing build target open by default; the new unit collapses unless it is the current target
11. **Build the Unit Reference page** (`UnitReference<N>.tsx` + route + `UNIT_REFERENCE_PAGES` entry) — see "Unit Reference page — required every time" below. This is not optional polish; without it, clicking a vocabulary group in the tree silently falls back to a single word card instead of the unit overview.
12. Update `docs/lesson-plans/<course-path>/index.json` for this unit with the verified page range and `pdf_offset` if the entry is empty or still has `pdf_offset: 0` from an excerpt
13. Run `npm run validate:content` and `npx tsc --noEmit`
14. Commit with a clear message and push to the current working branch

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
  "ipa": "əˈloʊn",
  "meaning": "without other people",
  "example": "Sometimes I like to read alone.",
  "exampleJp": "私は時々一人で読書をするのが好きです。",
  "additionalExamples": ["She walked home alone after practice."],
  "additionalExamplesJp": ["彼女は練習の後、一人で家に歩いて帰りました。"],
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

### Required fields the WordCard depends on — never skip these

The Reference word card (`src/components/reference/WordCard.tsx`) renders pronunciation, syllables, and bilingual examples directly from this schema. A word missing any of these renders a visibly broken/incomplete card, so every new word built by this skill MUST include:

- **`ipa`** — required, no exceptions. This drives the `/ipa/ · US` pronunciation line and is what makes the audio/IPA row render at all. Use standard US IPA transcription. If genuinely unsure of a transcription, flag it for the user rather than guessing wildly — but do not omit the field.
- **`syllables`** — required (already enforced), drives the syllable pill chips (`col` / `lect` style) and the "N syllables" count.
- **`exampleJp`** — required whenever `example` is set. Every English example sentence needs a matching Japanese translation; the card shows them stacked (EN above, JP below) when the Japanese toggle is on (default ON for all learners).
- **`additionalExamplesJp`** — required, one per entry in `additionalExamples`, same array order.
- If the word has `additionalMeanings` (a second sense), each entry should include a `jp` field translating that sense — not just the primary meaning.

**Rule of thumb: if a learner-facing English string exists, a Japanese counterpart exists too** (`needsReview: true` until confirmed). This was a recurring gap in Units 6-8 that had to be backfilled after the fact — building it correctly the first time during scanning avoids that rework.

**All of the above is now enforced by `npm run validate:content`, not just this checklist** — `scripts/validate-content.mjs` fails the build if a word is missing `ipa`/`syllables`/`exampleJp`, has mismatched `additionalExamples`/`additionalExamplesJp` lengths, has `ipa` with the slashes already baked in (they get double-added by the card), or has an example sentence that won't actually highlight its target word (see "Example sentences must actually highlight" below). Run the validator as you go, not just at the end — it will catch a gap immediately instead of it surfacing later as a visual bug someone has to notice by eye.

### Example sentences must actually highlight the target word

`WordCard.tsx`'s `highlightWord()` bolds the target word inside each example sentence by searching for `normalizedWord` (not `word` — `word` often carries an article like "a creature" or joins a phrase with underscores like "sea_sponges", neither of which appears verbatim in a sentence). This means every example sentence you write must use the **same word form** as `normalizedWord`:

- If `normalizedWord` is `"battery"`, the sentence must contain "battery" (or "battery" + a suffix like "-ies" won't match "batteries" — keep it singular, or match irregular plurals aren't handled, so avoid them)
- If `normalizedWord` is a multi-word phrase joined with `_` (e.g. `"pop_top"`, `"sea_sponges"`), the sentence can use either a space or a hyphen ("pop-top" or "pop top" both match) — but not a different word form (don't write "popping the top")
- Avoid tense/number shifts that break the literal match: don't write "took photos" for a word whose `normalizedWord` is `"take photos"`, don't write "polyp" (singular) for `"polyps"` (plural)
- This check only applies to `type: "vocabulary" | "content" | "related" | "glossary"` words — academic words render their examples from the separate `examples.{test,school,real-world}` schema, not the base `example`/`additionalExamples` fields, so this rule doesn't apply to them

If the validator flags "does not contain a highlightable form of X," don't fight the regex — simplify the sentence to use the word's base form instead.

For mission / project / reader content words, **omit `lessonId`** (there is no teacher lesson) and use `component: "mission" | "project" | "reader"` with tag `OW<level>-U<unit>-MI | -PJ | -RDR`.

## Unit Reference page — required every time

**Standing product rule: in every level, clicking Vocabulary 1, Vocabulary 2, Academic, or Glossary under any unit in the Reference tree must open that unit's Unit Reference overview page (with the browser jumping to the matching section anchor) — never a single word card.** This must be true for every unit in every level, with no exceptions and no "we'll get to it later."

This behavior is wired through two things that MUST both exist for a unit, or the tree silently degrades to a per-word fallback link (`/reference/word/<firstWordId>`) with no error or warning:

1. A `UnitReference<N>.tsx` component (e.g. `UnitReference7.tsx`) + its route at `src/app/reference/<course>/level-<n>/unit-<n>/page.tsx`
2. A `"<level>-<unit>": "/reference/<course>/level-<n>/unit-<n>"` entry in `UNIT_REFERENCE_PAGES` inside `src/components/reference/ReferenceBrowse.tsx`

If either is missing, `VocabGroupLeaf` in `ReferenceBrowse.tsx` falls back silently — nothing breaks, nothing logs, it just quietly links to the wrong place. Always verify both pieces exist before calling a unit scan done.

### Building `UnitReference<N>.tsx`

Copy the shape of the existing `src/components/UnitReference.tsx` (Unit 8) or `src/components/UnitReference7.tsx` — they are the reference pattern. Each unit gets its own file (data is hardcoded per unit for now; do not try to genericize this into one parametrized component unless the user asks for that refactor explicitly). For the new unit's file:

- Pull `unitTitle`, and the `vocab1WordIds` / `vocab2WordIds` / `academicWordIds` / `contentWordIds` + `relatedWordIds` (content + related merge into the "Glossary" section) straight from the unit's `vocabulary.json` — do not re-derive or guess word data, read it from the JSON you just built
- Sections in this exact order: Vocabulary 1, Vocabulary 2, Academic, Glossary, then Grammar (only if `grammar.json` exists for this unit — omit the Grammar section entirely if it doesn't, same as `UnitReference7.tsx` does)
- Academic words link to `/reference/academic/<id>` (they're `type: "academic"`); everything else links to `/reference/word/<id>`
- Section `id`s must be `vocab1` / `vocab2` / `academic` / `glossary` / `grammar` — these are the anchors `ReferenceBrowse.tsx` jumps to, do not rename them
- Update the `crumbs` prop on `<AppShell>` to `["Reference", "Our World", "Unit <N>"]` (or the matching course label)

### Wiring the route and the tree

1. Create `src/app/reference/<course>/level-<n>/unit-<n>/page.tsx`:
   ```tsx
   import UnitReference<N> from "@/components/UnitReference<N>";
   export default function Page() { return <UnitReference<N> />; }
   ```
2. Add the mapping to `UNIT_REFERENCE_PAGES` in `ReferenceBrowse.tsx`:
   ```ts
   "<level>-<unit>": "/reference/<course>/level-<n>/unit-<n>"
   ```

### Verify it actually works — do not skip this

A clean `tsc`/build pass does NOT prove the navigation works, because the fallback path is also valid TypeScript and also builds successfully. After building and starting the app, verify with a real click-through (Playwright is fine): expand the unit in the Reference tree, click each of Vocabulary 1 / Vocabulary 2 / Academic / Glossary, and confirm the resulting URL is `/reference/<course>/level-<n>/unit-<n>#<anchor>` — not `/reference/word/...` or `/reference/academic/...`.

### Registering the real unit title — never hardcode a guessed one

The Level tree in `ReferenceBrowse.tsx` shows every unit 1–9 (1–8 for Level 1) for every level automatically — units without a `vocabulary.json` yet render as "planned" placeholders, scanned units render with real data. **This is by design and scales as more units/levels get scanned — do not re-introduce a hardcoded per-level unit list** (a previous version of this code hardcoded Level 4 to only show units 7–9 with guessed titles like "Let's Explore!" that didn't match the real unit title "Good Idea!" in the JSON — that bug is why this note exists).

The unit title shown in the tree comes from `unitTitles` in `src/data/reference.ts`, keyed `"<level>-<unit>"`, sourced directly from each unit's own `vocabulary.json` `unitTitle` field. When you scan a new unit, add its entry to that map:

```ts
export const unitTitles: Record<string, string> = {
  [`${unit6Vocabulary.level}-${unit6Vocabulary.unit}`]: unit6Vocabulary.unitTitle,
  [`${unit7Vocabulary.level}-${unit7Vocabulary.unit}`]: unit7Vocabulary.unitTitle,
  [`${unit8Vocabulary.level}-${unit8Vocabulary.unit}`]: unit8Vocabulary.unitTitle
  // add the new unit's import here too
};
```

Never type a title by hand — always read it off the raw import (`unitN Vocabulary.unitTitle`), the same way the existing entries do, so the tree title can never drift from the source JSON.

## Academic words — rich schema required

For `type: "academic"`, the validator requires the full rich card:

- `meaning`, `jp_meaning`
- `when_to_use` — exactly 3 entries, one each for `test`, `school`, `real-world`
- `jp_when_to_use` — same 3 contexts
- `how_to_use` — `{ structure, patterns[] }` (patterns non-empty)
- `jp_how_to_use` — `{ structure }` (`needsReview: true`)
- `examples` — 3+ entries each `{ en, jp, context }` with context in the same 3 values
  - **When the word is a verb** (`partOfSpeech`/`pos: "verb"`), the 3 examples must also cover the three verb forms — one sentence using the infinitive/base form, one using the past tense, one using the past participle (e.g. a perfect-tense or passive sentence) — combined with the existing test/school/real-world context requirement (one example naturally fills both axes at once, e.g. the "school" example uses the past tense). Don't let all 3 examples sit in the same base form — see `src/data/verbForms.ts`'s `getVerbForms()` for the canonical form of any given verb (handles irregulars).
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

Compute absolute pages from `pdf_offset + section pages`. Read EVERY page of the unit, not just the eight named teaching sections.

A National Geographic *Our World* Level 4-6 unit is 30 pages. The teaching sections (opener through writing, pages 1-23) only cover the first 23 pages. The remaining 7 pages contain the **end-of-unit content sections**:

| Unit page | Section | Has Content Vocabulary? | Index key |
|---|---|---|---|
| 24 | Mission (L4-6) / Value (L1-3) | usually yes | `mission` / `value` |
| 25-26 | Project | usually yes | `project` |
| 27 | Video | resource only — skip | — |
| 28 | Unit Reader | sometimes | `reader` |
| 29-30 | Audio Script | resource only — skip | — |

The vocab scanner MUST read pages 24, 25-26, and 28 in addition to pages 1-23. The Mission/Project/Reader pages often introduce Content Vocabulary that doesn't appear anywhere else in the unit (Unit 7 had `curiosity, typical, simple, materials, recycle, ghost, vacuum, dessert` — 8 of its 19 content words came from these sections). Skipping them produces an incomplete vocabulary.json.

After reading, update `index.json` for this unit to include `mission` (or `value`), `project`, and `reader` keys with the verified page ranges. Video and Audio Script are intentionally NOT indexed (they're resource pages with no extractable content vocab).

### Step 3 — Extract word lists

For each spread:
- Left column of any teaching page: Vocabulary 1 / Vocabulary 2 list (when on a vocab page), Academic Language list, Content Vocabulary list, Related Vocabulary list
- **Mission/Project/Reader pages: explicitly look for the labeled `Content Vocabulary:` line in the left column.** Some units have it populated, others leave it empty. Empty is normal — record zero new words and move on.
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
5. Update `src/components/reference/ReferenceBrowse.tsx`:
   - Import the four new filter exports
   - Add a new `<details>` node under the matching Level with five sub-sections (Vocab 1 / Vocab 2 / Grammar / Academic / Glossary)
   - Grammar shows placeholder if no `grammar.json` yet
   - Add the unit's entry to `UNIT_REFERENCE_PAGES` (see "Unit Reference page — required every time" above)
6. Build `UnitReference<N>.tsx` + its route (see "Unit Reference page — required every time" above)
7. Update `docs/lesson-plans/<course-path>/index.json` if the unit's page range or `pdf_offset` were not yet verified

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
- [ ] Every word has `ipa` and `syllables` set
- [ ] Every `example`/`additionalExamples` has a matching `exampleJp`/`additionalExamplesJp`
- [ ] Every `additionalMeanings` entry has a `jp` translation
- [ ] All Japanese fields drafted with `needsReview: true`
- [ ] `vocabulary-index.json` updated (only new IDs)
- [ ] `reference.ts` imports + filter exports added
- [ ] `validate-content.mjs` path list updated
- [ ] `ReferenceBrowse.tsx` source tree updated
- [ ] `UnitReference<N>.tsx` component + route built, `UNIT_REFERENCE_PAGES` entry added
- [ ] Real `unitTitle` (read from the JSON, never guessed) added to `unitTitles` in `src/data/reference.ts`
- [ ] Click-through verified: Vocabulary 1/2, Academic, and Glossary all navigate to the Unit Reference page (not a word-card fallback)
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
