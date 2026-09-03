# Building a 理科 chapter

The complete workflow for turning one 章 of 新編 新しい科学1 into LEEA content.
Written to be followable by any coding agent, not only Claude Code.

単元1 第1章 was built this way and is the worked example: read it before
starting, at `content/subjects/science/sections/sci-u1-c1-*.json`.

---

## 0. What you need before starting

| Input | Where | Blocking? |
| --- | --- | --- |
| Textbook scan of the 章 | `docs/lesson-plans/science/new-science-1/scans/` | **Yes** — nothing can be authored without it |
| QR index | `docs/lesson-plans/science/new-science-1/qr-index.json` | Already in the repo, 160/166 items linked |
| ワーク scan of the matching pages | `docs/lesson-plans/science/yokuwakaru-rika-1/scans/` | Only for practice blocks |
| ワーク 解答 booklet | not scanned yet | Only for 基本問題 / 力だめし |

If the textbook scan is missing, stop and say so. Do not author a 章 from the
QR index alone: the index gives titles and pages, not content.

---

## 1. Verify the scan before believing its filename

Open it and read the printed folio on the first and last page, and spot-check
the middle. Record what you found.

This is not ceremony. Math's scan filenames were wrong four times, and the
理科 front matter turned out to be 10 PDF pages for 9 folios with two halves of
a spread in reverse order. **Page counts mislead**: some scans are two-page
spreads, some have pages missing from the middle, some include an unnumbered
もくじ.

Then **correct the page range in `content/subjects/science/curriculum.ts`**.
Every range outside 単元1 第1章 was derived from QR anchor pages, not read off
folios, so treat them as claims until a scan proves them.

## 2. Read every page before writing anything

`docs/math-interactivity.md` requires this and it earns its keep every time.
Reading 単元1 第1章 in full is what turned up the 図鑑 pages on p.14–15 (24
organisms with 科 and size) and p.24's exact three-level classification tree —
neither of which the QR index hints at.

Render at 150 DPI when reading fine detail. At 60 DPI the workbook's 図1 エ
looked like a transcription error rather than the distractor it is.

## 3. Author the sections

One JSON file per 節 at `content/subjects/science/sections/<sectionId>.json`,
shaped by `content/subjects/science/types.ts`.

| Block | Use for |
| --- | --- |
| `intro` | opens the 節 — title, the book's ？, page range, topic flow |
| `goal` | めあて |
| `q` | the blue ？ box / レッツスタート |
| `procedure` | 観察 / 実験 / 実習 — steps, 準備する物, 注意, 考察のポイント |
| `technique` | 基礎操作 — how to use a piece of equipment |
| `term` | ことば, with `highlightPhrases` marking the defining clause |
| `field` | 図鑑 rows (name, 科, size, note) |
| `recall` | これまでに学んだこと, 観察から, 考察しよう |
| `quickcheck` | 章末 学んだことをチェックしよう — items + answers |
| `reflect` | Before & After, 自分の考えをまとめよう, 活用 |
| `interactive` | a QR-flagged hands-on item — see §4 |
| `practice` | ワーク questions — see §6 |

**Transcribe, don't paraphrase.** The book's own wording is the content. Where
you summarise (a long 観察から paragraph, say), keep its claims exact.

`page` is always a **textbook** page, as a string. `chips` mirror the QR kinds
so a block shows what the book flags.

## 4. Widgets: check the families before building

Golden rule 12: anything the publisher flags as **シミュレーション** or
**思考ツール** ships as a real widget that computes from Leo's input. That is 16
items in the whole book — but they collapse into about six widgets, so **look
here before writing a new one**:

| Family | QR items | Status |
| --- | --- | --- |
| Sort by criterion | p.23, 42, 50, 54 | **Built** — `ClassificationSortWidget`, add a set |
| 分類表 tree | p.44, 59, 61 | Not built — place organisms down a branching key |
| Particle model | p.105, 121×2, 122 | Not built — one engine, substance/scenario inputs |
| Graph reading | p.112 溶解度曲線, p.126 融点・沸点 | Not built — `public/components/charts.js` exists |
| Ray diagram | p.157 凸レンズ | Not built — bespoke |
| World map markers | p.204, 212 | Not built — reuse `public/components/world-map.js` |

Adding a set to an existing widget is data, not code. Prefer it.

**A widget must compute a real answer from Leo's input and tell him whether he
is right.** Replaying a fixed animation, or showing the book's answer, does not
satisfy this. The bar is the precedent list in `docs/math-interactivity.md`.

Add the new widget id to `ScienceInteractiveWidget` in `types.ts`, render it in
`SectionBlocks.tsx`, and keep sets from different books **separate** — each is
its own book's worked example, and merging them misrepresents both.

## 5. Link the chips

```sh
node scripts/link-science-chips.mjs --dry-run   # inspect
node scripts/link-science-chips.mjs             # write
```

It matches a chip's kind and its block's page against the QR index, and links
**only** where that page has exactly one item of that kind. Ambiguous ones are
reported and left alone — p.17 has two 動画, so a heuristic would pick wrong.
Set those by hand from reading the blocks; hand-set URLs survive re-runs.

Set the 節's `digitalUrl` in `curriculum.ts` from the `chapters` map in
`qr-index.json`. **Never derive a URL.** Math's sibling scheme keys its letter
to the 章 where science keys it to the 単元; extrapolating produces
plausible-looking links at the wrong granularity.

## 6. Add the ワーク practice blocks

The workbook is 理科's practice layer. Find the workbook pages covering this 章
by their printed 教p.NN line — read it off the page, never infer it from the 章
title.

A `practice` block is **the only block type with no `page` field**, because its
pages are ワーク pages. It carries `workbookPage` and cites the textbook range
separately, so the two paginations can never be confused. TypeScript enforces
this: the renderer has to check for `page` before reading it.

**Where the book prints options, the item is answerable.** Give it `choices`
in the book's own order and `correct` as indices into them, and Leo picks and is
marked ○/×. `correct` is an array, so a すべて選びなさい question scores as one
item needing every right option. Split a multi-part question (a 「①〜③にあては
まる」) into one item per blank, all sharing the same `choices`.

**Never invent a distractor.** A made-up wrong answer teaches a made-up
distinction. If the book asks it open-ended, leave `choices` off and it renders
as a self-check reveal; a スケッチ or a 書きかえ carries no `answer` either and
renders no button at all.

The block scores itself from first answers, so it feeds progress the way a
widget does — no self-declared tick. It ticks only on a clean run.

**Every answer records the textbook page it was checked against**, and that
citation is shown to Leo.

Without the 解答 booklet you can only author pages whose textbook range is also
scanned, deriving each answer from the textbook. If you cannot derive it, leave
it out. **Never invent an answer.**

## 7. Register and verify

1. Add the section ids to `AUTHORED_SECTION_IDS` in `curriculum.ts`.
2. `npm run typecheck && npm run lint && npm run validate:content && npm run build`
3. **Drive it in a browser.** `npm start`, then click through the section: every
   widget, every reveal, every tick. `docs/math-interactivity.md` requires
   testing a widget by actually clicking it, and it keeps paying: driving the
   classification widget is what caught a solved run losing its tick to a later
   wrong replay.

Progress rules, if you touch them: a scored block **never downgrades** — once
solved it stays solved and the best score is kept — while a plain tick stays a
free toggle. The merge lives in `saveScienceBlockProgress`, and `SectionView`
applies the same merge to its own state, or a replay visibly loses the tick
until reload.

## 8. Update the docs

- `curriculum.ts` — page ranges you verified, `digitalUrl`s you captured
- `docs/lesson-plans/science/new-science-1/README.md` — mark the range ✓ verified
- `AGENTS.md` — only if something structural changed

## Traps worth knowing

- **Two books, two paginations.** Every `page` in `content/subjects/science/`
  means a 新編 新しい科学1 page. The workbook's own numbers are unrelated.
- **Titles repeat.** 「Before & After シート」 appears 17 times in this book,
  「学んだことをチェックしよう」 13 times. Page + title identifies an item;
  title alone does not.
- **The 89 動画 are not ours to reproduce.** Link out; a lesson may reference
  the moment.
- **Don't invent a reference.** Same rule as Geography's `sourceLabel`: set it
  from something real, or leave it empty. A dead link in front of Leo is worse
  than no link.
- **理科 is Leo-solo.** No teacher decks, no assign/review loop.
