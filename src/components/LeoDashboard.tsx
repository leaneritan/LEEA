"use client";

import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronRight, Circle, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { assignmentStorageKey, seedAssignments, type AssignmentMap, type AssignmentRecord } from "@/data/assignments";
import { getLearnerAppProgress, type LearnerAppProgress } from "@/data/learnerProgress";
import { getLessonGroups, learnerLessons } from "@/data/lessons";
import type { Lesson } from "@/data/types";

const groupOpenStorageKey = "leea.leo.lessonGroupsOpen.v1";

export function LeoDashboard() {
  const [progressVersion, setProgressVersion] = useState(0);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const assignedLessons = useMemo(() => learnerLessons.filter((lesson) => assignments[lesson.id]), [assignments]);
  const groups = useMemo(() => getLessonGroups(assignedLessons), [assignedLessons]);

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

    const refresh = () => {
      setAssignments(readAssignments());
      setProgressVersion((current) => current + 1);
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [groups]);

  const appProgress = useMemo(() => {
    progressVersion;
    return Object.fromEntries(assignedLessons.map((lesson) => [lesson.id, getLearnerAppProgress(lesson.source)]));
  }, [assignedLessons, progressVersion]);

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

      {groups.length ? (
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
                    <LeoAppCard assignment={assignments[lesson.id]} key={lesson.id} lesson={lesson} progress={appProgress[lesson.id]} />
                  ))}
                </div>
              ) : null}
            </section>
          );
          })}
        </div>
      ) : (
        <section className="empty-results">
          <h2>No homework assigned yet.</h2>
          <p>Ask Neritan to assign the next Leo app from Teacher Menu.</p>
        </section>
      )}
    </section>
  );
}

function LeoAppCard({ assignment, lesson, progress }: { assignment: AssignmentRecord | undefined; lesson: Lesson; progress: LearnerAppProgress }) {
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

function getLearnerComponentMeta(component: string) {
  if (component.includes("vocab")) return { emoji: "V", label: "Vocabulary", tone: "vocab" };
  if (component.includes("grammar")) return { emoji: "G", label: "Grammar", tone: "grammar" };
  if (component.includes("reading")) return { emoji: "R", label: "Reading", tone: "reading" };
  if (component.includes("writing")) return { emoji: "W", label: "Writing", tone: "writing" };
  if (component.includes("review")) return { emoji: "OK", label: "Review", tone: "review" };
  return { emoji: "OP", label: "Opener", tone: "opener" };
}

function readAssignments() {
  try {
    const saved = window.localStorage.getItem(assignmentStorageKey);
    const parsed = saved ? (JSON.parse(saved) as AssignmentMap) : {};
    const seeded = seedAssignments(learnerLessons, parsed);
    window.localStorage.setItem(assignmentStorageKey, JSON.stringify(seeded));
    return seeded;
  } catch {
    const seeded = seedAssignments(learnerLessons, {});
    window.localStorage.setItem(assignmentStorageKey, JSON.stringify(seeded));
    return seeded;
  }
}

function getLearnerStatusText(assignment: AssignmentRecord | undefined, done: boolean) {
  if (assignment?.status === "reviewed") return "Reviewed";
  if (assignment?.status === "needs-redo") return "Needs redo";
  if (done) return "Done";
  return "Assigned";
}
