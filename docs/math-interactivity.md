# Math Lesson Interactivity Standard

## The rule

Digitizing a textbook page as static text is not worth doing. If Leo can only
read it, the physical book already does that job better — better print
quality, no screen, no batteries. The entire point of turning a lesson into
an app is that Leo can *touch* the math: manipulate it, get something wrong,
get real feedback, try again. Every math lesson must give Leo something to
interact with, not just something to read.

## Time is not the constraint

Building this content properly takes real time: reading every page of the
scan, tracing the textbook's exact examples, designing a widget that fits
the specific idea being taught, wiring it into the block schema, and testing
it by actually clicking through it. All of that is expected and fine — take
as long as it takes. What must never happen is shipping a lesson that skips
or fakes interactivity to save time.

## What counts as interactive

Not everything needs a custom widget. Worked examples, きまり (rule) boxes,
and practice problems (問1, 問2, …) are fine as read/attempt-then-reveal
blocks — Leo does the work with pencil and paper, same as the book. What
must **not** ship as static text is anything the textbook itself flags as
digital/hands-on content:

- Any block with a 「シミュレーション」 QR chip in the source scan
- Any activity that's inherently about manipulating something — plotting
  points, comparing quantities, sorting, building, drawing cards — rather
  than reading a worked solution

Those get a real widget: something Leo clicks, drags, types into, or steps
through, that computes an answer from his input and tells him whether he's
right. A static description of the activity, or a chip that links nowhere,
does not satisfy this.

## Precedent — the bar to hit

Built so far, in `src/components/math/blocks/`:

- `KukuTableWidget` — clickable 9×9 table with row/diagonal/2×2-square modes
  (九九表のきまり, はるきさんの予想)
- `PrimeSieveWidget` — live 1–100 Eratosthenes sieve with answer-checking
  (エラトステネスのふるい)
- `NumberLineWalkWidget` — two-move number-line addition with live equation
  (東西の移動)
- `CardGameWidget` — random card draw with a running signed-number total
  (トランプゲーム)
- `NumberLinePlotWidget` — click-to-place number line with correctness
  feedback (数直線をつくる)

Every one of these computes something real from Leo's input and reports
whether he's right — none of them replay a fixed animation or just show the
book's answer. New widgets should match that bar, not fall short of it.

## Two source books

- `docs/lesson-plans/math/new-mathematics-1/` — 新編 新しい数学1, the textbook.
  Fully scanned, 0章–7章.
- `docs/lesson-plans/math/sugaku-no-gakushu-note-1/` — 数学の学習ノート 1年
  （東京書籍版）, the 教科書準拠ワーク that goes with it. Scanned so far:
  中学数学スタートDASH! p.2–9, 0章 p.10–11, 1章 p.12–41.

Their paginations are unrelated, so a bare page number is ambiguous between
them: every `page` field in `content/subjects/math/` means a **textbook** page.
Each workbook section prints its own 教科書 P.NN cross-reference, so read that
mapping off the page rather than inferring it from chapter order. The workbook
scans are Leo's worked copy, marked in red — the printed question is the source
of truth, the handwriting is evidence of what he did, not an answer key.

## Authoring a 学習ノート section

The workbook is its own tab at `/math/note`, not extra blocks bolted onto a
textbook 節 — two books, two spines, each owning its own page numbers.

- `content/subjects/math/note/curriculum.ts` — the workbook's 目次. Flip
  `authored: true` on a row when its JSON lands; everything else renders 準備中.
- `content/subjects/math/note/sections/<id>.json` — one file per section.
- `content/subjects/math/note/types.ts` — the block vocabulary: `teach`,
  `point`, `qset`, `carry`.

**Widgets are shared, not duplicated.** A `qset` question can carry a `widget`
instead of `parts`, and its `kind` is the same `MathBlockInteractiveWidget`
union the textbook uses — so every widget already built is available here.
Parameterise an existing widget before writing a new one: p.14 問2 is the
textbook's own `NumberLinePlotWidget` over a different range, which is why that
component takes `min`/`max`/`targets` now instead of having been forked.

**How Leo answers, in order of preference** (`note/answer.ts` does the marking):

1. `accept` — he types the answer and is marked ○/×. The common case in 数学,
   where an answer is a value rather than a choice. The normaliser handles
   full-width ＋－, a katakana ー for a minus, 、 for a comma, and stray spaces;
   numbers compare numerically, so "+14", "14" and "14.0" agree, as do "-8/3"
   and "-2.666…". Add `unordered` for a set answer, `unit` so he types the
   number and not the 冊/℃.
2. `choices` + `correct` — **only where the book itself prints options**, in the
   book's own order. A 「どちらですか」 question prints exactly two. Never invent
   distractors: a made-up wrong answer teaches a made-up distinction.
3. `answer` alone — a 記述 question. Self-check, no marking.
4. Nothing — paper work. No button.

Set `strictSign: true` on a question that exists to teach ＋/－ notation
("＋，－の符号を使って…"), so a bare "7" is not accepted for "+7" — there, that
is the mistake being corrected rather than a formatting difference.

**Answers are recomputed, and say so.** The 別冊解答 is not scanned, so every
`answer` carries a `source` recording how it was established. Where the
handwriting in the scan disagrees with the mathematics, the `source` says that
too — p.13 B問1(2) is written as ＋3時間 and is actually －3時間, and p.12 A問2
is missing 7 and wrongly includes 0. Those are the reason the rule exists.

## Process for a new lesson

1. **Read every page of the source scan before writing anything.** A full
   read, not a skim — see `docs/lesson-plans/math/new-mathematics-1/README.md`
   for what happened the one time a page got skipped (a whole page of content
   went undocumented and took several rounds to catch).
2. **Identify every シミュレーション-tagged (or otherwise hands-on) moment**
   and design a widget for each one before writing the surrounding static
   block content.
3. **Build the widget as its own component** under
   `src/components/math/blocks/`, add its kind to `MathBlockInteractiveWidget`
   in `content/subjects/math/types.ts`, and wire it into the `InteractiveBlock`
   dispatcher.
4. **Verify it for real.** Run the dev server, take Playwright screenshots,
   and actually click/drag through the interaction — confirm both the
   "correct" and "incorrect" paths render sensibly. `npm run typecheck` and
   `npm run lint` passing is necessary but never sufficient proof that an
   interactive widget actually works.
