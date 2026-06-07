"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import type { Lesson } from "@/data/types";

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = lesson.slides[activeIndex];
  const progress = useMemo(() => ((activeIndex + 1) / lesson.slides.length) * 100, [activeIndex, lesson.slides.length]);

  function go(delta: number) {
    setActiveIndex((current) => Math.min(Math.max(current + delta, 0), lesson.slides.length - 1));
  }

  return (
    <section className="lesson-page">
      <div className="card-nav">
        <Link className="ghost-button" href="/">
          Back to Home
        </Link>
        <Link className="ghost-button" href="/reference">
          Reference
        </Link>
        <span className="position-pill">Teacher Mode</span>
      </div>

      <article className="lesson-shell">
        <header className="lesson-header">
          <div>
            <span className="eyebrow">
              Our World - Level {lesson.level} - Unit {lesson.unit} - {lesson.component}
            </span>
            <h1>{lesson.title}</h1>
            <p>{lesson.subtitle}</p>
          </div>
          <div className="lesson-source">
            <span>{lesson.status.toUpperCase()}</span>
            <strong>{lesson.source.slideCount} source slides</strong>
            <small>{lesson.source.file}</small>
          </div>
        </header>

        <section className="lesson-objectives" aria-label="Lesson objectives">
          <ObjectiveColumn title="Content Objectives" items={lesson.objectives.content} />
          <ObjectiveColumn title="Language Objectives" items={lesson.objectives.language} />
        </section>

        <section className="lesson-reference-strip" aria-label="Reference links">
          {lesson.referenceLinks.map((link) =>
            link.id ? (
              <Link className={`lesson-ref-link ${link.status}`} href={`/reference/vocabulary/${link.id}`} key={link.label}>
                <span>{link.label}</span>
                <small>{link.kind}</small>
                <ExternalLink size={14} />
              </Link>
            ) : (
              <span className={`lesson-ref-link ${link.status}`} key={link.label}>
                <span>{link.label}</span>
                <small>{link.kind} card needed</small>
              </span>
            )
          )}
        </section>

        <div className="lesson-stage">
          <aside className="lesson-slide-list" aria-label="Lesson slides">
            {lesson.slides.map((slide, index) => (
              <button
                className={activeIndex === index ? "active" : ""}
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{slide.title}</strong>
              </button>
            ))}
          </aside>

          <div className={`lesson-slide-card ${activeSlide.focus}`}>
            <div className="lesson-progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="lesson-slide-top">
              <span className="lesson-emoji">{activeSlide.emoji}</span>
              <div>
                <span className="eyebrow">{activeSlide.eyebrow}</span>
                <h2>{activeSlide.title}</h2>
              </div>
            </div>

            <div className="lesson-main-grid">
              <div className="lesson-teacher-panel">
                <span>Teacher Script</span>
                <p>{activeSlide.teacherScript}</p>
              </div>
              <div className="lesson-student-panel">
                <span>Leo Does</span>
                <p>{activeSlide.studentAction}</p>
              </div>
            </div>

            <div className="lesson-bullet-grid">
              {activeSlide.bullets.map((bullet) => (
                <div className="lesson-bullet" key={bullet}>
                  {bullet}
                </div>
              ))}
            </div>

            {activeSlide.callout ? <div className="lesson-callout">{activeSlide.callout}</div> : null}

            <div className="lesson-controls">
              <button className="lesson-icon-button" disabled={activeIndex === 0} onClick={() => go(-1)} type="button">
                <ChevronLeft size={20} />
                Previous
              </button>
              <span>
                {activeIndex + 1} / {lesson.slides.length}
              </span>
              <button
                className="lesson-icon-button"
                disabled={activeIndex === lesson.slides.length - 1}
                onClick={() => go(1)}
                type="button"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

function ObjectiveColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
