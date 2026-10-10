/**
 * Scaffolds a challenge folder so contributors start from a valid shape:
 *
 *   npm run new:challenge -- <slug> <your-github-username>
 */
import fs from "node:fs";
import path from "node:path";
import { githubUser, slug as slugSchema } from "../lib/schema";

const [slug, author] = process.argv.slice(2);
if (!slug || !author) {
  console.error("usage: npm run new:challenge -- <slug> <your-github-username>");
  process.exit(1);
}
if (!slugSchema.safeParse(slug).success) {
  console.error(`"${slug}" isn't kebab-case — try something like "balanced-brackets"`);
  process.exit(1);
}
if (!githubUser.safeParse(author).success) {
  console.error(`"${author}" doesn't look like a GitHub username`);
  process.exit(1);
}

const dir = path.join(process.cwd(), "content", "challenges", slug);
if (fs.existsSync(dir)) {
  console.error(`content/challenges/${slug} already exists`);
  process.exit(1);
}

const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
fs.mkdirSync(path.join(dir, "solutions"), { recursive: true });
fs.writeFileSync(
  path.join(dir, "challenge.md"),
  `---
title: ${title}
summary: One sentence that tells someone whether they want to try this.
difficulty: easy
tags: [strings]
author: ${author}
---

Describe the problem here. Say exactly what the program reads and prints.

## Input

What arrives on standard input, line by line.

## Output

What to print, and in what format.

## Example

\`\`\`
input goes here
\`\`\`

prints

\`\`\`
output goes here
\`\`\`
`,
);
fs.writeFileSync(
  path.join(dir, "tests.json"),
  JSON.stringify(
    [
      { input: "example input\n", output: "example output\n" },
      { input: "an edge case\n", output: "its answer\n" },
    ],
    null,
    2,
  ) + "\n",
);
fs.writeFileSync(
  path.join(dir, "solutions", `${author}.py`),
  `import sys

data = sys.stdin.read()
# your solution here
print(data.strip())
`,
);

console.log(`Created content/challenges/${slug}/
  challenge.md            the problem statement
  tests.json              inputs and expected outputs
  solutions/${author}.py  a reference solution (rename to .js, .cpp or .java if you prefer)

Check it with:  npm run validate && npm run test:solutions -- ${slug}`);
