"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DifficultyBadge, Tag } from "@/components/ui";
import { DIFFICULTIES, LANGUAGES, type Difficulty, type LanguageExt } from "@/lib/schema";

export type ChallengeSummary = {
  slug: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  tags: string[];
  languages: LanguageExt[];
};

const chip = (on: boolean) =>
  `rounded-full border px-3 py-1 text-sm ${
    on ? "border-accent bg-accent-soft text-accent" : "border-border bg-surface text-muted hover:text-text"
  }`;

export function ChallengeList({ challenges }: { challenges: ChallengeSummary[] }) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [missing, setMissing] = useState<LanguageExt | null>(null);

  const shown = useMemo(
    () =>
      challenges.filter(
        (c) => (!difficulty || c.difficulty === difficulty) && (!missing || !c.languages.includes(missing)),
      ),
    [challenges, difficulty, missing],
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-28 text-sm text-faint">Difficulty</span>
          <button className={chip(!difficulty)} onClick={() => setDifficulty(null)}>
            Any
          </button>
          {DIFFICULTIES.map((d) => (
            <button key={d} className={`${chip(difficulty === d)} capitalize`} onClick={() => setDifficulty(d)}>
              {d}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* The useful filter for a contributor: where is a solution still wanted? */}
          <span className="w-28 text-sm text-faint">Needs a solution in</span>
          <button className={chip(!missing)} onClick={() => setMissing(null)}>
            —
          </button>
          {(Object.keys(LANGUAGES) as LanguageExt[]).map((ext) => (
            <button key={ext} className={chip(missing === ext)} onClick={() => setMissing(ext)}>
              {LANGUAGES[ext].name}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-strong p-8 text-center text-muted">
          Nothing matches — every challenge here already has that covered.
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {shown.map((c) => (
            <li key={c.slug}>
              <Link href={`/challenges/${c.slug}`} className="block p-5 hover:bg-surface-sunk">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium">{c.title}</h2>
                  <DifficultyBadge difficulty={c.difficulty} />
                </div>
                <p className="mt-1 text-sm text-muted">{c.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {c.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                  <span className="ml-auto text-xs text-faint">
                    {c.languages.map((l) => LANGUAGES[l].name).join(" · ")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
