/*!
 * LEEA Learner Components — Sunshine Organizer
 *
 * Reusable graphic organizer based on the classic Cengage "sunshine" layout
 * (center circle + N triangular rays, curved label per ray). Designed to be
 * dropped into any Leo learner app via:
 *
 *   <script src="/components/sunshine.js"></script>
 *   …
 *   el.innerHTML = buildSunshine({ id, words, saved, onSelect, centerLabel });
 *
 * The standard Cengage organizer has 6 rays (WHO / WHAT / WHEN / WHERE / WHY /
 * HOW). This template supports 3–8 rays at evenly-spaced angles (or custom),
 * so it works for question prompts, vocabulary words, theme word webs, etc.
 *
 * Config (passed to buildSunshine):
 *   id           string  required  DOM id for the SVG root
 *   words        Array<{ word, emoji?, color? }> required, one entry per ray
 *   centerLabel  string  optional  text inside the center sun
 *   centerEmoji  string  optional  small emoji above the label (default ☀️)
 *   centerHint   string  optional  small caption below the label
 *   saved        Record<number, string|truthy>  optional  if a ray index has a
 *                truthy value, it renders in the "filled" state with a check
 *   angles       number[] optional  ray angles in degrees (0 = right, -90 = top);
 *                                   defaults to evenly spaced starting at top
 *   onSelect     (index, word) => void  optional  click/tap handler per ray
 *
 * Saved-state rendering: rays with a truthy `saved[i]` get a green check
 * badge near the tip and a softly highlighted fill. Tapping any ray fires
 * `onSelect(index, words[index])`.
 */
(function () {
  const _sunshineConfigs = {};

  // Warm sun palette cycled across rays. Each entry: { fill, stroke, glow, filled }.
  // `filled` is the slightly more saturated version shown when saved[i] is truthy.
  const PALETTE = [
    { fill: "#ffcf4d", stroke: "#c08a1a", glow: "#fff3cc", filled: "#ffc41a" },
    { fill: "#ffb56b", stroke: "#c46a1a", glow: "#ffe1c2", filled: "#ff9f3c" },
    { fill: "#ff8f7a", stroke: "#c44a3a", glow: "#ffd3c9", filled: "#ff7459" },
    { fill: "#fbcb6d", stroke: "#b58018", glow: "#fbe6b6", filled: "#f5b73d" },
    { fill: "#ffd187", stroke: "#bf8a26", glow: "#ffe8c2", filled: "#ffbf52" },
    { fill: "#ff9f6b", stroke: "#b85a26", glow: "#ffd6bf", filled: "#ff8240" },
    { fill: "#ffe07a", stroke: "#bf9118", glow: "#fff1c2", filled: "#ffd140" },
    { fill: "#ff7e6e", stroke: "#bf3b2e", glow: "#ffcfc7", filled: "#ff5f4d" }
  ];

  // SVG viewBox is square. All geometry is relative to (CX, CY).
  const VB = 640;
  const CX = VB / 2;
  const CY = VB / 2;
  const R_CENTER = 132;      // outer radius of the center sun
  const R_BASE = 124;        // ray base sits just inside the center ring
  const R_TIP = 296;         // tip of each ray
  const R_LABEL = 168;       // baseline for curved word labels
  const R_EMOJI = 230;       // emoji position along ray
  const R_CHECK = 268;       // saved check badge position along ray

  // ── Geometry helpers ──────────────────────────────────────────────────
  const deg = (d) => (d * Math.PI) / 180;
  const point = (r, a) => [CX + r * Math.cos(deg(a)), CY + r * Math.sin(deg(a))];
  const fmt = (n) => Math.round(n * 100) / 100;

  function buildRayShape(angle, halfAngle) {
    const [bx1, by1] = point(R_BASE, angle - halfAngle);
    const [bx2, by2] = point(R_BASE, angle + halfAngle);
    const [tx, ty] = point(R_TIP, angle);
    return `M ${fmt(bx1)} ${fmt(by1)} L ${fmt(tx)} ${fmt(ty)} L ${fmt(bx2)} ${fmt(by2)} Z`;
  }

  // Arc path for the curved label baseline (clockwise sweep so text reads left-to-right).
  function buildLabelArc(angle, halfAngle) {
    const start = angle - halfAngle * 0.85;
    const end = angle + halfAngle * 0.85;
    const [x1, y1] = point(R_LABEL, start);
    const [x2, y2] = point(R_LABEL, end);
    return `M ${fmt(x1)} ${fmt(y1)} A ${R_LABEL} ${R_LABEL} 0 0 1 ${fmt(x2)} ${fmt(y2)}`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ── Public API ─────────────────────────────────────────────────────────
  function buildSunshine(config) {
    if (!config || !config.id || !Array.isArray(config.words) || config.words.length === 0) {
      return "";
    }
    const id = config.id;
    _sunshineConfigs[id] = config;

    const N = config.words.length;
    const angles =
      Array.isArray(config.angles) && config.angles.length === N
        ? config.angles
        : Array.from({ length: N }, (_, i) => -90 + (360 / N) * i);
    // Each ray spans this many degrees per side from its center angle.
    const halfAngle = (360 / N) * 0.5 * 0.78;

    const saved = config.saved || {};
    const centerEmoji = config.centerEmoji || "☀️";
    const centerLabel = config.centerLabel || "";
    const centerHint = config.centerHint || "";

    // Pre-compute per-ray data.
    const rays = config.words.map((w, i) => {
      const tone = PALETTE[i % PALETTE.length];
      const filled = Boolean(saved[i]);
      return {
        i,
        angle: angles[i],
        word: escapeHtml(w.word || ""),
        emoji: w.emoji || "",
        tone: w.color ? { ...tone, fill: w.color } : tone,
        filled
      };
    });

    // ── SVG build ────────────────────────────────────────────────────────
    const defs = `
      <defs>
        <radialGradient id="sun-center-${id}" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#fffbe8" />
          <stop offset="65%" stop-color="#ffe9a1" />
          <stop offset="100%" stop-color="#f6c948" />
        </radialGradient>
        ${rays
          .map(
            (r) => `
          <radialGradient id="sun-ray-${id}-${r.i}" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stop-color="${r.tone.glow}" />
            <stop offset="100%" stop-color="${r.filled ? r.tone.filled : r.tone.fill}" />
          </radialGradient>
        `
          )
          .join("")}
        <filter id="sun-shadow-${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.10" />
        </filter>
      </defs>
    `;

    const raysSvg = rays
      .map((r) => {
        const shape = buildRayShape(r.angle, halfAngle);
        const arc = buildLabelArc(r.angle, halfAngle);
        const arcId = `sun-arc-${id}-${r.i}`;
        const [ex, ey] = point(R_EMOJI, r.angle);
        const [ckx, cky] = point(R_CHECK, r.angle);
        return `
          <g class="sun-ray ${r.filled ? "is-filled" : ""}" data-i="${r.i}"
             tabindex="0" role="button"
             aria-label="${r.word}${r.filled ? " (answered)" : ""}"
             onclick="window._sunshineSelect && window._sunshineSelect('${id}', ${r.i})"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window._sunshineSelect && window._sunshineSelect('${id}', ${r.i})}">
            <path class="sun-ray-shape" d="${shape}"
              fill="url(#sun-ray-${id}-${r.i})"
              stroke="${r.tone.stroke}" stroke-width="2.5" stroke-linejoin="round"
              filter="url(#sun-shadow-${id})" />
            <path id="${arcId}" d="${arc}" fill="none" />
            <text class="sun-ray-label" font-size="20" font-weight="800" fill="#3a2a05" letter-spacing="0.5">
              <textPath href="#${arcId}" startOffset="50%" text-anchor="middle">${r.word}</textPath>
            </text>
            <text class="sun-ray-emoji" x="${fmt(ex)}" y="${fmt(ey)}" font-size="32"
              text-anchor="middle" dominant-baseline="central">${r.emoji}</text>
            ${
              r.filled
                ? `<g class="sun-ray-check" transform="translate(${fmt(ckx)} ${fmt(cky)})">
                     <circle r="14" fill="#1f8a3a" stroke="#fff" stroke-width="2.5" />
                     <path d="M -5 0 L -1 4 L 6 -4" fill="none" stroke="#fff" stroke-width="3"
                       stroke-linecap="round" stroke-linejoin="round" />
                   </g>`
                : ""
            }
          </g>
        `;
      })
      .join("");

    const centerSvg = `
      <g class="sun-center">
        <circle cx="${CX}" cy="${CY}" r="${R_CENTER}"
          fill="url(#sun-center-${id})" stroke="#c08a1a" stroke-width="3" />
        <circle cx="${CX}" cy="${CY}" r="${R_CENTER - 9}"
          fill="none" stroke="#fff" stroke-width="2" stroke-opacity="0.65" />
        ${
          centerEmoji
            ? `<text x="${CX}" y="${CY - 38}" font-size="40" text-anchor="middle" dominant-baseline="central">${centerEmoji}</text>`
            : ""
        }
        ${
          centerLabel
            ? `<text x="${CX}" y="${CY + (centerEmoji ? 10 : -8)}" font-size="22" font-weight="900"
                 fill="#5a3d05" text-anchor="middle" dominant-baseline="central">${escapeHtml(centerLabel)}</text>`
            : ""
        }
        ${
          centerHint
            ? `<text x="${CX}" y="${CY + 42}" font-size="13" font-weight="600"
                 fill="#8a6512" text-anchor="middle" dominant-baseline="central">${escapeHtml(centerHint)}</text>`
            : ""
        }
      </g>
    `;

    return `
      <div class="sunshine-wrap" style="display:flex;justify-content:center;width:100%">
        <svg id="${id}" class="sunshine-svg" viewBox="0 0 ${VB} ${VB}"
          xmlns="http://www.w3.org/2000/svg"
          style="max-width:560px;width:100%;height:auto;font-family:Outfit,Albert Sans,system-ui,sans-serif">
          ${defs}
          ${raysSvg}
          ${centerSvg}
        </svg>
      </div>
      <style>
        .sunshine-svg .sun-ray { cursor: pointer; transition: transform .18s ease, filter .18s ease; transform-origin: ${CX}px ${CY}px; transform-box: view-box; }
        .sunshine-svg .sun-ray:hover, .sunshine-svg .sun-ray:focus-visible { transform: scale(1.035); filter: brightness(1.04); outline: none; }
        .sunshine-svg .sun-ray:focus-visible .sun-ray-shape { stroke-width: 4; }
        .sunshine-svg .sun-ray.is-filled .sun-ray-shape { stroke-width: 3; }
        .sunshine-svg text { user-select: none; }
        @media (prefers-reduced-motion: reduce) { .sunshine-svg .sun-ray { transition: none; } }
      </style>
    `;
  }

  // Click bridge: configs live in the closure, so the SVG's inline onclick
  // looks up the latest config (including its current onSelect callback).
  window._sunshineSelect = function (id, index) {
    const cfg = _sunshineConfigs[id];
    if (!cfg) return;
    if (typeof cfg.onSelect === "function") {
      cfg.onSelect(index, cfg.words ? cfg.words[index] : undefined);
    }
  };

  window.buildSunshine = buildSunshine;
})();
