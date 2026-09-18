import { AppShell } from "@/components/AppShell";
import { TestsPage } from "@/components/TestsPage";

export default function TestsRoute() {
  return (
    <AppShell active="tests" crumbs={["Tests"]}>
      <TestsPage />
    </AppShell>
  );
}
