# Handoff: new school-test dashboard (Progress page)

For Claude Code, working in the LEEA repo. This folder arrives on the branch
`handoff/school-tests-dashboard` (main + this folder only). Work on that branch.

This replaces the Progress page (`/teacher/progress`) with a new dashboard for Leo's
school tests, and adds a Leo-facing page at `/leo/tests-review`. All the files are in
this folder, at the same paths they go to in the repo.

## 1. Copy these files into the repo

| File in this folder | What it is |
|---|---|
| `content/school-tests/tests.json` | **New.** All test data: 3 tests, every score, average, rank, 男女別 rank, and all 192 questions of 第1回実力 with 正誤, 全体正答率, 配点 and 領域. Master copy is Neritan's `Leo's_Tests/tests.json`. |
| `src/data/schoolTests/types.ts` | **New.** Types. |
| `src/data/schoolTests/analytics.ts` | **New.** Every number on the page is computed here (pure functions, no React). |
| `src/data/schoolTests/studyLinks.ts` | **New.** Maps a missed question to the textbook section and LEEA route that teaches it. |
| `src/data/schoolTests/reviewStore.ts` | **New.** Review cards and next-test settings: local-first, synced to Supabase (`school_review_cards`, `school_test_settings`). |
| `src/components/AcademicProgressPage.tsx` | **Replaces** the old 1,800-line file completely. Same export name, so `src/app/teacher/progress/page.tsx` does not change. |
| `src/components/schoolTests/*.tsx`, `*.ts` | **New.** One file per tab, plus charts, shared bits and styles (all CSS is scoped under `.stx`). |
| `src/app/leo/tests-review/page.tsx` | **New.** Leo's own entry, same component opened in Leo mode. |
| `supabase/school_tests.sql` | **New SQL.** Append its contents to the end of `supabase/schema.sql`. |

Do **not** copy `src/components/AppShell.tsx` from this folder if it is here: it is a typecheck stub. Use the real one.

## 2. Edit one existing file

`src/lib/syncStatus.ts`: add the new sync source. Two small additions only:

```ts
export type CloudSyncSource =
  | ...
  | "test-attempts"
  | "school-tests";          // add

export const cloudSyncSourceLabels = {
  ...
  "test-attempts": "Test results",
  "school-tests": "School test review"   // add
};
```

(The copy of `syncStatus.ts` in this folder already has the change if that is easier to diff against.)

## 3. Supabase

Already applied to the live LEEA project on 2026-10-03 and verified as `anon`
(insert + read back inside a rolled-back transaction): both tables, the `grant … to anon`
lines, RLS and the four policies. Only the `schema.sql` file needs the SQL appended so
the repo matches the database. No `set_updated_at` trigger on these two tables on
purpose (see the comment in the SQL).

## 4. Check, then PR

```bash
npm run typecheck
npm run build
```

Then open `/teacher/progress` and `/leo/tests-review` and click through every tab.
Follow AGENTS.md: push and open a PR.

Optional: add a link from the Leo home page (`/leo`) to `/leo/tests-review`
("テストの復習").

## When done

Delete the `_handoff` folder in the same PR, so it never reaches `main`.

## What changed for Neritan

- The data comes from `content/school-tests/tests.json`, not from the old 入力・修正 form
  and `localStorage` (`leeaTestsJPDashboardV2` is no longer read). After each test,
  Claude reads the photos and updates `Leo's_Tests/tests.json`; copy it over
  `content/school-tests/tests.json` and push.
- Test dates are corrected: 1学期中間 2026-06-13, 1学期期末 2026-07-15.
- Averages for totals use the official printed figure (第1回実力 5科目 289.8), not the
  sum of subject averages.

## Tabs

概要 · 成績表 · 推移 · 比較 · 弱点分析 · 問題一覧 · 弱点カード · 次のテスト · 目標 · 印刷,
plus a Leo mode (toggle in the header, or `/leo/tests-review`).
