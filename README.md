# LEEA

LEEA is Leo's Elite Education Academy.

The first subject is English. The platform should also be able to support math and other subjects later.

## Core Idea

```text
Subject
-> course source data
-> shared reference layer
-> reusable activity blocks
-> teacher view + Leo learner view
-> progress, homework, next assignment
```

## English Structure

```text
LEEA
- English
  - Our World
  - Joyful Work
  - Training Ground
  - Reference
    - vocabulary
    - academic words
    - glossary/support words
    - grammar
- Math
  - planned later
- Science
  - planned later
```

Our World has six levels. The first real build target is:

```text
Our World > Level 4 > Unit 8
```

## Main Rules

- Use the full name consistently: **Leo's Elite Education Academy**.
- Home is subject-level. Subjects are collapsible and the app remembers whether each subject is open or closed.
- Lessons are specific, but repeated pieces should become reusable activity blocks.
- Vocabulary cards, academic cards, glossary/support cards, and grammar charts are reusable reference objects.
- Main navigation stays English-only.
- Japanese appears only in learning content such as cards, charts, instructions, and feedback.
- The global Japanese ON/OFF toggle controls cards and charts. Do not add a second Japanese toggle inside a card.
- Reference is a real page Leo and Neritan can browse and search.
- A lesson goes live by registry/status data, not by hardcoding dashboard cards.
- Dashboard stat cards should read named variables first, then later calculated/Supabase data.
- Build slowly: scan source first, create reference data second, build lessons third.
- Run `npm run validate:content` after reference data changes.

## Reference

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

Reference also has:

```text
Vocabulary
Grammar
I Know
I Don't Know
Search
```

Clicking a vocabulary item opens its card. Clicking a grammar item opens its grammar chart/card.

Vocabulary cards need Previous, Next, and I Know controls. I Know is Leo-specific progress data.

## Views

```text
Neritan view = teach, assign, manage, track
Leo view = practice, complete, review
Reference = shared lookup and review library
```

Teacher lessons are for Neritan to teach. Learner apps are for Leo to do alone.

## Planned Stack

- Vercel for hosting.
- Supabase for progress, homework, settings, assignments, and saved learner work.
- Frontend stack is not locked yet.

## Current Status

This repo now has an initial Next/Vercel-ready app scaffold.

Implemented first:

- global LEEA shell
- Home dashboard
- collapsible English subject panel
- collapsible sidebar
- clickable breadcrumb buttons
- Reference source tree
- Reference tabs for Vocabulary, Grammar, I Know, and I Don't Know
- vocabulary card route with Previous, Next, I Know, global Japanese ON/OFF, and lesson-link states
- grammar chart/card route with Chart & Samples, Level Up, Quiz, and Master Quiz tabs
- Leo learner dashboard for assigned apps
- local Neritan assignment and review loop for Leo apps
- Our World Level 4 Unit 8 Opener learner app embedded from `public/learn/ow-l4-u8-opener.html`
- Our World Level 4 Unit 8 Vocabulary 1 and 2 data
- Our World Level 4 Unit 8 Grammar 1 and 2 data
- named starter dashboard variables
- Supabase client placeholder

Prototype:

```text
wireframes/main-reference-prototype.html
```

Current app routes:

```text
/
/reference
/leo
/lessons/[lessonId]
/teacher/review/[lessonId]
/reference/vocabulary/[wordId]
/reference/grammar/[grammarId]
```

## Validation

Run content validation after changing vocabulary, academic cards, glossary/content/related words, grammar reference data, or Sanseido search data:

```bash
npm run validate:content
```

The validator checks indexes, Japanese display fields, academic rich-card requirements, grammar Japanese support, and Sanseido search-only link shape.
