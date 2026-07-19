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
- `scans/ch3_p91-116.pdf` — **3章 方程式, complete** (p.91–116: 方程式
  とその解、等式の性質、移項と方程式の解き方、いろいろな方程式、1次方程
  式の利用、比例式の利用、章末問題A/B). Two sections (1節 方程式とその
  解き方 p.92–102, 2節 1次方程式の利用 p.103–111) plus 章末問題 p.114–116
  (p.112–113 is a cross-curricular column, not core lesson content).
- `scans/ch4_p117-156.pdf` — **4章 比例と反比例, complete** (p.117–156).
  Reviewed but not yet built.

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
| 2章 | 2節 文字式の計算 | p.75–82 | full | yes, full (`content/subjects/math/chapters/2/sections/2.json`) |
| 2章 | 3節 文字式の利用 | p.83–87 | full | yes, full (`content/subjects/math/chapters/2/sections/3.json`) |
| 2章 | 章末問題A/B | p.88–90 | full | yes (`content/subjects/math/chapters/2/sections/4.json`) |
| 3章 | 1節 方程式とその解き方 | p.92–102 | full | yes, full (`content/subjects/math/chapters/3/sections/1.json`) |
| 3章 | 2節 1次方程式の利用 | p.103–111 | full | no |
| 3章 | 章末問題A/B | p.114–116 | full | no |
| 4章 | all | p.117–156 | full | no |
| 5章–7章 | all | — | no | no |

**1章 正負の数 and 2章 文字と式 are both fully built and complete** —
every section plus each chapter's 章末問題. 3章 方程式's 1節 is now
built too; 2節 and 章末問題 are scanned and ready to build next. 4章
比例と反比例 is scanned but not started. 5章 onward has no scans yet:
photograph and drop the next chapter's pages in `scans/` to continue.

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
