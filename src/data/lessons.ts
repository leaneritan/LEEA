import unit8Opener from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/opener.json";
import unit8OpenerLearner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/opener-learner.json";
import unit8Vocab1 from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/vocab1.json";
import unit8Vocab1Learner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/vocab1-learner.json";
import unit8Song from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/song.json";
import unit8SongLearner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/song-learner.json";
import unit8Grammar1 from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/grammar1.json";
import unit8Grammar1Learner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/grammar1-learner.json";
import type { Lesson } from "./types";

export const lessons: Lesson[] = [
  unit8Opener as Lesson,
  unit8OpenerLearner as Lesson,
  unit8Vocab1 as Lesson,
  unit8Vocab1Learner as Lesson,
  unit8Song as Lesson,
  unit8SongLearner as Lesson,
  unit8Grammar1 as Lesson,
  unit8Grammar1Learner as Lesson
];
export const teacherLessons = lessons.filter((lesson) => lesson.mode === "teacher");
export const learnerLessons = lessons.filter((lesson) => lesson.mode === "learner");

export type LessonGroup = {
  id: string;
  course: Lesson["course"];
  courseLabel: string;
  level?: number;
  unit?: number;
  lessons: Lesson[];
};

export function getLessonById(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}

export function getLessonGroupId(lesson: Pick<Lesson, "course" | "level" | "unit">) {
  return `${lesson.course}-l${lesson.level ?? "na"}-u${lesson.unit ?? "na"}`;
}

export function getCourseLabel(course: Lesson["course"]) {
  if (course === "our-world") return "Our World";
  if (course === "joyful-work") return "Joyful Work";
  return "Training Ground";
}

export function getLessonGroups(items: Lesson[] = lessons) {
  const groups = items.reduce<Record<string, LessonGroup>>((current, lesson) => {
    const id = getLessonGroupId(lesson);
    const existing = current[id];

    if (existing) {
      existing.lessons.push(lesson);
      return current;
    }

    current[id] = {
      id,
      course: lesson.course,
      courseLabel: getCourseLabel(lesson.course),
      level: lesson.level,
      unit: lesson.unit,
      lessons: [lesson]
    };
    return current;
  }, {});

  return Object.values(groups);
}

export function getCurrentFocusLessons(courseId: Lesson["course"], level: number, unit: number) {
  return lessons.filter((lesson) => lesson.course === courseId && lesson.level === level && lesson.unit === unit);
}
