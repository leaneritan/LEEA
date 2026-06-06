import { AppShell } from "@/components/AppShell";
import { ReferencePage } from "@/components/ReferencePage";

export default function ReferenceRoute() {
  return (
    <AppShell active="reference" crumbs={["Home", "English", "Reference"]}>
      <ReferencePage />
    </AppShell>
  );
}

