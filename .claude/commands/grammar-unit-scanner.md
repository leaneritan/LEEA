# grammar-unit-scanner

Scan one unit's grammar (G1 and G2) from the planner PDF, build `grammar.json`, wire it to Reference search, source tree, and indexes, then validate.

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

## What to do

Follow **`docs/grammar.md`** start to finish — it is the complete, self-contained workflow (sources to read, grammar-point schema, chart/role rules, wiring steps, validation, verification, output checklist). This command file is just the Claude Code entry point; `docs/grammar.md` is written to be followable by any coding agent, not just Claude Code, so it's also what to hand to Jules or another agent for this task.

> **Naming note:** this is the **unit-level grammar scanner**, the grammar counterpart to `/vocab-unit-scanner`. Run `/vocab-unit-scanner` first if the unit's `vocabulary.json` doesn't exist yet — `docs/grammar.md` explains why.
