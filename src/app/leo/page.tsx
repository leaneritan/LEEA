import { AppShell } from "@/components/AppShell";
import { LeoDashboard } from "@/components/LeoDashboard";

export default function LeoPage() {
  return (
    <AppShell active="assignments" crumbs={["Home", "Leo"]}>
      <LeoDashboard />
    </AppShell>
  );
}
