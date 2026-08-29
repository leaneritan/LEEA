import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { HistoryMaterialView } from "@/components/history/HistoryMaterialView";
import { getHistoryMaterialById, historyMaterials } from "../../../../content/subjects/history/materials";

export function generateStaticParams() {
  return historyMaterials.map((material) => ({ materialId: material.id }));
}

export default async function HistoryMaterialPage({ params }: { params: Promise<{ materialId: string }> }) {
  const { materialId } = await params;
  const material = getHistoryMaterialById(materialId);

  if (!material) {
    notFound();
  }

  return (
    <AppShell active="history" crumbs={["Home", "History", material.jpShortTitle]}>
      <HistoryMaterialView material={material} />
    </AppShell>
  );
}
