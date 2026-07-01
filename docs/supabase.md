# Supabase foundation

LEEA uses Git for curriculum source and Supabase for shared live state.

## What stays in Git

- Vocabulary and grammar JSON
- Lesson registry JSON
- Teacher lesson HTML
- Leo learner app HTML
- Planner PDFs and source material
- Reference indexes

## What goes to Supabase

- Assignments from Neritan to Leo
- Leo learner app progress
- Quiz scores, module completion, captions, and done state
- Neritan teacher lesson `Mark Done` state
- Reference `I know it` / `Review later` confidence

## Environment variables

Add these to `.env.local` when Supabase is ready:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

If these are missing, the app must keep using localStorage.

## Initial fixed IDs

Until auth is added, the app uses stable family IDs:

```text
teacher_id = neritan
student_id = leo
```

## Setup

Run the SQL in:

```text
supabase/schema.sql
```

The schema creates:

- `students`
- `assignments`
- `learner_progress`
- `teacher_lesson_progress`
- `reference_confidence`

It also inserts the first student row:

```text
id = leo
display_name = Leo
```

## Rollout order

1. Add schema and docs.
2. Keep localStorage as fallback.
3. Wire assignments first.
4. Wire learner progress second.
5. Wire teacher lesson progress.
6. Wire reference confidence.
7. Add auth later, after the family flow works across devices.

## `learner_progress` and `teacher_lesson_progress` are two different tables — never assume one implies the other

This bit a real user: Leo finished a learner app, `learner_progress` correctly showed `done: true`, but the parent's dashboard (backed by `teacher_lesson_progress`) still showed the lesson as incomplete. Nothing errored — the two tables had simply always been independent, and finishing the learner app never told the teacher checklist about it. It looked like a sync failure; it was actually a missing link between two tracking systems that nobody had connected.

**This is now fixed at the framework level** — `upsertLearnerProgressSummary()` in `src/data/learnerProgress.ts` auto-upserts the matching `teacher_lesson_progress` row as `done` whenever a learner app reports `done`. It finds the teacher lesson by matching `course` + `level` + `unit` + `component` (with the learner's `-app` suffix stripped). **This means any new learner app you build gets this propagation for free, with zero extra code** — as long as:

- The learner lesson's `component` field ends in `-app` (e.g. `"vocab-1-app"`)
- A teacher lesson exists in the same unit with the matching base `component` (e.g. `"vocab-1"`)
- The learner lesson has a real `source.homeworkId` (sync is skipped entirely without one — see the vocab-unit-scanner / app-building skills' registration steps)

**When you build or register a new learner + teacher lesson pair, verify the link actually works — don't just trust that it will:**

1. Complete the learner app's modules yourself (or via a script) until `getLearnerAppProgress(source).done` would be `true`
2. Check `teacher_lesson_progress` in Supabase (Table Editor, or `execute_sql` if the MCP server is connected) for a row with that lesson's teacher `id` and `status: "done"`
3. If it's missing, the most common cause is a `component` mismatch between the teacher and learner JSON (e.g. teacher uses `"vocab-1"` but learner uses `"vocab1-app"` — must match exactly once `-app` is stripped)

**General principle for any future feature that tracks "done" in more than one place:** if two tables/flags represent the same real-world fact (a lesson being finished, an assignment being reviewed, etc.), decide which one is the source of truth and write code that propagates to the other automatically. Never leave two "done" indicators that can only be kept in sync by a human remembering to click something — that's exactly how this bug happened, and it's invisible until someone notices a discrepancy by eye.
