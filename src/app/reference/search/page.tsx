import { AppShell } from "@/components/AppShell";
import { ReferenceSearchPage } from "@/components/ReferencePage";

export default function ReferenceSearchRoute() {
  return (
    <AppShell active="search" crumbs={["Home", "English", "Reference", "Search"]}>
      <ReferenceSearchPage />
    </AppShell>
  );
}
