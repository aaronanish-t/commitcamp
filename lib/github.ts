export type Issue = {
  number: number;
  title: string;
  url: string;
  comments: number;
  createdAt: string;
};

export type IssueResult = { ok: true; issues: Issue[] } | { ok: false };

/**
 * Open issues carrying the project's starter label, newest first. Cached for
 * an hour; set GITHUB_TOKEN to lift the unauthenticated 60-requests/hour cap.
 * Any failure degrades to a link to the filtered issue list, never an error page.
 */
export async function starterIssues(repo: string, label: string, limit = 5): Promise<IssueResult> {
  const url =
    `https://api.github.com/repos/${repo}/issues` +
    `?labels=${encodeURIComponent(label)}&state=open&sort=created&direction=desc&per_page=${limit * 2}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const res = await fetch(url, { headers, next: { revalidate: 3600 } });
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as Array<{
      number: number;
      title: string;
      html_url: string;
      comments: number;
      created_at: string;
      pull_request?: unknown;
    }>;
    return {
      ok: true,
      issues: data
        // The issues endpoint returns pull requests too.
        .filter((i) => !i.pull_request)
        .slice(0, limit)
        .map((i) => ({ number: i.number, title: i.title, url: i.html_url, comments: i.comments, createdAt: i.created_at })),
    };
  } catch {
    return { ok: false };
  }
}

export function labelSearchUrl(repo: string, label: string) {
  return `https://github.com/${repo}/issues?q=${encodeURIComponent(`is:issue is:open label:"${label}"`)}`;
}
