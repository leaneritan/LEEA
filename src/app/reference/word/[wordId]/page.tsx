import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { WordCard } from "@/components/reference/WordCard";
import { getWordById } from "@/components/reference/ref-data";

export default async function WordRoute({ params }: { params: Promise<{ wordId: string }> }) {
  const { wordId } = await params;
  const entry = getWordById(wordId);

  if (!entry) {
    notFound();
  }

  return (
    <AppShell active="reference" crumbs={["Reference", "Vocabulary", entry.word]}>
      <WordCard entry={entry} />
    </AppShell>
  );
}
