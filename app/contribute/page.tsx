import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { renderMarkdown } from "@/lib/render";

export const metadata: Metadata = { title: "Contribute" };

/** CONTRIBUTING.md is the one source of truth; GitHub and this page show the same text. */
export default function ContributePage() {
  const src = fs.readFileSync(path.join(process.cwd(), "CONTRIBUTING.md"), "utf8");
  // Give headings ids so "/contribute#add-a-challenge" links land.
  const html = renderMarkdown(src).replace(/<h([23])>(.*?)<\/h\1>/g, (_, level, text: string) => {
    const id = text
      .replace(/<[^>]+>/g, "")
      .toLowerCase()
      .replace(/&[a-z0-9#]+;/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
  return <article className="prose mx-auto max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />;
}
