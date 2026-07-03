"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readLessonProgress, syncLessonProgressWithCloud, type LessonProgressMap } from "@/data/lessonProgress";
import { teacherLessons } from "@/data/lessons";

type SequenceItem = {
  kind: "unit" | "review" | "reading" | "level-test";
  number?: number;
  title: string;
  subtitle: string;
  state: "planned" | "reference" | "active" | "locked";
};

const levelFourSequence: SequenceItem[] = [
  { kind: "unit", number: 1, title: "Animals & Habitats", subtitle: "8 lessons", state: "planned" },
  { kind: "unit", number: 2, title: "My Town", subtitle: "8 lessons", state: "planned" },
  { kind: "unit", number: 3, title: "Food Around the World", subtitle: "8 lessons", state: "planned" },
  { kind: "review", title: "Review · Units 1–3", subtitle: "Mixed quiz, grammar and reading from this band.", state: "planned" },
  { kind: "reading", title: "Extra Reading 1", subtitle: "Extra reading to stretch a little further.", state: "planned" },
  { kind: "unit", number: 4, title: "Weather & Seasons", subtitle: "8 lessons", state: "planned" },
  { kind: "unit", number: 5, title: "Jobs People Do", subtitle: "8 lessons", state: "planned" },
  { kind: "unit", number: 6, title: "Sports & Games", subtitle: "8 lessons", state: "planned" },
  { kind: "review", title: "Review · Units 4–6", subtitle: "Mixed quiz, grammar and reading from this band.", state: "planned" },
  { kind: "reading", title: "Extra Reading 2", subtitle: "Extra reading to stretch a little further.", state: "planned" },
  { kind: "unit", number: 7, title: "Good Idea!", subtitle: "1 lesson ready", state: "active" },
  { kind: "unit", number: 8, title: "That's Really Interesting!", subtitle: "8 teaching components", state: "active" },
  { kind: "unit", number: 9, title: "Our Planet", subtitle: "8 lessons", state: "locked" },
  { kind: "review", title: "Review · Units 7–9", subtitle: "Mixed quiz, grammar and reading from this band.", state: "locked" },
  { kind: "reading", title: "Extra Reading 3", subtitle: "Extra reading to stretch a little further.", state: "locked" },
  { kind: "level-test", title: "Review · Units 1–9 · Level test", subtitle: "Level-wide review and checkpoint.", state: "locked" }
];

export function OurWorldPage() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const unitEightLessons = useMemo(() => teacherLessons.filter((lesson) => lesson.level === 4 && lesson.unit === 8), []);
  const taught = unitEightLessons.filter((lesson) => progress[lesson.id]?.status === "done").length;

  useEffect(() => {
    const refresh = () => {
      const localProgress = readLessonProgress();
      setProgress(localProgress);
      void syncLessonProgressWithCloud(localProgress).then(setProgress);
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("focus", refresh); };
  }, []);

  return (
    <section className="ow-page ow-page--final">
      <section className="ow-design-hero">
        <div>
          <span>National Geographic</span>
          <h1>Our<br />World</h1>
          <p>6 levels · 9 units each · explore the planet in English.</p>
          <div className="ow-hero-chips"><span>{teacherLessons.length} teacher lessons built</span><span>Level 4 of 6</span></div>
        </div>
        <aside><span>Continue</span><small>Level 4 · Unit 8</small><strong>Vocabulary 2</strong><Link href="/english/our-world/level-4/unit-8">Keep going →</Link></aside>
      </section>

      <div className="ow-level-picker">
        <span>Choose a level</span>
        <div>{Array.from({ length: 6 }, (_, index) => index + 1).map((level) => <button className={level === 4 ? "active" : "locked"} key={level} type="button">{level > 4 ? "🔒 " : ""}Level {level}{level < 4 ? " · planned" : ""}</button>)}</div>
      </div>

      <section className="ow-sequence">
        <header><h2>Level 4 · 9 units</h2><span>{taught} of {unitEightLessons.length} Unit 8 lessons taught · checkpoints planned</span></header>
        <div className="ow-sequence-list">
          {levelFourSequence.map((item, index) => <SequenceRow item={item} key={`${item.kind}-${item.number ?? index}`} taught={taught} total={unitEightLessons.length} />)}
        </div>
      </section>
    </section>
  );
}

function SequenceRow({ item, taught, total }: { item: SequenceItem; taught: number; total: number }) {
  const content = (
    <>
      <span className="ow-sequence-icon">{item.kind === "unit" ? item.number : item.kind === "reading" ? "📖" : "▦"}</span>
      <div className="ow-sequence-copy"><small>{item.kind === "unit" ? `Unit ${item.number}` : item.kind === "reading" ? "Bonus" : "Checkpoint · Review"}</small><h3>{item.title}</h3><p>{item.subtitle}</p></div>
      <span className={`ow-sequence-status status-${item.state}`}>{item.state === "active" ? `${taught} / ${total} lessons` : item.state === "reference" ? "Reference started" : item.state === "locked" ? "🔒 Locked" : "Planned"}</span>
      <span className="ow-sequence-arrow">›</span>
    </>
  );

  const unitHrefs: Record<number, string> = { 7: "/english/our-world/level-4/unit-7", 8: "/english/our-world/level-4/unit-8" };
  const href = item.kind === "unit" && item.number != null ? unitHrefs[item.number] : null;
  return href ? <Link className="ow-sequence-row active" href={href}>{content}</Link> : <article className={`ow-sequence-row ${item.kind} ${item.state}`}>{content}</article>;
}
