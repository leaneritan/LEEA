import { AppShell } from "@/components/AppShell";
import { HomeDashboard } from "@/components/HomeDashboard";

export default function HomePage() {
  return (
    <AppShell active="home" crumbs={["Home"]}>
      <HomeDashboard />
    </AppShell>
  );
}

