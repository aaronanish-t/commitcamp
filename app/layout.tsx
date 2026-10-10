import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { REPO_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "CommitCamp", template: "%s · CommitCamp" },
  description:
    "Find a beginner-friendly open-source issue, or practise with community coding challenges. Everything here is contributed by pull request.",
};

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/challenges", label: "Challenges" },
  { href: "/contributors", label: "Contributors" },
  { href: "/contribute", label: "Contribute" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span aria-hidden className="grid size-7 place-items-center rounded-md bg-accent text-sm text-accent-fg">
                ▲
              </span>
              CommitCamp
            </Link>
            <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-text">
                  {n.label}
                </Link>
              ))}
            </nav>
            <a href={REPO_URL} className="ml-auto text-sm text-muted hover:text-text">
              GitHub ↗
            </a>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-6 text-sm text-faint">
            <span>Built by its contributors. Code MIT, content CC BY 4.0.</span>
            <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} className="hover:text-text">
              Add something →
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
