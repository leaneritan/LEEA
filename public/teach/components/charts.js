/* charts.js — LEEA reusable interactive chart templates
 *
 * All functions return an HTML string safe for innerHTML assignment.
 * Each function registers a deferred init via setTimeout(0) that wires
 * up interactivity after the markup lands in the DOM.
 *
 * Exposed globals:
 *   buildDndSorter(config) → HTML string
 *
 * Template IDs in docs/chart-templates.md:
 *   dnd-sorter (two-column-chart variant, drag-and-drop)
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

  /* ── expose on window ─────────────────────────────────────── */
  window.buildDndSorter = buildDndSorter;

}());
