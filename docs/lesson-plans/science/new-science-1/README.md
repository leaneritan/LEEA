# 新編 新しい科学１ (Tokyo Shoseki, 中1) — source material

Source material the 理科 content is authored from — not the app content
itself. Same arrangement as `docs/lesson-plans/math/new-mathematics-1/`:
committed as regular files, not Git LFS, as long as each file stays under
25MB (LFS uploads are blocked from cloud sessions).

## Files

| File | What it is |
| --- | --- |
| `qr-content-index.pdf` | 令和7年度版 QRコンテンツ一覧 — the publisher's digital-content index, 4 pages, 166 numbered items. Online at https://sw121.tsho.jp/07jk/r/1/#a |
| `qr-index.json` | The index above as structured data — all 166 items with number, page, title, kind, 単元/章, and a `url` field held at `null` until real links exist. |
| `scans/` | Textbook scans. Two in so far; see the table below. |

Read `qr-content-index.pdf` before the scans when starting a 章, the same
way the math book's QR index is read first: it is what says which moments
the publisher itself treats as hands-on, and golden rule 12 says those get
a real widget rather than digitized text.

## Scans in so far

| File | Folios | PDF pages | Verified |
| --- | --- | --- | --- |
| `scans/front-matter_p1-9.pdf` | p.1–9 | 10 | Yes — see the anomaly below |
| `scans/unit1-ch1_p10-26.pdf` | p.10–26 | 17 | Yes — 10→26 sequential, one folio per page, no spreads, no gaps |

`unit1-ch1_p10-26.pdf` covers 単元1 学習前 (p.10–12) and 第1章 生物の観察と
分類のしかた (p.13–26), ending on the 章末 「学んだことをチェックしよう」.
Both ranges in the table below are confirmed by it.

**Front-matter anomaly — 10 PDF pages for 9 folios.** Every page carries a
plain folio 1–9 except PDF page 2, which has a circled ③ where the folio
belongs. PDF pages 1 and 2 are the two halves of one 「探究」の流れを確認
しよう spread, and they are in reverse order: page 2 holds steps 1–4 (the
left half) and page 1 holds steps 5–8 with folio 1 (the right half). So
either the 巻頭 pages carry their own circled numbering and this scan
straddles the boundary, or the halves were photographed out of order.
**Unresolved — do not cite a front-matter page number until someone opens
the book and settles it.**

## Book structure

Derived from the QR index. Ranges marked ✓ have been checked against a
scan's printed folios. **The rest are unverified** — each
one runs from a 章's first QR anchor to its last, so a 章 may extend a few
pages past what is shown here. Check the printed folio before trusting any
of them, and correct this table when you do. (The math README carries the
same warning for a reason: four of its scan filenames were wrong, and the
discrepancy was believed rather than checked for long enough to produce a
wrong answer about what had been scanned.)

| 単元 | 章 | Pages (unverified) |
| --- | --- | --- |
| 1 いろいろな生物とその共通点 | 学習前 | 10–12 ✓ |
| | 第1章 生物の観察と分類のしかた | 13–26 ✓ |
| | 第2章 植物の分類 | 27–44 |
| | 第3章 動物の分類 | 45–62 |
| | 単元末 | 65–69 |
| 2 身のまわりの物質 | 学習前 | 70–72 |
| | 第1章 身のまわりの物質とその性質 | 73–90 |
| | 第2章 気体の性質 | 91–100 |
| | 第3章 水溶液の性質 | 101–114 |
| | 第4章 物質の姿と状態変化 | 115–131 |
| | 単元末 | 133–137 |
| 3 身のまわりの現象 | 学習前 | 138–140 |
| | 第1章 光の世界 | 141–158 |
| | 第2章 音の世界 | 159–166 |
| | 第3章 力の世界 | 167–181 |
| | 単元末 | 183–187 |
| 4 大地の変化 | 学習前 | 188–192 |
| | 第1章 火をふく大地 | 193–206 |
| | 第2章 動き続ける大地 | 207–218 |
| | 第3章 地層から読みとる大地の変化 | 219–235 |
| | 単元末 | 237–241 |
| 巻末資料 | | 244–249 |

## What the QR index contains

166 items across nine kinds:

| Kind | Count | What it means for the build |
| --- | --- | --- |
| 動画 | 89 | Publisher video. Not ours to reproduce — a lesson may reference the moment, not embed it. |
| 練習 | 25 | Self-check practice. Maps to an attempt-then-reveal block. |
| ワークシート | 17 | All but one are the per-章 Before & After シート. |
| 資料 | 7 | Reference material (岩石図鑑, レポートの書き方, 顕微鏡の使い方). |
| **シミュレーション** | **9** | **Must ship as a real interactive widget** (golden rule 12). Listed below. |
| **思考ツール** | **7** | Sorting/classification tools — inherently manipulation, so also widgets. Listed below. |
| Webページ（リンク） | 5 | External links (ハザードマップポータル, 防災科研, ジオパーク). Link out; do not mirror. |
| 他教科リンク | 4 | Cross-subject pointers — two of them point at 社会 and 保健体育. |
| Webページ | 3 | 教科共通コンテンツ, not tied to a 単元. |

### The 9 シミュレーション

| # | Page | Title | 単元 |
| --- | --- | --- | --- |
| 77 | 105 | 砂糖が水にとけるようすと粒子のモデル | 2 |
| 82 | 112 | 溶解度曲線でみる再結晶 | 2 |
| 91 | 121 | ロウが状態変化するときの粒子の運動のモデル | 2 |
| 92 | 121 | エタノールが状態変化するときの粒子の運動のモデル | 2 |
| 93 | 122 | 状態変化するときの粒子の運動のモデル | 2 |
| 95 | 126 | 融点、沸点と状態変化の関係 | 2 |
| 110 | 157 | 凸レンズによる像の見え方 | 3 |
| 139 | 204 | 世界の活火山・震源の分布 | 4 |
| 147 | 212 | 世界の海底の地形図と活火山・震源の分布 | 4 |

Six of the nine sit in 単元2, and four of those six are the same idea seen
four ways (particle motion through a state change) — one widget with
substance/temperature inputs plausibly serves 91, 92, 93 and 95 rather than
four near-duplicates. Confirm against the scans before building.

**Items 139 and 147 are world maps**, and LEEA already has the machinery:
`public/components/world-map.js` (`buildWorldMap`, `enableZoom`),
`world-countries.js` and `world-climate.js`, all built for Geography. A
活火山・震源分布 map is a marker layer over that same base — build it on
those components, not from scratch, and read the Geography section of
AGENTS.md first for the pointer-capture and clamping traps.

### The 7 思考ツール

All in 単元1, all classification: さまざまな生物の分類 (p.23), 身近な植物を
分類しよう (p.42), 植物の分類表 (p.44), 脊椎動物のグループ分け (p.50),
無脊椎動物のグループ分け (p.54), 動物の分類表をつくろう (p.59), 動物の
分類表 (p.61).

単元1 has no シミュレーション at all — its hands-on content is entirely
these. A sort/build-the-tree widget (drag organisms into groups, check the
result) is the shape they all want, and one such widget likely covers most
of the seven.

## Linking to the publisher's online content

Every item in the QR index has a counterpart on the publisher's portal at
https://sw121.tsho.jp/07jk/r/1/ — that is where the 動画 and the
シミュレーション actually live. `qr-index.json` carries a `url` field on
each item, and `urlsResolved: false` at the top, so the mapping can be
filled in once without touching anything downstream.

**The portal is not reachable from a Claude Code cloud session.** The
environment's egress proxy answers 403 for `sw121.tsho.jp`, and that block
covers every tool in the session equally — `curl`, WebFetch and headless
Chromium all go through the same proxy. This is a network-policy question,
not a code one: see
https://code.claude.com/docs/en/claude-code-on-the-web.

Until a real URL is captured for an item, leave its `url` at `null`. Do not
guess a URL from the item number or infer a pattern from a sibling — the same
rule Geography's `sourceLabel` follows: set it from something real or leave it
empty. A link that 404s in front of Leo is worse than no link.

Math's `content/subjects/math/digitalCompanion.ts` maps pages onto
`sw111.tsho.jp/07jk/m/1/<letter>/#<NN>`, and 理科's portal is the sibling
`sw121…/r/1/` (`m` 数学, `r` 理科). That is a plausible shape for what a capture
will find — it is **not** a licence to generate the table from it.

### Capturing the links

Run this in a browser that can reach the portal (Claude in Chrome, or by hand),
then bring the output back and import it.

**How the portal is laid out**, from a screenshot of it: a left sidebar picks
the 単元 at the top, and below it lists that 単元's sections — 学習前, 第1章 …,
単元末. Picking one fills the right-hand panel with that section's rows, each
showing a page badge (`10ページ`), the item's title, and an icon for its kind.
**The rows carry no item numbers**, so `no` will be empty in the capture; that
is expected and fine — the importer keys on page + title instead, which it has
to anyway, since 「Before & After シート」 appears 17 times in this book and
「学んだことをチェックしよう」 13 times.

**Prompt to paste into Claude in Chrome**, with the portal open:

> Open https://sw121.tsho.jp/07jk/r/1/ — the QR content list for 新編 新しい科学1
> (東京書籍, 令和7年度版).
>
> Using the left sidebar, go through every 単元 (1–4) and, inside each, every
> section listed (学習前, each 第N章, 単元末), plus 巻末資料 and any
> 教科共通コンテンツ. For each one, record every row shown in the right panel.
>
> Output **TSV only**, no prose, with exactly this tab-separated header:
>
> `no  unit  chapter  page  title  kind  url  chapter_url`
>
> - `no` — leave empty; the portal does not number the rows
> - `unit` — the 単元 number (1–4), empty for 教科共通コンテンツ / 巻末資料
> - `chapter` — exactly as the sidebar labels it: `学習前`, `第1章`, `単元末`, …
> - `page` — the page badge, e.g. `10ページ` (digits alone are fine too)
> - `title` — the row's title exactly as shown, no rewording
> - `kind` — 動画 / シミュレーション / 思考ツール / ワークシート / 資料 / 練習 /
>   他教科リンク / Webページ, from the row's icon if it is not written out
> - `url` — the row's own link, **only if it has one**: an `href` on the row, or
>   the address bar after opening that row
> - `chapter_url` — the address bar while that 単元/章 is selected in the sidebar
>
> Many rows may open a viewer without giving the row its own address. That is
> expected: leave `url` empty for those and still fill in `chapter_url`.
>
> **Never construct, guess, or pattern-match a URL.** Do not derive one row's
> link from another's, and do not build one from the page number. An empty cell
> is correct and useful; an invented one is worse than nothing, because it
> becomes a dead link in front of a student. Do not drop rows either — a row
> with no link should still appear with its other fields filled in.

Save the reply as a `.tsv` (or a JSON array of the same fields) and run:

```sh
npm run import:science-links -- capture.tsv --dry-run   # inspect
npm run import:science-links -- capture.tsv             # write
```

Per-row links go into each item's `url`; `chapter_url` values are collected
separately into the index's `chapters` map, keyed `<unit>/<章>`. Both are worth
having: math's `digitalCompanion.ts` is itself only page-to-章-anchor, so
section-level links are enough to build the same thing for 理科, and per-row
links are a bonus if the portal exposes them.

The importer treats this index as the authority and the capture as a claim. It
only ever writes `url` and `chapters`, and it refuses a row whose page, title or
単元 disagrees with what is recorded here, whose link is off the publisher's
domain, or that matches no item — reporting each one instead of writing it. It
exits non-zero when anything mismatched, so a disagreement gets looked at rather
than committed. Partial captures are fine and the script can be run repeatedly;
`urlsResolved` flips to `true` only once all 166 items have a link.
