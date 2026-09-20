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

**One picture in the Units 1–9 export came out with a seam across it**, and the
extractor now undoes it. Word fits a picture to its frame by duplicating a band
of pixels at the exact middle rather than resampling, so the photo arrives with a
strip of repeated scanlines across the centre and a matching strip of repeated
columns down it. `unstretch()` drops them — every removed line is byte-identical
to the one before it, so the original bitmap comes back exactly (540x289 became
531x280). The test is narrow on purpose: a short run of identical lines, centred
on *both* axes at once. A photo can easily have one flat band; two, both
straddling the middle, is the stretch and nothing else. The run prints
`(un-stretched: dropped N duplicate rows, M columns)` so it is never silent, and
the Units 7–9 pictures still extract byte-for-byte identically.

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

## 3. Write the questions file

**A test is its questions and nothing else.** The engine every test runs on —
the paper layout, the pages, the clock, the marking, the attempt record — is
`public/components/test-engine.js`, shared by all of them. A test is a data file
beside its own pictures, and a shell page that names it:

```
public/tests/our-world/level-4/u9/questions.json   <- the test
public/tests/our-world/level-4/u9/q01-playground.png
public/learn/ow-l4-u9-quiz.html                    <- 16 lines
```

The whole shell:

```html
<script>window.LEEA_TEST = '/tests/our-world/level-4/u9/questions.json';</script>
<script src="/components/test-engine.js"></script>
```

It used to be one self-contained HTML file per test, and the third one made that
untenable: ~950 of each file's ~1,250 lines were the engine, copied verbatim, so
every fix had to be applied three times or the copies drifted. The tests are all
the same activities, so the activities are the engine and the questions are the
data.

The file's own fields:

| Field | What it is |
| --- | --- |
| `id` | the test's short id, used to name a sitting |
| `lessonId` | the **learner** lesson id — attempts are filed under this |
| `title` / `shortTitle` | the page title, and the name in the test's own bar |
| `course` | the line before it in the bar, e.g. `Our World 4` |
| `storagePrefix` / `homeworkId` | must match the learner lesson JSON exactly |
| `minutes` | must match the teacher lesson's `assessment.minutes` |
| `parts[]` | one per section of the paper, in the paper's order |

`scripts/validate-content.mjs` checks every one of those against the lesson
registry, adds up the questions' points and numbers and compares them with the
`assessment` block, and fails on a picture path that is relative or missing. All
three used to be kept by hand in three places at once.

Then, what is specific to a test as a thing Leo sits:
- **One page per section**, rendered one at a time, with Back / page counter /
  Next along the bottom. Sections map to pages exactly — no question is ever
  split across two pages — so `moduleCount` and `moduleLabels` still line up.
- **Paper affordances, not app buttons.** A blank in a sentence is an inline
  `<select>` styled as an underline; a multiple-choice answer is written into the
  `____` that precedes the question number; a rewrite or a written answer is a
  textarea ruled like the underscores on the sheet. Options print down-then-across
  (a/b in the left column, c/d in the right) the way ExamView lays them out.
- **The six question kinds**, which between them cover every ExamView section
  seen so far — a unit quiz, a three-unit mastery test and a nine-unit final:

  | `kind` | What it is | Marked by |
  | --- | --- | --- |
  | `select` | fill the blank from a word bank | the app |
  | `buttons` | pick one (a/b/c, T/F, which/who) | the app |
  | `multi` | pick two, 2/1/0 for both/one/any wrong | the app |
  | `text` | type it | the app when it matches a key, else Neritan — and his mark overrules either way |
  | `writing` | a paragraph against a weighted rubric | Neritan, criterion by criterion |
  | `speaking` | prompts Neritan asks, one tick each | Neritan |

  Part-level flags: `paperN`, `blankFirst`, `labelsOnPicture`, `exact`,
  `dadMarks`, `bank`, `example`, `track` + `audio`, `passage`, `table`,
  `image`/`imageAlt` or `images[]`, `caption`.

  A `text` key may be **one string or a list of accepted wordings** — the
  publisher prints three for "the more he feels dizzy / the more dizzy he feels
  / the dizzier he feels", and any of them is simply right. Anything else still
  goes to Neritan rather than being marked wrong, unless the part is `exact`.

  A `writing` part with **two** prompts is a choice (a/b) Leo has to make; with
  **one** it is just the question, and the page finishes on the text alone.
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
- **Open responses and speaking are Neritan's**, with a 0-to-max button row on
  the score screen and the publisher's sample answer shown.
- **The writing gets an evaluation table, not a single number.** Its `rubric` is
  weighted data — `{ "label": "Grammar", "max": 2.5, "says": "You use correct
  grammar." }` — and the score screen renders it as the table a marked paper
  test carries: a score row per criterion in fifths of that criterion's weight,
  a box for what cost the marks, a box for the same sentence put right, and a
  note on the piece as a whole. All of it is filed into the attempt, so
  `/tests/report` shows the marked rubric for an app sitting exactly as it does
  for a paper one.

  The publisher gives a point total and an unweighted list of criteria, so the
  weights **divide evenly** — 2.5 each on a ten-point writing — and
  `validate-content.mjs` checks they add up to the question. A paper that does
  weight its criteria can say so in the same field.

  **The marks on offer are the paper's own band grid, not a range.** The answer
  section prints the columns **2.5 · 2 · 1.5 · 1** — four bands, half a point
  apart, **no zero**, so the lowest a ten-point writing can come out is 4. Put
  that grid in `rubricScale` on the writing part, highest first, exactly as the
  columns read; the validator checks it starts at the criterion's own weight and
  descends. An unmarked criterion scores `null`, never 0, and the writing
  question stays `pending` until every row has a mark.

  **The grid does not shrink to fit the points.** Every writing is marked on the
  same four criteria out of 2.5 — a rubric out of ten — and the question
  contributes what its PTS says. A five-point unit quiz therefore counts that
  rubric for half, which the engine scales and the Total row spells out
  (`8 / 10 → 4 / 5 on the test`). The validator checks the criteria are equally
  weighted, not that they add up to the question.

  **Read the grid out of the export; do not assume a paper has one.** A unit
  quiz prints `ANS: Answers will vary. PTS: 5` and no rubric — Level 4's Unit 8
  and Unit 9 quizzes both do. Their criteria are LEEA's own, borrowed from the
  band test, and the file should not pretend otherwise.
- **Two-answer questions** (worth 2) give 2 for both right, 1 for one right with
  nothing wrong, 0 if anything wrong is picked. Say that rule on screen.
- **Every written answer stays Neritan's to mark**, the ones the app placed
  included. *Your marking* on the score screen lists them all — what Leo wrote,
  the accepted wordings, and the button row with the standing mark highlighted —
  and his mark **overrules** the key. `markOne` reads it first for a `text`
  question; "let the app decide" hands one back. The key is a wording the
  publisher predicted, not the only right answer: `exact` marks a listening
  number wrong the moment Leo writes *two hundred sixty five* for *265*, and on
  the Level 4 final that answer is ticked on the paper.
- **A `pending` answer is never a mistake and must not look like one.** Nobody
  has judged it yet, so it is not in the "to go over" count, its review row reads
  ◑ *Dad marks this*, and its section says how many are still to mark. Showing
  `0 / 1` beside a merely unmarked answer made a whole grammar section read as
  failed.
- **Print each accepted wording once.** `correctText` de-duplicates by `norm`:
  some keys exist only to accept a capital letter, and "The more you practice  /
  the more you practice" makes the separator look like part of the answer.

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

### Clearing a sitting

**A wipe is one cloud write, never one per key.** Every `localStorage` write
inside a learner app is mirrored to Supabase by the bridge in `LessonPage.tsx`,
and each mirror is a read-modify-write of that homework's whole `raw_progress`
object. Clearing a page drops a dozen keys and a retake drops thirty, so those
writes all read the same starting state and put back what the others had just
removed. The answers survived in the cloud, the next page that called
`syncLearnerProgressWithCloud` hydrated them into localStorage, and the cleared
work came back with the old clock still on it.

Four things stop it, and new code needs all of them:

- `LEEA_CLOUD.clearProgress(keys)` — the app sends one `LEEA_CLOUD_CLEAR`
  message for the whole wipe (`lDropAll` in the test files), removing the keys
  locally through the *unpatched* `removeItem` so no per-key messages also fire.
- Cloud writes queue per homework id in `learnerProgress.ts`, so two of them can
  never interleave even when something else sends them one at a time. They are
  also coalesced on a 400ms idle: a sitting used to make over 1,500 round trips,
  one per keystroke, which is what put a reset at the back of a long queue.
- A full clear bumps a write generation, so everything queued before it becomes
  a no-op rather than putting its own key back.
- A clear records `leea-__sitting-cleared-at` in `raw_progress`, and every device
  wipes its own copy the first time it sees a marker it has not applied. Without
  it the tab Leo sat the test in simply uploads the sitting again.
- `sittingStorageKeys()` is the one definition of what a sitting owns, including
  the homework flags that live OUTSIDE the storage prefix in two spellings. The
  retake used to miss them, so the test still read as finished after a reset.

Clearing from **outside** the learner frame needs saying out loud: `/tests` runs
in the app, not in the iframe, so its "Clear the sitting" calls
`clearLearnerProgressCloud` itself. Wiping only localStorage there left the
cloud row whole and the sitting came straight back on the next sync.

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

`public/lessons/<lesson-id>.html` — `ow-l4-u9-quiz.html` for a unit quiz,
`ow-l4-t7-9-test.html` for a band test — on the shared slideshow shell
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
- **It stops when the result is opened.** That is the end of the sitting, so the
  pill switches from "34:56 left" to "0:04 taken", and tapping it no longer
  pauses or restarts anything — only a retake starts a new clock. It used to
  keep counting while Neritan marked, which read as a test still running and
  quietly inflated what the sitting recorded, because the attempt is rewritten
  on every mark.
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

**Where the lesson JSON goes depends on which of the three it is**, and this is
the step most likely to go wrong:

- **A unit quiz belongs to its unit.** `…/level-<n>/unit-<u>/lessons/`, as
  `quiz.teacher.json` and `quiz-app.learner.json`. It is *not* checkpoint
  material — `quiz` is deliberately absent from `CHECKPOINT_COMPONENTS` — and it
  needs no new folder registering anywhere.
- **A band test and a level final are checkpoint material**, like review and
  extra reading: they sit after a band, not inside its last unit. The lesson JSON
  goes in `…/level-<n>/checkpoint-<band>/lessons/` as `test.teacher.json` /
  `test-app.learner.json` (or `final-test…`), carrying `unit:` = the band's last
  unit. A **new checkpoint folder must also be added to `lessonsDirs`** in
  `scripts/validate-content.mjs`, or nothing in it is validated.
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
- `test` and `final-test` are already in `componentOrder`,
  `CHECKPOINT_COMPONENTS`, `TEST_COMPONENTS`, `checkpointComponents`
  (TeacherDashboard) and `getComponentMeta`

**A band test is `test`; a whole-level final is `final-test`.** They are two
components rather than one because a level's final covers the same band-end unit
as its last mastery test — Level 4 has both at Unit 9 — and everything that pairs
a teacher lesson with Leo's app pairs by component. One shared component would
have pointed both teacher cards at the same app. The final's folder is named for
what it covers: `checkpoint-1-9/`, with `final-test.teacher.json` and
`final-test-app.learner.json`.

Nothing needs adding to `/tests` itself: `src/components/TestsPage.tsx` derives
the shelf from the lesson registry, pairing each teacher test with the learner
`<component>-app` in the same course, level and unit, and filters by level. A new
test appears the moment it is registered.
Results come from `getAssessmentResult(source)` in `src/data/learnerProgress.ts`,
which reads the marks (not the percent) and what is still waiting on Neritan.

Then run the usual chain: `npm run validate:content`, `npm run typecheck`,
`npm run build`.

## The three Level 4 tests, as worked examples

One of each kind is now built, so there is a file of the right shape to copy
whatever you are building:

| Kind | Questions file | Lesson JSON pair |
| --- | --- | --- |
| `quiz` | `public/tests/our-world/level-4/u9/questions.json` | `…/level-4/unit-9/lessons/quiz{,-app}.*.json` |
| `test` | `public/tests/our-world/level-4/t7-9/questions.json` | `…/level-4/checkpoint-7-9/lessons/test{,-app}.*.json` |
| `final-test` | `public/tests/our-world/level-4/t1-9/questions.json` | `…/level-4/checkpoint-1-9/lessons/final-test{,-app}.*.json` |

**Unit 9 quiz.** 50 points over 10 parts and 36 questions, 20 minutes. 39 marks
are the app's, 11 Neritan's (Q35 writing, Q36 speaking, and any Q7–15 sentence
the key did not predict). Audio TR 9.1 (Q1) and TR 9.2 (Q30–34); pictures on Q1
and Q36. It is the only one of the three that is not checkpoint material.


**Units 7–9 mastery test.** 80 points over 13 parts and 42 questions. 56 mark
themselves; 24 are Neritan's (Q36–37 sentences, Q41 writing, Q42 speaking). By
skill: vocabulary 30, grammar 18, reading 12, listening 4, writing 10, speaking
10. Audio TR 9.3, 9.4 and 9.4a; pictures on Q1 and Q42.

**Units 1–9 final test.** 80 points over 13 parts and 49 questions, 35 minutes.
47 mark themselves; 33 are Neritan's (Q8–10, Q37–39 and Q46–47 sentences, Q48
writing, Q49 speaking). By skill: vocabulary 18, grammar 17, reading 19,
listening 6, writing 10, speaking 10 — the publisher files Q46–47 under reading
even though they are heard, because they test *than*. Audio TR 9.5 (Q1) and TR
9.6 (Q40–47); pictures on Q1, Q48 (two) and Q49.

It added three things to the shared engine, all of them in both test files so the
two stay identical below the ENGINE line:

- **`exact: true`** on a part. A typed answer normally goes to Neritan when it
  does not match the key, because a rewrite can be right in words the key did not
  predict. A number heard on a track cannot be: 265 is 265. An `exact` part marks
  itself either way, and its answers get one ruled line instead of two.
- **`table: { head, rows }`** — a table the paper prints beside its questions,
  reproduced as one in the reference pane. Q40–45 fill the soccer-and-baseball
  table, so the table has to stay on screen while they are answered.
- **`images: [{ src, alt }]`** — several pictures in the reference pane.
  `image`/`imageAlt` is still the one-picture shorthand. Q48 compares a dolphin
  and a shark, so it needs both at once.

And one flag that replaced a heuristic: **`labelsOnPicture: true`** says a bank of
single letters is printed on the picture rather than being a word box. It used to
be guessed from "the bank is short and its first entry is one character long",
which broke the moment a bank ran A–J instead of A–G.
