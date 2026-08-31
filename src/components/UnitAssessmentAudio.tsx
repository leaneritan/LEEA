import {
  getAssessmentAlbum,
  getCheckpointAssessmentTracks,
  getUnitAssessmentTracks,
  isAssessmentTrackAvailable,
  type AssessmentTrack
} from "@/data/assessmentAudio";

function bandLabel(track: AssessmentTrack) {
  const [from, to] = track.checkpoint ?? [];
  return from && to ? `Review · Units ${from}–${to}` : "Review";
}

/**
 * The ExamView listening tracks for the test taken after a unit.
 *
 * The manifest lists every track on the disc, but the audio itself is filed in
 * separately (scripts/sort-assessment-audio.mjs), so a track may have no file
 * yet. Which ones do is decided at build time by
 * scripts/generate-assessment-audio-map.mjs rather than from an onError
 * handler here: with preload="none" the browser never requests the file, so a
 * missing track fires no error and would render as a player that silently does
 * nothing when Leo presses it.
 */
export function UnitAssessmentAudio({ course, level, unit }: { course: string; level: number; unit: number }) {
  const unitTracks = getUnitAssessmentTracks(course, level, unit);
  const checkpointTracks = getCheckpointAssessmentTracks(course, level, unit);
  const tracks = [...unitTracks, ...checkpointTracks];
  if (!tracks.length) return null;

  const album = getAssessmentAlbum(course, level);

  return (
    <section className="unit-audio" aria-labelledby={`unit-audio-${unit}`}>
      <header className="unit-audio__head">
        <h2 id={`unit-audio-${unit}`}>Unit {unit} test audio</h2>
        {album ? <small>{album}</small> : null}
      </header>

      <ol className="unit-audio__list">
        {tracks.map((track) => {
          const playable = isAssessmentTrackAvailable(track);
          return (
            <li className={`unit-audio__row${playable ? "" : " is-missing"}`} key={track.path}>
              <span className="unit-audio__num" aria-hidden="true">
                {track.track}
              </span>
              <div className="unit-audio__copy">
                <strong>{track.kind === "checkpoint" ? bandLabel(track) : `Track ${track.track}`}</strong>
                <small>{track.title}</small>
              </div>
              {playable ? (
                <audio controls preload="none" src={track.path} aria-label={track.title} />
              ) : (
                <span className="unit-audio__pending">Not added yet</span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
