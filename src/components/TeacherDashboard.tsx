"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ExternalLink, MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  assignLesson as assignLessonRecord,
  readAssignments,
  readAssignmentsFromCloud,
  unassignLesson as unassignLessonRecord,
  type AssignmentMap,
  type AssignmentRecord
} from "@/data/assignments";
import {
  fetchLearnerCompletionTimestamps,
  getLearnerAppProgress,
  syncLearnerProgressWithCloud,
  type LearnerAppProgress
} from "@/data/learnerProgress";
import {
  createLessonProgressRecord,
  getDoneLessonCount,
  readLessonProgress,
  saveLessonProgressRecord,
  syncLessonProgressWithCloud,
  type LessonProgressMap
} from "@/data/lessonProgress";
import { getLessonGroups, learnerLessons, lessons } from "@/data/lessons";
import type { Lesson } from "@/data/types";
import { getComponentMeta } from "./componentMeta";

const LEVELS = [1, 2, 3, 4, 5, 6];

// Fixed syllabus topics shown on every level's unit chips.
const UNIT_TITLES = [
  "Animals & Habitats",
  "My Town",
  "Food Around the World",
  "Weather & Seasons",
  "Jobs People Do",
  "Sports & Games",
  "The Human Body",
  "That's Really Interesting!",
  "Our Planet"
];

const SPINE_LESSONS = ["Opener", "Vocabulary 1", "Song", "Grammar 1", "Vocabulary 2", "Grammar 2", "Reading", "Writing"];

// Level 4 is where teaching is actively happening today, with Unit 8 as the
// current flagship unit. Units that don't have any authored lesson yet fall
// back to the placeholder spine below, positioned relative to this cursor.
const LIVE_LEVEL = 4;
const LIVE_UNIT = 8;

type MockLessonStatus = "taught" | "todo" | "locked";

// Levels below the live one are already taught end-to-end; levels ahead
// haven't started. Within the live level, units before the live one have
// already been taught and units after it haven't, since that level is
// where teaching is actively happening.
function getMockUnitStatuses(level: number, unit: number): MockLessonStatus[] {
  if (level < LIVE_LEVEL) return SPINE_LESSONS.map(() => "taught");
  if (level > LIVE_LEVEL) return SPINE_LESSONS.map(() => "locked");
  return SPINE_LESSONS.map(() => (unit < LIVE_UNIT ? "taught" : "todo"));
}

const checkpointComponents = [
  {
    component: "review",
    title: "Review",
    subtitle: "Mixed checkpoint — deck appears here when generated."
  },
  {
    component: "extra-reading",
    title: "Extra Reading",
    subtitle: "Extended comprehension & vocabulary practice."
  }
];

const shortLessonCopy: Record<string, { label: string; title: string; subtitle: string }> = {
  opener: { label: "Opener", title: "Unit 8 Opener", subtitle: "Hobbies, interests, and the Arctic photo." },
  "vocab-1": { label: "Vocab 1", title: "Vocabulary 1", subtitle: "14 words about hobbies, games & creativity." },
  song: { label: "Song", title: "Unit 8 Song", subtitle: "“What’s Your Hobby?” — sing and use the pronoun ‘who’." },
  "grammar-1": { label: "Grammar 1", title: "Describing people with ‘who’", subtitle: "Relative clauses for people — no which/that yet." },
  "vocab-2": { label: "Vocab 2", title: "Vocabulary 2", subtitle: "5 collecting words: bug, comic book, dinosaur..." },
  "grammar-2": { label: "Grammar 2", title: "Direct & Indirect Objects", subtitle: "Who is doing what to whom — give / show / send." },
  reading: { label: "Reading", title: "Hide and Seek (Geocaching)", subtitle: "Reading strategy: identify the sequence of events." },
  writing: { label: "Writing", title: "Explain a Hobby (Origami)", subtitle: "Explanation writing with a 5-criteria rubric." }
};

type TeacherLevel = {
  id: string;
  courseLabel: string;
  level?: number;
  unitGroups: ReturnType<typeof getLessonGroups>;
};

function getTeacherLevels(): TeacherLevel[] {
  const unitGroups = getLessonGroups(lessons);
  const levels = unitGroups.reduce<Record<string, TeacherLevel>>((current, group) => {
    const id = `${group.course}-l${group.level ?? "na"}`;
    const existing = current[id];

    if (existing) {
      existing.unitGroups.push(group);
      return current;
    }

    current[id] = {
      id,
      courseLabel: group.courseLabel,
      level: group.level,
      unitGroups: [group]
    };
    return current;
  }, {});

  return Object.values(levels).map((level) => ({
    ...level,
    unitGroups: level.unitGroups.sort((a, b) => (a.unit ?? 0) - (b.unit ?? 0))
  }));
}

export function TeacherDashboard() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const [assignmentsReady, setAssignmentsReady] = useState(false);
  const [progressVersion, setProgressVersion] = useState(0);
  const [completionTimestamps, setCompletionTimestamps] = useState<Record<string, string>>({});
  const [selectedLevel, setSelectedLevel] = useState(LIVE_LEVEL);
  const [selectedUnit, setSelectedUnit] = useState(LIVE_UNIT);
  const groups = useMemo(() => getTeacherLevels(), []);

  useEffect(() => {
    function refreshAll() {
      setAssignments(readAssignments(learnerLessons));
      void readAssignmentsFromCloud(learnerLessons).then(setAssignments);
      void syncLearnerProgressWithCloud(learnerLessons).then((changed) => {
        if (changed) setProgressVersion((value) => value + 1);
      });
      void fetchLearnerCompletionTimestamps(learnerLessons).then(setCompletionTimestamps);
      const localProgress = readLessonProgress();
      setProgress(localProgress);
      void syncLessonProgressWithCloud(localProgress).then(setProgress);
      setAssignmentsReady(true);
      setProgressVersion((value) => value + 1);
    }

    setProgress(readLessonProgress());

    refreshAll();

    window.addEventListener("storage", refreshAll);
    window.addEventListener("focus", refreshAll);
    return () => {
      window.removeEventListener("storage", refreshAll);
      window.removeEventListener("focus", refreshAll);
    };
  }, []);

  progressVersion;

  const nextLearnerToAssign = useMemo(
    () => learnerLessons.find((lesson) => !assignments[lesson.id] && !getLearnerAppProgress(lesson.source).done),
    [assignments]
  );
  const nextLearnerToReview = useMemo(() => {
    const candidates = learnerLessons.filter((lesson) => {
      const assignment = assignments[lesson.id];
      return assignment && assignment.status !== "reviewed" && getLearnerAppProgress(lesson.source).done;
    });
    if (!candidates.length) return undefined;
    // Show whichever one Leo actually finished most recently, not just the
    // first match in the app's static registration order — a lesson he
    // finished weeks ago (e.g. Opener) would otherwise permanently block
    // anything he finishes later from ever showing here.
    return candidates.slice().sort((a, b) => {
      const aTime = completionTimestamps[a.id] ? Date.parse(completionTimestamps[a.id]) : -Infinity;
      const bTime = completionTimestamps[b.id] ? Date.parse(completionTimestamps[b.id]) : -Infinity;
      return bTime - aTime;
    })[0];
  }, [assignments, completionTimestamps]);

  // A unit is "live" once any teacher lesson has been authored for it —
  // not just the flagship Level 4 · Unit 8 — so units built out of the
  // usual order (e.g. Unit 9 before Unit 8 was finished) still surface
  // their real roster instead of falling back to the placeholder spine.
  const selectedUnitGroup = useMemo(
    () => groups.find((group) => group.level === selectedLevel)?.unitGroups.find((unitGroup) => unitGroup.unit === selectedUnit),
    [groups, selectedLevel, selectedUnit]
  );
  const selectedTeacherLessons = useMemo(
    () => selectedUnitGroup?.lessons.filter((lesson) => lesson.mode === "teacher") ?? [],
    [selectedUnitGroup]
  );
  const isLiveUnit = selectedTeacherLessons.length > 0;
  const selectedDoneCount = useMemo(
    () => getDoneLessonCount(selectedTeacherLessons.map((lesson) => lesson.id), progress),
    [selectedTeacherLessons, progress]
  );
  const selectedAvgQuiz = useMemo(() => {
    const learnerInUnit = selectedUnitGroup?.lessons.filter((lesson) => lesson.mode === "learner") ?? [];
    const scores = learnerInUnit.map((lesson) => getLearnerAppProgress(lesson.source).score).filter((score): score is number => score !== null);
    if (!scores.length) return null;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }, [selectedUnitGroup, progressVersion]);

  const mockStatuses = useMemo(() => getMockUnitStatuses(selectedLevel, selectedUnit), [selectedLevel, selectedUnit]);

  const rosterStats = isLiveUnit
    ? { lessons: selectedTeacherLessons.length, taught: selectedDoneCount, avgLabel: selectedAvgQuiz === null ? "—" : `${selectedAvgQuiz}%` }
    : {
        lessons: SPINE_LESSONS.length,
        taught: mockStatuses.filter((status) => status === "taught").length,
        avgLabel: "—"
      };
  const rosterPercent = rosterStats.lessons ? Math.round((rosterStats.taught / rosterStats.lessons) * 100) : 0;

  function setLessonDone(lessonId: string, done: boolean) {
    setProgress((current) => {
      const record = createLessonProgressRecord(lessonId, done);
      const next = { ...current, [lessonId]: record };
      void saveLessonProgressRecord(record);
      return next;
    });
  }

  function selectLevel(level: number) {
    setSelectedLevel(level);
    setSelectedUnit(1);
  }

  function assignLesson(lessonId: string) {
    setAssignments((current) => assignLessonRecord(lessonId, current));
  }

  function unassignLesson(lessonId: string) {
    setAssignments((current) => unassignLessonRecord(lessonId, current));
  }

  return (
    <section className="teacher-page teacher-design-page">
      <header className="teacher-hero teacher-design-hero">
        <span className="eyebrow">Neritan · Teaching mode <b>Parent view</b></span>
        <h1>Teacher menu</h1>
        <p>Teach a lesson, assign Leo&apos;s homework, and review how he did — all in one place.</p>
      </header>

      {assignmentsReady ? (
        <section className="teacher-next-assignment teacher-design-next" aria-label="Next Leo app to assign">
          <div>
            <span className="teacher-next-label">Next to assign</span>
            {nextLearnerToAssign ? (
              <>
                <h2>{formatTeacherNextTitle(nextLearnerToAssign)}</h2>
                <p>
                  Our World ·{" "}
                  <span className={`level-tag level-${nextLearnerToAssign.level ?? 4}`}>
                    <i className="level-tag-dot" aria-hidden="true" />
                    <b className="level-tag-label on-navy">Level {nextLearnerToAssign.level}</b>
                  </span>{" "}
                  · Unit {nextLearnerToAssign.unit} · {getComponentMeta(nextLearnerToAssign.component).label}
                </p>
                <div className="teacher-next-actions">
                  <button className="teacher-open-button" onClick={() => assignLesson(nextLearnerToAssign.id)} type="button">
                    Assign to Leo
                  </button>
                  <Link className="teacher-done-button" href={`/lessons/${nextLearnerToAssign.id}`}>
                    Open Leo App <ExternalLink size={15} />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2>No Leo apps are waiting to assign.</h2>
                <p>Everything live is either assigned, finished, or ready for review.</p>
              </>
            )}
          </div>
          {nextLearnerToReview ? <ReviewCallout lesson={nextLearnerToReview} /> : null}
        </section>
      ) : null}

      <section className="teacher-navigator teacher-design-navigator" aria-label="Choose a level and unit">
        <div className="teacher-navigator-levels" role="tablist" aria-label="Level">
          {LEVELS.map((level) => (
            <button
              aria-selected={selectedLevel === level}
              className={`teacher-level-tab level-${level}${selectedLevel === level ? " is-selected" : ""}`}
              key={level}
              onClick={() => selectLevel(level)}
              role="tab"
              type="button"
            >
              <i className="teacher-level-tab-dot" aria-hidden="true" />
              Level {level}
            </button>
          ))}
        </div>

        <div className={`teacher-navigator-units level-${selectedLevel}`}>
          <span className="teacher-navigator-units-label">
            <i className="level-tag-dot" aria-hidden="true" />
            Choose a unit
          </span>
          <div aria-label="Unit" className="teacher-unit-chips" role="tablist">
            {UNIT_TITLES.map((title, index) => {
              const unitNumber = index + 1;
              const isSelected = selectedUnit === unitNumber;
              return (
                <button
                  aria-selected={isSelected}
                  className={`teacher-unit-chip${isSelected ? " is-selected" : ""}`}
                  key={unitNumber}
                  onClick={() => setSelectedUnit(unitNumber)}
                  role="tab"
                  type="button"
                >
                  <span>UNIT {unitNumber}</span>
                  <strong>{title}</strong>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="teacher-stats teacher-design-stats" aria-label="Teaching stats">
        <div><span>Lessons in unit</span><strong>{rosterStats.lessons}</strong></div>
        <div><span>Taught</span><strong>{rosterStats.taught}</strong></div>
        <div><span>To teach</span><strong>{rosterStats.lessons - rosterStats.taught}</strong></div>
        <div className="dark"><span>Leo&apos;s avg quiz</span><strong>{rosterStats.avgLabel}</strong></div>
      </section>

      <section className={`teacher-group teacher-design-group level-${selectedLevel}`} aria-label={`Level ${selectedLevel}, Unit ${selectedUnit}`}>
        <div className="teacher-group-header teacher-design-group-header">
          <span>Our World</span>
          <h2>
            <i className="level-tag-dot" aria-hidden="true" />
            Level {selectedLevel} · Unit {selectedUnit}
          </h2>
          <small><i><b style={{ width: `${rosterPercent}%` }} /></i>{rosterStats.taught} / {rosterStats.lessons} taught</small>
        </div>

        {isLiveUnit ? (
          <div className="teacher-table">
            <div className="teacher-table-head">
              <span>Lesson</span>
              <span>Teaching</span>
              <span>Leo&apos;s App</span>
            </div>
            {selectedTeacherLessons.map((lesson) => {
              const learnerCounterpart = selectedUnitGroup?.lessons.find((item) => item.mode === "learner" && item.component === `${lesson.component}-app`);
              return (
                <TeacherLessonRow
                  assignment={learnerCounterpart ? assignments[learnerCounterpart.id] : undefined}
                  key={lesson.id}
                  learner={learnerCounterpart}
                  lesson={lesson}
                  progress={progress[lesson.id]}
                  setLessonDone={setLessonDone}
                  assignLesson={assignLesson}
                  unassignLesson={unassignLesson}
                />
              );
            })}
            {selectedUnit % 3 === 0 ? (
              <div className="teacher-checkpoint-rows">
                <div className="teacher-checkpoint-label">Checkpoint after Units {selectedUnit - 2}–{selectedUnit}</div>
                {checkpointComponents.map((checkpoint) => (
                  <CheckpointRow checkpoint={checkpoint} key={checkpoint.component} unitBand={{ start: selectedUnit - 2, end: selectedUnit }} />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="teacher-table teacher-table-simple">
            <div className="teacher-table-head">
              <span>Lesson</span>
              <span>Status</span>
            </div>
            {SPINE_LESSONS.map((label, index) => {
              const status = mockStatuses[index];
              const statusLabel = status === "taught" ? "✓ Taught" : status === "todo" ? "To teach" : "Locked";
              const statusClass = status === "taught" ? "done" : status === "todo" ? "todo" : "locked";
              return (
                <div className="teacher-table-row teacher-table-row-simple" key={label}>
                  <div className="teacher-table-lesson">
                    <h3>{label}</h3>
                  </div>
                  <div className="teacher-table-teaching">
                    <span className={`status-pill ${statusClass}`}>{statusLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

function TeacherLessonRow({
  assignment,
  learner,
  lesson,
  progress,
  setLessonDone,
  assignLesson,
  unassignLesson
}: {
  assignment: AssignmentRecord | undefined;
  learner: Lesson | undefined;
  lesson: Lesson;
  progress: LessonProgressMap[string] | undefined;
  setLessonDone: (lessonId: string, done: boolean) => void;
  assignLesson: (lessonId: string) => void;
  unassignLesson: (lessonId: string) => void;
}) {
  const done = progress?.status === "done";
  const meta = getComponentMeta(lesson.component);
  const copy = (lesson.unit === 8 ? shortLessonCopy[lesson.component] : undefined) ?? { label: meta.label, title: lesson.title, subtitle: lesson.subtitle };
  const appProgress = learner ? getLearnerAppProgress(learner.source) : null;

  return (
    <article className={`teacher-table-row teacher-table-row-${meta.tone}`}>
      <div className="teacher-table-lesson">
        <span>{copy.label}</span>
        <h3>{copy.title}</h3>
        <p>{copy.subtitle}</p>
        <small>
          {lesson.source.slideCount ?? 0} slides · {done && progress?.completedAt ? `taught ${new Date(progress.completedAt).toLocaleDateString()}` : "not taught yet"}
        </small>
      </div>

      <div className="teacher-table-teaching">
        <span className={done ? "status-pill done" : "status-pill todo"}>{done ? "✓ Taught" : "To teach"}</span>
        <Link className="teacher-open-button" href={`/lessons/${lesson.id}`}>Open deck</Link>
      </div>

      <div className="teacher-table-leo">
        {learner && appProgress ? (
          <>
            <LeoAppStatus assignment={assignment} appProgress={appProgress} />
            <div className="teacher-leo-actions">
              {appProgress.done || assignment ? (
                <Link className="teacher-done-button" href={`/teacher/review/${learner.id}`}>Review</Link>
              ) : (
                <button className="teacher-done-button" onClick={() => assignLesson(learner.id)} type="button">Assign to Leo</button>
              )}
              <TeacherRowMenu
                done={done}
                learner={learner}
                lesson={lesson}
                markLesson={() => setLessonDone(lesson.id, !done)}
                unassignLesson={assignment ? () => unassignLesson(learner.id) : undefined}
              />
            </div>
          </>
        ) : (
          <span className="muted-status">—</span>
        )}
      </div>
    </article>
  );
}

function TeacherRowMenu({
  done,
  learner,
  lesson,
  markLesson,
  unassignLesson
}: {
  done: boolean;
  learner: Lesson;
  lesson: Lesson;
  markLesson: () => void;
  unassignLesson?: () => void;
}) {
  return (
    <div className="teacher-row-menu">
      <button aria-label={`More actions for ${lesson.title}`} type="button">
        <MoreHorizontal size={18} />
      </button>
      <div className="teacher-row-menu-popover">
        <Link href={`/lessons/${lesson.id}`}>Open deck</Link>
        <Link href={`/lessons/${learner.id}`}>Open Leo App <ExternalLink size={13} /></Link>
        <button onClick={markLesson} type="button">{done ? "Mark not taught" : "Mark taught"}</button>
        {unassignLesson ? <button onClick={unassignLesson} type="button">Unassign</button> : null}
      </div>
    </div>
  );
}

function LeoAppStatus({ assignment, appProgress }: { assignment: AssignmentRecord | undefined; appProgress: LearnerAppProgress }) {
  const percent = appProgress.moduleCount ? Math.round((appProgress.completedModules / appProgress.moduleCount) * 100) : 0;
  const label = appProgress.done ? "✓ Done" : assignment ? "In progress" : "Not assigned";

  const showBar = appProgress.done || !!assignment;

  return (
    <div className="teacher-leo-progress">
      <div><span className={appProgress.done ? "status-pill done" : assignment ? "status-pill active" : "muted-status"}>{label}</span>{appProgress.done ? <strong>{percent}%</strong> : null}</div>
      {showBar ? (
        <>
          <i className={appProgress.done ? "done" : "active"}><b style={{ width: `${percent}%` }} /></i>
          <small>{appProgress.completedModules}/{appProgress.moduleCount}</small>
        </>
      ) : null}
    </div>
  );
}

function ReviewCallout({ lesson }: { lesson: Lesson }) {
  const progress = getLearnerAppProgress(lesson.source);
  return (
    <aside className="teacher-review-callout">
      <span>Needs review <b>1</b></span>
      <strong>Leo finished {formatTeacherNextTitle(lesson)}</strong>
      <small>{progress.completedModules} / {progress.moduleCount} modules{progress.score !== null ? ` · quiz ${progress.score}%` : ""}</small>
      <Link href={`/teacher/review/${lesson.id}`}>Review results</Link>
    </aside>
  );
}

function CheckpointRow({ checkpoint, unitBand }: { checkpoint: (typeof checkpointComponents)[number]; unitBand: { start: number; end: number } }) {
  const meta = getComponentMeta(checkpoint.component);
  return (
    <article className={`teacher-table-row teacher-table-row-${meta.tone} planned`}>
      <div className="teacher-table-lesson">
        <span>{checkpoint.component === "review" ? "Review" : "Extra Reading"}</span>
        <h3>{checkpoint.title} {unitBand.start}–{unitBand.end}</h3>
        <p>{checkpoint.subtitle}</p>
      </div>
      <div className="teacher-table-teaching"><span className="status-pill planned">Planned</span></div>
      <div className="teacher-table-leo"><span className="muted-status">—</span></div>
    </article>
  );
}

function formatTeacherNextTitle(lesson: Lesson) {
  return (shortLessonCopy[lesson.component.replace("-app", "")]?.title ?? lesson.title)
    .replace(/^Unit 8 /, "Unit 8 ")
    .replace(/ App$/, "")
    .replace(/ Leo's Test App$/, "");
}
