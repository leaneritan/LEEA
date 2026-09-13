import Link from "next/link";
import { notFound } from "next/navigation";
import { getMathNoteSectionMeta } from "../../../../../content/subjects/math/note/curriculum";
import { loadMathNoteSection } from "../../../../../content/subjects/math/note/loadSection";
import { NoteSectionView } from "@/components/math/note/NoteSectionView";

export default async function MathNoteSectionPage({
  params
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;
  const found = getMathNoteSectionMeta(sectionId);
  if (!found) notFound();

  const { chapter, section: meta } = found;
  const section = loadMathNoteSection(meta.id);

  if (!section) {
    return (
      <div
        className="math-scope"
        style={
          {
            "--m-accent": chapter.color,
            "--m-tint": chapter.tint,
            "--m-dark": chapter.dark
          } as React.CSSProperties
        }
      >
        <div className="math-page">
          <div className="math-card" style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              学習ノート {meta.workbookPages}「{meta.name}」はまだ準備中です。
            </p>
            <p style={{ margin: "8px 0 0", color: "#a08e6c", fontSize: 13 }}>
              {meta.scanned
                ? "このページはスキャン済みだよ。ここに問題を入れたら使えるようになるよ。"
                : "このページはまだスキャンされていないよ。ワークの写真を送ってもらえたら作れるよ。"}
            </p>
            <Link
              className="math-nav-link math-nav-link--next"
              href="/math/note"
              style={{ display: "inline-flex", marginTop: 16 }}
            >
              ← 学習ノートの目次へ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <NoteSectionView chapter={chapter} section={section} />;
}
