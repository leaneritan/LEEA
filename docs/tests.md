# Tests — Turning an ExamView Export into a Digital Test

Every unit and band test Leo takes comes from the same place: the **ExamView**
test bank that ships with Our World 2E. ExamView exports one test as a single
`.rtf` — questions, answer key, and the pictures, all in one file.

This doc is the standard for turning one of those into a test Leo can take on
screen. It was written building `ow-l4-t7-9-test` (Units 7–9, Level 4); use that
pair as the reference implementation.

A test is **not** a practice app. The one rule that separates them: Leo sees no
right/wrong while he answers. Everything else here follows from that.

## What you get and what you build

| From the publisher | What it becomes |
| --- | --- |
| `L4U7-9.rtf` | the question data block in the learner app |
| the pictures inside it | PNGs under `public/tests/<course>/level-<n>/<slug>/` |
| the answer key section | the teacher deck's tap-to-reveal slides |
| the ExamView audio (already in the repo) | `<audio>` players inside the parts that need them |

## 1. Extract the RTF

```bash
node scripts/extract-examview-test.mjs ~/Downloads/L4U7-9.rtf \
  --out /tmp/t7-9 --slug ow-l4-t7-9
```

That writes `ow-l4-t7-9.txt` (questions then the answer key, with `[[IMAGE n]]`
where each picture sat) and one `ow-l4-t7-9-pN.png` per picture.

**The pictures are the part worth knowing about.** They are not files inside the
RTF and no converter will open the export — LibreOffice refuses it outright.
Each one is a Windows Metafile wrapping a single 8-bit DIB, stored as hex in a
`\pict` group. The script lifts the DIB straight out and writes it as an indexed
PNG using nothing but Node's own `zlib`, which is lossless and needs no
dependency. So: never screenshot the test, never redraw the picture, never ask
for a separate image file. It is already in the RTF at full quality.

File the PNGs under a name that says which question they belong to:

```
public/tests/our-world/level-4/t7-9/q01-playground.png
public/tests/our-world/level-4/t7-9/q42-town-park.png
```

Learner apps are embedded with `srcdoc` and a `<base href>` pointing at the site
root, so reference them **absolutely** (`/tests/…`), never relatively.

## 2. Check the audio is filed

Test audio is already handled — see **Assessment Audio** in `AGENTS.md`. Find the
tracks the test names (`TR: 9.3` and so on) in the level manifest:

```
content/subjects/english/courses/our-world/level-<n>/assessment-audio.json
```

and use the `path` from the manifest entry in the app. Do not guess the filename:
a band review track lives in the folder of the unit that *numbers* it (9.3
reviews Units 7–9 and lives in `unit-9/`), and a sub-lettered track like `9.4a`
is its own file, not a section of `9.4`.

## 3. Build the learner app

`public/learn/ow-l<level>-t<band>-test.html`, following `public/learn/AGENTS.md`
and the save/restore contract in `AGENTS.md` like any learner app. What is
specific to a test:

- **One `TEST` data object at the top, a generic engine below it.** The engine in
  `ow-l4-t7-9-test.html` knows nothing about Units 7–9 — a new test is a new
  `TEST` object and nothing else. Grow the engine only when a test needs a
  question shape it does not have.
- **Question kinds so far:** `select` (fill the blank from a word bank),
  `buttons` (pick one), `multi` (pick two), `text` (type it), `writing`,
  `speaking`.
- **One part per section of the paper test**, in the paper's order, numbered
  `m1`…`mN` so `moduleCount` / `moduleLabels` in the lesson JSON line up.
- **No feedback while answering.** No ticks, no crosses, no score until the end.
- **The score screen stays locked** until every part is marked complete.
- **Every answer saves as it is made** (the general rule in `AGENTS.md`, and it
  matters more here — a test is long and Leo will stop halfway).

### Scoring

Keep the publisher's points exactly; they are in the answer key as `PTS`. Split
them into what the app can mark and what Neritan must:

- **Exact answers mark themselves.** Text answers are compared after normalising
  case, spacing, curly apostrophes and a trailing period.
- **A `text` question with an `ans` that does not match is not marked wrong** — it
  goes to Neritan on the score screen with the model answer beside it. A rewrite
  can be right in words the key did not predict.
- **Open responses, writing and speaking are Neritan's**, with a 0-to-max button
  row on the score screen and the publisher's sample answer or rubric shown.
- **Two-answer questions** (worth 2) give 2 for both right, 1 for one right with
  nothing wrong, 0 if anything wrong is picked. Say that rule on screen.

## 4. Build the teacher deck

`public/lessons/ow-l<level>-t<band>-test.html`, on the shared slideshow shell
(`docs/teacher-slides.md`). It is the answer key and the script for the parts
Neritan runs:

- how the test runs, and which points the app marks vs. which he does
- the full key as **tap-to-reveal tiles**, so he can ask before he confirms
- the writing rubric, and the speaking prompts with their expected answers
- the result read by skill, so a weak part points at a unit to re-teach

The pictures belong on the deck too — the Q1 key next to its picture, and the
speaking picture beside its prompts.

## 5. Register it

A test is **checkpoint material**, like review and extra reading: it sits after a
three-unit band, not inside the last unit. So:

- lesson JSON goes in `…/level-<n>/checkpoint-<band>/lessons/`, as
  `test.teacher.json` and `test-app.learner.json`, carrying `unit:` = the band's
  last unit
- import both in `src/data/lessons.ts` and add them to the `lessons` array
- `test` is already in `componentOrder`, `CHECKPOINT_COMPONENTS`,
  `checkpointComponents` (TeacherDashboard) and `getComponentMeta`

Then run the usual chain: `npm run validate:content`, `npm run typecheck`,
`npm run build`.

## The Units 7–9 test, as a worked example

80 points over 13 parts and 42 questions. 56 mark themselves; 24 are Neritan's
(Q36–37 sentences, Q41 writing, Q42 speaking). By skill: vocabulary 30, grammar
18, reading 12, listening 4, writing 10, speaking 10. Audio TR 9.3, 9.4 and 9.4a;
pictures on Q1 and Q42.
