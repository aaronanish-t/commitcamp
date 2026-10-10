import { describe, expect, it } from "vitest";
import { challengeFrontmatter, githubUser, project, testCases } from "./schema";

describe("githubUser", () => {
  it.each(["octocat", "aaronanish-t", "a", "a1-b2"])("accepts %s", (u) => {
    expect(githubUser.safeParse(u).success).toBe(true);
  });

  it.each(["-lead", "trail-", "dou--ble", "has space", "x".repeat(40), ""])("rejects %j", (u) => {
    expect(githubUser.safeParse(u).success).toBe(false);
  });
});

describe("challengeFrontmatter", () => {
  const valid = {
    title: "FizzBuzz",
    summary: "Count to n with a twist.",
    difficulty: "easy",
    tags: ["loops"],
    author: "octocat",
  };

  it("accepts a complete header", () => {
    expect(challengeFrontmatter.safeParse(valid).success).toBe(true);
  });

  it("rejects unknown difficulties and non-kebab tags", () => {
    expect(challengeFrontmatter.safeParse({ ...valid, difficulty: "trivial" }).success).toBe(false);
    expect(challengeFrontmatter.safeParse({ ...valid, tags: ["Dynamic Programming"] }).success).toBe(false);
  });
});

describe("testCases", () => {
  it("needs at least two cases", () => {
    expect(testCases.safeParse([{ input: "1", output: "1" }]).success).toBe(false);
  });

  it("rejects stray keys so typos like 'ouput' are caught", () => {
    expect(
      testCases.safeParse([
        { input: "1", output: "1" },
        { input: "2", ouput: "2" },
      ]).success,
    ).toBe(false);
  });
});

describe("project", () => {
  it("defaults the label to 'good first issue'", () => {
    const parsed = project.parse({
      name: "Example",
      repo: "octo/example",
      description: "An example project listing.",
      languages: ["Go"],
      added_by: "octocat",
    });
    expect(parsed.label).toBe("good first issue");
    expect(parsed.tags).toEqual([]);
  });

  it("rejects a full URL in place of owner/name", () => {
    expect(
      project.safeParse({
        name: "Example",
        repo: "https://github.com/octo/example",
        description: "An example project listing.",
        languages: ["Go"],
        added_by: "octocat",
      }).success,
    ).toBe(false);
  });
});
