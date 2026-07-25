import type { MathGrade } from "./grades";

// Registry for standalone "特別レッスン" (special lessons) — hand-authored
// lessons on topics Leo struggles with, independent of the textbook's
// chapter/section flow. The count is unknown up front: topics, filter chips,
// counts, group colors, and badge numbers all derive from this list at
// runtime — never hardcode a fixed number of lessons, topics, or grades.
// To add one: append an entry below (and drop the HTML file at
// public/math-lessons/<id>.html + set embedPath once the content exists).

export type SpecialLessonStatus = "todo" | "now" | "done";

export type SpecialLessonPaletteEntry = { color: string; tint: string; dark: string };

// Topic colors cycle through this palette in first-seen order.
export const specialLessonPalette: SpecialLessonPaletteEntry[] = [
  { color: "#7a5aa6", tint: "#efe7f7", dark: "#5b3f86" },
  { color: "#c9804f", tint: "#f8e9dc", dark: "#a05c30" },
  { color: "#6aa564", tint: "#e8f1e6", dark: "#47793f" },
  { color: "#4d7fc0", tint: "#e5edf8", dark: "#31578c" },
  { color: "#3aa6a0", tint: "#e2f2f1", dark: "#20736e" },
  { color: "#d4708c", tint: "#f9e6ec", dark: "#a84763" }
];

export type SpecialLesson = {
  id: string;
  grade: MathGrade;
  topic: string;
  title: string;
  kind: string; // かいせつ / れんしゅう / ドリル / かいせつ＋問題 …
  meta: string; // 全 13 問 / 5分で読める …
  status: SpecialLessonStatus;
  order?: number;
  /** Set only once the lesson's standalone HTML exists at public/math-lessons/<id>.html. */
  embedPath?: string;
};

// 中1の特別レッスン。中2・中3は grade: "g2" / "g3" の行を足すだけで表示される。
export const specialLessons: SpecialLesson[] = [
  {
    id: "wariai-teika",
    grade: "g1",
    topic: "割合",
    title: "割合と定価 —「○割引き」のしくみ—",
    kind: "かいせつ",
    meta: "5分で読める",
    status: "done",
    embedPath: "/math-lessons/wariai-teika.html"
  },
  {
    id: "wariai-teika-step",
    grade: "g1",
    topic: "割合",
    title: "割合と定価 — ステップ学習で13問 —",
    kind: "れんしゅう",
    meta: "全 13 問",
    status: "now",
    embedPath: "/math-lessons/wariai-teika-step.html"
  },
  {
    id: "hyakubunritsu-buai",
    grade: "g1",
    topic: "割合",
    title: "百分率と歩合の言いかえ",
    kind: "れんしゅう",
    meta: "全 8 問",
    status: "todo"
  },
  {
    id: "bunsu-kakezan-warizan",
    grade: "g1",
    topic: "計算の基礎",
    title: "分数のかけ算・わり算 総ざらい",
    kind: "ドリル",
    meta: "全 20 問",
    status: "todo"
  },
  {
    id: "shosu-bunsu-ikiki",
    grade: "g1",
    topic: "計算の基礎",
    title: "小数と分数の行き来",
    kind: "ドリル",
    meta: "全 12 問",
    status: "todo"
  },
  {
    id: "taniryo-ookisa",
    grade: "g1",
    topic: "文章題",
    title: "単位量あたりの大きさ",
    kind: "かいせつ＋問題",
    meta: "全 6 問",
    status: "todo"
  }
];

export function getSpecialLessonById(id: string) {
  return specialLessons.find((lesson) => lesson.id === id);
}

export function getSpecialLessonsByGrade(grade: MathGrade | "all") {
  return grade === "all" ? specialLessons : specialLessons.filter((lesson) => lesson.grade === grade);
}

export type SpecialLessonGroup = {
  topic: string;
  palette: SpecialLessonPaletteEntry;
  lessons: SpecialLesson[];
};

/** Groups a lesson pool by topic, in first-seen order, assigning each topic a cycling palette color. */
export function groupSpecialLessonsByTopic(lessons: SpecialLesson[]): SpecialLessonGroup[] {
  const topics: string[] = [];
  lessons.forEach((lesson) => {
    if (!topics.includes(lesson.topic)) topics.push(lesson.topic);
  });
  return topics.map((topic, index) => ({
    topic,
    palette: specialLessonPalette[index % specialLessonPalette.length],
    lessons: lessons
      .filter((lesson) => lesson.topic === topic)
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }));
}
