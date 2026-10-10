import Link from "next/link";
import { buttonPrimary, buttonSecondary } from "@/components/ui";
import { allChallenges, allContributors, allProjects } from "@/lib/content";

const STEPS = [
  {
    title: "Pick something small",
    body: "A starter issue in a real project, or a challenge here that's missing a solution in your language.",
  },
  {
    title: "Open a pull request",
    body: "Every page has a button that opens GitHub's editor with the file already named. No local setup needed for a first PR.",
  },
  {
    title: "CI checks it, a person merges it",
    body: "Automated checks validate the format and run your solution against the tests. Then you're on the contributors page.",
  },
];

export default function Home() {
  const challenges = allChallenges();
  const projects = allProjects();
  const contributors = allContributors();
  const solutions = challenges.reduce((n, c) => n + c.solutions.length, 0);

  return (
    <div className="space-y-16">
      <section className="pt-6">
        <p className="text-sm font-medium text-accent">Open source, by pull request</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Your first open-source commit starts here.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Find a beginner-friendly issue in a real project, or warm up on coding challenges written by other learners.
          This site is itself open source: every challenge, solution and project listing arrived as a pull request.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects" className={buttonPrimary}>
            Find a first issue
          </Link>
          <Link href="/challenges" className={buttonSecondary}>
            Browse challenges
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {[
          [projects.length, "projects"],
          [challenges.length, "challenges"],
          [solutions, "verified solutions"],
          [contributors.length, "contributors"],
        ].map(([n, label]) => (
          <div key={label} className="bg-surface p-5">
            <div className="text-3xl font-semibold tabular-nums">{n}</div>
            <div className="mt-1 text-sm text-muted">{label}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link href="/projects" className="group rounded-xl border border-border bg-surface p-6 hover:border-border-strong">
          <h2 className="text-lg font-semibold">Projects →</h2>
          <p className="mt-2 text-muted">
            Repositories that welcome newcomers, each with its open starter issues pulled live from GitHub.
          </p>
        </Link>
        <Link href="/challenges" className="group rounded-xl border border-border bg-surface p-6 hover:border-border-strong">
          <h2 className="text-lg font-semibold">Challenges →</h2>
          <p className="mt-2 text-muted">
            Problems with tests. Read other people&apos;s solutions, or add yours in Python, JavaScript, C++ or Java.
          </p>
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">How contributing works</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <div className="grid size-8 place-items-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                {i + 1}
              </div>
              <h3 className="mt-3 font-medium">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
        <Link href="/contribute" className="mt-6 inline-block text-sm text-accent hover:text-accent-hover">
          Read the full guide →
        </Link>
      </section>
    </div>
  );
}
