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
 * Which evaluations this browser has seeded, and at which revision.
 *
 * Seeding is not the same as owning: once an evaluation is in the attempts
 * store it is Neritan's, so deleting it must stick. Without this record the
 * next page load would put it straight back — the same shape as the assignment
 * unassign bug and the reset bug before it.
 *
 * The value is the record's own `updatedAt`, which doubles as its revision. A
 * marking gets corrected — Q13 was read as answered when the paper shows it
 * blank, and that is the kind of mistake that only surfaces later — and a
 * corrected evaluation has to reach a browser that already holds the old one.
 * Comparing the repo's `updatedAt` against the seeded one is what lets it.
 */
const seededKey = "leea.evaluations.seeded.v1";

type SeededMap = Record<string, string>;

function readSeeded(): SeededMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(seededKey);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    // v1 stored a bare array of ids, before evaluations could be corrected.
    // Those are treated as "seeded at the beginning of time", so the first
    // load after a correction picks it up.
    if (Array.isArray(parsed)) {
      return Object.fromEntries((parsed as string[]).map((id) => [id, ""]));
    }
    return parsed && typeof parsed === "object" ? (parsed as SeededMap) : {};
  } catch {
    return {};
  }
}

function writeSeeded(seeded: SeededMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(seededKey, JSON.stringify(seeded));
  } catch {
    /* storage blocked — the worst case is an evaluation seeded twice, which is idempotent */
  }
}

/**
 * Put any evaluation this browser has not seen — or has seen at an older
 * revision — into the attempts store.
 *
 * Returns true when something changed, so a page can refresh itself. Safe to
 * call on every mount. Three cases, and the third is the one worth stating:
 *
 * - never seeded → seed it.
 * - seeded, still there, and the repo's copy is newer → replace it, because the
 *   marking has been corrected.
 * - seeded and since **deleted** → leave it deleted, even if the repo's copy is
 *   newer. A correction must not resurrect something Neritan threw away.
 */
export function seedEvaluations(): boolean {
  if (typeof window === "undefined") return false;
  const existing = readTestAttempts();
  const seeded = readSeeded();
  let changed = false;

  for (const evaluation of evaluations) {
    const here = existing[evaluation.id];
    const seenAt = seeded[evaluation.id];
    const isNewer = seenAt !== undefined && evaluation.updatedAt > seenAt;

    if (seenAt === undefined) {
      // Never seeded here. It may still be present, pulled down from the cloud
      // by another device that seeded it; take the newer of the two.
      if (!here || here.updatedAt < evaluation.updatedAt) {
        saveTestAttempt(evaluation);
        changed = true;
      }
    } else if (isNewer && here) {
      saveTestAttempt(evaluation);
      changed = true;
    }

    if (seenAt !== evaluation.updatedAt) {
      // Recorded even when nothing was written, so a deleted evaluation is not
      // reconsidered on every single load.
      seeded[evaluation.id] = evaluation.updatedAt;
      writeSeeded(seeded);
    }
  }

  return changed;
}
