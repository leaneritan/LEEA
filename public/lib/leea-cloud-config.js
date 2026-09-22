/*
 * LEEA cloud bridge — configuration.
 *
 * Loaded by every lesson HTML that carries the standard three-tag cloud block
 * (see docs/teacher-slides.md). It runs before `leea-cloud.js` and is the one
 * place that decides whether a standalone page may talk to a cloud at all.
 *
 * It is deliberately a separate file from the bridge so the switch can be
 * flipped, or a real transport configured, without touching the bridge logic
 * or any of the ~60 lesson files that load it.
 *
 * WHY `enabled` IS false
 * ----------------------
 * Nothing in this repo stores a teacher deck's own slide state. The two tables
 * that exist are `learner_progress` (Leo's app state, keyed by a learner
 * lesson's homeworkId) and `teacher_lesson_progress` (the Mark Done checklist,
 * lesson-level only). A deck's per-slide keys — which slide it is on, which
 * multiple-choice it answered, which boxes are ticked — have no table and no
 * reader anywhere in `src/`.
 *
 * Golden rule 11a is exactly about this: "Every cloud write falls back to
 * localStorage on failure, so a missing table looks exactly like everything
 * working." Shipping `enabled: true` against a table that does not exist would
 * be indistinguishable from working sync, which is worse than no sync. So the
 * bridge is honest instead: it declares itself disabled, every guarded call
 * site skips its cloud call, and deck state stays in localStorage — which is
 * shared with the app anyway, because a deck iframe is same-origin.
 *
 * TO TURN IT ON LATER
 * -------------------
 * 1. Add the table to `supabase/schema.sql`, apply it, and grant it to `anon`
 *    (rule 11a — a schema change is not done until it is applied and verified
 *    as `anon`, not as the privileged role).
 * 2. Give `leea-cloud.js` a `transport` here that writes to it.
 * 3. Set `enabled: true`.
 *
 * Learner apps need none of this: `injectLearnerCloudBridge` in
 * `src/components/LessonPage.tsx` gives them a real, working bridge before
 * their own scripts run, and `leea-cloud.js` stands down when it finds one.
 */
(function () {
  "use strict";

  // Never overwrite a config a host page already set.
  if (window.LEEA_CLOUD_CONFIG) return;

  window.LEEA_CLOUD_CONFIG = {
    /**
     * Whether a cloud transport is available to this page.
     *
     * Call sites read this through `LEEA_CLOUD.enabled` and skip their cloud
     * call when it is false, so flipping it is the whole switch.
     */
    enabled: false,

    /**
     * Said out loud so anyone reading the console — or this file — knows the
     * difference between "sync is off" and "sync is broken".
     */
    reason:
      "No table stores teacher-deck slide state. Deck progress is kept in " +
      "localStorage, which the app shares with the deck (same origin). " +
      "Learner apps sync through the bridge LessonPage.tsx injects.",

    /**
     * Where a real implementation would go: a function
     * `(op, payload) => Promise` that `leea-cloud.js` calls instead of its
     * localStorage fallback. Null until one exists.
     */
    transport: null
  };
})();
