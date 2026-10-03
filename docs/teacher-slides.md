# Teacher Slides — Slideshow Conventions

Teacher lessons are slide decks for Neritan to teach Leo directly. They are **custom-crafted per lesson** — the design follows the source material's flow, not a generic template.

Leo learner apps are templated by component (see `docs/components.md`). Teacher slides are not.

## Naming and pairing

- File path: `public/lessons/<lesson-id>.html`
- Lesson ID: `ow-l<level>-u<unit>-<component>` e.g. `ow-l4-u8-opener`
- Teacher `<component>` must have a paired learner `<component>-app` in the same level/unit — the validator enforces this and the Neritan Teacher Menu surfaces app controls on the teacher card via this pairing

## Handoff hooks for externally-built decks

If a deck is drafted outside this repo (e.g. in a separate Claude conversation) and handed over as a finished `.html` file, only these technical hooks need to match before it's dropped in — the slide content and pedagogy are the drafting session's call, not this checklist's:

- **Filename matches the lesson it's for.** `ow-l<level>-u<unit>-<component>.html` — using this lesson's own level/unit/component, not whatever value was left over from a template file it was copied from.
- **`SAVE_PREFIX` and `HOMEWORK_ID` match the same lesson id**, not the template it was built from:
  ```js
  var SAVE_PREFIX = '<level>-<unit>-<component>-slides-';
  var HOMEWORK_ID = new URLSearchParams(location.search).get('hw') || 'leo-<level>-<unit>-<component>-slides';
  ```
  e.g. Level 5 Unit 1 opener: `'5-1-opener-slides-'` / `'leo-5-1-opener-slides'`. A leftover value here silently saves Leo's progress under the wrong lesson's key.
- **Fonts load non-blocking**, since every lesson renders inside an iframe and a stalled render-blocking font request can hang the whole document:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="...&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="...&display=swap"></noscript>
  ```
- **Cloud sync script tags are present, unchanged**, with the relative path kept as-is (two levels up from `public/lessons/` or `public/learn/`):
  ```html
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="../../lib/leea-cloud-config.js"></script>
  <script src="../../lib/leea-cloud.js"></script>
  ```
  **Keep `lib/` in the path.** Whatever the number of `../`, it must end in
  `lib/leea-cloud-config.js` and `lib/leea-cloud.js` — `../` cannot climb above
  the site root, so every depth resolves to `/lib/…` and the segment is the only
  part that matters. One deck shipped with it missing and pointed at
  `/leea-cloud.js` for months; `scripts/validate-content.mjs` now fails on any
  lesson `<script src>` naming a file that is not under `public/`.

  **What those two files do.** `public/lib/leea-cloud.js` defines
  `window.LEEA_CLOUD` — the `saveProgress` / `fetchProgress` / `deleteProgress`
  / `clearProgress` contract every call site is written against — backed by
  localStorage, with `enabled: false` from `leea-cloud-config.js`. It is
  deliberately not a cloud writer: no table stores a teacher deck's per-slide
  state, and golden rule 11a says a write to a table that does not exist looks
  exactly like sync working. A deck iframe is same-origin with the app, so its
  localStorage already *is* the app's — which is why "Mark Done" reaches the
  teacher dashboard with no cloud involved.

  **It stands down if a bridge already exists.** Learner apps get a real,
  Supabase-backed bridge injected by `injectLearnerCloudBridge` in
  `src/components/LessonPage.tsx`, placed immediately after `<head>` — that is,
  *before* these tags. `leea-cloud.js` returns early when it finds
  `window.LEEA_CLOUD` already set, because assigning over it would silently cut
  live cloud sync in the six learner apps that carry these tags.

Everything else — registering the lesson so it appears on the teacher dashboard, pairing it with a learner app, adding any new vocabulary word the deck introduces to the content model — happens after handoff, not before it. **The Reference check is not optional:** every word card the deck presents (academic, content, related — including words the deck chose where the planner printed none) must exist in Reference with this lesson's source tag before the upload PR ships. See AGENTS.md rule 5a.

## Why custom, not templated

Each lesson plan in the NatGeo planner has its own teaching flow: opener has a photo discussion and caption activity; vocab-1 has a graphic organizer (sunshine, two-column chart, etc.); song has lyrics and listen-and-sing; grammar has the rule box, Notice / Build / Fix / Use activities; reading has a passage and comprehension; writing has a model and planning chart.

Forcing all of these into one slide template flattens what makes each lesson teachable. The slideshow shell is shared (CSS, navigation, "Mark Done" wiring), but the slides themselves match the source flow.

## Shared shell

Every teacher slideshow uses the same outer structure:

- Same fonts (Syne for display, DM Sans for body)
- Same navigation pattern (previous / next / progress)
- Same Mark Done button that writes to `leea.lessonProgress.v1` via `lessonProgress.ts`
- Same component tone left edge from `getComponentMeta()`

Look at `public/lessons/ow-l4-u7-opener.html` (locked reference, 1404 lines, 21 slides) for the opener shell. Use `/opener-app` skill to generate opener slideshows + Leo apps for any unit. New teacher slideshows for other component types copy the outer shell and replace the inner slide content.

## What each component's slides should cover

Use the NatGeo planner activity sections as the slide flow:

### opener

> **Skill**: `/opener-app` — generates both teacher slideshow and Leo learner app end-to-end.

21-slide structure:
- s1: Title card (gradient, unit theme chips)
- s2–s3: Anchor photo + discussion prompts
- s4: Caption writing activity
- s5–s8: Content vocabulary (4 words, bespoke game per word)
- s9: Content vocab flip-card recap
- s10–s13: Academic vocabulary (4 words, arctic blue theme)
- s14: Academic vocab flip-card recap
- s15: Unit goals — "In This Unit I Will…" (4 goals from planner)
- s16: Teaching Tip / Look and Check
- s17: Be the Expert (tap-to-reveal fact cards)
- s18: Discussion wrap-up (reveal question cards)
- s19–s20: Unit preview / Coming up
- s21: Mark Done

### vocab-1 / vocab-2
- Warm Up
- Present (word cards / display)
- Practice (the graphic organizer activity for that unit — sunshine, word web, two-column chart, etc.)
- Apply / Sort / Game
- Formative check

### song
- Lyrics with annotation
- Listen and sing
- Use the Song activities
- Use It Again

### grammar-1 / grammar-2
- Warm Up
- Present — the grammar box from `grammar.json` chart
- Notice / Build / Fix / Use activities
- Apply activity (often a class survey or pair work)
- Wrap Up sentence frames
- Reads chart data from `grammar.json`, not a hardcoded copy

### reading
- Pre-read (introduce strategy)
- Listen and read (full text)
- Comprehension activity (sequence / fill chart)
- Apply (graphic organizer)
- Discuss

### writing
- Read the model
- Annotate the model
- Plan (column chart from PDF)
- Write
- Edit checklist
- Share

### review
- Mixed checkpoint review after Units 1-3, 4-6, or 7-9
- Recycle vocabulary, academic language, grammar, reading/listening skills, and common errors from the full band
- Include quick teacher checks before Leo gets the paired review app

### lets-talk
- Functional dialogue after Units 1-3, 4-6, or 7-9 — **Levels 4-6 only**
- Name the page's two jobs before either dialogue (show interest / ask for help)
- Each SB dialogue verbatim, with the target phrases marked in the line
- One drill per function, and a pair-practice slide that swaps the roles — the swap is where the phrases get produced rather than heard
- A "use it for real" slide with a tick checklist, because the point of the page is the week after the lesson
- Where a printed activity's own questions are not legible in the source, print the answer key in the teacher notes and mark the slide's question as ours — do not invent the book's wording

### extra-reading
- Extended checkpoint reading after Units 1-3, 4-6, or 7-9
- Pre-read vocabulary/glossary support
- Read or listen to the text
- Comprehension checks and a short response
- Add new word-like items to Reference with `OW<level>-ER<start>-<end>` source tags when needed

## Mark Done storage

Every teacher slideshow ends with a Mark Done button:

```js
import('/_lib/lessonProgress.js').then(({ markDone }) => markDone('ow-l4-u8-opener'));
```

The progress shape is `LessonProgressRecord` with `lessonId`, `teacherId`, `studentId`, `status`, `completedAt`, `updatedAt`. The same record will sync to Supabase later.

## Slide data sources

Where each part of a slide comes from:

| Slide part | Source |
|---|---|
| Vocab word display | `vocabulary.json` for the unit (single source of truth — same emoji, meaning, Japanese as Reference) |
| Grammar box | `grammar.json` chart for the unit |
| Reading text | the planner PDF (verbatim) and/or supporting student book PDF |
| Song lyrics | the planner PDF (verbatim) |
| Writing model | the planner PDF (verbatim) |
| Photo / video references | the planner PDF, with TR codes preserved |

Do not duplicate vocab or grammar content inside a teacher HTML when it lives in `vocabulary.json` or `grammar.json`. Slides should read from data or, if static-baked for performance, the source of truth is still the JSON — change the JSON and the slide updates next render.

This is why emojis stay consistent across Reference, Leo apps, and teacher slides — every surface reads the same `displayEmoji` from `vocabulary.json`.

## Level 5 deck anatomy — and how Leo's app mirrors it

The Level 5 Unit 1 decks Neritan authored (opener → writing) settled into one anatomy. The later ones (reading, writing) carry all of it. Read a new deck against this list before building its app, and expect the next decks to follow it.

| Deck feature | What it looks like | Leo's app does |
|---|---|---|
| **Title slide word list** | "Words hiding in the lesson: …", one emoji per word, reused on every slide the word appears | The app's word tab uses **exactly these words, with the same emojis** |
| **Objectives + Lesson Map** | tap-to-open goal cards; a "route" of stops; a rail dot that moves with the story | Tab order follows the stops; the header comment lists slide → tab |
| **Word Desk / Word Lab** | one slide per word: a mini-game, then "🔒 Win the game to unlock the word card" (part of speech, definition, 3 examples, Dad 💬 / Leo 💬, 🇯🇵 Japanese bridge with a katakana / pronunciation trap); a check slide after each group | Flashcards carry the card's definition, example and Japanese bridge; **each word's mini-game is replayed** (find-N, sort, match, order); the check slide becomes a match or quiz |
| **Teacher flag** | "The Lesson Planner prints no … — these come from …" | Treat the deck's chosen words as the lesson's words: they go into Reference too (AGENTS.md rule 5a) |
| **LP beats labelled** | "LP Warm Up", "LP Present", "Be the Expert", "Think Aloud", "Teaching Tip" | One block per beat; LP answers are kept verbatim |
| **Games with answers in the markup** | `data-a`, `data-cat`, `data-ord`, `data-want`, "Found: 0 / 4", "Tap a card, then a box" | The same items, same answers: find → find block, box sort → sorter, tap-in-order → order block |
| **Dad 💬 / Leo 💬 frames** | sentence frames with ______ blanks | Typed items with the frame as `pre`/`post` (free answers where the deck accepts any) |
| **Source text verbatim** | the passage / model paragraph by paragraph with checks | Paragraph-gated reading, the deck's checks as the questions |
| **Soccer transfer (mandatory Extend)** | target words used on real players, stats dated ("checked … 21 Sept 2026") | A soccer block reusing the deck's claims and date — never new stats |
| **Recap before Wrap Up · Formative "Can Leo…?" · rubric** | Can-do cards, the 4–1 rubric | The final quiz tests the Can-do points; writing apps keep the rubric's criteria |
| **Finish slide** | homework (WB pages, Online Practice) and Mark Done | The WB pages named here are the app's WB content |

**More exercises, not fewer.** Several activities per tab is normal (the L5 U1 reading app has up to eight blocks in a tab); the deck's items come first, then more of the same shape.

## What stays consistent across all teacher slideshows

- Black-on-white shell
- Component tone left edge color
- Mark Done button placement and behavior
- Progress dots / progress bar pattern
- Keyboard arrows for next/previous

What varies per lesson: the slide content itself, custom interactive activities specific to that lesson, photo placements, embedded charts.
