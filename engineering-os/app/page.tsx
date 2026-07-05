import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { profile } from "@/lib/data/profile";
import { projects } from "@/lib/data/projects-full";
import { ProjectCard } from "@/components/projects/ProjectCard";

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: profile.tagline,
};

export default function HomePage() {
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-14">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24">
          {/* Eyebrow */}
          <p className="font-mono text-xs text-emerald-400 uppercase tracking-widest mb-6">
            {profile.institution} · {profile.program} · {profile.graduationYear}
          </p>

          {/* Name */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-zinc-100 mb-3">
            {profile.name}
          </h1>

          {/* Titles */}
          <p className="text-lg sm:text-xl font-medium text-emerald-400 mb-1">
            {profile.title}
          </p>
          <p className="text-base sm:text-lg text-zinc-500 mb-8">
            {profile.secondaryTitle}
          </p>

          {/* Tagline */}
          <p className="max-w-xl text-zinc-400 leading-relaxed text-base sm:text-lg mb-10">
            {profile.tagline}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
            >
              View Projects <ArrowRight size={15} />
            </Link>
            <a
              href={profile.resumePath}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              Download Resume <Download size={15} />
            </a>
          </div>

          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-4">
                <p className="font-mono text-lg font-semibold text-emerald-400">
                  {stat.value}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-xs text-emerald-400 uppercase tracking-widest mb-2">
              Selected work
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
              Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            View all projects <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
