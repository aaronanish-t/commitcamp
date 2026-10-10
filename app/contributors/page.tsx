import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, PageHeader } from "@/components/ui";
import { allContributors } from "@/lib/content";

export const metadata: Metadata = { title: "Contributors" };

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export default function ContributorsPage() {
  const contributors = allContributors();

  return (
    <>
      <PageHeader title="Contributors">
        Everyone whose work is on this site, counted straight from the content. Merge a pull request and you appear here
        on the next deploy, with nothing to sign up for.{" "}
        <Link href="/contribute" className="text-accent hover:text-accent-hover">
          Join them
        </Link>
        .
      </PageHeader>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {contributors.map((c) => (
          <li key={c.login}>
            <a
              href={`https://github.com/${c.login}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 hover:border-border-strong"
            >
              <Avatar login={c.login} size={44} />
              <div className="min-w-0">
                <div className="truncate font-medium">{c.login}</div>
                <div className="text-sm text-muted">
                  {[
                    c.challenges && plural(c.challenges, "challenge"),
                    c.solutions && plural(c.solutions, "solution"),
                    c.projects && plural(c.projects, "project"),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
