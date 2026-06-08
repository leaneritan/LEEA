import Link from "next/link";
import { lessons } from "@/data/lessons";

export function LessonsPage() {
  const grouped = lessons.reduce<Record<string, typeof lessons>>((groups, lesson) => {
    const key = `${lesson.course}|${lesson.level ?? "n/a"}|${lesson.unit ?? "n/a"}`;
    groups[key] = [...(groups[key] ?? []), lesson];
    return groups;
  }, {});

  return (
    <section className="lessons-page">
      <header className="lessons-hero">
        <span className="eyebrow">Teacher Lessons</span>
        <h1>Lessons by Level and Unit</h1>
        <p>Open each lesson as its own teacher-mode experience. Specific lessons can keep their own slide design.</p>
      </header>

      <div className="lesson-group-grid">
        {Object.entries(grouped).map(([key, group]) => {
          const first = group[0];
          return (
            <section className="lesson-group" key={key}>
              <div className="lesson-group-header">
                <span>{first.course === "our-world" ? "Our World" : first.course}</span>
                <h2>
                  Level {first.level} - Unit {first.unit}
                </h2>
              </div>
              <div className="lesson-card-list">
                {group.map((lesson) => (
                  <Link className="lesson-index-card" href={`/lessons/${lesson.id}`} key={lesson.id}>
                    <span>{lesson.component}</span>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.subtitle}</p>
                    <small>
                      {lesson.mode} mode - {lesson.source.slideCount ?? 0} slides - {lesson.status}
                    </small>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
