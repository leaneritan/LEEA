import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AcademicCard } from "@/components/reference/AcademicCard";
import { getAcademicById, getWordById } from "@/components/reference/ref-data";
import { redirect } from "next/navigation";

export default async function AcademicRoute({ params }: { params: Promise<{ wordId: string }> }) {
  const { wordId } = await params;
  const entry = getAcademicById(wordId);

  if (!entry) {
    /* If the id exists but isn't academic, fall back to the standard
       Word Card route so links don't 404 when content type shifts. */
    if (getWordById(wordId)) {
      redirect(`/reference/word/${wordId}`);
    }
    notFound();
  }

  return (
    <AppShell active="reference" crumbs={["Reference", "Academic", entry.word]}>
      <AcademicCard entry={entry} />
    </AppShell>
  );
}
