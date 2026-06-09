import Link from "next/link";
import { Search } from "lucide-react";
import { englishCourses } from "@/data/registry";
import { getLessonGroups } from "@/data/lessons";

export function LessonsPage() {
  const groups = getLessonGroups();

  return (
    <section className="lessons-page">
      <header className="lessons-hero">
        <span className="eyebrow">English</span>
        <h1>English Lessons</h1>
        <p>Choose the course first, then open teacher lessons and Leo apps by level and unit.</p>
      </header>

      <section className="english-course-grid" aria-label="English courses">
        {englishCourses.map((course) => (
          <Link
            className={`course-card ${course.theme}`}
            href={course.id === "reference" ? "/reference" : course.id === "our-world" ? "#our-world-l4-u8" : "/lessons"}
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
      </section>

      <div className="lesson-group-grid">
        {groups.map((group) => (
          <section className="lesson-group" id={group.id} key={group.id}>
            <div className="lesson-group-header">
              <span>{group.courseLabel}</span>
              <h2>
                Level {group.level} - Unit {group.unit}
              </h2>
            </div>
            <div className="lesson-card-list">
              {group.lessons.map((lesson) => (
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
        ))}
      </div>
    </section>
  );
}
