import { AppShell } from "@/components/AppShell";
import { GeographyCourseHome } from "@/components/geography/GeographyCourseHome";

export default function GeographyPage() {
  return (
    <AppShell active="geography" crumbs={["Home", "Geography"]}>
      <GeographyCourseHome />
    </AppShell>
  );
}
