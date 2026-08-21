import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GeographyChapterView } from "@/components/geography/GeographyChapterView";
import { geographyChapters, getGeographyChapterById } from "../../../../content/subjects/geography/curriculum";

export function generateStaticParams() {
  return geographyChapters.map((chapter) => ({ chapterId: chapter.id }));
}

export default async function GeographyChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  const chapter = getGeographyChapterById(chapterId);

  if (!chapter) {
    notFound();
  }

  return (
    <AppShell active="geography" crumbs={["Home", "Geography", `${chapter.num} ${chapter.title}`]}>
      <GeographyChapterView chapter={chapter} />
    </AppShell>
  );
}
