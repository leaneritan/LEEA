import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GeographyMapView } from "@/components/geography/GeographyMapView";
import { geographyMaps, getGeographyMapById } from "../../../../../content/subjects/geography/maps";

export function generateStaticParams() {
  return geographyMaps.map((map) => ({ mapId: map.id }));
}

export default async function GeographyMapPage({ params }: { params: Promise<{ mapId: string }> }) {
  const { mapId } = await params;
  const map = getGeographyMapById(mapId);

  if (!map) {
    notFound();
  }

  return (
    <AppShell active="geography" crumbs={["Home", "Geography", map.title]}>
      <GeographyMapView map={map} />
    </AppShell>
  );
}
