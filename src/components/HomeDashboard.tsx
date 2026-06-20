"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getOpenAssignmentCount, readAssignments, type AssignmentMap } from "@/data/assignments";
import { getLearnerAppProgress } from "@/data/learnerProgress";
import { getDoneLessonCount, lessonProgressStorageKey, type LessonProgressMap } from "@/data/lessonProgress";
import { getCurrentFocusLessons, learnerLessons, teacherLessons } from "@/data/lessons";
import { currentFocus, grammarPoints, totalWords } from "@/data/registry";
import type { Lesson } from "@/data/types";
import { getComponentMeta } from "./componentMeta";

export function HomeDashboard() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const [progressVersion, setProgressVersion] = useState(0);
  const focusLessons = getCurrentFocusLessons(currentFocus.courseId, currentFocus.level, currentFocus.unit);
  const focusComponents = getUniqueFocusComponents(focusLessons);
  const doneCount = getDoneLessonCount(
    focusComponents.map((lesson) => lesson.id),
    progress
  );
  const progressPercent = focusComponents.length ? Math.round((doneCount / focusComponents.length) * 100) : 0;
  const openAssignmentCount = getOpenAssignmentCount(assignments);
  const nextItem = getHomeNextItem(progress, assignments);

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
      setAssignments(readAssignments(learnerLessons));
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
          <div className="home-hero-head">
            <div className="home-brand-mark" aria-hidden="true">
              <Image alt="" height={118} src="/brand/leea_brand_mark.png" width={118} />
            </div>
            <div>
              <span className="eyebrow">Active Session</span>
              <h1>
                Leo&apos;s <mark>Elite</mark> Education Academy
              </h1>
              <p>Teach, practice, and look up every word and grammar point from one consistent place.</p>
            </div>
          </div>

          <div className="home-snapshot" aria-label="Academy overview">
            <SnapshotItem label="Homework" value={String(openAssignmentCount)} detail={openAssignmentCount === 1 ? "open assignment" : "open assignments"} />
            <SnapshotItem label="Unit Progress" value={`${progressPercent}%`} detail={`${doneCount}/${focusComponents.length} components`} />
            <SnapshotItem label="Reference" value={String(totalWords + grammarPoints)} detail="cards ready" />
          </div>

          <div className="mode-grid">
            <ModeCard title="Neritan" label="Teaching mode" text="Open teacher decks, assign Leo apps, and track progress." href="/teacher" />
            <ModeCard title="Leo" label="Learning mode" text="Do assigned practice, complete review cards, and continue homework." href="/leo" learner />
            <ModeCard title="Look It Up" label="Reference" text="Search vocabulary, grammar, I Know, and I Don't Know." href="/reference" />
          </div>
        </div>

        <NextCard nextItem={nextItem} progress={progress} />
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
            <span>{focusComponents.length} {focusComponents.length === 1 ? "lesson" : "lessons"}</span>
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

function getUniqueFocusComponents(items: Lesson[]) {
  const components = new Map<string, Lesson>();

  items.forEach((lesson) => {
    const key = getComponentFamily(lesson.component);
    const existing = components.get(key);

    if (!existing || (existing.mode === "learner" && lesson.mode === "teacher")) {
      components.set(key, lesson);
    }
  });

  return Array.from(components.values());
}

function getComponentFamily(component: string) {
  return component.replace(/-app$/, "");
}

function getHomeNextItem(progress: LessonProgressMap, assignments: AssignmentMap) {
  const assignedLesson = learnerLessons
    .reduce<{ lesson: Lesson; updatedAt: number }[]>((current, lesson) => {
      const assignment = assignments[lesson.id];
      if (!assignment || !isOpenAssignment(assignment.status) || isLearnerLessonDone(lesson)) return current;
      current.push({ lesson, updatedAt: getAssignmentTimestamp(assignment) });
      return current;
    }, [])
    .sort((a, b) => b.updatedAt - a.updatedAt)[0]?.lesson;

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

function isOpenAssignment(status: string) {
  return status === "assigned" || status === "needs-redo";
}

function getAssignmentTimestamp(assignment: NonNullable<AssignmentMap[string]>) {
  const timestamp = Date.parse(assignment.updatedAt || assignment.assignedAt);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isLearnerLessonDone(lesson: Lesson) {
  if (typeof window === "undefined") return false;
  return getLearnerAppProgress(lesson.source).done;
}

function getCourseDisplay(course: Lesson["course"]) {
  if (course === "our-world") return "Our World";
  if (course === "joyful-work") return "Joyful Work";
  return "Training Ground";
}

function getModeDisplay(mode: Lesson["mode"]) {
  return mode === "learner" ? "Leo" : "Neritan";
}

function getNextProgress(lesson: Lesson, progress: LessonProgressMap) {
  if (lesson.mode === "learner") {
    const appProgress = getLearnerAppProgress(lesson.source);
    return {
      label: `${appProgress.completedModules}/${appProgress.moduleCount} modules`,
      percent: appProgress.moduleCount ? Math.round((appProgress.completedModules / appProgress.moduleCount) * 100) : 0
    };
  }

  const done = progress[lesson.id]?.status === "done";
  return {
    label: done ? "Marked done" : "Ready to teach",
    percent: done ? 100 : 0
  };
}

function NextCard({ nextItem, progress }: { nextItem: { label: string; status: string; lesson: Lesson }; progress: LessonProgressMap }) {
  const meta = getComponentMeta(nextItem.lesson.component);
  const nextProgress = getNextProgress(nextItem.lesson, progress);
  return (
    <aside className={`next-card next-card-${meta.tone}`}>
      <div className="next-top">
        <span>
          <span aria-hidden="true" className="next-emoji">{meta.emoji}</span>
          {nextItem.label}
        </span>
        <b>{nextItem.status}</b>
      </div>
      <div>
        <p>
          {getCourseDisplay(nextItem.lesson.course)} - Level {nextItem.lesson.level} - Unit {nextItem.lesson.unit}
        </p>
        <h2>{nextItem.lesson.title}</h2>
        <div className="next-meta-grid">
          <span>
            Mode
            <strong>{getModeDisplay(nextItem.lesson.mode)}</strong>
          </span>
          <span>
            Focus
            <strong>{meta.label}</strong>
          </span>
          <span>
            Progress
            <strong>{nextProgress.label}</strong>
          </span>
        </div>
        <div className="next-progress" aria-label={`${nextProgress.percent}% progress`}>
          <span style={{ width: `${nextProgress.percent}%` }} />
        </div>
      </div>
      <Link className="primary-button" href={`/lessons/${nextItem.lesson.id}`}>
        {nextItem.lesson.mode === "learner" ? "Open Homework" : "Open Lesson"}
      </Link>
    </aside>
  );
}

function SnapshotItem({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="snapshot-item">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
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
