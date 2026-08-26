/* LEEA learner-app runtime.
 *
 * Every generated Leo app is the same shell plus a data blob: a tab strip, one
 * activity per tab, and the four save/restore rules from AGENTS.md. This file
 * holds the activity library so the rules live in one place instead of being
 * re-implemented per app, where they drifted before (see the writing-app bug
 * where 10 of 13 modules shipped with no footer buttons).
 *
 * Boot with:  LEEA.boot(APP)
 * APP = { prefix, homeworkId, keys: [...], scoreKey, scoreTab, tabs: [...] }
 */
(function () {
  "use strict";

  /* ── storage ─────────────────────────────────────────────────────── */
  var APP = null;

  function sKey(name) { return APP.prefix + name; }
  function lSave(name, value) { try { localStorage.setItem(sKey(name), JSON.stringify(value)); } catch (e) { /* private mode */ } }
  function lLoad(name) { try { var raw = localStorage.getItem(sKey(name)); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
  function lDel(name) { try { localStorage.removeItem(sKey(name)); } catch (e) { /* private mode */ } }
  function doneKey(index) { return APP.keys[index]; }
  function stateKey(index) { return "tab-" + index + "-state"; }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var swap = copy[i]; copy[i] = copy[j]; copy[j] = swap;
    }
    return copy;
  }
  function bold(sentence, word) {
    if (!word) return sentence;
    var stem = String(word).replace(/^(a|an|the)\s+/i, "");
    var pattern = stem.split(/[\s_]+/).map(function (part) {
      return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("[-\\s]");
    try {
      return sentence.replace(new RegExp("(" + pattern + "\\w*)", "i"), "<b>$1</b>");
    } catch (e) { return sentence; }
  }

  /* ── progress + footer (save/restore rules 1, 4 and 5) ───────────── */
  function refreshProgress() {
    var done = 0;
    for (var i = 0; i < APP.tabs.length; i++) {
      if (lLoad(doneKey(i))) {
        done++;
        var button = document.getElementById("tb" + i);
        if (button) button.classList.add("done");
      }
    }
    var pill = document.getElementById("prog-pill");
    if (pill) pill.textContent = done + " / " + APP.tabs.length + " done";
    setHomeworkDone(done >= APP.tabs.length);
  }

  /* getLearnerAppProgress reads two completion flags: `<storagePrefix>done` and
     the unprefixed `leea-<homeworkId>-done`. Several Level 4 apps write the
     homework flag through lSave, which silently prefixes it — so the key they
     produce ("leea-4-9-vocab-2-leo-4-9-vocab-2-done") is not the key the reader
     looks for, and that flag never fires. Write both, at the keys they are
     actually read from, and clear them again if a Redo drops the app back below
     complete. */
  function setHomeworkDone(complete) {
    const flag = "leea-" + APP.homeworkId + "-done";
    try {
      if (complete) {
        lSave("done", true);
        localStorage.setItem(flag, JSON.stringify({ complete: true, completedAt: new Date().toISOString() }));
      } else {
        lDel("done");
        localStorage.removeItem(flag);
      }
    } catch (e) { /* private mode */ }
  }

  /* Rule 1: the activity calls this the moment its own criteria are met, so the
     teacher dashboard's completedModules count never waits for a tap. */
  function markDone(index, silent) {
    if (!lLoad(doneKey(index))) lSave(doneKey(index), { done: true, completedAt: new Date().toISOString() });
    var complete = document.getElementById("complete-" + index);
    if (complete) {
      complete.disabled = false;
      complete.classList.add("confirmed");
      complete.textContent = "✓ " + APP.tabs[index].name + " done";
    }
    var banner = document.getElementById("banner-" + index);
    if (banner && !silent) banner.classList.add("show");
    refreshProgress();
  }

  /* The Mark Complete button stays disabled until the activity says it can be
     enabled — the button confirms work that is already finished, it never
     fakes it. Activities with nothing to score (reference lists) enable it as
     soon as the tab is opened. */
  function allowComplete(index) {
    var complete = document.getElementById("complete-" + index);
    if (complete && !lLoad(doneKey(index))) {
      complete.disabled = false;
      complete.textContent = "Mark " + APP.tabs[index].name + " complete ✓";
    }
  }

  function manualComplete(index) { markDone(index); }

  /* Rule 4: two-tap arm, then clear this tab's keys and rebuild it from zero. */
  function redo(index) {
    var button = document.getElementById("redo-" + index);
    if (!button.classList.contains("armed")) {
      button.classList.add("armed");
      button.textContent = "Tap again ↺";
      setTimeout(function () {
        button.classList.remove("armed");
        button.textContent = "↺ Redo";
      }, 3000);
      return;
    }
    button.classList.remove("armed");
    button.textContent = "↺ Redo";
    lDel(doneKey(index));
    lDel(stateKey(index));
    if (index === APP.scoreTab && APP.scoreKey) lDel(APP.scoreKey);
    var prefixed = APP.prefix + "tab-" + index + "-";
    Object.keys(localStorage).forEach(function (key) {
      if (key.indexOf(prefixed) === 0) localStorage.removeItem(key);
    });
    var complete = document.getElementById("complete-" + index);
    complete.classList.remove("confirmed");
    complete.disabled = true;
    complete.textContent = "Mark " + APP.tabs[index].name + " complete ✓";
    var banner = document.getElementById("banner-" + index);
    if (banner) banner.classList.remove("show");
    var tabButton = document.getElementById("tb" + index);
    if (tabButton) tabButton.classList.remove("done");
    build(index);
    refreshProgress();
  }

  /* Rule 2: only the quiz tab writes the score key, and it writes the whole
     result object so rule 3 can rebuild the result screen instead of the quiz. */
  function saveScore(score, total, extra) {
    if (!APP.scoreKey) return;
    var record = { score: score, total: total, percent: Math.round((score / total) * 100), done: true, savedAt: new Date().toISOString() };
    for (var key in extra) if (Object.prototype.hasOwnProperty.call(extra, key)) record[key] = extra[key];
    lSave(APP.scoreKey, record);
  }

  /* ── tab plumbing ────────────────────────────────────────────────── */
  var built = {};

  function build(index) {
    var host = document.getElementById("body-" + index);
    host.innerHTML = "";
    var tab = APP.tabs[index];
    var render = ACTIVITIES[tab.type];
    if (!render) {
      host.appendChild(el("div", "dad-hint", "Unknown activity type: " + tab.type));
      allowComplete(index);
      built[index] = true;
      return;
    }
    var header = el("div");
    header.appendChild(el("div", "section-title", tab.icon + "  " + tab.name));
    if (tab.sub) header.appendChild(el("div", "section-sub", tab.sub));
    host.appendChild(header);
    if (tab.hint) host.appendChild(el("div", "dad-hint", tab.hint));
    render(host, tab.data || {}, index);
    var banner = el("div", "done-banner", tab.doneText || "Nice work! Mark it below.");
    banner.id = "banner-" + index;
    host.appendChild(banner);
    built[index] = true;
  }

  function showTab(index) {
    var buttons = document.querySelectorAll(".tab-btn");
    var panes = document.querySelectorAll(".tab-content");
    for (var i = 0; i < buttons.length; i++) buttons[i].classList.toggle("active", i === index);
    for (var j = 0; j < panes.length; j++) panes[j].classList.toggle("active", j === index);
    lSave("last-tab", index);
    if (!built[index]) build(index);
    var complete = document.getElementById("complete-" + index);
    if (complete) {
      if (lLoad(doneKey(index))) {
        complete.disabled = false;
        complete.classList.add("confirmed");
        complete.textContent = "✓ " + APP.tabs[index].name + " done";
      }
    }
  }

  /* ── shared answer feedback, with rule-6 restore ─────────────────── */
  function answerGroup(host, item, index, key, onResolved) {
    var card = el("div", "qcard");
    var question = el("div", "qtext");
    question.innerHTML = item.q;
    card.appendChild(question);
    var options = el("div", "opt-group");
    var saved = lLoad(stateKey(index)) || {};
    var already = saved[key];
    item.opts.forEach(function (text, optionIndex) {
      var button = el("button", "opt", text);
      button.onclick = function () {
        var store = lLoad(stateKey(index)) || {};
        if (store[key] != null) return;
        store[key] = optionIndex;
        lSave(stateKey(index), store);
        paint(button, optionIndex);
        if (optionIndex === item.correct && onResolved) onResolved(true);
        else if (onResolved) onResolved(false);
      };
      options.appendChild(button);
    });
    card.appendChild(options);
    if (item.jp) {
      var jp = el("div", "jp-note", "🇯🇵 " + item.jp);
      jp.style.display = "none";
      card.appendChild(jp);
    }
    host.appendChild(card);

    function paint(clicked, chosen) {
      var all = options.querySelectorAll(".opt");
      for (var i = 0; i < all.length; i++) {
        all[i].disabled = true;
        if (i === item.correct) all[i].classList.add("good");
      }
      if (chosen !== item.correct && clicked) clicked.classList.add("bad");
      var note = card.querySelector(".jp-note");
      if (note) note.style.display = "block";
    }

    /* Rule 6: an answered question has to come back looking answered, or the
       guard above silently swallows the next tap. */
    if (already != null) paint(options.querySelectorAll(".opt")[already], already);
    return card;
  }

  /* Counts how many of a tab's questions are already answered, so a rebuilt tab
     can decide whether it is complete without replaying the taps. */
  function answeredCount(index, keys) {
    var saved = lLoad(stateKey(index)) || {};
    return keys.filter(function (key) { return saved[key] != null; }).length;
  }

  function progressLine(host, label) {
    var row = el("div", "mstatus");
    var count = el("div", "mcount", "0");
    var hint = el("div", "mhint", label);
    row.appendChild(count);
    row.appendChild(hint);
    host.appendChild(row);
    return count;
  }

  /* ── activities ──────────────────────────────────────────────────── */
  var ACTIVITIES = {};

  /* Reference list — goals, key expressions, a strategy box. Opening it counts,
     but the learner still has to confirm with the footer button. */
  ACTIVITIES.list = function (host, data, index) {
    (data.items || []).forEach(function (item) {
      var card = el("div", "info-card");
      if (item.emoji) card.appendChild(el("div", "info-emoji", item.emoji));
      var body = el("div", "info-body");
      if (item.title) body.appendChild(el("div", "info-title", item.title));
      body.appendChild(el("div", "info-text", item.t || item.text));
      if (item.jp) body.appendChild(el("div", "info-jp", "🇯🇵 " + item.jp));
      card.appendChild(body);
      host.appendChild(card);
    });
    allowComplete(index);
  };

  /* Flashcards — Practice + Quiz dual mode. The tab only completes when BOTH
     modes are finished (the PR #77 lock). */
  ACTIVITIES.flashcards = function (host, data, index) {
    var words = data.words || [];
    if (!words.length) { allowComplete(index); return; }
    var state = lLoad(stateKey(index)) || { seen: [], solved: [], mode: "practice" };
    if (!state.seen) state.seen = [];
    if (!state.solved) state.solved = [];

    var modes = el("div", "fc-modeswitch");
    var practiceButton = el("button", "fc-modebtn", "📖 Practice");
    var quizButton = el("button", "fc-modebtn", "🧠 Quiz");
    modes.appendChild(practiceButton);
    modes.appendChild(quizButton);
    host.appendChild(modes);

    var status = el("div", "mstatus");
    var seenPill = el("div", "mcount", "");
    var solvedPill = el("div", "mcount alt", "");
    status.appendChild(seenPill);
    status.appendChild(solvedPill);
    host.appendChild(status);

    var practicePane = el("div", "fc-pane");
    var quizPane = el("div", "fc-pane");
    host.appendChild(practicePane);
    host.appendChild(quizPane);

    var cardIndex = 0;
    var quizIndex = 0;

    var wrap = el("div", "flashcard-wrap");
    var card = el("div", "flashcard");
    var front = el("div", "fc-face fc-front");
    var back = el("div", "fc-face fc-back");
    card.appendChild(front);
    card.appendChild(back);
    wrap.appendChild(card);
    wrap.onclick = function () { card.classList.toggle("flipped"); };
    practicePane.appendChild(wrap);

    var nav = el("div", "fc-nav");
    var prev = el("button", null, "◀ Back");
    var dots = el("div", "fc-dots");
    var next = el("button", null, "Next ▶");
    nav.appendChild(prev); nav.appendChild(dots); nav.appendChild(next);
    practicePane.appendChild(nav);

    prev.onclick = function () { cardIndex = (cardIndex - 1 + words.length) % words.length; renderCard(); };
    next.onclick = function () { cardIndex = (cardIndex + 1) % words.length; renderCard(); };

    function renderCard() {
      var word = words[cardIndex];
      card.classList.remove("flipped");
      front.innerHTML = "";
      front.appendChild(el("div", "fc-emoji", word.emoji || "📘"));
      front.appendChild(el("div", "fc-word", word.word));
      if (word.ipa) front.appendChild(el("div", "fc-ipa", "/" + word.ipa + "/"));
      front.appendChild(el("div", "fc-tap", "TAP TO FLIP"));
      back.innerHTML = "";
      back.appendChild(el("div", "fc-def", word.def));
      var jp = el("div", "fc-jp", word.jp || "");
      var jpButton = el("button", "fc-jp-btn", "🇯🇵 Japanese");
      jpButton.onclick = function (event) { event.stopPropagation(); jp.classList.toggle("revealed"); };
      back.appendChild(jpButton);
      back.appendChild(jp);
      if (word.sample) {
        var sample = el("div", "fc-sample");
        sample.innerHTML = bold(word.sample, word.word);
        back.appendChild(sample);
      }
      dots.innerHTML = "";
      words.forEach(function (_, i) {
        var dot = el("div", "fc-dot" + (i === cardIndex ? " on" : ""));
        dots.appendChild(dot);
      });
      if (state.seen.indexOf(cardIndex) < 0) state.seen.push(cardIndex);
      persist();
    }

    var quizCard = el("div", "qcard");
    quizPane.appendChild(quizCard);

    function renderQuiz() {
      quizCard.innerHTML = "";
      var remaining = words.map(function (_, i) { return i; }).filter(function (i) { return state.solved.indexOf(i) < 0; });
      if (!remaining.length) {
        quizCard.appendChild(el("div", "qtext", "🎉 Every word typed correctly!"));
        return;
      }
      quizIndex = remaining[0];
      var word = words[quizIndex];
      quizCard.appendChild(el("div", "fc-emoji", word.emoji || "📘"));
      quizCard.appendChild(el("div", "qtext", word.def));
      var row = el("div", "svy-row");
      var input = el("input");
      input.placeholder = "Type the word";
      var check = el("button", "tr-btn", "✓ Check");
      var clue = el("button", "tr-btn", "Clue");
      row.appendChild(input); row.appendChild(check); row.appendChild(clue);
      quizCard.appendChild(row);
      var feedback = el("div", "mhint", "");
      quizCard.appendChild(feedback);
      clue.onclick = function () { feedback.textContent = "Starts with “" + word.word.replace(/^(a|an|the)\s+/i, "").charAt(0) + "” · " + word.word.replace(/[^\s]/g, "•"); };
      check.onclick = function () {
        var typed = input.value.trim().toLowerCase().replace(/^(a|an|the)\s+/, "");
        var target = word.word.trim().toLowerCase().replace(/^(a|an|the)\s+/, "");
        if (typed === target) {
          state.solved.push(quizIndex);
          persist();
          renderQuiz();
        } else {
          row.classList.add("err");
          feedback.textContent = "Not yet — try again.";
          setTimeout(function () { row.classList.remove("err"); }, 400);
        }
      };
      input.onkeydown = function (event) { if (event.key === "Enter") check.onclick(); };
    }

    function persist() {
      state.mode = practicePane.classList.contains("active") ? "practice" : "quiz";
      lSave(stateKey(index), state);
      seenPill.textContent = "📖 " + state.seen.length + " / " + words.length;
      solvedPill.textContent = "🧠 " + state.solved.length + " / " + words.length;
      if (state.seen.length >= words.length && state.solved.length >= words.length) markDone(index);
    }

    function setMode(mode) {
      practicePane.classList.toggle("active", mode === "practice");
      quizPane.classList.toggle("active", mode === "quiz");
      practiceButton.classList.toggle("active", mode === "practice");
      quizButton.classList.toggle("active", mode === "quiz");
      if (mode === "quiz") renderQuiz();
      persist();
    }
    practiceButton.onclick = function () { setMode("practice"); };
    quizButton.onclick = function () { setMode("quiz"); };

    renderCard();
    setMode(state.mode === "quiz" ? "quiz" : "practice");
  };

  /* Unscored multiple choice — every item has to be answered. */
  ACTIVITIES.mcq = function (host, data, index) {
    var items = data.items || [];
    var keys = items.map(function (_, i) { return "q" + i; });
    var count = progressLine(host, data.label || "answered");
    items.forEach(function (item, i) {
      answerGroup(host, item, index, keys[i], function () { update(); });
    });
    function update() {
      var answered = answeredCount(index, keys);
      count.textContent = answered + " / " + items.length;
      if (answered >= items.length) markDone(index);
    }
    update();
  };

  /* True / false rows over the reading or the grammar box. */
  ACTIVITIES.truefalse = function (host, data, index) {
    var items = (data.items || []).map(function (item) {
      return { q: item.t, opts: ["True", "False"], correct: item.answer ? 0 : 1, jp: item.jp };
    });
    ACTIVITIES.mcq(host, { items: items, label: data.label || "answered" }, index);
  };

  /* Scored quiz — the only activity that writes the score key (rule 2), and it
     restores its own result screen instead of restarting (rule 3). */
  ACTIVITIES.quiz = function (host, data, index) {
    var items = data.items || [];
    var pass = data.pass || Math.ceil(items.length * 0.8);
    var saved = APP.scoreKey ? lLoad(APP.scoreKey) : null;
    var resultBox = el("div");
    var activeBox = el("div");
    host.appendChild(activeBox);
    host.appendChild(resultBox);

    if (saved && saved.done) { renderResult(saved); return; }

    var current = 0;
    var score = 0;
    var wrong = [];
    var bar = el("div", "quiz-progress");
    activeBox.appendChild(bar);
    var card = el("div", "qcard");
    activeBox.appendChild(card);

    function renderQuestion() {
      bar.innerHTML = "";
      items.forEach(function (_, i) {
        bar.appendChild(el("div", "qdot" + (i < current ? " on" : "") + (i === current ? " now" : "")));
      });
      card.innerHTML = "";
      var item = items[current];
      var question = el("div", "qtext");
      question.innerHTML = (current + 1) + ". " + item.q;
      card.appendChild(question);
      var options = el("div", "opt-group");
      item.opts.forEach(function (text, optionIndex) {
        var button = el("button", "opt", text);
        button.onclick = function () {
          var all = options.querySelectorAll(".opt");
          for (var i = 0; i < all.length; i++) { all[i].disabled = true; if (i === item.correct) all[i].classList.add("good"); }
          if (optionIndex === item.correct) score++;
          else { button.classList.add("bad"); wrong.push(current + 1); }
          if (item.jp) card.appendChild(el("div", "jp-note", "🇯🇵 " + item.jp));
          setTimeout(function () {
            current++;
            if (current >= items.length) finish();
            else renderQuestion();
          }, 900);
        };
        options.appendChild(button);
      });
      card.appendChild(options);
    }

    function finish() {
      var record = { score: score, total: items.length, percent: Math.round((score / items.length) * 100), done: true, pass: score >= pass, wrongQuestions: wrong };
      saveScore(score, items.length, { pass: score >= pass, wrongQuestions: wrong });
      activeBox.style.display = "none";
      renderResult(record);
      markDone(index);
    }

    function renderResult(record) {
      activeBox.style.display = "none";
      resultBox.innerHTML = "";
      var passed = record.pass != null ? record.pass : record.score >= pass;
      var box = el("div", "result-card" + (passed ? " pass" : " fail"));
      box.appendChild(el("div", "result-trophy", passed ? "🏆" : "💪"));
      box.appendChild(el("div", "result-score", record.score + " / " + record.total));
      box.appendChild(el("div", "result-sub", passed ? "You passed! " + record.percent + "%" : "Almost — you need " + pass + " to pass. Tap ↺ Redo to try again."));
      if (record.wrongQuestions && record.wrongQuestions.length) {
        box.appendChild(el("div", "result-sub", "Look again at question(s): " + record.wrongQuestions.join(", ")));
      }
      resultBox.appendChild(box);
      markDone(index, true);
    }

    renderQuestion();
  };

  /* Drag-to-sort, through the shared chart picker so the LP cue stays the
     single source of truth for which builder runs. */
  ACTIVITIES.sort = function (host, data, index) {
    var mount = el("div", "chart-mount");
    host.appendChild(mount);
    var state = lLoad(stateKey(index)) || {};
    if (typeof window.pickChart !== "function") {
      mount.appendChild(el("div", "dad-hint", "⚠️ Sorter component not loaded — check /components/charts.js"));
      allowComplete(index);
      return;
    }
    var sorterId = "sort-" + APP.homeworkId.replace(/[^a-z0-9]/gi, "") + "-" + index;
    mount.innerHTML = window.pickChart("classification sort", {
      id: sorterId,
      tiles: (data.tiles || []).map(function (tile) { return { text: tile.text, answer: tile.zone }; }),
      zones: (data.zones || []).map(function (zone, i) {
        return { key: zone.id, label: zone.label, color: zone.color || SORT_COLORS[i % SORT_COLORS.length] };
      }),
      onComplete: function () {
        lSave(stateKey(index), { complete: true });
        markDone(index);
      }
    });
    if (state.complete) markDone(index, true);
    allowComplete(index);
  };

  var SORT_COLORS = ["#16A34A", "#2563EB", "#c0492f", "#CA8A04"];

  /* Match each word to the sentence the audio script actually says, then show a
     recap table in TR order — never in the order Leo happened to match them. */
  ACTIVITIES.match = function (host, data, index) {
    var pairs = data.pairs || [];
    var state = lLoad(stateKey(index)) || { matched: [] };
    if (!state.matched) state.matched = [];

    var count = progressLine(host, "pairs matched");
    var grid = el("div", "mgrid");
    var left = el("div", "mcol");
    var right = el("div", "mcol");
    grid.appendChild(left);
    grid.appendChild(right);
    host.appendChild(grid);

    var recap = el("div", "mrecap");
    recap.appendChild(el("div", "mrecap-title", "📼 Audio-script order — Word · Emoji · Sentence"));
    var table = document.createElement("table");
    recap.appendChild(table);
    host.appendChild(recap);

    var rows = {};
    pairs.forEach(function (pair, i) {
      var row = document.createElement("tr");
      row.style.display = "none";
      var wordCell = document.createElement("td");
      wordCell.className = "mr-word";
      wordCell.textContent = pair.word;
      var emojiCell = document.createElement("td");
      emojiCell.className = "mr-emoji";
      emojiCell.textContent = pair.emoji || "";
      var sentenceCell = document.createElement("td");
      sentenceCell.className = "mr-mean";
      sentenceCell.textContent = pair.sent;
      row.appendChild(wordCell); row.appendChild(emojiCell); row.appendChild(sentenceCell);
      table.appendChild(row);
      rows[i] = row;
    });

    var selectedLeft = null;
    var leftButtons = {};
    var rightButtons = {};

    pairs.forEach(function (pair, i) {
      var button = el("button", "mitem", (pair.emoji ? pair.emoji + "  " : "") + pair.word);
      button.onclick = function () {
        if (button.classList.contains("lock")) return;
        if (selectedLeft) selectedLeft.classList.remove("sel");
        selectedLeft = button;
        button.classList.add("sel");
      };
      leftButtons[i] = button;
      left.appendChild(button);
    });

    shuffle(pairs.map(function (_, i) { return i; })).forEach(function (i) {
      var pair = pairs[i];
      var button = el("button", "mitem m-right", pair.sent);
      button.onclick = function () {
        if (!selectedLeft || button.classList.contains("lock")) return;
        var chosen = Number(selectedLeft.dataset.idx);
        if (chosen === i) {
          selectedLeft.classList.remove("sel");
          selectedLeft.classList.add("lock");
          button.classList.add("lock");
          if (state.matched.indexOf(i) < 0) state.matched.push(i);
          lSave(stateKey(index), state);
          reveal(i);
          selectedLeft = null;
          update();
        } else {
          button.classList.add("err");
          setTimeout(function () { button.classList.remove("err"); }, 400);
        }
      };
      rightButtons[i] = button;
      right.appendChild(button);
    });
    pairs.forEach(function (_, i) { leftButtons[i].dataset.idx = String(i); });

    function reveal(i) {
      rows[i].style.display = "";
      recap.classList.add("show");
    }
    function update() {
      count.textContent = state.matched.length + " / " + pairs.length;
      if (state.matched.length >= pairs.length) markDone(index);
    }
    state.matched.forEach(function (i) {
      leftButtons[i].classList.add("lock");
      rightButtons[i].classList.add("lock");
      reveal(i);
    });
    update();
  };

  /* Scrambled letters — Leo types the word back. */
  ACTIVITIES.unscramble = function (host, data, index) {
    var words = data.words || [];
    var state = lLoad(stateKey(index)) || { solved: [] };
    if (!state.solved) state.solved = [];
    var count = progressLine(host, "words unscrambled");

    words.forEach(function (entry, i) {
      var card = el("div", "qcard");
      var letters = entry.word.replace(/^(a|an|the)\s+/i, "");
      var scrambled = shuffle(letters.split("")).join("").toUpperCase();
      card.appendChild(el("div", "qtext", (entry.emoji || "🔤") + "  " + scrambled));
      card.appendChild(el("div", "mhint", entry.hint || ""));
      var row = el("div", "svy-row");
      var input = el("input");
      input.placeholder = "Type the word";
      var check = el("button", "tr-btn", "✓ Check");
      row.appendChild(input);
      row.appendChild(check);
      card.appendChild(row);
      host.appendChild(card);

      function solve() {
        row.classList.add("filled");
        input.value = letters;
        input.disabled = true;
        check.disabled = true;
        check.textContent = "✓";
      }
      check.onclick = function () {
        if (input.value.trim().toLowerCase() === letters.toLowerCase()) {
          if (state.solved.indexOf(i) < 0) state.solved.push(i);
          lSave(stateKey(index), state);
          solve();
          update();
        } else {
          row.classList.add("err");
          setTimeout(function () { row.classList.remove("err"); }, 400);
        }
      };
      input.onkeydown = function (event) { if (event.key === "Enter") check.onclick(); };
      if (state.solved.indexOf(i) >= 0) solve();
    });

    function update() {
      count.textContent = state.solved.length + " / " + words.length;
      if (state.solved.length >= words.length) markDone(index);
    }
    update();
  };

  /* Gap-fill reading: tap a blank, then tap the word from the bank. */
  ACTIVITIES.cloze = function (host, data, index) {
    var answers = data.answers || [];
    var state = lLoad(stateKey(index)) || { filled: {} };
    if (!state.filled) state.filled = {};
    var count = progressLine(host, "blanks filled");

    var box = el("div", "read-box");
    var parts = String(data.text || "").split(/\{\{(\d+)\}\}/);
    var blanks = {};
    parts.forEach(function (part, i) {
      if (i % 2 === 0) {
        var span = document.createElement("span");
        span.innerHTML = part;
        box.appendChild(span);
      } else {
        var slot = Number(part);
        var blank = el("span", "read-blank", "________");
        blank.onclick = function () {
          document.querySelectorAll(".read-blank").forEach(function (node) { node.classList.remove("active"); });
          blank.classList.add("active");
        };
        blanks[slot] = blank;
        box.appendChild(blank);
      }
    });
    host.appendChild(box);

    var bank = el("div", "chip-bank");
    shuffle(answers.slice()).forEach(function (word) {
      var chip = el("button", "chip", word);
      chip.onclick = function () {
        var active = box.querySelector(".read-blank.active");
        if (!active) return;
        var slot = Number(Object.keys(blanks).filter(function (key) { return blanks[key] === active; })[0]);
        if (answers[slot] && answers[slot].toLowerCase() === word.toLowerCase()) {
          active.textContent = word;
          active.classList.add("filled");
          active.classList.remove("active");
          chip.classList.add("used");
          state.filled[slot] = word;
          lSave(stateKey(index), state);
          update();
        } else {
          active.classList.add("wrong");
          setTimeout(function () { active.classList.remove("wrong"); }, 400);
        }
      };
      bank.appendChild(chip);
    });
    host.appendChild(bank);

    function update() {
      var filled = Object.keys(state.filled).length;
      count.textContent = filled + " / " + answers.length;
      if (filled >= answers.length) markDone(index);
    }
    Object.keys(state.filled).forEach(function (slot) {
      if (!blanks[slot]) return;
      blanks[slot].textContent = state.filled[slot];
      blanks[slot].classList.add("filled");
      var chips = bank.querySelectorAll(".chip");
      for (var i = 0; i < chips.length; i++) {
        if (chips[i].textContent === state.filled[slot] && !chips[i].classList.contains("used")) { chips[i].classList.add("used"); break; }
      }
    });
    update();
  };

  /* Chip-order sentence building. */
  ACTIVITIES.build = function (host, data, index) {
    var items = data.items || [];
    var state = lLoad(stateKey(index)) || { built: [] };
    if (!state.built) state.built = [];
    var count = progressLine(host, "sentences built");

    items.forEach(function (item, i) {
      var card = el("div", "qcard");
      if (item.jp) card.appendChild(el("div", "mhint", "🇯🇵 " + item.jp));
      var line = el("div", "build-line");
      card.appendChild(line);
      var bank = el("div", "chip-bank");
      card.appendChild(bank);
      host.appendChild(card);
      var position = 0;

      function lock() {
        line.innerHTML = "";
        item.words.forEach(function (word) {
          var part = el("span", "bpart", word);
          line.appendChild(part);
        });
        line.classList.add("done");
        bank.innerHTML = "";
      }

      shuffle(item.words.slice()).forEach(function (word) {
        var chip = el("button", "chip", word);
        chip.onclick = function () {
          if (word === item.words[position]) {
            var part = el("span", "bpart", word);
            line.appendChild(part);
            chip.classList.add("used");
            position++;
            if (position >= item.words.length) {
              line.classList.add("done");
              if (state.built.indexOf(i) < 0) state.built.push(i);
              lSave(stateKey(index), state);
              update();
            }
          } else {
            chip.classList.add("err");
            setTimeout(function () { chip.classList.remove("err"); }, 400);
          }
        };
        bank.appendChild(chip);
      });
      if (state.built.indexOf(i) >= 0) lock();
    });

    function update() {
      count.textContent = state.built.length + " / " + items.length;
      if (state.built.length >= items.length) markDone(index);
    }
    update();
  };

  /* Open sentence stems Leo finishes about himself. */
  ACTIVITIES.survey = function (host, data, index) {
    var stems = data.stems || [];
    var state = lLoad(stateKey(index)) || { text: {} };
    if (!state.text) state.text = {};
    var count = progressLine(host, "answers written");

    stems.forEach(function (stem, i) {
      var card = el("div", "qcard");
      var prompt = el("div", "qtext");
      prompt.innerHTML = stem.t;
      card.appendChild(prompt);
      if (stem.jp) card.appendChild(el("div", "mhint", "🇯🇵 " + stem.jp));
      var row = el("div", "svy-row");
      var input = el("input");
      input.placeholder = stem.placeholder || "Write your answer";
      input.value = state.text[i] || "";
      if (input.value.trim().length > 2) row.classList.add("filled");
      input.oninput = function () {
        state.text[i] = input.value;
        lSave(stateKey(index), state);
        row.classList.toggle("filled", input.value.trim().length > 2);
        update();
      };
      row.appendChild(input);
      card.appendChild(row);
      host.appendChild(card);
    });

    function update() {
      var written = stems.filter(function (_, i) { return (state.text[i] || "").trim().length > 2; }).length;
      count.textContent = written + " / " + stems.length;
      if (written >= stems.length) markDone(index);
    }
    update();
  };

  /* Sunshine organizer — one ray per target word, and Leo writes his own
     sentence into each ray. The rays fill in as he goes, which is the whole
     point of the Apply phase: his words, not the book's. */
  ACTIVITIES.sunshine = function (host, data, index) {
    var words = data.words || [];
    var state = lLoad(stateKey(index)) || { text: {} };
    if (!state.text) state.text = {};
    var count = progressLine(host, "rays written");
    var sun = el("div", "chart-mount");
    host.appendChild(sun);
    var editors = el("div", "sun-editors");
    host.appendChild(editors);
    var sunId = "sun-" + APP.homeworkId.replace(/[^a-z0-9]/gi, "") + "-" + index;

    function draw() {
      if (typeof window.pickChart !== "function") {
        sun.innerHTML = "";
        sun.appendChild(el("div", "dad-hint", "⚠️ Sunshine organizer not loaded — check /components/sunshine.js"));
        return;
      }
      sun.innerHTML = window.pickChart("sunshine organizer", {
        id: sunId,
        words: words,
        saved: state.text,
        centerLabel: data.center || "My Sentences",
        centerHint: data.hint || "Tap a ray",
        onSelect: function (i) {
          var field = document.getElementById(sunId + "-in-" + i);
          if (field) { field.focus(); field.scrollIntoView({ block: "center" }); }
        }
      });
    }

    words.forEach(function (word, i) {
      var row = el("div", "svy-row");
      row.appendChild(el("div", "sun-word", (word.emoji || "") + " " + word.word));
      var input = el("input");
      input.id = sunId + "-in-" + i;
      input.placeholder = "Write a sentence with “" + word.word + "”";
      input.value = state.text[i] || "";
      if (input.value.trim().length > 5) row.classList.add("filled");
      input.oninput = function () {
        state.text[i] = input.value;
        lSave(stateKey(index), state);
        row.classList.toggle("filled", input.value.trim().length > 5);
        update();
      };
      input.onblur = draw;
      row.appendChild(input);
      editors.appendChild(row);
    });

    function update() {
      var written = words.filter(function (_, i) { return (state.text[i] || "").trim().length > 5; }).length;
      count.textContent = written + " / " + words.length;
      if (written >= words.length) markDone(index);
    }
    draw();
    update();
  };

  /* Word web — Leo types his own examples around the unit's idea. */
  ACTIVITIES.wordweb = function (host, data, index) {
    ACTIVITIES.survey(host, {
      stems: (data.words || []).map(function (word) {
        return { t: (word.emoji || "🕸️") + "  " + word.word, jp: word.jp, placeholder: "Your own example with “" + word.word + "”" };
      })
    }, index);
  };

  /* Free writing with a live word / sentence counter and its own checklist. */
  ACTIVITIES.write = function (host, data, index) {
    var minWords = data.minWords || 50;
    var minSentences = data.minSentences || 4;
    var state = lLoad(stateKey(index)) || { draft: "", checks: [] };
    if (!state.checks) state.checks = [];

    if (data.model && data.model.length) {
      var model = el("div", "read-box");
      model.appendChild(el("div", "info-title", data.modelTitle || "Model"));
      data.model.forEach(function (line) { model.appendChild(el("p", "model-line", line)); });
      if (data.modelJp) model.appendChild(el("div", "info-jp", "🇯🇵 " + data.modelJp));
      host.appendChild(model);
    }
    if (data.expressions && data.expressions.length) {
      var box = el("div", "info-card");
      var body = el("div", "info-body");
      body.appendChild(el("div", "info-title", "Key expressions"));
      data.expressions.forEach(function (item) {
        body.appendChild(el("div", "info-text", "• " + item.t + (item.jp ? "  —  " + item.jp : "")));
      });
      box.appendChild(body);
      host.appendChild(box);
    }

    var area = document.createElement("textarea");
    area.className = "draft-area";
    area.placeholder = data.placeholder || "Write your draft here…";
    area.value = state.draft || "";
    host.appendChild(area);
    var counter = el("div", "mhint", "");
    host.appendChild(counter);

    var checkBox = el("div", "check-list");
    (data.checklist || []).forEach(function (label, i) {
      var row = el("label", "check-row");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = state.checks.indexOf(i) >= 0;
      input.onchange = function () {
        var position = state.checks.indexOf(i);
        if (input.checked && position < 0) state.checks.push(i);
        if (!input.checked && position >= 0) state.checks.splice(position, 1);
        persist();
      };
      row.appendChild(input);
      row.appendChild(el("span", null, label));
      checkBox.appendChild(row);
    });
    host.appendChild(checkBox);

    function persist() {
      state.draft = area.value;
      lSave(stateKey(index), state);
      /* The opener's caption is read back by the teacher review page, so it also
         lands under its own documented key, not only inside the tab state. */
      if (data.captionKey) lSave(data.captionKey, state.draft);
      var words = state.draft.trim().split(/\s+/).filter(Boolean).length;
      var sentences = state.draft.split(/[.!?]+/).filter(function (part) { return part.trim().length > 2; }).length;
      counter.textContent = words + " words · " + sentences + " sentences  (need " + minWords + " words and " + minSentences + " sentences)";
      var checksDone = state.checks.length >= (data.checklist || []).length;
      if (words >= minWords && sentences >= minSentences && checksDone) markDone(index);
    }
    area.oninput = persist;
    persist();
  };

  /* A plain "did I do it?" checklist — the edit step of the writing lesson. */
  ACTIVITIES.checklist = function (host, data, index) {
    var items = data.items || [];
    var state = lLoad(stateKey(index)) || { checks: [] };
    if (!state.checks) state.checks = [];
    var count = progressLine(host, "boxes checked");
    var list = el("div", "check-list");
    items.forEach(function (label, i) {
      var row = el("label", "check-row");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = state.checks.indexOf(i) >= 0;
      input.onchange = function () {
        var position = state.checks.indexOf(i);
        if (input.checked && position < 0) state.checks.push(i);
        if (!input.checked && position >= 0) state.checks.splice(position, 1);
        lSave(stateKey(index), state);
        update();
      };
      row.appendChild(input);
      row.appendChild(el("span", null, label));
      list.appendChild(row);
    });
    host.appendChild(list);
    function update() {
      count.textContent = state.checks.length + " / " + items.length;
      if (state.checks.length >= items.length) markDone(index);
    }
    update();
  };

  /* Paragraph-by-paragraph reading — the next paragraph unlocks only after the
     comprehension question on this one is answered. */
  ACTIVITIES.read = function (host, data, index) {
    var paras = data.paras || [];
    var keys = paras.map(function (_, i) { return "p" + i; });
    if (data.intro) {
      var intro = el("div", "read-box");
      intro.appendChild(el("p", "model-line", data.intro));
      host.appendChild(intro);
    }
    var count = progressLine(host, "paragraphs read");
    var blocks = [];

    paras.forEach(function (para, i) {
      var block = el("div", "para-block");
      var text = el("div", "read-box");
      text.appendChild(el("p", "model-line", para.t));
      block.appendChild(text);
      answerGroup(block, { q: para.q, opts: para.opts, correct: para.correct, jp: para.jp }, index, keys[i], function () { update(); });
      var locked = el("div", "para-lock", "🔒 Answer the question above to unlock the next paragraph.");
      block.appendChild(locked);
      host.appendChild(block);
      blocks.push(block);
    });

    function update() {
      var saved = lLoad(stateKey(index)) || {};
      var unlocked = 0;
      for (var i = 0; i < paras.length; i++) {
        blocks[i].classList.toggle("locked", i > unlocked);
        if (saved[keys[i]] != null) unlocked = i + 1;
      }
      for (var j = 0; j < paras.length; j++) {
        blocks[j].classList.toggle("locked", j > unlocked - 1 && j !== 0 && saved[keys[j - 1]] == null);
        var lock = blocks[j].querySelector(".para-lock");
        if (lock) lock.style.display = saved[keys[j]] == null && j === unlocked ? "block" : "none";
      }
      var answered = answeredCount(index, keys);
      count.textContent = answered + " / " + paras.length;
      if (answered >= paras.length) markDone(index);
    }
    update();
  };

  /* Karaoke: the lyrics scroll, and Leo taps the target word every time he
     sings it. Tapping is the point — it is how the song recycles Vocabulary 1. */
  ACTIVITIES.karaoke = function (host, data, index) {
    var lines = data.lines || [];
    var targets = (data.tapWords || []).map(function (word) { return word.toLowerCase(); });
    var state = lLoad(stateKey(index)) || { tapped: [] };
    if (!state.tapped) state.tapped = [];
    var total = 0;
    var count = progressLine(host, "song words tapped");
    var sheet = el("div", "lyric-sheet");

    lines.forEach(function (line, lineIndex) {
      var row = el("div", "lyric-line" + (line.chorus ? " chorus" : ""));
      var words = line.t.split(/(\s+)/);
      words.forEach(function (word, wordIndex) {
        if (/^\s+$/.test(word)) { row.appendChild(document.createTextNode(word)); return; }
        var bare = word.toLowerCase().replace(/[^a-z-']/g, "");
        if (targets.indexOf(bare) >= 0) {
          var id = lineIndex + ":" + wordIndex;
          total++;
          var chip = el("span", "lyric-hit", word);
          chip.onclick = function () {
            if (state.tapped.indexOf(id) >= 0) return;
            state.tapped.push(id);
            chip.classList.add("on");
            lSave(stateKey(index), state);
            update();
          };
          if (state.tapped.indexOf(id) >= 0) chip.classList.add("on");
          row.appendChild(chip);
        } else {
          row.appendChild(document.createTextNode(word));
        }
      });
      sheet.appendChild(row);
      if (line.jp) sheet.appendChild(el("div", "lyric-jp", line.jp));
    });
    host.appendChild(sheet);

    function update() {
      count.textContent = state.tapped.length + " / " + total;
      if (state.tapped.length >= total) markDone(index);
    }
    update();
  };

  /* Tap-to-reveal photo/fact cards, then quick checks on what was revealed. */
  ACTIVITIES.reveal = function (host, data, index) {
    var cards = data.cards || [];
    var state = lLoad(stateKey(index)) || { open: [] };
    if (!state.open) state.open = [];
    var count = progressLine(host, "cards opened");
    var grid = el("div", "flip-grid");

    cards.forEach(function (item, i) {
      var card = el("div", "flipcard");
      function open() {
        card.classList.add("revealed");
        card.innerHTML = "";
        card.appendChild(el("div", "fce", item.emoji));
        card.appendChild(el("div", "info-title", item.title));
        card.appendChild(el("div", "info-text", item.text));
        if (item.jp) card.appendChild(el("div", "info-jp", "🇯🇵 " + item.jp));
      }
      card.appendChild(el("div", "fce", item.emoji));
      card.appendChild(el("div", "info-title", item.title));
      card.appendChild(el("div", "fc-tap", "TAP TO OPEN"));
      card.onclick = function () {
        if (state.open.indexOf(i) < 0) state.open.push(i);
        lSave(stateKey(index), state);
        open();
        update();
      };
      if (state.open.indexOf(i) >= 0) open();
      grid.appendChild(card);
    });
    host.appendChild(grid);

    var checkKeys = (data.checks || []).map(function (_, i) { return "c" + i; });
    (data.checks || []).forEach(function (item, i) {
      answerGroup(host, item, index, checkKeys[i], function () { update(); });
    });

    function update() {
      count.textContent = state.open.length + " / " + cards.length;
      if (state.open.length >= cards.length && answeredCount(index, checkKeys) >= checkKeys.length) markDone(index);
    }
    update();
  };

  /* Put the steps or events back in order. */
  ACTIVITIES.order = function (host, data, index) {
    var items = data.items || [];
    var state = lLoad(stateKey(index)) || { placed: 0 };
    var count = progressLine(host, "in the right order");
    var slots = el("div", "order-slots");
    host.appendChild(slots);
    var bank = el("div", "chip-bank");
    host.appendChild(bank);

    function place(i) {
      var slot = el("div", "order-slot done");
      slot.textContent = (i + 1) + ". " + items[i];
      slots.appendChild(slot);
    }
    for (var i = 0; i < state.placed; i++) place(i);

    shuffle(items.map(function (text, i) { return { text: text, i: i }; })).forEach(function (entry) {
      var chip = el("button", "chip order-chip", entry.text);
      if (entry.i < state.placed) chip.classList.add("used");
      chip.onclick = function () {
        if (entry.i === state.placed) {
          place(entry.i);
          chip.classList.add("used");
          state.placed++;
          lSave(stateKey(index), state);
          update();
        } else {
          chip.classList.add("err");
          setTimeout(function () { chip.classList.remove("err"); }, 400);
        }
      };
      bank.appendChild(chip);
    });

    function update() {
      count.textContent = state.placed + " / " + items.length;
      if (state.placed >= items.length) markDone(index);
    }
    update();
  };

  /* Dribble! — the same MCQ, but every right answer beats a defender. Leo's
     reward tab; it is the one activity built purely around soccer. */
  ACTIVITIES.dribble = function (host, data, index) {
    var items = data.items || [];
    var keys = items.map(function (_, i) { return "d" + i; });
    var pitch = el("div", "pitch");
    var row = el("div", "score-row");
    var goals = el("div", null, "");
    var defenders = el("div", null, "");
    row.appendChild(goals);
    row.appendChild(defenders);
    pitch.appendChild(row);
    host.appendChild(pitch);

    items.forEach(function (item, i) {
      answerGroup(host, item, index, keys[i], function () { update(); });
    });

    function update() {
      var saved = lLoad(stateKey(index)) || {};
      var scored = keys.filter(function (key, i) { return saved[key] === items[i].correct; }).length;
      var answered = answeredCount(index, keys);
      goals.textContent = "⚽ Goals: " + scored + " / " + items.length;
      defenders.textContent = new Array(Math.max(0, items.length - answered) + 1).join("🛡️");
      if (answered >= items.length) markDone(index);
    }
    update();
  };

  /* ── boot ────────────────────────────────────────────────────────── */
  function boot(app) {
    APP = app;
    if (!APP.keys) APP.keys = APP.tabs.map(function (_, i) { return "tab-" + i + "-done"; });

    var nav = document.getElementById("tab-nav");
    var stack = document.getElementById("tab-stack");
    APP.tabs.forEach(function (tab, index) {
      var button = el("button", "tab-btn");
      button.id = "tb" + index;
      button.appendChild(el("span", "tab-icon", tab.icon));
      button.appendChild(el("span", "tab-name", tab.name));
      button.onclick = function () { showTab(index); };
      nav.appendChild(button);

      var pane = el("div", "tab-content");
      pane.id = "tc" + index;
      var body = el("div", "tab-body");
      body.id = "body-" + index;
      pane.appendChild(body);

      var footer = el("div", "tab-footer");
      var redoButton = el("button", "btn-redo", "↺ Redo");
      redoButton.id = "redo-" + index;
      redoButton.onclick = function () { redo(index); };
      var completeButton = el("button", "btn-complete", "Mark " + tab.name + " complete ✓");
      completeButton.id = "complete-" + index;
      completeButton.disabled = true;
      completeButton.onclick = function () { manualComplete(index); };
      footer.appendChild(redoButton);
      footer.appendChild(completeButton);
      pane.appendChild(footer);
      stack.appendChild(pane);
    });

    var last = lLoad("last-tab");
    showTab(typeof last === "number" && last >= 0 && last < APP.tabs.length ? last : 0);
    refreshProgress();
  }

  window.LEEA = { boot: boot };
})();
