import { AppShell } from "@/components/AppShell";
import { VocabularyPractice } from "@/components/reference/VocabularyPractice";

export default function ReferencePracticeRoute() {
  return (
    <AppShell active="practice" crumbs={["Reference", "Practice"]}>
      <VocabularyPractice />
    </AppShell>
  );
}
