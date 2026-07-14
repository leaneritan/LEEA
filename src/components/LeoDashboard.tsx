"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readAssignments, readAssignmentsFromCloud, type AssignmentMap, type AssignmentRecord } from "@/data/assignments";
import { getLearnerAppProgress, syncLearnerProgressWithCloud, type LearnerAppProgress } from "@/data/learnerProgress";
import { getCourseLabel, getLessonGroups, learnerLessons } from "@/data/lessons";
import type { Lesson } from "@/data/types";
import { getComponentMeta } from "./componentMeta";
import { LeoHomeworkHero } from "./LeoHomeworkHero";
import { LeoLibraryNavigator } from "./LeoLibraryNavigator";
import { allWords } from "./reference/ref-data";
import { useKnownWordIds } from "./useKnownWordIds";

const trainingGroundLearnerLessons = learnerLessons.filter((lesson) => lesson.course === "special-training");

export function LeoDashboard() {
  const [progressVersion, setProgressVersion] = useState(0);
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const assignedLessons = useMemo(() => learnerLessons.filter((lesson) => assignments[lesson.id]), [assignments]);
  const groups = useMemo(() => getLessonGroups(learnerLessons), []);
  const { knownWordSet } = useKnownWordIds();

  useEffect(() => {
    const refresh = () => {
      setAssignments(readAssignments(learnerLessons));
      void readAssignmentsFromCloud(learnerLessons).then(setAssignments);
      void syncLearnerProgressWithCloud(learnerLessons).then((changed) => {
        if (changed) setProgressVersion((current) => current + 1);
      });
      setProgressVersion((current) => current + 1);
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const appProgress = useMemo(() => {
    progressVersion;
    return Object.fromEntries(learnerLessons.map((lesson) => [lesson.id, getLearnerAppProgress(lesson.source)]));
  }, [progressVersion]);

  const heroItems = useMemo(
    () => assignedLessons.map((lesson) => ({ lesson, progress: appProgress[lesson.id] })).filter((item) => item.progress),
    [assignedLessons, appProgress]
  );
  const todaysHomework = useMemo(
    () => heroItems.filter((item) => !item.progress.done).sort((a, b) => b.progress.completedModules - a.progress.completedModules),
    [heroItems]
  );
  // Once everything Dad assigned is done and nothing new is waiting, surface
  // the natural next lesson (in unit/component order) so Leo isn't stuck —
  // but this is only a suggestion, not a real assignment Dad made.
  const suggestedNextLesson = useMemo(() => {
    if (todaysHomework.length > 0) return undefined;
    return learnerLessons.find((lesson) => !assignments[lesson.id] && !getLearnerAppProgress(lesson.source).done);
  }, [todaysHomework, assignments]);
  const suggestedItem = useMemo(() => {
    if (!suggestedNextLesson) return undefined;
    return { lesson: suggestedNextLesson, progress: appProgress[suggestedNextLesson.id] ?? getLearnerAppProgress(suggestedNextLesson.source) };
  }, [suggestedNextLesson, appProgress]);
  const focusItem = todaysHomework[0] ?? suggestedItem;
  const totalDone = useMemo(() => Object.values(appProgress).filter((progress) => progress.done).length, [appProgress]);

  return (
    <section className="leo-page">
      <LeoHomeworkHero items={heroItems} suggested={suggestedItem} />

      <section className="leo-today-section">
        <header>
          <h2>Today&apos;s homework</h2>
          <span>From Dad · finish them all for a 🔥 streak</span>
        </header>
        <div className="leo-today-list">
          {focusItem ? (
            <LeoHomeworkRow
              assignment={assignments[focusItem.lesson.id]}
              key={focusItem.lesson.id}
              lesson={focusItem.lesson}
              progress={focusItem.progress}
              suggested={!todaysHomework.length}
            />
          ) : (
            <article className="leo-note-card">
              <span className="leo-note-avatar">L</span>
              <div>
                <small>Nice work</small>
                <p>You finished today&apos;s homework. Free play is open below.</p>
              </div>
            </article>
          )}
        </div>
      </section>

      <article className="leo-note-card">
        <span className="leo-note-avatar">N</span>
        <div>
          <small>A note from Dad</small>
          <p>Focus on one app at a time. Keep going, check your answers, and use Reference when a word feels tricky. ⚽</p>
        </div>
      </article>

      <section className="leo-worlds-section">
        <header>
          <h2>Your worlds</h2>
          <span>Free play — anytime you like</span>
        </header>
        <div className="leo-world-grid">
          <Link className="leo-world-card leo-world-card-ow" href="/english/our-world/level-4/unit-8">
            <div><b>Our<br />World</b></div>
            <h3>Our World</h3>
            <footer><i><span style={{ width: "62%" }} /></i><small>L4 · U8</small></footer>
          </Link>
          <Link className="leo-world-card leo-world-card-jw" href="/english">
            <div><img alt="" src="/brand/joyful_work_logo.png" /></div>
            <h3>Joyful Work</h3>
            <footer><small>Year 1</small></footer>
          </Link>
          <Link className="leo-world-card leo-world-card-tg" href="/english/training-ground">
            <div><b>Training<br />Ground</b></div>
            <h3>Training Ground</h3>
            <footer><small>{trainingGroundLearnerLessons.length} sessions</small></footer>
          </Link>
        </div>
        <div className="leo-mini-stats">
          <div><span>📚</span><strong>{knownWordSet.size}</strong><small>words known</small></div>
          <div><span>🔁</span><strong>{Math.max(0, allWords.length - knownWordSet.size)}</strong><small>to review</small></div>
          <div><span>🏅</span><strong>{totalDone}</strong><small>lessons done</small></div>
        </div>
      </section>

      <section className="leo-library-section">
        <header>
          <h2>Full Leo library</h2>
          <span>Everything Dad has built for you</span>
        </header>
        <LeoLibraryNavigator appProgress={appProgress} assignments={assignments} groups={groups} />
      </section>
    </section>
  );
}

function LeoHomeworkRow({
  assignment,
  lesson,
  progress,
  suggested
}: {
  assignment: AssignmentRecord | undefined;
  lesson: Lesson;
  progress: LearnerAppProgress;
  suggested?: boolean;
}) {
  const meta = getComponentMeta(lesson.component);
  const percent = progress.moduleCount ? Math.round((progress.completedModules / progress.moduleCount) * 100) : 0;
  const isStarted = progress.completedModules > 0;
  const statusKey = suggested ? "up-next" : assignment?.status === "needs-redo" ? "redo" : isStarted ? "progress" : "new";
  const statusLabel = suggested ? "Up next" : assignment?.status === "needs-redo" ? "Try again" : isStarted ? "In progress" : "New from Dad";

  return (
    <article className={`leo-homework-row leo-homework-row-${meta.tone}`}>
      <span className="leo-homework-icon" aria-hidden="true">{meta.emoji}</span>
      <div className="leo-homework-copy">
        <small>{meta.label} · {getCourseLabel(lesson.course)}</small>
        <h3>{cleanLessonTitle(lesson.title)}</h3>
        <p>{cleanLessonSubtitle(lesson.subtitle)}</p>
        {progress.moduleCount ? (
          <div className="leo-homework-meter" aria-label={`${percent}% complete`}>
            <i style={{ width: `${percent}%` }} />
            <b>{progress.completedModules}/{progress.moduleCount}</b>
          </div>
        ) : null}
      </div>
      <div className="leo-homework-action">
        <span className={`status-${statusKey}`}>{statusLabel}</span>
        <Link href={`/lessons/${lesson.id}`}>{isStarted ? "Keep going" : "Start"}</Link>
      </div>
    </article>
  );
}

function cleanLessonTitle(title: string) {
  return title.replace(/^Unit \d+ /, "").replace(/ App$/, "").replace(/ Leo's Test App$/, "");
}

function cleanLessonSubtitle(subtitle: string) {
  return subtitle.split(" — ")[0].split(" 窶・")[0].split(" ﾂｷ ")[0];
}
