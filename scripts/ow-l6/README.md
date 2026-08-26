# Our World Level 6 generator

`data/unit-<n>.mjs` holds the **authored source data** for one Level 6 unit,
scanned from the Student Book audio script
(`docs/lesson-plans/english/our-world/level-6/supporting/ow2e_ame_sb_level6_audioscript_website.docx`).
Level 6's `planner.pdf` and workbook answer keys are Git LFS pointers in this
checkout, so the audio script — which carries every Vocabulary 1/2 list with its
"Listen and repeat" sentence, both Grammar boxes, the song, and the reading
passage verbatim — is the scan source of record for these units.

`build-content.mjs` expands that compact data into the repo's real content
schemas (`vocabulary.json`, `grammar.json`) and `build-apps.mjs` expands it into
Leo's learner apps, the paired teacher decks, and the lesson registry JSON.

Run everything with:

```bash
node scripts/ow-l6/build.mjs
```

The generator is idempotent — re-running it rewrites the same files. Edit the
data module, never the generated output.
