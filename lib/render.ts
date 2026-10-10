import { Marked } from "marked";
import { codeToHtml } from "shiki";
import { LANGUAGES, type LanguageExt } from "./schema";

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// Content arrives by pull request from strangers. Raw HTML in Markdown is
// shown as text rather than rendered, so a reviewer who misses a <script>
// in a long diff doesn't ship it.
const markdown = new Marked({
  gfm: true,
  async: false,
  renderer: {
    html: ({ text }) => escapeHtml(text),
  },
});

export function renderMarkdown(src: string) {
  return markdown.parse(src) as string;
}

export function highlight(code: string, ext: LanguageExt) {
  return codeToHtml(code, {
    lang: LANGUAGES[ext].shiki,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  });
}
