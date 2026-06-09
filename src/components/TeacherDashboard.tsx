"use client";

import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronRight, Circle, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createLessonProgressRecord,
  getDoneLessonCount,
  lessonProgressStorageKey,
  type LessonProgressMap
} from "@/data/lessonProgress";
import { getLessonGroups, teacherLessons } from "@/data/lessons";

const groupOpenStorageKey = "leea.teacher.lessonGroupsOpen.v1";

export function TeacherDashboard() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const groups = useMemo(() => getLessonGroups(teacherLessons), []);

  useEffect(() => {
    const savedProgress = window.localStorage.getItem(lessonProgressStorageKey);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress) as LessonProgressMap);
      } catch {
        setProgress({});
      }
    }

    const savedGroups = window.localStorage.getItem(groupOpenStorageKey);
    if (savedGroups) {
      try {
        setOpenGroups(JSON.parse(savedGroups) as Record<string, boolean>);
        return;
      } catch {
        setOpenGroups({});
      }
    }

    setOpenGroups(Object.fromEntries(groups.map((group, index) => [group.id, index === 0])));
  }, [groups]);

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
