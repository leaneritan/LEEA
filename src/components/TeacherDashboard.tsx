"use client";

import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronRight, Circle, ExternalLink, MoreHorizontal } from "lucide-react";
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
import { getLessonGroups, learnerLessons, lessons, teacherLessons } from "@/data/lessons";
import type { Lesson } from "@/data/types";
import { getComponentMeta } from "./componentMeta";

const groupOpenStorageKey = "leea.teacher.lessonGroupsOpen.v1";

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

function getUnitBand(unit?: number) {
  if (!unit) return { start: undefined, end: undefined };
  const start = Math.floor((unit - 1) / 3) * 3 + 1;
  return { start, end: start + 2 };
}

export function TeacherDashboard() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const [assignmentsReady, setAssignmentsReady] = useState(false);
  const [progressVersion, setProgressVersion] = useState(0);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [completionTimestamps, setCompletionTimestamps] = useState<Record<string, string>>({});
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

    const savedGroups = window.localStorage.getItem(groupOpenStorageKey);
    if (savedGroups) {
      try {
        setOpenGroups(JSON.parse(savedGroups) as Record<string, boolean>);
      } catch {
        setOpenGroups({});
      }
    } else {
      setOpenGroups(Object.fromEntries(groups.map((group, index) => [group.id, index === 0])));
    }

    window.addEventListener("storage", refreshAll);
    window.addEventListener("focus", refreshAll);
    return () => {
      window.removeEventListener("storage", refreshAll);
      window.removeEventListener("focus", refreshAll);
    };
  }, [groups]);

  progressVersion;

  const doneCount = useMemo(() => getDoneLessonCount(teacherLessons.map((lesson) => lesson.id), progress), [progress]);
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
  const avgQuiz = useMemo(() => {
    const scores = learnerLessons.map((lesson) => getLearnerAppProgress(lesson.source).score).filter((score): score is number => score !== null);
    if (!scores.length) return null;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }, [progressVersion]);

  function setLessonDone(lessonId: string, done: boolean) {
    setProgress((current) => {
      const record = createLessonProgressRecord(lessonId, done);
      const next = { ...current, [lessonId]: record };
      void saveLessonProgressRecord(record);
      return next;
    });
  }

  function toggleGroup(groupId: string) {
    setOpenGroups((current) => {
      const next = { ...current, [groupId]: !(current[groupId] ?? true) };
      window.localStorage.setItem(groupOpenStorageKey, JSON.stringify(next));
      return next;
    });
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
                <p>Our World · Level {nextLearnerToAssign.level} · Unit {nextLearnerToAssign.unit} · {getComponentMeta(nextLearnerToAssign.component).label}</p>
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

      <section className="teacher-stats teacher-design-stats" aria-label="Teaching stats">
        <div><span>Lessons in unit</span><strong>{teacherLessons.length}</strong></div>
        <div><span>Taught</span><strong>{doneCount}</strong></div>
        <div><span>To teach</span><strong>{teacherLessons.length - doneCount}</strong></div>
        <div className="dark"><span>Leo&apos;s avg quiz</span><strong>{avgQuiz === null ? "—" : `${avgQuiz}%`}</strong></div>
      </section>

      <div className="teacher-group-grid teacher-design-groups">
        {groups.map((group) => {
          const teacherInGroup = group.unitGroups.flatMap((unitGroup) => unitGroup.lessons.filter((lesson) => lesson.mode === "teacher"));
          const groupDone = getDoneLessonCount(teacherInGroup.map((lesson) => lesson.id), progress);
          const isOpen = openGroups[group.id] ?? true;

          return (
            <section className="teacher-group teacher-design-group" id={group.id} key={group.id}>
              <button className="teacher-group-header teacher-design-group-header" onClick={() => toggleGroup(group.id)} type="button">
                <span>{isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />} {group.courseLabel}</span>
                <h2>Level {group.level} · Unit 8</h2>
                <small><i><b style={{ width: `${teacherInGroup.length ? Math.round((groupDone / teacherInGroup.length) * 100) : 0}%` }} /></i>{groupDone} / {teacherInGroup.length} taught</small>
              </button>

              {isOpen ? (
                <div className="teacher-table">
                  <div className="teacher-table-head">
                    <span>Lesson</span>
                    <span>Teaching</span>
                    <span>Leo&apos;s App</span>
                  </div>
                  {group.unitGroups.map((unitGroup, unitIndex) => {
                    const band = getUnitBand(unitGroup.unit);
                    const nextUnit = group.unitGroups[unitIndex + 1]?.unit;
                    const nextBand = getUnitBand(nextUnit);
                    const isLastUnitInVisibleBand = nextBand.start !== band.start;

                    return (
                      <div className="teacher-table-band" key={unitGroup.id}>
                        {unitGroup.lessons.filter((lesson) => lesson.mode === "teacher").map((lesson) => {
                          const learnerCounterpart = unitGroup.lessons.find((item) => item.mode === "learner" && item.component === `${lesson.component}-app`);
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
                        {isLastUnitInVisibleBand ? (
                          <div className="teacher-checkpoint-rows">
                            <div className="teacher-checkpoint-label">Checkpoint after Units {band.start}–{band.end}</div>
                            {checkpointComponents.map((checkpoint) => (
                              <CheckpointRow checkpoint={checkpoint} key={checkpoint.component} unitBand={band} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
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
  const copy = shortLessonCopy[lesson.component] ?? { label: meta.label, title: lesson.title, subtitle: lesson.subtitle };
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
      <div><span className={appProgress.done ? "status-pill done" : assignment ? "status-pill active" : "muted-status"}>{label}</span><strong>{showBar ? `${percent}%` : ""}</strong></div>
      {showBar ? (
        <>
          <i><b style={{ width: `${percent}%` }} /></i>
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

function CheckpointRow({ checkpoint, unitBand }: { checkpoint: (typeof checkpointComponents)[number]; unitBand: { start?: number; end?: number } }) {
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
