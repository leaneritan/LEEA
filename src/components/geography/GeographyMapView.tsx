import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { GeographyMap } from "../../../content/subjects/geography/maps";

export function GeographyMapView({ map }: { map: GeographyMap }) {
  return (
    <section className="geo-map-page">
      <header className="geo-map-bar">
        <div>
          <span className="eyebrow">Geography - {map.topicLabel} - {map.sourceLabel}</span>
          <h1>{map.title}</h1>
          <p className="geo-map-jp-title">{map.jpTitle}</p>
        </div>
        <nav aria-label="Map actions">
          <Link className="ghost-button" href="/geography">
            All Maps
          </Link>
          {map.embedPath ? (
            <a className="ghost-button" href={map.embedPath} rel="noreferrer" target="_blank">
              Open Fullscreen
              <ExternalLink size={16} />
            </a>
          ) : null}
        </nav>
      </header>

      {map.embedPath ? (
        <iframe className="geo-map-frame" src={map.embedPath} title={map.title} />
      ) : (
        <div className="geo-map-missing">
          <h2>Map file needed</h2>
          <p>Add the standalone HTML at <code>public/geography/{map.id}.html</code>, then set <code>embedPath</code> on this map.</p>
        </div>
      )}
    </section>
  );
}
