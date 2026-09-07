import { AppShell } from "@/components/AppShell";
import { IrregularVerbsTest } from "@/components/reference/IrregularVerbsTest";

export default function IrregularVerbsTestRoute() {
  return (
    <AppShell active="irregular-verbs" crumbs={["Reference", "Irregular Verbs", "Test"]}>
      <IrregularVerbsTest />
    </AppShell>
  );
}
