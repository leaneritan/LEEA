import Link from "next/link";
import type { SpecialLesson } from "../../../content/subjects/math/specialLessons";

const ACCENT = { "--m-accent": "#7a5aa6", "--m-tint": "#efe7f7", "--m-dark": "#5b3f86" } as React.CSSProperties;

export function FreeLessonView({ lesson }: { lesson: SpecialLesson }) {
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
            特訓レッスン
          </Link>
          <span className="math-topbar-chevron">›</span>
          <span className="math-topbar-section">{lesson.title}</span>
        </div>
      </div>

      {lesson.embedPath ? (
        <iframe className="math-freelesson-frame" src={lesson.embedPath} title={lesson.title} />
      ) : (
        <div className="math-page">
          <div className="math-card" style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{lesson.title} はまだ準備中です。</p>
            <p style={{ margin: "8px 0 0", color: "#a08e6c", fontSize: 13 }}>レッスンができたら、ここから始められるようになるよ。</p>
            <Link className="math-nav-link math-nav-link--next" href="/math/free" style={{ display: "inline-flex", marginTop: 16 }}>
              ← 特訓レッスン一覧へ戻る
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
