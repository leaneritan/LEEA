import unit7Opener from "../../content/subjects/english/courses/our-world/level-4/unit-7/lessons/opener.teacher.json";
import unit7OpenerLearner from "../../content/subjects/english/courses/our-world/level-4/unit-7/lessons/opener.learner.json";
import unit9Opener from "../../content/subjects/english/courses/our-world/level-4/unit-9/lessons/opener.teacher.json";
import unit9OpenerLearner from "../../content/subjects/english/courses/our-world/level-4/unit-9/lessons/opener.learner.json";
import unit9Vocab1 from "../../content/subjects/english/courses/our-world/level-4/unit-9/lessons/vocab1.teacher.json";
import unit9Vocab1Learner from "../../content/subjects/english/courses/our-world/level-4/unit-9/lessons/vocab1.learner.json";
import unit9Song from "../../content/subjects/english/courses/our-world/level-4/unit-9/lessons/song.teacher.json";
import unit9SongLearner from "../../content/subjects/english/courses/our-world/level-4/unit-9/lessons/song.learner.json";
import unit9Grammar1 from "../../content/subjects/english/courses/our-world/level-4/unit-9/lessons/grammar1.teacher.json";
import unit9Grammar1Learner from "../../content/subjects/english/courses/our-world/level-4/unit-9/lessons/grammar1.learner.json";
import unit8Opener from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/opener.teacher.json";
import unit8OpenerLearner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/opener.learner.json";
import unit8Vocab1 from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/vocab1.teacher.json";
import unit8Vocab1Learner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/vocab1.learner.json";
import unit8Song from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/song.teacher.json";
import unit8SongLearner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/song.learner.json";
import unit8Grammar1 from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/grammar1.teacher.json";
import unit8Grammar1Learner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/grammar1.learner.json";
import unit8Vocab2 from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/vocab2.teacher.json";
import unit8Vocab2Learner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/vocab2.learner.json";
import unit8Grammar2 from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/grammar2.teacher.json";
import unit8Grammar2Learner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/grammar2.learner.json";
import unit8Reading from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/reading.teacher.json";
import unit8ReadingLearner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/reading.learner.json";
import unit8Writing from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/writing.teacher.json";
import unit8WritingLearner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/writing.learner.json";
import unit8Mission from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/mission.teacher.json";
import unit8MissionLearner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/mission-app.learner.json";
import unit8Project from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/project.teacher.json";
import unit8ProjectLearner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/project-app.learner.json";
import unit8Reader from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/reader.teacher.json";
import unit8ReaderLearner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/reader-app.learner.json";
import unit8BookReading from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/book-reading.teacher.json";
import unit8BookReadingLearner from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/book-reading.learner.json";
import type { Lesson } from "./types";

// Canonical within-unit teaching order. Lessons are always sorted by this
// regardless of the order they were built/imported in, so a unit built out
// of sequence (e.g. Unit 9 added before Unit 8 was finished) never jumbles
// the displayed order or "what's next" logic.
const componentOrder = [
  "opener",
  "vocab-1",
  "song",
  "grammar-1",
  "vocab-2",
  "grammar-2",
  "reading",
  "writing",
  "mission",
  "project",
  "reader",
  "book-reading",
  "extra-reading",
  "review"
];

function componentOrderIndex(component: string) {
  const base = component.endsWith("-app") ? component.slice(0, -4) : component;
  const index = componentOrder.indexOf(base);
  return index === -1 ? componentOrder.length : index;
}

function compareLessonOrder(a: Lesson, b: Lesson) {
  if (a.course !== b.course) return a.course.localeCompare(b.course);
  const levelDiff = (a.level ?? 0) - (b.level ?? 0);
  if (levelDiff !== 0) return levelDiff;
  const unitDiff = (a.unit ?? 0) - (b.unit ?? 0);
  if (unitDiff !== 0) return unitDiff;
  const componentDiff = componentOrderIndex(a.component) - componentOrderIndex(b.component);
  if (componentDiff !== 0) return componentDiff;
  if (a.mode !== b.mode) return a.mode === "teacher" ? -1 : 1;
  return 0;
}

export const lessons: Lesson[] = [
  unit7Opener as Lesson,
  unit7OpenerLearner as Lesson,
  unit9Opener as Lesson,
  unit9OpenerLearner as Lesson,
  unit9Vocab1 as Lesson,
  unit9Vocab1Learner as Lesson,
  unit9Song as Lesson,
  unit9SongLearner as Lesson,
  unit9Grammar1 as Lesson,
  unit9Grammar1Learner as Lesson,
  unit8Opener as Lesson,
  unit8OpenerLearner as Lesson,
  unit8Vocab1 as Lesson,
  unit8Vocab1Learner as Lesson,
  unit8Song as Lesson,
  unit8SongLearner as Lesson,
  unit8Grammar1 as Lesson,
  unit8Grammar1Learner as Lesson,
  unit8Vocab2 as Lesson,
  unit8Vocab2Learner as Lesson,
  unit8Grammar2 as Lesson,
  unit8Grammar2Learner as Lesson,
  unit8Reading as Lesson,
  unit8ReadingLearner as Lesson,
  unit8Writing as Lesson,
  unit8WritingLearner as Lesson,
  unit8Mission as Lesson,
  unit8MissionLearner as Lesson,
  unit8Project as Lesson,
  unit8ProjectLearner as Lesson,
  unit8Reader as Lesson,
  unit8ReaderLearner as Lesson,
  unit8BookReading as Lesson,
  unit8BookReadingLearner as Lesson
].sort(compareLessonOrder);
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
