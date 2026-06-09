"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Lesson } from "@/data/types";

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const isLearnerApp = lesson.mode === "learner";

  return (
    <section className={isLearnerApp ? "deck-lesson-page learner-lesson-page" : "deck-lesson-page"}>
      <header className="deck-lesson-bar">
        <div>
          <span className="eyebrow">
            Our World - Level {lesson.level} - Unit {lesson.unit} - {lesson.component}
          </span>
          <h1>{lesson.title}</h1>
        </div>
        <nav aria-label="Lesson actions">
          <Link className="ghost-button" href={isLearnerApp ? "/leo" : "/lessons"}>
            {isLearnerApp ? "My Assignments" : "All Lessons"}
          </Link>
          <Link className="ghost-button" href="/reference">
            Reference
          </Link>
          {lesson.source.embedPath ? (
            <a className="ghost-button" href={lesson.source.embedPath} rel="noreferrer" target="_blank">
              {isLearnerApp ? "Open App Fullscreen" : "Open Fullscreen"}
              <ExternalLink size={16} />
            </a>
          ) : null}
        </nav>
      </header>

      {lesson.source.embedPath ? (
        <iframe className="deck-lesson-frame" src={lesson.source.embedPath} title={lesson.title} />
      ) : (
        <div className="deck-lesson-missing">
          <h2>Lesson file needed</h2>
          <p>{lesson.source.file}</p>
        </div>
      )}
    </section>
  );
}
