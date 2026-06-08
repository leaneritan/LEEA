"use client";

import Link from "next/link";
import { BookOpen, ChevronDown, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { academyStats, englishCourses, nextAssignment } from "@/data/registry";

export function HomeDashboard() {
  const [englishOpen, setEnglishOpen] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("leea.home.englishOpen");
    if (saved !== null) {
      setEnglishOpen(saved === "true");
    }
  }, []);

  function toggleEnglish() {
    setEnglishOpen((current) => {
      window.localStorage.setItem("leea.home.englishOpen", String(!current));
      return !current;
    });
  }

  return (
    <div className="stack">
      <section className="home-hero">
        <div className="hero-card">
          <span className="eyebrow">Active Session</span>
          <h1>
            Leo&apos;s <mark>Elite</mark> Education Academy
          </h1>
          <p>Teach, practice, and look up every word and grammar point from one consistent place.</p>

          <div className="mode-grid">
            <ModeCard title="Neritan" label="Teaching mode" text="Open teacher decks, assign Leo apps, and track progress." href="/teacher" />
            <ModeCard title="Leo" label="Learning mode" text="Do assigned practice, complete review cards, and continue homework." active />
            <ModeCard title="Look It Up" label="Reference" text="Search vocabulary, grammar, I Know, and I Don't Know." href="/reference" />
          </div>
        </div>

        <aside className="next-card">
          <div className="next-top">
            <span>Teaching Queue</span>
            <b>{nextAssignment.status}</b>
          </div>
          <div>
            <p>
              {nextAssignment.course} · Level {nextAssignment.level} · Unit {nextAssignment.unit}
            </p>
            <h2>{nextAssignment.component}</h2>
          </div>
          <Link className="primary-button" href={`/lessons/${nextAssignment.lessonId}`}>
            Open Lesson
          </Link>
        </aside>
      </section>

      <section className="stats-grid" aria-label="Academy stats">
        <Stat label="Total Words" value={academyStats.totalVocabulary} />
        <Stat label="Grammar Points" value={academyStats.grammarPoints} />
        <Stat label="Known Words" value={academyStats.knownWords} />
        <Stat label="To Review" value={academyStats.wordsToReview} />
      </section>

      <section className="subject-panel">
        <button className="subject-header" onClick={toggleEnglish} type="button">
          <span>
            {englishOpen ? <ChevronDown size={22} /> : <ChevronRight size={22} />}
            <BookOpen size={22} />
            <strong>English</strong>
          </span>
          <small>Our World · Joyful Work · Training Ground · Reference</small>
        </button>

        {englishOpen ? (
          <div className="course-grid">
            {englishCourses.map((course) => (
              <Link
                className={`course-card ${course.theme}`}
                href={course.id === "reference" ? "/reference" : course.id === "our-world" ? "/lessons" : "/"}
                key={course.id}
              >
                <div className="course-band">
                  <span>{course.eyebrow}</span>
                  {course.id === "reference" ? <Search size={24} /> : <span>{course.title.slice(0, 2).toUpperCase()}</span>}
                </div>
                <div className="course-body">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="tag-row">
                    {course.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="coming-grid">
        <div className="coming-card">
          <h3>Math</h3>
          <p>Coming later</p>
        </div>
        <div className="coming-card">
          <h3>Science</h3>
          <p>Coming later</p>
        </div>
      </section>
    </div>
  );
}

function ModeCard({
  title,
  label,
  text,
  active,
  href
}: {
  title: string;
  label: string;
  text: string;
  active?: boolean;
  href?: string;
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
    <Link className={`mode-card ${title === "Look It Up" ? "reference" : "teaching"}`} href={href}>
      {content}
    </Link>
  ) : (
    <div className={active ? "mode-card active" : "mode-card"}>{content}</div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
