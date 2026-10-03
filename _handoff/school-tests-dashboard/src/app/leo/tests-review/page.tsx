import { AppShell } from "@/components/AppShell";
import { AcademicProgressPage } from "@/components/AcademicProgressPage";

// Leo's own entry to his school-test review cards. Same component as
// Neritan's Progress page, opened in Leo mode.
export default function LeoTestsReviewRoute() {
  return (
    <AppShell active="assignments" crumbs={["Home", "Leo", "テストの復習"]}>
      <AcademicProgressPage initialMode="leo" />
    </AppShell>
  );
}
