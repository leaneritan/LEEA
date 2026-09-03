"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { readLessonProgress, syncLessonProgressWithCloud, type LessonProgressMap } from "@/data/lessonProgress";
import { isCheckpointComponent, learnerLessons, teacherLessons } from "@/data/lessons";
import { getLearnerAppProgress, syncLearnerProgressWithCloud } from "@/data/learnerProgress";
import {
  getCheckpointAssessmentTracks,
  getUnitAssessmentTracks,
  isAssessmentTrackAvailable
} from "@/data/assessmentAudio";
import { LEVELS, UNITS_PER_LEVEL, unitTitle } from "@/data/curriculum";
import { OUR_WORLD_UNIT_TOTALS } from "@/data/reference-units";
import type { Lesson } from "@/data/types";
import {
  fallbackCurrentUnit,
  readCurrentUnit,
  syncCurrentUnitWithCloud,
  type CurrentUnit
} from "@/data/currentUnit";

const COURSE = "our-world";

// Only Our World lessons matter here, and only these are worth syncing —
// pulling every course's learner progress would query rows this page never
// shows.
const courseLearnerLessons = learnerLessons.filter((lesson) => lesson.course === COURSE);
const courseTeacherLessons = teacherLessons.filter((lesson) => lesson.course === COURSE);

/** Level 1 ships eight units, every other level nine. */
function unitsInLevel(level: number) {
  return OUR_WORLD_UNIT_TOTALS[level] ?? UNITS_PER_LEVEL;
}

/** One learner app's state, read from the app's own localStorage keys. */
type LearnerStat = { done: boolean; completedModules: number; moduleCount: number };
type LearnerStatMap = Record<string, LearnerStat>;

/** What a row can actually say about itself. Teacher-side (built/taught) and
    Leo-side (apps/modules) are separate signals: a lesson can be taught and
    the app untouched, or the app finished before the deck is marked done. */
type RowProgress = {
  built: number;
  taught: number;
  apps: number;
  appsDone: number;
  appsStarted: number;
  modulesDone: number;
  modulesTotal: number;
  audioTracks: number;
};

type SequenceItem = {
  kind: "unit" | "review" | "reading" | "level-test";
  number?: number;
  title: string;
  subtitle: string;
  state: "planned" | "active" | "locked";
  progress: RowProgress;
  /** Set on a built checkpoint row so it opens its deck directly — checkpoints
      have no unit page of their own to land on. */
  lessonId?: string;
};

/** A run of rows with nothing behind them, folded into a single strip so the
    page is about what exists rather than sixteen identical "Planned" cards. */
type GapItem = { kind: "gap"; items: SequenceItem[] };
type SequenceEntry = SequenceItem | GapItem;

const emptyProgress: RowProgress = {
  built: 0,
  taught: 0,
  apps: 0,
  appsDone: 0,
  appsStarted: 0,
  modulesDone: 0,
  modulesTotal: 0,
  audioTracks: 0
};

function readLearnerStats(): LearnerStatMap {
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

function collectProgress(
  teachers: Lesson[],
  learners: Lesson[],
  progress: LessonProgressMap,
  stats: LearnerStatMap,
  audioTracks: number
): RowProgress {
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

  return {
    built: teachers.length,
    taught: teachers.filter((lesson) => progress[lesson.id]?.status === "done").length,
    apps: learners.length,
    appsDone,
    appsStarted,
    modulesDone,
    modulesTotal,
    audioTracks
  };
}

function availableTracks(tracks: ReturnType<typeof getUnitAssessmentTracks>) {
  return tracks.filter(isAssessmentTrackAvailable).length;
}

// The sequence used to be a hardcoded Level 4 list, so the level buttons had
// nothing to switch between and every level showed Level 4's units under the
// wrong titles. It is now derived: unit titles come from the shared per-level
// map, counts from the authored lessons, teacher progress from the lesson
// progress map and Leo's progress from the learner apps' own storage.
function buildSequence(
  level: number,
  cursor: CurrentUnit,
  progress: LessonProgressMap,
  stats: LearnerStatMap
): SequenceItem[] {
  const items: SequenceItem[] = [];
  const totalUnits = unitsInLevel(level);

  for (let unit = 1; unit <= totalUnits; unit++) {
    const unitTeachers = courseTeacherLessons.filter(
      (lesson) => lesson.level === level && lesson.unit === unit && !isCheckpointComponent(lesson.component)
    );
    const unitLearners = courseLearnerLessons.filter(
      (lesson) => lesson.level === level && lesson.unit === unit && !isCheckpointComponent(lesson.component)
    );
    const rowProgress = collectProgress(
      unitTeachers,
      unitLearners,
      progress,
      stats,
      availableTracks(getUnitAssessmentTracks(COURSE, level, unit))
    );

    const state: SequenceItem["state"] = unitTeachers.length
      ? "active"
      : level > cursor.level || (level === cursor.level && unit > cursor.unit)
        ? "locked"
        : "planned";

    items.push({
      kind: "unit",
      number: unit,
      title: unitTitle(level, unit),
      subtitle: unitTeachers.length ? `${unitTeachers.length} teaching components` : "Not built yet",
      state,
      progress: rowProgress
    });

    // Checkpoints land after each three-unit band. Their lesson records carry
    // the band's last unit number, so they are found from this unit but counted
    // separately from it.
    if (unit % 3 === 0) {
      const band = `${unit - 2}–${unit}`;
      const bandLocked = level > cursor.level || (level === cursor.level && unit > cursor.unit);
      const checkpointItem = (
        kind: "review" | "reading",
        component: string,
        title: string,
        subtitle: string,
        audioTracks: number
      ): SequenceItem => {
        const built = courseTeacherLessons.filter(
          (lesson) => lesson.level === level && lesson.unit === unit && lesson.component === component
        );
        const apps = courseLearnerLessons.filter(
          (lesson) => lesson.level === level && lesson.unit === unit && lesson.component === `${component}-app`
        );
        return {
          kind,
          title,
          subtitle: built.length ? built[0].title : subtitle,
          state: built.length ? "active" : bandLocked ? "locked" : "planned",
          progress: collectProgress(built, apps, progress, stats, audioTracks),
          lessonId: built[0]?.id
        };
      };

      items.push(
        checkpointItem(
          "review",
          "review",
          `Review · Units ${band}`,
          "Mixed quiz, grammar and reading from this band.",
          availableTracks(getCheckpointAssessmentTracks(COURSE, level, unit))
        )
      );
      items.push(
        checkpointItem(
          "reading",
          "extra-reading",
          `Extra Reading ${unit / 3}`,
          "Extra reading to stretch a little further.",
          0
        )
      );
    }
  }

  items.push({
    kind: "level-test",
    title: `Review · Units 1–${totalUnits} · Level test`,
    subtitle: "Level-wide review and checkpoint.",
    state: level < cursor.level ? "planned" : "locked",
    progress: emptyProgress
  });

  return items;
}

/** Folds consecutive empty rows into one strip. The level test keeps its own
    row — it is the end of the level, not filler. */
function foldGaps(items: SequenceItem[]): SequenceEntry[] {
  const entries: SequenceEntry[] = [];
  let gap: SequenceItem[] = [];

  const flush = () => {
    if (!gap.length) return;
    entries.push({ kind: "gap", items: gap });
    gap = [];
  };

  for (const item of items) {
    if (item.kind !== "level-test" && item.progress.built === 0) {
      gap.push(item);
      continue;
    }
    flush();
    entries.push(item);
  }
  flush();

  return entries;
}

/** Learner decks are titled "... App" so the teacher menu can tell the two
    modes apart; on the Continue button that suffix is just noise. */
function learnerLabel(title: string) {
  return title.replace(/\s+App$/i, "");
}

function gapHeadline(items: SequenceItem[]) {
  const units = items.filter((item) => item.kind === "unit").map((item) => item.number ?? 0);
  const extras = items.length - units.length;
  const unitPart = units.length
    ? units.length === 1
      ? `Unit ${units[0]}`
      : `Units ${units[0]}–${units[units.length - 1]}`
    : "";
  const extraPart = extras ? `${extras} checkpoint row${extras === 1 ? "" : "s"}` : "";
  return [unitPart, extraPart].filter(Boolean).join(" · ");
}

export function OurWorldPage() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  // Learner progress is read from localStorage, so it must not be touched
  // during render — it would differ from the server HTML and break hydration.
  // It is loaded in an effect and refreshed whenever this tab comes back.
  const [learnerStats, setLearnerStats] = useState<LearnerStatMap>({});
  const [currentUnit, setCurrentUnit] = useState<CurrentUnit>(fallbackCurrentUnit);
  const [selectedLevel, setSelectedLevel] = useState(fallbackCurrentUnit.level);

  useEffect(() => {
    const local = readCurrentUnit();
    setCurrentUnit(local);
    setSelectedLevel(local.level);
    void syncCurrentUnitWithCloud(local).then((synced) => {
      setCurrentUnit(synced);
      setSelectedLevel(synced.level);
    });
  }, []);

  const refresh = useCallback(() => {
    const localProgress = readLessonProgress();
    setProgress(localProgress);
    setLearnerStats(readLearnerStats());
    void syncLessonProgressWithCloud(localProgress).then(setProgress);
  }, []);

  useEffect(() => {
    refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  // Leo works in his own browser; without this pull the course map only ever
  // showed whatever this device happened to have in localStorage, which is why
  // the rows never moved.
  useEffect(() => {
    void syncLearnerProgressWithCloud(courseLearnerLessons).then((changed) => {
      if (changed) setLearnerStats(readLearnerStats());
    });
  }, []);

  const sequence = useMemo(
    () => foldGaps(buildSequence(selectedLevel, currentUnit, progress, learnerStats)),
    [selectedLevel, currentUnit, progress, learnerStats]
  );

  const levelTeachers = useMemo(
    () => courseTeacherLessons.filter((lesson) => lesson.level === selectedLevel),
    [selectedLevel]
  );
  const levelLearners = useMemo(
    () => courseLearnerLessons.filter((lesson) => lesson.level === selectedLevel),
    [selectedLevel]
  );
  const levelProgress = useMemo(
    () => collectProgress(levelTeachers, levelLearners, progress, learnerStats, 0),
    [levelTeachers, levelLearners, progress, learnerStats]
  );

  const courseProgress = useMemo(
    () => collectProgress(courseTeacherLessons, courseLearnerLessons, progress, learnerStats, 0),
    [progress, learnerStats]
  );

  // The unit Neritan is teaching right now, and the next thing in it Leo has
  // not finished — the one row on this page that answers "what happens next".
  const currentUnitLearners = useMemo(
    () =>
      courseLearnerLessons.filter(
        (lesson) =>
          lesson.level === currentUnit.level
          && lesson.unit === currentUnit.unit
          && !isCheckpointComponent(lesson.component)
      ),
    [currentUnit]
  );
  const currentUnitProgress = useMemo(
    () =>
      collectProgress(
        courseTeacherLessons.filter(
          (lesson) =>
            lesson.level === currentUnit.level
            && lesson.unit === currentUnit.unit
            && !isCheckpointComponent(lesson.component)
        ),
        currentUnitLearners,
        progress,
        learnerStats,
        0
      ),
    [currentUnit, currentUnitLearners, progress, learnerStats]
  );
  const nextLesson = useMemo(
    () => currentUnitLearners.find((lesson) => !learnerStats[lesson.id]?.done) ?? null,
    [currentUnitLearners, learnerStats]
  );

  const unitPercent = currentUnitProgress.apps
    ? Math.round((currentUnitProgress.appsDone / currentUnitProgress.apps) * 100)
    : 0;

  return (
    <section className="ow-page ow-page--final">
      <section className="ow-design-hero">
        <div>
          <span>National Geographic</span>
          <h1>Our<br />World</h1>
          <p>6 levels · 9 units each · explore the planet in English.</p>
          <div className="ow-hero-chips">
            <span>{courseTeacherLessons.length} teacher lessons built</span>
            <span>{courseProgress.taught} taught</span>
            <span>Leo finished {courseProgress.appsDone} of {courseProgress.apps} apps</span>
          </div>
          <Link className="ow-hero-link" href="/english/our-world/test-audio">
            🎧 Test audio — every unit, Levels 4–6
          </Link>
        </div>
        <aside>
          <span>Continue</span>
          <small>Level {currentUnit.level} · Unit {currentUnit.unit}</small>
          <strong>{unitTitle(currentUnit.level, currentUnit.unit)}</strong>
          {currentUnitProgress.apps > 0 && (
            <>
              <div className="ow-continue-meter" aria-hidden="true">
                <i style={{ width: `${unitPercent}%` }} />
              </div>
              <em>
                Leo {currentUnitProgress.appsDone} / {currentUnitProgress.apps} done
                {currentUnitProgress.appsStarted ? ` · ${currentUnitProgress.appsStarted} in progress` : ""}
              </em>
            </>
          )}
          {nextLesson ? (
            <Link href={`/lessons/${nextLesson.id}`}>Next: {learnerLabel(nextLesson.title)} →</Link>
          ) : (
            <Link href={`/english/our-world/level-${currentUnit.level}/unit-${currentUnit.unit}`}>Keep going →</Link>
          )}
          <Link className="ow-continue-secondary" href={`/english/our-world/level-${currentUnit.level}/unit-${currentUnit.unit}`}>
            Open the whole unit
          </Link>
        </aside>
      </section>

      <div className="ow-level-picker">
        <span>Choose a level</span>
        <div>
          {LEVELS.map((level) => {
            const built = courseTeacherLessons.some((lesson) => lesson.level === level);
            return (
              <button
                aria-pressed={level === selectedLevel}
                className={level === selectedLevel ? "active" : built ? "" : "locked"}
                key={level}
                onClick={() => setSelectedLevel(level)}
                type="button"
              >
                Level {level}
                {built ? "" : " · planned"}
              </button>
            );
          })}
        </div>
      </div>

      <section className="ow-sequence">
        <header>
          <h2>Level {selectedLevel} · {unitsInLevel(selectedLevel)} units</h2>
          <span>
            {levelProgress.built
              ? `${levelProgress.taught} of ${levelProgress.built} lessons taught · Leo finished ${levelProgress.appsDone} of ${levelProgress.apps} apps`
              : "Nothing built for this level yet"}
          </span>
        </header>
        <div className="ow-sequence-list">
          {sequence.map((entry, index) =>
            entry.kind === "gap" ? (
              <GapRow items={entry.items} key={`gap-${index}`} />
            ) : (
              <SequenceRow item={entry} key={`${entry.kind}-${entry.number ?? index}`} level={selectedLevel} />
            )
          )}
        </div>
      </section>
    </section>
  );
}

function GapRow({ items }: { items: SequenceItem[] }) {
  return (
    <article className="ow-sequence-row ow-sequence-row--gap">
      <span className="ow-sequence-icon">···</span>
      <div className="ow-sequence-copy">
        <small>Not built yet</small>
        <h3>{gapHeadline(items)}</h3>
        <p>{items.map((item) => item.title).join(" · ")}</p>
      </div>
      <span className="ow-sequence-status status-planned">{items.length} planned</span>
      <span className="ow-sequence-arrow" />
    </article>
  );
}

function SequenceRow({ item, level }: { item: SequenceItem; level: number }) {
  const { progress } = item;
  const percent = progress.modulesTotal
    ? Math.round((progress.modulesDone / progress.modulesTotal) * 100)
    : 0;
  const complete = progress.apps > 0 && progress.appsDone === progress.apps;
  const statusClass = item.state !== "active"
    ? `status-${item.state}`
    : complete
      ? "status-done"
      : progress.appsDone || progress.appsStarted
        ? "status-active"
        : "status-ready";
  const statusLabel = item.state === "locked"
    ? "🔒 Locked"
    : item.state === "planned"
      ? "Planned"
      : progress.apps
        ? `Leo ${progress.appsDone} / ${progress.apps}`
        : `${progress.taught} / ${progress.built} taught`;

  const content = (
    <>
      <span className="ow-sequence-icon">{item.kind === "unit" ? item.number : item.kind === "reading" ? "📖" : "▦"}</span>
      <div className="ow-sequence-copy">
        <small>{item.kind === "unit" ? `Unit ${item.number}` : item.kind === "reading" ? "Bonus" : "Checkpoint · Review"}</small>
        <h3>{item.title}</h3>
        <p>{item.subtitle}</p>
        {item.state === "active" && (
          <div className="ow-sequence-meta">
            <b>Taught {progress.taught} / {progress.built}</b>
            {progress.apps > 0 && (
              <>
                <div className="ow-sequence-meter" aria-hidden="true">
                  <i className={complete ? "is-full" : undefined} style={{ width: `${percent}%` }} />
                </div>
                <span>{percent}% of Leo&apos;s modules</span>
              </>
            )}
            {progress.audioTracks > 0 && (
              <span className="ow-sequence-tag">🎧 {progress.audioTracks} test track{progress.audioTracks === 1 ? "" : "s"}</span>
            )}
          </div>
        )}
      </div>
      <span className={`ow-sequence-status ${statusClass}`}>{statusLabel}</span>
      <span className="ow-sequence-arrow">›</span>
    </>
  );

  // Only units that actually have authored lessons are navigable; a built
  // checkpoint opens its own deck.
  const href = item.lessonId
    ? `/lessons/${item.lessonId}`
    : item.kind === "unit" && item.number != null && progress.built > 0
      ? `/english/our-world/level-${level}/unit-${item.number}`
      : null;

  return href
    ? <Link className="ow-sequence-row active" href={href}>{content}</Link>
    : <article className={`ow-sequence-row ${item.kind} ${item.state}`}>{content}</article>;
}
