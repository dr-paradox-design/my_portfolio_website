import Link from "next/link";
import { profile } from "@/lib/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} {profile.name} · NIT Rourkela
        </p>
        <div className="flex items-center gap-4">
          <a href={profile.social.github} target="_blank" rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-emerald-400 transition-colors">
            GitHub
          </a>
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-emerald-400 transition-colors">
            LinkedIn
          </a>
          <a href={`mailto:${profile.social.email}`}
            className="text-sm text-zinc-500 hover:text-emerald-400 transition-colors">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
