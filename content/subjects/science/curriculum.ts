import type { ScienceChapterMeta, ScienceSectionMeta, ScienceUnitMeta } from "./types";

/**
 * 新編 新しい科学1 (東京書籍, 中1) — the 単元 / 章 / 節 spine.
 *
 * Structure and page ranges come from the publisher's QR コンテンツ一覧
 * (`docs/lesson-plans/science/new-science-1/qr-index.json`). Ranges outside
 * 単元1 第1章 are derived from QR anchor pages rather than read off the printed
 * folios, because those scans are not in yet — see the README in that folder.
 * Correct them against the book when each chapter's scan arrives; do not treat
 * them as verified.
 *
 * Only sections listed in `scienceSectionIsAuthored` have content behind them.
 * The rest render a 準備中 card, the same way math handles unauthored 節.
 *
 * `digitalUrl` values are the publisher's own section addresses, captured from
 * the portal and recorded in `qr-index.json`'s `chapters` map — never derived.
 * Worth noting how easily they could have been got wrong: the scheme is
 * `…/r/1/<letter>/#<NN>`, a sibling of math's `…/m/1/<letter>/#<NN>`, but the
 * letter here selects the 単元 where math's selects the 章. All three sections
 * of 第1章 share one address because the portal has no finer anchor.
 */

const UNIT_1_CHAPTERS: ScienceChapterMeta[] = [
  {
    id: "u1-intro",
    unitId: "u1",
    num: null,
    title: "学習前",
    subtitle: "この単元で学ぶこと",
    pages: "p.10–12",
    sections: [
      {
        id: "sci-u1-intro-1",
        chapterId: "u1-intro",
        number: 1,
        name: "いろいろな生物とその共通点",
        pages: "p.10–12",
        status: "now",
        kicker: "学習前",
        digitalUrl: "https://sw121.tsho.jp/07jk/r/1/a/#01"
      }
    ]
  },
  {
    id: "u1-c1",
    unitId: "u1",
    num: "1",
    title: "生物の観察と分類のしかた",
    subtitle: "身近な生物を観察して特徴を見つけて分類しよう",
    pages: "p.13–26",
    sections: [
      {
        id: "sci-u1-c1-1",
        chapterId: "u1-c1",
        number: 1,
        name: "生物の観察",
        // Opens at p.14 rather than the 節's own p.16: the 身近に見られる
        // 植物 / 動物 図鑑 pages are chapter-level, and the observation work
        // sends Leo back to them, so they live at the top of this section.
        pages: "p.14–21",
        status: "now",
        digitalUrl: "https://sw121.tsho.jp/07jk/r/1/a/#02"
      },
      {
        id: "sci-u1-c1-2",
        chapterId: "u1-c1",
        number: 2,
        name: "生物の特徴と分類",
        pages: "p.22–25",
        status: "todo",
        digitalUrl: "https://sw121.tsho.jp/07jk/r/1/a/#02"
      },
      {
        id: "sci-u1-c1-matome",
        chapterId: "u1-c1",
        number: 3,
        name: "学んだことをチェックしよう",
        pages: "p.26",
        status: "todo",
        kicker: "章末",
        digitalUrl: "https://sw121.tsho.jp/07jk/r/1/a/#02"
      }
    ]
  },
  {
    id: "u1-c2",
    unitId: "u1",
    num: "2",
    title: "植物の分類",
    subtitle: "植物をその特徴によりいくつかのグループに分類しよう",
    pages: "p.27–44",
    sections: []
  },
  {
    id: "u1-c3",
    unitId: "u1",
    num: "3",
    title: "動物の分類",
    subtitle: "動物をその特徴によりいくつかのグループに分類しよう",
    pages: "p.45–62",
    sections: []
  },
  {
    id: "u1-matome",
    unitId: "u1",
    num: null,
    title: "単元末",
    subtitle: "学習内容の整理と確かめ問題",
    pages: "p.65–69",
    sections: []
  }
];

export const scienceUnits: ScienceUnitMeta[] = [
  {
    id: "u1",
    num: "1",
    title: "いろいろな生物とその共通点",
    color: "#4a9d6e",
    tint: "#eaf5ee",
    dark: "#2f6b49",
    chapters: UNIT_1_CHAPTERS
  },
  {
    id: "u2",
    num: "2",
    title: "身のまわりの物質",
    color: "#c9804f",
    tint: "#faf0e6",
    dark: "#8a5230",
    chapters: [
      { id: "u2-intro", unitId: "u2", num: null, title: "学習前", subtitle: "この単元で学ぶこと", pages: "p.70–72", sections: [] },
      { id: "u2-c1", unitId: "u2", num: "1", title: "身のまわりの物質とその性質", subtitle: "金属と非金属、密度", pages: "p.73–90", sections: [] },
      { id: "u2-c2", unitId: "u2", num: "2", title: "気体の性質", subtitle: "気体の集め方と見分け方", pages: "p.91–100", sections: [] },
      { id: "u2-c3", unitId: "u2", num: "3", title: "水溶液の性質", subtitle: "とけ方、濃度、溶解度", pages: "p.101–114", sections: [] },
      { id: "u2-c4", unitId: "u2", num: "4", title: "物質の姿と状態変化", subtitle: "融点・沸点と粒子の運動", pages: "p.115–131", sections: [] },
      { id: "u2-matome", unitId: "u2", num: null, title: "単元末", subtitle: "学習内容の整理と確かめ問題", pages: "p.133–137", sections: [] }
    ]
  },
  {
    id: "u3",
    num: "3",
    title: "身のまわりの現象",
    color: "#5b7fc7",
    tint: "#eaf0fb",
    dark: "#3a558c",
    chapters: [
      { id: "u3-intro", unitId: "u3", num: null, title: "学習前", subtitle: "この単元で学ぶこと", pages: "p.138–140", sections: [] },
      { id: "u3-c1", unitId: "u3", num: "1", title: "光の世界", subtitle: "反射、屈折、凸レンズ", pages: "p.141–158", sections: [] },
      { id: "u3-c2", unitId: "u3", num: "2", title: "音の世界", subtitle: "振動と音の大きさ・高さ", pages: "p.159–166", sections: [] },
      { id: "u3-c3", unitId: "u3", num: "3", title: "力の世界", subtitle: "力の大きさとばね、力のつり合い", pages: "p.167–181", sections: [] },
      { id: "u3-matome", unitId: "u3", num: null, title: "単元末", subtitle: "学習内容の整理と確かめ問題", pages: "p.183–187", sections: [] }
    ]
  },
  {
    id: "u4",
    num: "4",
    title: "大地の変化",
    color: "#b06a8f",
    tint: "#f8ecf3",
    dark: "#7c4462",
    chapters: [
      { id: "u4-intro", unitId: "u4", num: null, title: "学習前", subtitle: "この単元で学ぶこと", pages: "p.188–192", sections: [] },
      { id: "u4-c1", unitId: "u4", num: "1", title: "火をふく大地", subtitle: "火山と火成岩", pages: "p.193–206", sections: [] },
      { id: "u4-c2", unitId: "u4", num: "2", title: "動き続ける大地", subtitle: "地震と大地の動き", pages: "p.207–218", sections: [] },
      { id: "u4-c3", unitId: "u4", num: "3", title: "地層から読みとる大地の変化", subtitle: "堆積岩と地層", pages: "p.219–235", sections: [] },
      { id: "u4-matome", unitId: "u4", num: null, title: "単元末", subtitle: "学習内容の整理と確かめ問題", pages: "p.237–241", sections: [] }
    ]
  }
];

/** Section ids that have a JSON file behind them. Everything else is 準備中. */
const AUTHORED_SECTION_IDS = new Set([
  "sci-u1-intro-1",
  "sci-u1-c1-1",
  "sci-u1-c1-2",
  "sci-u1-c1-matome"
]);

export function scienceSectionIsAuthored(sectionId: string) {
  return AUTHORED_SECTION_IDS.has(sectionId);
}

export const scienceChapters: ScienceChapterMeta[] = scienceUnits.flatMap((unit) => unit.chapters);

export function getScienceUnit(unitId: string) {
  return scienceUnits.find((unit) => unit.id === unitId);
}

export function getScienceChapter(chapterId: string) {
  return scienceChapters.find((chapter) => chapter.id === chapterId);
}

/** The unit a chapter belongs to — chapters carry the colour tokens of their unit. */
export function getUnitForChapter(chapterId: string) {
  return scienceUnits.find((unit) => unit.chapters.some((chapter) => chapter.id === chapterId));
}

export function getScienceSectionMeta(chapterId: string, sectionId: string) {
  return getScienceChapter(chapterId)?.sections.find((section) => section.id === sectionId);
}

/** Every section in book order, so prev/next can cross chapter and unit boundaries. */
export function getScienceSectionsInOrder(): ScienceSectionMeta[] {
  return scienceUnits.flatMap((unit) => unit.chapters.flatMap((chapter) => chapter.sections));
}

export function getAdjacentSections(sectionId: string) {
  const ordered = getScienceSectionsInOrder();
  const index = ordered.findIndex((section) => section.id === sectionId);
  if (index === -1) return { prev: undefined, next: undefined };
  return { prev: ordered[index - 1], next: ordered[index + 1] };
}
