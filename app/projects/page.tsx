import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Tag, UserLink } from "@/components/ui";
import { allProjects } from "@/lib/content";
import { labelSearchUrl, starterIssues } from "@/lib/github";

export const metadata: Metadata = { title: "Projects" };

// Starter issues come and go; rebuild the page at most hourly.
export const revalidate = 3600;

function age(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default async function ProjectsPage() {
  const projects = allProjects();
  const issues = await Promise.all(projects.map((p) => starterIssues(p.repo, p.label)));

  return (
    <>
      <PageHeader title="Projects">
        Real repositories that welcome first-time contributors. Under each one are its newest open issues with a starter
        label, refreshed hourly. Know a good one?{" "}
        <Link href="/contribute#add-a-project" className="text-accent hover:text-accent-hover">
          Add a project
        </Link>
        .
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p, i) => {
          const result = issues[i];
          return (
            <section key={p.slug} className="flex flex-col rounded-xl border border-border bg-surface p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-semibold">
                  <a href={`https://github.com/${p.repo}`} className="hover:text-accent">
                    {p.name}
                  </a>
                </h2>
                <span className="truncate text-xs text-faint">{p.repo}</span>
              </div>
              <p className="mt-1.5 text-sm text-muted">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.languages.map((l) => (
                  <Tag key={l}>{l}</Tag>
                ))}
                {p.tags.map((t) => (
                  <Tag key={t}>#{t}</Tag>
                ))}
              </div>

              <div className="mt-4 flex-1 border-t border-border pt-3">
                <h3 className="text-xs font-medium tracking-wide text-faint uppercase">“{p.label}”</h3>
                {result.ok && result.issues.length > 0 ? (
                  <ul className="mt-2 space-y-1.5">
                    {result.issues.map((issue) => (
                      <li key={issue.number} className="flex gap-2 text-sm">
                        <a href={issue.url} className="min-w-0 flex-1 truncate hover:text-accent" title={issue.title}>
                          {issue.title}
                        </a>
                        <span className="shrink-0 text-xs text-faint tabular-nums">
                          {issue.comments > 0 && `${issue.comments} 💬 · `}
                          {age(issue.createdAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted">
                    {result.ok ? "No open starter issues right now." : "Couldn't reach GitHub just now."}
                  </p>
                )}
                <a href={labelSearchUrl(p.repo, p.label)} className="mt-3 inline-block text-sm text-accent hover:text-accent-hover">
                  All starter issues →
                </a>
              </div>

              <p className="mt-4 flex items-center gap-1.5 text-xs text-faint">
                Listed by <UserLink login={p.added_by} />
              </p>
            </section>
          );
        })}
      </div>
    </>
  );
}
