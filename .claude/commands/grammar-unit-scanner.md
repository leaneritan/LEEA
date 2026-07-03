# grammar-unit-scanner

Scan one unit's grammar (G1 and G2) from the planner PDF, build `grammar.json`, wire it to Reference search, source tree, and indexes, then validate.

> **Naming note:** this is the **unit-level grammar scanner**, the grammar counterpart to `/vocab-unit-scanner`. Run `/vocab-unit-scanner` first if the unit's `vocabulary.json` doesn't exist yet — grammar scanning identifies academic/content words that belong there too.

## Usage

```
/grammar-unit-scanner <course-path> <unit-number>
```

Examples:

```
/grammar-unit-scanner english/our-world/level-4 9
/grammar-unit-scanner english/our-world/level-5 3
```

The first arg is the path under `docs/lesson-plans/` (so the planner PDF is at `docs/lesson-plans/<course-path>/planner.pdf`). The second is the unit number.

## What this skill does

Follows `docs/grammar.md` end to end:

1. Read `docs/lesson-plans/<course-path>/index.json` for the unit's verified page range and `pdf_offset` (the vocab scan should already have verified this — if not, verify it the same way `/vocab-unit-scanner` does before proceeding)
2. Read the unit's Grammar 1 and Grammar 2 pages from `planner.pdf`, plus any workbook answer keys if available (`supporting/l4_ak-gwb.pdf` or similar) — see "When no workbook answer key is available" below if not
3. Extract per grammar point: rule name, pattern, the 3 chart example sentences, the Be the Expert sidebar explanation, Academic Language terms, Content Vocabulary terms, and practice-activity sample sentences
4. Present a scratch summary (rule name + pattern + academic/content words found) — pause for user approval before building
5. After approval: build `content/subjects/english/courses/<course>/level-<n>/unit-<n>/grammar.json` with both grammar points at full depth (see "Targets per grammar point" below)
6. Add any academic/content words identified to the unit's `vocabulary.json` (type `academic` / `content`, proper source tag) if not already there
7. Wire to indexes and React (see "Wiring — all steps required" below)
8. Add the Grammar section to `UnitReference<N>.tsx` if it doesn't have one yet
9. Run `npm run validate:content` and `npx tsc --noEmit`
10. Verify in-browser: both grammar cards render, the Unit Reference page's Grammar section links to the right `/reference/grammar/<id>` routes
11. Commit with a clear message and push to the current working branch

## Targets per grammar point

Each of the two grammar points (`grammar-1`, `grammar-2`) needs:

- 10 Tab 1 sample sentences (Chart & Samples)
- 4 Tab 2 level-up rule groups, each with 2 transforms + 2 examples, plus 10 Tab 2 mixed/level-up sample sentences
- 10 Tab 3 quiz questions (fill-in-the-blank style: `stem: [before, after]`, `answers[4]`, `correct` index, `explanation: {title, body}`, `jp`)
- 10 Tab 4 master questions (mix of `type: "mcq"` and `type: "build"` — sentence-ordering from a word bank)

This is the same depth Units 6-8 were built to. Don't ship a thinner version and plan to backfill later — build all of it during the initial scan.

## When no workbook answer key is available

If `docs/grammar.md`'s workbook sources (`supporting/l4_ak-gwb.pdf`, `supporting/l4_34286_ak-wb.pdf`) aren't present in this repo/session, don't block on it — build the chart from the planner content alone:

- Use `chart.table` (the general-purpose `GrammarChartTable` shape: `columns`, `rows[].cells`/`roles`, optional `qa`/`notes`) instead of `chart.workbookChart`
- **Never use `workbookChart`** for a new grammar point — per `docs/content-model.md`, it's a legacy one-off shape hard-coded to the "who"-clause pattern
- Note this in the grammar point's `source` block, e.g. `"note": "No Grammar Workbook answer key was available for this unit; chart built from planner content only."`
- Compose the 10/10/10/10 sample sentences yourself, staying faithful to the rule and pattern shown in the planner's grammar box and practice activities — this is normal and matches how Unit 9 was built

## `chart.table.rows[].roles` — only use a role that already has color

`GrammarTableChart` colors a table cell by applying `gcardv2-table-cell--role-<role>` directly from whatever string is in `roles[]` — **if that CSS class doesn't exist, the cell silently renders with no color and no error.** This exact gap shipped in Units 6 and 9: `obligation`/`prohibition`, `future-positive`/`future-negative`, and `cause`/`effect` were all used as roles with no matching CSS, so those tables rendered as plain gray instead of the nicely color-coded look Unit 8's table has.

Before assigning `roles`, check the current list in `GrammarRoleKey` (`src/data/types.ts`): `subject` / `verb` / `directObject` / `indirectObject` / `prep` / `clause` / `cause` / `effect` / `obligation` / `prohibition` / `futurePositive` / `futureNegative`. If the pattern you're scanning fits one of these, use it as-is. **If none fit and you need a new role pair (e.g. a new contrast like "past" vs "present"), add all three of the following in the same change — not just the JSON:**

1. The new key(s) added to `GrammarRoleKey` in `src/data/types.ts`
2. A `.gcardv2-table-cell--role-<key>` rule in `src/app/globals.css` (pick a color visually distinct from the other roles already in the table)
3. A `{ key, label, color }` entry in `CHART_LEGEND` (`src/data/reference-shapes.ts`) — this is what makes the legend chip show up above the table

Verify by loading the grammar card in-browser and confirming the table cells are actually colored, not just checking that `tsc`/validate pass — neither of those catches a missing CSS class.

## Required schema — copy the shape, don't skip fields

```json
{
  "id": "ow_l4_u9_g1_<short_name>",
  "type": "grammar",
  "subject": "english",
  "course": "our-world",
  "level": 4,
  "unit": 9,
  "component": "grammar-1",
  "lessonId": "ow-l4-u9-grammar-1",
  "lessonStatus": "draft",
  "tag": "OW4-U9-G1",
  "title": "...",
  "shortName": "...",
  "rule": "...",
  "pattern": "...",
  "chart": {
    "title": "...",
    "intro_examples": [{ "text": "...", "jp": "..." }],
    "rows": [{ "form": "...", "pattern": "...", "example": "...", "jp": "..." }],
    "note_rule": "...",
    "note_exception": "...",
    "note_exception_detail": "...",
    "table": {
      "title": "...",
      "columns": ["...", "..."],
      "rows": [{ "cells": ["...", "..."], "roles": ["...", "..."] }],
      "notes": ["..."]
    }
  },
  "tab1_samples": [{ "text": "...", "jp": "..." }],
  "tab2_levelup": {
    "rules": [{ "title": "...", "jp_title": "...", "subtitle": "...", "jp_subtitle": "...", "transforms": [{ "from": "...", "to": "..." }], "examples": [{ "text": "...", "jp": "..." }] }],
    "mixed_samples": [{ "kind": "...", "text": "...", "jp": "..." }]
  },
  "tab3_quiz": [{ "stem": ["...", "..."], "answers": ["...", "...", "...", "..."], "correct": 0, "explanation": { "title": "...", "body": "..." }, "jp": "..." }],
  "tab4_master": [{ "type": "mcq", "stem": [], "answers": [], "correct": 0, "explanation": {}, "jp": "..." }],
  "japanese": { "title": "...", "rule": "...", "pattern": "...", "needsReview": true },
  "examples": [{ "sentence": "...", "highlight": "..." }],
  "tags": ["grammar", "<topic>", "OW4-U9-G1"],
  "source": { "plannerPages": "...", "note": "..." },
  "highlightRole": "clause"
}
```

`highlightRole` colors the `examples[].highlight` substring — use `"clause"` for relative-clause/definition patterns, `"verb"` for tense/aspect patterns (used to, will), or another `GrammarRoleKey` value from `docs/content-model.md` when it fits better.

### `examples[]` must cover every sample sentence — enforced by the validator

`examples[]` is not just "a few highlighted samples" — it must contain one entry for **every single sentence** in both `tab1_samples` and `tab2_levelup.mixed_samples`, matched by exact text. `GrammarCard.tsx` looks up each sample's highlight by exact sentence match; any sentence with no matching `examples[]` entry renders with **no color-coded phrase** — a silent visual gap, not an error you'd notice from a clean build.

**This is now enforced by `npm run validate:content`.** Unit 6 shipped with 4 such gaps (2 per grammar point) that went unnoticed for a long time because nothing checked it — don't rely on remembering to do this by hand. Build the full sentence list from both tabs first, then write one `examples` entry per sentence. If the validator flags a missing entry, add it — don't treat it as a false positive.

## Wiring — all steps required

Missing any one of these makes the grammar silently not appear anywhere, with no build error:

1. **`content/subjects/english/reference/grammar-index.json`** — add both grammar point IDs to `grammarPoints[]` and the file path to `sourceFiles[]`
2. **`src/data/reference.ts`** — three edits, all required:
   - Import: `import unit9Grammar from "../../content/.../unit-9/grammar.json";`
   - Extend the `UnitGrammarPoint` union type with `(typeof unit9Grammar.grammarPoints)[number]`
   - Add `...unit9Grammar.grammarPoints.map(toGrammarPoint)` to the `grammarPoints` array, and add a `unit9GrammarItems` filter export
   - If a JSON grammar point omits an optional field that another unit's JSON has (e.g. `workbookActivities`), TypeScript will narrow the union and fail on property access — use the existing `hasKey()` helper in `toGrammarPoint` rather than direct property access for any field that isn't present on every unit's JSON
3. **`scripts/validate-content.mjs`** — add the new unit's `grammar.json` path to `unitGrammarPaths`. **A unit's grammar is only validated if its path is listed here** — this is exactly how Unit 6's `examples[]` coverage gap went unchecked for so long, so don't skip this step even though nothing else will error if you do.
4. **`UnitReference<N>.tsx`** — add the Grammar section (`id="grammar"`), derived from `allGrammar` filtered by `course`/`level`/`unit` and sorted by `tag` — copy `UnitReference7.tsx`'s pattern exactly, never hand-type the grammar list, so it can't drift from the real `grammar.json`. Add the Grammar entry to the `jumps` array and the grammar count to the hero stats. If the unit's vocab was scanned before its grammar, this section previously didn't exist (per `/vocab-unit-scanner`'s "omit if no grammar.json yet" rule) — add it now.

## Verify it actually works — do not skip this

A clean `tsc`/build pass does not prove the grammar cards render or that the tree links correctly (the same is true of vocab). After validating, start the dev server and check with a real click-through (Playwright is fine):

- Both grammar cards load at `/reference/grammar/<id>` with no console errors
- The pattern chart / table renders with the chart data (not blank)
- The Unit Reference page's Grammar section links to the correct grammar IDs, not a stale or missing route

## Step-by-step

### Step 1 — Confirm the source pages

Grammar 1 and Grammar 2 pages are documented in the unit's `docs/lesson-plans/<course-path>/index.json` (`sections.grammar-1` / `sections.grammar-2`), verified during the vocab scan. Read those pages plus their surrounding "Be the Expert" sidebar and practice activities.

### Step 2 — Extract per grammar point

- **Rule name**: the bold title in the yellow grammar box
- **Pattern**: the rule structure (e.g. `The more + subject + verb, the more + subject + verb`)
- **Chart examples**: the sentences shown verbatim in the grammar box
- **Be the Expert sidebar**: metalinguistic explanation, useful for Level Up rule subtitles
- **Practice activities**: numbered exercises — mine these for additional sample sentences and quiz material
- **Academic Language / Content Vocabulary**: note these for `vocabulary.json` (they may already be scanned if `/vocab-unit-scanner` ran first — don't duplicate)

### Step 3 — Present a scratch summary, wait for approval

Show: rule name + pattern for both G1 and G2, and any new academic/content words found. Wait for user confirmation before writing `grammar.json`.

### Step 4 — Build `grammar.json`

Follow the schema above. Build all 10/10/10/10 samples per point plus full `examples[]` coverage in the same pass — not as a follow-up.

### Step 5 — Wire and validate

Follow "Wiring — all steps required" above, then:

```bash
npm run validate:content
npx tsc --noEmit
```

Fix any errors. Do not weaken the validator.

### Step 6 — Verify and commit

Do the click-through verification above, then commit and push to the current working branch. Do not create a PR automatically — the user merges when ready.

## Output checklist

- [ ] `grammar.json` created with both grammar points at full 10/10/10/10 depth
- [ ] `examples[]` covers every sentence in `tab1_samples` and `tab2_levelup.mixed_samples` — validator passes this check
- [ ] Any new academic/content words added to `vocabulary.json`
- [ ] `grammar-index.json` updated (IDs + sourceFiles)
- [ ] `reference.ts` updated: import, union type, `grammarPoints` array, filter export
- [ ] `validate-content.mjs`'s `unitGrammarPaths` updated
- [ ] `UnitReference<N>.tsx` Grammar section added/verified, derived from `allGrammar`
- [ ] Click-through verified: both grammar cards render, tree links to the correct routes
- [ ] `npm run validate:content` passes — report the new grammar card count
- [ ] `npx tsc --noEmit` clean
- [ ] Commit + push to working branch

## Important constraints

- Never modify `src/lib/supabase.ts`
- Grammar charts are reference objects, not lesson objects — one `grammar.json` entry serves the Reference card, teacher slideshow, and Leo grammar app alike
- Never model a new grammar point's `chart` after `workbookChart` — it's legacy and pattern-specific
- Japanese drafts must be careful and marked `needsReview: true` — the parent confirms
