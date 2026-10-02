/*
 * LEEA cloud bridge — the standalone implementation.
 *
 * Every lesson HTML that was drafted outside this repo carries three script
 * tags in its <head> (docs/teacher-slides.md calls them a handoff hook):
 *
 *     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *     <script src="../../lib/leea-cloud-config.js"></script>
 *     <script src="../../lib/leea-cloud.js"></script>
 *
 * Those last two files had never existed — `public/lib/` was not in the repo
 * at all — so 14 decks and 6 learner apps 404ed twice on every open. Nothing
 * broke, because every call site is written as
 *
 *     if (typeof LEEA_CLOUD !== 'undefined' && LEEA_CLOUD && LEEA_CLOUD.enabled)
 *
 * and an undefined global simply falls through. But a check that never runs is
 * not a check, and two red lines in the console on every lesson open are two
 * lines nobody reads by the time a real one appears.
 *
 * ── THE RULE THIS FILE EXISTS TO OBEY ───────────────────────────────────────
 *
 * IT MUST NOT DEFINE `window.LEEA_CLOUD` IF SOMETHING ALREADY HAS.
 *
 * Learner apps run inside a srcdoc iframe, and `injectLearnerCloudBridge` in
 * `src/components/LessonPage.tsx` injects a real, Supabase-backed bridge
 * immediately after <head> — i.e. BEFORE this file's own <script> tag. Six
 * learner apps carry these tags, so an unconditional assignment here would
 * load after that bridge and overwrite it, silently cutting Leo's live cloud
 * sync in exactly the apps that already had it. The `if (window.LEEA_CLOUD)`
 * bail-out below is the entire reason this file can exist safely.
 *
 * ── WHAT IT DOES INSTEAD ────────────────────────────────────────────────────
 *
 * Provides the same five-method contract the call sites expect, backed by
 * localStorage, with `enabled` read from `leea-cloud-config.js` (false — see
 * that file for why). A teacher deck's iframe is same-origin with the app, so
 * its localStorage IS the app's localStorage: "Mark this lesson done" writing
 * `leea.lessonProgress.v1` already reaches the teacher dashboard with no cloud
 * involved, and per-slide state already survives a reopen. This bridge keeps
 * that true and makes the contract real rather than absent.
 *
 * ── KEY CONVENTION ──────────────────────────────────────────────────────────
 *
 * A `storage_key` is the FULL localStorage key, `leea-` prefix included. That
 * matches `normalizeLearnerStorageKey` in `src/data/learnerProgress.ts` (adds
 * the prefix when missing) and the injected bridge's `writeRow`, which does a
 * bare `localStorage.setItem(row.storage_key, …)`. Call sites pass keys both
 * ways — decks pass `SAVE_PREFIX + 'done'` unprefixed, the injected bridge
 * passes the full key — so normalising on the way in is what makes the two
 * agree.
 */
(function () {
  "use strict";

  /* ── 1. Stand down if a real bridge is already installed ──────────────────
     See the header. This is not an optimisation; it is the safety property
     that stops this file from breaking the six learner apps that load it. */
  if (window.LEEA_CLOUD) return;

  var config = window.LEEA_CLOUD_CONFIG || {};
  var PREFIX = "leea-";

  /** Full localStorage key, whichever convention the caller used. */
  function storageKey(key) {
    var text = String(key == null ? "" : key);
    return text.indexOf(PREFIX) === 0 ? text : PREFIX + text;
  }

  /* Every accessor is wrapped: localStorage throws outright in a private
     window with site data blocked, and a lesson must still open. */
  function readRaw(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeRaw(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {}
  }

  function removeRaw(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {}
  }

  /** Rows are returned parsed, like the injected bridge's — a string that is
      not JSON comes back as itself rather than throwing the whole fetch away. */
  function parse(value) {
    if (value === null) return null;
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }

  /**
   * Every key this page owns.
   *
   * A homeworkId such as `leo-4-lt7-9-lets-talk-slides` and its storage prefix
   * `4-lt7-9-lets-talk-slides-` are different strings, and a deck knows only
   * the first, so the prefix cannot be derived from it reliably. Listing the
   * whole store and letting the caller match is both correct and cheap at this
   * size; `fetchProgress` narrows it by homeworkId only when one is given and
   * the keys actually contain it.
   */
  function allKeys() {
    var keys = [];
    try {
      for (var i = 0; i < window.localStorage.length; i++) {
        var key = window.localStorage.key(i);
        if (key && key.indexOf(PREFIX) === 0) keys.push(key);
      }
    } catch (error) {}
    return keys;
  }

  window.LEEA_CLOUD = {
    /**
     * False until a transport and a table exist — see leea-cloud-config.js.
     * Guarded call sites skip their cloud write when this is false, so the
     * page behaves exactly as it did when this file was a 404.
     */
    enabled: Boolean(config.enabled),

    /** Why, so the console says "off" rather than leaving you to guess "broken". */
    reason: config.reason || "",

    /** Marks this as the standalone fallback, not LessonPage's real bridge. */
    standalone: true,

    /**
     * Write one value. `null`/`undefined` deletes, matching the injected
     * bridge, where a removeItem is sent as a save of null.
     */
    saveProgress: function (homeworkId, key, value) {
      var target = storageKey(key);
      if (value === null || value === undefined) {
        removeRaw(target);
        return Promise.resolve();
      }
      try {
        writeRaw(target, JSON.stringify(value));
      } catch (error) {}
      return Promise.resolve();
    },

    /**
     * Read this page's rows back, as `{ storage_key, value }` — the same shape
     * the injected bridge resolves and every call site's restore loop expects.
     *
     * Against localStorage this is a round trip: the values it returns are the
     * ones already in the store, so a restore loop writing them back changes
     * nothing. That is the point — the loop completes instead of being skipped,
     * and the same code works unchanged the day a real transport is wired in.
     */
    fetchProgress: function (homeworkId) {
      var wanted = homeworkId ? String(homeworkId) : "";
      var keys = allKeys();
      var matching = keys;

      if (wanted) {
        var narrowed = keys.filter(function (key) {
          return key.indexOf(wanted) !== -1;
        });
        // Only narrow when it actually matched something: a deck's keys are
        // built from SAVE_PREFIX, which need not contain its homeworkId, and
        // returning nothing would look like "no saved progress".
        if (narrowed.length) matching = narrowed;
      }

      return Promise.resolve(
        matching.map(function (key) {
          return { storage_key: key, value: parse(readRaw(key)) };
        })
      );
    },

    /** Delete one value. */
    deleteProgress: function (homeworkId, key) {
      removeRaw(storageKey(key));
      return Promise.resolve();
    },

    /**
     * Delete many as one operation — a "clear this page" or a retake. Same
     * signature as the injected bridge's, which takes the keys and a flag for
     * whether the whole sitting goes, so a page can call either without
     * knowing which bridge it got.
     */
    clearProgress: function (keys, wholeSitting) {
      if (!Array.isArray(keys) || !keys.length) return Promise.resolve();
      keys.forEach(function (key) {
        removeRaw(storageKey(key));
      });
      return Promise.resolve();
    }
  };
})();
