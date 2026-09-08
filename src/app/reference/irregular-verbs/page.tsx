import { AppShell } from "@/components/AppShell";
import { IrregularVerbsList } from "@/components/reference/IrregularVerbsList";

export default function IrregularVerbsRoute() {
  return (
    <AppShell active="irregular-verbs" crumbs={["Reference", "Irregular Verbs"]}>
      <IrregularVerbsList />
    </AppShell>
  );
}
