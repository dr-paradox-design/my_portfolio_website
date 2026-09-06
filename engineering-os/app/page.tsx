import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import { profile } from "@/lib/data/profile";
import { portfolioStats, workItems } from "@/lib/data/portfolio";
import { CompactWorkCard } from "@/components/projects/CompactWorkCard";
import { SpotlightEffect } from "@/components/ui/SpotlightEffect";

/**
 * The home page leads with the strongest work rather than only the four
 * items that happen to have a written case study. Flagship and major tier
 * covers all four technical domains; everything else lives on /projects.
 */
const TIER_RANK = { flagship: 0, major: 1, supporting: 2, foundational: 3 } as const;

export default function HomePage() {
  const featured = workItems
    .filter((item) => item.tier === "flagship" || item.tier === "major")
    .sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier]);

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

          {/* Title — `profile.title` ("Electrical Engineer") is deliberately not
              shown here; the eyebrow one line above already says "B.Tech
              Electrical Engineering". It still drives the page metadata. */}
          <p className="animate-fade-up delay-3 mb-8 text-lg font-medium text-emerald-400 sm:text-xl">
            {profile.secondaryTitle}
          </p>

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

          {/* Quick stats — a hairline fact strip rather than boxes, so the hero
              stays a hero instead of turning into a dashboard. */}
          <dl className="animate-fade-up delay-6 mt-14 flex max-w-xl flex-wrap gap-x-10 gap-y-5 border-t border-zinc-800/70 pt-7 sm:gap-x-14">
            {portfolioStats.map((stat) => (
              /* Reversed so the value reads first while the DOM keeps dt→dd order */
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-xs text-zinc-500">{stat.label}</dt>
                <dd className="font-mono text-xl font-semibold tabular-nums text-emerald-400">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mb-10">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
            Selected work
          </p>
          {/* Not "Projects" — that just repeats the nav item one line above. */}
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            Key projects
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <CompactWorkCard key={item.title} item={item} />
          ))}
        </div>

        <Link
          href="/projects"
          className="group mt-6 inline-flex items-center gap-1.5 font-mono text-sm text-zinc-500 transition-colors hover:text-emerald-400"
        >
          and more&hellip;
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────
          The page used to end on the last project card, leaving no route
          to the contact page from the home page at all. */}
      <section className="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
        <div className="panel spotlight relative isolate flex flex-col items-start justify-between gap-6 overflow-hidden p-7 sm:flex-row sm:items-center sm:p-9">
          <SpotlightEffect />
          <div className="relative z-10">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
              Get in touch
            </h2>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-500">
              Semiconductor roles, research opportunities, embedded systems, and
              robotics.
            </p>
          </div>
          <div className="relative z-10 flex shrink-0 flex-wrap gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_-6px_rgba(52,211,153,0.5)] transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_32px_-4px_rgba(52,211,153,0.65)]"
            >
              Contact
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/40 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:border-emerald-400/40 hover:bg-zinc-800/60 hover:text-zinc-100"
            >
              Experience
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
