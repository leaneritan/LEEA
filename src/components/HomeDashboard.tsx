"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDoneLessonCount, lessonProgressStorageKey, type LessonProgressMap } from "@/data/lessonProgress";
import { getCurrentFocusLessons, learnerLessons, teacherLessons } from "@/data/lessons";
import { currentFocus } from "@/data/registry";
import type { Lesson } from "@/data/types";

export function HomeDashboard() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const [progressVersion, setProgressVersion] = useState(0);
  const focusLessons = getCurrentFocusLessons(currentFocus.courseId, currentFocus.level, currentFocus.unit);
  const doneCount = getDoneLessonCount(
    focusLessons.map((lesson) => lesson.id),
    progress
  );
  const progressPercent = focusLessons.length ? Math.round((doneCount / focusLessons.length) * 100) : 0;
  const nextItem = getHomeNextItem(progress);

  useEffect(() => {
    function refreshProgress() {
      const saved = window.localStorage.getItem(lessonProgressStorageKey);
      if (saved) {
        try {
          setProgress(JSON.parse(saved) as LessonProgressMap);
        } catch {
          setProgress({});
        }
      }
      setProgressVersion((current) => current + 1);
    }

    refreshProgress();
    window.addEventListener("storage", refreshProgress);
    window.addEventListener("focus", refreshProgress);
    return () => {
      window.removeEventListener("storage", refreshProgress);
      window.removeEventListener("focus", refreshProgress);
    };
  }, []);

  progressVersion;

  return (
    <div className="stack">
      <section className="home-hero">
        <div className="hero-card">
          <span className="eyebrow">Active Session</span>
          <h1>
            Leo&apos;s <mark>Elite</mark> Education Academy
          </h1>
          <p>Teach, practice, and look up every word and grammar point from one consistent place.</p>

          <div className="mode-grid">
            <ModeCard title="Neritan" label="Teaching mode" text="Open teacher decks, assign Leo apps, and track progress." href="/teacher" />
            <ModeCard title="Leo" label="Learning mode" text="Do assigned practice, complete review cards, and continue homework." href="/leo" learner />
            <ModeCard title="Look It Up" label="Reference" text="Search vocabulary, grammar, I Know, and I Don't Know." href="/reference" />
          </div>
        </div>

        <aside className="next-card">
          <div className="next-top">
            <span>{nextItem.label}</span>
            <b>{nextItem.status}</b>
          </div>
          <div>
            <p>
              {getCourseDisplay(nextItem.lesson.course)} - Level {nextItem.lesson.level} - Unit {nextItem.lesson.unit}
            </p>
            <h2>{nextItem.lesson.title}</h2>
          </div>
          <Link className="primary-button" href={`/lessons/${nextItem.lesson.id}`}>
            {nextItem.lesson.mode === "learner" ? "Open Homework" : "Open Lesson"}
          </Link>
        </aside>
      </section>

      <section className="focus-banner" aria-label="Current unit focus">
        <div>
          <span className="eyebrow">Current Focus</span>
          <h2>
            {currentFocus.course} - Level {currentFocus.level} - Unit {currentFocus.unit}
          </h2>
          <p>{currentFocus.title}</p>
        </div>
        <div className="focus-goal">
          <span>{currentFocus.goalLabel}</span>
          <strong>{currentFocus.targetDate}</strong>
        </div>
        <div className="focus-progress">
          <div className="focus-progress-top">
            <span>{doneCount} done</span>
            <span>{focusLessons.length} lessons</span>
          </div>
          <div className="focus-progress-bar" aria-label={`${progressPercent}% complete`}>
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <small>{progressPercent}% complete</small>
        </div>
      </section>
    </div>
  );
}

function getHomeNextItem(progress: LessonProgressMap) {
  const assignedLesson = learnerLessons.find((lesson) => lesson.status === "assigned" && !isLearnerLessonDone(lesson));

  if (assignedLesson) {
    return {
      label: "Assignment",
      status: "homework",
      lesson: assignedLesson
    };
  }

  const nextTeacherLesson = teacherLessons.find((lesson) => progress[lesson.id]?.status !== "done");

  if (nextTeacherLesson) {
    return {
      label: "Coming Up Next",
      status: "to teach",
      lesson: nextTeacherLesson
    };
  }

  return {
    label: "Current Focus",
    status: "done",
    lesson: learnerLessons[0] ?? teacherLessons[0]
  };
}

function isLearnerLessonDone(lesson: Lesson) {
  if (typeof window === "undefined") return false;
  const storagePrefix = lesson.source.storagePrefix;
  if (!storagePrefix) return false;

  return Boolean(loadLocalValue(`${storagePrefix}done`, false) || loadLocalValue<{ done?: boolean } | null>(`${storagePrefix}score`, null)?.done);
}

function loadLocalValue<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : (JSON.parse(value) as T);
  } catch {
    return fallback;
  }
}

function getCourseDisplay(course: Lesson["course"]) {
  if (course === "our-world") return "Our World";
  if (course === "joyful-work") return "Joyful Work";
  return "Training Ground";
}

function ModeCard({
  title,
  label,
  text,
  active,
  href,
  learner
}: {
  title: string;
  label: string;
  text: string;
  active?: boolean;
  href?: string;
  learner?: boolean;
}) {
  const content = (
    <>
      <span className="mode-label">{label}</span>
      <h2>{title}</h2>
      <p>{text}</p>
      <span className="mode-action">{href ? "Open" : active ? "Ready" : "Dashboard"}</span>
    </>
  );

  return href ? (
    <Link className={`mode-card ${title === "Look It Up" ? "reference" : learner ? "active" : "teaching"}`} href={href}>
      {content}
    </Link>
  ) : (
    <div className={active ? "mode-card active" : "mode-card"}>{content}</div>
  );
}
