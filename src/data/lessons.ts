import unit8Opener from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/opener.json";
import type { Lesson } from "./types";

export const lessons: Lesson[] = [unit8Opener as Lesson];

export function getLessonById(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}
