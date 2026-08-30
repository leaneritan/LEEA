import { AppShell } from "@/components/AppShell";
import { TestAudioPage } from "@/components/TestAudioPage";

export default function TestAudioRoute() {
  return (
    <AppShell active="english" crumbs={["Home", "English", "Our World", "Test Audio"]}>
      <TestAudioPage />
    </AppShell>
  );
}
