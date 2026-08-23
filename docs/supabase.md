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
- Math block progress (`math_block_progress`)
- Geography map progress, including per-item weak-spot history (`geography_map_progress`)

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

| table | holds |
| --- | --- |
| `students` | the family's fixed student rows |
| `assignments` | Neritan → Leo assignments |
| `learner_progress` | Leo's own app completion |
| `teacher_lesson_progress` | Neritan's manual Mark Done checklist |
| `reference_confidence` | Reference I Know / I Don't Know |
| `math_block_progress` | Math 節 block completion |
| `geography_map_progress` | Geography map status, quiz score, and per-item weak-spot history |

It also inserts the first student row:

```text
id = leo
display_name = Leo
```

**Keep this list in step with `supabase/schema.sql`.** A table that exists in the file but not in the project fails silently — see below.

## Re-running the schema does not migrate anything

`supabase/schema.sql` is written with `create table if not exists`. That makes it safe to re-run, but it also means:

- a table added to the file **after** the schema was last applied **is** created on the next run
- a **column** added to a table that already exists is **not** — `if not exists` skips the whole statement, so the table keeps its old shape forever

So re-running the file is not a migration. Changing an existing table needs an explicit `alter table`, applied on its own.

### What went wrong once

The schema was applied when it had only the five English tables. `math_block_progress` and `geography_map_progress` were added to the file later, in the PRs that built those subjects, and nobody re-ran it. For months the app happily wrote Math and Geography progress, every write failed, and each one fell back to localStorage exactly as designed — so nothing errored, nothing looked broken, and all of that progress lived on whichever browser Leo happened to use.

It surfaced only when someone thought to compare the file against the live project:

```sql
select
  to_regclass('public.math_block_progress')::text as math_table,
  to_regclass('public.geography_map_progress')::text as geography_table;
```

Both came back `null`.

**The "Not synced" badge does not distinguish these cases.** `CloudSyncBadge` shows the same thing whether Supabase is unconfigured or a single table is missing, so it cannot tell you that four out of six tables are syncing fine.

**Whenever you add a table or column to `supabase/schema.sql`, apply it to the live project in the same change, and verify it landed.** Checking is quick:

```sql
-- every table the app expects, and whether it is really there
select c.relname, c.relrowsecurity as rls,
       (select count(*) from pg_policy p where p.polrelid = c.oid) as policies
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relname;
```

If the Supabase MCP server is connected, `apply_migration` handles the DDL and `execute_sql` handles the verification. A round trip wrapped in `begin; … rollback;` proves the app's exact row shape inserts and reads back without leaving test data behind.

## Applied migrations

`supabase/schema.sql` is the shape the app expects; this is the log of changes applied to the live project *after* the initial run, because `create table if not exists` will not apply them for you.

| Migration | What it changed |
| --- | --- |
| (missing tables) | Created `math_block_progress` and `geography_map_progress`, which had been in the file but never applied — see below. |
| (geography items) | Added `items jsonb` to `geography_map_progress` for per-item weak-spot history. |
| `add_reference_confidence_practice_history` | Added `asked`, `correct`, `last_correct`, `last_practiced_at` to `reference_confidence` for the vocabulary practice drill. |

`list_migrations` on the live project is the authoritative list; add a row here whenever you apply one.

The last one is the `alter table` the section above warns about: `reference_confidence` already existed, so re-running the schema file would have skipped the new columns silently and every practice write would have failed on an unknown column.

```sql
-- confirm the practice columns are really there
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'reference_confidence'
order by ordinal_position;
```

## Rollout order

1. Add schema and docs.
2. Keep localStorage as fallback.
3. Wire assignments first.
4. Wire learner progress second.
5. Wire teacher lesson progress.
6. Wire reference confidence.
7. Wire math block progress.
8. Wire geography map progress.
9. Add auth later, after the family flow works across devices.

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
