# AGENTS.md - How to Work in LEEA

This repo is **LEEA**, Leo's Elite Education Academy.

LEEA is for a father teaching his son. English is the first subject, but the architecture must allow future subjects such as math and science.

Use the full name consistently:

```text
LEEA = Leo's Elite Education Academy
```

Do not shorten the product heading to "Leo's Elite Academy".

## Golden Rules

1. **Do not rush into UI.** Read source material and design the data first.
2. **Source scan comes before lesson generation.** For each unit/topic, scan the lesson planner, book, or workbook before building.
3. **Reference first.** Vocabulary cards, academic cards, glossary/support cards, and grammar charts are reusable reference objects.
4. **Japanese ON/OFF is for learning content.** Main navigation stays English-only. Japanese belongs in cards, charts, instructions, and feedback when helpful.
5. **Lessons are assembled from blocks.** Do not hand-code repeated cards, quizzes, sorters, grammar charts, or save logic inside each lesson.
6. **Specific lessons are still allowed.** If an activity is truly one-off, it can be custom.
7. **Registry controls live status.** A lesson appears because registry data says it is live/assigned.
8. **Do, not reveal.** Leo should choose, build, sort, fix, type, speak, answer, or complete.
9. **Keep it maintainable by one parent plus AI.** Avoid architecture that becomes another job.

## Subject Structure

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

Our World has six levels. First build target:

```text
Our World > Level 4 > Unit 8
```

## Views

```text
Neritan view
- open teacher lessons
- preview Leo apps
- assign learner apps
- track Leo progress

Leo view
- see next assignment
- complete learner apps
- review completed work
- use Reference

Reference
- search and browse all English vocabulary and grammar
- open vocabulary cards and grammar charts
- show I Know / I Don't Know lists
```

Teacher lessons are only for teaching. Learner apps are for Leo's independent homework/practice.

## Main Layers

```text
1. Subject layer
2. Course layer
3. Reference layer
4. Activity block layer
5. Lesson layer
6. Registry/assignment layer
7. Progress layer
```

## Reference Rules

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
```

Reference also has pages/tabs:

```text
Vocabulary
Grammar
I Know
I Don't Know
Search
```

Clicking vocabulary opens the vocabulary card. Clicking grammar opens the grammar chart/card.

Vocabulary cards need:

- Previous
- Next
- position in current list, such as 3 / 14
- I Know
- related lesson button, disabled until the lesson is live
- one global Japanese ON/OFF control from the shell, not a second card-level Japanese button
- Japanese content hidden when Japanese is OFF and visible when Japanese is ON

## Navigation Rules

Navigation must stay consistent across every route.

- The left sidebar can collapse.
- Collapsed/open state can be local at first, then Supabase later.
- Breadcrumbs should be clickable minimalist buttons.
- Main/sidebar/breadcrumb labels stay English-only.

## Source Tags

Use exact source tags so duplicate words can appear once in search but retain every source.

```text
OW4-U8-V1        Our World Level 4 Unit 8 Vocabulary 1
OW4-U8-G1        Our World Level 4 Unit 8 Grammar 1
OW4-U8-OP        Our World Level 4 Unit 8 Opener
JF1-L1-U2-V1     Joyful Work Year 1 Lesson 1 Unit 2 Vocabulary 1
TG-PUNCT-COMMA   Training Ground punctuation comma lesson
```
