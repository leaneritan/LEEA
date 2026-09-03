// One derivation of "how far along is Our World", shared by every surface that
// shows it.
//
// The course map and the sidebar card used to answer this question separately —
// the sidebar had "Level 4 · Unit 8" typed into the markup and a bar driven by
// the open-assignment count, so it went on advertising Unit 8 with an unrelated
// percentage while the map had moved to Unit 9. Anything that reports course
// progress reads it from here instead.
import { getLearnerAppProgress } from "./learnerProgress";
import type { LessonProgressMap } from "./lessonProgress";
import { isCheckpointComponent, learnerLessons, teacherLessons } from "./lessons";
import type { Lesson } from "./types";

export const OUR_WORLD_COURSE = "our-world";

export const courseLearnerLessons = learnerLessons.filter((lesson) => lesson.course === OUR_WORLD_COURSE);
export const courseTeacherLessons = teacherLessons.filter((lesson) => lesson.course === OUR_WORLD_COURSE);

/** One learner app's state, read from the app's own localStorage keys. */
export type LearnerStat = { done: boolean; completedModules: number; moduleCount: number };
export type LearnerStatMap = Record<string, LearnerStat>;

/** Leo's side of a unit, band or level. */
export type LearnerRollup = {
  apps: number;
  appsDone: number;
  appsStarted: number;
  modulesDone: number;
  modulesTotal: number;
};

export const emptyRollup: LearnerRollup = {
  apps: 0,
  appsDone: 0,
  appsStarted: 0,
  modulesDone: 0,
  modulesTotal: 0
};

/**
 * Reads every Our World learner app's progress out of localStorage.
 *
 * Must be called from an effect, never during render: on the server there is
 * no localStorage, so a render-time read would disagree with the server HTML
 * and break hydration.
 */
export function readCourseLearnerStats(): LearnerStatMap {
  const stats: LearnerStatMap = {};
  for (const lesson of courseLearnerLessons) {
    const progress = getLearnerAppProgress(lesson.source);
    stats[lesson.id] = {
      done: progress.done,
      completedModules: progress.completedModules,
      moduleCount: progress.moduleCount || lesson.source.moduleCount || 0
    };
  }
  return stats;
}

export function rollupLearner(learners: Lesson[], stats: LearnerStatMap): LearnerRollup {
  let appsDone = 0;
  let appsStarted = 0;
  let modulesDone = 0;
  let modulesTotal = 0;

  for (const lesson of learners) {
    const stat = stats[lesson.id];
    const moduleCount = stat?.moduleCount || lesson.source.moduleCount || 0;
    modulesTotal += moduleCount;
    if (!stat) continue;
    if (stat.done) {
      appsDone += 1;
      modulesDone += moduleCount;
      continue;
    }
    const partial = Math.min(stat.completedModules, moduleCount);
    modulesDone += partial;
    if (partial > 0) appsStarted += 1;
  }

  return { apps: learners.length, appsDone, appsStarted, modulesDone, modulesTotal };
}

export function countTaught(teachers: Lesson[], progress: LessonProgressMap) {
  return teachers.filter((lesson) => progress[lesson.id]?.status === "done").length;
}

/** A unit's own lessons — checkpoint decks carry the band's last unit number,
    so they are filtered out of the unit they are filed under. */
export function unitTeacherLessons(level: number, unit: number) {
  return courseTeacherLessons.filter(
    (lesson) => lesson.level === level && lesson.unit === unit && !isCheckpointComponent(lesson.component)
  );
}

export function unitLearnerLessons(level: number, unit: number) {
  return courseLearnerLessons.filter(
    (lesson) => lesson.level === level && lesson.unit === unit && !isCheckpointComponent(lesson.component)
  );
}

/** The next app in the unit Leo has not finished — what "continue" means. */
export function nextUnfinishedApp(level: number, unit: number, stats: LearnerStatMap): Lesson | null {
  return unitLearnerLessons(level, unit).find((lesson) => !stats[lesson.id]?.done) ?? null;
}

/** Completion of a unit, counted in whole apps. Every surface showing a unit
    bar uses this, so the sidebar and the course map cannot report different
    percentages for the same unit. */
export function unitPercent(rollup: LearnerRollup) {
  return rollup.apps ? Math.round((rollup.appsDone / rollup.apps) * 100) : 0;
}

/** Learner decks are titled "... App" so the teacher menu can tell the two
    modes apart; on a continue button that suffix is just noise. */
export function learnerLabel(title: string) {
  return title.replace(/\s+App$/i, "");
}
