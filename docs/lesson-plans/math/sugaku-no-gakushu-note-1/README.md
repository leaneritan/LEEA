# 数学の学習ノート 1年（東京書籍版） — source scans

The 教科書準拠ワーク that accompanies 新編 新しい数学1. **This is a second,
separate book from `../new-mathematics-1/` — its own pagination, its own
問題 numbering.** A bare page number is therefore ambiguous between the two;
always say which book. Every section in here prints its own 教科書 P.NN
cross-reference in the top-right corner, so read the mapping off the page
rather than inferring it from chapter order.

Committed as regular files (not Git LFS, same as the textbook scans) since each
file is under 25MB.

## Files

**Filenames state the workbook pages inside, and every page of all three files
has been read and checked against the printed folio.** Page counts are
one PDF page per folio throughout — no spreads, nothing missing from the
middle — so for these three files the count and the range do agree.

| File | Workbook pages | PDF pages | Notes |
| --- | --- | --- | --- |
| `front-matter-start-dash_p2-9.pdf` | 目次 + 構成と使い方 (unnumbered), then p.2–9 | 10 | 中学数学スタートDASH! — the 算数 review feature |
| `ch0_p10-11.pdf` | p.10–11 | 2 | 0章 算数から数学へ, complete |
| `ch1_p12-41.pdf` | p.12–41 | 30 | 1章 正負の数, complete incl. 確認テスト, C問題, 考えてみよう |

The two front-matter pages carry no printed folio. p.1 is not among the scanned
pages; the 目次's first entry is 中学数学スタートDASH! at p.2.

## How this book is built

`front-matter-start-dash_p2-9.pdf` p.2 (この本の構成と使い方) lays out the six
steps, and every 章 in the book repeats them in this order:

1. **基本のページ** — a teaching box across the top, then A問題 (教科書の基本
   レベル) and B問題 (やや発展). B問題 usually ends with a 理解を深める1問!
2. **特訓ドリル** — drill-format review of the basics just covered.
3. **確認テスト** — the 章 as a 100点 test, with per-question 配点 and a
   back-reference to the workbook page each question came from.
4. **C問題 入試レベルに挑戦!** — 高校入試-level questions, several tagged with the
   prefecture they came from (大阪, 山形, 北海道 …).
5. **考えてみよう** — one real-world application page per 章.
6. **思考力アップ問題** — the hardest set. Not in every 章: the 目次 lists it
   only at p.80 and p.136.

Problems are tagged 知・技 or 思・判・表 and carry a 教P.NN reference to the
textbook page they practise.

### What is in each file

- **中学数学スタートDASH!** (p.2–9): 15 numbered 算数 review topics —
  たし算, ひき算, かけ算, わり算, 計算の順序ときまり, 公倍数と公約数,
  分数や小数で表す, いろいろな単位, いろいろな文章題, 比例の関係・反比例の関係,
  対称な図形, いろいろな図形の面積, いろいろな立体の体積, 度数分布表と
  ヒストグラム, 代表値. Each topic is a rules box plus a short question set.
- **0章** (p.10–11): 1 整数の性質 (教 P.12–17) — 素数, 累乗, 素因数分解, and a
  B問題 deriving 約数 from a 素因数分解.
- **1章** (p.12–41): the full 正負の数 chapter —
  1 符号のついた数 p.12–13 (教 P.22–24),
  2 数の大小 p.14–15 (教 P.25–27),
  3 加法 p.16–17 (教 P.30–32),
  4 分数や小数の加法／加法の交換法則と結合法則 p.18–19 (教 P.32–33),
  5 減法 p.20–21 (教 P.34–36),
  6 加法と減法の混じった計算 p.22–23 (教 P.37–39),
  特訓ドリル① 正負の数の加法と減法 p.24–25,
  7 乗法 p.26–27 (教 P.42–46),
  8 累乗 p.28 (教 P.47),
  9 除法 p.29 (教 P.48–49),
  10 除法と逆数 p.30 (教 P.50–51),
  11 乗法と除法の混じった計算 p.31 (教 P.51),
  12 四則の混じった計算 p.32–33 (教 P.52–53),
  特訓ドリル② 正負の数の四則 p.34–35,
  13 数の範囲と四則 p.36 (教 P.54–55),
  14 正負の数の利用 p.37 (教 P.57–59),
  確認テスト 正負の数 p.38–39,
  C問題 入試レベルに挑戦 p.40,
  考えてみよう ゴルフのスコア p.41.

### These scans are worked pages, not blanks

Leo has written in this copy and it has been marked in red pen, so most pages
carry both his working and the correction. That is the point of scanning them —
they show what he actually did — but it means **the printed question is the
source of truth and the handwriting is evidence, not answer key**. A pencil
answer may be wrong; a red mark may be a correction, a ✓, or a circled right
answer written next to a crossed-out wrong one.

Worked and marked through p.37. Still blank: 確認テスト p.39, C問題 p.40 and
考えてみよう p.41 entirely, and p.38 apart from ①'s number line, ②(1)'s answer
box and some margin scratch.

## Not scanned

From the 目次 in `front-matter-start-dash_p2-9.pdf`, the book runs to at least
p.152. These parts are not in this directory:

- **p.1** — not scanned (the 目次 starts its listing at p.2).
- **p.42–149** — 2章 文字と式 through 7章 データの分析と活用, all six 章.
- **p.150–152** — 1年のまとめ p.150, 重要事項のチェック p.152.
- **The 解答・解説 booklet** — this workbook ships answers as a separate 別冊,
  which is not in hand. Until it is, a workbook answer can only be verified by
  recomputing it, or against the textbook's own answer key at
  `../new-mathematics-1/scans/appendix_answer-key_p293-310.pdf` where the same
  problem happens to appear there — which for most ワーク問題 it does not.

## Coverage status

Built sections live at `/math/note` — the workbook is its own tab, separate from
the textbook spine at `/math`. See "Authoring a 学習ノート section" in
`docs/math-interactivity.md` for how a scan becomes a section.

| 章 | Workbook pages | Textbook pages | Scanned | Built |
| --- | --- | --- | --- | --- |
| 中学数学スタートDASH! | p.2–9 | — (算数 review) | full | no |
| 0章 整数の性質 | p.10–11 | 教 P.12–17 | full | no |
| 1章 正負の数 | p.12–41 | 教 P.22–59 | full | p.12–15 only |
| 2章 文字と式 | p.42–61 | 教 P.66–87 | no | no |
| 3章 方程式 | p.62–81 | 教 P.94–111 | no | no |
| 4章 比例と反比例 | p.82–99 | 教 P.120–153 | no | no |
| 5章 平面図形 | p.100–115 | 教 P.160–185 | no | no |
| 6章 空間図形 | p.116–137 | 教 P.194–221 | no | no |
| 7章 データの分析と活用 | p.138–149 | 教 P.228–245 | no | no |
| 1年のまとめ・重要事項のチェック | p.150–152 | — | no | no |

**Every row below 1章 is derived from the 目次, not read off a folio.** The 目次
lists only where each numbered section begins, and folds 確認テスト・C問題・
考えてみよう into one entry at the 確認テスト's page, so each 章's end here is
inferred as "the page before the next 章 starts" — the pattern 1章 actually
follows (確認テスト p.38–39, C問題 p.40, 考えてみよう p.41, then 2章 at p.42), but
still an inference for the rest. The 教科書 column comes from the 目次's own
(NN~NN) cross-references, which cover the numbered sections only and skip the
特訓ドリル / 確認テスト pages. Check both against the printed folios when those
scans arrive, and fix this table in the same PR.

The textbook side is already fully scanned — see `../new-mathematics-1/README.md`.

## Adding more scans

Drop the next batch in `scans/`, named `<chapter-or-section>_p<start>-<end>.pdf`
using **workbook** page numbers, and update the tables above in the same PR.
Keep each file under ~25MB — split a larger batch into smaller page ranges
rather than switching to Git LFS (this session's environment can't push LFS
content).

**Before naming or describing a new file, read every page of it first.** The
textbook README next door records what happens when that step is skipped: four
filenames stated page ranges that were not what the file held, and the names
were believed rather than checked.
