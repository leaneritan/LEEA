"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { learnerLessons } from "@/data/lessons";

type LearnerAppProgress = {
  completedModules: number;
  moduleCount: number;
  score: number | null;
  done: boolean;
  caption: string;
};

export function LeoDashboard() {
  const [progressVersion, setProgressVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setProgressVersion((current) => current + 1);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const appProgress = useMemo(() => {
    progressVersion;
    return Object.fromEntries(learnerLessons.map((lesson) => [lesson.id, getLearnerAppProgress(lesson.source.storagePrefix, lesson.source.moduleCount)]));
  }, [progressVersion]);

  return (
    <section className="leo-page">
      <header className="leo-hero">
        <span className="eyebrow">Leo Learning Mode</span>
        <h1>My Assignments</h1>
        <p>Open the next app, finish the modules, and come back here to see progress.</p>
      </header>

      <div className="leo-app-grid">
        {learnerLessons.map((lesson) => {
          const progress = appProgress[lesson.id];
          const percent = Math.round((progress.completedModules / progress.moduleCount) * 100);

          return (
            <article className="leo-app-card" key={lesson.id}>
              <div className="leo-app-main">
                <span className="mode-label">
                  Our World - Level {lesson.level} - Unit {lesson.unit}
                </span>
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
        })}
      </div>
    </section>
  );
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
