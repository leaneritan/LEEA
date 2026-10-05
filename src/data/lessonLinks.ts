import { lessons } from "./lessons";
import type { Lesson } from "./types";

/**
 * Reference → lesson links.
 *
 * A Reference card's source says where a word or grammar point is taught
 * (course, level, unit, component). The "Open lesson" buttons used to wait
 * for `lessonStatus: "live"` on that source, which almost no source carries
 * — so they stayed locked even when the lesson was built and registered.
 * The registry is the truth: if a lesson for that source exists, link it.
 */
export type LessonLink = { href: string; title: string };
export type SourceLessons = { teacher: LessonLink | null; app: LessonLink | null };

type SourceLike = {
  course?: string;
  level?: number;
  unit?: number;
  component?: string;
  lessonId?: string | null;
};

/* Source components that are spelled differently from the lesson registry. */
const COMPONENT_ALIASES: Record<string, string[]> = {
  "vocabulary-1": ["vocab-1"],
  "vocabulary-2": ["vocab-2"],
  reader: ["book-reading", "reader"],
  "book-reading": ["book-reading", "reader"],
  "extended-reading": ["extra-reading"]
};

function toLink(lesson: Lesson | undefined): LessonLink | null {
  if (!lesson || !lesson.source?.embedPath) return null;
  return { href: `/lessons/${lesson.id}`, title: lesson.title };
}

function find(source: SourceLike, mode: Lesson["mode"]): Lesson | undefined {
  if (!source.component || source.level == null || source.unit == null) return undefined;
  const names = COMPONENT_ALIASES[source.component] ?? [source.component];
  const wanted = names.map((name) => (mode === "learner" ? `${name}-app` : name));
  return lessons.find(
    (lesson) =>
      lesson.mode === mode &&
      lesson.course === source.course &&
      lesson.level === source.level &&
      lesson.unit === source.unit &&
      wanted.includes(lesson.component)
  );
}

export function findSourceLessons(source: SourceLike): SourceLessons {
  const byId = source.lessonId ? lessons.find((lesson) => lesson.id === source.lessonId) : undefined;
  const teacher = byId?.mode === "teacher" ? byId : find(source, "teacher");
  let app = byId?.mode === "learner" ? byId : find(source, "learner");
  /* A lesson id with no level/unit on the source (grammar points): find its app by pairing. */
  if (!app && teacher) app = find({ ...teacher, course: teacher.course }, "learner");
  return { teacher: toLink(teacher), app: toLink(app) };
}

/* The first source on a card that has a built lesson. */
export function findFirstSourceLessons(sources: SourceLike[]): SourceLessons {
  for (const source of sources) {
    const found = findSourceLessons(source);
    if (found.teacher || found.app) return found;
  }
  return { teacher: null, app: null };
}
