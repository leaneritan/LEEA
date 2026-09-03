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

## What this book is for

**The workbook is the practice layer; the textbook is the reference layer.**
That split follows from golden rule 12 and `docs/math-interactivity.md`: a
textbook page is prose and procedure, and re-typing it on a screen is worth less
than the printed page it came from. A workbook page is *questions*, and
questions are exactly what a screen does better than paper — checked instantly,
repeatable, and able to track what Leo keeps missing, where a paper workbook is
written in once and done.

So workbook content becomes `practice` blocks appended to the textbook section
its own 教p. line points at. `ScienceBlockPractice` is the only block type whose
page numbers are **not** textbook pages; it carries `workbookPage` and cites the
textbook range separately, and it has no `page` field at all so the two can
never be confused. TypeScript enforces that — the section renderer has to check
for `page` before reading it.

**Built so far:** ワーク p.2 → `sci-u1-c1-1`, ワーク p.3 → `sci-u1-c1-2`.

**The questions are answered on screen, not revealed.** Every question the book
prints options for — (1)'s A・B, (4)'s ア〜エ, (6)'s two places, (8)'s part names
off the photo, p.3's 図1 groups and 図2's 動き方 — carries those exact options and
is marked ○/× as Leo picks. The options are always the book's; **no distractor is
invented**, because a made-up wrong answer teaches a made-up distinction. That
leaves 7 of 10 items on p.2 and 7 of 8 on p.3 answerable; the rest (the 記述 and the
open questions) stay self-check reveals, and the 作図 スケッチ carries no
answer and renders no button, because a reveal with nothing behind it is worse
than no button.

**Every answer is traced.** Each item records the textbook page it was checked
against, and that citation is shown to Leo with the answer.

## Two things to know before building from it

**The answers are not here.** Every question points at 解答 p.N, a separate
booklet that is not in this scan. p.2 and p.3 could still be authored because
they cover 教科書 p.16〜25, which *is* scanned — every answer was derived from
the textbook and cited. That does not scale: past p.31, and for 基本問題 /
力だめし / 確かめ問題 generally, the 解答 booklet is the blocker. **Getting it
scanned is the single highest-value thing for this book.**

**Its 実習1 uses a different organism set from the textbook's.** Workbook p.3
runs the same classification exercise as 教科書 p.23 — same 観点 (水中/陸上,
移動する/しない, ひれ/それ以外) — but with タンポポ, ダンゴムシ, サクラ,
ドジョウ, ツバメ, メダカ, アブラナ, アゲハ, where the textbook uses オオカナダモ,
クロオオアリ, ナナホシテントウ and マアジ among its eight. It also adds a
動き方 question (飛ぶ／走る／泳ぐ) over シマリス, ニホンミツバチ, クジラ, メダカ.

**Built.** `ClassificationSortWidget` now offers both as separate sets behind a
教科書 / ワーク switch, kept apart rather than merged, because each belongs to
its own book's worked example. Solved 観点 are tracked per set, so credit does
not carry across books.

One thing to know if you extend it: the workbook asks its version as **multiple
choice over four pre-made groups** (図1 ア〜エ, of which **エ is a distractor** —
タンポポ appears in both ア and エ), not as sorting. It is offered as sorting so
both sets play the same way. The memberships are still the book's own: ア, イ
and ウ are its stated answers to (3), (4) and (2), and the rest follow as the
complement. 図2's 動き方 question runs over its own four organisms (シマリス,
ニホンミツバチ, クジラ, メダカ), only メダカ shared with the eight.
