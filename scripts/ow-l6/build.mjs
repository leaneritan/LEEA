/* Orchestrator: regenerate every Level 6 artefact from the authored unit data.
   Idempotent — re-running rewrites the same files. */
import { buildAllContent, syncVocabularyIndex } from "./build-content.mjs";
import { buildAllApps } from "./build-apps.mjs";
import { assertGeneratedFilesPresent, buildLessonRegistry, buildReferenceRegistry } from "./build-registry.mjs";
import { UNITS } from "./lib.mjs";

const units = [];
for (const unit of UNITS) {
  try {
    units.push((await import(`./data/unit-${unit}.mjs`)).default);
  } catch (error) {
    if (error.code !== "ERR_MODULE_NOT_FOUND") throw error;
    console.warn(`skipping unit ${unit}: no data module yet`);
  }
}

buildAllContent(units);
const indexed = syncVocabularyIndex(units);
const apps = buildAllApps(units);
assertGeneratedFilesPresent(units);
const registered = buildLessonRegistry(units);
buildReferenceRegistry(units);

console.log(`Level 6: ${units.length} unit(s) -> content + ${apps.learner} learner app(s), ${apps.teacher} teacher deck(s), ${apps.lessons} lesson record(s).`);
console.log(`vocabulary-index.json now holds ${indexed} words.`);
console.log(`src/data/lessons-level6.generated.ts registers ${registered} lesson record(s).`);
