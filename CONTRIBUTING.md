# Contributing to CommitCamp

Thanks for being here. CommitCamp exists to make a first open-source contribution feel small and safe, and that includes contributions to CommitCamp itself. If this is your first pull request anywhere, you're exactly who this is for.

There are four ways to contribute, from smallest to largest:

| You want to… | You'll touch | Time |
|---|---|---|
| [Add a solution](#add-a-solution) to an existing challenge | one file | 15 min |
| [Add a project](#add-a-project) that welcomes beginners | one file | 10 min |
| [Add a challenge](#add-a-challenge) | one folder | an hour |
| [Improve the site](#improve-the-site) | code | it depends |

Every merged contribution puts you on the contributors page automatically. Your GitHub username in a file name or a field *is* the credit.

## Before you start

- Be kind. Read the [Code of Conduct](https://github.com/aaronanish-t/commitcamp/blob/main/CODE_OF_CONDUCT.md). Reviewers will be patient with you, and we ask the same of you.
- One contribution per pull request. Small PRs get reviewed fast.
- Don't open a PR for something big without an issue first. A two-line conversation can save you a weekend.
- Stuck? Open a draft PR and ask in it. Half-finished is fine.

## Add a solution

Every challenge page has buttons that open GitHub's editor with the file already named, so **you don't need to install anything**. GitHub forks the repo for you and walks you through opening the pull request.

The rules:

1. **Name the file after your GitHub username**: `content/challenges/<challenge>/solutions/<your-username>.<ext>`.
2. **Supported languages:** `.py` (Python 3), `.js` (Node.js), `.cpp` (C++17, g++), `.java` (Java 17+, and the class must be named `Main`).
3. **Read from standard input, print to standard output.** No prompts like `Enter a number:` because those count as output.
4. **Your own work.** Don't paste a solution from somewhere else. Reading other solutions here first is fine; that's half the point.

CI runs your solution against every case in the challenge's `tests.json`. If it fails, the check output shows the input, what was expected, and what your program printed.

You can add a second solution in a different language. Two solutions by the same person in the *same* language aren't possible (the file name would clash), so pick your best one.

## Add a project

A project listing is one YAML file in `content/projects/`:

```yaml
# content/projects/excalidraw.yml
name: Excalidraw
repo: excalidraw/excalidraw          # owner/name, not a URL
description: A hand-drawn style virtual whiteboard. A friendly codebase for a first React contribution.
languages: [TypeScript]
tags: [react, web]                   # optional, kebab-case
label: good first issue              # optional; the label the project uses for starter issues
added_by: your-github-username
```

A project belongs here if it:

- is active (commits and merged pull requests from outside contributors in the last few months),
- labels starter issues (check the repo's *Labels* page and set `label:` to match exactly; capitalisation matters),
- has contributing instructions a beginner could follow.

Please don't list your own project unless it meets all three. Starter issues are pulled live from GitHub, so a project with the wrong label shows an empty list.

## Add a challenge

Scaffold the folder:

```sh
npm install
npm run new:challenge -- my-challenge-name your-github-username
```

That creates:

```
content/challenges/my-challenge-name/
  challenge.md            the statement, with a short YAML header
  tests.json              inputs and expected outputs
  solutions/
    your-username.py      your reference solution
```

### challenge.md

```markdown
---
title: Balanced Brackets
summary: One sentence that tells someone whether they want to try this.
difficulty: easy            # easy | medium | hard
tags: [stacks, strings]     # 1–6, kebab-case
author: your-github-username
---

The problem statement, with ## Input, ## Output and ## Example sections.
```

A good challenge:

- **Is original.** Don't copy problems from LeetCode, HackerRank, Codeforces or textbooks; their statements are copyrighted. Classic ideas (FizzBuzz, bracket matching, BFS) are fine in your own words.
- **Specifies the I/O exactly.** If two reasonable programs could print different things for the same input, the statement isn't finished.
- **States its limits** (n ≤ 10⁵ and so on), so people know whether O(n²) is acceptable.

### tests.json

```json
[
  { "input": "3\n([]{})\n([)]\nf(x[0]) + {y}\n", "output": "YES\nNO\nYES\n" },
  { "input": "1\n((\n", "output": "NO\n" }
]
```

At least two cases. Include the example from the statement, then the edge cases people get wrong: empty input, the smallest and largest values, ties. Output is compared after trimming trailing whitespace on each line and trailing blank lines; everything else must match exactly.

### Check it locally

```sh
npm run validate                                 # schema, file names, duplicates
npm run test:solutions -- my-challenge-name      # runs every solution against tests.json
```

Languages you don't have installed are skipped locally. CI has all four.

## Improve the site

The site is Next.js (App Router), TypeScript and Tailwind CSS. Content is read from `content/` at build time, and there's no database.

```sh
npm install
npm run dev          # http://localhost:3000
npm test             # unit tests
npm run lint
npm run typecheck
```

Optional: put `GITHUB_TOKEN=<a token with no scopes>` in `.env.local` to lift GitHub's 60-requests-an-hour limit on the projects page.

Where things live:

- `content/`: everything contributors add
- `lib/schema.ts`: the rules content must follow (used by the site, the validator and CI)
- `lib/content.ts`: loads and checks content
- `scripts/`: `validate`, `run-solutions`, `new-challenge`
- `app/`: pages

Look for issues labelled [`good first issue`](https://github.com/aaronanish-t/commitcamp/labels/good%20first%20issue). Comment on one before starting so two people don't build the same thing.

## The pull request

- **Title:** say what it adds, like `Add Go solution to fizzbuzz` or `Add Zulip to projects`.
- **Fill in the template.** It's a short checklist.
- **CI must pass.** If a check fails, open its log, fix the problem and push again to the same branch. The PR updates itself.
- A maintainer reviews it, usually within a few days. Review comments are about the code, never about you.

## Licensing

By contributing you agree that code (the site, scripts and solutions) is released under the [MIT License](https://github.com/aaronanish-t/commitcamp/blob/main/LICENSE), and that written content (challenge statements and project descriptions) is released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
