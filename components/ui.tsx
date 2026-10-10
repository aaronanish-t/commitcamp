import type { Difficulty } from "@/lib/schema";

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  easy: "bg-easy-soft text-easy",
  medium: "bg-medium-soft text-medium",
  hard: "bg-hard-soft text-hard",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${DIFFICULTY_STYLE[difficulty]}`}>
      {difficulty}
    </span>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-surface-sunk px-1.5 py-0.5 text-xs text-muted">{children}</span>
  );
}

export function Avatar({ login, size = 24 }: { login: string; size?: number }) {
  return (
    // GitHub serves avatars at a stable URL per login; no API call needed.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://github.com/${login}.png?size=${size * 2}`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className="rounded-full border border-border bg-surface-sunk"
    />
  );
}

export function UserLink({ login }: { login: string }) {
  return (
    <a href={`https://github.com/${login}`} className="inline-flex items-center gap-1.5 hover:text-text">
      <Avatar login={login} size={18} />
      {login}
    </a>
  );
}

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {children && <div className="mt-2 max-w-2xl text-muted">{children}</div>}
    </div>
  );
}

export const buttonPrimary =
  "inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover";
export const buttonSecondary =
  "inline-flex items-center justify-center rounded-lg border border-border-strong bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-sunk";
