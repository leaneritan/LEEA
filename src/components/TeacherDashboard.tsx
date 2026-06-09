"use client";

import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronRight, Circle, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  assignmentStorageKey,
  createAssignmentRecord,
  seedAssignments,
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
import { getLessonGroups, learnerLessons, teacherLessons } from "@/data/lessons";

const groupOpenStorageKey = "leea.teacher.lessonGroupsOpen.v1";

export function TeacherDashboard() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const [progressVersion, setProgressVersion] = useState(0);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const groups = useMemo(() => getLessonGroups(teacherLessons), []);

  useEffect(() => {
    function refreshAssignments() {
      setAssignments(readAssignments());
      setProgressVersion((current) => current + 1);
    }

    const savedProgress = window.localStorage.getItem(lessonProgressStorageKey);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress) as LessonProgressMap);
      } catch {
        setProgress({});
      }
    }
    refreshAssignments();

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

    window.addEventListener("storage", refreshAssignments);
    window.addEventListener("focus", refreshAssignments);
    return () => {
      window.removeEventListener("storage", refreshAssignments);
      window.removeEventListener("focus", refreshAssignments);
    };
  }, [groups]);

  progressVersion;

  const doneCount = useMemo(
    () =>
      getDoneLessonCount(
        teacherLessons.map((lesson) => lesson.id),
        progress
      ),
    [progress]
  );

  function setLessonDone(lessonId: string, done: boolean) {
    setProgress((current) => {
      const next = {
        ...current,
        [lessonId]: createLessonProgressRecord(lessonId, done)
      };
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
    setAssignments((current) => {
      const next = {
        ...current,
        [lessonId]: current[lessonId] ?? createAssignmentRecord(lessonId)
      };
      window.localStorage.setItem(assignmentStorageKey, JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="teacher-page">
      <header className="teacher-hero">
        <span className="eyebrow">Neritan Teaching Mode</span>
        <h1>Teacher Menu</h1>
        <p>Open Leo&apos;s teacher lessons, track what you have taught, and keep lesson progress ready for Supabase later.</p>
      </header>

      <section className="teacher-stats" aria-label="Teaching stats">
        <div>
          <span>Lessons</span>
          <strong>{teacherLessons.length}</strong>
        </div>
        <div>
          <span>Done</span>
          <strong>{doneCount}</strong>
        </div>
        <div>
          <span>To Teach</span>
          <strong>{teacherLessons.length - doneCount}</strong>
        </div>
      </section>

      <div className="teacher-group-grid">
        {groups.map((group) => {
          const groupDone = getDoneLessonCount(
            group.lessons.map((lesson) => lesson.id),
            progress
          );
          const isOpen = openGroups[group.id] ?? true;

          return (
            <section className="teacher-group" id={group.id} key={group.id}>
              <button className="teacher-group-header" onClick={() => toggleGroup(group.id)} type="button">
                <span>
                  {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  {group.courseLabel}
                </span>
                <h2>
                  Level {group.level} - Unit {group.unit}
                </h2>
                <small>
                  {groupDone} / {group.lessons.length} done
                </small>
              </button>

              {isOpen ? (
                <div className="teacher-lesson-list">
                  {group.lessons.map((lesson) => {
                    const record = progress[lesson.id];
                    const done = record?.status === "done";
                    return (
                      <article className={done ? "teacher-lesson-card done" : "teacher-lesson-card"} key={lesson.id}>
                        <div className="teacher-lesson-main">
                          <span>{lesson.component}</span>
                          <h3>{lesson.title}</h3>
                          <p>{lesson.subtitle}</p>
                          <small>
                            {lesson.mode} mode - {lesson.source.slideCount ?? 0} slides
                            {record?.completedAt ? ` - done ${new Date(record.completedAt).toLocaleDateString()}` : ""}
                          </small>
                        </div>
                        <div className="teacher-lesson-actions">
                          <Link className="teacher-open-button" href={`/lessons/${lesson.id}`}>
                            Open Lesson
                            <ExternalLink size={16} />
                          </Link>
                          <button
                            className={done ? "teacher-done-button active" : "teacher-done-button"}
                            onClick={() => setLessonDone(lesson.id, !done)}
                            type="button"
                          >
                            {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                            {done ? "Done" : "Mark Done"}
                          </button>
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

      <section className="teacher-homework-panel">
        <div className="teacher-section-head">
          <span className="eyebrow">Leo Homework</span>
          <h2>Assign & Review</h2>
        </div>
        <div className="teacher-homework-list">
          {learnerLessons.map((lesson) => {
            const assignment = assignments[lesson.id];
            const appProgress = getLearnerAppProgress(lesson.source);
            return (
              <article className="teacher-homework-card" key={lesson.id}>
                <div className="teacher-lesson-main">
                  <span>{lesson.component}</span>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.subtitle}</p>
                  <small>{formatAssignmentStatus(assignment, appProgress.done)}</small>
                </div>
                <div className="teacher-review-summary">
                  <strong>
                    {appProgress.completedModules} / {appProgress.moduleCount} modules
                  </strong>
                  <span>{appProgress.score !== null ? `Quiz ${appProgress.score}%` : "Quiz not finished"}</span>
                </div>
                <div className="teacher-lesson-actions">
                  <button className={assignment ? "teacher-done-button active" : "teacher-done-button"} onClick={() => assignLesson(lesson.id)} type="button">
                    {assignment ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    {assignment ? "Assigned" : "Assign to Leo"}
                  </button>
                  <Link className="teacher-open-button" href={`/teacher/review/${lesson.id}`}>
                    Review
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="supabase-note">
        <h2>Supabase Ready</h2>
        <p>
          This tracker is local for now, but the record shape is ready for a future `lesson_progress` table:
          `lessonId`, `teacherId`, `studentId`, `status`, `completedAt`, and `updatedAt`.
        </p>
      </section>
    </section>
  );
}

function readAssignments() {
  try {
    const saved = window.localStorage.getItem(assignmentStorageKey);
    const parsed = saved ? (JSON.parse(saved) as AssignmentMap) : {};
    const seeded = seedAssignments(learnerLessons, parsed);
    window.localStorage.setItem(assignmentStorageKey, JSON.stringify(seeded));
    return seeded;
  } catch {
    const seeded = seedAssignments(learnerLessons, {});
    window.localStorage.setItem(assignmentStorageKey, JSON.stringify(seeded));
    return seeded;
  }
}

function formatAssignmentStatus(assignment: AssignmentRecord | undefined, appDone: boolean) {
  if (!assignment) return "not assigned";
  if (assignment.status === "reviewed") return "reviewed";
  if (assignment.status === "needs-redo") return "needs redo";
  if (appDone) return "ready to review";
  return "assigned";
}
