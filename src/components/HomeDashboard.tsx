"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDoneLessonCount, lessonProgressStorageKey, type LessonProgressMap } from "@/data/lessonProgress";
import { getCurrentFocusLessons } from "@/data/lessons";
import { currentFocus, nextAssignment } from "@/data/registry";

export function HomeDashboard() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const focusLessons = getCurrentFocusLessons(currentFocus.courseId, currentFocus.level, currentFocus.unit);
  const doneCount = getDoneLessonCount(
    focusLessons.map((lesson) => lesson.id),
    progress
  );
  const progressPercent = focusLessons.length ? Math.round((doneCount / focusLessons.length) * 100) : 0;

  useEffect(() => {
    const saved = window.localStorage.getItem(lessonProgressStorageKey);
    if (!saved) return;

    try {
      setProgress(JSON.parse(saved) as LessonProgressMap);
    } catch {
      setProgress({});
    }
  }, []);

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
            <ModeCard title="Leo" label="Learning mode" text="Do assigned practice, complete review cards, and continue homework." active />
            <ModeCard title="Look It Up" label="Reference" text="Search vocabulary, grammar, I Know, and I Don't Know." href="/reference" />
          </div>
        </div>

        <aside className="next-card">
          <div className="next-top">
            <span>Teaching Queue</span>
            <b>{nextAssignment.status}</b>
          </div>
          <div>
            <p>
              {nextAssignment.course} - Level {nextAssignment.level} - Unit {nextAssignment.unit}
            </p>
            <h2>{nextAssignment.component}</h2>
          </div>
          <Link className="primary-button" href={`/lessons/${nextAssignment.lessonId}`}>
            Open Lesson
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

function ModeCard({
  title,
  label,
  text,
  active,
  href
}: {
  title: string;
  label: string;
  text: string;
  active?: boolean;
  href?: string;
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
    <Link className={`mode-card ${title === "Look It Up" ? "reference" : "teaching"}`} href={href}>
      {content}
    </Link>
  ) : (
    <div className={active ? "mode-card active" : "mode-card"}>{content}</div>
  );
}
