/* charts.js — LEEA reusable interactive chart templates
 *
 * All functions return an HTML string safe for innerHTML assignment.
 * Each function registers a deferred init via setTimeout(0) that wires
 * up interactivity after the markup lands in the DOM.
 *
 * Exposed globals:
 *   buildDndSorter(config)      → HTML string · drag-and-drop sorter
 *   buildFourColChart(config)   → HTML string · 4-column writing planner chart
 *
 * Template IDs in docs/chart-templates.md:
 *   dnd-sorter        (two-column-chart variant, drag-and-drop)
 *   four-col-chart    (Hobby / What it is / How you do it / Examples)
 */

(function () {
  'use strict';

  /* ── per-instance config store ────────────────────────────── */
  var _dndConfigs = {};

  /* ────────────────────────────────────────────────────────────
   * buildDndSorter
   *
   * Drag-and-drop column sorter. Works for any number of zones.
   * Supports mouse drag + touch drag (iPad-friendly).
   *
   * config = {
   *   id        : string   — unique per page
   *   tiles     : [{ text: string, answer: string }]
   *   zones     : [{ key: string, label: string, color: string }]
   *   onComplete: function — called once all tiles are correctly placed
   * }
   *
   * Usage:
   *   el.innerHTML = buildDndSorter({ id:'dnd-vocab', tiles:[…], zones:[…] });
   * ──────────────────────────────────────────────────────────── */
  function buildDndSorter(config) {
    var id = config.id;
    _dndConfigs[id] = config;

    /* scoped CSS ------------------------------------------------ */
    var css = [
      '#' + id + '{display:flex;flex-direction:column;gap:12px;height:100%;font-family:Outfit,sans-serif;min-height:0}',

      /* bank label */
      '#' + id + ' .dnd-lbl{font-size:14px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;padding:0 2px}',

      /* tile bank */
      '#' + id + ' .dnd-bank{display:flex;flex-wrap:wrap;gap:10px;padding:14px 16px;background:#f9fafb;border:2px solid #e5e7eb;border-radius:14px;min-height:60px;align-content:flex-start;transition:background .2s}',
      '#' + id + ' .dnd-bank.all-done{background:#f0fdf4;border-color:#bbf7d0}',

      /* individual tiles */
      '#' + id + ' .dnd-tile{padding:9px 18px;background:#fff;border:2px solid #d1d5db;border-radius:20px;font-size:17px;font-weight:700;cursor:grab;user-select:none;transition:border-color .15s,background .15s,opacity .15s;font-family:Outfit,sans-serif;touch-action:none;white-space:nowrap}',
      '#' + id + ' .dnd-tile:hover{border-color:#16A34A;background:#f0fdf4}',
      '#' + id + ' .dnd-tile.is-dragging{opacity:.3;transform:scale(.93)}',
      '#' + id + ' .dnd-tile.correct{background:#f0fdf4;border-color:#16A34A;color:#15803d;cursor:default;pointer-events:none}',
      '#' + id + ' .dnd-tile.wrong{background:#fef2f2;border-color:#ef4444;animation:_dndShake .4s}',

      /* zone row */
      '#' + id + ' .dnd-zones{display:flex;gap:14px;flex:1;min-height:0}',

      /* individual zone */
      '#' + id + ' .dnd-zone{flex:1;border:2px solid #e5e7eb;border-radius:14px;display:flex;flex-direction:column;overflow:hidden;transition:border-color .15s,background .15s}',
      '#' + id + ' .dnd-zone.dnd-over{border-style:dashed;border-color:#93c5fd;background:rgba(219,234,254,.2)}',

      /* zone header */
      '#' + id + ' .dnd-zh{padding:10px 16px;color:#fff;font-size:17px;font-weight:700;text-align:center;flex-shrink:0;letter-spacing:.5px}',

      /* zone body (drop target area) */
      '#' + id + ' .dnd-zb{flex:1;display:flex;flex-wrap:wrap;gap:8px;padding:10px 12px;align-content:flex-start;overflow-y:auto}',
      '#' + id + ' .dnd-zb:empty::after{content:"Drop here";color:#9ca3af;font-size:14px;font-style:italic;padding:4px 0}',

      /* shake keyframe (unique name to avoid clash with other pages) */
      '@keyframes _dndShake{0%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(3px)}100%{transform:translateX(0)}}',
    ].join('');

    /* zones HTML ----------------------------------------------- */
    var zonesHtml = config.zones.map(function (z) {
      return (
        '<div class="dnd-zone" id="' + id + '-z-' + z.key + '" data-key="' + z.key + '">' +
          '<div class="dnd-zh" style="background:' + z.color + '">' + z.label + '</div>' +
          '<div class="dnd-zb" id="' + id + '-zb-' + z.key + '"></div>' +
        '</div>'
      );
    }).join('');

    /* tile bank HTML (shuffled) --------------------------------- */
    var shuffled = config.tiles.slice().sort(function () { return Math.random() - 0.5; });
    var tilesHtml = shuffled.map(function (t, i) {
      return (
        '<div class="dnd-tile"' +
          ' id="' + id + '-t' + i + '"' +
          ' draggable="true"' +
          ' data-answer="' + t.answer + '">' +
          t.text +
        '</div>'
      );
    }).join('');

    var html =
      '<style>' + css + '</style>' +
      '<div id="' + id + '">' +
        '<div class="dnd-lbl">🃏 Word bank — drag each word to the right column</div>' +
        '<div class="dnd-bank" id="' + id + '-bank">' + tilesHtml + '</div>' +
        '<div class="dnd-zones">' + zonesHtml + '</div>' +
      '</div>';

    /* wire up interactivity after innerHTML is set */
    setTimeout(function () { _initDnd(id); }, 0);
    return html;
  }

  /* ── internal: attach all event listeners ────────────────── */
  function _initDnd(id) {
    var cfg = _dndConfigs[id];
    if (!cfg) return;
    var root = document.getElementById(id);
    if (!root) return;

    var state = { correct: 0, total: cfg.tiles.length };
    var dragging = null;

    /* ── mouse drag ────────────────────────────────────────── */
    root.querySelectorAll('.dnd-tile').forEach(function (tile) {
      tile.addEventListener('dragstart', function (e) {
        dragging = tile;
        /* delay class so the browser grabs the non-dimmed tile as ghost */
        setTimeout(function () { tile.classList.add('is-dragging'); }, 0);
        e.dataTransfer.setData('text/plain', tile.id);
        e.dataTransfer.effectAllowed = 'move';
      });
      tile.addEventListener('dragend', function () {
        tile.classList.remove('is-dragging');
        dragging = null;
      });
    });

    root.querySelectorAll('.dnd-zone').forEach(function (zone) {
      var enterCount = 0; /* track nested dragenter/dragleave */

      zone.addEventListener('dragenter', function (e) {
        e.preventDefault();
        enterCount++;
        zone.classList.add('dnd-over');
      });
      zone.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });
      zone.addEventListener('dragleave', function () {
        if (--enterCount <= 0) { enterCount = 0; zone.classList.remove('dnd-over'); }
      });
      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        enterCount = 0;
        zone.classList.remove('dnd-over');
        if (dragging) _handleDrop(id, cfg, state, dragging, zone);
      });
    });

    /* ── touch drag (iPad / mobile) ────────────────────────── */
    var touchTile = null;
    var touchClone = null;
    var touchOffX = 0;
    var touchOffY = 0;

    root.querySelectorAll('.dnd-tile').forEach(function (tile) {

      tile.addEventListener('touchstart', function (e) {
        touchTile = tile;
        tile.classList.add('is-dragging');
        var t = e.touches[0];
        var rect = tile.getBoundingClientRect();
        touchOffX = t.clientX - rect.left;
        touchOffY = t.clientY - rect.top;

        /* floating clone so the user sees what they are dragging */
        touchClone = tile.cloneNode(true);
        touchClone.removeAttribute('id');
        touchClone.style.cssText = [
          'position:fixed',
          'z-index:99999',
          'pointer-events:none',
          'font-family:Outfit,sans-serif',
          'padding:9px 18px',
          'background:#fff',
          'border:2px solid #16A34A',
          'border-radius:20px',
          'font-size:17px',
          'font-weight:700',
          'white-space:nowrap',
          'opacity:.92',
          'transform:scale(1.07)',
          'box-shadow:0 8px 24px rgba(0,0,0,.18)',
          'left:' + (t.clientX - touchOffX) + 'px',
          'top:' + (t.clientY - touchOffY) + 'px',
        ].join(';');
        document.body.appendChild(touchClone);
        e.preventDefault();
      }, { passive: false });

      tile.addEventListener('touchmove', function (e) {
        if (!touchClone) return;
        var t = e.touches[0];
        touchClone.style.left = (t.clientX - touchOffX) + 'px';
        touchClone.style.top  = (t.clientY - touchOffY) + 'px';
        e.preventDefault();
      }, { passive: false });

      tile.addEventListener('touchend', function (e) {
        if (!touchTile) return;
        if (touchClone) { touchClone.remove(); touchClone = null; }
        touchTile.classList.remove('is-dragging');

        /* hit-test: find the zone under the finger */
        var t = e.changedTouches[0];
        var el = document.elementFromPoint(t.clientX, t.clientY);
        var zone = null;
        if (el) {
          zone = (typeof el.closest === 'function')
            ? el.closest('.dnd-zone')
            : _closestZone(el);
          /* make sure it belongs to this sorter instance */
          if (zone && !root.contains(zone)) zone = null;
        }
        if (zone) _handleDrop(id, cfg, state, touchTile, zone);
        touchTile = null;
      });

      tile.addEventListener('touchcancel', function () {
        if (touchClone) { touchClone.remove(); touchClone = null; }
        if (touchTile) { touchTile.classList.remove('is-dragging'); touchTile = null; }
      });
    });
  }

  /* ── drop handler ─────────────────────────────────────────── */
  function _handleDrop(id, cfg, state, tile, zone) {
    if (tile.classList.contains('correct')) return; /* already placed */

    if (tile.dataset.answer === zone.dataset.key) {
      /* ✅ correct */
      tile.classList.remove('wrong');
      tile.classList.add('correct');
      var zoneBody = document.getElementById(id + '-zb-' + zone.dataset.key);
      if (zoneBody) zoneBody.appendChild(tile);
      state.correct++;

      /* mark bank as complete when all tiles are placed */
      if (state.correct >= state.total) {
        var bank = document.getElementById(id + '-bank');
        if (bank) bank.classList.add('all-done');
        if (cfg.onComplete) cfg.onComplete();
      }
    } else {
      /* ❌ wrong — flash red, stay in place */
      tile.classList.remove('wrong');
      /* force reflow so animation restarts if already in wrong state */
      void tile.offsetWidth;
      tile.classList.add('wrong');
      setTimeout(function () { tile.classList.remove('wrong'); }, 700);
    }
  }

  /* ── IE11 fallback for Element.closest ────────────────────── */
  function _closestZone(el) {
    while (el && el !== document) {
      if (el.classList && el.classList.contains('dnd-zone')) return el;
      el = el.parentNode;
    }
    return null;
  }

  /* ── per-instance config store ────────────────────────────── */
  var _chartConfigs = {};

  /* ────────────────────────────────────────────────────────────
   * buildFourColChart
   *
   * 4-column writing planner chart. Designed for Explanation Writing
   * (Hobby / What it is / How you do it / Examples) but the column
   * labels are configurable so it can serve any 4-column LP chart.
   *
   * Three modes:
   *   - "display"  : read-only chart (model on the wall — Plan demo)
   *   - "fill"     : Leo types into the cells (his own chart)
   *   - "reveal"   : cells start blank; tap a chip to drop a value in
   *                  (lets a teacher reveal the model step-by-step)
   *
   * config = {
   *   id          : string      — unique per page (instance key)
   *   mode        : "display" | "fill" | "reveal"   (default "display")
   *   title       : string      — header above the table (optional)
   *   columns     : [string×4]  — the 4 column headers
   *   rows        : [[string,string,string,string], ...]   — model rows
   *                              (display & reveal modes only)
   *   onCellEdit  : function(rowIx, colIx, value) — fill mode only
   *   onCellFill  : function(rowIx, colIx, value) — reveal mode only
   *   storageKey  : string      — fill mode auto-persists to localStorage
   * }
   *
   * Returns: HTML string with self-contained scoped CSS.
   *
   * Usage:
   *   el.innerHTML = buildFourColChart({
   *     id: 'fcc-leo', mode: 'fill',
   *     columns: ['Hobby','What it is','How you do it','Examples'],
   *     storageKey: 'leea-4-8-writing-fcc-leo'
   *   });
   * ──────────────────────────────────────────────────────────── */
  function buildFourColChart(config) {
    var id = config.id;
    var mode = config.mode || 'display';
    var columns = config.columns || ['Hobby', 'What it is', 'How you do it', 'Examples'];
    var rows = config.rows || [];
    _chartConfigs[id] = config;

    /* scoped CSS ----------------------------------------------- */
    var css = [
      '#' + id + '{font-family:Outfit,sans-serif;display:flex;flex-direction:column;gap:10px;width:100%}',
      '#' + id + ' .fcc-title{font-size:22px;font-weight:900;color:#15803d;text-align:center;letter-spacing:0.5px}',
      '#' + id + ' .fcc-wrap{background:#fff;border:3px solid #d1d5db;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.06)}',
      '#' + id + ' table{width:100%;border-collapse:collapse;table-layout:fixed}',
      '#' + id + ' thead th{background:#374151;color:#fff;padding:16px 18px;font-size:18px;font-weight:800;text-align:left;letter-spacing:0.3px;border-right:1px solid rgba(255,255,255,0.15)}',
      '#' + id + ' thead th:last-child{border-right:none}',
      '#' + id + ' tbody td{padding:20px 22px;font-size:20px;color:#1f2937;font-weight:600;line-height:1.5;vertical-align:top;border-top:1px solid #e5e7eb;border-right:1px solid #e5e7eb;min-height:80px}',
      '#' + id + ' tbody td:last-child{border-right:none}',
      '#' + id + ' tbody tr:nth-child(odd) td{background:#f9fafb}',
      /* fill-mode input */
      '#' + id + ' .fcc-input{width:100%;border:2px dashed #d97706;background:#fffbeb;border-radius:8px;padding:12px 14px;font:600 19px/1.5 Outfit,sans-serif;color:#1f2937;outline:none;resize:none;min-height:60px}',
      '#' + id + ' .fcc-input:focus{border-color:#f97316;background:#fff7ed}',
      /* reveal-mode slot */
      '#' + id + ' .fcc-slot{display:flex;align-items:center;justify-content:center;min-height:60px;color:#9ca3af;font-style:italic;font-size:18px;border:2px dashed #d1d5db;border-radius:8px;padding:10px 14px;background:#fff;text-align:center}',
      '#' + id + ' .fcc-slot.filled{color:#15803d;border-style:solid;border-color:#16a34a;background:#f0fdf4;font-weight:700;font-style:normal;animation:fccPop 0.4s ease}',
      '@keyframes fccPop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}',
      /* reveal-mode chip bank below the chart */
      '#' + id + ' .fcc-bank{display:flex;flex-wrap:wrap;gap:12px;padding:18px;background:#f9fafb;border:2px solid #e5e7eb;border-radius:12px;margin-top:6px}',
      '#' + id + ' .fcc-chip{background:#fff;border:2px solid #f97316;border-radius:99px;padding:12px 22px;font:700 18px/1 Outfit,sans-serif;color:#ea580c;cursor:pointer;transition:all .15s}',
      '#' + id + ' .fcc-chip:hover{background:#f97316;color:#fff}',
      '#' + id + ' .fcc-chip.placed{opacity:.35;pointer-events:none}'
    ].join('');

    /* header row */
    var thead = '<thead><tr>';
    for (var c = 0; c < columns.length; c++) {
      thead += '<th>' + _escHTML(columns[c]) + '</th>';
    }
    thead += '</tr></thead>';

    /* body rows depend on mode */
    var tbody = '<tbody>';
    if (mode === 'display') {
      for (var r = 0; r < rows.length; r++) {
        tbody += '<tr>';
        for (var c2 = 0; c2 < columns.length; c2++) {
          var v = (rows[r] && rows[r][c2] != null) ? rows[r][c2] : '';
          tbody += '<td>' + _escHTML(v) + '</td>';
        }
        tbody += '</tr>';
      }
    } else if (mode === 'fill') {
      var fillRows = config.rowCount || 1;
      for (var fr = 0; fr < fillRows; fr++) {
        tbody += '<tr>';
        for (var fc = 0; fc < columns.length; fc++) {
          tbody += '<td><textarea class="fcc-input" data-row="' + fr + '" data-col="' + fc + '" placeholder="type here..." rows="2"></textarea></td>';
        }
        tbody += '</tr>';
      }
    } else if (mode === 'reveal') {
      for (var rr = 0; rr < rows.length; rr++) {
        tbody += '<tr>';
        for (var rc = 0; rc < columns.length; rc++) {
          var key = rr + '_' + rc;
          tbody += '<td><div class="fcc-slot" data-key="' + key + '">tap a chip below</div></td>';
        }
        tbody += '</tr>';
      }
    }
    tbody += '</tbody>';

    /* reveal-mode chip bank (flattened from rows) */
    var bank = '';
    if (mode === 'reveal') {
      bank = '<div class="fcc-bank">';
      for (var br = 0; br < rows.length; br++) {
        for (var bc = 0; bc < columns.length; bc++) {
          var bv = (rows[br] && rows[br][bc] != null) ? rows[br][bc] : '';
          if (bv === '') continue;
          var bkey = br + '_' + bc;
          bank += '<button class="fcc-chip" data-key="' + bkey + '" data-val="' + _escAttr(bv) + '">' + _escHTML(bv) + '</button>';
        }
      }
      bank += '</div>';
    }

    var html =
      '<style>' + css + '</style>' +
      '<div id="' + id + '">' +
      (config.title ? '<div class="fcc-title">' + _escHTML(config.title) + '</div>' : '') +
      '<div class="fcc-wrap"><table>' + thead + tbody + '</table></div>' +
      bank +
      '</div>';

    /* deferred init -------------------------------------------- */
    setTimeout(function () { _initFourColChart(id); }, 0);

    return html;
  }

  function _initFourColChart(id) {
    var root = document.getElementById(id);
    if (!root) return;
    var cfg = _chartConfigs[id];
    if (!cfg) return;

    if (cfg.mode === 'fill') {
      /* restore from storage */
      var saved = null;
      if (cfg.storageKey) {
        try { saved = JSON.parse(localStorage.getItem(cfg.storageKey) || 'null'); } catch (e) {}
      }
      root.querySelectorAll('.fcc-input').forEach(function (inp) {
        var r = parseInt(inp.getAttribute('data-row'), 10);
        var c = parseInt(inp.getAttribute('data-col'), 10);
        if (saved && saved[r] && saved[r][c] != null) inp.value = saved[r][c];
        inp.addEventListener('input', function () {
          if (cfg.storageKey) {
            var state = saved || [];
            if (!state[r]) state[r] = [];
            state[r][c] = inp.value;
            saved = state;
            try { localStorage.setItem(cfg.storageKey, JSON.stringify(state)); } catch (e) {}
          }
          if (typeof cfg.onCellEdit === 'function') cfg.onCellEdit(r, c, inp.value);
        });
      });
    } else if (cfg.mode === 'reveal') {
      root.querySelectorAll('.fcc-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          if (chip.classList.contains('placed')) return;
          var key = chip.getAttribute('data-key');
          var val = chip.getAttribute('data-val');
          var slot = root.querySelector('.fcc-slot[data-key="' + key + '"]');
          if (!slot) return;
          slot.textContent = val;
          slot.classList.add('filled');
          chip.classList.add('placed');
          if (typeof cfg.onCellFill === 'function') {
            var parts = key.split('_');
            cfg.onCellFill(parseInt(parts[0], 10), parseInt(parts[1], 10), val);
          }
        });
      });
    }
  }

  function _escHTML(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function _escAttr(s) {
    return _escHTML(s);
  }

  /* ──────────────────────────────────────────────────────────────
   * buildNColChart / buildThreeColChart
   * ──────────────────────────────────────────────────────────────
   * Thin wrappers over buildFourColChart, which has been N-column
   * agnostic all along. Same config shape, same modes (display /
   * fill / reveal), same storageKey behavior.
   *
   *   buildThreeColChart({ id, columns: ['A','B','C'], rows: [...] })
   *   buildNColChart    ({ id, columns: [...N strings], rows: [...] })
   *
   * Skills can pick the right wrapper based on the LP cue word —
   * "3-column chart" → buildThreeColChart, "4-column chart" →
   * buildFourColChart, "N-column chart" → buildNColChart.
   * ────────────────────────────────────────────────────────────── */
  function buildThreeColChart(config) {
    var cfg = Object.assign({}, config);
    if (!cfg.columns || cfg.columns.length !== 3) {
      cfg.columns = cfg.columns && cfg.columns.length
        ? cfg.columns.slice(0, 3).concat(['', '', '']).slice(0, 3)
        : ['Column 1', 'Column 2', 'Column 3'];
    }
    return buildFourColChart(cfg);
  }
  function buildNColChart(config) {
    return buildFourColChart(config);   // same code, any column count
  }

  /* ── expose on window ─────────────────────────────────────── */
  window.buildDndSorter = buildDndSorter;
  window.buildFourColChart = buildFourColChart;
  window.buildThreeColChart = buildThreeColChart;
  window.buildNColChart = buildNColChart;

}());
