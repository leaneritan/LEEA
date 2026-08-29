// Registry of History (歴史) materials.
//
// History follows Geography's shape, for the same reason: it is Leo-support,
// not a taught course. One page, one material, a button row to switch. No
// teacher decks, no assign/review loop, no 章/節 spine.
//
// To add a material:
//   1. Drop the standalone HTML at public/history/<id>.html.
//   2. Add an entry below with buildStatus "live" and embedPath set.
// Register with buildStatus "planned" and no embedPath to show it as upcoming;
// the page then renders a "file needed" card instead of a broken frame.

/**
 * What kind of thing a material is. It only decides how the card reads — a
 * reference is something Leo looks things up in, an activity is something he
 * works through.
 */
export type HistoryMaterialKind = "reference" | "activity";

export type HistoryMaterialBuildStatus = "planned" | "live";

export type HistoryMaterial = {
  id: string;
  kind: HistoryMaterialKind;
  title: string;
  /** Japanese title, shown as learning content under the English title. */
  jpTitle: string;
  /** Short Japanese title — this is what the switcher button shows. */
  jpShortTitle: string;
  /**
   * Where the material comes from. Set it only from something real — the
   * 巻末年表 carries its publisher because the chart is served from
   * 帝国書院's own QR content. Leave it off rather than inventing a reference.
   */
  sourceLabel?: string;
  /** Short "what's inside" line, e.g. "旧石器時代〜現代 · 一枚もの". */
  meta: string;
  summary: string;
  buildStatus: HistoryMaterialBuildStatus;
  /** Set only once the standalone HTML exists at public/history/<id>.html. */
  embedPath?: string;
};

export const historyMaterialKindLabels: Record<HistoryMaterialKind, { en: string; jp: string }> = {
  reference: { en: "Reference", jp: "資料" },
  activity: { en: "Activity", jp: "学習" }
};

export const historyMaterials: HistoryMaterial[] = [
  {
    id: "nenpyou-viewer",
    kind: "reference",
    title: "Chronology Chart",
    jpTitle: "巻末年表 — 旧石器時代から現代まで",
    jpShortTitle: "巻末年表",
    sourceLabel: "帝国書院 中学社会科用QRコンテンツ「巻末年表」",
    meta: "旧石器時代〜現代 · 一枚もの",
    summary:
      "The whole span of Japanese and world history on one wide chart. Drag to move along it, zoom in on a century, and use the slider to travel from the oldest end to the newest.",
    buildStatus: "live",
    embedPath: "/history/nenpyou-viewer.html"
  }
];

export function getHistoryMaterialById(id: string) {
  return historyMaterials.find((material) => material.id === id);
}

export function isHistoryMaterialReady(material: HistoryMaterial) {
  return material.buildStatus === "live" && Boolean(material.embedPath);
}

/** The material the page opens on when none is named in the URL. */
export function getDefaultHistoryMaterial() {
  return historyMaterials.find(isHistoryMaterialReady) ?? historyMaterials[0];
}
