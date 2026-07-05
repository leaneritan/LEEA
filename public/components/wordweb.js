/* ═══════════════════════════════════════════════════════════════════════
   wordweb.js — reusable editable word web for LEEA teacher decks + Leo apps
   ───────────────────────────────────────────────────────────────────────
   Load once per page:
     <script src="/components/wordweb.js"></script>

   Render into an element:
     el.innerHTML = buildWordWeb({
       id:              'web-dad',                  // unique per page
       center:          { text: 'Dad', emoji: '👨' },
       centerEditable:  true,                        // Leo can type the center oval too (default true)
       nodes: [
         { text: 'watches movies', emoji: '🎬' },
         { text: 'plays soccer',  emoji: '⚽' }
       ],
       addable:      true,                           // show "+" button
       removable:    true,                            // show "×" on each oval
       editable:     true,                            // ovals are directly typable
       maxNodes:     8,
       minNodes:     0,
       storageKey:   'leea-4-8-grammar-1-web1',       // optional — persists nodes + sentences
       sentenceBuilder: true,                          // show a per-node sentence line under the web
       sentenceTemplate: '{center} is a person who {node}.', // {center}/{node} placeholders, Leo can rewrite freely
       onChange:     (nodes) => { ... }               // optional callback, receives nodes incl. .sentence
     });

   Behaviour:
     • Ovals are real HTML elements — only the text itself is
       contenteditable (never mixed with the emoji or remove-button in the
       same editable node, which would corrupt on typing) — so Leo types
       directly on the oval, no native prompt() popup.
     • Center oval is editable too when centerEditable is true (default).
     • Tap "+" → adds an empty oval, focus jumps straight into it.
     • Tap "×" on a filled oval → removes it.
     • storageKey persists nodes (text/emoji/sentence) + center text to
       localStorage and reloads on re-render.
     • sentenceBuilder renders one sentence "card" per filled node: a row
       of tappable word chips (center + every filled node's word) that
       append into an editable line below, pre-filled from sentenceTemplate
       but fully rewritable by Leo (typing or an "⌫ Undo" last-word button).
       The whole sentence box scrolls internally past a few lines so it
       never gets clipped by a host page's fixed-height layout.
═══════════════════════════════════════════════════════════════════════ */

(function () {
  if (window.buildWordWeb) return; // single-load guard

  window.LEEA_WEB_STATE = window.LEEA_WEB_STATE || {};

  function buildWordWeb(opts) {
    const id = opts.id || ('word-web-' + Math.random().toString(36).slice(2, 8));
    const state = {
      id,
      center: {
        text: (opts.center && opts.center.text) || 'Center',
        emoji: (opts.center && opts.center.emoji) || '⭐'
      },
      nodes: (opts.nodes || []).map((n) => ({ text: n.text || '', emoji: n.emoji || '', sentence: n.sentence || '' })),
      opts: {
        editable: opts.editable !== false,
        centerEditable: opts.centerEditable !== false,
        addable: opts.addable !== false,
        removable: opts.removable !== false,
        maxNodes: opts.maxNodes || 8,
        minNodes: opts.minNodes || 0,
        storageKey: opts.storageKey || null,
        onChange: opts.onChange || null,
        sentenceBuilder: opts.sentenceBuilder !== false,
        sentenceTemplate: opts.sentenceTemplate || '{center} — {node}',
        accent: opts.accent || '#3B82F6',
        accentDark: opts.accentDark || '#1E3A8A',
        filledFill: opts.filledFill || '#DCFCE7',
        filledStroke: opts.filledStroke || '#16A34A',
        filledInk: opts.filledInk || '#14532D'
      }
    };

    // Load saved state if storageKey present
    if (state.opts.storageKey) {
      try {
        const raw = localStorage.getItem(state.opts.storageKey);
        if (raw) {
          const saved = JSON.parse(raw);
          if (Array.isArray(saved)) {
            // legacy shape: bare array of nodes
            state.nodes = saved;
          } else if (saved && typeof saved === 'object') {
            if (Array.isArray(saved.nodes)) state.nodes = saved.nodes;
            if (saved.center && typeof saved.center.text === 'string') state.center.text = saved.center.text;
          }
        }
      } catch (e) { /* ignore */ }
    }

    // Ensure at least minNodes
    while (state.nodes.length < state.opts.minNodes) {
      state.nodes.push({ text: '', emoji: '', sentence: '' });
    }

    window.LEEA_WEB_STATE[id] = state;
    return renderWeb(id);
  }

  function renderWeb(id) {
    const state = window.LEEA_WEB_STATE[id];
    if (!state) return '';
    const { center, nodes, opts } = state;

    const W = 900;
    const H = 540;
    const cx = W / 2;
    const cy = H / 2;
    const radius = 195;
    const centerRx = 100;
    const centerRy = 60;
    const nodeRx = 95;
    const nodeRy = 52;
    const count = Math.max(nodes.length, 1);

    // Connector lines only — ovals are HTML elements overlaid on top.
    let svg = '<svg class="leea-web-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" style="position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none">';
    for (let i = 0; i < nodes.length; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '" stroke="#93C5FD" stroke-width="3" stroke-linecap="round" opacity="0.6"/>';
    }
    svg += '</svg>';

    let html = '<div class="leea-web-stage" style="position:relative;width:100%;max-width:900px;aspect-ratio:' + W + '/' + H + ';margin:0 auto">' + svg;

    // Center oval
    html += buildOvalHtml({
      leftPct: (cx / W) * 100,
      topPct: (cy / H) * 100,
      wPct: (centerRx * 2 / W) * 100,
      hPct: (centerRy * 2 / H) * 100,
      emoji: center.emoji,
      text: center.text,
      placeholder: 'Type here',
      fill: opts.accent,
      stroke: opts.accentDark,
      ink: '#fff',
      fontSize: 16,
      editable: opts.centerEditable,
      idxAttr: 'center',
      onInputAttr: 'window._leeaWebCenterInput(\'' + id + '\', this)',
      removeBtn: ''
    });

    // Outer ovals
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      const filled = n && n.text && n.text.trim().length > 0;

      let removeBtn = '';
      if (opts.removable && filled) {
        removeBtn = '<button type="button" class="leea-web-remove" onclick="event.stopPropagation();window._leeaWebRemove(\'' + id + '\',' + i + ')" aria-label="Remove" style="position:absolute;top:-8px;right:-8px;width:26px;height:26px;border-radius:50%;background:#DC2626;color:#fff;border:2px solid #fff;font-weight:900;font-size:16px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2">×</button>';
      }

      html += buildOvalHtml({
        leftPct: (x / W) * 100,
        topPct: (y / H) * 100,
        wPct: (nodeRx * 2 / W) * 100,
        hPct: (nodeRy * 2 / H) * 100,
        emoji: n.emoji,
        text: n.text,
        placeholder: 'Tap to type',
        fill: filled ? opts.filledFill : '#fff',
        stroke: filled ? opts.filledStroke : '#93C5FD',
        ink: filled ? opts.filledInk : '#6B7280',
        fontSize: 14,
        editable: opts.editable,
        idxAttr: String(i),
        onInputAttr: 'window._leeaWebNodeInput(\'' + id + '\',' + i + ', this)',
        removeBtn: removeBtn
      });
    }

    html += '</div>';

    // Controls below the web
    let controls = '<div class="leea-web-controls" style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;align-items:center">';
    if (opts.addable && nodes.length < opts.maxNodes) {
      controls += '<button type="button" onclick="window._leeaWebAdd(\'' + id + '\')" style="background:' + opts.accent + ';color:#fff;border:0;padding:12px 24px;border-radius:12px;font-weight:800;font-size:18px;cursor:pointer;font-family:Outfit,sans-serif;letter-spacing:.04em">＋ Add oval</button>';
    }
    if (opts.editable) {
      controls += '<button type="button" onclick="window._leeaWebReset(\'' + id + '\')" style="background:#fff;color:#6B7280;border:2px solid #E5E3DC;padding:10px 22px;border-radius:12px;font-weight:700;font-size:16px;cursor:pointer;font-family:Outfit,sans-serif">↺ Reset</button>';
    }
    controls += '</div>';

    // Sentence builder — tap word chips to build each line (or type/edit
    // directly). The whole box is its own scroll region (max-height +
    // overflow-y) so a web with several filled nodes never gets clipped
    // by a host page's fixed-height slide — only this inner box scrolls.
    let builder = '';
    if (opts.sentenceBuilder) {
      const filledNodes = nodes.map((n, i) => ({ n, i })).filter((entry) => entry.n.text && entry.n.text.trim());
      if (filledNodes.length) {
        const chipWords = [center.text, ...filledNodes.map((entry) => entry.n.text)]
          .map((w) => (w || '').trim())
          .filter((w, idx, arr) => w && arr.indexOf(w) === idx);

        builder += '<div class="leea-web-sentences" style="margin-top:18px;max-height:230px;overflow-y:auto;padding:2px 4px 4px;display:flex;flex-direction:column;gap:14px">';
        builder += '<div style="font-size:13px;font-weight:800;color:#6B7280;letter-spacing:.04em;text-transform:uppercase;position:sticky;top:0;background:inherit">✏️ Build your sentences — tap words to add them</div>';
        for (const entry of filledNodes) {
          const { n, i } = entry;
          const defaultSentence = opts.sentenceTemplate
            .replace('{center}', center.text || '')
            .replace('{node}', n.text || '');
          const value = (n.sentence && n.sentence.trim()) ? n.sentence : defaultSentence;

          const chipsRow = chipWords.map((w) =>
            '<button type="button" onclick="window._leeaWebChipTap(\'' + id + '\',' + i + ',\'' + w.replace(/'/g, "\\'").replace(/"/g, '&quot;') + '\')" '
            + 'style="background:#fff;color:' + opts.accentDark + ';border:2px solid ' + opts.accent + ';border-radius:20px;padding:4px 12px;font-size:13px;font-weight:700;cursor:pointer;font-family:Outfit,sans-serif">'
            + esc(w) + '</button>'
          ).join('');

          builder += '<div class="leea-web-sentence-card" style="background:#F9FAFB;border:2px solid #E5E3DC;border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:8px">'
            + '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">' + chipsRow
            + '<button type="button" onclick="window._leeaWebUndoWord(\'' + id + '\',' + i + ')" style="margin-left:auto;background:none;border:1px dashed #9CA3AF;color:#6B7280;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer;font-family:Outfit,sans-serif;flex-shrink:0">⌫ Undo</button>'
            + '</div>'
            + '<div contenteditable="true" class="leea-web-sentence-line" data-idx="' + i + '"'
            + ' oninput="window._leeaWebSentenceInput(\'' + id + '\',' + i + ', this)"'
            + ' style="background:#fff;border:2px solid #E5E3DC;border-radius:12px;padding:12px 14px;font-size:15px;font-weight:600;color:#374151;font-family:Outfit,sans-serif;outline:none;cursor:text">'
            + esc(value) + '</div>'
            + '</div>';
        }
        builder += '</div>';
      }
    }

    return '<div class="leea-web-wrap" data-web-id="' + id + '">' + html + controls + builder + '</div>';
  }

  /* The outer oval <div> is a plain (non-editable) flex container that only
     handles shape/position/click-to-focus. The emoji lives in its own
     non-editable node. Only `.leea-web-text` is contenteditable, and it
     contains nothing but a text node — this is what keeps typing from
     corrupting the oval's structure. */
  function buildOvalHtml(spec) {
    const display = spec.text && spec.text.trim() ? spec.text : '';
    const showPlaceholder = !display;
    const emojiHtml = spec.emoji
      ? '<div class="leea-web-emoji" style="font-size:' + (spec.idxAttr === 'center' ? '26px' : '18px') + ';line-height:1;pointer-events:none">' + esc(spec.emoji) + '</div>'
      : '';

    const textStyle = 'outline:none;max-width:100%;' + (showPlaceholder ? 'opacity:.7;font-style:italic;font-weight:500' : 'font-weight:800');
    const textAttrs = spec.editable
      ? ' contenteditable="true" data-idx="' + spec.idxAttr + '" oninput="' + spec.onInputAttr + '"'
      : '';
    const textHtml = '<div class="leea-web-text"' + textAttrs + ' style="' + textStyle + '">' + esc(display || (spec.editable ? spec.placeholder : '')) + '</div>';

    const focusForward = spec.editable
      ? ' onclick="var t=this.querySelector(\'.leea-web-text\'); if(t \&\& document.activeElement!==t) t.focus();"'
      : '';

    return '<div class="leea-web-oval' + (spec.idxAttr === 'center' ? ' leea-web-oval--center' : '') + '"'
      + focusForward
      + ' style="position:absolute;left:' + spec.leftPct + '%;top:' + spec.topPct + '%;width:' + spec.wPct + '%;height:' + spec.hPct + '%;'
      + 'transform:translate(-50%,-50%);border-radius:50%;background:' + spec.fill + ';border:3px solid ' + spec.stroke + ';'
      + 'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:6px;'
      + 'font-family:Outfit,sans-serif;font-size:' + spec.fontSize + 'px;color:' + spec.ink + ';'
      + 'cursor:' + (spec.editable ? 'text' : 'default') + ';overflow:hidden;word-break:break-word;line-height:1.2">'
      + emojiHtml + textHtml + spec.removeBtn + '</div>';
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c];
    });
  }

  function save(id) {
    const state = window.LEEA_WEB_STATE[id];
    if (!state) return;
    if (state.opts.storageKey) {
      try {
        localStorage.setItem(state.opts.storageKey, JSON.stringify({ center: state.center, nodes: state.nodes }));
      } catch (e) {}
    }
    if (state.opts.onChange) {
      try { state.opts.onChange(state.nodes.slice()); } catch (e) {}
    }
  }

  // Tracks a pending deferred blur-rerender per web id (see the focusout
  // listener below), so an authoritative rerender triggered by Add/Remove/
  // Reset can cancel it — otherwise that stale rerender fires a moment
  // later and silently steals focus back off the oval Leo just started
  // typing into.
  const pendingRerender = {};

  // Re-render everything (refreshes oval fill color + the sentence builder),
  // optionally restoring focus to a specific oval's text node afterward so
  // adding a new oval doesn't leave Leo with no active cursor.
  function rerender(id, opts) {
    if (pendingRerender[id]) {
      clearTimeout(pendingRerender[id]);
      delete pendingRerender[id];
    }
    const focusIdx = opts && opts.focusIdx;
    const wrap = document.querySelector('[data-web-id="' + id + '"]');
    if (!wrap) return;
    const parent = wrap.parentElement;
    if (!parent) return;
    parent.innerHTML = renderWeb(id);
    if (focusIdx != null) {
      const el = parent.querySelector('.leea-web-text[data-idx="' + focusIdx + '"]');
      if (el) focusAndSelect(el);
    }
  }

  function focusAndSelect(el) {
    // Just focus — the document-level 'focusin' listener below selects all
    // of the element's content (a no-op for an empty new oval, and exactly
    // what lets Leo immediately overwrite a filled one). A second, separate
    // selection call here previously raced with that listener and won,
    // collapsing the cursor after the placeholder text instead of selecting
    // it — which caused typed text to get appended after "Tap to type"
    // rather than replacing it.
    el.focus();
  }

  window._leeaWebCenterInput = function (id, el) {
    const state = window.LEEA_WEB_STATE[id];
    if (!state) return;
    state.center.text = (el.textContent || '').trim();
    save(id);
  };

  window._leeaWebNodeInput = function (id, idx, el) {
    const state = window.LEEA_WEB_STATE[id];
    if (!state) return;
    const text = (el.textContent || '').trim();
    state.nodes[idx] = Object.assign({}, state.nodes[idx], { text });
    save(id);
    // Deliberately no re-render here — refreshing on every keystroke would
    // reset the oval's fill color / sentence builder mid-type and could
    // steal Leo's caret. Re-render happens on blur instead (see listener
    // below), once he's actually finished typing that oval.
  };

  window._leeaWebSentenceInput = function (id, idx, el) {
    const state = window.LEEA_WEB_STATE[id];
    if (!state || !state.nodes[idx]) return;
    state.nodes[idx].sentence = el.textContent || '';
    save(id);
  };

  // Tapping a word chip appends it to that line's sentence — repeatable
  // (chips never get "used up") so a word can appear more than once in
  // a sentence. Mutates textContent directly (not user typing), so the
  // usual oninput handler must be called manually to persist state.
  window._leeaWebChipTap = function (id, idx, word) {
    const el = document.querySelector('[data-web-id="' + id + '"] .leea-web-sentence-line[data-idx="' + idx + '"]');
    if (!el) return;
    const current = (el.textContent || '').replace(/\s+$/, '');
    el.textContent = current ? current + ' ' + word : word;
    window._leeaWebSentenceInput(id, idx, el);
  };

  // Removes the last whitespace-separated word from a line — a quick
  // "oops" undo that doesn't require selecting/deleting text by hand.
  window._leeaWebUndoWord = function (id, idx) {
    const el = document.querySelector('[data-web-id="' + id + '"] .leea-web-sentence-line[data-idx="' + idx + '"]');
    if (!el) return;
    const words = (el.textContent || '').trim().split(/\s+/).filter(Boolean);
    words.pop();
    el.textContent = words.join(' ');
    window._leeaWebSentenceInput(id, idx, el);
  };

  window._leeaWebRemove = function (id, idx) {
    const state = window.LEEA_WEB_STATE[id];
    if (!state || !state.opts.removable) return;
    if (state.nodes.length <= state.opts.minNodes) return;
    state.nodes.splice(idx, 1);
    save(id);
    rerender(id);
  };

  window._leeaWebAdd = function (id) {
    const state = window.LEEA_WEB_STATE[id];
    if (!state || !state.opts.addable) return;
    if (state.nodes.length >= state.opts.maxNodes) return;
    state.nodes.push({ text: '', emoji: '', sentence: '' });
    save(id);
    rerender(id, { focusIdx: state.nodes.length - 1 });
  };

  window._leeaWebReset = function (id) {
    const state = window.LEEA_WEB_STATE[id];
    if (!state) return;
    if (!window.confirm('Reset this word web? All your words will be cleared.')) return;
    state.nodes = [];
    save(id);
    rerender(id);
  };

  // Select all existing text whenever an oval/sentence line is focused OR
  // clicked — these are short phrases, so re-selecting on every tap (even a
  // second tap on an element that was already focused, which does not fire
  // a fresh 'focusin') is more forgiving for a kid tapping repeatedly than
  // risking a click landing mid-word and inserting new text there instead
  // of replacing it.
  function selectAllContent(el) {
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (err) { /* ignore */ }
  }

  function isWebEditable(el) {
    return !!(el && el.classList && (el.classList.contains('leea-web-text') || el.classList.contains('leea-web-sentence-line')));
  }

  document.addEventListener('focusin', function (e) {
    if (isWebEditable(e.target)) selectAllContent(e.target);
  }, true);

  document.addEventListener('mouseup', function (e) {
    // mouseup (not click) fires after the browser's own native caret
    // placement from the click, so this reliably overrides it.
    if (isWebEditable(e.target) && document.activeElement === e.target) selectAllContent(e.target);
  }, true);

  // Re-render (to refresh oval fill + the sentence builder list) once Leo
  // finishes typing and leaves an oval — not on every keystroke.
  document.addEventListener('focusout', function (e) {
    const el = e.target;
    if (!el || !el.classList || !el.classList.contains('leea-web-text')) return;
    const wrap = el.closest('.leea-web-wrap');
    if (!wrap) return;
    const id = wrap.getAttribute('data-web-id');
    if (!id || !window.LEEA_WEB_STATE[id]) return;
    // Defer by one tick: focusout fires before a same-tick click (e.g. on
    // the "+ Add oval" / "×" / Reset buttons) has been dispatched. Replacing
    // the DOM synchronously here would destroy that button before its own
    // click handler runs, silently swallowing the click. If Add/Remove/Reset
    // already ran its own authoritative rerender by the time this fires,
    // rerender() itself will have cancelled this timer — see pendingRerender.
    pendingRerender[id] = setTimeout(function () {
      delete pendingRerender[id];
      rerender(id);
    }, 0);
  }, true);

  window.buildWordWeb = buildWordWeb;
})();
