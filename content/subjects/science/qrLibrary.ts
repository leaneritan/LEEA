import fs from "node:fs";
import path from "node:path";
import { scienceUnits } from "./curriculum";
import type { ScienceQrGroup, ScienceQrItem } from "./types";

const INDEX_PATH = path.join(
  process.cwd(),
  "docs/lesson-plans/science/new-science-1/qr-index.json"
);

/** The two groups that belong to the book rather than to any 単元. */
const COMMON = "common";
const APPENDIX = "appendix";

type RawItem = {
  no: number;
  page: number | null;
  title: string;
  kind: string;
  unit: number | string | null;
  // The index writes 章 numbers as strings ("1"), not numbers — reading it
  // as a number silently drops every numbered 章 into the common group.
  chapter?: { no: string | null; title: string | null } | null;
  url?: string | null;
};

/**
 * Which curriculum 章 an index item belongs to.
 *
 * The join is the publisher's own 単元 number plus 章 number — exactly the two
 * fields the index records — with 学習前 and 単元末 told apart by their title,
 * since both carry a null 章 number. Nothing here is guessed from a page range:
 * an item that does not name a 単元 lands in one of the two book-level groups
 * rather than being assigned to a chapter it might not be in.
 */
function chapterIdFor(item: RawItem): string {
  if (item.unit === "巻末資料") return APPENDIX;
  const unitNum = typeof item.unit === "number" ? String(item.unit) : null;
  if (!unitNum) return COMMON;

  const chapterNum = item.chapter?.no;
  if (chapterNum) return `u${unitNum}-c${chapterNum}`;

  const title = item.chapter?.title ?? "";
  if (title.includes("学習前")) return `u${unitNum}-intro`;
  if (title.includes("単元末")) return `u${unitNum}-matome`;
  return COMMON;
}

function readIndex(): RawItem[] {
  const raw = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8")) as { items: RawItem[] };
  return raw.items;
}

function toItem(raw: RawItem): ScienceQrItem {
  // A link is shown only where one was actually captured — the same rule the
  // chips follow. A dead link in front of Leo is worse than no link.
  return {
    no: raw.no,
    page: raw.page,
    title: raw.title,
    kind: raw.kind,
    ...(raw.url ? { url: raw.url } : {})
  };
}

/**
 * Server-only: every QR item grouped by 章, in the book's own order — the
 * 単元/章 spine first, then 教科共通コンテンツ and 巻末資料.
 */
export function loadScienceQrLibrary(): ScienceQrGroup[] {
  const byChapter = new Map<string, ScienceQrItem[]>();
  for (const raw of readIndex()) {
    const id = chapterIdFor(raw);
    const list = byChapter.get(id) ?? [];
    list.push(toItem(raw));
    byChapter.set(id, list);
  }

  const groups: ScienceQrGroup[] = [];
  for (const unit of scienceUnits) {
    for (const chapter of unit.chapters) {
      const items = byChapter.get(chapter.id);
      if (!items?.length) continue;
      groups.push({
        chapterId: chapter.id,
        unitNum: unit.num,
        title: chapter.num ? `第${chapter.num}章 ${chapter.title}` : chapter.title,
        items
      });
    }
  }
  for (const [id, title] of [[COMMON, "教科共通コンテンツ"], [APPENDIX, "巻末資料"]] as const) {
    const items = byChapter.get(id);
    if (items?.length) groups.push({ chapterId: id, unitNum: null, title, items });
  }
  return groups;
}

/**
 * Server-only: how many QR items each 章 has, keyed by chapter id. The home
 * page uses it to show that a 準備中 章 still has something behind it — the
 * publisher's videos and 練習 exist whether or not the section is written yet.
 */
export function loadScienceQrCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const raw of readIndex()) {
    if (!raw.url) continue;
    const id = chapterIdFor(raw);
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}
