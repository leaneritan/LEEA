import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { WordCard } from "@/components/reference/WordCard";
import { getIrregularVerbById, getIrregularVerbNav } from "@/data/irregularVerbs";

export default async function IrregularVerbRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getIrregularVerbById(id);

  if (!entry) notFound();

  /* Same Word Card as everywhere else — a verb with a real vocabulary card
     shows that card here, so its unit sources and lesson links come along.
     Only the navigation changes: prev/next walks the irregular verb table. */
  return (
    <AppShell active="irregular-verbs" crumbs={["Reference", "Irregular Verbs", entry.infinitive]}>
      <WordCard
        entry={entry.card}
        nav={getIrregularVerbNav(entry.id)}
        back={{ href: "/reference/irregular-verbs", label: "Irregular Verbs" }}
      />
    </AppShell>
  );
}
