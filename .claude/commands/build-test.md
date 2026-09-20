# build-test

Turn one ExamView `.rtf` export into a digital test Leo can sit: extract it,
write its questions file, build the teacher deck that is its answer key, register
the pair, verify.

## Usage

```
/build-test <path-to.rtf> <kind> <level> <units>
```

Examples:

```
/build-test ~/uploads/OW_AmE_EV_L4U9.rtf   quiz       4 9       # Unit 9's own quiz
/build-test ~/uploads/OW_AmE_EV_L4U7-9.rtf test       4 7-9     # a three-unit band test
/build-test ~/uploads/OW_AmE_EV_L4U1-9.rtf final-test 4 1-9     # a whole-level final
```

`<kind>` is the component, and it decides almost everything downstream — the
folder, the file names, the clock, whether it is checkpoint material. Get it
right before anything else:

| `<kind>` | What it is | `assessment.kind` | Minutes |
| --- | --- | --- | --- |
| `quiz` | one unit's own quiz | `unit-quiz` | 20 |
| `test` | a three-unit band (mastery) test | `mastery` | 30 |
| `final-test` | a whole-level final | `final` | 35 |

## What to do

Follow **`docs/tests.md`** start to finish. It is the complete standard — the
extractor and its picture handling, the six question kinds and every part-level
flag, scoring, the result screen, the clock, the teacher deck, registration, and
the traps. This file is the Claude Code entry point and the order of operations;
the doc is the content.

Three tests are already built as worked examples, one of each kind. **Read the
one matching `<kind>` before you write anything** — copying a working file of the
same shape beats building from the prose:

| Kind | Questions file | Lesson JSON pair |
| --- | --- | --- |
| `quiz` | `public/tests/our-world/level-4/u9/questions.json` | `…/level-4/unit-9/lessons/quiz{,-app}.*.json` |
| `test` | `public/tests/our-world/level-4/t7-9/questions.json` | `…/level-4/checkpoint-7-9/lessons/test{,-app}.*.json` |
| `final-test` | `public/tests/our-world/level-4/t1-9/questions.json` | `…/level-4/checkpoint-1-9/lessons/final-test{,-app}.*.json` |

## The order

### 1. Extract

```bash
npm run test:extract -- <path-to.rtf> --out /tmp/<slug> --slug <slug>
```

Writes `<slug>.txt` (questions, then the answer key, with `[[IMAGE n]]` markers)
and one PNG per picture. **The pictures come out of the RTF losslessly** — never
screenshot the test, never redraw a picture, never ask for a separate image file.
If the run prints `(un-stretched: dropped N duplicate rows, M columns)` that is
the extractor undoing Word's centre-stretch, and it is correct.

File the PNGs under `public/tests/our-world/level-<n>/<slug>/`, named for the
question they belong to (`q01-playground.png`).

### 2. Check the audio

Find the tracks the paper names (`TR: 9.1`) in the level's
`assessment-audio.json` manifest and confirm the `.mp3` is in the repo. A missing
track is not a blocker — say so and carry on — but a *wrong* URL is, so read it
off the manifest rather than guessing it from the track number.

### 3. Write the questions file

`public/tests/our-world/level-<n>/<slug>/questions.json`, then the 16-line shell
at `public/learn/<lesson-id>.html` that names it. **Write no other code.** The
engine is `public/components/test-engine.js` and is shared by every test; if a
paper genuinely needs a shape the six kinds cannot express, add it to the engine
*and* to `docs/tests.md` in the same change, rather than writing anything
test-specific.

One part per section of the paper, in the paper's order, numbered `m1`…`mN`.

### 4. Build the teacher deck

`public/lessons/<lesson-id>.html`, on the shared slideshow shell
(`docs/teacher-slides.md`): how the test runs, what the app marks vs. what
Neritan marks, the full key as tap-to-reveal tiles, the writing rubric, the
speaking prompts with their picture, and the result read by skill.

### 5. Register the pair

Where the lesson JSON goes **depends on `<kind>`**, and this is the step most
likely to go wrong:

- **`quiz` → the unit's own folder.** `…/level-<n>/unit-<u>/lessons/` as
  `quiz.teacher.json` and `quiz-app.learner.json`. A unit quiz is a lesson of its
  unit and is **not** checkpoint material — `quiz` is deliberately absent from
  `CHECKPOINT_COMPONENTS`.
- **`test` / `final-test` → a checkpoint folder named for what it covers.**
  `…/level-<n>/checkpoint-<band>/lessons/`, carrying `unit:` = the band's last
  unit. **A new checkpoint folder must also be added to `lessonsDirs` in
  `scripts/validate-content.mjs`**, or nothing in it is validated at all.

Then, for any kind:

- the **teacher** JSON carries the `assessment` block — `kind`, `covers`,
  `units`, `minutes`, `questions`, `points`. `/tests` builds its card from it.
- the **learner** JSON's `moduleCount` / `moduleLabels` must match the parts
  exactly, in order, and its `storagePrefix` / `homeworkId` must match the
  questions file exactly.
- import both in `src/data/lessons.ts` and add them to the `lessons` array.

Nothing needs adding to `/tests` — it derives the shelf from the registry.

### 6. Verify

```bash
npm run validate:content && npm run typecheck && npm run build
```

The validator cross-checks the questions file against the registry: storage
prefix, homework id, lesson id, part count and names against
`moduleCount`/`moduleLabels`, points and question numbers against the
`assessment` block, minutes against the kind's allowed range, and that every
picture path is absolute and actually in the repo.

## What the validator cannot check, so you must

It checks that the test is **internally consistent**. It has never seen the paper,
so none of this is covered:

- **that a question's text matches the paper.** Transcribe, do not paraphrase —
  the publisher's own wording, instructions and numbering.
- **that an answer key is right.** Every `ans` comes off the key section of the
  extract, not from working the question out.
- **that a part is the right `kind`.** `multi` (pick two, 2/1/0) reads a lot like
  `buttons` (pick one) in plain text.
- **that the points split is right.** Keep the publisher's `PTS` exactly. What
  has one exact answer the app marks; open responses, writing and speaking are
  Neritan's.

**A writing part's `rubric` is weighted data, not a list of hints.** Each
criterion is `{ "label": "Grammar", "max": 2.5, "says": "You use correct
grammar." }`, and the engine renders them as the evaluation table Neritan marks
— a score row per criterion, what cost the marks, the same sentence put right.
The publisher gives a point total and an unweighted list, so **divide the points
evenly**: 2.5 each on a ten-point writing, 1.25 each on a five-point one. The
validator checks they add up to the question.

A `text` key may be **a list of accepted wordings** where the publisher prints
alternatives. Anything not matching still goes to Neritan rather than being
marked wrong — a rewrite can be right in words the key did not predict — unless
the part is `exact` (a number heard on a track is 265 and nothing else).

## Two rules worth restating

**A test is not a practice app and must not look like one.** One paper page per
section, the publisher's instructions and numbering, blanks and ruled lines. No
module grid, no modals, no emoji chrome, no colour rewards, and **no right/wrong
while he answers**. The teacher deck is the exception — that stays a deck.

**Check it at phone width before you call it done.** Every page with a picture, a
reading or a table is a fixed split — a reference pane that never moves over a
question pane that scrolls inside what is left. The panes must not overlap and
the document itself must never scroll.
