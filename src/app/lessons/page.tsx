import { AppShell } from "@/components/AppShell";
import { LessonsPage } from "@/components/LessonsPage";

export default function LessonsRoute() {
  return (
    <AppShell active="english" crumbs={["Home", "English", "Lessons"]}>
      <LessonsPage />
    </AppShell>
  );
}
