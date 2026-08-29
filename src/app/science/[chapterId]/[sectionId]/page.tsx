import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getScienceChapter,
  getScienceSectionMeta,
  getUnitForChapter
} from "../../../../../content/subjects/science/curriculum";
import { loadScienceSection } from "../../../../../content/subjects/science/loadSection";
import { SectionView } from "@/components/science/SectionView";

export default async function ScienceSectionPage({
  params
}: {
  params: Promise<{ chapterId: string; sectionId: string }>;
}) {
  const { chapterId, sectionId } = await params;
  const chapter = getScienceChapter(chapterId);
  const unit = getUnitForChapter(chapterId);
  const sectionMeta = chapter ? getScienceSectionMeta(chapterId, sectionId) : undefined;
  if (!chapter || !unit || !sectionMeta) notFound();

  const section = loadScienceSection(sectionId);

  if (!section) {
    return (
      <div
        className="sci-scope"
        style={
          { "--s-accent": unit.color, "--s-tint": unit.tint, "--s-dark": unit.dark } as React.CSSProperties
        }
      >
        <div className="sci-page">
          <div className="sci-card" style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              {chapter.num ? `第${chapter.num}章 ` : ""}
              {sectionMeta.name} はまだ準備中です。
            </p>
            <p style={{ margin: "8px 0 0", color: "#7c8b80", fontSize: 13 }}>
              教科書 {sectionMeta.pages} のスキャンを送ってもらえたら、ここを作ります。
            </p>
            <Link className="sci-nav-link sci-nav-link--next" href="/science" style={{ display: "inline-flex", marginTop: 16 }}>
              ← 理科ホームへ戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <SectionView chapter={chapter} section={section} unit={unit} />;
}
