import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SolutionTabs } from "@/components/solution-tabs";
import { DifficultyBadge, Tag, UserLink, buttonSecondary } from "@/components/ui";
import { challengeSlugs, loadChallenge } from "@/lib/content";
import { highlight, renderMarkdown } from "@/lib/render";
import { LANGUAGES, type LanguageExt } from "@/lib/schema";
import { editFileUrl, newFileUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return challengeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/challenges/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = loadChallenge(slug);
  return { title: c.title, description: c.summary };
}

export default async function ChallengePage({ params }: PageProps<"/challenges/[slug]">) {
  const { slug } = await params;
  if (!challengeSlugs().includes(slug)) notFound();
  const c = loadChallenge(slug);

  const solutions = await Promise.all(
    c.solutions.map(async (s) => ({
      key: `${s.author}.${s.ext}`,
      language: LANGUAGES[s.ext].name,
      author: s.author,
      html: await highlight(s.code, s.ext),
    })),
  );
  const covered = new Set(c.solutions.map((s) => s.ext));
  const wanted = (Object.keys(LANGUAGES) as LanguageExt[]).filter((ext) => !covered.has(ext));
  const dir = `content/challenges/${slug}`;

  return (
    <article>
      <Link href="/challenges" className="text-sm text-muted hover:text-text">
        ← All challenges
      </Link>

      <header className="mt-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">{c.title}</h1>
          <DifficultyBadge difficulty={c.difficulty} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            Written by <UserLink login={c.author} />
          </span>
          <span>{c.tests.length} tests</span>
          <span className="flex flex-wrap gap-1.5">
            {c.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </span>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="prose min-w-0" dangerouslySetInnerHTML={{ __html: renderMarkdown(c.statement) }} />

        <section className="min-w-0 space-y-6">
          <div>
            <h2 className="mb-3 font-semibold">Solutions</h2>
            <SolutionTabs solutions={solutions} />
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-semibold">Add your solution</h2>
            <p className="mt-1 text-sm text-muted">
              {wanted.length
                ? `Still wanted in ${wanted.map((e) => LANGUAGES[e].name).join(", ")}. `
                : "Every language has one, but a different approach is always welcome. "}
              Name the file after your GitHub username. Read stdin, print to stdout, and CI will run it against the
              tests.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(LANGUAGES) as LanguageExt[]).map((ext) => (
                <a
                  key={ext}
                  href={newFileUrl(`${dir}/solutions`, `your-username.${ext}`)}
                  className={`${buttonSecondary} ${covered.has(ext) ? "" : "border-accent text-accent"}`}
                >
                  {LANGUAGES[ext].name}
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-faint">
              Found a mistake in the statement?{" "}
              <a href={editFileUrl(`${dir}/challenge.md`)} className="underline hover:text-text">
                Edit challenge.md
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}
