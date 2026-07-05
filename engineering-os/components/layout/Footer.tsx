import Link from "next/link";
import { profile } from "@/lib/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-zinc-500 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <div className="flex items-center gap-4">
          <Link href="/projects" className="hover:text-emerald-400 transition-colors">
            Projects
          </Link>
          <a href={profile.social.github} className="hover:text-emerald-400 transition-colors">
            GitHub
          </a>
          <a href={profile.social.linkedin} className="hover:text-emerald-400 transition-colors">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}