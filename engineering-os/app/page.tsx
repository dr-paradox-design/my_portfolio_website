import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import { profile } from "@/lib/data/profile";
import { projects } from "@/lib/data/projects";
import { portfolioStats } from "@/lib/data/portfolio";
import { ProjectCard } from "@/components/projects/ProjectCard";

export default function HomePage() {
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-14">
        {/* Blueprint grid, faded out toward the edges so it never boxes the text in */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 30% 40%, #000 20%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 30% 40%, #000 20%, transparent 75%)",
          }}
          aria-hidden="true"
        />

        {/* Ambient glow — gives the flat background some atmosphere */}
        <div
          className="animate-drift pointer-events-none absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-emerald-500/10 blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="animate-drift pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-teal-400/[0.07] blur-[120px]"
          style={{ animationDelay: "-7s" }} /* desync from the first orb */
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          {/* Availability pill */}
          <div className="animate-fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-3 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-blink absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-300">
              Open to {profile.graduationYear} roles
            </span>
          </div>

          {/* Eyebrow */}
          <p className="animate-fade-up delay-1 mb-6 font-mono text-xs uppercase tracking-widest text-zinc-500">
            <span className="text-emerald-400">{profile.institution}</span>
            <span className="mx-2 text-zinc-700">/</span>
            {profile.program}
            <span className="mx-2 text-zinc-700">/</span>
            {profile.graduationYear}
          </p>

          {/* Name */}
          <h1 className="animate-fade-up delay-2 text-gradient mb-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
            {profile.name}
          </h1>

          {/* Titles */}
          <div className="animate-fade-up delay-3 mb-8 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-lg font-medium text-emerald-400 sm:text-xl">
              {profile.title}
            </p>
            <span className="hidden h-4 w-px bg-zinc-700 sm:block" aria-hidden="true" />
            <p className="text-base text-zinc-500 sm:text-lg">
              {profile.secondaryTitle}
            </p>
          </div>

          {/* Tagline */}
          <p className="animate-fade-up delay-4 mb-10 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {profile.tagline}
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-5 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_-6px_rgba(52,211,153,0.5)] transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_32px_-4px_rgba(52,211,153,0.65)]"
            >
              View Projects
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            {profile.resumePath ? (
              <a
                href={profile.resumePath}
                download
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/40 px-5 py-2.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/40 hover:bg-zinc-800/60 hover:text-zinc-100"
              >
                Download Resume <Download size={15} />
              </a>
            ) : (
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/40 px-5 py-2.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/40 hover:bg-zinc-800/60 hover:text-zinc-100"
              >
                View Resume <FileText size={15} />
              </Link>
            )}
          </div>

          {/* Quick stats */}
          <dl className="animate-fade-up delay-6 mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {portfolioStats.map((stat) => (
              <div
                key={stat.label}
                className="panel flex flex-col-reverse px-4 py-4 transition-colors duration-300 hover:border-emerald-400/30"
              >
                {/* Reversed so the value reads first while the DOM keeps dt→dd order */}
                <dt className="mt-1 text-xs text-zinc-500">{stat.label}</dt>
                <dd className="font-mono text-lg font-semibold tabular-nums text-emerald-400">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
              Selected work
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
              Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="group hidden shrink-0 items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-emerald-400 sm:inline-flex"
          >
            View all
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
          >
            View all projects <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
