# science-chapter

Build one 章 of 新編 新しい科学1 (中1 理科) into LEEA: verify the scan, author the
節 as block JSON, build or reuse the QR-flagged widgets, link the chips, add the
ワーク practice, register and verify.

## Usage

```
/science-chapter <unit> <chapter>
```

Examples:

```
/science-chapter 1 2      # 単元1 第2章 植物の分類 (教科書 p.27–44)
/science-chapter 2 3      # 単元2 第3章 水溶液の性質 (教科書 p.101–114)
/science-chapter 1 matome # 単元1 単元末
```

`<chapter>` is the 章 number, or `intro` / `matome` for 学習前 / 単元末. The
spine, ids and page ranges are in `content/subjects/science/curriculum.ts`.

## What to do

Follow **`docs/science-chapter.md`** start to finish — it is the complete,
self-contained workflow (what inputs are needed, verifying the scan's folios,
the block vocabulary, the widget families to reuse before building anything new,
chip linking, the ワーク practice layer, registration, verification and the
traps). This command file is just the Claude Code entry point; the doc is
written to be followable by any coding agent, so it is also what to hand to
Jules or another agent for this task.

## Before you start

**The textbook scan for the 章 must be in the repo.** Without it, stop and say
so — the QR index gives titles and pages, not content, and a 章 cannot be
authored from it.

Check `docs/lesson-plans/science/new-science-1/scans/` for what is present. Only
`unit1-ch1_p10-26.pdf` and the front matter were in at the time of writing.

> **Naming note:** this is the **chapter-level** builder — one 章 of the
> textbook, end to end. Widgets are built inside it rather than by a separate
> skill, because 理科 has only ~6 widgets in the whole book and they are chosen
> by reuse against the family table, not one per lesson component the way
> English's `/vocab-app` and `/grammar-app` are.
