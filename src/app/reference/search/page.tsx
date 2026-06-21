import { AppShell } from "@/components/AppShell";
import { ReferenceSearch } from "@/components/reference/ReferenceSearch";

export default function ReferenceSearchRoute() {
  return (
    <AppShell active="search" crumbs={["Reference", "Search"]}>
      <ReferenceSearch />
    </AppShell>
  );
}
