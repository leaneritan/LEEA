# Build Order - Per-Unit Lesson Pipeline

How to build one unit of an English course from PDF to live lessons.

## Principle

Reference data first, lessons second. Lessons link to vocab and grammar cards by ID. If the reference data is not in place, lessons reference nothing.

Teacher slideshows are custom-crafted per lesson. Leo learner apps are templated per component type.

## Per-unit steps

```text
REFERENCE
1. Scan vocab from the planner PDF
2. Build vocabulary.json (clean schema)
3. Wire vocab to indexes + reference.ts
4. Run npm run validate:content

5. Scan grammar from the planner PDF
6. Build grammar.json (charts, samples, quizzes)
7. Wire grammar to grammar-index.json + reference.ts
8. Run npm run validate:content

COMPONENT PAIRS (slideshow + Leo app)
For each component in this order:
   9.  opener     (slideshow + Leo opener app) — use /opener-app skill
   10. vocab-1    (slideshow + Leo vocab-1 app)
   11. song       (slideshow + Leo song app)
   12. grammar-1  (slideshow + Leo grammar-1 app)
   13. vocab-2    (slideshow + Leo vocab-2 app)
   14. grammar-2  (slideshow + Leo grammar-2 app)
   15. reading    (slideshow + Leo reading app)
   16. writing    (slideshow + Leo writing app)

After every three-unit band, build checkpoint components from the planner:
   16a. review        (mixed review slideshow + Leo review app)
   16b. extra-reading (extended reading slideshow + Leo extra-reading app)

Checkpoint lessons belong to the band, not to the last unit in the band. Use bands `1-3`, `4-6`, and `7-9`.

REGISTER
17. Add teacher + learner JSON entries under
    content/subjects/english/courses/<course>/level-<n>/unit-<n>/lessons/
18. Name them `<component>.teacher.json` and `<component>.learner.json`
19. Import them in `src/data/lessons.ts`
20. Run npm run validate:content (final)
```

## Which doc covers which step

| Step | Doc |
|---|---|
| 1-4 | `docs/vocab.md` |
| 5-8 | `docs/grammar.md` |
| 9-16 teacher slideshows | `docs/teacher-slides.md` |
| 9-16 Leo apps | `docs/components.md` |
| PDF page math | `docs/pdf-mapping.md` |
| Schema details | `docs/content-model.md` |

## Skill plan

Each step becomes its own skill so a unit can be built one chunk at a time. The vocab scanner is built; the rest are planned and named for clarity.

```text
/vocab-unit-scanner    steps 1-4   BUILT (.claude/commands/vocab-unit-scanner.md)
/grammar-unit-scanner  steps 5-8   planned (scans + builds unit grammar.json)
/opener-app            step 9      planned (teacher slides + Leo opener app)
/vocab-app             steps 10,13 BUILT (.claude/commands/vocab-app.md; handles vocab-1 and vocab-2)
/song-app              step 11     planned
/grammar-app           steps 12,14 BUILT (.claude/commands/grammar-app.md; teacher slideshow only — handles grammar-1 and grammar-2; Leo app pattern locked later)
/reading-app           step 15     BUILT (.claude/commands/reading-app.md; teacher slideshow + Leo app with SB/WB landing-screen mode pattern)
/writing-app           step 16     planned
/review-app            checkpoint  planned (teacher review + Leo review app)
/extra-reading-app     checkpoint  planned (teacher extra reading + Leo extra-reading app)
```

Naming rule going forward: the **`-unit-scanner`** suffix means "scans the unit PDF and produces unit-level JSON (vocabulary or grammar)"; the **`-app`** suffix means "builds the teacher slideshow + paired Leo learner app for that component" (except `/grammar-app`, which currently builds the teacher slideshow only — the Leo grammar app pattern is locked after grammar-2's Leo app ships, same way `/vocab-app` waited for vocab-2). Skills are added after the corresponding template/Leo app is built and locked.

`/reading-app` includes a **landing-screen mode pattern**: one card per source (📘 SB, 📒 WB, future 📕 Extra-Reading). Each mode has its own tab strip starting with a Vocab tab (flashcards + quiz of every word in that source — including any WB-only words pre-added to `vocabulary.json`). Storage is namespaced per mode (`tab-N-done` for SB, `wb-tab-N-done` for WB). See `.claude/commands/reading-app.md` for the locked pattern.

## Stop conditions

Do not move to the next step if the previous step has not validated. A grammar Leo app cannot be built before `grammar.json` for that unit exists. A teacher card cannot be registered before its learner counterpart exists, because the validator requires the pair.
