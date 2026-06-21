"use client";

import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronRight, Circle, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  assignLesson as assignLessonRecord,
  readAssignments,
  unassignLesson as unassignLessonRecord,
  type AssignmentMap,
  type AssignmentRecord
} from "@/data/assignments";
import { getLearnerAppProgress } from "@/data/learnerProgress";
import {
  createLessonProgressRecord,
  getDoneLessonCount,
  lessonProgressStorageKey,
  type LessonProgressMap
} from "@/data/lessonProgress";
import { getLessonGroups, learnerLessons, lessons, teacherLessons } from "@/data/lessons";

const groupOpenStorageKey = "leea.teacher.lessonGroupsOpen.v1";

function componentAccent(component: string): string {
  if (component === "opener") return "var(--gold)";
  if (component.startsWith("vocab")) return "#54886f";
  if (component.startsWith("grammar")) return "#406a9f";
  if (component.startsWith("extra-reading")) return "#b87237";
  if (component.startsWith("reading")) return "#a66c3f";
  if (component.startsWith("writing")) return "#6d6875";
  if (component.startsWith("song")) return "#d94f7b";
  if (component.startsWith("review")) return "#237a3a";
  if (component === "mission") return "#237a3a";
  return "var(--hair)";
}

type TeacherLevel = {
  id: string;
  courseLabel: string;
  level?: number;
  unitGroups: ReturnType<typeof getLessonGroups>;
};

const checkpointComponents = [
  {
    component: "review",
    title: "Review",
    subtitle: "Mixed checkpoint lesson for vocabulary, grammar, listening, and reading from this unit band."
  },
  {
    component: "extra-reading",
    title: "Extra Reading",
    subtitle: "Extended reading checkpoint with comprehension, vocabulary, and Leo reading practice."
  }
];

function getUnitBand(unit?: number) {
  if (!unit) return { start: undefined, end: undefined };
  const start = Math.floor((unit - 1) / 3) * 3 + 1;
  return { start, end: start + 2 };
}

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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const groups = useMemo(() => getTeacherLevels(), []);

  useEffect(() => {
    function refreshAll() {
      setAssignments(readAssignments(learnerLessons));
      setAssignmentsReady(true);
      setProgressVersion((v) => v + 1);
    }

    const savedProgress = window.localStorage.getItem(lessonProgressStorageKey);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress) as LessonProgressMap);
      } catch {
        setProgress({});
      }
    }
    refreshAll();

    const savedGroups = window.localStorage.getItem(groupOpenStorageKey);
    if (savedGroups) {
      try {
        setOpenGroups(JSON.parse(savedGroups) as Record<string, boolean>);
      } catch {
        setOpenGroups({});
      }
    } else {
      setOpenGroups(Object.fromEntries(groups.map((g, i) => [g.id, i === 0])));
    }

    window.addEventListener("storage", refreshAll);
    window.addEventListener("focus", refreshAll);
    return () => {
      window.removeEventListener("storage", refreshAll);
      window.removeEventListener("focus", refreshAll);
    };
  }, [groups]);

  progressVersion;

  const doneCount = useMemo(
    () => getDoneLessonCount(teacherLessons.map((l) => l.id), progress),
    [progress]
  );

  const nextLearnerToAssign = useMemo(
    () =>
      learnerLessons.find(
        (lesson) => !assignments[lesson.id] && !getLearnerAppProgress(lesson.source).done
      ),
    [assignments, progressVersion]
  );

  function setLessonDone(lessonId: string, done: boolean) {
    setProgress((current) => {
      const next = { ...current, [lessonId]: createLessonProgressRecord(lessonId, done) };
      window.localStorage.setItem(lessonProgressStorageKey, JSON.stringify(next));
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
    <section className="teacher-page">
      <header className="teacher-hero">
        <span className="eyebrow">Neritan Teaching Mode</span>
        <h1>Teacher Menu</h1>
        <p>Open teacher lessons, assign Leo&apos;s homework, and track progress - all in one place.</p>
      </header>

      <section className="teacher-stats" aria-label="Teaching stats">
        <div>
          <span>Teacher Lessons</span>
          <strong>{teacherLessons.length}</strong>
        </div>
        <div>
          <span>Taught</span>
          <strong>{doneCount}</strong>
        </div>
        <div>
          <span>To Teach</span>
          <strong>{teacherLessons.length - doneCount}</strong>
        </div>
      </section>

      {assignmentsReady && (
        <section className="teacher-next-assignment" aria-label="Next Leo app to assign">
          {nextLearnerToAssign ? (
            <>
              <div>
                <span className="teacher-next-label">Next to assign</span>
                <h2>{nextLearnerToAssign.title}</h2>
                <p>
                  {nextLearnerToAssign.course === "our-world" ? "Our World" : nextLearnerToAssign.course} · Level {nextLearnerToAssign.level} · Unit {nextLearnerToAssign.unit}
                </p>
              </div>
              <div className="teacher-next-actions">
                <Link className="teacher-done-button" href={`/lessons/${nextLearnerToAssign.id}`}>
                  Open Leo App <ExternalLink size={15} />
                </Link>
                <button className="teacher-open-button" onClick={() => assignLesson(nextLearnerToAssign.id)} type="button">
                  <Circle size={16} /> Assign
                </button>
              </div>
            </>
          ) : (
            <div>
              <span className="teacher-next-label">Assignments ready</span>
              <h2>No Leo apps are waiting to be assigned.</h2>
            </div>
          )}
        </section>
      )}

      <div className="teacher-group-grid">
        {groups.map((group) => {
          const teacherInGroup = group.unitGroups.flatMap((unitGroup) => unitGroup.lessons.filter((l) => l.mode === "teacher"));
          const groupDone = getDoneLessonCount(teacherInGroup.map((l) => l.id), progress);
          const isOpen = openGroups[group.id] ?? true;

          return (
            <section className="teacher-group" id={group.id} key={group.id}>
              <button className="teacher-group-header" onClick={() => toggleGroup(group.id)} type="button">
                <span>
                  {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  {group.courseLabel}
                </span>
                <h2>
                  Level {group.level}
                </h2>
                <small>{groupDone} / {teacherInGroup.length} taught</small>
              </button>

              {isOpen ? (
                <div className="teacher-lesson-list">
                  {group.unitGroups.map((unitGroup, unitIndex) => {
                    const band = getUnitBand(unitGroup.unit);
                    const nextUnit = group.unitGroups[unitIndex + 1]?.unit;
                    const nextBand = getUnitBand(nextUnit);
                    const isLastUnitInVisibleBand = nextBand.start !== band.start;

                    return (
                      <div className="teacher-level-sequence" key={unitGroup.id}>
                        <div className="teacher-unit-section">
                      <div className="teacher-unit-label">
                        <span>Unit {unitGroup.unit}</span>
                      </div>
                      {unitGroup.lessons.filter((l) => l.mode === "teacher").map((lesson) => {
                        const record = progress[lesson.id];
                        const done = record?.status === "done";
                        const learnerCounterpart = unitGroup.lessons.find(
                          (l) => l.mode === "learner" && l.component === `${lesson.component}-app`
                        );
                        const assignment = learnerCounterpart ? assignments[learnerCounterpart.id] : undefined;
                        const appProgress = learnerCounterpart ? getLearnerAppProgress(learnerCounterpart.source) : null;
                        const accent = componentAccent(lesson.component);
                        return (
                          <article
                            className={done ? "teacher-lesson-card done" : "teacher-lesson-card"}
                            key={lesson.id}
                            style={{ borderLeft: `6px solid ${accent}` }}
                          >
                            <div className="teacher-lesson-main">
                              <div className="teacher-card-top">
                                <span style={{ color: lesson.component === "opener" ? "var(--gold-deep)" : accent }}>
                                  {lesson.component}
                                </span>
                              </div>
                              <h3>{lesson.title}</h3>
                              <p>{lesson.subtitle}</p>
                              <small>
                                {lesson.source.slideCount ?? 0} slides
                                {record?.completedAt ? ` - taught ${new Date(record.completedAt).toLocaleDateString()}` : ""}
                                {assignment ? ` - ${formatAssignmentStatus(assignment, appProgress?.done ?? false)}` : ""}
                              </small>
                              {appProgress && (
                                <div className="lesson-inline-progress">
                                  <span className="lesson-inline-label">Leo&apos;s App</span>
                                  <span className={appProgress.completedModules > 0 ? "lesson-inline-stat stat-done" : "lesson-inline-stat"}>
                                    {appProgress.completedModules} / {appProgress.moduleCount} modules
                                  </span>
                                  <span className={appProgress.score !== null ? "lesson-inline-stat stat-done" : "lesson-inline-stat"}>
                                    {appProgress.score !== null ? `Quiz ${appProgress.score}%` : "Quiz -"}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="teacher-lesson-actions">
                              <Link className="teacher-open-button" href={`/lessons/${lesson.id}`}>
                                Open <ExternalLink size={15} />
                              </Link>
                              <button
                                className={done ? "teacher-done-button active" : "teacher-done-button"}
                                onClick={() => setLessonDone(lesson.id, !done)}
                                type="button"
                              >
                                {done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                {done ? "Done" : "Mark Done"}
                              </button>
                              {learnerCounterpart && (
                                <div className="app-controls">
                                  <span className="app-controls-label">Leo&apos;s App</span>
                                  <Link className="teacher-done-button" href={`/lessons/${learnerCounterpart.id}`}>
                                    Open Leo App <ExternalLink size={15} />
                                  </Link>
                                  {!assignment ? (
                                    <button className="teacher-done-button" onClick={() => assignLesson(learnerCounterpart.id)} type="button">
                                      <Circle size={16} /> Assign
                                    </button>
                                  ) : (
                                    <button className="teacher-done-button active" disabled type="button">
                                      <CheckCircle2 size={16} /> Assigned
                                    </button>
                                  )}
                                  <Link className="teacher-done-button" href={`/teacher/review/${learnerCounterpart.id}`}>
                                    Review <ExternalLink size={15} />
                                  </Link>
                                  {assignment && (
                                    <button className="teacher-done-button ghost" onClick={() => unassignLesson(learnerCounterpart.id)} type="button">
                                      Unassign
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      })}
                        </div>
                        {isLastUnitInVisibleBand && (
                          <div className="teacher-checkpoint-section">
                            <div className="teacher-unit-label checkpoint">
                              <span>Checkpoint after Units {band.start}-{band.end}</span>
                            </div>
                            {checkpointComponents.map((checkpoint) => {
                              const accent = componentAccent(checkpoint.component);
                              return (
                                <article
                                  className="teacher-lesson-card planned"
                                  key={checkpoint.component}
                                  style={{ borderLeft: `6px solid ${accent}` }}
                                >
                                  <div className="teacher-lesson-main">
                                    <div className="teacher-card-top">
                                      <span style={{ color: accent }}>{checkpoint.component}</span>
                                    </div>
                                    <h3>
                                      {checkpoint.title} {band.start}-{band.end}
                                    </h3>
                                    <p>{checkpoint.subtitle}</p>
                                    <small>Planned checkpoint - teacher deck and Leo app will appear here when generated</small>
                                  </div>
                                  <div className="teacher-lesson-actions">
                                    <button className="teacher-done-button" disabled type="button">
                                      Planned
                                    </button>
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        )}
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

function formatAssignmentStatus(assignment: AssignmentRecord, appDone: boolean) {
  if (assignment.status === "reviewed") return "reviewed";
  if (assignment.status === "needs-redo") return "needs redo";
  if (appDone) return "ready to review";
  return "assigned";
}
