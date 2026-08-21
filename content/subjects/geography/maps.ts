// Registry for Geography maps — standalone, interactive HTML atlases Leo can
// explore on his own. Geography is a map-first subject: there is no textbook
// chapter/section spine like Math has, so everything on /geography derives
// from this list at runtime (topics, topic colours, counts, badge numbers).
// Never hardcode a fixed number of maps or topics in the UI.
//
// To add a map: drop the standalone HTML at public/geography/<id>.html, then
// append an entry below with `embedPath` set. Leave `embedPath` off while the
// map is still being built — the viewer shows a "coming soon" card instead of
// a broken frame.

export type GeographyMapStatus = "todo" | "now" | "done";

export type GeographyPaletteEntry = { color: string; tint: string; dark: string };

// Topic colours cycle through this palette in first-seen order.
export const geographyPalette: GeographyPaletteEntry[] = [
  { color: "#c08b3a", tint: "#f8efdc", dark: "#8a5f1d" },
  { color: "#3aa6a0", tint: "#e2f2f1", dark: "#20736e" },
  { color: "#4d7fc0", tint: "#e5edf8", dark: "#31578c" },
  { color: "#a2628f", tint: "#f5e9f1", dark: "#7a4269" },
  { color: "#6aa564", tint: "#e8f1e6", dark: "#47793f" },
  { color: "#c9604f", tint: "#f8e5e1", dark: "#9c3f30" }
];

export type GeographyMap = {
  id: string;
  /** Topic group shown on /geography. New topics appear automatically. */
  topic: string;
  /** English label for the topic group — main navigation stays English. */
  topicLabel: string;
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
  status: GeographyMapStatus;
  order?: number;
  /** Set only once the standalone HTML exists at public/geography/<id>.html. */
  embedPath?: string;
};

export const geographyMaps: GeographyMap[] = [
  {
    id: "kodai-bunmei-map",
    topic: "古代文明",
    topicLabel: "Ancient Civilizations",
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
    status: "now",
    order: 1,
    embedPath: "/geography/kodai-bunmei-map.html"
  }
];

export function getGeographyMapById(id: string) {
  return geographyMaps.find((map) => map.id === id);
}

export type GeographyMapGroup = {
  topic: string;
  topicLabel: string;
  palette: GeographyPaletteEntry;
  maps: GeographyMap[];
};

/** Groups maps by topic, in first-seen order, giving each topic a cycling palette colour. */
export function groupGeographyMapsByTopic(maps: GeographyMap[]): GeographyMapGroup[] {
  const topics: string[] = [];
  maps.forEach((map) => {
    if (!topics.includes(map.topic)) topics.push(map.topic);
  });
  return topics.map((topic, index) => ({
    topic,
    topicLabel: maps.find((map) => map.topic === topic)?.topicLabel ?? topic,
    palette: geographyPalette[index % geographyPalette.length],
    maps: maps
      .filter((map) => map.topic === topic)
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }));
}
