/**
 * Checks every challenge and project against the schema and reports all
 * problems at once. Runs in CI on every pull request; run it locally with
 * `npm run validate` before pushing.
 */
import { ContentError, challengeSlugs, loadChallenge, loadProject, projectFiles } from "../lib/content";

const errors: ContentError[] = [];
const repos = new Map<string, string>();
let checked = 0;

function attempt<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch (e) {
    if (e instanceof ContentError) errors.push(e);
    else throw e;
  }
}

for (const slug of challengeSlugs()) {
  checked++;
  const ch = attempt(() => loadChallenge(slug));
  if (!ch) continue;
  const extra: string[] = [];
  for (const s of ch.solutions) {
    if (s.ext === "java" && !/\bclass\s+Main\b/.test(s.code)) {
      extra.push(`solutions/${s.author}.java: the public class must be named Main`);
    }
  }
  if (extra.length) errors.push(new ContentError(`content/challenges/${slug}`, extra));
}

for (const file of projectFiles()) {
  checked++;
  const p = attempt(() => loadProject(file));
  if (!p) continue;
  const key = p.repo.toLowerCase();
  const dupe = repos.get(key);
  if (dupe) errors.push(new ContentError(`content/projects/${file}`, [`${p.repo} is already listed in ${dupe}`]));
  else repos.set(key, file);
}

if (errors.length) {
  console.error(`✗ ${errors.length} of ${checked} entries need fixing:\n`);
  for (const e of errors) console.error(e.message + "\n");
  process.exit(1);
}
console.log(`✓ ${checked} entries valid`);
