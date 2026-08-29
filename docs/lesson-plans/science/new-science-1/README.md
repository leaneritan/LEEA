# 新編 新しい科学１ (Tokyo Shoseki, 中1) — source material

Source material the 理科 content is authored from — not the app content
itself. Same arrangement as `docs/lesson-plans/math/new-mathematics-1/`:
committed as regular files, not Git LFS, as long as each file stays under
25MB (LFS uploads are blocked from cloud sessions).

## Files

| File | What it is |
| --- | --- |
| `qr-content-index.pdf` | 令和7年度版 QRコンテンツ一覧 — the publisher's digital-content index, 4 pages, 166 numbered items. Online at https://sw121.tsho.jp/07jk/r/1/#a |
| `scans/` | **Empty — the textbook scans are still needed.** |

Read `qr-content-index.pdf` before the scans when starting a 章, the same
way the math book's QR index is read first: it is what says which moments
the publisher itself treats as hands-on, and golden rule 12 says those get
a real widget rather than digitized text.

## Book structure

Derived from the QR index. **The page ranges below are unverified** — each
one runs from a 章's first QR anchor to its last, so a 章 may extend a few
pages past what is shown here. Check the printed folio before trusting any
of them, and correct this table when you do. (The math README carries the
same warning for a reason: four of its scan filenames were wrong, and the
discrepancy was believed rather than checked for long enough to produce a
wrong answer about what had been scanned.)

| 単元 | 章 | Pages (unverified) |
| --- | --- | --- |
| 1 いろいろな生物とその共通点 | 学習前 | 10–12 |
| | 第1章 生物の観察と分類のしかた | 13–26 |
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
| 資料 | 9 | Reference material (岩石図鑑, レポートの書き方, 顕微鏡の使い方). |
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
