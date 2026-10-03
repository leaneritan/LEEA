-- School tests (定期テスト・実力テスト): Leo's review cards and the settings
-- for the next test. Append to supabase/schema.sql.
--
-- No set_updated_at trigger on these two tables on purpose: the app merges
-- local and cloud copies newest-wins on updated_at, which it sets itself.

create table if not exists public.school_review_cards (
  -- `${testId}:${subject}:${questionNo}`, e.g. "2026-jitsuryoku-1:math:1(9)"
  id text primary key,
  student_id text not null references public.students(id) on delete cascade,
  test_id text not null,
  subject text not null check (subject in ('japanese', 'social', 'math', 'science', 'english')),
  question_no text not null,
  status text not null default 'todo' check (status in ('todo', 'practiced', 'mastered')),
  reason text check (reason in ('careless', 'unknown', 'misread', 'time', 'blank')),
  note text not null default '',
  practice_count integer not null default 0,
  practiced_at timestamptz,
  mastered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists school_review_cards_student_test_idx
  on public.school_review_cards (student_id, test_id);

create table if not exists public.school_test_settings (
  id text primary key,
  student_id text not null references public.students(id) on delete cascade,
  -- { name, date (YYYY-MM-DD or ""), cardsPerDay }
  next_test jsonb not null default '{}'::jsonb,
  -- { total5, rank, students, subjects: { japanese, social, math, science, english } }
  goals jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.school_review_cards to anon;
grant select, insert, update, delete on public.school_test_settings to anon;

alter table public.school_review_cards enable row level security;
alter table public.school_test_settings enable row level security;

drop policy if exists "family can read school review cards" on public.school_review_cards;
create policy "family can read school review cards"
on public.school_review_cards for select
using (student_id = 'leo');

drop policy if exists "family can write school review cards" on public.school_review_cards;
create policy "family can write school review cards"
on public.school_review_cards for all
using (student_id = 'leo')
with check (student_id = 'leo');

drop policy if exists "family can read school test settings" on public.school_test_settings;
create policy "family can read school test settings"
on public.school_test_settings for select
using (student_id = 'leo');

drop policy if exists "family can write school test settings" on public.school_test_settings;
create policy "family can write school test settings"
on public.school_test_settings for all
using (student_id = 'leo')
with check (student_id = 'leo');
