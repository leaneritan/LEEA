"use client";

import Link from "next/link";
import { CheckCircle2, Circle, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  assignmentStorageKey,
  createAssignmentRecord,
  createReviewRecord,
  readAssignments,
  type AssignmentMap,
  type AssignmentRecord
} from "@/data/assignments";
import { getLearnerAppProgress, type LearnerAppProgress } from "@/data/learnerProgress";
import { learnerLessons } from "@/data/lessons";
import type { Lesson } from "@/data/types";

export function TeacherReviewPage({ lesson }: { lesson: Lesson }) {
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const [progress, setProgress] = useState<LearnerAppProgress>(() => getEmptyProgress(lesson));
  const assignment = assignments[lesson.id];

  useEffect(() => {
    function refresh() {
      setAssignments(readAssignments(learnerLessons));
      setProgress(getLearnerAppProgress(lesson.source));
    }

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [lesson]);

  function assign() {
    setAssignments((current) => saveAssignments({ ...current, [lesson.id]: current[lesson.id] ?? createAssignmentRecord(lesson.id) }));
  }

  function review(status: "reviewed" | "needs-redo") {
    const current = assignment ?? createAssignmentRecord(lesson.id);
    setAssignments((existing) => saveAssignments({ ...existing, [lesson.id]: createReviewRecord(current, status) }));
  }

  return (
    <section className="review-page">
      <header className="review-hero">
        <span className="eyebrow">Neritan Review</span>
        <h1>{lesson.title}</h1>
        <p>{lesson.subtitle}</p>
      </header>

      <section className="review-summary-grid" aria-label="Leo app review summary">
        <ReviewStat label="Assignment" value={formatAssignmentStatus(assignment)} />
        <ReviewStat label="Modules" value={`${progress.completedModules} / ${progress.moduleCount}`} />
        <ReviewStat label="Final Quiz" value={progress.score !== null ? `${progress.score}%` : "Not finished"} />
      </section>

      <section className="review-panel">
        <div className="teacher-section-head">
          <span className="eyebrow">Modules</span>
          <h2>What Leo Completed</h2>
        </div>
        <div className="review-module-list">
          {progress.modules.length ? (
            progress.modules.map((module) => (
              <div className={module.done ? "review-module done" : "review-module"} key={module.id}>
                {module.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                <span>{module.label}</span>
                <strong>{module.done ? "Done" : "Not yet"}</strong>
              </div>
            ))
          ) : (
            <div className="empty-results">Open the Leo app once to start recording module progress.</div>
          )}
        </div>
      </section>

      <section className="review-panel">
        <div className="teacher-section-head">
          <span className="eyebrow">Saved Work</span>
          <h2>Caption</h2>
        </div>
        {progress.caption ? <blockquote className="review-caption">{progress.caption}</blockquote> : <p className="review-muted">No caption saved yet.</p>}
      </section>

      <section className="review-actions">
        <Link className="ghost-button" href="/teacher">
          Back to Teacher Menu
        </Link>
        <Link className="ghost-button" href={`/lessons/${lesson.id}`}>
          Open Leo App
        </Link>
        {!assignment ? (
          <button className="teacher-done-button" onClick={assign} type="button">
            <Circle size={18} />
            Assign to Leo
          </button>
        ) : null}
        <button className="teacher-done-button warning" onClick={() => review("needs-redo")} type="button">
          <RotateCcw size={18} />
          Needs Redo
        </button>
        <button className="teacher-done-button active" onClick={() => review("reviewed")} type="button">
          <CheckCircle2 size={18} />
          Mark Reviewed
        </button>
      </section>
    </section>
  );
}

function ReviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function saveAssignments(assignments: AssignmentMap) {
  window.localStorage.setItem(assignmentStorageKey, JSON.stringify(assignments));
  return assignments;
}

function formatAssignmentStatus(assignment: AssignmentRecord | undefined) {
  if (!assignment) return "Not assigned";
  if (assignment.status === "needs-redo") return "Needs redo";
  if (assignment.status === "reviewed") return "Reviewed";
  return "Assigned";
}

function getEmptyProgress(lesson: Lesson): LearnerAppProgress {
  return {
    completedModules: 0,
    moduleCount: lesson.source.moduleCount ?? 1,
    modules: [],
    score: null,
    done: false,
    caption: ""
  };
}
