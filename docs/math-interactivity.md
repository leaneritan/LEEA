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
