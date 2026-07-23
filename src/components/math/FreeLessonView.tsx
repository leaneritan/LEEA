import Link from "next/link";
import type { MathFreeLesson } from "../../../content/subjects/math/freeLessons";

const ACCENT = { "--m-accent": "#8d7fb5", "--m-tint": "#efecf5", "--m-dark": "#63558c" } as React.CSSProperties;

export function FreeLessonView({ lesson }: { lesson: MathFreeLesson }) {
  return (
    <div className="math-scope" style={ACCENT}>
      <div className="math-topbar">
        <div className="math-topbar-inner">
          <Link className="math-topbar-brand" href="/math">
            ← 数学の学び
          </Link>
          <span className="math-topbar-sep">｜</span>
          <Link className="math-topbar-chapter" href="/math/free">
            <span className="math-topbar-dot" />
            特別レッスン
          </Link>
          <span className="math-topbar-chevron">›</span>
          <span className="math-topbar-section">{lesson.title}</span>
        </div>
      </div>

      <iframe className="math-freelesson-frame" src={lesson.embedPath} title={lesson.title} />
    </div>
  );
}
