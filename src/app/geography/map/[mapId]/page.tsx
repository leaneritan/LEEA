import { permanentRedirect } from "next/navigation";

/**
 * Maps briefly lived at /geography/map/<id> while Geography had chapter pages
 * competing for the /geography/<id> segment. The chapters are gone, so the
 * short URL is the real one again and this only exists to carry over links
 * made while the longer form was live.
 */
export default async function LegacyGeographyMapPage({ params }: { params: Promise<{ mapId: string }> }) {
  const { mapId } = await params;
  permanentRedirect(`/geography/${mapId}`);
}
