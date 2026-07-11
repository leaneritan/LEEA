# Vocab Unit Scan — Scan, Build, Wire

**Goal:** turn one unit's vocabulary from the lesson-planner PDF into a fully wired set of LEEA reference cards.

This doc is self-contained — follow it top to bottom with no other file open, except the two schema references linked at the bottom for edge cases. It works the same whether you are Claude Code (`/vocab-unit-scanner`) or any other coding agent (e.g. Jules) given this doc plus a course path and unit number as a task.

## Inputs you need

- `<course-path>` — the path under `docs/lesson-plans/`, e.g. `english/our-world/level-4`
- `<unit-number>` — e.g. `7`

The planner PDF is at `docs/lesson-plans/<course-path>/planner.pdf`. Page ranges and offsets for that unit live in `docs/lesson-plans/<course-path>/index.json` (see `docs/pdf-mapping.md` if you need the page-math background).

**Run vocab scan before grammar scan.** Grammar scanning reuses this unit's `vocabulary.json` and adds academic/content words to it — build vocab first if it doesn't exist yet.

## Before you start

1. Open `docs/lesson-plans/<course-path>/planner.pdf`. If it is a tiny (~130 byte) text file instead of a real PDF, it is an un-pulled Git LFS pointer — **stop and report this**, don't guess content. Ask for `git lfs pull` to be run, or for the real file to be added.
2. Open `docs/lesson-plans/<course-path>/index.json` and find this unit's entry (`u<N>`). If `sections` has real page ranges and a non-zero `pdf_offset`, they're already verified — use them. If empty or unverified, read the candidate first page of the unit in the PDF to confirm before trusting it.
3. Check whether `content/subjects/english/courses/<course>/level-<n>/unit-<n>/vocabulary.json` already exists. If it does, this unit was already scanned — don't overwrite it without being asked.

## Word types in one unit

| PDF section | LEEA `type` | Example tag |
|---|---|---|
| Vocabulary 1 (left column of vocab-1 spread) | `vocabulary` | `OW4-U8-V1` |
| Vocabulary 2 (left column of vocab-2 spread) | `vocabulary` | `OW4-U8-V2` |
| Academic Language (sidebar of any teacher page) | `academic` | source + `OW<level>-AC` |
| Content Vocabulary (sidebar of any teacher page) | `content` | source tag of that page |
| Words shown but not target (related photos/captions) | `related` | source tag |

Glossary is a valid `type` in code but has no cards built yet — skip it unless the planner explicitly calls a word out as glossary.

## Step 1 — Read every page of the unit, not just the 8 named teaching sections

A NatGeo *Our World* Level 4-6 unit is 30 pages. The named teaching sections (opener → writing) only cover pages 1-23. The remaining 7 pages are **end-of-unit content** and are easy to miss:

| Unit page | Section | Has Content Vocabulary? | index.json key |
|---|---|---|---|
| 24 | Mission (L4-6) / Value (L1-3) | usually yes | `mission` / `value` |
| 25-26 | Project | usually yes | `project` |
| 27 | Video | resource only — skip | — |
| 28 | Unit Reader | sometimes | `reader` |
| 29-30 | Audio Script | resource only — skip | — |

You **must** read pages 24, 25-26, and 28. These pages often introduce Content Vocabulary that appears nowhere else in the unit (one unit had 8 of its 19 content words come only from these pages). Skipping them produces an incomplete `vocabulary.json`.

For each spread, copy from the **left column** (teacher notes) — the right column is student-facing content (grammar box, activities, song lyrics):

- Vocab-1 / vocab-2 pages: the "Vocabulary 1" / "Vocabulary 2" list, verbatim
- Every teacher page (opener, song, grammar, reading, writing, mission/value, project, reader): the "Academic Language" and "Content Vocabulary" lines. Empty is a normal, valid result for any one page — but check every page before concluding a whole word type is empty for the unit.

Capture per word: exact spelling and multi-word phrase form (e.g. `take photos`, `comic book`), which component it came from, and whether it's target/academic/content/related. Confirm against the Scope and Sequence chart at the front of the PDF if available.

**⚠️ Do not finish this unit with zero academic words without double-checking.** Nearly every scanned unit so far has had 5-16 academic words. If your scratch list comes up with zero, re-read the grammar-1 and grammar-2 pages' Academic Language sidebar specifically before finalizing — a word that reads as abstract/textbook-register (e.g. "advantage", "achieve", "clause") almost always belongs in `academic`, not `content`, even if it also appears in a reading passage.

After reading, update `index.json` for this unit with the verified page range and `pdf_offset`, and add `mission`/`value`, `project`, and `reader` keys if missing. `video` and `audio-script` are intentionally never indexed.

## Step 2 — Present a scratch list, then wait for approval

Show a list grouped by type with counts and sources:

```
Vocabulary 1 (N) — word, word, ...
Vocabulary 2 (N) — word, word, ...
Academic Language (N) — word (source), ...
Content Vocabulary (N) — word (source), ...
Related Vocabulary (N) — word (source), ...
Total: N
```

Flag any word that already exists as `global_<id>` in another unit's `vocabulary.json` — it should merge as a new `sources[]` entry, not duplicate.

If you're running interactively, stop here and wait for confirmation before writing JSON. If you're running unattended (e.g. as a background task with no live reviewer), still put this scratch list at the top of your first commit message or PR description, so a human can review it before merging — do not skip straight past it.

## Step 3 — Build vocabulary.json

Location: `content/subjects/english/courses/<course>/level-<n>/unit-<n>/vocabulary.json`

File shape:

```json
{
  "schemaVersion": 1,
  "subject": "english",
  "course": "our-world",
  "level": 4,
  "unit": 8,
  "unitTitle": "...",
  "source": { "type": "lesson-planner-scan", "file": "planner.pdf", "verified": true, "note": "..." },
  "wordIds": ["global_alone", "global_avatar", "..."],
  "vocab1WordIds": ["global_alone", "..."],
  "vocab2WordIds": ["global_bug", "..."],
  "academicWordIds": ["global_analyze", "global_clause", "..."],
  "contentWordIds": ["global_trilobite", "..."],
  "relatedWordIds": ["global_musical_instrument", "..."],
  "words": ["..."]
}
```

Every word in `words[]` must appear in `wordIds`, and every word in a sub-list (`vocab1WordIds`, etc.) must also be in `wordIds`.

Each entry in `words[]` — use this clean schema **only**, never the legacy flat fields (`emoji`, `sample`, `jp_word`, `jp_reading`, `jp_sentence`, `jp_tags`):

```json
{
  "id": "global_alone",
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
  "additionalExamples": ["She walked home alone after practice.", "..."],
  "additionalExamplesJp": ["彼女は練習の後、一人で家に歩いて帰りました。", "..."],
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

Field notes:
- `id` uses the `global_` prefix — the same word reused in another unit becomes a second `sources[]` entry on the same card, never a duplicate card
- `normalizedWord` is lowercase, no punctuation, multi-word phrases joined by spaces (`take photos`)
- `displayEmoji` is a plain string, usually one emoji, occasionally two when that genuinely helps a learner picture the word (`"🔋⚡"`)
- For mission/value/project/reader words, omit `lessonId` (no teacher lesson exists) and use `component: "mission" | "value" | "project" | "reader"`

### Required fields — the word card breaks visibly if any of these are missing

- **`ipa`** — required, no exceptions. Standard US IPA. If genuinely unsure of a transcription, flag it rather than guessing — but never omit the field.
- **`syllables`** — required.
- **`exampleJp`** — required whenever `example` is set; same for **`additionalExamplesJp`**, one per `additionalExamples` entry, same order.
- **Exactly 3 example sentences per non-academic word** (`vocabulary`/`content`/`related`/`glossary`): the base `example` plus exactly 2 in `additionalExamples`. Write all 3 in this pass — don't ship 1 and plan to backfill. `npm run validate:content` fails any word with fewer than 2 `additionalExamples`.
- **Verb words get infinitive / past / past-participle, not 3 same-tense sentences.** A word counts as a verb if `partOfSpeech` contains the word "verb" (`"verb"`, `"noun/verb"`, `"verb phrase"`, etc.):
  1. `example` — infinitive/base form ("You push the door to open it.")
  2. `additionalExamples[0]` — simple past ("She pushed the swing gently.")
  3. `additionalExamples[1]` — past participle, via present-perfect or passive ("The box has been pushed across the floor.")

  Use `getVerbForms()` (`src/data/verbForms.ts`) for the correct spelling — it handles irregulars ("fall" → "fell"/"fallen") and multi-word phrasal verbs. Write the grammatically correct sentence even for irregulars; the highlighter and validator both accept a verb's computed past/past-participle forms, not just the literal base spelling.

  **⚠️ Common slip: for a `noun/verb` word, don't let one of the 3 slots accidentally use the noun sense instead of a verb tense** — e.g. for `harvest` (noun/verb), "Mendoza celebrates their grape harvest" uses `harvest` as a noun and does not satisfy the past-tense slot; it needs to be a sentence like "They harvested the tomatoes last week." Re-read each verb word's 3 sentences and confirm all 3 actually inflect the verb.
- **Every example sentence must literally contain the target word in a matching form.** The card bolds by searching for `normalizedWord`, not `word` (which may carry an article or `_`-joined phrase). If `normalizedWord` is `"battery"`, the sentence needs "battery" verbatim — don't shift to plural/different tense. Multi-word phrases joined with `_` (e.g. `pop_top`) may appear as a space or hyphen in the sentence, not a different word form.
- If `additionalMeanings` is present (a second sense), each entry needs a `jp` translation of that sense.

**Rule of thumb: every learner-facing English string needs a Japanese counterpart**, drafted with `needsReview: true` until a human confirms it.

### Academic words — rich schema required

For `type: "academic"`, the validator requires the full rich card, not the plain schema above:

- `meaning`, `jp_meaning`
- `when_to_use` — exactly 3 entries: `test`, `school`, `real-world` — plus `jp_when_to_use` for the same 3
- `how_to_use` — `{ structure, patterns[] }` (patterns non-empty), plus `jp_how_to_use` — `{ structure }` (`needsReview: true`)
- `examples` — 3+ entries, each `{ en, jp, context }` covering the same 3 contexts. If the word is a verb, the 3 examples must also cover infinitive/past/past-participle (one example naturally covers both axes, e.g. the "school" example uses past tense) — see `src/data/verbForms.ts`'s `getVerbForms()`.
- `collocations` — 5-6 strings
- `nonExamples` — 2-3 entries, each `{ en, jp }`
- `practice_prompt`, `jp_practice_prompt`, `jp_note`
- `miniQuiz` — 1+ entries, each `{ prompt, options[], correct, explanation, jp }`
- Flat duplicates also required: `jp_word`, `jp_reading`, `jp_sentence`, `jp_meaning`, `jp_note`, `jp_practice_prompt`
- `tags[]` must include `OW<level>-AC` and every source tag in `sources[]`

Full field-by-field reference: `docs/content-model.md`.

### Emoji consistency

- Same global word → same emoji, always (automatic, since it's one card across units — never override `displayEmoji` per source)
- Closely related word forms may share an emoji (`imagine`/`imagination` can both use 💡)
- Distinct concepts should not share an emoji — vary one if two unrelated words would collide
- When a unit reuses an existing global word, don't touch its emoji — just add a `sources[]` entry

## Step 4 — Wire to indexes and React

All of these are required — missing any one makes the unit's vocab silently not appear anywhere, with no build error:

1. Append the new word IDs to `content/subjects/english/reference/vocabulary-index.json` under `words` (skip IDs already present from another unit), and add this unit's file path to `sourceFiles[]`
2. In `src/data/reference.ts`:
   - Import: `import unit8Vocabulary from "../../content/.../unit-8/vocabulary.json";`
   - Add it to the `mergeWordsAcrossUnits([...])` call
   - Add four filter exports modeled on the existing pattern: `unit8Vocab1Items`, `unit8Vocab2Items`, `unit8AcademicItems`, `unit8GlossaryItems`
   - Add the unit's real title to `unitTitles`, read directly off the JSON — `[`${unit8Vocabulary.level}-${unit8Vocabulary.unit}`]: unit8Vocabulary.unitTitle` — never hand-type a guessed title
3. In `scripts/validate-content.mjs`, add this unit's `vocabulary.json` path to `unitVocabularyPaths` — a unit's vocab is only validated if it's listed here
4. In `src/components/reference/ReferenceBrowse.tsx`:
   - Add a sibling tree node under the matching Level/Course, with five sub-sections: Vocabulary 1 / Vocabulary 2 / Grammar / Academic / Glossary (Grammar shows a placeholder if `grammar.json` doesn't exist yet for this unit)
   - Add `"<level>-<unit>": "/reference/<course>/level-<n>/unit-<n>"` to `UNIT_REFERENCE_PAGES`
5. Build the Unit Reference page — **required every time**, not optional polish:
   - `src/components/UnitReference<N>.tsx` — copy the shape of an existing one (e.g. `UnitReference7.tsx`). Pull `unitTitle` and the word-ID lists straight from this unit's `vocabulary.json`, don't re-derive them. Section order: Vocabulary 1, Vocabulary 2, Academic, Glossary, then Grammar (only if `grammar.json` exists — omit entirely otherwise). Section `id`s must be exactly `vocab1`/`vocab2`/`academic`/`glossary`/`grammar` — these are the anchors the tree jumps to.
   - Route file `src/app/reference/<course>/level-<n>/unit-<n>/page.tsx`:
     ```tsx
     import UnitReference8 from "@/components/UnitReference8";
     export default function Page() { return <UnitReference8 />; }
     ```
   - If either the component or the `UNIT_REFERENCE_PAGES` entry is missing, the tree silently falls back to a broken single-word-card link — nothing errors, nothing logs.

## Step 5 — Validate

```bash
npm run validate:content
npx tsc --noEmit
```

The validator checks: required fields present, nested `japanese.*` present, non-empty `sources[]`/`tags[]`, `wordIds` matches `vocabulary-index.json`, `ipa`/`syllables`/`exampleJp` presence, `additionalExamples` count ≥ 2, and that every example sentence actually contains a highlightable form of its word. Fix the data if it fails — don't weaken the validator.

## Step 6 — Verify it actually works

A clean `tsc`/validate pass does not prove navigation works — the broken fallback path is also valid TypeScript. If you can run the dev server and a browser (or Playwright), click through: expand the unit in the Reference tree, click Vocabulary 1 / Vocabulary 2 / Academic / Glossary, confirm each one lands on `/reference/<course>/level-<n>/unit-<n>#<anchor>`, not `/reference/word/...`. If you cannot run a browser in your environment, say so explicitly rather than claiming this was verified.

## Step 7 — Commit and push

Commit message format:

```
Add Unit <n> vocabulary (<word count> words) and wire to Reference search

<one paragraph: what's in the file, dedupes against other units, source tag codes used>
```

Push to the working branch. Do not open a PR unless asked to — a human merges when ready.

## Output checklist

- [ ] `vocabulary.json` created with N words, wired into `wordIds` and all sub-lists
- [ ] Every word has `ipa` and `syllables`
- [ ] Every non-academic word has 3 example sentences (not just the base one)
- [ ] Every verb word's 3 sentences are infinitive / past / past-participle — check the noun/verb slip above
- [ ] Every `example`/`additionalExamples` has a matching `exampleJp`/`additionalExamplesJp`
- [ ] Academic word count isn't suspiciously zero — re-checked the sidebar if it was
- [ ] Academic words have the full rich schema
- [ ] `vocabulary-index.json`, `reference.ts`, `validate-content.mjs`, `ReferenceBrowse.tsx` all updated
- [ ] `UnitReference<N>.tsx` + route + `UNIT_REFERENCE_PAGES` entry built
- [ ] Real `unitTitle` (read from JSON, never guessed) added to `unitTitles`
- [ ] `npm run validate:content` passes, `npx tsc --noEmit` clean
- [ ] Click-through verified, or explicitly noted as not possible in this environment
- [ ] Committed and pushed to the working branch

## Source tag format

```text
OW<level>-U<unit>-<component>     e.g. OW4-U8-V1, OW4-U8-G1, OW4-U8-OP
OW<level>-AC                       course-level academic tag
JF<year>-L<lesson>-U<unit>-V<n>   Joyful Work
TG-<topic>-<sub>                   Training Ground
```

Component codes: `V1` vocab-1, `V2` vocab-2, `G1`/`G2` grammar, `OP` opener, `SG` song, `RD` reading, `WR` writing, `MI` mission (**Levels 4-6 only**), `VL` value (**Levels 1-3 only**), `LT` let's talk (**Levels 4-6 only**), `PJ` project (all levels), `RDR` unit reader.

Our World uses a different end-of-unit pattern by level band:

| Levels 1-3 | Levels 4-6 |
|---|---|
| Value + Project | Mission + Let's Talk + Project |

Use `MI` only when the planner page literally says MISSION; use `VL` only when it says VALUE — never invent a Mission tag for a Level 1-3 unit. For mission/value/project/reader/let's-talk sources, omit `lessonId` and use the matching `component` string.

Always put the source tag in both `sources[].tag` and `tags[]` — search uses both.

## Further reading (only if something above is ambiguous)

- `docs/content-model.md` — full field-by-field schema reference, including the academic card
- `docs/pdf-mapping.md` — page-math background for `index.json`/`pdf_offset`

## Constraints

- Never modify `src/lib/supabase.ts`
- One global card per word, merged across units by `id` — never create a duplicate card for the same word
- Japanese drafts must be marked `needsReview: true` until a human confirms them
- Do not register academic words without the `OW<level>-AC` tag
