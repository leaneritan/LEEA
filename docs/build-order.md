# Build Order — Per-Unit Lesson Pipeline

How to build one unit of an English course from PDF to live lessons.

## Principle

Reference data first, lessons second. Lessons link to vocab and grammar cards by ID — if the reference data is not in place, lessons reference nothing.

Teacher slideshows are custom-crafted per lesson. Leo learner apps are templated per component type (every grammar-2 app has roughly the same modules; only the data varies).

## Per-unit steps

```text
─── REFERENCE ──────────────────────────────────────
1. Scan vocab from the planner PDF
2. Build vocabulary.json (clean schema)
3. Wire vocab to indexes + reference.ts
4. Run npm run validate:content

5. Scan grammar from the planner PDF
6. Build grammar.json (charts, samples, quizzes)
7. Wire grammar to grammar-index.json + reference.ts
8. Run npm run validate:content

─── COMPONENT PAIRS (slideshow + Leo app) ──────────
For each component in this order:
   9.  opener     (slideshow + Leo opener app)
   10. vocab-1    (slideshow + Leo vocab-1 app)
   11. song       (slideshow + Leo song app)
   12. grammar-1  (slideshow + Leo grammar-1 app)
   13. vocab-2    (slideshow + Leo vocab-2 app)
   14. grammar-2  (slideshow + Leo grammar-2 app)
   15. reading    (slideshow + Leo reading app)
   16. writing    (slideshow + Leo writing app)

─── REGISTER ───────────────────────────────────────
17. Add teacher + learner JSON entries under
    content/subjects/english/courses/<course>/level-<n>/unit-<n>/lessons/
18. Verify src/data/lessons.ts auto-imports them
19. Run npm run validate:content (final)
```

## Which doc covers which step

| Step | Doc |
|---|---|
| 1–4 | `docs/vocab.md` |
| 5–8 | `docs/grammar.md` |
| 9–16 teacher slideshows | `docs/teacher-slides.md` |
| 9–16 Leo apps | `docs/components.md` |
| PDF page math | `docs/pdf-mapping.md` |
| Schema details | `docs/content-model.md` |

## Skill plan (to build later)

Each step becomes its own skill so a unit can be built one chunk at a time. The vocab scanner is the only one built so far; the rest are planned and named for clarity (the per-component skills will each generate the teacher slideshow + paired Leo app for that component):

```text
/vocab-unit-scanner    steps 1-4   ← BUILT (.claude/commands/vocab-unit-scanner.md)
/grammar-unit-scanner  steps 5-8   ← planned (scans + builds unit grammar.json)
/opener-app            step 9      ← planned (teacher slides + Leo opener app)
/vocab-1-app           step 10     ← planned (vocab-1 teacher + Leo app)
/song-app              step 11     ← planned
/grammar-1-app         step 12     ← planned
/vocab-2-app           step 13     ← planned
/grammar-2-app         step 14     ← planned
/reading-app           step 15     ← planned
/writing-app           step 16     ← planned
```

Naming rule going forward: the **`-unit-scanner`** suffix means "scans the unit PDF and produces unit-level JSON (vocabulary or grammar)"; the **`-app`** suffix means "builds the teacher slideshow + paired Leo learner app for that component." Skills are added after the corresponding template/Leo app is built and locked.

## Stop conditions

Do not move to the next step if the previous step has not validated. A grammar Leo app cannot be built before `grammar.json` for that unit exists. A teacher card cannot be registered before its learner counterpart exists, because the validator requires the pair.
