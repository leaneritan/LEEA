"use client";

import Link from "next/link";
import type { LearnerAppProgress } from "@/data/learnerProgress";
import type { Lesson } from "@/data/types";
import { getComponentMeta } from "./componentMeta";

type Item = { lesson: Lesson; progress: LearnerAppProgress };

export function LeoHomeworkHero({ items, suggested }: { items: Item[]; suggested?: Item }) {
  const openItems = items.filter((item) => !item.progress.done);
  const sorted = [...openItems].sort((a, b) => b.progress.completedModules - a.progress.completedModules);
  const assignedNext = sorted[0];
  const next = assignedNext ?? suggested;
  const isSuggested = !assignedNext && !!suggested;
  const completedToday = items.filter((item) => item.progress.done).length;
  const dateText = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  if (!next) {
    return (
      <section className="leo-design-hero leo-design-hero-empty" aria-label="Today's homework">
        <div className="leo-design-copy">
          <span>{dateText}</span>
          <h1>Hi Leo —<br />ready to play?</h1>
          <p>You finished <b>everything Dad set</b> today. Superstar! 🌟</p>
          <div className="leo-today-meter"><b>Today</b><i className="done" /><i className="done" /><i className="done" /><strong className="all-done">3 of 3 done!</strong></div>
        </div>
        <aside className="leo-pick-card leo-pick-card-done">
          <div className="leo-pick-celebrate">🎉</div>
          <strong>All done!</strong>
          <small>Want to explore your worlds?</small>
          <Link className="leo-pick-cta-done" href="/english">Free play →</Link>
        </aside>
      </section>
    );
  }

  const meta = getComponentMeta(next.lesson.component);
  const percent = next.progress.moduleCount ? Math.round((next.progress.completedModules / next.progress.moduleCount) * 100) : 0;
  const countText = openItems.length === 1 ? "1 thing" : `${openItems.length} things`;

  return (
    <section className="leo-design-hero" aria-label="Today's homework">
      <div className="leo-design-copy">
        <span>{dateText}</span>
        <h1>Hi Leo —<br />ready to play?</h1>
        {isSuggested ? (
          <p>Nothing new from Dad yet — here&apos;s what&apos;s <b>up next</b>! Start it now, or wait for Dad.</p>
        ) : (
          <p>Dad set you <b>{countText}</b> today. Let&apos;s pick up where you left off!</p>
        )}
        {isSuggested ? null : (
          <div className="leo-today-meter">
            <b>Today</b>
            {items.slice(0, 3).map((item) => <i className={item.progress.done ? "done" : ""} key={item.lesson.id} />)}
            {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, index) => <i key={`empty-${index}`} />)}
            <strong>{completedToday} of {items.length} done</strong>
          </div>
        )}
      </div>

      <aside className="leo-pick-card">
        <span>{isSuggested ? "Up next" : "Pick up where you left off"}</span>
        <div className="leo-pick-title">
          <i aria-hidden="true">{meta.emoji}</i>
          <div>
            <strong>{cleanLeoTitle(next.lesson.title)}</strong>
            <small>Our World · {next.progress.moduleCount - next.progress.completedModules} modules left</small>
          </div>
        </div>
        <div className="leo-pick-progress" aria-label={`${percent}% complete`}>
          <i style={{ width: `${percent}%` }} />
          <b>{next.progress.completedModules}/{next.progress.moduleCount}</b>
        </div>
        <Link href={`/lessons/${next.lesson.id}`}>{next.progress.completedModules > 0 ? "Keep going" : "Start"} →</Link>
      </aside>
    </section>
  );
}

function cleanLeoTitle(title: string) {
  return title.replace(/^Unit 8 /, "").replace(/ App$/, "").replace(/ Leo's Test App$/, "");
}
