import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, FileText } from "lucide-react";
import { profile } from "@/lib/data/profile";
import {
  competitions,
  internships,
  portfolioStats,
  workDomains,
  workItems,
  type WorkDomain,
} from "@/lib/data/portfolio";
import { CompactWorkCard } from "@/components/projects/CompactWorkCard";
import { SpotlightEffect } from "@/components/ui/SpotlightEffect";
import { AirframeFigure, PackageFigure } from "@/components/ui/HeroFigures";

/**
 * The home page leads with the strongest work rather than only the items
 * that happen to have a written case study. Ongoing work sorts first — it
 * is the most current signal about what he is actually doing right now —
 * then flagship before major. Everything else lives on /projects.
 *
 * The grid is derived, never a hand-written list of six. The one override is
 * `HOME_EXCLUDED_SLUGS` below, which is deliberately an exception with a
 * stated expiry rather than a general-purpose ordering knob.
 *
 * ── Why the hero is three columns of instrument panels ────────────────
 * Identity, then two drawings, then a rail of small facts. The point of the
 * shape is that a visitor gets the whole profile without scrolling: who he
 * is, what he builds, and the three externally-verifiable things (research,
 * results, source) that a recruiter checks first. Nothing in it moves —
 * there is no sweep, no flow and no pulse anywhere on this page. Motion was
 * tried and cut: at this density it competes with the work.
 */
const TIER_RANK = { flagship: 0, major: 1, supporting: 2, foundational: 3 } as const;

/** Two full rows at three columns. The rest is one click away. */
const HOME_LIMIT = 6;

/** The rail shows the head of `competitions`, which is kept strongest-first. */
const RAIL_RESULTS = 3;

/**
 * Held back from the home grid despite ranking into it.
 *
 * This is a presentation decision and it lives here rather than in
 * `portfolio.ts`, which describes the work. Demoting an item's `tier` would
 * have produced the same six cards, but `tier` is a claim about how the work
 * ranks in the profile — it also drives the /projects ordering and the
 * "Flagship" badge — so editing it to fix a layout would have been a lie told
 * to move a card.
 *
 * `embedded-sar-adc` is a flagship with no photographs yet, so its card is
 * the one placeholder box in a grid of real ones. That is the whole reason,
 * and it means the fix is not permanent: **delete this entry the moment the
 * SAR ADC board is photographed.** It stays a flagship on /projects
 * throughout.
 */
const HOME_EXCLUDED_SLUGS = new Set(["embedded-sar-adc"]);

/* A renamed slug would silently stop excluding anything, which is the same
   class of quiet drift the derived stats were introduced to kill. */
for (const slug of HOME_EXCLUDED_SLUGS) {
  if (!workItems.some((item) => item.slug === slug)) {
    throw new Error(
      `app/page.tsx excludes "${slug}" from the home grid, but no work item ` +
        `in portfolio.ts carries that slug, so the exclusion does nothing.`,
    );
  }
}

/* First word / everything after it, for the two-ink hero title. */
const [givenName, ...restOfName] = profile.name.split(" ");
const familyName = restOfName.join(" ");

/** Initials, for the designator block. Derived, so it cannot go stale. */
const initials = profile.name
  .split(" ")
  .map((word) => word[0])
  .join("");

/* Short forms of the four domains, for the chip row under the name. The full
   names are set on /projects, which has the column width for them; on one
   line under a 60px headline they have to be abbreviated. The guard below is
   what stops a fifth domain being added to portfolio.ts and silently not
   appearing here. */
const DOMAIN_CHIP: Record<WorkDomain, string> = {
  "Digital Design & Computer Architecture": "Semiconductors",
  "Analog, Mixed-Signal & Instrumentation": "Mixed-signal",
  "Embedded Systems & Firmware": "Embedded systems",
  "Autonomous Systems & Robotics": "Autonomous systems",
};

/**
 * The technologies printed under a drawing.
 *
 * Taken from each domain's *lead* item rather than by frequency across the
 * domain. Frequency surfaces whatever tool happens to recur across small
 * projects — "Python", "ESP32" — where this surfaces the flagship's own
 * stack, which is what the panel is actually about. `perDomain` keeps both
 * domains in a panel represented instead of letting the first one fill it.
 */
function panelTechs(domains: WorkDomain[], perDomain: number) {
  const out: string[] = [];

  for (const domain of domains) {
    const [lead] = workItems
      .filter((item) => item.domain === domain)
      .sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier]);

    if (!lead) {
      throw new Error(
        `app/page.tsx labels a hero panel with "${domain}", but no work item ` +
          `in portfolio.ts carries that domain.`,
      );
    }

    let taken = 0;
    for (const tech of lead.technologies) {
      if (taken >= perDomain) break;
      if (out.includes(tech)) continue;
      out.push(tech);
      taken += 1;
    }
  }

  return out;
}

/* The two drawings, and the domains each one stands for. Between them they
   have to cover `workDomains` exactly — a fifth domain with no panel is a
   build error rather than a silently missing label. */
const PANELS = [
  {
    label: "Semiconductor / IC design",
    fig: "FIG. 01",
    domains: [
      "Digital Design & Computer Architecture",
      "Analog, Mixed-Signal & Instrumentation",
    ] as WorkDomain[],
    Figure: PackageFigure,
  },
  {
    label: "Embedded & robotics",
    fig: "FIG. 02",
    domains: [
      "Embedded Systems & Firmware",
      "Autonomous Systems & Robotics",
    ] as WorkDomain[],
    Figure: AirframeFigure,
  },
].map((panel) => ({ ...panel, techs: panelTechs(panel.domains, 2) }));

const covered = PANELS.flatMap((panel) => panel.domains);
if (
  covered.length !== workDomains.length ||
  workDomains.some((domain) => !covered.includes(domain))
) {
  throw new Error(
    "app/page.tsx splits `workDomains` across two hero panels, and the lists " +
      "no longer match. Add the new domain to a panel's `domains`.",
  );
}

/** `[ LABEL ]` over a hairline, with a drawing number on the right. */
function PanelHead({ label, meta }: { label: string; meta: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-board-800 px-3.5 py-2.5">
      <p className="field text-copper-400">
        <span className="text-board-700">[ </span>
        {label}
        <span className="text-board-700"> ]</span>
      </p>
      <p className="field shrink-0 text-board-700">{meta}</p>
    </div>
  );
}

export default function HomePage() {
  const featured = workItems
    .filter((item) => item.tier === "flagship" || item.tier === "major")
    .filter((item) => !item.slug || !HOME_EXCLUDED_SLUGS.has(item.slug))
    .sort((a, b) => {
      const ongoing = Number(b.status === "ongoing") - Number(a.status === "ongoing");
      return ongoing !== 0 ? ongoing : TIER_RANK[a.tier] - TIER_RANK[b.tier];
    })
    .slice(0, HOME_LIMIT);

  const [research] = internships;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Ruled field, at the same pitch as the rest of the site's technical
            furniture. No mask — the grid stops where the section stops, the
            way a sheet's ruling does, instead of dissolving into a vignette.
            The two blurred colour orbs that used to float behind this are
            gone: a drawing sheet is lit flat, and a simulated light source
            behind it was the single strongest signal that this page was
            generated rather than designed. */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-board-800) 1px, transparent 1px), linear-gradient(90deg, var(--color-board-800) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
          aria-hidden="true"
        />

        {/* Spine label, the way a bound drawing set is labelled down its edge.
            It carries `profile.title` — "Electrical Engineer" — which is the
            one real piece of identity the hero does not already print, so the
            spine adds information rather than repeating the headline.

            Only from `xl`. Below that the container's side gutters collapse
            toward zero and the label would sit on top of the headline. Hidden
            from assistive tech because a screen reader already gets the same
            fact from the page title. */}
        <p
          className="field pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-board-700 xl:block"
          style={{ writingMode: "vertical-rl" }}
          aria-hidden="true"
        >
          {profile.title}
        </p>

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.06fr_1fr] xl:grid-cols-[1.02fr_1fr_0.56fr] xl:gap-6">
            {/* ── Identity ─────────────────────────────────── */}
            <div>
              {/* Designator, then the spec line. The block is his initials —
                  the reference this borrows its shape from carries an invented
                  part number there, and AGENTS.md rules that out. */}
              <div className="animate-fade-up mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="field border border-copper-600/60 px-2 py-1 text-copper-400">
                  {initials}
                </span>
                <p className="field">
                  <span className="text-copper-400">{profile.institution}</span>
                  <span className="mx-2 text-board-700">·</span>
                  {profile.program}
                  <span className="mx-2 text-board-700">·</span>
                  {profile.graduationYear}
                </p>
              </div>

              {/* Name. Set as a drawing title: uppercase, bold, tight leading,
                  and split across two inks — given name in silkscreen white,
                  family name in copper. The white-to-grey gradient that used to
                  sit here read as a template default, and a single-weight
                  sentence-case line read as body copy that happened to be
                  large.

                  The split is derived from the name itself rather than
                  hard-coded into two strings, so `profile.name` stays the one
                  place the name is written. A single-word name degrades to
                  just the white half. */}
              <h1 className="animate-fade-up delay-1 mb-4 text-4xl font-bold uppercase leading-[0.95] tracking-[-0.02em] text-board-50 sm:text-5xl lg:text-[3.4rem] xl:text-[3.75rem]">
                {givenName}
                {familyName && (
                  <>
                    <br />
                    <span className="text-copper-400">{familyName}</span>
                  </>
                )}
              </h1>

              {/* `profile.title` ("Electrical Engineer") is deliberately not
                  shown here; the spec line above already says "B.Tech
                  Electrical Engineering". It still drives the page metadata. */}
              <p className="animate-fade-up delay-2 mb-5 flex items-center gap-3 text-lg font-medium text-copper-400 sm:text-xl">
                <span className="h-px w-8 shrink-0 bg-copper-600" aria-hidden="true" />
                {profile.secondaryTitle}
              </p>

              {/* The four domains on one rule. It restates what the panel
                  headers say, and that is the point: below `lg` the panels
                  land underneath this block, so this row is the first thing
                  on the page that says what he works on. Derived from
                  `workDomains`, so the order matches. */}
              <p className="animate-fade-up delay-2 field mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-y border-board-800 py-3 text-board-400">
                {workDomains.map((domain, i) => (
                  <span key={domain} className="flex items-center gap-2.5">
                    {i > 0 && (
                      <span className="h-[3px] w-[3px] bg-copper-600" aria-hidden="true" />
                    )}
                    {DOMAIN_CHIP[domain]}
                  </span>
                ))}
              </p>

              <p className="animate-fade-up delay-3 mb-7 max-w-xl text-base leading-relaxed text-board-400">
                {profile.tagline}
              </p>

              {/* CTAs — square, and the primary is a copper fill rather than a
                  glowing pill. The glow was the same simulated light source as
                  the orbs. */}
              <div className="animate-fade-up delay-4 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 bg-copper-400 px-5 py-2.5 text-sm font-semibold text-board-950 transition-colors duration-200 hover:bg-copper-300"
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
                    className="inline-flex items-center gap-2 border border-board-700 px-5 py-2.5 text-sm font-semibold text-board-300 transition-colors duration-200 hover:border-copper-600 hover:text-board-50"
                  >
                    Download Resume <Download size={15} />
                  </a>
                ) : (
                  <Link
                    href="/resume"
                    className="inline-flex items-center gap-2 border border-board-700 px-5 py-2.5 text-sm font-semibold text-board-300 transition-colors duration-200 hover:border-copper-600 hover:text-board-50"
                  >
                    View Resume <FileText size={15} />
                  </Link>
                )}
              </div>

              {/* Quick stats — a spec table rather than boxes, so the hero
                  stays a hero instead of turning into a dashboard. Each value
                  sits under its own field label, the way a parameter table
                  reads. Two columns before `sm` so a phone never leaves a
                  ragged cell on the end of a row. */}
              <dl className="animate-fade-up delay-5 mt-10 grid grid-cols-2 gap-px border border-board-800 bg-board-800 sm:grid-cols-4">
                {portfolioStats.map((stat) => (
                  /* Reversed so the value reads first while the DOM keeps
                     dt→dd order */
                  <div
                    key={stat.label}
                    className="flex flex-col-reverse bg-board-950 px-3 py-3"
                  >
                    <dt className="field mt-1.5">{stat.label}</dt>
                    <dd className="font-mono text-xl font-semibold tabular-nums text-copper-400">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* ── Drawings ─────────────────────────────────── */}
            {/* Below `lg` these land under the identity block, where they
                still earn their place — they are the only thing on the page
                that says "hardware" without words. Not hidden on mobile:
                inline SVG with no image request, so the cost is near zero. */}
            <div className="animate-fade-up delay-5 flex flex-col gap-5 xl:gap-6">
              {PANELS.map(({ label, fig, techs, Figure }) => (
                <figure
                  key={fig}
                  className="m-0 flex flex-1 flex-col border border-board-800 bg-board-950/70"
                >
                  <PanelHead label={label} meta={fig} />
                  <div className="flex flex-1 items-center px-3 py-4">
                    <Figure />
                  </div>
                  {/* Vias separate the tags — several technology names contain
                      spaces ("6-layer PCB"), so plain gaps blur the word
                      boundaries. */}
                  <figcaption className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-board-800 px-3.5 py-2.5 font-mono text-[11px] text-copper-400">
                    {techs.map((tech, i) => (
                      <span key={tech} className="inline-flex items-center gap-2.5">
                        {i > 0 && (
                          <span className="h-[3px] w-[3px] bg-copper-600" aria-hidden="true" />
                        )}
                        {tech}
                      </span>
                    ))}
                    <span className="field ml-auto text-board-700">Illustrative</span>
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* ── Rail ─────────────────────────────────────── */}
            {/* The three things a reader checks that are not projects:
                where he has done research, what the work has actually placed
                at, and where the source lives. One panel with ruled sections
                rather than three panels, so the column reads as a single
                instrument strip.

                At `lg` there is no room for a third column, so it spans the
                full width under the other two and lays its sections out in a
                row instead of a stack. */}
            <div className="animate-fade-up delay-6 divide-y divide-board-800 border border-board-800 bg-board-950/70 lg:col-span-2 lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0 xl:col-span-1 xl:block xl:divide-x-0 xl:divide-y">
              {research && (
                <section className="px-4 py-4">
                  <p className="field mb-3 text-copper-400">
                    <span className="text-board-700">[ </span>Research
                    <span className="text-board-700"> ]</span>
                  </p>
                  <p className="text-sm font-semibold leading-snug text-board-50">
                    {research.organisation}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-board-500">
                    {research.lab}
                  </p>
                  <p className="mt-2.5 border-t border-board-800 pt-2.5 font-mono text-[11px] leading-relaxed text-board-400">
                    {research.focus}
                  </p>
                </section>
              )}

              <section className="px-4 py-4">
                <p className="field mb-3 text-copper-400">
                  <span className="text-board-700">[ </span>Results
                  <span className="text-board-700"> ]</span>
                </p>
                <dl className="space-y-2.5">
                  {competitions.slice(0, RAIL_RESULTS).map((event) => (
                    <div key={event.name}>
                      <dt className="text-xs font-semibold leading-snug text-board-300">
                        {event.name}
                      </dt>
                      <dd className="mt-0.5 font-mono text-[11px] leading-snug text-copper-400">
                        {event.result}
                      </dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href="/experience"
                  className="field group mt-3 inline-flex items-center gap-1.5 border-t border-board-800 pt-2.5 transition-colors hover:text-copper-400"
                >
                  All {competitions.length}
                  <ArrowRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </section>

              <section className="px-4 py-4">
                <p className="field mb-3 text-copper-400">
                  <span className="text-board-700">[ </span>Elsewhere
                  <span className="text-board-700"> ]</span>
                </p>
                <ul className="space-y-1">
                  {[
                    { label: "GitHub", href: profile.social.github },
                    { label: "LinkedIn", href: profile.social.linkedin },
                    { label: "Email", href: `mailto:${profile.social.email}` },
                  ]
                    .filter(
                      (link): link is { label: string; href: string } =>
                        typeof link.href === "string",
                    )
                    .map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          /* `mailto:` is a navigation, not a cross-origin
                             document load — `target="_blank"` on it opens an
                             empty tab beside the mail client on most desktop
                             setups. */
                          {...(link.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="group flex items-center justify-between gap-2 py-1 font-mono text-[11px] text-board-400 transition-colors hover:text-copper-400"
                        >
                          {link.label}
                          <ArrowUpRight
                            size={12}
                            className="shrink-0 text-board-700 transition-colors group-hover:text-copper-400"
                            aria-hidden="true"
                          />
                        </a>
                      </li>
                    ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6">
        {/* Header row, ruled like a table head: what this is on the left,
            where the rest of it lives on the right. The "and more…" link that
            used to sit under the grid is this link — two anchors to /projects
            a screen apart was one more than the section needs. */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-board-800 pb-4">
          <div>
            <p className="marker field mb-2 text-copper-400">Selected work</p>
            {/* Not "Projects" — that just repeats the nav item one line above. */}
            <h2 className="text-2xl font-semibold tracking-tight text-board-50 sm:text-3xl">
              Key projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="field group inline-flex items-center gap-2 pb-1 transition-colors hover:text-copper-400"
          >
            All {workItems.length} projects
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* `gap-px` over a board-800 background draws the dividing rules for
            free, so the grid reads as a ruled table of cells rather than as
            six free-floating cards. */}
        <div className="grid grid-cols-1 gap-px border border-board-800 bg-board-800 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <CompactWorkCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────
          The whole panel is the link, so there is no button to aim at.
          That also means no nested anchors — the Experience button that
          used to sit here could not survive inside a link, and the navbar
          already covers it. */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Link
          href="/contact"
          className="panel panel-link probe marks group relative isolate flex items-center justify-between gap-5 overflow-hidden px-6 py-5"
        >
          <SpotlightEffect />
          <span className="mark left-2 top-2 border-l border-t" aria-hidden="true" />
          <span className="mark right-2 top-2 border-r border-t" aria-hidden="true" />
          <span className="mark bottom-2 left-2 border-b border-l" aria-hidden="true" />
          <span className="mark bottom-2 right-2 border-b border-r" aria-hidden="true" />
          <div className="relative z-10 min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-board-50 transition-colors group-hover:text-copper-400">
              Get in touch
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-board-500">
              Semiconductor roles, research opportunities, embedded systems, and
              robotics.
            </p>
          </div>
          <ArrowRight
            size={18}
            className="relative z-10 shrink-0 text-board-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-copper-400"
            aria-hidden="true"
          />
        </Link>
      </section>
    </>
  );
}
