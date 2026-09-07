import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { IrregularVerbCard } from "@/components/reference/IrregularVerbCard";
import { getIrregularVerbById } from "@/data/irregularVerbs";

export default async function IrregularVerbRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getIrregularVerbById(id);

  if (!entry) notFound();
  /* If this verb has since gotten a real vocab card (e.g. its unit was
     scanned), send visitors to that card instead of a stale light one. */
  if (!entry.light) redirect(entry.href);

  return (
    <AppShell active="irregular-verbs" crumbs={["Reference", "Irregular Verbs", entry.infinitive]}>
      <IrregularVerbCard entry={entry} />
    </AppShell>
  );
}
