import Link from "next/link";
import { notFound } from "next/navigation";
import { getMathChapter, getMathSectionMeta } from "../../../../../content/subjects/math/curriculum";
import { loadMathSection } from "../../../../../content/subjects/math/loadSection";
import { SectionView } from "@/components/math/SectionView";

export default async function MathSectionPage({
  params
}: {
  params: Promise<{ chapterId: string; sectionId: string }>;
}) {
  const { chapterId, sectionId } = await params;
  const chapter = getMathChapter(chapterId);
  const sectionMeta = chapter ? getMathSectionMeta(chapterId, sectionId) : undefined;
  if (!chapter || !sectionMeta) notFound();

  const section = loadMathSection(chapterId, sectionMeta.number);

  if (!section) {
    return (
      <div className="math-scope" style={{ "--m-accent": chapter.color, "--m-tint": chapter.tint, "--m-dark": chapter.dark } as React.CSSProperties}>
        <div className="math-page">
          <div className="math-card" style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              {chapter.num}章 {sectionMeta.name} はまだ準備中です。
            </p>
            <p style={{ margin: "8px 0 0", color: "#a08e6c", fontSize: 13 }}>教科書のページを送ってもらえたら、この節を作ります。</p>
            <Link className="math-nav-link math-nav-link--next" href="/math" style={{ display: "inline-flex", marginTop: 16 }}>
              ← 数学ホームへ戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <SectionView chapter={chapter} section={section} />;
}
