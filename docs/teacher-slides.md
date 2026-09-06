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

Everything else — registering the lesson so it appears on the teacher dashboard, pairing it with a learner app, adding any new vocabulary word the deck introduces to the content model — happens after handoff, not before it.

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

## What stays consistent across all teacher slideshows

- Black-on-white shell
- Component tone left edge color
- Mark Done button placement and behavior
- Progress dots / progress bar pattern
- Keyboard arrows for next/previous

What varies per lesson: the slide content itself, custom interactive activities specific to that lesson, photo placements, embedded charts.
