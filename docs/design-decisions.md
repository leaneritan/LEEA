# Design Decisions

This file tracks the decisions made before coding.

## Platform

LEEA is one platform with many subjects.

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

Home should also show useful overview numbers, such as:

- total vocabulary cards
- grammar points
- known words
- words to review
- live lessons
- assigned lessons

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
- Japanese fields when available
- source tags

Search results should not duplicate the same word card just because it appears in multiple sources.

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

Every reference object should support Japanese.

English is always present.

Japanese is optional in learning content:

```text
Japanese OFF = English only
Japanese ON = English + Japanese support
```

Main navigation labels stay English-only.

Japanese belongs in:

- vocabulary cards
- academic cards
- glossary/support cards
- grammar charts
- lesson instructions when helpful
- quiz feedback when helpful

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

## Lessons

Lessons are specific and should not be forced into one giant template.

Lessons should be assembled from reusable activity blocks where possible.

Examples:

- Unit Opener: photo discussion, caption writing
- Vocabulary: word cards, games, sorting, quizzes
- Grammar: chart, notice, build, fix, use
- Song: lyrics, listening, vocabulary, activity
- Reading: text, comprehension, graphic literacy
- Junior High: word order, grammar, translation, self-expression, test practice
- Training Ground: focused skill drills for weak points

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
