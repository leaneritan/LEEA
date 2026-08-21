import { notFound, permanentRedirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GeographyChapterView } from "@/components/geography/GeographyChapterView";
import { geographyChapters, getGeographyChapterById } from "../../../../content/subjects/geography/curriculum";
import { getGeographyMapById } from "../../../../content/subjects/geography/maps";

export function generateStaticParams() {
  return geographyChapters.map((chapter) => ({ chapterId: chapter.id }));
}

export default async function GeographyChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  const chapter = getGeographyChapterById(chapterId);

  if (!chapter) {
    // Maps used to live at /geography/<mapId> before chapters existed, and that
    // URL shipped. Anything still pointing there — a bookmark, an open tab, a
    // link shared before the move — lands here now that this segment means a
    // chapter. Send those on to the map rather than showing a 404. Reading the
    // registry keeps this correct for every map added later; chapter ids can
    // never collide with map ids because a chapter id is short (g1, h2) and
    // getGeographyChapterById already claimed it above.
    if (getGeographyMapById(chapterId)) {
      permanentRedirect(`/geography/map/${chapterId}`);
    }
    notFound();
  }

  return (
    <AppShell active="geography" crumbs={["Home", "Geography", `${chapter.num} ${chapter.title}`]}>
      <GeographyChapterView chapter={chapter} />
    </AppShell>
  );
}
