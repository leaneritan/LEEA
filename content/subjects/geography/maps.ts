// Registry of Geography maps — standalone, interactive HTML atlases.
//
// Placement is NOT stored here. A map belongs to a 節 because that 節 lists
// its id in `mapIds` (see curriculum.ts), so there is exactly one place to
// edit when a map moves. Use `getGeographyPlacementByMapId` to look up a
// map's 章 / 節.
//
// To add a map:
//   1. Drop the standalone HTML at public/geography/<id>.html.
//   2. Add an entry below with buildStatus "live" and embedPath set.
//   3. Add its id to the owning 節's `mapIds` in curriculum.ts.
// Register a map with buildStatus "planned" (no embedPath) to show it in the
// course as upcoming work — the viewer then shows a "map file needed" card
// instead of a broken frame.

import { geographyChapters } from "./curriculum";

export type GeographyMapBuildStatus = "planned" | "live";

export type GeographyMap = {
  id: string;
  title: string;
  /** Japanese title, shown as learning content under the English title. */
  jpTitle: string;
  /** Short Japanese title for the card's cover panel, where space is tight. */
  jpShortTitle: string;
  /** Where the material comes from, e.g. a textbook chapter. */
  sourceLabel: string;
  kind: string;
  /** Short "what's inside" line, e.g. "11 places · 10 quiz questions". */
  meta: string;
  summary: string;
  jpSummary: string;
  /** Layers/filters the map offers, used as chips on the card. */
  layers: string[];
  buildStatus: GeographyMapBuildStatus;
  /**
   * How many quiz questions the map's quiz has, when it has one. Used to show
   * a real score out of a real total without the app having to guess.
   */
  quizTotal?: number;
  /** Set only once the standalone HTML exists at public/geography/<id>.html. */
  embedPath?: string;
};

export const geographyMaps: GeographyMap[] = [
  {
    id: "kodai-bunmei-map",
    title: "Ancient Civilizations Map",
    jpTitle: "古代文明マップ — 文明はどこで生まれた？",
    jpShortTitle: "古代文明マップ",
    sourceLabel: "第2章 古代 ／ 第1節",
    kind: "Interactive map",
    meta: "11 places · 10 quiz questions",
    summary:
      "Drag the year slider from 4000 BCE onward and watch each civilization appear where and when it began. Tap a marker for its story, then try the quiz.",
    jpSummary:
      "スライダーを動かすと、その年までに生まれた文明があらわれます。地図の印をクリックすると、くわしい内容が出てきます。",
    layers: ["四大文明", "ギリシャ・ローマ", "三大宗教", "日本列島", "シルクロード", "今の国境"],
    buildStatus: "live",
    quizTotal: 10,
    embedPath: "/geography/kodai-bunmei-map.html"
  },
  {
    id: "sekai-no-sugata-map",
    title: "The Shape of the World",
    jpTitle: "世界のすがた — 六大陸と三大洋",
    jpShortTitle: "世界のすがた",
    sourceLabel: "地理 第1章 ／ 第1節",
    kind: "Interactive map",
    meta: "6 continents · 3 oceans · 10 quiz questions",
    summary:
      "Name the six continents and three oceans, switch on the equator, the tropics and the grid, and read any point's latitude and longitude straight off the map.",
    jpSummary:
      "六大陸と三大洋をおぼえよう。赤道や回帰線、緯線・経線を表示して、地図の上の点の緯度・経度を読みとろう。",
    layers: ["六大陸", "三大洋", "赤道・回帰線", "緯線・経線", "州の区分"],
    buildStatus: "live",
    quizTotal: 10,
    embedPath: "/geography/sekai-no-sugata-map.html"
  },
  {
    id: "sekai-no-kuniguni-map",
    title: "Countries of the World",
    jpTitle: "世界の国々 — 国の名前と位置",
    jpShortTitle: "世界の国々",
    sourceLabel: "地理 第1章 ／ 第2節",
    kind: "Interactive map",
    meta: "177 countries · 25 to learn first · 10 quiz questions",
    summary:
      "Click any country for its Japanese and English name, capital, 州, area and land neighbours — then jump straight to a neighbour. Filter by 州, search by name, and test yourself on the 25 countries worth learning first.",
    jpSummary:
      "国をクリックすると、日本語名・英語名・首都・州・面積・となりの国が分かります。州でしぼりこんだり、名前で検索したりできます。",
    layers: ["アジア州", "ヨーロッパ州", "アフリカ州", "北アメリカ州", "南アメリカ州", "オセアニア州"],
    buildStatus: "live",
    quizTotal: 10,
    embedPath: "/geography/sekai-no-kuniguni-map.html"
  },
  {
    id: "kikoutai-map",
    title: "World Climate Zones",
    jpTitle: "気候帯マップ — 世界の気候と暮らし",
    jpShortTitle: "気候帯マップ",
    sourceLabel: "地理 第3章 ／ 第1節",
    kind: "Interactive map",
    meta: "5 climate zones",
    summary:
      "Shade the world by climate zone, from 熱帯 to 寒帯, and see how the bands follow latitude — and where they don't.",
    jpSummary: "世界を気候帯でぬり分けて、緯度とのつながりを見てみよう。",
    layers: ["熱帯", "乾燥帯", "温帯", "亜寒帯", "寒帯"],
    buildStatus: "planned"
  }
];

export function getGeographyMapById(id: string) {
  return geographyMaps.find((map) => map.id === id);
}

export function getGeographyMapsByIds(ids: string[]) {
  return ids.map((id) => getGeographyMapById(id)).filter((map): map is GeographyMap => Boolean(map));
}

export function isGeographyMapReady(map: GeographyMap) {
  return map.buildStatus === "live" && Boolean(map.embedPath);
}

/**
 * Maps that exist in this registry but that no 節 claims. Should always be
 * empty — the course home surfaces any stragglers rather than dropping them
 * silently, so a missing `mapIds` entry is visible instead of invisible.
 */
export function getUnplacedGeographyMaps() {
  const placed = new Set(geographyChapters.flatMap((chapter) => chapter.sections.flatMap((section) => section.mapIds)));
  return geographyMaps.filter((map) => !placed.has(map.id));
}
