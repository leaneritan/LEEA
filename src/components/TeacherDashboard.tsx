"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createLessonProgressRecord, lessonProgressStorageKey, type LessonProgressRecord } from "@/data/lessonProgress";
import { lessons } from "@/data/lessons";

type ProgressMap = Record<string, LessonProgressRecord>;

export function TeacherDashboard() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    const saved = window.localStorage.getItem(lessonProgressStorageKey);
    if (!saved) return;

    try {
      setProgress(JSON.parse(saved) as ProgressMap);
    } catch {
      setProgress({});
    }
  }, []);

  const doneCount = useMemo(
    () => lessons.filter((lesson) => progress[lesson.id]?.status === "done").length,
    [progress]
  );

  const grouped = lessons.reduce<Record<string, typeof lessons>>((groups, lesson) => {
    const key = `${lesson.course}|${lesson.level ?? "n/a"}|${lesson.unit ?? "n/a"}`;
    groups[key] = [...(groups[key] ?? []), lesson];
    return groups;
  }, {});

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
          <strong>{lessons.length}</strong>
        </div>
        <div>
          <span>Done</span>
          <strong>{doneCount}</strong>
        </div>
        <div>
          <span>To Teach</span>
          <strong>{lessons.length - doneCount}</strong>
        </div>
      </section>

      <div className="teacher-group-grid">
        {Object.entries(grouped).map(([key, group]) => {
          const first = group[0];
          return (
            <section className="teacher-group" key={key}>
              <div className="teacher-group-header">
                <span>{first.course === "our-world" ? "Our World" : first.course}</span>
                <h2>
                  Level {first.level} - Unit {first.unit}
                </h2>
              </div>
              <div className="teacher-lesson-list">
                {group.map((lesson) => {
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
