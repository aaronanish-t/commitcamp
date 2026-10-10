/**
 * Runs every solution against its challenge's tests.json.
 *
 *   npm run test:solutions                 # everything
 *   npm run test:solutions -- fizzbuzz     # one or more challenges by slug
 *
 * Programs read the test input on stdin and write the answer to stdout.
 * Locally, a language whose toolchain isn't installed is skipped with a
 * warning; in CI (where all four are installed) that is a failure.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { outputsMatch } from "../lib/compare";
import { challengeSlugs, loadChallenge, type Solution } from "../lib/content";
import { LANGUAGES, type LanguageExt } from "../lib/schema";

const TIMEOUT_MS = 10_000;
const isWin = process.platform === "win32";
const inCI = !!process.env.CI;

type Prepared = { cmd: string; args: string[] } | { error: string };

function has(cmd: string) {
  return spawnSync(cmd, ["--version"], { stdio: "ignore", shell: false }).status === 0;
}

const toolchains: Record<LanguageExt, () => boolean> = {
  py: () => has(isWin ? "python" : "python3"),
  js: () => true,
  cpp: () => has("g++"),
  java: () => has("javac") && spawnSync("java", ["-version"], { stdio: "ignore" }).status === 0,
};
const available = new Map<LanguageExt, boolean>();
function toolchainAvailable(ext: LanguageExt) {
  if (!available.has(ext)) available.set(ext, toolchains[ext]());
  return available.get(ext)!;
}

/** Compile if needed and return how to run the program. */
function prepare(sol: Solution, work: string): Prepared {
  switch (sol.ext) {
    case "py":
      return { cmd: isWin ? "python" : "python3", args: [sol.file] };
    case "js":
      return { cmd: process.execPath, args: [sol.file] };
    case "cpp": {
      const out = path.join(work, isWin ? "a.exe" : "a.out");
      const c = spawnSync("g++", ["-std=c++17", "-O2", sol.file, "-o", out], { encoding: "utf8" });
      return c.status === 0 ? { cmd: out, args: [] } : { error: `compile error:\n${c.stderr}` };
    }
    case "java": {
      fs.copyFileSync(sol.file, path.join(work, "Main.java"));
      const c = spawnSync("javac", ["-d", work, path.join(work, "Main.java")], { encoding: "utf8" });
      return c.status === 0 ? { cmd: "java", args: ["-cp", work, "Main"] } : { error: `compile error:\n${c.stderr}` };
    }
  }
}

/** Returns why the case failed, or null if it passed. */
function runCase(run: { cmd: string; args: string[] }, input: string, expected: string): string | null {
  const r = spawnSync(run.cmd, run.args, { input, encoding: "utf8", timeout: TIMEOUT_MS });
  if (r.error) {
    return r.error.message.includes("ETIMEDOUT") ? `timed out after ${TIMEOUT_MS / 1000}s` : r.error.message;
  }
  if (r.status !== 0) return `exited with ${r.status}: ${r.stderr.trim().split("\n").slice(-3).join("\n")}`;
  if (!outputsMatch(r.stdout, expected)) return `expected:\n${expected}\n      got:\n${r.stdout}`;
  return null;
}

const wanted = process.argv.slice(2);
const slugs = wanted.length ? wanted : challengeSlugs();
let passed = 0;
let failed = 0;
let skipped = 0;

for (const slug of slugs) {
  const ch = loadChallenge(slug);
  console.log(`\n${ch.title} (${slug})`);

  for (const sol of ch.solutions) {
    const label = `  ${LANGUAGES[sol.ext].name.padEnd(10)} ${sol.author}`;
    if (!toolchainAvailable(sol.ext)) {
      if (inCI) {
        console.log(`${label}  ✗ toolchain missing in CI`);
        failed++;
      } else {
        console.log(`${label}  – skipped (${LANGUAGES[sol.ext].name} not installed)`);
        skipped++;
      }
      continue;
    }

    const work = fs.mkdtempSync(path.join(os.tmpdir(), "commitcamp-"));
    try {
      const prepared = prepare(sol, work);
      if ("error" in prepared) {
        console.log(`${label}  ✗ ${prepared.error}`);
        failed++;
        continue;
      }

      let failure: string | null = null;
      for (const [i, t] of ch.tests.entries()) {
        const why = runCase(prepared, t.input, t.output);
        if (why) {
          failure = `test ${i + 1}: ${why}\n      input:\n${t.input}`;
          break;
        }
      }

      if (failure) {
        console.log(`${label}  ✗ ${failure}`);
        failed++;
      } else {
        console.log(`${label}  ✓ ${ch.tests.length}/${ch.tests.length}`);
        passed++;
      }
    } finally {
      fs.rmSync(work, { recursive: true, force: true });
    }
  }
}

console.log(`\n${passed} passed, ${failed} failed${skipped ? `, ${skipped} skipped` : ""}`);
if (failed) process.exit(1);
