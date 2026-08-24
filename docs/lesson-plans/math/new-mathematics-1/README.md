# 新編 新しい数学1 (Tokyo Shoseki, 中1) — source scans

Source photos/PDFs the 中1数学ヘルパー (`content/subjects/math/`) lesson
content is authored from — not the app content itself. Committed as
regular files (not Git LFS, unlike `docs/lesson-plans/english/`) since
each file here is under 25MB.

## Files

**Filenames state the textbook pages inside, and every one below has been
checked against the printed folio on its first and last page.** They did not
always: four names were wrong, two of them badly, and the discrepancy was
believed rather than checked for long enough to produce a wrong answer about
what was scanned. If you add a scan, open it and read the page numbers.

Two things make page counts misleading on their own, so do not infer coverage
from them: some scans are **two-page spreads** (one PDF page, two folios), and
one file has **pages missing from the middle**.

| File | Textbook pages | PDF pages | Notes |
| --- | --- | --- | --- |
| `front-matter_p1-10.pdf` | p.1–10 | 10 | もくじ, the how-to-use-this-book guide, SDGs note |
| `ch0-complete_p11-18.pdf` | p.11–18 | 8 | 0章 算数から数学へ, complete |
| `ch1-complete_p19-62.pdf` | p.19–62 | 44 | 1章 正負の数, complete through 章の問題 B |
| `ch2_p63-90.pdf` | p.63–90 | 28 | 2章 文字と式, complete |
| `ch3_p91-116.pdf` | p.91–116 | 26 | 3章 方程式, complete |
| `ch4_p117-156.pdf` | p.117–156 | 40 | 4章 比例と反比例, complete |
| `ch5_p157-190.pdf` | p.157–190 | 34 | 5章 平面図形, complete |
| `ch6_p191-224.pdf` | p.191–224 | 34 | 6章 空間図形, complete |
| `ch7_p225-248.pdf` | p.225–248 | 24 | 7章 データの活用, complete; runs one page past the chapter into p.248 |
| `appendix_math-connect_p248-262.pdf` | p.248–257, 260–262 | 11 | **p.258–259 are missing.** p.252–255 are spreads, two folios per PDF page |
| `appendix_jiyu-kenkyu_p281-292.pdf` | p.281–292 | 12 | 数学の自由研究, optional enrichment |
| `appendix_answer-key_p293-310.pdf` | p.293–310 | 18 | Publisher's answer key, then さくいん p.308–310 |

`qr-content-index.pdf` (13 pages) is the publisher's QR コンテンツ一覧 — the
digital-content index for the whole book, mapping every フラッシュカード /
シミュレーション / ワークシート / ヒントと解答 / 動画 / 対話シート to its
page and section. Read it before the scans when starting a chapter, and to
check whether a シミュレーション-tagged moment already has a real interactive
widget (golden rule 12 in AGENTS.md).

### What is in each chapter file

- **0章** (p.11–18): 九九表のきまり, 素因数分解, 累乗, エラトステネスのふるい.
- **1章** (p.19–62): 1節 正負の数 p.19–28, 2節 加法と減法 p.29–40, 3節 乗法と除法
  p.41–56, 4節 正負の数の利用 p.57–59, 章末問題 A/B p.60–62.
- **2章** (p.63–90): 1節 文字を使った式 p.64–74, 2節 文字式の計算 p.75–82, 3節
  文字式の利用 p.83–87, 章末問題 p.88–90.
- **3章** (p.91–116): 1節 方程式とその解き方 p.92–102, 2節 1次方程式の利用
  p.103–111, 章末問題 p.114–116 (p.112–113 is a cross-curricular column, not core
  lesson content).
- **4章** (p.117–156): 比例と反比例, all sections. Scanned, reviewed at a high
  level, not yet built.
- **5章** (p.157–190): 1節 図形の移動 p.158–168 (平行/回転/対称移動), 2節 基本の作図
  p.169–182 (垂線・垂直二等分線・角の二等分線・接線), 3節 おうぎ形 p.183–185, 章末問題
  p.188–190. Heavy on hands-on transformations and constructions — very
  interactive-friendly. Not yet built.
- **6章** (p.191–224): 1節 いろいろな立体 p.192–196 (多面体・正多面体・オイラーの定理),
  2節 立体の見方と調べ方 p.197–212 (ねじれの位置・展開図・投影図), 3節 立体の体積と表面積
  p.213–221, 章末問題 ~p.222–224. Not yet built.
- **7章** (p.225–248): 1節 データの整理と分析 p.226–236 (ヒストグラム・相対度数・代表値),
  2節 データの活用 p.237–240, 3節 ことがらの起こりやすさ p.241–245 (確率), 章末問題
  p.246–247. Not yet built.
- **答え** (p.293–310): every chapter's 基本の問題 and 章の問題 A/B (p.293–300),
  学びのベース elementary-review answers (p.301–302), 補充の問題 answers for all 7
  chapters (p.302–307 — **answers only, the problem text at p.266–280 is not
  scanned**), and the index (p.308–310). Useful for cross-verifying built content
  against ground truth rather than only recomputing answers; the whole 1章–3章
  audit was spot-checked against it and agreed 100%.
- **MATH CONNECT** (p.248–262): 数学の目でふり返ろう per-chapter reflections
  p.250–255, 学びのベース 算数まとめ編 p.256 and たしかめ編 p.260. Enrichment and
  reference, not core per-chapter lesson content.

### Not scanned

From the もくじ in `front-matter_p1-10.pdf`, the book runs to p.313. These parts
are not in this directory:

- **p.258–259** — inside 学びのベース, missing from the MATH CONNECT scan.
- **p.263–265** — 1年のふり返り (starts p.263).
- **p.266–280** — 補充の問題. Only the *answers* are scanned, in the answer key at
  p.302–307; the problems themselves are not.
- **p.311–313** — end of さくいん and 付録.

Every page of core lesson content, p.11–247, is scanned.

## Coverage status

| 章 | 節 | Pages | Scanned | Lesson content built |
| --- | --- | --- | --- | --- |
| 0章 | 整数の性質 | p.11–18 | full | yes, full |
| 1章 | 1節 正負の数 | p.19–28 | full | yes, full |
| 1章 | 2節 加法と減法 | p.29–40 | full | yes, full |
| 1章 | 3節 乗法と除法 | p.41–56 | full | yes, full |
| 1章 | 4節 正負の数の利用 | p.57–59 | full | yes, full |
| 1章 | 章末問題A/B | p.60–62 | full | yes, full |
| 2章 | 1節 文字を使った式 | p.64–74 | full | yes, full |
| 2章 | 2節 文字式の計算 | p.75–82 | full | yes, full |
| 2章 | 3節 文字式の利用 | p.83–87 | full | yes, full |
| 2章 | 章末問題A/B | p.88–90 | full | yes, full |
| 3章 | 1節 方程式とその解き方 | p.92–102 | full | yes, full |
| 3章 | 2節 1次方程式の利用 | p.103–111 | full | yes, full |
| 3章 | 章末問題A/B | p.114–116 | full | yes, full |
| 4章 | 比例と反比例 (all) | p.117–156 | full | no |
| 5章 | 平面図形 (all 3 節) | p.157–190 | full | no |
| 6章 | 空間図形 (all 3 節) | p.191–224 | full | no |
| 7章 | データの活用 (all 3 節) | p.225–247 | full | no |

**0章–3章 are fully built and complete** — every section, every
chapter's 章末問題, cross-verified against the official answer key.
**All scans for the entire book (0章–7章) are now in hand** — 4章
onward is scanned but not yet built.

### Content audit (2026-07-19)

Ran a full page-by-page audit of every built section (0章–3章) against
the source scans and the QR content index, looking for wrong answers,
missing problems, and シミュレーション-tagged moments without a real
widget. Found and fixed real gaps in 1章1節/2節/3節 and 2章1節/2節/3節
(most notably: 1章2節 was missing its entire 減法 teaching sequence).
0章, 1章4節/5節, and 2章4節 were fully faithful with no changes needed.
See git history on PRs #306 and #308 for details. Subsequently
cross-verified against the official answer key (once it became
available) with 100% agreement on every checked item.

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
