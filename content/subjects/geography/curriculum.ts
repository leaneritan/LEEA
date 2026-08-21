import type { GeographyChapterMeta, GeographyField, GeographyFieldMeta } from "./types";

// Course spine for 中1 社会 — 地理的分野 and 歴史的分野.
//
// SOURCE NOTE: Leo's own 社会 textbooks have not been scanned into this repo
// yet (unlike 新しい数学1 under docs/lesson-plans/math). This spine follows the
// standard 中学校社会 chapter structure, and the one anchor we do have from
// real source material: the 古代文明マップ header reads 第2章 古代 ／ 第1節,
// which is why that map sits in h2 · 1節. Chapter titles, 節 names and their
// order are a scaffold — correct them against the real textbook when it is
// scanned, per AGENTS.md ("source scan comes before lesson generation").
// Everything downstream is data-driven, so fixing a name here fixes it
// everywhere; no component hardcodes a chapter or a count.

export const geographyFields: GeographyFieldMeta[] = [
  {
    key: "geography",
    label: "地理的分野",
    englishLabel: "Geography",
    blurb: "Where things are, and why they are there — continents, climate, land and people."
  },
  {
    key: "history",
    label: "歴史的分野",
    englishLabel: "History",
    blurb: "When things happened, and where — civilizations, states and the story of Japan."
  }
];

export const geographyChapters: GeographyChapterMeta[] = [
  /* ---------------- 地理的分野 ---------------- */
  {
    id: "g1",
    field: "geography",
    num: "第1章",
    title: "世界のすがた",
    subtitle: "六大陸と三大洋・緯度と経度・地球儀と地図",
    color: "#3aa6a0",
    tint: "#e2f2f1",
    dark: "#20736e",
    sections: [
      { id: "geo-g1-1", chapterId: "g1", number: 1, name: "1節 地球のすがた", status: "now", mapIds: ["sekai-no-sugata-map"] },
      { id: "geo-g1-2", chapterId: "g1", number: 2, name: "2節 世界の国々", status: "now", mapIds: ["sekai-no-kuniguni-map"] },
      { id: "geo-g1-3", chapterId: "g1", number: 3, name: "3節 緯度と経度・時差", status: "todo", mapIds: [] }
    ]
  },
  {
    id: "g2",
    field: "geography",
    num: "第2章",
    title: "日本のすがた",
    subtitle: "日本の位置・領域・都道府県",
    color: "#4d7fc0",
    tint: "#e5edf8",
    dark: "#31578c",
    sections: [
      { id: "geo-g2-1", chapterId: "g2", number: 1, name: "1節 日本の位置と領域", status: "todo", mapIds: [] },
      { id: "geo-g2-2", chapterId: "g2", number: 2, name: "2節 都道府県と地方区分", status: "todo", mapIds: [] }
    ]
  },
  {
    id: "g3",
    field: "geography",
    num: "第3章",
    title: "世界の人々の生活と環境",
    subtitle: "気候帯・暮らし・宗教",
    color: "#6aa564",
    tint: "#e8f1e6",
    dark: "#47793f",
    sections: [
      { id: "geo-g3-1", chapterId: "g3", number: 1, name: "1節 世界の気候帯", status: "todo", mapIds: ["kikoutai-map"] },
      { id: "geo-g3-2", chapterId: "g3", number: 2, name: "2節 暮らしと自然環境", status: "todo", mapIds: [] },
      { id: "geo-g3-3", chapterId: "g3", number: 3, name: "3節 世界の宗教", status: "todo", mapIds: [] }
    ]
  },
  {
    id: "g4",
    field: "geography",
    num: "第4章",
    title: "世界の諸地域",
    subtitle: "アジア・ヨーロッパ・アフリカ・南北アメリカ・オセアニア",
    color: "#a2628f",
    tint: "#f5e9f1",
    dark: "#7a4269",
    sections: [
      { id: "geo-g4-1", chapterId: "g4", number: 1, name: "1節 アジア州", status: "todo", mapIds: [] },
      { id: "geo-g4-2", chapterId: "g4", number: 2, name: "2節 ヨーロッパ州", status: "todo", mapIds: [] },
      { id: "geo-g4-3", chapterId: "g4", number: 3, name: "3節 アフリカ州", status: "todo", mapIds: [] },
      { id: "geo-g4-4", chapterId: "g4", number: 4, name: "4節 北アメリカ州・南アメリカ州", status: "todo", mapIds: [] },
      { id: "geo-g4-5", chapterId: "g4", number: 5, name: "5節 オセアニア州", status: "todo", mapIds: [] }
    ]
  },

  /* ---------------- 歴史的分野 ---------------- */
  {
    id: "h1",
    field: "history",
    num: "第1章",
    title: "歴史へのとびら",
    subtitle: "時代区分・年代の表し方",
    color: "#c9a227",
    tint: "#f8f0d8",
    dark: "#8f6f11",
    sections: [
      { id: "geo-h1-1", chapterId: "h1", number: 1, name: "1節 時代区分と年代の表し方", status: "todo", mapIds: [] }
    ]
  },
  {
    id: "h2",
    field: "history",
    num: "第2章",
    title: "古代までの日本",
    subtitle: "文明のおこり・日本の成り立ち・律令国家",
    color: "#c08b3a",
    tint: "#f8efdc",
    dark: "#8a5f1d",
    sections: [
      { id: "geo-h2-1", chapterId: "h2", number: 1, name: "1節 文明のおこりと日本の成り立ち", status: "now", mapIds: ["kodai-bunmei-map"] },
      { id: "geo-h2-2", chapterId: "h2", number: 2, name: "2節 古代国家の歩みと東アジア", status: "todo", mapIds: [] }
    ]
  },
  {
    id: "h3",
    field: "history",
    num: "第3章",
    title: "中世の日本",
    subtitle: "武士の登場・鎌倉・室町",
    color: "#b0703f",
    tint: "#f6e7db",
    dark: "#7f4a22",
    sections: [
      { id: "geo-h3-1", chapterId: "h3", number: 1, name: "1節 武士の政権の成立", status: "todo", mapIds: [] },
      { id: "geo-h3-2", chapterId: "h3", number: 2, name: "2節 ユーラシアの動きと武士の政治", status: "todo", mapIds: [] }
    ]
  },
  {
    id: "h4",
    field: "history",
    num: "第4章",
    title: "近世の日本",
    subtitle: "大航海時代・天下統一・江戸幕府",
    color: "#c9604f",
    tint: "#f8e5e1",
    dark: "#9c3f30",
    sections: [
      { id: "geo-h4-1", chapterId: "h4", number: 1, name: "1節 ヨーロッパ人との出会いと天下統一", status: "todo", mapIds: [] },
      { id: "geo-h4-2", chapterId: "h4", number: 2, name: "2節 江戸幕府の成立と鎖国", status: "todo", mapIds: [] },
      { id: "geo-h4-3", chapterId: "h4", number: 3, name: "3節 産業の発達と幕府政治の動き", status: "todo", mapIds: [] }
    ]
  },
  {
    id: "h5",
    field: "history",
    num: "第5章",
    title: "開国と近代日本の歩み",
    subtitle: "欧米の進出・明治維新・立憲国家",
    color: "#9c5a86",
    tint: "#f3e6ee",
    dark: "#713a5f",
    sections: [
      { id: "geo-h5-1", chapterId: "h5", number: 1, name: "1節 欧米の進出と日本の開国", status: "todo", mapIds: [] },
      { id: "geo-h5-2", chapterId: "h5", number: 2, name: "2節 明治維新", status: "todo", mapIds: [] },
      { id: "geo-h5-3", chapterId: "h5", number: 3, name: "3節 日清・日露戦争と近代産業", status: "todo", mapIds: [] }
    ]
  },
  {
    id: "h6",
    field: "history",
    num: "第6章",
    title: "二度の世界大戦と日本",
    subtitle: "第一次・第二次世界大戦",
    color: "#5f6f9c",
    tint: "#e7eaf4",
    dark: "#3f4c75",
    sections: [
      { id: "geo-h6-1", chapterId: "h6", number: 1, name: "1節 第一次世界大戦と民族独立の動き", status: "todo", mapIds: [] },
      { id: "geo-h6-2", chapterId: "h6", number: 2, name: "2節 第二次世界大戦と日本", status: "todo", mapIds: [] }
    ]
  },
  {
    id: "h7",
    field: "history",
    num: "第7章",
    title: "現代の日本と私たち",
    subtitle: "戦後改革・国際社会のなかの日本",
    color: "#5b8f8a",
    tint: "#e4efee",
    dark: "#396864",
    sections: [
      { id: "geo-h7-1", chapterId: "h7", number: 1, name: "1節 戦後の日本と国際社会", status: "todo", mapIds: [] }
    ]
  }
];

export function getGeographyChaptersByField(field: GeographyField) {
  return geographyChapters.filter((chapter) => chapter.field === field);
}

export function getGeographyChapterById(chapterId: string) {
  return geographyChapters.find((chapter) => chapter.id === chapterId);
}

export function getGeographySectionById(sectionId: string) {
  for (const chapter of geographyChapters) {
    const section = chapter.sections.find((entry) => entry.id === sectionId);
    if (section) return { chapter, section };
  }
  return null;
}

/** Where a map sits in the spine, so a map page can show its 章 / 節 context. */
export function getGeographyPlacementByMapId(mapId: string) {
  for (const chapter of geographyChapters) {
    const section = chapter.sections.find((entry) => entry.mapIds.includes(mapId));
    if (section) return { chapter, section };
  }
  return null;
}
