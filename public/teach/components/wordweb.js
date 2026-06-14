/* ═══════════════════════════════════════════════════════════════════════
   wordweb.js — reusable editable word web for LEEA teacher decks
   ───────────────────────────────────────────────────────────────────────
   Load once per page:
     <script src="/teach/components/wordweb.js"></script>

   Render into an element:
     el.innerHTML = buildWordWeb({
       id:        'web-dad',                       // unique per page
       center:    { text: 'Dad', emoji: '👨' },
       nodes: [
         { text: 'watches movies', emoji: '🎬' },
         { text: 'plays soccer',  emoji: '⚽' }
       ],
       addable:    true,                            // show "+" button
       removable:  true,                            // show "×" on each oval
       editable:   true,                            // click oval → prompt to edit
       maxNodes:   8,
       minNodes:   0,
       storageKey: 'leea-4-8-grammar-1-web1',       // optional — persists
       onChange:   (nodes) => { ... }               // optional callback
     });

   Behaviour:
     • SVG layout, center oval + N outer ovals around it, lines connect.
     • Tap an oval → prompt for text. (Use a real modal if you want fancier.)
     • Tap "+" → adds an empty oval. Click empty oval → prompt to fill it.
     • Tap "×" on a filled oval → removes it.
     • storageKey persists state to localStorage and reloads on re-render.
     • Lines + outer ovals auto-redistribute when count changes.
═══════════════════════════════════════════════════════════════════════ */

(function () {
  if (window.buildWordWeb) return; // single-load guard

  window.LEEA_WEB_STATE = window.LEEA_WEB_STATE || {};

  function buildWordWeb(opts) {
    const id = opts.id || ('word-web-' + Math.random().toString(36).slice(2, 8));
    const state = {
      id,
      center: opts.center || { text: 'Center', emoji: '⭐' },
      nodes: (opts.nodes || []).map((n) => ({ text: n.text || '', emoji: n.emoji || '' })),
      opts: {
        editable: opts.editable !== false,
        addable: opts.addable !== false,
        removable: opts.removable !== false,
        maxNodes: opts.maxNodes || 8,
        minNodes: opts.minNodes || 0,
        storageKey: opts.storageKey || null,
        onChange: opts.onChange || null,
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
          if (Array.isArray(saved)) state.nodes = saved;
        }
      } catch (e) { /* ignore */ }
    }

    // Ensure at least minNodes
    while (state.nodes.length < state.opts.minNodes) {
      state.nodes.push({ text: '', emoji: '' });
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

    let svg = '<svg class="leea-web-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" style="width:100%;max-width:900px;height:auto;display:block;margin:0 auto">';

    // Connector lines first (so they sit behind ovals)
    const count = Math.max(nodes.length, 1);
    for (let i = 0; i < nodes.length; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '" stroke="#93C5FD" stroke-width="3" stroke-linecap="round" opacity="0.6"/>';
    }

    // Center oval
    svg += '<g><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + centerRx + '" ry="' + centerRy + '" fill="' + opts.accent + '" stroke="' + opts.accentDark + '" stroke-width="4"/>';
    svg += '<text x="' + cx + '" y="' + (cy - 8) + '" text-anchor="middle" fill="#fff" font-size="38" font-weight="900" font-family="Outfit,sans-serif">' + esc(center.emoji || '') + '</text>';
    svg += '<text x="' + cx + '" y="' + (cy + 30) + '" text-anchor="middle" fill="#fff" font-size="24" font-weight="800" font-family="Outfit,sans-serif">' + esc(center.text || '') + '</text>';
    svg += '</g>';

    // Outer ovals
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      const filled = n && n.text && n.text.trim().length > 0;
      const fill = filled ? opts.filledFill : '#fff';
      const stroke = filled ? opts.filledStroke : '#93C5FD';
      const ink = filled ? opts.filledInk : '#6B7280';

      svg += '<g style="cursor:' + (opts.editable ? 'pointer' : 'default') + '"';
      if (opts.editable) svg += ' onclick="window._leeaWebClick(\'' + id + '\',' + i + ')"';
      svg += '>';
      svg += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + nodeRx + '" ry="' + nodeRy + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="3"/>';

      const display = filled
        ? (n.emoji ? n.emoji + ' ' : '') + n.text
        : 'Tap to add';
      const fontSize = filled ? 18 : 16;
      const fontWeight = filled ? 800 : 500;
      const fontStyle = filled ? 'normal' : 'italic';
      // Truncate text if too long
      const safe = display.length > 22 ? display.slice(0, 21) + '…' : display;
      svg += '<text x="' + x + '" y="' + (y + 6) + '" text-anchor="middle" fill="' + ink + '" font-size="' + fontSize + '" font-weight="' + fontWeight + '" font-style="' + fontStyle + '" font-family="Outfit,sans-serif">' + esc(safe) + '</text>';
      svg += '</g>';

      // × remove button on filled ovals
      if (opts.removable && filled) {
        const bx = x + nodeRx - 14;
        const by = y - nodeRy + 14;
        svg += '<g style="cursor:pointer" onclick="event.stopPropagation();window._leeaWebRemove(\'' + id + '\',' + i + ')">';
        svg += '<circle cx="' + bx + '" cy="' + by + '" r="14" fill="#DC2626" stroke="#fff" stroke-width="2"/>';
        svg += '<text x="' + bx + '" y="' + (by + 5) + '" text-anchor="middle" fill="#fff" font-size="20" font-weight="900" font-family="Outfit,sans-serif">×</text>';
        svg += '</g>';
      }
    }

    svg += '</svg>';

    // Controls below SVG
    let controls = '<div class="leea-web-controls" style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;align-items:center">';
    if (opts.addable && nodes.length < opts.maxNodes) {
      controls += '<button type="button" onclick="window._leeaWebAdd(\'' + id + '\')" style="background:' + opts.accent + ';color:#fff;border:0;padding:12px 24px;border-radius:12px;font-weight:800;font-size:18px;cursor:pointer;font-family:Outfit,sans-serif;letter-spacing:.04em">＋ Add oval</button>';
    }
    if (opts.editable) {
      controls += '<button type="button" onclick="window._leeaWebReset(\'' + id + '\')" style="background:#fff;color:#6B7280;border:2px solid #E5E3DC;padding:10px 22px;border-radius:12px;font-weight:700;font-size:16px;cursor:pointer;font-family:Outfit,sans-serif">↺ Reset</button>';
    }
    controls += '</div>';

    return '<div class="leea-web-wrap" data-web-id="' + id + '">' + svg + controls + '</div>';
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
      try { localStorage.setItem(state.opts.storageKey, JSON.stringify(state.nodes)); } catch (e) {}
    }
    if (state.opts.onChange) {
      try { state.opts.onChange(state.nodes.slice()); } catch (e) {}
    }
  }

  function rerender(id) {
    const wrap = document.querySelector('[data-web-id="' + id + '"]');
    if (!wrap) return;
    const parent = wrap.parentElement;
    if (parent) parent.innerHTML = renderWeb(id);
  }

  window._leeaWebClick = function (id, idx) {
    const state = window.LEEA_WEB_STATE[id];
    if (!state || !state.opts.editable) return;
    const cur = state.nodes[idx] || { text: '', emoji: '' };
    const proposed = window.prompt('What goes in this oval?', cur.text || '');
    if (proposed === null) return;
    const trimmed = proposed.trim();
    if (!trimmed) return;
    state.nodes[idx] = { text: trimmed, emoji: cur.emoji || '' };
    save(id);
    rerender(id);
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
    state.nodes.push({ text: '', emoji: '' });
    save(id);
    rerender(id);
  };

  window._leeaWebReset = function (id) {
    const state = window.LEEA_WEB_STATE[id];
    if (!state) return;
    if (!window.confirm('Reset this word web? All your words will be cleared.')) return;
    state.nodes = [];
    save(id);
    rerender(id);
  };

  window.buildWordWeb = buildWordWeb;
})();
