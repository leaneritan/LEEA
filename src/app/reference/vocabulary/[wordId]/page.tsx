import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { VocabularyCardPage } from "@/components/VocabularyCardPage";
import { getVocabularyById } from "@/data/reference";

export default async function VocabularyRoute({ params }: { params: Promise<{ wordId: string }> }) {
  const { wordId } = await params;
  const word = getVocabularyById(wordId);

  if (!word) {
    notFound();
  }

  return (
    <AppShell active="reference" crumbs={["Home", "English", "Reference", word.word]}>
      <VocabularyCardPage initialWordId={word.id} />
    </AppShell>
  );
}

