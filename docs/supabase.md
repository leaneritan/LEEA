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
