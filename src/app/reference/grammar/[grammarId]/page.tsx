import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GrammarCard } from "@/components/reference/GrammarCard";
import { getGrammarEntryById } from "@/components/reference/ref-data";

export default async function GrammarRoute({ params }: { params: Promise<{ grammarId: string }> }) {
  const { grammarId } = await params;
  const entry = getGrammarEntryById(grammarId);

  if (!entry) {
    notFound();
  }

  return (
    <AppShell active="reference" crumbs={["Reference", "Grammar", entry.title]}>
      <GrammarCard entry={entry} />
    </AppShell>
  );
}
