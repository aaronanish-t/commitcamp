import { z } from "zod";

// GitHub's own rules: alphanumerics and single hyphens, no leading/trailing
// hyphen, at most 39 characters. Every contribution is credited to one of
// these, so a typo here would credit a stranger.
export const githubUser = z
  .string()
  .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, "must be a GitHub username");

const kebab = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be kebab-case");

export const slug = kebab;

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const challengeFrontmatter = z.object({
  title: z.string().min(3).max(80),
  summary: z.string().min(10).max(160),
  difficulty: z.enum(DIFFICULTIES),
  tags: z.array(kebab).min(1).max(6),
  author: githubUser,
});
export type ChallengeFrontmatter = z.infer<typeof challengeFrontmatter>;

export const testCases = z
  .array(z.object({ input: z.string(), output: z.string() }).strict())
  .min(2, "add at least two test cases — one can be the example from the statement");
export type TestCase = z.infer<typeof testCases>[number];

/** File extension → language. A solution is `solutions/<github-username>.<ext>`. */
export const LANGUAGES = {
  py: { name: "Python", shiki: "python" },
  js: { name: "JavaScript", shiki: "javascript" },
  cpp: { name: "C++", shiki: "cpp" },
  java: { name: "Java", shiki: "java" },
} as const;
export type LanguageExt = keyof typeof LANGUAGES;

export function isLanguageExt(ext: string): ext is LanguageExt {
  return Object.hasOwn(LANGUAGES, ext);
}

export const project = z
  .object({
    name: z.string().min(2).max(60),
    repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, "must be owner/name"),
    description: z.string().min(10).max(200),
    languages: z.array(z.string().min(1)).min(1).max(5),
    tags: z.array(kebab).max(6).default([]),
    // The label the project uses for starter issues. Projects disagree on the
    // name, and listing one with the wrong label shows an empty column.
    label: z.string().min(1).default("good first issue"),
    added_by: githubUser,
  })
  .strict();
export type Project = z.infer<typeof project>;
