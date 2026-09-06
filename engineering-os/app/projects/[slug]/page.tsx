import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, CircleDot, Download } from "lucide-react";
import { projects } from "@/lib/data/projects";
import { Tag } from "@/components/ui/Tag";
import { ProjectImage } from "@/components/ui/PlaceholderImage";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

/** Consistent section wrapper: mono eyebrow + heading + content. */
function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-zinc-800/60 pt-10">
      <p className="mb-2 flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-emerald-400">
        <span
          className="h-px w-6 bg-gradient-to-r from-emerald-400 to-emerald-400/0"
          aria-hidden="true"
        />
        {eyebrow}
      </p>
      <h2 className="text-gradient mb-5 text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const realLinks = project.links.filter((l) => !l.isPlaceholder && l.url !== "#");

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-28 pb-24">
      {/* ── Header ───────────────────────────────────────────── */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-emerald-400 transition-colors mb-8"
      >
        <ArrowLeft size={14} /> All projects
      </Link>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.domainTags.map((tag) => (
          <Tag key={tag} label={tag} variant="domain" />
        ))}
      </div>

      <h1 className="text-gradient mb-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        {project.title}
      </h1>

      <p className="text-lg text-zinc-400 leading-relaxed mb-5">{project.summary}</p>

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-10">
        {project.technologies.map((tech) => (
          <Tag key={tech} label={tech} variant="tech" />
        ))}
      </div>

      <ProjectImage asset={project.heroImage} className="mb-12 aspect-video w-full" />

      <div className="space-y-10">
        {/* ── Executive summary ──────────────────────────────── */}
        <Section eyebrow="Overview" title="Executive summary">
          <p className="text-zinc-300 leading-relaxed">{project.executiveSummary}</p>
        </Section>

        {/* ── Problem ────────────────────────────────────────── */}
        <Section eyebrow="Context" title="Problem & requirements">
          <p className="text-zinc-300 leading-relaxed">{project.problemAndRequirements}</p>
        </Section>

        {/* ── Architecture ───────────────────────────────────── */}
        <Section eyebrow="Design" title="System architecture">
          <p className="text-zinc-300 leading-relaxed">{project.systemArchitecture}</p>
          {project.architectureDiagrams.length > 0 && (
            <div className="mt-6 space-y-4">
              {project.architectureDiagrams.map((diagram) => (
                <ProjectImage
                  key={diagram.src + diagram.alt}
                  asset={diagram}
                  className="aspect-video w-full"
                />
              ))}
            </div>
          )}
        </Section>

        {/* ── Technical decisions ────────────────────────────── */}
        <Section eyebrow="Trade-offs" title="Technical decisions">
          <div className="space-y-4">
            {project.technicalDecisions.map((decision) => (
              <div
                key={decision.title}
                className="panel p-5"
              >
                <h3 className="text-sm font-semibold text-zinc-100 mb-4">
                  {decision.title}
                </h3>
                <dl className="space-y-3">
                  {[
                    { label: "Decision", value: decision.decision },
                    { label: "Alternatives", value: decision.alternativesConsidered },
                    { label: "Reasoning", value: decision.reasoning },
                  ].map(({ label, value }) => (
                    <div key={label} className="sm:flex sm:gap-4">
                      <dt className="w-28 shrink-0 font-mono text-xs text-emerald-400 mb-1 sm:mb-0 sm:pt-0.5">
                        {label}
                      </dt>
                      <dd className="text-sm text-zinc-400 leading-relaxed">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Validation ─────────────────────────────────────── */}
        <Section eyebrow="Evidence" title="Validation & results">
          <div className="panel divide-y divide-zinc-800">
            {project.validationResults.map((result) => (
              <div key={result.test} className="px-5 py-4 sm:flex sm:gap-5">
                <p className="w-56 shrink-0 font-mono text-xs text-emerald-400 mb-1 sm:mb-0 sm:pt-0.5">
                  {result.test}
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">{result.outcome}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Failures ───────────────────────────────────────── */}
        <Section eyebrow="Honesty" title="Failures & lessons">
          <div className="space-y-4">
            {project.failuresAndLessons.map((lesson) => (
              <div
                key={lesson.title}
                className="panel p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-sm font-semibold text-zinc-100">{lesson.title}</h3>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs ${
                      lesson.resolved
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                        : "border-amber-400/30 bg-amber-400/10 text-amber-400"
                    }`}
                  >
                    {lesson.resolved ? <Check size={11} /> : <CircleDot size={11} />}
                    {lesson.resolved ? "resolved" : "open"}
                  </span>
                </div>
                <dl className="space-y-3">
                  {[
                    { label: "What happened", value: lesson.whatHappened },
                    { label: "Root cause", value: lesson.rootCause },
                    {
                      label: lesson.resolved ? "Resolution" : "Next step",
                      value: lesson.resolutionOrNextStep,
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="sm:flex sm:gap-4">
                      <dt className="w-28 shrink-0 font-mono text-xs text-zinc-500 mb-1 sm:mb-0 sm:pt-0.5">
                        {label}
                      </dt>
                      <dd className="text-sm text-zinc-400 leading-relaxed">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Section>

        {/* ── What's next ────────────────────────────────────── */}
        <Section eyebrow="Roadmap" title="What's next">
          <p className="text-zinc-300 leading-relaxed">{project.whatsNext}</p>
        </Section>

        {/* ── Resources ──────────────────────────────────────── */}
        {(realLinks.length > 0 || project.technicalReport?.available) && (
          <Section eyebrow="Resources" title="Links & reports">
            <div className="flex flex-wrap gap-3">
              {realLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-emerald-400 hover:text-emerald-400 transition-colors"
                >
                  {link.label} <ArrowUpRight size={14} />
                </a>
              ))}
              {project.technicalReport?.available && (
                <a
                  href={project.technicalReport.pdfPath}
                  download
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
                >
                  Technical report <Download size={14} />
                </a>
              )}
            </div>
          </Section>
        )}
      </div>

      {/* ── Footer nav ───────────────────────────────────────── */}
      <div className="mt-16 border-t border-zinc-800/60 pt-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={14} /> Back to all projects
        </Link>
      </div>
    </article>
  );
}
