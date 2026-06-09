"use client";

import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronRight, Circle, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getLessonGroups, learnerLessons } from "@/data/lessons";
import type { Lesson } from "@/data/types";

type LearnerAppProgress = {
  completedModules: number;
  moduleCount: number;
  score: number | null;
  done: boolean;
  caption: string;
};

const groupOpenStorageKey = "leea.leo.lessonGroupsOpen.v1";

export function LeoDashboard() {
  const [progressVersion, setProgressVersion] = useState(0);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const groups = useMemo(() => getLessonGroups(learnerLessons), []);

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

    const refresh = () => setProgressVersion((current) => current + 1);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [groups]);

  const appProgress = useMemo(() => {
    progressVersion;
    return Object.fromEntries(learnerLessons.map((lesson) => [lesson.id, getLearnerAppProgress(lesson.source.storagePrefix, lesson.source.moduleCount)]));
  }, [progressVersion]);

  function toggleGroup(groupId: string) {
    setOpenGroups((current) => {
      const next = { ...current, [groupId]: !(current[groupId] ?? true) };
      window.localStorage.setItem(groupOpenStorageKey, JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="leo-page">
      <header className="leo-hero">
        <span className="eyebrow">Leo Learning Mode</span>
        <h1>My Assignments</h1>
        <p>Open the next app, finish the modules, and come back here to see progress.</p>
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
                  Level {group.level} - Unit {group.unit}
                </h2>
                <small>
                  {doneCount} / {group.lessons.length} done
                </small>
              </button>

              {isOpen ? (
                <div className="leo-app-grid">
                  {group.lessons.map((lesson) => (
                    <LeoAppCard key={lesson.id} lesson={lesson} progress={appProgress[lesson.id]} />
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </section>
  );
}

function LeoAppCard({ lesson, progress }: { lesson: Lesson; progress: LearnerAppProgress }) {
  const percent = Math.round((progress.completedModules / progress.moduleCount) * 100);
  const component = getLearnerComponentMeta(lesson.component);

  return (
    <article className={`leo-app-card leo-app-card-${component.tone}`}>
      <div className="leo-app-main">
        <div className="leo-component-row">
          <span className={`component-chip component-chip-${component.tone}`}>
            <span aria-hidden="true">{component.emoji}</span>
            {component.label}
          </span>
          <span className="mode-label">
            Level {lesson.level} - Unit {lesson.unit}
          </span>
        </div>
        <h2>{lesson.title}</h2>
        <p>{lesson.subtitle}</p>
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
            {progress.done ? "Done" : lesson.status}
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

function getLearnerComponentMeta(component: string) {
  if (component.includes("vocab")) return { emoji: "🧺", label: "Vocabulary", tone: "vocab" };
  if (component.includes("grammar")) return { emoji: "🧩", label: "Grammar", tone: "grammar" };
  if (component.includes("reading")) return { emoji: "📖", label: "Reading", tone: "reading" };
  if (component.includes("writing")) return { emoji: "✍️", label: "Writing", tone: "writing" };
  if (component.includes("review")) return { emoji: "✅", label: "Review", tone: "review" };
  return { emoji: "🐻‍❄️", label: "Opener", tone: "opener" };
}

function getLearnerAppProgress(storagePrefix = "", moduleCount = 0): LearnerAppProgress {
  if (typeof window === "undefined" || !storagePrefix || !moduleCount) {
    return { completedModules: 0, moduleCount: moduleCount || 1, score: null, done: false, caption: "" };
  }

  const completedModules = Array.from({ length: moduleCount }, (_, index) => index + 1).filter((moduleNumber) =>
    loadLocalValue(`${storagePrefix}m${moduleNumber}-done`, false)
  ).length;
  const scoreData = loadLocalValue<{ score?: number; done?: boolean } | null>(`${storagePrefix}score`, null);
  const done = Boolean(loadLocalValue(`${storagePrefix}done`, false) || scoreData?.done);
  const caption = loadLocalValue(`${storagePrefix}m5-caption`, "");

  return {
    completedModules,
    moduleCount,
    score: typeof scoreData?.score === "number" ? scoreData.score : null,
    done,
    caption
  };
}

function loadLocalValue<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : (JSON.parse(value) as T);
  } catch {
    return fallback;
  }
}
