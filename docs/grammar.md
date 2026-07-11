# Grammar Unit Scan — Scan, Build, Wire

**Goal:** turn one unit's two grammar points (G1 and G2) from the lesson-planner PDF into fully wired LEEA grammar reference cards.

This doc is self-contained — follow it top to bottom with no other file open, except the two schema references linked at the bottom for edge cases. It works the same whether you are Claude Code (`/grammar-unit-scanner`) or any other coding agent (e.g. Jules) given this doc plus a course path and unit number as a task.

Grammar charts are **reference objects**, not lesson objects. Once a grammar point's ID is in `grammar.json`, every place that needs it — the Reference card, the teacher slideshow, the Leo grammar app — reads the same data.

## Inputs you need

- `<course-path>` — the path under `docs/lesson-plans/`, e.g. `english/our-world/level-4`
- `<unit-number>` — e.g. `9`

The planner PDF is at `docs/lesson-plans/<course-path>/planner.pdf`.

**Run `docs/vocab.md`'s scan first if this unit's `vocabulary.json` doesn't exist yet.** Grammar scanning identifies academic/content words too, and adds them to that same file — it doesn't create it from scratch.

## Before you start

1. Confirm `content/subjects/english/courses/<course>/level-<n>/unit-<n>/vocabulary.json` already exists for this unit. If not, stop and run the vocab scan (`docs/vocab.md`) first.
2. Open `docs/lesson-plans/<course-path>/index.json` and confirm this unit's `sections.grammar-1` / `sections.grammar-2` page ranges and `pdf_offset` are verified (the vocab scan should have already verified these — if not, verify the same way that doc describes before proceeding).
3. Check whether `content/subjects/english/courses/<course>/level-<n>/unit-<n>/grammar.json` already exists. If it does, don't overwrite it without being asked.

## Sources to read

| Source | What to extract |
|---|---|
| Grammar-1 / grammar-2 pages | rule name, grammar box (3 color-coded example sentences), "Be the Expert" sidebar |
| Practice activities on those pages | rule transforms, additional sample sentences |
| Workbook answer key (`supporting/l4_34286_ak-wb.pdf`), if present | extra practice sentences with confirmed answers |
| Grammar workbook answer key (`supporting/l4_ak-gwb.pdf`), if present | the unit's grammar chart in workbook form, plus exercises |

If neither workbook answer key is present in this repo/session, don't block on it — see "When no workbook answer key is available" below.

## Step 1 — Scan grammar from the PDF

For each grammar point (G1 and G2) extract:

- **Rule name** — the bold title in the yellow grammar box, e.g. "Describing people with *who*"
- **Pattern** — the rule structure, e.g. `person + who + verb phrase`
- **Chart examples** — the 3 sentences shown in the grammar box, verbatim
- **Be the Expert sidebar** — the metalinguistic explanation, useful for Level Up rule subtitles
- **Practice activities** — numbered exercises, mine these for more sample sentences and quiz material
- **Academic Language terms** (e.g. clause, contraction) and **Content Vocabulary terms** — note these; they go into `vocabulary.json` as `type: "academic"` / `"content"`. They may already be captured if vocab scan ran first — don't duplicate, check first.

### When no workbook answer key is available

Build the chart from the planner content alone:

- Use `chart.table` (the general-purpose `GrammarChartTable` shape: `columns`, `rows[].cells`/`roles`, optional `qa`/`notes`) instead of `chart.workbookChart`
- **Never use `workbookChart`** for a new grammar point — per `docs/content-model.md` it's a legacy shape hard-coded to one specific "who"-clause pattern
- Note this in the grammar point's `source` block, e.g. `"note": "No Grammar Workbook answer key was available for this unit; chart built from planner content only."`
- Compose the 10/10/10/10 sample sentences yourself, staying faithful to the rule and pattern in the planner's grammar box and practice activities — this is the normal path, not a fallback to apologize for

## Step 2 — Present a scratch summary, then wait for approval

Show rule name + pattern for both G1 and G2, and any new academic/content words found.

If you're running interactively, stop here and wait for confirmation. If you're running unattended, put this summary at the top of your first commit message or PR description for a human to review before merging.

## Step 3 — Build grammar.json

Location: `content/subjects/english/courses/<course>/level-<n>/unit-<n>/grammar.json`. Two grammar points per unit (`grammar-1`, `grammar-2`).

Each grammar point needs, at full depth — don't ship a thinner version and plan to backfill:

- 10 Tab 1 sample sentences (Chart & Samples)
- 4 Tab 2 level-up rule groups, each with 2 transforms + 2 examples, plus 10 Tab 2 mixed/level-up sample sentences
- 10 Tab 3 quiz questions (fill-in-the-blank: `stem: [before, after]`, `answers[4]`, `correct` index, `explanation: {title, body}`, `jp`)
- 10 Tab 4 master questions (mix of `type: "mcq"` and `type: "build"` — sentence-ordering from a word bank)

Tab 1 and Tab 2 read the global Japanese ON/OFF toggle. Tab 4 reveals Japanese after each answered question regardless of the toggle.

Required schema — copy the shape, don't skip fields:

```json
{
  "schemaVersion": 1,
  "subject": "english",
  "course": "our-world",
  "level": 4,
  "unit": 9,
  "unitTitle": "...",
  "grammarPoints": [
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
  ]
}
```

`highlightRole` colors the `examples[].highlight` substring — use `"clause"` for relative-clause/definition patterns, `"verb"` for tense/aspect patterns (used to, will), or another `GrammarRoleKey` value from `docs/content-model.md` when it fits better.

### `examples[]` must cover every sample sentence — enforced by the validator

`examples[]` is not "a few highlighted samples" — it must contain one entry for **every single sentence** in both `tab1_samples` and `tab2_levelup.mixed_samples`, matched by exact text. The grammar card looks up each sample's highlight by exact sentence match; any sentence with no matching `examples[]` entry renders with **no color-coded phrase** — a silent visual gap, not an error you'd notice from a clean build. Build the full sentence list from both tabs first, then write one `examples` entry per sentence.

### `chart.table.rows[].roles` — only use a role that already has color

The table colors a cell by applying a CSS class built from whatever string is in `roles[]` — **if that class doesn't exist, the cell silently renders with no color and no error.**

Before assigning `roles`, check the current list in `GrammarRoleKey` (`src/data/types.ts`): `subject` / `verb` / `directObject` / `indirectObject` / `prep` / `clause` / `cause` / `effect` / `obligation` / `prohibition` / `futurePositive` / `futureNegative`. If your pattern fits one of these, use it as-is.

**If none fit and you need a new role pair (e.g. a new contrast like "past" vs "present"), add all three of these in the same change — not just the JSON:**

1. The new key(s) added to `GrammarRoleKey` in `src/data/types.ts`
2. A `.gcardv2-table-cell--role-<key>` rule in `src/app/globals.css` (pick a color visually distinct from the other roles already in the table)
3. A `{ key, label, color }` entry in `CHART_LEGEND` (`src/data/reference-shapes.ts`) — this is what makes the legend chip show up above the table

## Step 4 — Wire to indexes

All of these are required — missing any one makes the grammar silently not appear anywhere, with no build error:

1. **`content/subjects/english/reference/grammar-index.json`** — add both grammar point IDs to `grammarPoints[]` and this unit's file path to `sourceFiles[]`
2. **`src/data/reference.ts`** — three edits, all required in the same commit:
   - Import: `import unit9Grammar from "../../content/.../unit-9/grammar.json";`
   - Extend the `UnitGrammarPoint` union type with `(typeof unit9Grammar.grammarPoints)[number]`
   - Add `...unit9Grammar.grammarPoints.map(toGrammarPoint)` to the `grammarPoints` array, and add a `unit9GrammarItems` filter export
   - If a JSON grammar point omits an optional field another unit's JSON has (e.g. `workbookActivities`), TypeScript narrows the union and fails on property access — use the existing `hasKey()` helper in `toGrammarPoint` instead of direct property access for any field not present on every unit's JSON
3. **`scripts/validate-content.mjs`** — add this unit's `grammar.json` path to `unitGrammarPaths`. A unit's grammar is only validated if its path is listed here.
4. **`UnitReference<N>.tsx`** — add the Grammar section (`id="grammar"`), derived from `allGrammar` filtered by `course`/`level`/`unit` and sorted by `tag` — copy `UnitReference7.tsx`'s pattern exactly so it can't drift from the real `grammar.json`. Add the Grammar entry to the `jumps` array and the grammar count to the hero stats. If this unit's vocab was scanned before its grammar, this section didn't exist yet — add it now.

Then add any academic/content words identified in Step 1 to `vocabulary.json` with their proper `type` and source tag, per `docs/vocab.md` — don't duplicate words already added if vocab scan ran first.

## Step 5 — Validate

```bash
npm run validate:content
npx tsc --noEmit
```

Grammar validator requires: `id`, `title`, `rule`, `pattern`, `tag` on every point; `japanese.title`/`japanese.rule`/`japanese.pattern` (drafts with `needsReview: true` are fine); full `examples[]` coverage as described above; and this unit's path present in `unitGrammarPaths`. Fix the data if it fails — don't weaken the validator.

## Step 6 — Verify it actually works

A clean `tsc`/validate pass does not prove the cards render or the tree links correctly. If you can run the dev server and a browser (or Playwright), check:

- Both grammar cards load at `/reference/grammar/<id>` with no console errors
- The pattern chart / table renders with real data, not blank, and table cells are actually colored (not just gray) if you added `roles`
- The Unit Reference page's Grammar section links to the correct grammar IDs, not a stale or missing route

If you cannot run a browser in your environment, say so explicitly rather than claiming this was verified — neither `tsc` nor the validator catches a missing CSS class or a broken link.

## Step 7 — Commit and push

Check off this unit's Grammar box in `docs/scan-progress.md` (and update its "Status snapshot" section) in the same commit.

Push to the working branch. Do not open a PR unless asked to — a human merges when ready.

## Output checklist

- [ ] `grammar.json` created with both grammar points at full 10/10/10/10 depth
- [ ] `examples[]` covers every sentence in `tab1_samples` and `tab2_levelup.mixed_samples` — validator passes this check
- [ ] Any new academic/content words added to `vocabulary.json`
- [ ] `grammar-index.json` updated (IDs + `sourceFiles`)
- [ ] `reference.ts` updated: import, union type, `grammarPoints` array, filter export
- [ ] `validate-content.mjs`'s `unitGrammarPaths` updated
- [ ] `UnitReference<N>.tsx` Grammar section added/verified, derived from `allGrammar`
- [ ] Click-through verified (both grammar cards render, tree links correctly) or explicitly noted as not possible in this environment
- [ ] `npm run validate:content` passes — report the new grammar card count
- [ ] `npx tsc --noEmit` clean
- [ ] Committed and pushed to the working branch

## Further reading (only if something above is ambiguous)

- `docs/content-model.md` — full field-by-field schema reference, including `GrammarRoleKey` and the academic word card
- `docs/pdf-mapping.md` — page-math background for `index.json`/`pdf_offset`
- `docs/vocab.md` — the companion vocab scan, run first for a new unit

## Constraints

- Never modify `src/lib/supabase.ts`
- Grammar charts are reference objects, not lesson objects — one `grammar.json` entry serves the Reference card, teacher slideshow, and Leo grammar app alike
- Never model a new grammar point's `chart` after `workbookChart` — it's legacy and pattern-specific
- Japanese drafts must be marked `needsReview: true` until a human confirms them
