import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";
import {
  challengeFrontmatter,
  githubUser,
  isLanguageExt,
  project,
  slug as slugSchema,
  testCases,
  type ChallengeFrontmatter,
  type LanguageExt,
  type Project,
  type TestCase,
} from "./schema";

export const CONTENT_DIR = path.join(process.cwd(), "content");
const CHALLENGES_DIR = path.join(CONTENT_DIR, "challenges");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");

export type Solution = {
  author: string;
  ext: LanguageExt;
  file: string;
  code: string;
};

export type Challenge = ChallengeFrontmatter & {
  slug: string;
  dir: string;
  statement: string;
  tests: TestCase[];
  solutions: Solution[];
};

export type ProjectEntry = Project & { slug: string };

/**
 * Everything wrong with one piece of content, as human-readable lines.
 * The loaders collect problems instead of throwing on the first, so a
 * contributor sees every issue with their PR in a single CI run.
 */
export class ContentError extends Error {
  constructor(
    readonly file: string,
    readonly problems: string[],
  ) {
    super(`${file}:\n  - ${problems.join("\n  - ")}`);
  }
}

function zodProblems(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  return error.issues.map((i) => (i.path.length ? `${i.path.join(".")}: ${i.message}` : i.message));
}

function rel(p: string) {
  return path.relative(process.cwd(), p).split(path.sep).join("/");
}

function listDirs(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export function loadChallenge(slug: string): Challenge {
  const dir = path.join(CHALLENGES_DIR, slug);
  const problems: string[] = [];

  if (!slugSchema.safeParse(slug).success) problems.push(`folder name "${slug}" must be kebab-case`);

  const mdPath = path.join(dir, "challenge.md");
  let fm: ChallengeFrontmatter | undefined;
  let statement = "";
  if (!fs.existsSync(mdPath)) {
    problems.push("missing challenge.md");
  } else {
    const parsed = matter(fs.readFileSync(mdPath, "utf8"));
    const result = challengeFrontmatter.strict().safeParse(parsed.data);
    if (result.success) fm = result.data;
    else problems.push(...zodProblems(result.error).map((p) => `challenge.md frontmatter ${p}`));
    statement = parsed.content.trim();
    if (statement.length < 40) problems.push("challenge.md needs a problem statement below the frontmatter");
  }

  const testsPath = path.join(dir, "tests.json");
  let tests: TestCase[] = [];
  if (!fs.existsSync(testsPath)) {
    problems.push("missing tests.json");
  } else {
    try {
      const result = testCases.safeParse(JSON.parse(fs.readFileSync(testsPath, "utf8")));
      if (result.success) tests = result.data;
      else problems.push(...zodProblems(result.error).map((p) => `tests.json ${p}`));
    } catch (e) {
      problems.push(`tests.json is not valid JSON: ${(e as Error).message}`);
    }
  }

  const solutions: Solution[] = [];
  const solDir = path.join(dir, "solutions");
  if (fs.existsSync(solDir)) {
    for (const file of fs.readdirSync(solDir).sort()) {
      const ext = path.extname(file).slice(1);
      const author = path.basename(file, path.extname(file));
      if (!isLanguageExt(ext)) {
        problems.push(`solutions/${file}: unsupported language ".${ext}" (use .py, .js, .cpp or .java)`);
        continue;
      }
      if (!githubUser.safeParse(author).success) {
        problems.push(`solutions/${file}: name the file after your GitHub username, e.g. octocat.${ext}`);
        continue;
      }
      solutions.push({ author, ext, file: path.join(solDir, file), code: fs.readFileSync(path.join(solDir, file), "utf8") });
    }
  }
  if (solutions.length === 0) problems.push("add at least one solution in solutions/");

  if (problems.length || !fm) throw new ContentError(rel(dir), problems);
  return { ...fm, slug, dir, statement, tests, solutions };
}

export function loadProject(file: string): ProjectEntry {
  const full = path.join(PROJECTS_DIR, file);
  const slug = path.basename(file, path.extname(file));
  const problems: string[] = [];
  if (path.extname(file) !== ".yml") problems.push("project files must end in .yml");
  if (!slugSchema.safeParse(slug).success) problems.push(`file name "${slug}" must be kebab-case`);

  let data: Project | undefined;
  try {
    const result = project.safeParse(YAML.parse(fs.readFileSync(full, "utf8")));
    if (result.success) data = result.data;
    else problems.push(...zodProblems(result.error));
  } catch (e) {
    problems.push(`not valid YAML: ${(e as Error).message}`);
  }

  if (problems.length || !data) throw new ContentError(rel(full), problems);
  return { ...data, slug };
}

export function challengeSlugs() {
  return listDirs(CHALLENGES_DIR);
}

export function projectFiles() {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR).filter((f) => !f.startsWith(".")).sort();
}

const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 };

export function allChallenges() {
  return challengeSlugs()
    .map(loadChallenge)
    .sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] || a.title.localeCompare(b.title));
}

export function allProjects() {
  return projectFiles()
    .map(loadProject)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type Contributor = {
  login: string;
  challenges: number;
  solutions: number;
  projects: number;
};

/** Credit is derived from the content itself — there is no separate list to forget to update. */
export function allContributors(): Contributor[] {
  const by = new Map<string, Contributor>();
  const get = (login: string) => {
    const key = login.toLowerCase();
    let c = by.get(key);
    if (!c) by.set(key, (c = { login, challenges: 0, solutions: 0, projects: 0 }));
    return c;
  };
  for (const ch of allChallenges()) {
    get(ch.author).challenges++;
    for (const s of ch.solutions) get(s.author).solutions++;
  }
  for (const p of allProjects()) get(p.added_by).projects++;

  const score = (c: Contributor) => c.challenges * 3 + c.projects * 2 + c.solutions;
  return [...by.values()].sort((a, b) => score(b) - score(a) || a.login.localeCompare(b.login));
}
