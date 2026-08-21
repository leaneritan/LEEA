import { AppShell } from "@/components/AppShell";
import { GeographyHome } from "@/components/geography/GeographyHome";

export default function GeographyPage() {
  return (
    <AppShell active="geography" crumbs={["Home", "Geography"]}>
      <GeographyHome />
    </AppShell>
  );
}
