/* ──────────────────────────────────────────────────────────────────────
 * /components/chart-picker.js
 *
 * Maps Lesson Planner cue words to the right chart builder. Skills
 * (/grammar-app, /vocab-app, /reading-app, future /writing-app) call
 * this once per chart instead of hardcoding which builder to use.
 *
 * Why this exists: the LP says things like "use a 3-column chart" or
 * "draw a sunshine organizer" or "fill the step flowchart". Up to now
 * each lesson hand-imported the right builder. This file is the single
 * source of truth that maps LP cue → builder, so:
 *   - skills can generate lessons without hardcoded builder calls
 *   - new chart templates plug into the cue table once, not per-lesson
 *   - typos in LP cue words fail loud with a list of accepted aliases
 *
 * Load after the components it dispatches to:
 *   <script src="/components/charts.js"></script>
 *   <script src="/components/sunshine.js"></script>
 *   <script src="/components/wordweb.js"></script>
 *   <script src="/components/flowchart.js"></script>
 *   <script src="/components/chart-picker.js"></script>
 *
 * Then in any lesson:
 *   el.innerHTML = pickChart('3-column chart', {
 *     id: 'plan-1', mode: 'fill',
 *     columns: ['First', 'Then', 'Finally'],
 *     storageKey: 'leea-4-7-writing-tcc'
 *   });
 *
 * Or get the builder by name and call it yourself:
 *   const builder = chartPicker('sunshine');
 *   el.innerHTML = builder({ id: 'sun-1', words: [...] });
 *
 * Introspect what's available:
 *   listAvailableCharts();
 *   // → [{ id: 'three-col', cues: [...], builder: 'buildThreeColChart' }, ...]
 * ────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── The cue table ─────────────────────────────────────────────────
   * Each entry: { id, builder, cues, dependsOn }
   *   id         — short stable identifier (used by listAvailableCharts)
   *   builder    — name of the window.build* global to call
   *   cues       — array of cue patterns the LP might use. Matching is
   *                case-insensitive AND tolerant: hyphens, underscores,
   *                multiple spaces all normalize to single spaces.
   *   dependsOn  — script file the consumer must have loaded
   *
   * Patterns can include {n} as a wildcard for any digit ("{n}-col" →
   * matches "3-col", "4-col", "5-col"). Useful for the N-col family.
   * ────────────────────────────────────────────────────────────────── */
  var CHART_CUES = [
    {
      id: 'four-col',
      builder: 'buildFourColChart',
      cues: [
        '4-column chart', '4-col chart', 'four-column chart', 'four col chart',
        '4 col', '4-col', 'four column', 'four-column'
      ],
      dependsOn: '/components/charts.js'
    },
    {
      id: 'three-col',
      builder: 'buildThreeColChart',
      cues: [
        '3-column chart', '3-col chart', 'three-column chart', 'three col chart',
        '3 col', '3-col', 'three column', 'three-column'
      ],
      dependsOn: '/components/charts.js'
    },
    {
      id: 'n-col',
      builder: 'buildNColChart',
      cues: [
        'n-column chart', 'n-col chart', 'multi-column chart',
        '{n}-column chart', '{n} column chart', '{n}-col'
      ],
      dependsOn: '/components/charts.js'
    },
    {
      id: 'dnd-sort',
      builder: 'buildDndSorter',
      cues: [
        'dnd sorter', 'drag and drop sort', 'drag-and-drop sort',
        'sort into zones', 'classification sort', 'two-column chart',
        '2-column chart', '2 col', '2-col', 'two col', 'two-col'
      ],
      dependsOn: '/components/charts.js'
    },
    {
      id: 'sunshine',
      builder: 'buildSunshine',
      cues: [
        'sunshine', 'sunshine chart', 'sunshine organizer', 'sunshine graphic organizer',
        'who what when where why how', 'wh-organizer', '5w1h'
      ],
      dependsOn: '/components/sunshine.js'
    },
    {
      id: 'word-web',
      builder: 'buildWordWeb',
      cues: [
        'word web', 'wordweb', 'word map', 'spider map', 'concept web'
      ],
      dependsOn: '/components/wordweb.js'
    },
    {
      id: 'step-flowchart',
      builder: 'buildStepFlowchart',
      cues: [
        'step flowchart', 'sequence flowchart', '{n}-step flowchart',
        'flowchart', 'flow chart', 'step sequence', 'numbered flowchart'
      ],
      dependsOn: '/components/flowchart.js'
    }
  ];

  /* ── Internals ─────────────────────────────────────────────────── */

  function _normalize(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .replace(/[_]/g, ' ')         // _ → space
      .replace(/-/g, ' ')           // -  → space
      .replace(/\s+/g, ' ')         // collapse whitespace
      .trim();
  }

  function _matchesCue(input, cue) {
    var nInput = _normalize(input);
    var nCue = _normalize(cue);

    /* Exact-after-normalize match */
    if (nInput === nCue) return true;

    /* {n} wildcard → match any single digit */
    if (nCue.indexOf('{n}') !== -1) {
      var pattern = nCue.replace(/\{n\}/g, '\\d+');
      var re = new RegExp('^' + pattern + '$');
      if (re.test(nInput)) return true;
    }

    /* Substring fall-back (e.g. LP says "complete a sunshine organizer
       on page X" — pick up "sunshine organizer"). Only if the cue
       string is at least 6 chars to avoid false matches on short words. */
    if (nCue.length >= 6 && nInput.indexOf(nCue) !== -1) return true;

    return false;
  }

  function _findEntry(lpCue) {
    for (var i = 0; i < CHART_CUES.length; i++) {
      var entry = CHART_CUES[i];
      for (var j = 0; j < entry.cues.length; j++) {
        if (_matchesCue(lpCue, entry.cues[j])) return entry;
      }
    }
    return null;
  }

  /* ── Public API ────────────────────────────────────────────────── */

  /**
   * Look up the builder function for an LP cue. Returns the function
   * (not a string). Throws with a useful message if no cue matches or
   * the dependency script wasn't loaded.
   */
  function chartPicker(lpCue) {
    var entry = _findEntry(lpCue);
    if (!entry) {
      var available = CHART_CUES.map(function (e) { return e.cues[0]; }).join(' · ');
      throw new Error(
        'chartPicker: no chart matches cue ' + JSON.stringify(lpCue) +
        '. Available cues: ' + available
      );
    }
    var builder = window[entry.builder];
    if (typeof builder !== 'function') {
      throw new Error(
        'chartPicker: cue ' + JSON.stringify(lpCue) +
        ' resolved to ' + entry.builder + ' but that global is missing. ' +
        'Did you load ' + entry.dependsOn + ' in the page?'
      );
    }
    return builder;
  }

  /**
   * Look up the builder AND invoke it with the given config. Returns
   * the HTML string (or whatever the builder returns). Convenience
   * for skills that do one chart per call site.
   */
  function pickChart(lpCue, config) {
    return chartPicker(lpCue)(config);
  }

  /**
   * Introspection — what charts can we pick? Returns an array of
   *   { id, builder, cues[], dependsOn, available }
   * where `available` reflects whether the dependency script is loaded.
   */
  function listAvailableCharts() {
    return CHART_CUES.map(function (e) {
      return {
        id: e.id,
        builder: e.builder,
        cues: e.cues.slice(),
        dependsOn: e.dependsOn,
        available: typeof window[e.builder] === 'function'
      };
    });
  }

  /* expose */
  window.chartPicker          = chartPicker;
  window.pickChart            = pickChart;
  window.listAvailableCharts  = listAvailableCharts;

}());
