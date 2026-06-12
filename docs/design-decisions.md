# Design Decisions

This file tracks the decisions made before coding.

## Platform

LEEA is one platform with many subjects.

LEEA means:

```text
Leo's Elite Education Academy
```

Use this full name in the main heading and brand copy. Do not use "Leo's Elite Academy" as a separate product name.

English is the first subject. Math and science should be possible later.

```text
LEEA
- English
  - Our World
  - Joyful Work
  - Training Ground
  - Reference
- Math
  - planned later
- Science
  - planned later
```

Inside English, courses/modules stay separate. The English reference system connects them.

Our World has six levels. The first real build target is:

```text
Our World > Level 4 > Unit 8
```

## Home

Home is subject-level.

Subjects appear as collapsible panels.

```text
Home
- English
  - Our World
  - Joyful Work
  - Training Ground
  - Reference
- Math
- Science
```

When a subject is collapsed, only the subject card/header is visible.

When a subject is expanded, its courses/modules are visible.

The app should remember each user's collapsed/expanded preference. First version can store this locally; later Supabase can store it per user.

Dashboard and sidebar numbers must be real data, never hardcoded placeholders. The sidebar "Leo's Progress" count reads open assignments (status `assigned` or `needs-redo`) from the shared `readAssignments`/`getOpenAssignmentCount` helpers in `src/data/assignments.ts`. All components read assignment state through those helpers — do not re-implement localStorage reads per component.

Home should also show useful overview numbers, such as:

- total vocabulary cards
- grammar points
- known words
- words to review
- live lessons
- assigned lessons

The first dashboard stat values are named variables:

```text
totalWords = 312
grammarPoints = 24
knownWords = 186
wordsToReview = 42
```

Later these should be calculated from reference data and Leo's progress records.

## Views

There are two role views plus shared Reference.

Neritan view:

- open teacher lessons
- preview Leo apps
- assign learner apps
- track Leo progress

Leo view:

- see next assignment
- complete learner apps
- review completed work
- use Reference

Reference:

- browse and search all English vocabulary and grammar
- open vocabulary cards and grammar charts
- show I Know and I Don't Know lists

Teacher lessons are only for teaching. Learner apps are for Leo's independent homework/practice.

## Visual Direction

The preferred direction is:

- strong LEEA academy identity
- black/yellow top identity can work well
- warm paper/card style for Reference
- clear mode cards for Neritan, Leo, and Reference
- Our World can use a National Geographic-inspired identity
- Joyful Work can use a clean junior-high workbook identity
- Training Ground can use a Manchester City-inspired training identity

Main navigation must stay consistent across every page.

The sidebar may collapse, and the collapsed/open state should persist. First version can store this locally; later Supabase can store it per user.

Breadcrumbs should be clickable minimalist buttons:

```text
Home / English / Reference / current item
```

Breadcrumb labels stay English-only.

## Reference Objects

These are reusable:

- vocabulary cards
- academic vocabulary cards
- glossary/support word cards
- grammar charts

They are not just lesson screens.

## English Reference Page

English needs a separate Reference page.

The Reference page is both:

- a browsable learning file
- a searchable dictionary/grammar library

Reference opens in source-tree mode by default:

```text
Reference
- Our World
  - Level 1
  - Level 2
  - Level 3
  - Level 4
  - Level 5
  - Level 6
- Joyful Work
  - Year 1
  - Year 2
  - Year 3
- Training Ground
  - Punctuation
  - Nouns
  - Articles
  - Word Order
```

The user should not have to open every top-level course manually.

Reference also has clear sections/pages:

```text
Vocabulary
Grammar
I Know
I Don't Know
Search
```

Vocabulary page:

- shows all word-like reference cards
- includes normal vocabulary, academic words, content words, related words, and glossary/support words
- can be filtered by type and source
- clicking a word opens the vocabulary/academic/glossary card

Grammar page:

- shows a list of all grammar points
- grammar points behave like cards
- clicking a grammar point opens its grammar chart/card
- can be filtered by course, level/year, unit, and lesson

I Know page:

- shows words Leo marked as known/confident
- cards still open the full reference card

I Don't Know page:

- shows words Leo has not marked as known yet
- also includes words marked as learning or needs-review when those states exist
- cards still open the full reference card

Search should work across:

- vocabulary
- academic words
- content words
- related words
- glossary/support words
- grammar points
- Japanese fields
- source tags
- Junior High Sanseido search-only dictionary links

Search results should not duplicate the same word card just because it appears in multiple sources. They should show type/source tags such as Vocabulary, Academic, Grammar, Junior High, Sanseido, and source tags like `OW4-U8-G1`.

Sanseido junior-high entries live in `content/subjects/english/junior-high/sanseido-index.json` and are search-only. Clicking one opens its `u` link. Do not create LEEA cards for all Sanseido entries.

## Reference Click Behavior

- clicking a vocabulary item opens its vocabulary card
- clicking an academic word opens its detailed academic card
- clicking a glossary/support word opens its support card
- clicking a grammar item opens its grammar chart/card

Reference navigation opens the reusable reference object, not a copy inside one lesson.

Reference cards can link back to lesson ids. The button is disabled until the related lesson is live.

## Vocabulary Card Behavior

Vocabulary cards need:

- Previous button
- Next button
- current position, such as 3 / 14
- I Know check action
- related lesson button

Previous/Next should move through the current list Leo opened from.

Examples of current lists:

- search results
- Our World Level 4 Unit 8 Vocab 1
- all academic words
- all glossary words
- unknown words

I Know is Leo-specific progress data, not global word data.

Possible confidence states:

```text
new
learning
known
needs-review
```

First version can use known/not-known.

## Japanese Support

Every reference object should support Japanese, and cards should not ship with blank Japanese display fields.

English is always present.

Japanese visibility is optional in learning content:

```text
Japanese OFF = English only
Japanese ON = English + Japanese support
```

Main navigation labels stay English-only.

The shell has one global Japanese ON/OFF toggle. Cards and charts read that global setting. Do not add separate Japanese show/hide buttons inside individual cards unless there is a specific lesson activity reason.

Japanese belongs in:

- vocabulary cards
- academic cards
- glossary/support cards
- grammar charts
- lesson instructions when helpful
- quiz feedback when helpful

If Japanese has not been parent-confirmed yet, add a careful draft and mark it as review-needed, for example `needsReview: true` or `jp_tags: ["needs-review"]`. Codex may draft Japanese, but parent review decides what is final.

Japanese should not appear by default in:

- main menu
- global sidebar labels
- bottom navigation labels
- dashboard headings
- course cards, unless the official course name is Japanese

## Vocabulary

Use one searchable English vocabulary memory across the English subject.

Duplicate words should appear once in search, with multiple source tags.

Each word can have:

- one global identity
- display/card data
- Japanese data
- source references
- lesson/source tags
- optional practice blocks

## Academic Vocabulary

Academic words need deeper cards than normal vocabulary.

Academic card fields should include:

- short meaning
- detailed explanation
- why it matters
- how to use it
- examples
- non-examples
- mini quiz
- Japanese support

## Glossary / Support Words

Glossary words are words Leo meets that are not official target vocabulary.

They should still be tracked.

They can be lighter than target vocabulary and used for:

- tooltips
- quick cards
- optional review
- search

## Grammar

Grammar should be separate from vocabulary.

Grammar charts are reference objects.

Grammar charts should be generated before grammar lessons.

For grammar lessons, the chart appears at the top of every tab.

Grammar 1 and Grammar 2 should appear as grammar-point cards in Reference, not only inside lessons.

Grammar reference cards use this four-tab model:

```text
Chart & Samples
Level Up
Quiz
Master Quiz
```

Chart & Samples shows the rule table and 6-10 source-backed sample sentences. Level Up teaches deeper rules, transforms, and mixed samples. Quiz is multiple choice and follows the global Japanese ON/OFF. Master Quiz supports multiple choice and build-order questions; Japanese appears automatically after each answer.

Our World Level 4 Unit 8 grammar source:

```text
OW4-U8-G1 - Describing people with who
OW4-U8-G2 - Direct and indirect objects
```

## Lessons

Lessons are specific and should not be forced into one giant template.

Neritan's teacher lessons live under the Teacher Menu. They are for teaching Leo directly, so the best experience can be a custom deck/page for that lesson. The lesson browser is generic, but each lesson surface can be specific.

Reusable activity blocks should be created when patterns repeat across lessons or Leo apps. Do not create a block system first and then force every lesson into it.

Examples:

- Unit Opener: photo discussion, caption writing
- Vocabulary: word cards, games, sorting, quizzes
- Grammar: chart, notice, build, fix, use
- Song: karaoke word-tap, song-word carousel (chorus/verse/rhyme), academic-word carousel, vocab-game carousel, use-it-again swap, write-a-line, quiz
- Reading: text, comprehension, graphic literacy
- Junior High: word order, grammar, translation, self-expression, test practice
- Training Ground: focused skill drills for weak points

### Unit 8 current build status

| Component | Teacher lesson | Leo app | Leo status |
|---|---|---|---|
| opener | `public/lessons/ow-l4-u8-opener.html` | `public/learn/ow-l4-u8-opener.html` | `assigned` (auto-seeds) |
| vocab-1 | `public/lessons/ow-l4-u8-vocab-1.html` | `public/learn/ow-l4-u8-vocab-1.html` | `live` |
| song | `public/lessons/ow-l4-u8-song.html` | `public/learn/ow-l4-u8-song.html` | `live` |

Still to build: grammar-1 (OW4-U8-G1), grammar-2 (OW4-U8-G2), reading, writing.

Current teacher tracking:

- Teacher Menu shows only teacher slide cards, grouped by course, level, and unit — Leo's app cards never appear as separate boxes on the Neritan page.
- Level/unit groups are collapsible because more levels and units will be added.
- Each teacher card carries all controls in one place: Open (slides) and Mark Done are the teaching controls; Assign/Assigned, Review, and Unassign live inside a tinted "Leo's App" group box so app controls are visually separate from teaching controls.
- A teacher lesson finds its learner counterpart by component name: teacher `opener` pairs with learner `opener-app` in the same level/unit. Cards with a counterpart show a "Leo's App" label plus inline progress pills (modules done, quiz score).
- Button hierarchy: Open is the primary black button; Mark Done is a standard outline button; app-group buttons are compact; Unassign is a quiet underlined ghost button because it is a rare corrective action.
- Typography rule: at most one uppercase label per card region. The component label (card top) and the "Leo's App" group label stay uppercase; meta text, progress pills, and group-header counts use sentence case. Do not add new uppercase/letter-spaced styles without removing one.

Leo's view design rules (different from Neritan):

- Leo's page must feel like Leo's, not like a smaller copy of the teacher dashboard. Warm tinted surfaces, bigger numbers, fewer words.
- Top of `/leo` is a `LeoHomeworkHero` card with three states: one assignment (giant title + Start/Keep Going button), multiple assignments (same card + "and X more" link to the rest), and caught-up (celebratory empty state with reference link).
- The grouped browser below the hero is Leo's **full library**: it lists every learner app, not only the currently assigned ones. The hero handles "what to do now"; the list handles "everything you can revisit." Apps that are not currently assigned render with the `leo-app-card-available` modifier (softer cream background, hair-thin left edge, no shadow on the Open App button) so they do not compete with active homework. Done apps get a `leo-app-card-done` quiet green accent. Status text is honest: "Not assigned" when there is no assignment record, not a misleading "Assigned".
- The hero greets ("Hi Leo 👋"), names the component with an emoji chip, shows a single progress meter, and offers one big action. No secondary buttons compete with Start.
- The hero is **color-coded by lesson component** so Leo can spot what kind of work today is before reading: opener gold, vocab green, grammar blue, reading amber, writing plum, song coral/pink, review green. The caught-up state uses its own celebratory green.
- Color is applied via a single `--hero-accent` CSS variable that drives the colored left edge (10 px), a soft radial gradient in the background, the greeting, the progress meter bar and percent number, and the "and X more" link. Background tones stay pale so the white-on-black Start button still reads as the loudest element.
- Home's "next-up" aside (`.next-card`) carries the **same per-component tone** so the path from Home to Leo's view feels unbroken. The next-card stays dark (Home is the parent's overview, not Leo's playspace), but the colored left edge, top-label color, and primary-button color all match the lesson's tone via `--next-accent` and `--next-accent-deep`. Any future surface that names a lesson should reuse `getComponentMeta` from `src/components/componentMeta.ts` — do not duplicate the emoji/label/tone map.
- The Start button stays pill-shaped black with a soft shadow on every tone (one consistent CTA across the whole app).
- Progress meter uses a single accent gradient bar — not the muted Neritan style.
- Leo's page should never show "no homework" as a sad empty state. It is always either active (hero + groups) or a positive caught-up moment.
- Adding a new component type requires three CSS blocks in `globals.css` and one entry in `src/components/componentMeta.ts`:
  1. `.leo-hero-card-{tone}` — sets `--hero-accent`, `--hero-accent-soft`, `--hero-edge`, `--hero-bg-1`, `--hero-bg-2` for the Leo homework hero
  2. `.next-card-{tone}` — sets `--next-accent`, `--next-accent-ink`, `--next-accent-deep` for Home's next-up card
  3. `.leo-app-card-{tone}` — sets `--leo-component`, `--leo-component-soft`, `--leo-component-ink` for Leo's grouped app card list
  Do not introduce per-tone overrides anywhere else — the variable cascade handles everything.
- The component label on each card is colored by its component accent (opener gold-deep, vocab green, grammar blue, reading amber, writing plum, mission green) so cards are scannable; the same accent colors the card's left edge. There is no Teacher/Leo badge on this page because every card is a teacher card.
- Teacher lessons are marked `Done` by Neritan after teaching. Learner apps are marked Assigned and then Reviewed after Leo completes them.
- First storage is local, but all record shapes map to Supabase later.

Navigation decision:

- Home is the all-subject launcher and should stay high level.
- English contains the detailed English course/level/unit browser.
- Neritan contains teacher lesson tracking and teaching controls.

## Chart Templates

National Geographic graphic organizers should become reusable chart/activity templates.

Examples:

- matrix
- flow chart
- interview
- KWL chart
- note-taking chart
- pie chart
- spider map
- storyboard
- sunshine organizer
- T-chart
- three-column chart
- timeline
- tree
- two-column chart
- Venn diagram
- vocabulary log
- word web

These templates should be active where possible: type, drag, sort, add rows, reorder, save, and review.

Digital organizers should support editable structure when useful.

Examples:

- add/delete word web nodes
- add/delete spider map branches
- add/delete Venn items
- add/delete chart rows or columns
- add/delete flow/timeline steps
- add/delete tree branches

Some lesson tasks may use fixed templates, but the reusable block system should support editable variants.

Details live in:

```text
docs/chart-templates.md
```

## Learner App Quiz and Module Save Rules

Every interactive module or quiz in a Leo learner HTML app must follow these rules. Violations cause the student to lose their result on page reload and the teacher card to show the wrong progress count.

**Rule 1 — Save the done-key automatically when a module finishes.**
The completion function must write the module's done-key. Do not wait for the student to click "Mark complete" — the key must be saved at finish time so `getLearnerAppProgress` counts it in `completedModules`.

**Rule 2 — Save quiz score to localStorage when the quiz ends.**
Call `saveScore(score, total, true, { ...extras })` inside the quiz finish function. The extras (trophy, text, sub, wrongQuestions) let the restore path regenerate the result view without re-running the quiz.

**Rule 3 — Restore result view on reopen, never restart.**
When a modal opens or tab switches to a module that has saved state, show the result view (via a dedicated `restoreXResult()` function). Only call `initX()` when there is no saved state or the user explicitly tapped ↺ Redo.

**Rule 4 — ↺ Redo clears saved state before re-initializing.**
Remove the saved score and done-key before calling `initX()` so the restore check does not immediately show the old result. The doRedo / resetModule path is the only entry point to `initX()`.

These rules were added after finding the same bug independently in the opener (m7), song (m6), and vocab (tab 11) apps.

## Registry

The dashboard should read a registry.

To make a lesson visible, change status in registry data.

Do not hardcode dashboard lesson cards.

## Training Ground

Training Ground is part of English, but it is not book-based.

It is for Leo's specific difficulties.

Examples:

- punctuation
- nouns
- articles
- capitalization
- word order
- spelling
- sentence building
- writing correction

Training Ground can reuse English reference data and can also add new reference items when Leo learns them there.
