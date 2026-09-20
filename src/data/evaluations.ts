import evalL4T19_20260919 from "../../content/subjects/english/courses/our-world/level-4/evaluations/ow-l4-t1-9-test-2026-09-19.json";
import { readTestAttempts, saveTestAttempt, type TestAttempt } from "@/data/testAttempts";

/**
 * Marked paper tests, kept in the repo.
 *
 * Most of what Leo has sat is on paper, and the marking is done away from LEEA
 * — a PDF of the test and an evaluation written against it. That marking is the
 * teaching artefact: what he wrote, what it should have been, and what Neritan
 * said about it. Left as a file on a laptop it is unreachable; typed into a form
 * on one browser it is stuck there.
 *
 * So an evaluation is content, committed beside the unit it belongs to, and
 * seeded into the ordinary attempts store on load. From there it is a sitting
 * like any other: it shows on `/tests`, it opens as a report, its wrong answers
 * feed `/tests/mistakes`, and it syncs through `test_attempts`.
 *
 * **Adding one:** write the JSON (the `TestAttempt` shape, with `medium: "paper"`
 * and a stable `id` beginning `eval-`), drop it in that level's `evaluations/`
 * folder, and import it here. Number each question the way the digital test
 * numbers it — `paperNumber` in `public/components/test-engine.js` — so a paper
 * sitting and an app sitting of the same test count as the same question in the
 * mistakes drill rather than as two.
 */
export const evaluations = [evalL4T19_20260919 as TestAttempt];

/**
 * Which evaluations this browser has already seeded.
 *
 * Seeding is not the same as owning: once an evaluation is in the attempts
 * store it is Neritan's, so deleting it must stick. Without this set the next
 * page load would put it straight back — the same shape as the assignment
 * unassign bug and the reset bug before it.
 */
const seededKey = "leea.evaluations.seeded.v1";

function readSeeded(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(seededKey);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeSeeded(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(seededKey, JSON.stringify([...ids]));
  } catch {
    /* storage blocked — the worst case is an evaluation seeded twice, which is idempotent */
  }
}

/**
 * Put any evaluation this browser has not seen into the attempts store.
 *
 * Returns true when something was added, so a page can refresh itself. Safe to
 * call on every mount: an evaluation already present, or one already seeded and
 * since deleted, is skipped.
 */
export function seedEvaluations(): boolean {
  if (typeof window === "undefined") return false;
  const existing = readTestAttempts();
  const seeded = readSeeded();
  let added = false;

  for (const evaluation of evaluations) {
    if (existing[evaluation.id] || seeded.has(evaluation.id)) continue;
    saveTestAttempt(evaluation);
    seeded.add(evaluation.id);
    added = true;
  }

  if (added) writeSeeded(seeded);
  return added;
}
