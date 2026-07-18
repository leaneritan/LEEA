# 新編 新しい数学1 (Tokyo Shoseki, 中1) — source scans

Source photos/PDFs the 中1数学ヘルパー (`content/subjects/math/`) lesson
content is authored from — not the app content itself. Committed as
regular files (not Git LFS, unlike `docs/lesson-plans/english/`) since
each file here is under 25MB.

## Files

- `qr-content-index.pdf` — publisher's QR コンテンツ一覧 (13 pages). Full
  digital-content index for the whole book: every フラッシュカード /
  シミュレーション / ワークシート / ヒントと解答 / 動画 / 対話シート,
  mapped to its textbook page and chapter/section. Use this first to see
  what exists for a chapter before reading the scans below.
- `scans/front-matter.pdf` — cover, 目次 (table of contents for all 8章),
  デジタルコンテンツの使い方, 学びをふり返ろう / 数学マイノート guidance
  (textbook pages 1–7). No chapter content.
- `scans/ch0_and_ch1-sec1_p11-21.pdf` — 0章 算数から数学へ (九九表の
  きまり, 素因数分解) and the start of 1章1節 正負の数 (負の数, 予想最低
  気温の例), textbook pages 11–21. Also repeats the front matter.
- `scans/ch1-sec2_p38-40.pdf` — tail of 1章2節 加法と減法 (問3–問6,
  トランプゲームのまど, 基本の問題), textbook pages 38–40. Also repeats
  the front matter.

## Coverage status

| 章 | 節 | Pages | Scanned | Lesson content built |
| --- | --- | --- | --- | --- |
| 0章 | 整数の性質 | p.11–18 | partial (11–13 only) | no |
| 1章 | 1節 正負の数 | p.19–28 | partial (19–21 only) | no |
| 1章 | 2節 加法と減法 | p.29–40 | partial (29, 38–40 only) | yes (`content/subjects/math/chapters/1/sections/2.json`) |
| 1章 | 3節 乗法と除法 | p.41–58 | no | no |
| 2章–7章 | all | — | no | no |

The section-2 lesson content was built from a mix of these scans and the
`design_handoff_math_helper` prototype's sample content (which mirrors
what's visible on p.29–40); it hasn't been checked against the full
p.22–37 and p.30–37 page range, since those weren't scanned yet.

## Adding more scans

Drop the next batch of page photos/PDFs in `scans/`, named
`<chapter-or-section>_p<start>-<end>.pdf`, and update the coverage table
above in the same PR. Keep each file under ~25MB — if a batch comes in
larger than that, split it into smaller page-range files rather than
switching to Git LFS (this session's environment can't push LFS content).
