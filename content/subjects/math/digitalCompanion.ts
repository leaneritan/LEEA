// Page → anchor map for the textbook publisher's digital companion
// (東京書籍デジタル教科書『新編 新しい数学1』, sw111.tsho.jp). Each anchor
// entry's `page` is the first physical page it covers; a lookup page falls
// under the last anchor whose `page` is <= that page, up to the next
// anchor's page. Chapter 中2/中3 chapters have no companion yet.
type DigitalAnchor = { page: number; anchor: string };
type ChapterDigitalAnchors = { base: string; anchors: DigitalAnchor[] };

const CHAPTER_DIGITAL_ANCHORS: Record<string, ChapterDigitalAnchors> = {
  "0": {
    base: "https://sw111.tsho.jp/07jk/m/1/c/",
    anchors: [
      { page: 11, anchor: "01" },
      { page: 12, anchor: "02" },
      { page: 14, anchor: "03" },
      { page: 15, anchor: "04" },
      { page: 16, anchor: "05" },
      { page: 17, anchor: "06" },
      { page: 18, anchor: "07" }
    ]
  },
  "1": {
    base: "https://sw111.tsho.jp/07jk/m/1/d/",
    anchors: [
      { page: 20, anchor: "01" },
      { page: 25, anchor: "02" },
      { page: 27, anchor: "03" },
      { page: 28, anchor: "04" },
      { page: 29, anchor: "05" },
      { page: 30, anchor: "06" },
      { page: 31, anchor: "07" },
      { page: 32, anchor: "08" },
      { page: 33, anchor: "09" },
      { page: 34, anchor: "10" },
      { page: 35, anchor: "11" },
      { page: 36, anchor: "12" },
      { page: 38, anchor: "13" },
      { page: 39, anchor: "14" },
      { page: 40, anchor: "15" },
      { page: 41, anchor: "16" },
      { page: 42, anchor: "17" },
      { page: 43, anchor: "18" },
      { page: 45, anchor: "19" },
      { page: 46, anchor: "20" },
      { page: 47, anchor: "21" },
      { page: 49, anchor: "22" },
      { page: 50, anchor: "23" },
      { page: 51, anchor: "24" },
      { page: 52, anchor: "25" },
      { page: 53, anchor: "26" },
      { page: 54, anchor: "27" },
      { page: 56, anchor: "28" },
      { page: 57, anchor: "29" },
      { page: 58, anchor: "30" },
      { page: 60, anchor: "31" },
      { page: 61, anchor: "32" },
      { page: 62, anchor: "33" }
    ]
  },
  "2": {
    base: "https://sw111.tsho.jp/07jk/m/1/e/",
    anchors: [
      { page: 63, anchor: "01" },
      { page: 64, anchor: "02" },
      { page: 66, anchor: "03" },
      { page: 69, anchor: "04" },
      { page: 70, anchor: "05" },
      { page: 71, anchor: "06" },
      { page: 72, anchor: "07" },
      { page: 73, anchor: "08" },
      { page: 74, anchor: "09" },
      { page: 75, anchor: "10" },
      { page: 76, anchor: "11" },
      { page: 77, anchor: "12" },
      { page: 78, anchor: "13" },
      { page: 79, anchor: "14" },
      { page: 80, anchor: "15" },
      { page: 81, anchor: "16" },
      { page: 82, anchor: "17" },
      { page: 83, anchor: "18" },
      { page: 84, anchor: "19" },
      { page: 86, anchor: "20" },
      { page: 88, anchor: "21" },
      { page: 89, anchor: "22" },
      { page: 90, anchor: "23" }
    ]
  },
  "3": {
    base: "https://sw111.tsho.jp/07jk/m/1/f/",
    anchors: [
      { page: 92, anchor: "01" },
      { page: 95, anchor: "02" },
      { page: 96, anchor: "03" },
      { page: 97, anchor: "04" },
      { page: 98, anchor: "05" },
      { page: 99, anchor: "06" },
      { page: 100, anchor: "07" },
      { page: 102, anchor: "08" },
      { page: 103, anchor: "09" },
      { page: 104, anchor: "10" },
      { page: 105, anchor: "11" },
      { page: 106, anchor: "12" },
      { page: 108, anchor: "13" },
      { page: 109, anchor: "14" },
      { page: 110, anchor: "15" },
      { page: 111, anchor: "16" },
      { page: 112, anchor: "17" },
      { page: 114, anchor: "18" },
      { page: 115, anchor: "19" },
      { page: 116, anchor: "20" }
    ]
  },
  "4": {
    base: "https://sw111.tsho.jp/07jk/m/1/g/",
    anchors: [
      { page: 118, anchor: "01" },
      { page: 120, anchor: "02" },
      { page: 121, anchor: "03" },
      { page: 122, anchor: "04" },
      { page: 124, anchor: "05" },
      { page: 125, anchor: "06" },
      { page: 126, anchor: "07" },
      { page: 129, anchor: "08" },
      { page: 131, anchor: "09" },
      { page: 132, anchor: "10" },
      { page: 133, anchor: "11" },
      { page: 134, anchor: "12" },
      { page: 136, anchor: "13" },
      { page: 137, anchor: "14" },
      { page: 138, anchor: "15" },
      { page: 141, anchor: "16" },
      { page: 143, anchor: "17" },
      { page: 144, anchor: "18" },
      { page: 145, anchor: "19" },
      { page: 146, anchor: "20" },
      { page: 147, anchor: "21" },
      { page: 148, anchor: "22" },
      { page: 149, anchor: "23" },
      { page: 153, anchor: "24" },
      { page: 154, anchor: "25" },
      { page: 155, anchor: "26" },
      { page: 156, anchor: "27" }
    ]
  },
  "5": {
    base: "https://sw111.tsho.jp/07jk/m/1/h/",
    anchors: [
      { page: 157, anchor: "01" },
      { page: 158, anchor: "02" },
      { page: 160, anchor: "03" },
      { page: 162, anchor: "04" },
      { page: 164, anchor: "05" },
      { page: 166, anchor: "06" },
      { page: 167, anchor: "07" },
      { page: 168, anchor: "08" },
      { page: 169, anchor: "09" },
      { page: 171, anchor: "10" },
      { page: 172, anchor: "11" },
      { page: 173, anchor: "12" },
      { page: 174, anchor: "13" },
      { page: 175, anchor: "14" },
      { page: 176, anchor: "15" },
      { page: 177, anchor: "16" },
      { page: 178, anchor: "17" },
      { page: 179, anchor: "18" },
      { page: 180, anchor: "19" },
      { page: 181, anchor: "20" },
      { page: 183, anchor: "21" },
      { page: 185, anchor: "22" },
      { page: 186, anchor: "23" },
      { page: 188, anchor: "24" },
      { page: 189, anchor: "25" },
      { page: 190, anchor: "26" }
    ]
  },
  "6": {
    base: "https://sw111.tsho.jp/07jk/m/1/i/",
    anchors: [
      { page: 191, anchor: "01" },
      { page: 192, anchor: "02" },
      { page: 194, anchor: "03" },
      { page: 195, anchor: "04" },
      { page: 196, anchor: "05" },
      { page: 198, anchor: "06" },
      { page: 199, anchor: "07" },
      { page: 200, anchor: "08" },
      { page: 201, anchor: "09" },
      { page: 202, anchor: "10" },
      { page: 203, anchor: "11" },
      { page: 204, anchor: "12" },
      { page: 205, anchor: "13" },
      { page: 206, anchor: "14" },
      { page: 207, anchor: "15" },
      { page: 208, anchor: "16" },
      { page: 210, anchor: "17" },
      { page: 211, anchor: "18" },
      { page: 212, anchor: "19" },
      { page: 214, anchor: "20" },
      { page: 215, anchor: "21" },
      { page: 216, anchor: "22" },
      { page: 217, anchor: "23" },
      { page: 218, anchor: "24" },
      { page: 219, anchor: "25" },
      { page: 221, anchor: "26" },
      { page: 222, anchor: "27" },
      { page: 223, anchor: "28" },
      { page: 224, anchor: "29" }
    ]
  },
  "7": {
    base: "https://sw111.tsho.jp/07jk/m/1/j/",
    anchors: [
      { page: 226, anchor: "01" },
      { page: 228, anchor: "02" },
      { page: 230, anchor: "03" },
      { page: 232, anchor: "04" },
      { page: 235, anchor: "05" },
      { page: 236, anchor: "06" },
      { page: 237, anchor: "07" },
      { page: 238, anchor: "08" },
      { page: 240, anchor: "09" },
      { page: 242, anchor: "10" },
      { page: 245, anchor: "11" },
      { page: 246, anchor: "12" },
      { page: 247, anchor: "13" }
    ]
  }
};

/** Resolves a chapter + page (e.g. "124–125", "12") to its digital companion URL, if known. */
export function getDigitalCompanionUrl(chapterId: string, page: number | string | undefined): string | undefined {
  if (page === undefined) return undefined;
  const pageNum = typeof page === "number" ? page : parseInt(page, 10);
  if (!Number.isFinite(pageNum)) return undefined;

  const chapterEntry = CHAPTER_DIGITAL_ANCHORS[chapterId];
  if (!chapterEntry) return undefined;

  let matchedAnchor: string | undefined;
  for (const entry of chapterEntry.anchors) {
    if (entry.page > pageNum) break;
    matchedAnchor = entry.anchor;
  }
  return matchedAnchor ? `${chapterEntry.base}#${matchedAnchor}` : undefined;
}
