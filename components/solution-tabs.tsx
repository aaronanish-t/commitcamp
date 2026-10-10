"use client";

import { useState } from "react";

export type RenderedSolution = {
  key: string;
  language: string;
  author: string;
  html: string;
};

export function SolutionTabs({ solutions }: { solutions: RenderedSolution[] }) {
  const [active, setActive] = useState(0);
  const current = solutions[active];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-border bg-surface px-2 pt-2">
        {solutions.map((s, i) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`-mb-px rounded-t-md border px-3 py-1.5 text-sm ${
              i === active
                ? "border-border border-b-surface-sunk bg-surface-sunk text-text"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {s.language}
            <span className="ml-1.5 text-faint">· {s.author}</span>
          </button>
        ))}
      </div>
      {/* Highlighted on the server by Shiki from the solution file; it contains no markup of the author's. */}
      <div role="tabpanel" className="lg:max-h-[60vh] lg:overflow-y-auto" dangerouslySetInnerHTML={{ __html: current.html }} />
    </div>
  );
}
