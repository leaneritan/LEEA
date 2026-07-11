# vocab-unit-scanner

Scan one unit's vocabulary from the planner PDF, build `vocabulary.json`, wire it to Reference search, source tree, and indexes, then validate.

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

## What to do

Follow **`docs/vocab.md`** start to finish — it is the complete, self-contained workflow (source pages to read, word schema, required fields, wiring steps, validation, verification, commit format, output checklist). This command file is just the Claude Code entry point; `docs/vocab.md` is written to be followable by any coding agent, not just Claude Code, so it's also what to hand to Jules or another agent for this task.

> **Naming note:** this is the **unit-level vocab scanner**. Future related skills (e.g. `/vocab-1-app`, `/song-app`, `/grammar-1-app`) build the per-lesson teacher slides + Leo apps that consume the `vocabulary.json` this produces.
