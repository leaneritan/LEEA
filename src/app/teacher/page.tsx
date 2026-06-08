import { AppShell } from "@/components/AppShell";
import { TeacherDashboard } from "@/components/TeacherDashboard";

export default function TeacherRoute() {
  return (
    <AppShell active="teacher" crumbs={["Home", "Neritan"]}>
      <TeacherDashboard />
    </AppShell>
  );
}
