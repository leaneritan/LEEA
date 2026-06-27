import { AppShell } from "@/components/AppShell";
import { ReferenceSearch } from "@/components/reference/ReferenceSearch";
import { Suspense } from "react";

export default function ReferenceSearchRoute() {
  return (
    <AppShell active="search" crumbs={["Reference", "Search"]}>
      <Suspense fallback={<div className="refv2-search-empty">Loading search…</div>}>
        <ReferenceSearch />
      </Suspense>
    </AppShell>
  );
}
