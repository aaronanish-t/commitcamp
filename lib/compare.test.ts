import { describe, expect, it } from "vitest";
import { normalizeOutput, outputsMatch } from "./compare";

describe("outputsMatch", () => {
  it("ignores Windows line endings", () => {
    expect(outputsMatch("1\r\n2\r\n", "1\n2\n")).toBe(true);
  });

  it("ignores trailing spaces and trailing blank lines", () => {
    expect(outputsMatch("a b  \nc \n\n\n", "a b\nc")).toBe(true);
  });

  it("does not ignore leading whitespace or blank lines in the middle", () => {
    expect(outputsMatch(" a", "a")).toBe(false);
    expect(outputsMatch("a\n\nb", "a\nb")).toBe(false);
  });

  it("treats empty output as matching an empty expectation", () => {
    expect(normalizeOutput("\n\n")).toBe("");
    expect(outputsMatch("", "")).toBe(true);
  });
});
