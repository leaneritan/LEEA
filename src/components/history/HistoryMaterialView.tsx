"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  historyMaterialKindLabels,
  historyMaterials,
  isHistoryMaterialReady,
  type HistoryMaterial
} from "../../../content/subjects/history/materials";

/**
 * History's page chrome, deliberately one thin bar — current material, the
 * switcher, fullscreen — with the frame taking everything else. Same model as
 * Geography: History is Leo-support, so the shell stays out of the way.
 *
 * Nothing here records progress. The 巻末年表 is a chart Leo looks things up
 * in, not a quiz; a material that does have something to score should report
 * through the shared bridge rather than growing a second one here.
 */
export function HistoryMaterialView({ material }: { material: HistoryMaterial }) {
  return (
    <section className="hist-page">
      <div className="hist-bar">
        <div className="hist-bar-title">
          <strong>{material.jpShortTitle}</strong>
          <small>
            {material.title}
            {material.sourceLabel ? ` · ${material.sourceLabel}` : ""}
          </small>
        </div>

        <nav className="hist-switch" aria-label="History materials">
          {historyMaterials.map((entry) => {
            const ready = isHistoryMaterialReady(entry);
            const className = [
              "hist-switch-btn",
              entry.id === material.id ? "hist-switch-btn--active" : "",
              ready ? "" : "hist-switch-btn--planned"
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <Link
                aria-current={entry.id === material.id ? "page" : undefined}
                className={className}
                href={`/history/${entry.id}`}
                key={entry.id}
                title={`${entry.title} — ${historyMaterialKindLabels[entry.kind].jp}`}
              >
                {entry.jpShortTitle}
              </Link>
            );
          })}
        </nav>

        <div className="hist-bar-end">
          <span className="hist-pill">{historyMaterialKindLabels[material.kind].jp}</span>
          {material.embedPath ? (
            <a
              className="hist-fullscreen"
              href={material.embedPath}
              rel="noreferrer"
              target="_blank"
              title="Open fullscreen"
            >
              <ExternalLink size={15} />
            </a>
          ) : null}
        </div>
      </div>

      {material.embedPath ? (
        <iframe className="hist-frame" src={material.embedPath} title={material.title} />
      ) : (
        <div className="hist-missing">
          <h2>{material.jpShortTitle} — file needed</h2>
          <p>{material.summary}</p>
          <p>
            Add the standalone HTML at <code>public/history/{material.id}.html</code>, then set{" "}
            <code>embedPath</code> and <code>buildStatus: &quot;live&quot;</code> on this material.
          </p>
        </div>
      )}
    </section>
  );
}
