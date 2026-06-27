"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOpenAssignmentCount, readAssignments, type AssignmentMap } from "@/data/assignments";
import { getLearnerAppProgress } from "@/data/learnerProgress";
import { getDoneLessonCount, lessonProgressStorageKey, type LessonProgressMap } from "@/data/lessonProgress";
import { learnerLessons, teacherLessons } from "@/data/lessons";
import { allGrammar, allWords } from "@/components/reference/ref-data";
import type { Lesson } from "@/data/types";
import { getComponentMeta } from "./componentMeta";
import { useKnownWordIds } from "./useKnownWordIds";

export function HomeDashboard() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const [progressVersion, setProgressVersion] = useState(0);
  const openAssignmentCount = getOpenAssignmentCount(assignments);
  const totalWords = allWords.length;
  const grammarPoints = allGrammar.length;
  const { knownWordSet } = useKnownWordIds();
  const knownCount = knownWordSet.size;
  const reviewCount = Math.max(0, totalWords - knownCount);
  const totalLessonsDone = getDoneLessonCount(teacherLessons.map((lesson) => lesson.id), progress);
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
    <div className="design-home">
      <section className="design-home-hero">
        <div className="design-home-copy">
          <span>{new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}</span>
          <h1>Hey Leo —<br />ready to grow<br />today?</h1>
          <p>You&apos;re {openAssignmentCount} {openAssignmentCount === 1 ? "assignment" : "assignments"} from a clean week. Pick up where you left off in Our World, Unit 8.</p>
          <div className="design-home-pills"><b>{knownCount} words known</b><b>{reviewCount} to review</b></div>
        </div>
        <NextCard nextItem={nextItem} progress={progress} />
      </section>

      <section className="design-home-role-links">
        <Link href="/leo"><span className="role-link-icon">♙</span><div><small>Learner</small><h2>Leo&apos;s homework</h2><p>{openAssignmentCount} waiting · practice &amp; review</p></div><b>→</b></Link>
        <Link href="/teacher"><span className="role-link-icon teacher">▣</span><div><small>Teacher</small><h2>Neritan&apos;s menu</h2><p>Assign, review &amp; track progress</p></div><b>→</b></Link>
      </section>

      <section className="design-home-stats" aria-label="Academy statistics">
        <SnapshotItem label="Lessons done" value={String(totalLessonsDone)} detail="teacher lessons" />
        <SnapshotItem label="Words known" value={String(knownCount)} detail="reference memory" />
        <SnapshotItem label="To review" value={String(reviewCount)} detail="words still learning" />
        <SnapshotItem label="Grammar points" value={String(grammarPoints)} detail="reference cards" />
      </section>

      <section className="design-subjects">
        <header><h2>Subjects</h2><span>Pick a subject to jump into its courses</span></header>
        <div className="design-subject-grid">
          <Link className="subject-card active" href="/english"><div><span>Active</span><b>📖</b></div><h3>English</h3><p>Our World, Joyful Work &amp; Training Ground.</p><footer><span>3 courses</span><span>L4 · U8</span></footer></Link>
          <article className="subject-card planned"><div><span>Soon</span><b>🔢</b></div><h3>Math</h3><p>Number sense, problem solving &amp; drills.</p><footer><span>Planned</span></footer></article>
          <article className="subject-card planned"><div><span>Soon</span><b>🔬</b></div><h3>Science</h3><p>Inquiry, experiments &amp; the natural world.</p><footer><span>Planned</span></footer></article>
          <article className="subject-card planned"><div><span>Soon</span><b>🏛️</b></div><h3>History</h3><p>People, places &amp; the story of the world.</p><footer><span>Planned</span></footer></article>
        </div>
      </section>
    </div>
  );
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
        <span>Next up</span>
      </div>
      <div>
        <p>
          English · {getCourseDisplay(nextItem.lesson.course)} · L{nextItem.lesson.level} · Unit {nextItem.lesson.unit}
        </p>
        <h2>{nextItem.lesson.title}</h2>
        <div className="home-next-progress-label">
          <span>Progress</span><strong>{nextProgress.label}</strong>
        </div>
        <div className="next-progress" aria-label={`${nextProgress.percent}% progress`}>
          <span style={{ width: `${nextProgress.percent}%` }} />
        </div>
      </div>
      <Link className="primary-button" href={`/lessons/${nextItem.lesson.id}`}>
        {nextProgress.percent > 0 ? "Keep going" : "Start now"}
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
