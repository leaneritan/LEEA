import { AppShell } from "@/components/AppShell";
import { GeographyMapView } from "@/components/geography/GeographyMapView";
import { getDefaultGeographyMap } from "../../../content/subjects/geography/maps";

export default function GeographyPage() {
  const map = getDefaultGeographyMap();

  return (
    <AppShell active="geography" crumbs={["Home", "Geography"]}>
      <GeographyMapView map={map} />
    </AppShell>
  );
}
