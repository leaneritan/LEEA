/* ──────────────────────────────────────────────────────────────────────
 * /components/flowchart.js
 *
 * buildStepFlowchart — N-step sequence chart that fills slot-by-slot
 * as Leo answers comprehension checks. Extracted from the inline
 * pattern proven in public/lessons/ow-l4-u8-reading.html (Geocache
 * 5-step flow). Lesson Planner cue word: "step flowchart", "sequence
 * flowchart", "X-step flowchart".
 *
 * Load once in <head>:
 *   <script src="/components/flowchart.js"></script>
 *
 * Build the chart:
 *   el.innerHTML = buildStepFlowchart({
 *     id:    'flow-geocache',          // unique per page
 *     title: '🏆 GEOCACHE HUNT — 5 STEPS',  // optional
 *     steps: [
 *       { emoji: '❓', placeholder: '— from ¶1 —' },
 *       { emoji: '❓', placeholder: '— from ¶2 —' },
 *       { emoji: '❓', placeholder: '— from ¶3 (a) —' },
 *       { emoji: '❓', placeholder: '— from ¶3 (b) —' },
 *       { emoji: '❓', placeholder: '— from ¶4-5 —' }
 *     ],
 *     storageKey: 'leea-4-8-reading-flow'   // optional auto-persist
 *   });
 *
 * Unlock a step from anywhere on the page when Leo earns it:
 *   unlockFlowStep('flow-geocache', 0, {
 *     emoji: '📦',
 *     caption: 'Hiders hide a cache (a box with treasure) and a notebook.'
 *   });
 *
 * Read state:
 *   getFlowStepState('flow-geocache')   // returns [{filled, emoji, caption}, …]
 *
 * Optional onUnlock callback fires when each step flips from empty → filled
 * (NOT on initial restore from storage), so callers can advance a counter,
 * update a "X / N" badge, play a sound, etc.
 *
 * The chart auto-restores from `storageKey` on init. Each unlock writes the
 * full state back to that key, so a page reload picks up where Leo left off.
 * ────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var _flowConfigs = {};   // id → config
  var _flowStates  = {};   // id → [{filled, emoji, caption}, …]

  function _escHTML(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function buildStepFlowchart(config) {
    var id = config.id;
    var steps = config.steps || [];
    _flowConfigs[id] = config;

    /* Scoped CSS — black + yellow callsign on the title bar, green-fill on
       unlocked slots, dashed grey on empty. Sized for both teacher decks
       (large screens) and learner apps (mobile-first). */
    var css = [
      '#' + id + '{font-family:Outfit,sans-serif;display:flex;flex-direction:column;gap:10px;width:100%}',
      '#' + id + ' .sf-title{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#0f172a;color:#fff;border-radius:12px 12px 0 0;padding:11px 16px;font-weight:900;font-size:17px;letter-spacing:.4px;flex-wrap:wrap}',
      '#' + id + ' .sf-count{background:#fde047;color:#0f172a;border-radius:99px;padding:3px 12px;font-size:13px;font-weight:800}',
      '#' + id + ' .sf-grid{display:grid;grid-template-columns:repeat(var(--sf-cols, 5),minmax(0,1fr));gap:10px;background:#fff;border:3px solid #d1d5db;border-top:none;border-radius:0 0 14px 14px;padding:12px;box-shadow:0 4px 14px rgba(0,0,0,.06)}',
      '#' + id + ' .sf-slot{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;padding:14px 10px;background:#f9fafb;border:2px dashed #d1d5db;border-radius:10px;min-height:120px;justify-content:center;transition:all .25s ease}',
      '#' + id + ' .sf-slot.filled{background:#f0fdf4;border:2px solid #16a34a;color:#15803d;animation:sfPop .4s ease}',
      '@keyframes sfPop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}',
      '#' + id + ' .sf-num{width:26px;height:26px;border-radius:50%;background:#374151;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0}',
      '#' + id + ' .sf-slot.filled .sf-num{background:#16a34a}',
      '#' + id + ' .sf-em{font-size:28px;line-height:1}',
      '#' + id + ' .sf-cap{font-size:13px;font-weight:700;color:#6b7280;line-height:1.4}',
      '#' + id + ' .sf-slot.filled .sf-cap{color:#15803d}',
      '@media (max-width:680px){#' + id + ' .sf-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}'
    ].join('');

    /* Default state — all empty unless storage hydrates */
    var state = [];
    for (var i = 0; i < steps.length; i++) {
      state.push({
        filled:  false,
        emoji:   steps[i].emoji || '❓',
        caption: steps[i].placeholder || ('Step ' + (i + 1))
      });
    }

    /* Restore from storage if any */
    if (config.storageKey) {
      try {
        var raw = localStorage.getItem(config.storageKey);
        if (raw) {
          var saved = JSON.parse(raw);
          if (Array.isArray(saved)) {
            for (var j = 0; j < state.length && j < saved.length; j++) {
              if (saved[j] && saved[j].filled) {
                state[j].filled  = true;
                state[j].emoji   = saved[j].emoji   || state[j].emoji;
                state[j].caption = saved[j].caption || state[j].caption;
              }
            }
          }
        }
      } catch (e) { /* ignore storage errors */ }
    }
    _flowStates[id] = state;

    /* Title bar with live counter */
    var filledCount = state.filter(function (s) { return s.filled; }).length;
    var titleBar =
      '<div class="sf-title">' +
        '<span>' + _escHTML(config.title || 'Step flowchart') + '</span>' +
        '<span class="sf-count" data-flow-counter="' + id + '">' + filledCount + ' / ' + steps.length + ' steps</span>' +
      '</div>';

    /* Slots */
    var grid = '<div class="sf-grid" style="--sf-cols:' + steps.length + '">';
    for (var k = 0; k < state.length; k++) {
      grid += _renderSlot(id, k, state[k]);
    }
    grid += '</div>';

    return '<style>' + css + '</style><div id="' + id + '">' + titleBar + grid + '</div>';
  }

  function _renderSlot(id, idx, s) {
    return (
      '<div class="sf-slot' + (s.filled ? ' filled' : '') + '" data-flow-slot="' + id + '-' + idx + '">' +
        '<div class="sf-num">' + (idx + 1) + '</div>' +
        '<div class="sf-em">' + _escHTML(s.emoji) + '</div>' +
        '<div class="sf-cap">' + _escHTML(s.caption) + '</div>' +
      '</div>'
    );
  }

  function unlockFlowStep(id, idx, payload) {
    var cfg   = _flowConfigs[id];
    var state = _flowStates[id];
    if (!cfg || !state || !state[idx]) return false;

    var alreadyFilled = state[idx].filled;
    state[idx].filled  = true;
    if (payload && payload.emoji)   state[idx].emoji   = payload.emoji;
    if (payload && payload.caption) state[idx].caption = payload.caption;

    /* Re-render this slot in place */
    var slotEl = document.querySelector('[data-flow-slot="' + id + '-' + idx + '"]');
    if (slotEl && slotEl.parentNode) {
      var tmp = document.createElement('div');
      tmp.innerHTML = _renderSlot(id, idx, state[idx]);
      slotEl.parentNode.replaceChild(tmp.firstChild, slotEl);
    }

    /* Update counter */
    var counterEl = document.querySelector('[data-flow-counter="' + id + '"]');
    if (counterEl) {
      var filled = state.filter(function (s) { return s.filled; }).length;
      counterEl.textContent = filled + ' / ' + state.length + ' steps';
    }

    /* Persist */
    if (cfg.storageKey) {
      try { localStorage.setItem(cfg.storageKey, JSON.stringify(state)); } catch (e) {}
    }

    /* Fire callback only on the empty → filled transition */
    if (!alreadyFilled && typeof cfg.onUnlock === 'function') {
      cfg.onUnlock(idx, state[idx]);
    }

    return true;
  }

  function getFlowStepState(id) {
    return _flowStates[id] ? _flowStates[id].slice() : null;
  }

  function resetFlowchart(id) {
    var cfg   = _flowConfigs[id];
    var state = _flowStates[id];
    if (!cfg || !state) return;
    for (var i = 0; i < state.length; i++) {
      state[i].filled  = false;
      state[i].emoji   = (cfg.steps[i] && cfg.steps[i].emoji)       || '❓';
      state[i].caption = (cfg.steps[i] && cfg.steps[i].placeholder) || ('Step ' + (i + 1));
    }
    var root = document.getElementById(id);
    if (root) {
      var grid = root.querySelector('.sf-grid');
      if (grid) {
        var html = '';
        for (var k = 0; k < state.length; k++) html += _renderSlot(id, k, state[k]);
        grid.innerHTML = html;
      }
      var counterEl = root.querySelector('[data-flow-counter="' + id + '"]');
      if (counterEl) counterEl.textContent = '0 / ' + state.length + ' steps';
    }
    if (cfg.storageKey) {
      try { localStorage.removeItem(cfg.storageKey); } catch (e) {}
    }
  }

  /* expose */
  window.buildStepFlowchart = buildStepFlowchart;
  window.unlockFlowStep     = unlockFlowStep;
  window.getFlowStepState   = getFlowStepState;
  window.resetFlowchart     = resetFlowchart;

}());
