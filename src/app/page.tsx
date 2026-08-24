import { loadMathPracticeCounts } from "../../content/subjects/math/loadSection";
import { AppShell } from "@/components/AppShell";
import { HomeDashboard } from "@/components/HomeDashboard";

export default function HomePage() {
  const mathPracticeCounts = loadMathPracticeCounts();
  return (
    <AppShell active="home" crumbs={["Home"]}>
      <HomeDashboard mathPracticeCounts={mathPracticeCounts} />
    </AppShell>
  );
}
