# PDF Mapping — index.json and pdf_offset

How the lesson planner PDF is mapped to per-unit page ranges.

## Folder layout

```text
docs/lesson-plans/
  english/
    our-world/
      level-1/ … level-6/
        planner.pdf       Git LFS, ~60-70 MB
        index.json        page ranges per unit/component
        supporting/       student book, answer keys, audio scripts
    joyful-work/
      year-1/ year-2/ year-3/
    training-ground/
```

PDFs are tracked with Git LFS (`.gitattributes`). To add a PDF, clone locally, drop the file in, `git add` + `git push`. The GitHub web UI cannot handle 60+ MB uploads.

## index.json shape

```json
{
  "course": "Our World",
  "level": 4,
  "pdf": "planner.pdf",
  "units": {
    "u8": {
      "theme": "That's Really Interesting!",
      "pdf_offset": 259,
      "sections": {
        "opener":    "1-2",
        "vocab-1":   "3-6",
        "song":      "7-8",
        "grammar-1": "9-12",
        "vocab-2":   "13-14",
        "grammar-2": "15-16",
        "reading":   "17-20",
        "writing":   "21-23"
      }
    }
  },
  "checkpoints": {
    "r7-9": {
      "title": "Review 7-9",
      "pdf_offset": 0,
      "sections": {
        "review": "",
        "extra-reading": ""
      }
    }
  }
}
```

Use `checkpoints` for Review and Extra Reading pages that come after Units 1-3, 4-6, and 7-9. Do not store those ranges inside Unit 3, Unit 6, or Unit 9; they cover the whole band.

## Page math

Section page numbers in `index.json` are **1-indexed within the unit**. To get the absolute PDF page, add `pdf_offset`.

```text
absolute PDF page = section page + pdf_offset
```

Example for Unit 8:
- `opener: "1-2"` + offset 259 → PDF pages 260-261
- `grammar-1: "9-12"` + offset 259 → PDF pages 268-271
- `reading: "17-20"` + offset 259 → PDF pages 276-279

## Setting pdf_offset

For a new level, the page numbers under `sections` always stay 1-indexed within the unit. Only `pdf_offset` changes.

```text
pdf_offset = (PDF page where the unit's opener begins) - 1
```

To find that page: open the planner PDF, read the table of contents on the first few pages, find the printed page number for the unit. In NatGeo Our World Level 4 the book's printed page numbers match PDF page numbers exactly, so the TOC value is the answer. Other levels and courses may have front matter that shifts this — always verify by reading the candidate page and checking the unit number.

When `pdf_offset` is `0`, the section pages are already absolute. This happens when an index was first written against a per-unit excerpt PDF and never updated for the full level PDF.

## Reading PDF pages

Use the Read tool with the `pages` parameter, max 20 pages per call:

```text
Read /home/user/LEEA/docs/lesson-plans/english/our-world/level-4/planner.pdf
     pages: 260-263
```

Read both columns of each page — left column has teacher notes (objectives, vocabulary lists, grammar rule, academic language), right column has the student-facing content (grammar box, activities, song lyrics, reading text).

## Verifying after adding a PDF

1. Read PDF page 1 to confirm the file is the right level
2. Read the table of contents to confirm where each unit starts
3. Update `pdf_offset` for that unit (or all units)
4. Read the first page of one unit to confirm offset math is correct
5. Commit `index.json`
