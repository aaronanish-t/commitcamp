import type { Metadata } from "next";
import Link from "next/link";
import { ChallengeList } from "@/components/challenge-list";
import { PageHeader } from "@/components/ui";
import { allChallenges } from "@/lib/content";

export const metadata: Metadata = { title: "Challenges" };

export default function ChallengesPage() {
  const challenges = allChallenges().map((c) => ({
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    difficulty: c.difficulty,
    tags: c.tags,
    languages: [...new Set(c.solutions.map((s) => s.ext))],
  }));

  return (
    <>
      <PageHeader title="Challenges">
        Problems that read from standard input and print to standard output. Every solution listed here passes the
        challenge&apos;s tests in CI. Have an idea for a new one?{" "}
        <Link href="/contribute#add-a-challenge" className="text-accent hover:text-accent-hover">
          Add a challenge
        </Link>
        .
      </PageHeader>
      <ChallengeList challenges={challenges} />
    </>
  );
}
