# よくわかる 理科の学習 1（東）— source scans

A **workbook**, not a textbook. It accompanies
`docs/lesson-plans/science/new-science-1/` (新編 新しい科学1, 東京書籍) — the
「東」 and 「1年」 printed in every page footer are the edition marker: this is
the 東京書籍 grade-1 edition, so its structure follows that textbook exactly.

Keep the two apart. The textbook is where explanations, 観察・実験 and the
思考ツール come from. This is practice: 教科書チェック pages, 基本問題,
力だめし, 確認テスト, キホンの入試 and 単元の完成.

## Files

| File | Folios | PDF pages | Verified |
| --- | --- | --- | --- |
| `scans/toc-and-p1-31.pdf` | p.1–31 | 31 | Yes — folio N on PDF page N throughout, no spreads, no gaps |

p.1 is the もくじ; content runs p.2–31.

## The two page numberings do not match, and that matters

This book has its own pagination (p.1–120) which is **unrelated** to the
textbook's (p.10–241). Both cover the same 単元 and 章, so a bare page number is
ambiguous between them. Never record a page from this book in a field that
means a textbook page — `ScienceBlock.page`, the chip linker and
`qr-index.json` all mean 新編 新しい科学1 pages.

**The workbook solves this itself.** Every section prints the textbook range it
covers, as 教p.NN〜NN:

| This book | says | which is |
| --- | --- | --- |
| p.2 ①生物の観察のしかたをマスターしよう | 教p.16〜19 | 節1 生物の観察 |
| p.3 ②生物の分類のしかたを考えよう | 教p.22〜25 | 節2 生物の特徴と分類 |

So a workbook page maps onto the sections already authored in
`content/subjects/science/` through its own printed cross-reference — read it
off the page rather than inferring it from the 章 title.

## Coverage

Unit ranges read from the もくじ. **The per-章 breakdown inside them has not
been transcribed** — the TOC scan is not legible enough to do it without
guessing, so read it off the pages themselves when a chapter is built.

| 単元 | Pages (from もくじ) | Scanned? |
| --- | --- | --- |
| 1 いろいろな生物とその共通点 | p.2–20 | Yes, complete |
| 2 身のまわりの物質 | p.22–60 | Partial — p.21–31 only |
| 3 身のまわりの現象 | p.62–92 | No |
| 4 大地の変化 | p.94–120 | No |

## Two things to know before building from it

**The answers are not here.** Every question block points at 解答 p.N, a
separate answer booklet that is not in this scan. Practice without an answer key
is worth much less, so get that booklet before authoring 基本問題 or 力だめし
content.

**Its 実習1 uses a different organism set from the textbook's.** Workbook p.3
runs the same classification exercise as 教科書 p.23 — same 観点 (水中/陸上,
移動する/しない, ひれ/それ以外) — but with タンポポ, ダンゴムシ, サクラ,
ドジョウ, ツバメ, メダカ, アブラナ, アゲハ, where the textbook uses オオカナダモ,
クロオオアリ, ナナホシテントウ and マアジ among its eight. It also adds a
動き方 question (飛ぶ／走る／泳ぐ) over シマリス, ニホンミツバチ, クジラ, メダカ.

That is a ready-made second set for `ClassificationSortWidget`, which today
carries only the textbook's — but the two sets must not be merged into one pool,
because each belongs to its own book's worked example.
