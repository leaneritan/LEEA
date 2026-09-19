import { AppShell } from "@/components/AppShell";
import { TestMistakesPage } from "@/components/TestMistakesPage";

export default function TestMistakesRoute() {
  return (
    <AppShell active="tests" crumbs={["Tests", "Mistakes"]}>
      <TestMistakesPage />
    </AppShell>
  );
}
