/**
 * Normalise program output for comparison: CRLF → LF, trailing whitespace
 * stripped from every line, and trailing blank lines dropped. A solution
 * shouldn't fail because Windows wrote "\r\n" or a print added a space.
 */
export function normalizeOutput(s: string) {
  return s
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n+$/, "");
}

export function outputsMatch(actual: string, expected: string) {
  return normalizeOutput(actual) === normalizeOutput(expected);
}
