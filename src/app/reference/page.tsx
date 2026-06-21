import { AppShell } from "@/components/AppShell";
import { ReferenceBrowse } from "@/components/reference/ReferenceBrowse";

export default function ReferenceRoute() {
  return (
    <AppShell active="reference" crumbs={["Reference", "Browse"]}>
      <ReferenceBrowse />
    </AppShell>
  );
}
