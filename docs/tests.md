# Tests — Turning an ExamView Export into a Digital Test

Every unit and band test Leo takes comes from the same place: the **ExamView**
test bank that ships with Our World 2E. ExamView exports one test as a single
`.rtf` — questions, answer key, and the pictures, all in one file.

This doc is the standard for turning one of those into a test Leo can take on
screen. It was written building `ow-l4-t7-9-test` (Units 7–9, Level 4); use that
pair as the reference implementation.

A test is **not** a practice app, and it must not look like one. Three rules
separate them, and everything else here follows from them:

1. **It looks like the printed test page**, not like a LEEA app. One paper page,
   the publisher's own instructions and wording, questions numbered as they are
   numbered on the sheet. No module grid, no modals, no emoji chrome, no colour
   rewards. A test Leo recognises as the test is a test he can practise for.
2. **One page per screen.** Finish a page, tap Next — the way the paper test is
   actually taken. The printed test is several pages; one endless scroll is the
   thing paper never does.
3. **The picture, the reading and the word box stay on screen the whole time he
   answers.** That is what paper does for free and a screen does not.
4. **He sees no right/wrong while he answers.**
5. **The clock is the publisher's, not ours** (see below).

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
- **One page per section**, rendered one at a time, with Back / page counter /
  Next along the bottom. Sections map to pages exactly — no question is ever
  split across two pages — so `moduleCount` and `moduleLabels` still line up.
- **Paper affordances, not app buttons.** A blank in a sentence is an inline
  `<select>` styled as an underline; a multiple-choice answer is written into the
  `____` that precedes the question number; a rewrite or a written answer is a
  textarea ruled like the underscores on the sheet. Options print down-then-across
  (a/b in the left column, c/d in the right) the way ExamView lays them out.
- **Question kinds so far:** `select` (fill the blank from a word bank),
  `buttons` (pick one), `multi` (pick two), `text` (type it), `writing`,
  `speaking`.
- **One part per section of the paper test**, in the paper's order, numbered
  `m1`…`mN` so `moduleCount` / `moduleLabels` in the lesson JSON line up.
- **No feedback while answering.** No ticks, no crosses, no score until the end.
- **Next is never blocked.** If answers are missing the page counter says so
  quietly ("3 still blank") and he moves on anyway; a test that refuses to
  advance turns a hard question into a wall. He catches up from the page index.
- **He can always go back.** Tapping the page counter opens an index of every
  page with its state (done / N blank / not started) and jumps to any of them.
  Without it, pagination takes away something paper gives him for free.
- **No Finished button.** The done-key saves itself the moment a page's last
  blank is filled; Next carries the meaning. This is the one place a test departs
  from the learner-app footer rule in `AGENTS.md` — only "Clear this page"
  remains.
- **The Answer Section is the last page**, locked until every page is finished,
  and while locked it lists the pages that still have blanks as jump links.
- **It reopens where he left off** — the current page is saved like an answer.
- **Every answer saves as it is made** (the general rule in `AGENTS.md`, and it
  matters more here — a test is long and Leo will stop halfway).

### Keeping the picture and the reading in view

Pagination is what makes this simple. Because a page holds one section, it can be
a **fixed split**: a reference pane that never moves, and a question pane that
scrolls inside what is left. Nothing is sticky, nothing overlaps, and neither can
hide the other. The pane carries whatever that section's questions need to keep
looking at — the picture, the reading, the track, the word box, or several.

The whole app is one viewport tall (`html,body{height:100%}`, `body{overflow:hidden}`,
a flex column of bar / stage / nav), so only the panes scroll. Stack them on a
phone and put them side by side from 900px, where a reading and its questions
usually fit together with no scrolling at all.

On a phone the reference pane has to earn its space: cap it near half the screen,
let the picture take what is left inside it (`flex:1 1 auto` with `object-fit:contain`),
and let a long passage scroll inside itself. Do not repeat anything in the pane
that is already on the instruction line — the track number belongs in one place,
and that space is the picture's. Check every media page at phone size: the panes
must not overlap, and the document itself must never scroll.

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

The teacher deck is the exception to rule 1: it is Neritan's, it is a deck like
every other teacher deck, and it should stay that way.

### The result

Nothing about right or wrong is shown until he has finished all the pages and
opened the result — `See the result →` on the last page. That one action reveals
the marking, and it stays revealed.

**The pages become the marked paper.** Going back through them, every question
carries a green ✔ for full marks, a red ✘ for none, the marks earned for a partly
right one, and the model answer in green underneath anything he did not get
right. Leo's own answers are locked at that point — the paper is a record now —
but Neritan's controls are not: the speaking ticks and the 0-to-max steppers stay
live, because the marking happens after.

**Under the score, the review.** Every question he did not get right, in the
paper's order: what was asked, what he wrote, and what it should have been.

```
✘ Question 24 · Rewrite · Dad marks this
My father sent me a stuffed animal. (to)
He wrote   My father sent a stuffed animal to.
Answer     My father sent a stuffed animal to me.
```

An open answer Neritan has not marked yet appears here too, with the model answer
beside it — a rewrite in unexpected words is exactly what the review is for, so
leaving it out until it had been marked would hide the most teachable entry on
the page. "Show every question" turns the same list into the whole paper for
walking through together.

One rule holds all of this together: **`markOne(part, question)` is the only
thing that decides right or wrong.** The total, the tick on the page and the
review entry all read from it, so they cannot drift apart.

`Take the test again` at the foot of the result clears everything — answers,
marks, clock — behind a two-tap confirm.

### Sittings, paper results and mistakes

A finished test files a **dated attempt** rather than overwriting a score. The
app writes it when the result is opened, keeps it current while Neritan marks,
and a retake starts a new one — see `src/data/testAttempts.ts` for the record and
`AGENTS.md` for the rules. Three things follow from it, and a new test gets all
three for free once it declares `lessonId` and `title` in its `TEST` object:

- **`/tests` shows the history** — every sitting with its date, score and whether
  it was taken in the app or on paper.
- **Paper results are recorded by hand**, either against a digital test or, for a
  test never built here, under "Other paper tests".
- **`/tests/mistakes` drills what he got wrong**, weighted toward the freshest
  misses. It is practice, so it marks as it goes — the opposite of the test.

The one rule to keep: **`pending` is not `wrong`.** An open response Neritan has
not marked yet is recorded as `pending` and skipped by the mistakes collector.
Filing it as wrong would fill his practice list with questions nobody has marked.

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

### The clock

The lesson planner sets the time for each kind of assessment, so we do not invent
one:

| Kind | `assessment.kind` | Publisher's allowance | We use |
| --- | --- | --- | --- |
| Unit quiz (1 unit) | `unit-quiz` | 15–20 minutes | 20 |
| Mastery test (3 units) | `mastery` | 20–30 minutes | 30 |
| Final test (9 units) | `final` | 30–35 minutes | 35 |

Take the top of the range: it is the same test on a screen, and Leo is A1–A2.
`scripts/validate-content.mjs` rejects a `minutes` outside its kind's range,
because that is nearly always a typo.

How the clock behaves, and why:

- **It starts on his first answer**, not when the page opens, so Neritan can look
  at the test without draining it.
- **It pauses when the test is closed** and resumes when it reopens — this is a
  test at the kitchen table, not an invigilated hall. Tapping it pauses by hand.
- **At zero it says so and keeps counting**, in red, as overtime. Nothing locks.
  A half-written sentence is never thrown away, and whether to stop is Neritan's
  call, not the app's.
- **The time taken is recorded** into the score record (`timeTakenSec`) and shown
  on the Answer Section and on `/tests`.

Keep the clock clear of the top-right corner of the frame: the page that embeds a
learner app floats its own "Exit Fullscreen" button there, and anything tappable
underneath it cannot be tapped at all. This was a real bug — the clock shipped
there first and could not be paused.

### Easy on the eyes

A test is read for half an hour straight, so it is not plain black on plain
white: the page is a warm off-white, reference material (picture, reading, word
box) stays bright so it stands out against it, and the questions are striped like
a ledger — every other row tinted. The stripes are not decoration; they keep each
blank visibly tied to its own question.

## 5. Register it

A test is **checkpoint material**, like review and extra reading: it sits after a
three-unit band, not inside the last unit. So:

- lesson JSON goes in `…/level-<n>/checkpoint-<band>/lessons/`, as
  `test.teacher.json` and `test-app.learner.json`, carrying `unit:` = the band's
  last unit
- the teacher JSON carries an **`assessment` block** — `kind`, `covers`, `units`,
  `minutes`, `questions`, `points`. `/tests` builds its card from this, and the
  validator requires it:

  ```json
  "assessment": {
    "kind": "mastery", "covers": "Units 7–9", "units": [7, 8, 9],
    "minutes": 30, "questions": 42, "points": 80
  }
  ```

- import both in `src/data/lessons.ts` and add them to the `lessons` array
- `test` is already in `componentOrder`, `CHECKPOINT_COMPONENTS`,
  `checkpointComponents` (TeacherDashboard) and `getComponentMeta`

Nothing needs adding to `/tests` itself: `src/components/TestsPage.tsx` derives
the shelf from the lesson registry, pairing each teacher `test` with its learner
`test-app`, and filters by level. A new test appears the moment it is registered.
Results come from `getAssessmentResult(source)` in `src/data/learnerProgress.ts`,
which reads the marks (not the percent) and what is still waiting on Neritan.

Then run the usual chain: `npm run validate:content`, `npm run typecheck`,
`npm run build`.

## The Units 7–9 test, as a worked example

80 points over 13 parts and 42 questions. 56 mark themselves; 24 are Neritan's
(Q36–37 sentences, Q41 writing, Q42 speaking). By skill: vocabulary 30, grammar
18, reading 12, listening 4, writing 10, speaking 10. Audio TR 9.3, 9.4 and 9.4a;
pictures on Q1 and Q42.
