-- LEEA Supabase foundation
-- Live user state only. Curriculum source content stays in Git.
--
-- Initial fixed IDs:
--   teacher_id = 'neritan'
--   student_id = 'leo'

create table if not exists public.students (
  id text primary key,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id text primary key,
  lesson_id text not null,
  teacher_id text not null default 'neritan',
  student_id text not null references public.students(id) on delete cascade,
  status text not null check (status in ('assigned', 'completed', 'reviewed', 'needs-redo')),
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, student_id)
);

create table if not exists public.learner_progress (
  id text primary key,
  homework_id text not null,
  lesson_id text,
  student_id text not null references public.students(id) on delete cascade,
  storage_prefix text,
  module_count integer not null default 0,
  completed_modules integer not null default 0,
  modules jsonb not null default '[]'::jsonb,
  score_percent integer,
  score jsonb,
  caption text,
  done boolean not null default false,
  raw_progress jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (homework_id, student_id)
);

create table if not exists public.teacher_lesson_progress (
  id text primary key,
  lesson_id text not null,
  teacher_id text not null default 'neritan',
  student_id text not null references public.students(id) on delete cascade,
  status text not null check (status in ('not-started', 'done')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, teacher_id, student_id)
);

create table if not exists public.math_block_progress (
  id text primary key,
  student_id text not null references public.students(id) on delete cascade,
  section_id text not null,
  block_id text not null,
  status text not null check (status in ('not-done', 'done')),
  quiz_score jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, section_id, block_id)
);

create table if not exists public.reference_confidence (
  id text primary key,
  student_id text not null references public.students(id) on delete cascade,
  word_id text not null,
  knows boolean not null default false,
  confidence text not null check (confidence in ('new', 'learning', 'known', 'needs-review')),
  source_context text,
  marked_known_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, word_id)
);

insert into public.students (id, display_name)
values ('leo', 'Leo')
on conflict (id) do update
set display_name = excluded.display_name,
    updated_at = now();

create index if not exists assignments_student_status_idx
  on public.assignments (student_id, status, updated_at desc);

create index if not exists learner_progress_student_done_idx
  on public.learner_progress (student_id, done, updated_at desc);

create index if not exists teacher_lesson_progress_student_status_idx
  on public.teacher_lesson_progress (student_id, status, updated_at desc);

create index if not exists reference_confidence_student_confidence_idx
  on public.reference_confidence (student_id, confidence, updated_at desc);

create index if not exists math_block_progress_student_status_idx
  on public.math_block_progress (student_id, status, updated_at desc);

-- Expose only the app state tables to the browser anon role.
-- Row Level Security policies below still decide which rows the browser can read/write.
grant usage on schema public to anon;
grant select on public.students to anon;
grant select, insert, update, delete on public.assignments to anon;
grant select, insert, update, delete on public.learner_progress to anon;
grant select, insert, update, delete on public.teacher_lesson_progress to anon;
grant select, insert, update, delete on public.reference_confidence to anon;
grant select, insert, update, delete on public.math_block_progress to anon;

-- Keep updated_at fresh on row changes.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_students_updated_at on public.students;
create trigger set_students_updated_at
before update on public.students
for each row execute function public.set_updated_at();

drop trigger if exists set_assignments_updated_at on public.assignments;
create trigger set_assignments_updated_at
before update on public.assignments
for each row execute function public.set_updated_at();

drop trigger if exists set_learner_progress_updated_at on public.learner_progress;
create trigger set_learner_progress_updated_at
before update on public.learner_progress
for each row execute function public.set_updated_at();

drop trigger if exists set_teacher_lesson_progress_updated_at on public.teacher_lesson_progress;
create trigger set_teacher_lesson_progress_updated_at
before update on public.teacher_lesson_progress
for each row execute function public.set_updated_at();

drop trigger if exists set_reference_confidence_updated_at on public.reference_confidence;
create trigger set_reference_confidence_updated_at
before update on public.reference_confidence
for each row execute function public.set_updated_at();

drop trigger if exists set_math_block_progress_updated_at on public.math_block_progress;
create trigger set_math_block_progress_updated_at
before update on public.math_block_progress
for each row execute function public.set_updated_at();

-- Row Level Security is enabled from the start.
-- The first app wiring uses the public anon key with fixed family IDs.
-- Tighten these policies when auth is added.
alter table public.students enable row level security;
alter table public.assignments enable row level security;
alter table public.learner_progress enable row level security;
alter table public.teacher_lesson_progress enable row level security;
alter table public.reference_confidence enable row level security;
alter table public.math_block_progress enable row level security;

drop policy if exists "family can read students" on public.students;
create policy "family can read students"
on public.students for select
using (true);

drop policy if exists "family can read assignments" on public.assignments;
create policy "family can read assignments"
on public.assignments for select
using (student_id = 'leo');

drop policy if exists "family can write assignments" on public.assignments;
create policy "family can write assignments"
on public.assignments for all
using (student_id = 'leo')
with check (student_id = 'leo' and teacher_id = 'neritan');

drop policy if exists "family can read learner progress" on public.learner_progress;
create policy "family can read learner progress"
on public.learner_progress for select
using (student_id = 'leo');

drop policy if exists "family can write learner progress" on public.learner_progress;
create policy "family can write learner progress"
on public.learner_progress for all
using (student_id = 'leo')
with check (student_id = 'leo');

drop policy if exists "family can read teacher lesson progress" on public.teacher_lesson_progress;
create policy "family can read teacher lesson progress"
on public.teacher_lesson_progress for select
using (student_id = 'leo' and teacher_id = 'neritan');

drop policy if exists "family can write teacher lesson progress" on public.teacher_lesson_progress;
create policy "family can write teacher lesson progress"
on public.teacher_lesson_progress for all
using (student_id = 'leo' and teacher_id = 'neritan')
with check (student_id = 'leo' and teacher_id = 'neritan');

drop policy if exists "family can read reference confidence" on public.reference_confidence;
create policy "family can read reference confidence"
on public.reference_confidence for select
using (student_id = 'leo');

drop policy if exists "family can write reference confidence" on public.reference_confidence;
create policy "family can write reference confidence"
on public.reference_confidence for all
using (student_id = 'leo')
with check (student_id = 'leo');

drop policy if exists "family can read math block progress" on public.math_block_progress;
create policy "family can read math block progress"
on public.math_block_progress for select
using (student_id = 'leo');

drop policy if exists "family can write math block progress" on public.math_block_progress;
create policy "family can write math block progress"
on public.math_block_progress for all
using (student_id = 'leo')
with check (student_id = 'leo');
