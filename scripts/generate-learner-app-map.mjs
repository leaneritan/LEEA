import fs from "node:fs";
import path from "node:path";

// Learner apps must always be reached through /lessons/[lessonId] so the
// Supabase cloud-sync bridge (src/components/LessonPage.tsx) runs. A direct
// navigation to the static file under public/learn/ skips that bridge and
// silently strands progress in the browser's local storage only. This script
// builds the filename -> lessonId map that middleware.ts uses to redirect any
// such direct navigation back to the synced route.
const root = process.cwd();
const contentRoot = path.join(root, "content");
const outFile = path.join(root, "src", "generated", "learnerAppMap.json");

function findLearnerJsonFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findLearnerJsonFiles(fullPath, results);
    } else if (entry.isFile() && entry.name.endsWith(".learner.json")) {
      results.push(fullPath);
    }
  }
  return results;
}

const map = {};
for (const filePath of findLearnerJsonFiles(contentRoot)) {
  const lesson = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const embedPath = lesson?.source?.embedPath;
  const homeworkId = lesson?.source?.homeworkId;
  if (lesson?.source?.type === "html-app" && embedPath && homeworkId && lesson.id) {
    map[embedPath] = lesson.id;
  }
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(map, null, 2)}\n`);
console.log(`Wrote ${Object.keys(map).length} learner app route(s) to ${path.relative(root, outFile)}`);
