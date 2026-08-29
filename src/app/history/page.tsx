import { AppShell } from "@/components/AppShell";
import { HistoryMaterialView } from "@/components/history/HistoryMaterialView";
import { getDefaultHistoryMaterial } from "../../../content/subjects/history/materials";

export default function HistoryPage() {
  const material = getDefaultHistoryMaterial();

  return (
    <AppShell active="history" crumbs={["Home", "History"]}>
      <HistoryMaterialView material={material} />
    </AppShell>
  );
}
