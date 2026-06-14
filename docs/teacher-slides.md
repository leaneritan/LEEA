# Teacher Slides — Slideshow Conventions

Teacher lessons are slide decks for Neritan to teach Leo directly. They are **custom-crafted per lesson** — the design follows the source material's flow, not a generic template.

Leo learner apps are templated by component (see `docs/components.md`). Teacher slides are not.

## Naming and pairing

- File path: `public/lessons/<lesson-id>.html`
- Lesson ID: `ow-l<level>-u<unit>-<component>` e.g. `ow-l4-u8-opener`
- Teacher `<component>` must have a paired learner `<component>-app` in the same level/unit — the validator enforces this and the Neritan Teacher Menu surfaces app controls on the teacher card via this pairing

## Why custom, not templated

Each lesson plan in the NatGeo planner has its own teaching flow: opener has a photo discussion and caption activity; vocab-1 has a graphic organizer (sunshine, two-column chart, etc.); song has lyrics and listen-and-sing; grammar has the rule box, Notice / Build / Fix / Use activities; reading has a passage and comprehension; writing has a model and planning chart.

Forcing all of these into one slide template flattens what makes each lesson teachable. The slideshow shell is shared (CSS, navigation, "Mark Done" wiring), but the slides themselves match the source flow.

## Shared shell

Every teacher slideshow uses the same outer structure:

- Same fonts (Syne for display, DM Sans for body)
- Same navigation pattern (previous / next / progress)
- Same Mark Done button that writes to `leea.lessonProgress.v1` via `lessonProgress.ts`
- Same component tone left edge from `getComponentMeta()`

Look at `public/lessons/ow-l4-u8-opener.html` for the current shell. New teacher slideshows copy that shell and replace the inner slide content.

## What each component's slides should cover

Use the NatGeo planner activity sections as the slide flow:

### opener
- Theme reveal (right column photo + caption)
- Discussion prompts (from teacher notes)
- Caption writing activity
- Unit goals (4 bullets from the In This Unit I Will box)

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
- When a Grammar Box is source-verbatim from a book/audio track, show the source on the slide (for example, `Student Book p. 136 / TR 8.4`) so Neritan can trace the teaching point back to the lesson planner/supporting files.
- If the grammar lesson uses a word web, the slide should make the sentence-building move explicit: center oval = person/noun being described, outer ovals = details, final sentence = `person + who + verb phrase`. The who-clause must describe the person directly.

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
