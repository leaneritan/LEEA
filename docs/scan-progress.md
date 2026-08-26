# Reference Scan Progress — Our World, All 6 Levels

Tracks vocab + grammar unit scans across Our World Levels 1-6 (9 units each = 54 units, 108 scans total). One unit at a time: finish a unit's vocab scan, get it merged, then do that unit's grammar scan, then move to the next unit.

Check a box off once its PR is **merged** (not just opened). Update this file in the same PR that completes the scan.

Task templates (fill in `<L>`/`<U>`, paste as the task description):

```
Follow docs/vocab.md for english/our-world/level-<L> unit <U>.
```
```
Follow docs/grammar.md for english/our-world/level-<L> unit <U>.
```

Grammar scan for a unit can't start until that unit's vocab scan is merged (`docs/grammar.md` requires `vocabulary.json` to already exist).

## Level 1

- [ ] Unit 1 — Vocab
- [ ] Unit 1 — Grammar
- [ ] Unit 2 — Vocab
- [ ] Unit 2 — Grammar
- [x] Unit 3 — Vocab
- [ ] Unit 3 — Grammar
- [ ] Unit 4 — Vocab
- [ ] Unit 4 — Grammar
- [x] Unit 5 — Vocab
- [ ] Unit 5 — Grammar
- [x] Unit 6 — Vocab
- [ ] Unit 6 — Grammar
- [x] Unit 7 — Vocab
- [ ] Unit 7 — Grammar
- [ ] Unit 8 — Vocab
- [ ] Unit 8 — Grammar
- [x] Unit 9 — Vocab
- [ ] Unit 9 — Grammar

## Level 2

- [ ] Unit 1 — Vocab
- [ ] Unit 1 — Grammar
- [ ] Unit 2 — Vocab
- [ ] Unit 2 — Grammar
- [x] Unit 3 — Vocab
- [ ] Unit 3 — Grammar
- [ ] Unit 4 — Vocab
- [ ] Unit 4 — Grammar
- [ ] Unit 5 — Vocab
- [ ] Unit 5 — Grammar
- [ ] Unit 6 — Vocab
- [x] Unit 6 — Grammar
- [x] Unit 7 — Vocab
- [x] Unit 7 — Grammar
- [x] Unit 8 — Vocab
- [x] Unit 8 — Grammar
- [x] Unit 9 — Vocab
- [x] Unit 9 — Grammar

## Level 3

- [x] Unit 1 — Vocab
- [x] Unit 1 — Grammar
- [x] Unit 2 — Vocab
- [x] Unit 2 — Grammar
- [x] Unit 3 — Vocab
- [x] Unit 3 — Grammar
- [x] Unit 4 — Vocab
- [x] Unit 4 — Grammar
- [x] Unit 5 — Vocab
- [x] Unit 5 — Grammar
- [x] Unit 6 — Vocab
- [x] Unit 6 — Grammar
- [x] Unit 7 — Vocab
- [x] Unit 7 — Grammar
- [x] Unit 8 — Vocab
- [x] Unit 8 — Grammar
- [x] Unit 9 — Vocab
- [x] Unit 9 — Grammar

## Level 4

- [x] Unit 1 — Vocab
- [x] Unit 1 — Grammar
- [x] Unit 2 — Vocab
- [x] Unit 2 — Grammar
- [x] Unit 3 — Vocab
- [x] Unit 3 — Grammar
- [x] Unit 4 — Vocab
- [x] Unit 4 — Grammar
- [x] Unit 5 — Vocab
- [x] Unit 5 — Grammar
- [x] Unit 6 — Vocab
- [x] Unit 6 — Grammar
- [x] Unit 7 — Vocab
- [x] Unit 7 — Grammar
- [x] Unit 8 — Vocab
- [x] Unit 8 — Grammar
- [x] Unit 9 — Vocab
- [x] Unit 9 — Grammar

## Level 5

- [x] Unit 1 — Vocab
- [x] Unit 1 — Grammar
- [ ] Unit 2 — Vocab
- [ ] Unit 2 — Grammar
- [x] Unit 3 — Vocab
- [ ] Unit 3 — Grammar
- [ ] Unit 4 — Vocab
- [ ] Unit 4 — Grammar
- [ ] Unit 5 — Vocab
- [ ] Unit 5 — Grammar
- [ ] Unit 6 — Vocab
- [ ] Unit 6 — Grammar
- [ ] Unit 7 — Vocab
- [ ] Unit 7 — Grammar
- [ ] Unit 8 — Vocab
- [ ] Unit 8 — Grammar
- [ ] Unit 9 — Vocab
- [ ] Unit 9 — Grammar

## Level 6

- [x] Unit 1 — Vocab
- [x] Unit 1 — Grammar
- [x] Unit 2 — Vocab
- [x] Unit 2 — Grammar
- [x] Unit 3 — Vocab
- [x] Unit 3 — Grammar
- [x] Unit 4 — Vocab
- [x] Unit 4 — Grammar
- [x] Unit 5 — Vocab
- [x] Unit 5 — Grammar
- [x] Unit 6 — Vocab
- [x] Unit 6 — Grammar
- [x] Unit 7 — Vocab
- [x] Unit 7 — Grammar
- [x] Unit 8 — Vocab
- [x] Unit 8 — Grammar
- [x] Unit 9 — Vocab
- [x] Unit 9 — Grammar

All nine Level 6 units were scanned from the Student's Book audio script
(`supporting/ow2e_ame_sb_level6_audioscript_website.docx`) rather than the
planner: `level-6/planner.pdf` and both workbook answer keys are Git LFS
pointers in this checkout, while the audio script carries every Vocabulary 1/2
list with its "Listen and repeat" sentence, both Grammar boxes, the song and the
reading passage verbatim. Re-run `node scripts/ow-l6/build.mjs` after editing
`scripts/ow-l6/data/unit-<n>.mjs`.

## Status snapshot (2026-08-26)

- **Done:** Level 6 Units 1-9 (vocab + grammar, from the audio script); Level 4 Units 1-9 (vocab + grammar); Level 5 Unit 1 (vocab + grammar); Level 3 Unit 1 (vocab + grammar); Level 3 Unit 2 (vocab only); Level 3 Units 3-9 (vocab + grammar); Level 2 Units 5-9 (vocab and/or grammar)
- **Next up:** Level 5 Units 2-9, then Levels 1-2
- **Not started:** Level 1 — all 8 units; Level 2 Units 1-4; Level 3 Unit 2 (grammar only); Level 5 Units 2-9
- **Remaining scans:** 56 of 108

Recommended order: continue Level 5 (8 units left), then Levels 1-2 in whatever order matches your teaching rollout.
