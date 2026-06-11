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
  if (component.startsWith("reading")) return "#a66c3f";
  if (component.startsWith("writing")) return "#6d6875";
  if (component === "mission") return "#237a3a";
  return "var(--hair)";
}

export function TeacherDashboard() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const [progressVersion, setProgressVersion] = useState(0);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const groups = useMemo(() => getLessonGroups(lessons), []);

  useEffect(() => {
    function refreshAll() {
      setAssignments(readAssignments(learnerLessons));
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
        <p>Open teacher lessons, assign Leo&apos;s homework, and track progress — all in one place.</p>
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

      <div className="teacher-group-grid">
        {groups.map((group) => {
          const teacherInGroup = group.lessons.filter((l) => l.mode === "teacher");
          const groupDone = getDoneLessonCount(teacherInGroup.map((l) => l.id), progress);
          const isOpen = openGroups[group.id] ?? true;

          return (
            <section className="teacher-group" id={group.id} key={group.id}>
              <button className="teacher-group-header" onClick={() => toggleGroup(group.id)} type="button">
                <span>
                  {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  {group.courseLabel}
                </span>
                <h2>Level {group.level} · Unit {group.unit}</h2>
                <small>{groupDone} / {teacherInGroup.length} taught</small>
              </button>

              {isOpen ? (
                <div className="teacher-lesson-list">
                  {group.lessons.filter((l) => l.mode === "teacher").map((lesson) => {
                    const record = progress[lesson.id];
                    const done = record?.status === "done";
                    const learnerCounterpart = group.lessons.find(
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
                            {record?.completedAt ? ` · taught ${new Date(record.completedAt).toLocaleDateString()}` : ""}
                            {assignment ? ` · ${formatAssignmentStatus(assignment, appProgress?.done ?? false)}` : ""}
                          </small>
                          {appProgress && (
                            <div className="lesson-inline-progress">
                              <span className="lesson-inline-label">Leo&apos;s App</span>
                              <span className={appProgress.completedModules > 0 ? "lesson-inline-stat stat-done" : "lesson-inline-stat"}>
                                {appProgress.completedModules} / {appProgress.moduleCount} modules
                              </span>
                              <span className={appProgress.score !== null ? "lesson-inline-stat stat-done" : "lesson-inline-stat"}>
                                {appProgress.score !== null ? `Quiz ${appProgress.score}%` : "Quiz —"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="teacher-lesson-actions">
                          {/* Teaching controls */}
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
                          {/* Leo's app controls, grouped and tinted */}
                          {learnerCounterpart && (
                            <div className="app-controls">
                              <span className="app-controls-label">Leo&apos;s App</span>
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
