import Link from "next/link";
import { Play, Sparkles } from "lucide-react";
import type { LearnerAppProgress } from "@/data/learnerProgress";
import type { Lesson } from "@/data/types";
import { getComponentMeta } from "./componentMeta";

type Item = { lesson: Lesson; progress: LearnerAppProgress };

export function LeoHomeworkHero({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <section className="leo-hero-card leo-hero-empty" aria-label="Today's homework">
        <div className="leo-hero-bubbles" aria-hidden="true">
          <span>🎉</span><span>🌟</span><span>✨</span>
        </div>
        <h1>All caught up, Leo!</h1>
        <p>No homework waiting. Pick anything below to practice, or visit Reference.</p>
        <div className="leo-hero-actions">
          <Link className="leo-hero-primary" href="/reference">
            <Sparkles size={18} />
            Open Reference
          </Link>
        </div>
      </section>
    );
  }

  const sorted = [...items].sort((a, b) => Number(a.progress.done) - Number(b.progress.done));
  const next = sorted[0];
  const rest = sorted.slice(1);
  const meta = getComponentMeta(next.lesson.component);
  const percent = next.progress.moduleCount
    ? Math.round((next.progress.completedModules / next.progress.moduleCount) * 100)
    : 0;
  const startLabel = next.progress.completedModules > 0 ? "Keep Going" : "Start";

  return (
    <section
      aria-label="Today's homework"
      className={`leo-hero-card leo-hero-card-${meta.tone}`}
    >
      <div className="leo-hero-greeting">
        <span aria-hidden="true">👋</span>
        <span>Hi Leo</span>
      </div>
      <span className="leo-hero-eyebrow">
        Today&apos;s homework
        <span aria-hidden="true" className={`leo-hero-chip leo-hero-chip-${meta.tone}`}>
          {meta.emoji} {meta.label}
        </span>
      </span>
      <h1>{next.lesson.title}</h1>
      <p>{next.lesson.subtitle}</p>

      <div className="leo-hero-meter" aria-label={`${percent}% complete`}>
        <div className="leo-hero-bar">
          <span style={{ width: `${percent}%` }} />
        </div>
        <div className="leo-hero-meter-text">
          <strong>{percent}%</strong>
          <span>{next.progress.completedModules} / {next.progress.moduleCount} modules done</span>
        </div>
      </div>

      <div className="leo-hero-actions">
        <Link className="leo-hero-primary" href={`/lessons/${next.lesson.id}`}>
          <Play size={20} />
          {startLabel}
        </Link>
        {rest.length > 0 && (
          <a className="leo-hero-secondary" href={`#${getGroupHashFor(rest[0].lesson)}`}>
            and {rest.length} more {rest.length === 1 ? "assignment" : "assignments"} →
          </a>
        )}
      </div>
    </section>
  );
}

function getGroupHashFor(lesson: Lesson) {
  return `${lesson.course}-l${lesson.level ?? "na"}-u${lesson.unit ?? "na"}`;
}
