"use client";

import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronRight, Circle, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { readAssignments, type AssignmentMap, type AssignmentRecord } from "@/data/assignments";
import { getLearnerAppProgress, type LearnerAppProgress } from "@/data/learnerProgress";
import { getLessonGroups, learnerLessons } from "@/data/lessons";
import type { Lesson } from "@/data/types";
import { getComponentMeta } from "./componentMeta";
import { LeoHomeworkHero } from "./LeoHomeworkHero";
import { allWords } from "./reference/ref-data";
import { useKnownWordIds } from "./useKnownWordIds";

const groupOpenStorageKey = "leea.leo.lessonGroupsOpen.v1";

export function LeoDashboard() {
  const [progressVersion, setProgressVersion] = useState(0);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const assignedLessons = useMemo(() => learnerLessons.filter((lesson) => assignments[lesson.id]), [assignments]);
  const groups = useMemo(() => getLessonGroups(learnerLessons), []);
  const { knownWordSet } = useKnownWordIds();

  useEffect(() => {
    const refresh = () => {
      setAssignments(readAssignments(learnerLessons));
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

  useEffect(() => {
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
  }, [groups]);

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
  const totalDone = useMemo(() => Object.values(appProgress).filter((progress) => progress.done).length, [appProgress]);

  function toggleGroup(groupId: string) {
    setOpenGroups((current) => {
      const next = { ...current, [groupId]: !(current[groupId] ?? true) };
      window.localStorage.setItem(groupOpenStorageKey, JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="leo-page">
      <LeoHomeworkHero items={heroItems} />

      <section className="leo-today-section">
        <header>
          <h2>Today&apos;s homework</h2>
          <span>From Dad · finish them all for a 🔥 streak</span>
        </header>
        <div className="leo-today-list">
          {todaysHomework.length ? (
            todaysHomework.map((item) => (
              <LeoHomeworkRow assignment={assignments[item.lesson.id]} key={item.lesson.id} lesson={item.lesson} progress={item.progress} />
            ))
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
            <div><b>TG</b><span>Training<br />Ground</span></div>
            <h3>Training Ground</h3>
            <footer><small>{learnerLessons.length} sessions</small></footer>
          </Link>
        </div>
        <div className="leo-mini-stats">
          <div><span>📚</span><strong>{knownWordSet.size}</strong><small>words known</small></div>
          <div><span>🔁</span><strong>{Math.max(0, allWords.length - knownWordSet.size)}</strong><small>to review</small></div>
          <div><span>🏅</span><strong>{totalDone}</strong><small>apps done</small></div>
        </div>
      </section>

      {groups.length ? (
        <section className="leo-library-section">
          <header>
            <h2>Full Leo library</h2>
            <span>Everything Dad has built for you</span>
          </header>
          <div className="leo-group-grid">
            {groups.map((group) => {
              const isOpen = openGroups[group.id] ?? true;
              const groupProgress = group.lessons.map((lesson) => appProgress[lesson.id]).filter(Boolean);
              const doneCount = groupProgress.filter((progress) => progress.done).length;

              return (
                <section className="leo-group" id={group.id} key={group.id}>
                  <button className="leo-group-header" onClick={() => toggleGroup(group.id)} type="button">
                    <span>
                      {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      {group.courseLabel}
                    </span>
                    <h2>
                      Level {group.level} · Unit {group.unit}
                    </h2>
                    <small>
                      {doneCount} / {group.lessons.length} done
                    </small>
                  </button>

                  {isOpen ? (
                    <div className="leo-app-grid">
                      {group.lessons.map((lesson) => (
                        <LeoAppCard assignment={assignments[lesson.id]} key={lesson.id} lesson={lesson} progress={appProgress[lesson.id]} />
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </section>
      ) : null}
    </section>
  );
}

function LeoHomeworkRow({ assignment, lesson, progress }: { assignment: AssignmentRecord | undefined; lesson: Lesson; progress: LearnerAppProgress }) {
  const meta = getComponentMeta(lesson.component);
  const percent = progress.moduleCount ? Math.round((progress.completedModules / progress.moduleCount) * 100) : 0;
  const isStarted = progress.completedModules > 0;

  return (
    <article className={`leo-homework-row leo-homework-row-${meta.tone}`}>
      <span className="leo-homework-icon" aria-hidden="true">{meta.emoji}</span>
      <div className="leo-homework-copy">
        <small>{meta.label} · Our World</small>
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
        <span>{assignment?.status === "needs-redo" ? "Try again" : isStarted ? "In progress" : "New from Dad"}</span>
        <Link href={`/lessons/${lesson.id}`}>{isStarted ? "Keep going" : "Start"}</Link>
      </div>
    </article>
  );
}

function LeoAppCard({ assignment, lesson, progress }: { assignment: AssignmentRecord | undefined; lesson: Lesson; progress: LearnerAppProgress }) {
  const percent = Math.round((progress.completedModules / progress.moduleCount) * 100);
  const component = getComponentMeta(lesson.component);
  const cardClass = [
    "leo-app-card",
    `leo-app-card-${component.tone}`,
    assignment ? "" : "leo-app-card-available",
    progress.done ? "leo-app-card-done" : ""
  ].filter(Boolean).join(" ");

  return (
    <article className={cardClass}>
      <div className="leo-app-main">
        <div className="leo-component-row">
          <span className={`component-chip component-chip-${component.tone}`}>
            <span aria-hidden="true">{component.emoji}</span>
            {component.label}
          </span>
          <span className="mode-label">
            Level {lesson.level} · Unit {lesson.unit}
          </span>
        </div>
        <h2>{cleanLessonTitle(lesson.title)}</h2>
        <p>{cleanLessonSubtitle(lesson.subtitle)}</p>
      </div>

      <div className="leo-progress-panel">
        <div className="leo-progress-top">
          <span>
            {progress.completedModules} / {progress.moduleCount} modules
          </span>
          <strong>{percent}%</strong>
        </div>
        <div className="focus-progress-bar" aria-label={`${percent}% complete`}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <div className="leo-status-row">
          <span className={progress.done ? "leo-status done" : "leo-status"}>
            {progress.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            {getLearnerStatusText(assignment, progress.done)}
          </span>
          {progress.score !== null ? <span className="leo-score">Quiz {progress.score}%</span> : <span className="leo-score muted">Quiz not finished</span>}
        </div>
        {progress.caption ? (
          <blockquote>
            <span>Caption</span>
            {progress.caption}
          </blockquote>
        ) : null}
      </div>

      <div className="leo-actions">
        <Link className="primary-button" href={`/lessons/${lesson.id}`}>
          <Play size={17} />
          Open App
        </Link>
        <Link className="ghost-button" href="/reference">
          Reference
        </Link>
      </div>
    </article>
  );
}

function getLearnerStatusText(assignment: AssignmentRecord | undefined, done: boolean) {
  if (assignment?.status === "reviewed") return "Reviewed";
  if (assignment?.status === "needs-redo") return "Needs redo";
  if (done) return "Done";
  if (assignment) return "Assigned";
  return "Not assigned";
}

function cleanLessonTitle(title: string) {
  return title.replace(/^Unit 8 /, "").replace(/ App$/, "").replace(/ Leo's Test App$/, "");
}

function cleanLessonSubtitle(subtitle: string) {
  return subtitle.split(" — ")[0].split(" 窶・")[0].split(" ﾂｷ ")[0];
}
