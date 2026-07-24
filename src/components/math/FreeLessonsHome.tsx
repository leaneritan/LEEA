import Link from "next/link";
import { mathFreeLessons } from "../../../content/subjects/math/freeLessons";

const ACCENT = { "--m-accent": "#8d7fb5", "--m-tint": "#efecf5", "--m-dark": "#63558c" } as React.CSSProperties;

export function FreeLessonsHome() {
  return (
    <div className="math-scope" style={ACCENT}>
      <div className="math-topbar">
        <div className="math-home-topbar-inner">
          <Link className="math-topbar-brand" href="/math">
            ← 数学の学び
          </Link>
          <span className="math-home-pill">特別レッスン</span>
        </div>
      </div>

      <div className="math-page math-home-page">
        <div className="math-freelesson-intro">
          <h1>特別レッスン</h1>
          <p>教科書の章とは別に、レオが苦手なところを特訓するためのレッスンだよ。</p>
        </div>

        {mathFreeLessons.length === 0 ? (
          <div className="math-card" style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>まだレッスンがありません。</p>
            <p style={{ margin: "8px 0 0", color: "#a08e6c", fontSize: 13 }}>レッスンが追加されると、ここに表示されます。</p>
          </div>
        ) : (
          <div className="math-freelesson-grid">
            {mathFreeLessons.map((lesson) => (
              <Link className="math-freelesson-card" href={`/math/free/${lesson.id}`} key={lesson.id}>
                <span className="math-freelesson-card-title">{lesson.title}</span>
                {lesson.tag ? <span className="math-freelesson-card-tag">{lesson.tag}</span> : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
