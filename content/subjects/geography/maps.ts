// Registry of Geography maps.
//
// Geography is Leo-support, not a taught course: there are no teacher slides
// and no 章/節 spine mirroring English. Every map lives on one page and Leo
// switches between them with a button, so this flat list is the whole model.
//
// To add a map:
//   1. Drop the standalone HTML at public/geography/<id>.html, built on the
//      shared components (/components/world-map.js, world-countries.js).
//   2. Add an entry below with buildStatus "live" and embedPath set.
// Register with buildStatus "planned" and no embedPath to show it as upcoming;
// the page then renders a "map file needed" card instead of a broken frame.

/** Which half of 社会 a map belongs to — used only to label and order buttons. */
export type GeographyField = "geography" | "history";

export type GeographyMapBuildStatus = "planned" | "live";

export type GeographyMap = {
  id: string;
  field: GeographyField;
  title: string;
  /** Japanese title, shown as learning content under the English title. */
  jpTitle: string;
  /** Short Japanese title — this is what the switcher button shows. */
  jpShortTitle: string;
  /**
   * Where the material comes from. Only set this from something real: the
   * 古代文明マップ carries 第2章 古代 ／ 第1節 because its own header says so.
   * Leave it off rather than inventing a textbook reference.
   */
  sourceLabel?: string;
  /** Short "what's inside" line, e.g. "11 places · 10 quiz questions". */
  meta: string;
  summary: string;
  buildStatus: GeographyMapBuildStatus;
  /** How many questions the map's quiz has, when it has one. */
  quizTotal?: number;
  /** Set only once the standalone HTML exists at public/geography/<id>.html. */
  embedPath?: string;
};

export const geographyFieldLabels: Record<GeographyField, { en: string; jp: string }> = {
  geography: { en: "Geography", jp: "地理" },
  history: { en: "History", jp: "歴史" }
};

export const geographyMaps: GeographyMap[] = [
  {
    id: "sekai-no-sugata-map",
    field: "geography",
    title: "The Shape of the World",
    jpTitle: "世界のすがた — 六大陸と三大洋",
    jpShortTitle: "世界のすがた",
    meta: "6 continents · 3 oceans · 10 quiz questions",
    summary:
      "Name the six continents and three oceans, switch on the equator, the tropics and the grid, and read any point's latitude and longitude straight off the map.",
    buildStatus: "live",
    quizTotal: 10,
    embedPath: "/geography/sekai-no-sugata-map.html"
  },
  {
    id: "sekai-no-kuniguni-map",
    field: "geography",
    title: "Countries of the World",
    jpTitle: "世界の国々 — 国の名前と位置",
    jpShortTitle: "世界の国々",
    meta: "177 countries · 25 to learn first · 10 quiz questions",
    summary:
      "Click any country for its Japanese and English name, capital, 州, area and land neighbours. Filter by 州, search by name, and test yourself on the 25 worth learning first.",
    buildStatus: "live",
    quizTotal: 10,
    embedPath: "/geography/sekai-no-kuniguni-map.html"
  },
  {
    id: "kikoutai-map",
    field: "geography",
    title: "World Climate Zones",
    jpTitle: "気候帯マップ — 世界の気候と暮らし",
    jpShortTitle: "気候帯マップ",
    meta: "5 climate zones",
    summary: "Shade the world by climate zone, from 熱帯 to 寒帯, and see how the bands follow latitude — and where they don't.",
    buildStatus: "planned"
  },
  {
    id: "kodai-bunmei-map",
    field: "history",
    title: "Ancient Civilizations Map",
    jpTitle: "古代文明マップ — 文明はどこで生まれた？",
    jpShortTitle: "古代文明マップ",
    sourceLabel: "第2章 古代 ／ 第1節",
    meta: "11 places · 10 quiz questions",
    summary:
      "Drag the year slider from 4000 BCE onward and watch each civilization appear where and when it began. Tap a marker for its story, then try the quiz.",
    buildStatus: "live",
    quizTotal: 10,
    embedPath: "/geography/kodai-bunmei-map.html"
  }
];

export function getGeographyMapById(id: string) {
  return geographyMaps.find((map) => map.id === id);
}

export function isGeographyMapReady(map: GeographyMap) {
  return map.buildStatus === "live" && Boolean(map.embedPath);
}

/** The map the page opens on when none is named in the URL. */
export function getDefaultGeographyMap() {
  return geographyMaps.find(isGeographyMapReady) ?? geographyMaps[0];
}
