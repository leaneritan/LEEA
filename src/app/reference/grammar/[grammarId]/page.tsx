import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GrammarCardPage } from "@/components/GrammarCardPage";
import { getGrammarById } from "@/data/reference";

export default async function GrammarRoute({ params }: { params: Promise<{ grammarId: string }> }) {
  const { grammarId } = await params;
  const grammar = getGrammarById(grammarId);

  if (!grammar) {
    notFound();
  }

  return (
    <AppShell active="reference" crumbs={["Home", "English", "Reference", grammar.shortName]}>
      <GrammarCardPage grammar={grammar} />
    </AppShell>
  );
}

