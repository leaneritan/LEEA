/** 社会 has two 分野 in 中1: 地理的分野 and 歴史的分野. */
export type GeographyField = "geography" | "history";

export type GeographyStatus = "done" | "now" | "todo";

export type GeographySectionMeta = {
  /** Stable id, e.g. "geo-h2-1". Used as the progress key namespace. */
  id: string;
  chapterId: string;
  number: number;
  /** Full 節 label as it reads in the textbook, e.g. "1節 文明のおこりと日本の成り立ち". */
  name: string;
  status: GeographyStatus;
  /**
   * Ids from `geographyMaps` that belong to this 節, in teaching order.
   * Empty until a map has been built for it — the UI renders those 節 as
   * planned rows rather than hiding them, so the shape of the course is
   * visible from the start.
   */
  mapIds: string[];
};

export type GeographyChapterMeta = {
  /** Short id used in the URL, e.g. "h2" or "g1". Must never be "map". */
  id: string;
  field: GeographyField;
  /** Chapter label, e.g. "第2章". */
  num: string;
  title: string;
  subtitle: string;
  color: string;
  tint: string;
  dark: string;
  sections: GeographySectionMeta[];
};

export type GeographyFieldMeta = {
  key: GeographyField;
  /** Japanese label used on the 分野 switch. */
  label: string;
  /** English label — main navigation and headings stay English. */
  englishLabel: string;
  blurb: string;
};
