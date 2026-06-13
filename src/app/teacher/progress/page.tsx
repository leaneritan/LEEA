import { AppShell } from "@/components/AppShell";
import { AcademicProgressPage } from "@/components/AcademicProgressPage";

export default function TeacherProgressRoute() {
  return (
    <AppShell active="progress" crumbs={["Home", "Neritan", "Progress"]}>
      <AcademicProgressPage />
    </AppShell>
  );
}
