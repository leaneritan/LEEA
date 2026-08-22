/**
 * geo-progress.js — the progress bridge every LEEA Geography map uses.
 *
 * Maps report, they never store. This module posts what Leo did up to the app
 * (src/components/geography/GeographyMapView.tsx), which is the only writer, so
 * everything reaches Supabase by one path. Opened standalone — no parent frame —
 * every call is a no-op and the map behaves exactly as before.
 *
 * The bridge is two-way. On start the map announces itself and the app replies
 * with what it already knows about this map, so the quiz can lean on the places
 * Leo keeps getting wrong instead of drawing at random every time.
 *
 * Usage:
 *   <script src="/components/geo-progress.js"></script>
 *   const geo = leeaGeoProgress({ mapId: "sekai-no-kuniguni-map", exploredTotal: 25 });
 *   geo.open("BRA");                       // Leo looked at something
 *   geo.pickQuiz(allIds, 10);              // weighted toward weak items
 *   geo.answered("BRA", true);             // one quiz answer
 *   geo.finishQuiz(score, total);          // sends the run up
 *   geo.isWeak("BRA");                     // for a 苦手 marker on the map
 */
(function () {
  function leeaGeoProgress(config) {
    if (!config || !config.mapId) throw new Error("leeaGeoProgress: config.mapId is required");

    var mapId = config.mapId;
    var exploredTotal = config.exploredTotal || 0;
    var opened = new Set();
    // Per-item stats as the app knows them: { id: {asked, correct, lastCorrect} }.
    var stats = {};
    // Results from the run in progress, sent up when the quiz finishes.
    var pending = [];
    var stateHandlers = [];
    var embedded = window.parent !== window;

    function post(message) {
      if (!embedded) return;
      try {
        message.type = "LEEA_GEO_PROGRESS";
        message.mapId = mapId;
        window.parent.postMessage(message, window.location.origin);
      } catch (error) {
        /* never let reporting break the map */
      }
    }

    function report(extra) {
      var message = { explored: opened.size, exploredTotal: exploredTotal };
      if (extra) {
        for (var key in extra) {
          if (Object.prototype.hasOwnProperty.call(extra, key)) message[key] = extra[key];
        }
      }
      post(message);
    }

    window.addEventListener("message", function (event) {
      if (event.origin !== window.location.origin) return;
      var data = event.data;
      if (!data || data.type !== "LEEA_GEO_STATE" || data.mapId !== mapId) return;
      stats = data.items || {};
      stateHandlers.forEach(function (handler) {
        try {
          handler(stats);
        } catch (error) {
          /* a bad handler must not break the bridge */
        }
      });
    });

    // Announce after the current script finishes, so a map that calls this at
    // the top still has its onState handlers registered when the reply lands.
    if (embedded) {
      setTimeout(function () {
        try {
          window.parent.postMessage({ type: "LEEA_GEO_READY", mapId: mapId }, window.location.origin);
        } catch (error) {
          /* ignore */
        }
      }, 0);
    }

    /**
     * How much this item deserves to come up. Never asked outranks known, and
     * anything last answered wrong outranks both — Leo should meet his misses
     * again soon, without the quiz becoming only his misses.
     */
    function weightFor(id) {
      var record = stats[id];
      if (!record || !record.asked) return 3;
      if (record.lastCorrect === false) return 6;
      var accuracy = record.correct / record.asked;
      if (accuracy >= 0.8) return 1;
      if (accuracy >= 0.5) return 2;
      return 4;
    }

    /** Weighted sample without replacement. Falls back to plain shuffle if all weights tie. */
    function pickQuiz(ids, count) {
      var pool = ids.slice();
      var chosen = [];
      var wanted = Math.min(count, pool.length);

      while (chosen.length < wanted && pool.length) {
        var weights = pool.map(weightFor);
        var total = weights.reduce(function (sum, weight) { return sum + weight; }, 0);
        var roll = Math.random() * total;
        var index = 0;
        for (var i = 0; i < pool.length; i++) {
          roll -= weights[i];
          if (roll <= 0) { index = i; break; }
          index = i;
        }
        chosen.push(pool[index]);
        pool.splice(index, 1);
      }
      return chosen;
    }

    return {
      /** Leo opened this item; counts toward "explored". */
      open: function (id) {
        if (id == null || opened.has(id)) return;
        opened.add(id);
        report();
      },
      /** Records one quiz answer, held until the run finishes. */
      answered: function (id, correct) {
        if (id == null) return;
        pending.push({ id: String(id), correct: Boolean(correct) });
      },
      /** Sends the finished run — score plus every answer in it. */
      finishQuiz: function (correct, total) {
        report({ quiz: { correct: correct, total: total }, items: pending.slice() });
        pending = [];
      },
      pickQuiz: pickQuiz,
      weightFor: weightFor,
      /** True once Leo has been asked and is not reliably getting it right. */
      isWeak: function (id) {
        var record = stats[id];
        if (!record || !record.asked) return false;
        return record.lastCorrect === false || record.correct / record.asked < 0.5;
      },
      weakIds: function () {
        return Object.keys(stats).filter(function (id) {
          var record = stats[id];
          return record.asked && (record.lastCorrect === false || record.correct / record.asked < 0.5);
        });
      },
      stats: function () { return stats; },
      /** Runs cb whenever the app sends stored stats down. */
      onState: function (cb) {
        stateHandlers.push(cb);
        if (Object.keys(stats).length) cb(stats);
      },
      report: report
    };
  }

  window.leeaGeoProgress = leeaGeoProgress;
})();
