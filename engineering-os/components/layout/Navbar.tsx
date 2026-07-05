import Link from "next/link";
import { profile } from "@/lib/data/profile";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-900/80 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-wide text-zinc-100">
          {profile.name}
        </Link>
        <nav className="flex items-center gap-5 text-sm text-zinc-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <Link href="/projects" className="hover:text-emerald-400 transition-colors">
            Projects
          </Link>
          <a href={profile.resumePath} className="hover:text-emerald-400 transition-colors">
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}