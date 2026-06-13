# Grammar — Scan, Build, Wire

How to take a unit's grammar from the planner PDF into LEEA grammar reference cards.

Grammar charts are **reference objects**, not lesson objects. Once `OW4-U8-G1` is in `grammar.json`, every place that needs it — Reference card, teacher slideshow, Leo grammar app — reads the same data.

For the schema reference, see `docs/content-model.md`. For PDF page math, see `docs/pdf-mapping.md`. This doc is the workflow.

## Sources to read

Each grammar point has multiple source pages across a unit's PDF range:

| Source | What to extract |
|---|---|
| Lesson planner grammar-1 / grammar-2 pages | grammar rule name, grammar box (3 example sentences, color-coded), Be the Expert sidebar |
| Lesson planner Practice activities | rule transforms and additional sample sentences |
| Workbook answer key (`supporting/l4_34286_ak-wb.pdf`) | extra practice sentences with confirmed answers |
| Grammar workbook answer key (`supporting/l4_ak-gwb.pdf`) | the unit's grammar chart in workbook form, plus exercises |

When a grammar workbook answer key is available, use the unit grammar chart as the chart source and the exercises as source-backed samples and quizzes (see `docs/content-model.md` for the `workbookChart` field).

## Targets per grammar point

Each grammar point in `grammar.json` should aim for:

- 10 Tab 1 sample sentences (Chart & Samples)
- 10 Tab 2 mixed/level-up sample sentences
- 10 Tab 3 quiz questions
- 10 Master Quiz questions (mix of multiple-choice and build-order)

Tab 1 and Tab 2 read the global Japanese ON/OFF toggle. Tab 4 reveals Japanese after each answered question, regardless of toggle.

## Step 1 — Scan grammar from the PDF

For each grammar point in the unit (G1 and G2):

- **Rule name**: the bold title in the yellow grammar box, e.g. "Describing people with *who*"
- **Pattern**: the rule structure, e.g. `person + who + verb phrase`
- **Chart examples**: the 3 sentences shown in the grammar box (verbatim, with highlight)
- **Be the Expert sidebar**: the metalinguistic explanation (used for Level Up content)
- **Practice activities**: numbered exercises that yield more sample sentences
- **Academic language terms**: e.g. clause, contraction (these also go to `vocabulary.json` as `type: "academic"`)
- **Content vocabulary terms**: unit-specific words (also go to `vocabulary.json` as `type: "content"`)

## Step 2 — Build grammar.json

Location: `content/subjects/english/courses/<course>/level-<n>/unit-<n>/grammar.json`

Two grammar points per unit (`grammar-1` and `grammar-2`):

```json
{
  "schemaVersion": 1,
  "subject": "english",
  "course": "our-world",
  "level": 4,
  "unit": 8,
  "unitTitle": "That's Really Interesting!",
  "grammarPoints": [
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
        "intro_examples": [{ "text": "...", "jp": "" }],
        "rows": [{ "form": "One person", "pattern": "...", "example": "...", "jp": "" }],
        "note_rule": "...",
        "note_exception": "",
        "note_exception_detail": ""
      },
      "tab1_samples": [{ "text": "...", "jp": "" }],
      "tab2_levelup": {
        "rules": [...],
        "mixed_samples": [...]
      },
      "tab3_quiz": [
        {
          "stem": ["I have a cousin ", " lives in Canada."],
          "answers": ["where", "who", "what", "when"],
          "correct": 1,
          "explanation": { "title": "...", "body": "..." },
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
        { "sentence": "...", "highlight": "..." }
      ],
      "tags": ["grammar", "OW4-U8-G1"]
    }
  ]
}
```

The clean schema is in `docs/content-model.md` — copy from there if a field is unclear.

## Step 3 — Wire to indexes

Add the grammar point IDs to:

```text
content/subjects/english/reference/grammar-index.json
```

```json
{
  "schemaVersion": 1,
  "subject": "english",
  "sourceFiles": [
    "content/subjects/english/courses/our-world/level-4/unit-8/grammar.json"
  ],
  "grammarPoints": [
    "ow_l4_u8_g1_who_clauses",
    "ow_l4_u8_g2_direct_indirect_objects"
  ]
}
```

In `src/data/reference.ts`, add a filter export for the unit:

```ts
export const unit8GrammarItems = grammarPoints.filter(
  (item) => item.level === 4 && item.unit === 8
);
```

## Step 4 — Validate

```bash
npm run validate:content
```

Grammar validator requires:
- `id`, `title`, `rule`, `pattern`, `tag` on every point
- `japanese.title`, `japanese.rule`, `japanese.pattern` (can be drafts with `needsReview: true`)

Then any academic / content words you identified in Step 1 must be added to `vocabulary.json` with their proper type and source tag.

## What grammar reference becomes

Once `grammar.json` is built and wired:

- The grammar reference card renders from this data with four tabs (Chart & Samples / Level Up / Quiz / Master Quiz)
- The teacher slideshow for `grammar-1` reuses the same chart and samples
- The Leo grammar-1 app pulls the same data for its Present, Practice, Quiz, and Master Quiz modules

If a sample sentence needs to change, change it in `grammar.json`. Never duplicate sentences inside lesson HTML.
