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

export const mathFreeLessons: MathFreeLesson[] = [];

export function getMathFreeLessonById(id: string) {
  return mathFreeLessons.find((lesson) => lesson.id === id);
}
