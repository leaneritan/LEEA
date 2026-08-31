"use client";

import { useState } from "react";
import {
  countAssessmentTracks,
  getAssessmentAlbum,
  getAssessmentLevels,
  getAssessmentUnits,
  isAssessmentTrackAvailable,
  type AssessmentTrack
} from "@/data/assessmentAudio";

const COURSE = "our-world";

function rowLabel(track: AssessmentTrack) {
  if (track.kind !== "checkpoint") return `Track ${track.track}`;
  const [from, to] = track.checkpoint ?? [];
  return from && to ? `Review · Units ${from}–${to}` : "Review";
}

/**
 * Every assessment track in one place, by level and unit.
 *
 * The unit pages carry a unit's own audio, but they exist only for the handful
 * of units that have been built — which left most of the library reachable only
 * by typing its URL. This page is the way in: pick a level, find the unit, press
 * play.
 */
export function TestAudioPage() {
  const levels = getAssessmentLevels(COURSE);
  const [selectedLevel, setSelectedLevel] = useState(levels[0] ?? 4);
  // null means every unit. Kept across a level change, since someone working
  // in Unit 8 is usually comparing the same unit between levels.
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);

  if (!levels.length) {
    return (
      <section className="ow-page ow-page--final">
        <header className="screen-heading">
          <span>Our World</span>
          <h1>Test audio</h1>
        </header>
        <p className="test-audio__empty">No assessment audio has been added yet.</p>
      </section>
    );
  }

  const units = getAssessmentUnits(COURSE, selectedLevel);
  const album = getAssessmentAlbum(COURSE, selectedLevel);
  const { total, available } = countAssessmentTracks(COURSE, selectedLevel);
  // A unit the chosen level does not have falls back to showing everything,
  // rather than an empty page that looks broken.
  const unitExists = units.some((entry) => entry.unit === selectedUnit);
  const shownUnits = selectedUnit && unitExists ? units.filter((entry) => entry.unit === selectedUnit) : units;
  const shownTracks = shownUnits.reduce((count, entry) => count + entry.tracks.length, 0);

  return (
    <section className="ow-page ow-page--final">
      <header className="screen-heading">
        <span>Our World</span>
        <h1>Test audio</h1>
        <p>The listening tracks for the test after each unit.</p>
      </header>

      <div className="ow-level-picker">
        <span>Choose a level</span>
        <div>
          {[1, 2, 3, 4, 5, 6].map((level) => {
            const has = levels.includes(level);
            return (
              <button
                aria-pressed={level === selectedLevel}
                className={level === selectedLevel ? "active" : has ? "" : "locked"}
                disabled={!has}
                key={level}
                onClick={() => setSelectedLevel(level)}
                type="button"
              >
                Level {level}
                {has ? "" : " · none"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="ow-level-picker test-audio__units-picker">
        <span>Jump to a unit</span>
        <div>
          <button
            aria-pressed={selectedUnit === null}
            className={selectedUnit === null ? "active" : ""}
            onClick={() => setSelectedUnit(null)}
            type="button"
          >
            All
          </button>
          {units.map(({ unit, tracks }) => (
            <button
              aria-pressed={unit === selectedUnit}
              className={unit === selectedUnit ? "active" : ""}
              key={unit}
              onClick={() => setSelectedUnit(unit)}
              title={`${tracks.length} tracks`}
              type="button"
            >
              {unit}
            </button>
          ))}
        </div>
      </div>

      <header className="unit-list-heading">
        <h2>
          Level {selectedLevel}
          {selectedUnit && unitExists ? ` · Unit ${selectedUnit}` : ""}
        </h2>
        <strong>
          {selectedUnit && unitExists
            ? `${shownTracks} tracks`
            : available === total
              ? `${total} tracks`
              : `${available} of ${total} tracks added`}
          {album ? ` · ${album}` : ""}
        </strong>
      </header>

      <div className="test-audio__units">
        {shownUnits.map(({ unit, tracks }) => (
          <section className="test-audio__unit" key={unit}>
            {/* The heading above already names the unit when one is picked. */}
            {shownUnits.length > 1 ? <h3>Unit {unit}</h3> : null}
            <ol className="unit-audio__list">
              {tracks.map((track) => {
                const playable = isAssessmentTrackAvailable(track);
                return (
                  <li className={`unit-audio__row${playable ? "" : " is-missing"}`} key={track.path}>
                    <span className="unit-audio__num" aria-hidden="true">
                      {track.track}
                    </span>
                    <div className="unit-audio__copy">
                      <strong>{rowLabel(track)}</strong>
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
        ))}
      </div>
    </section>
  );
}
