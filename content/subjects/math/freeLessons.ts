// Registry for standalone "特別レッスン" (free lessons) — hand-authored HTML
// lessons on topics Leo struggles with, independent of the textbook's
// chapter/section flow. To add one: drop the HTML file at
// public/math-lessons/<id>.html and append an entry below.
export type MathFreeLesson = {
  id: string;
  title: string;
  tag?: string;
  embedPath: string;
};

export const mathFreeLessons: MathFreeLesson[] = [
  { id: "wariai-teika", title: "割合と定価 ―「◯割引き」のしくみ―", tag: "割合", embedPath: "/math-lessons/wariai-teika.html" }
];

export function getMathFreeLessonById(id: string) {
  return mathFreeLessons.find((lesson) => lesson.id === id);
}
