import Link from "next/link";
import { geographyMaps, groupGeographyMapsByTopic } from "../../../content/subjects/geography/maps";

const STATUS_LABEL: Record<string, string> = { done: "Explored", now: "Open now", todo: "Not started" };

export function GeographyHome() {
  const groups = groupGeographyMapsByTopic(geographyMaps);
  const readyCount = geographyMaps.filter((map) => map.embedPath).length;

  return (
    <section className="geo-hub">
      <header className="screen-heading">
        <span>Subject</span>
        <h1>Geography</h1>
        <p>
          Maps Leo can actually move — slide through time, switch layers on and off, and tap a place to read its story.
          Every map here is a standalone interactive atlas, not a picture of one.
        </p>
      </header>

      <div className="geo-stats">
        <div className="geo-stat"><span>Maps ready</span><strong>{readyCount}</strong><small>open and explorable</small></div>
        <div className="geo-stat"><span>Topics</span><strong>{groups.length}</strong><small>map collections</small></div>
        <div className="geo-stat"><span>In the library</span><strong>{geographyMaps.length}</strong><small>maps registered</small></div>
      </div>

      {groups.map((group) => (
        <div className="geo-group" key={group.topic}>
          <div className="geo-group-head">
            <span className="geo-group-dot" style={{ background: group.palette.color }} />
            <h2>{group.topicLabel}</h2>
            <span className="geo-group-jp">{group.topic}</span>
            <span className="geo-group-count">{group.maps.length} {group.maps.length === 1 ? "map" : "maps"}</span>
          </div>

          <div className="geo-map-grid">
            {group.maps.map((map) => {
              const ready = Boolean(map.embedPath);
              const card = (
                <>
                  <div className="geo-map-visual" style={{ background: group.palette.dark }}>
                    <span>{map.sourceLabel}</span>
                    <strong>{map.jpShortTitle}</strong>
                    <small>{map.kind}</small>
                  </div>
                  <div className="geo-map-copy">
                    <span className="geo-map-status" style={{ background: group.palette.tint, color: group.palette.dark }}>
                      {ready ? STATUS_LABEL[map.status] : "Coming soon"}
                    </span>
                    <h3>{map.title}</h3>
                    <p className="geo-map-jp-title">{map.jpTitle}</p>
                    <p>{map.summary}</p>
                    <p className="geo-map-jp">{map.jpSummary}</p>
                    <div className="geo-map-layers">
                      {map.layers.map((layer) => (
                        <span key={layer}>{layer}</span>
                      ))}
                    </div>
                    <div className="geo-map-foot">
                      <small>{map.meta}</small>
                      <b>{ready ? "Open map →" : "In progress"}</b>
                    </div>
                  </div>
                </>
              );

              return ready ? (
                <Link className="geo-map-card" href={`/geography/${map.id}`} key={map.id}>
                  {card}
                </Link>
              ) : (
                <article className="geo-map-card geo-map-card--planned" key={map.id}>
                  {card}
                </article>
              );
            })}
          </div>
        </div>
      ))}

      {geographyMaps.length === 0 ? (
        <div className="geo-empty">
          <strong>No maps yet</strong>
          <span>Drop a standalone map into <code>public/geography/</code> and register it in <code>content/subjects/geography/maps.ts</code>.</span>
        </div>
      ) : null}
    </section>
  );
}
