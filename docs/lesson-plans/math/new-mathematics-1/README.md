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
- `scans/ch0-complete_p11-18.pdf` — **0章 算数から数学へ, complete**
  (九九表のきまり, 素因数分解, 累乗, エラトステネスのふるい). Was
  mislabeled `front-matter.pdf` in an earlier commit — it was misread as
  front-matter-only; it's actually the full chapter.
- `scans/ch0_and_ch1-sec1_p11-21.pdf` — mostly redundant with the file
  above for pages 11–13. Its unique content is **1章 正負の数, complete
  through the end-of-chapter problems** (p.19–62: 符号のついた数, 数の大
  小, 加法と減法, 乗法と除法, 四則の混じった計算, 正負の数の利用, 章末問
  題A/B). Not yet used beyond 1章2節.
- `scans/ch1-sec2_p38-40.pdf` — fully redundant with the file above
  (same p.38–40 content plus repeated front matter). Kept for now since
  it's what 1章2節's lesson content was originally built from; safe to
  delete once cross-checked against the fuller file.
- `scans/ch2_p63-90.pdf` — **2章 文字と式, complete** (p.63–90: 文字を
  使った式, 文字式の計算, 文字式の利用, 章末問題A/B). The book's 2章 has
  **three** sections (1節 文字を使った式 p.64–74, 2節 文字式の計算
  p.75–82, 3節 文字式の利用 p.83–87) plus 章末問題 p.88–90 — the app's
  curriculum originally had it as only 2 sections with wrong page ranges;
  fixed when 1節 was built.

## Coverage status

| 章 | 節 | Pages | Scanned | Lesson content built |
| --- | --- | --- | --- | --- |
| 0章 | 整数の性質 | p.11–18 | full | yes, full (`content/subjects/math/chapters/0/sections/1.json`) |
| 1章 | 1節 正負の数 | p.19–28 | full | yes, full (`content/subjects/math/chapters/1/sections/1.json`) |
| 1章 | 2節 加法と減法 | p.29–40 | full | yes (`content/subjects/math/chapters/1/sections/2.json`) |
| 1章 | 3節 乗法と除法 | p.41–56 | full | yes, full (`content/subjects/math/chapters/1/sections/3.json`) |
| 1章 | 4節 正負の数の利用 | p.57–59 | full | yes, full (`content/subjects/math/chapters/1/sections/4.json`) |
| 1章 | 章末問題A/B | p.60–62 | full | yes (`content/subjects/math/chapters/1/sections/5.json`) |
| 2章 | 1節 文字を使った式 | p.64–74 | full | yes, full (`content/subjects/math/chapters/2/sections/1.json`) |
| 2章 | 2節 文字式の計算 | p.75–82 | full | no |
| 2章 | 3節 文字式の利用 | p.83–87 | full | no |
| 2章 | 章末問題A/B | p.88–90 | full | no |
| 3章–7章 | all | — | no | no |

**1章 正負の数 is fully built and complete.** 2章 文字と式 is now fully
scanned (`ch2_p63-90.pdf`) — 1節 is built; 2節, 3節, and 章末問題 are
ready to build next. 3章 onward has no scans yet. Note that 2章 really
has three sections plus 章末問題, not two as the curriculum first had it.

## Adding more scans

Drop the next batch of page photos/PDFs in `scans/`, named
`<chapter-or-section>_p<start>-<end>.pdf`, and update the coverage table
above in the same PR. Keep each file under ~25MB — if a batch comes in
larger than that, split it into smaller page-range files rather than
switching to Git LFS (this session's environment can't push LFS content).

**Before naming/describing a new file, read every page of it first** —
an earlier version of this README mislabeled a full-chapter scan as
"front matter only" from a partial read, which cost a few rounds of
back-and-forth to catch.
