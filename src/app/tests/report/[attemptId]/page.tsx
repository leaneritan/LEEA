import { AppShell } from "@/components/AppShell";
import { TestReportPage } from "@/components/TestReportPage";

export default async function TestReportRoute({
  params
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  return (
    <AppShell active="tests" crumbs={["Tests", "Report"]}>
      <TestReportPage attemptId={attemptId} />
    </AppShell>
  );
}
