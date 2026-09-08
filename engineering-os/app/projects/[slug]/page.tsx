import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, CircleDot, Download } from "lucide-react";
import { getProjectPage, routedSlugs } from "@/lib/data/projectPage";
import { Tag } from "@/components/ui/Tag";
import { STATUS_LABELS } from "@/components/ui/StatusBadge";
import { ProjectImage } from "@/components/ui/PlaceholderImage";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectVideo } from "@/components/projects/ProjectVideo";
import { pageMetadata } from "@/lib/site";

/**
 * A project's page.
 *
 * Not every project here is a case study, and the page is built so that
 * this is a fact about the content rather than a defect in the layout. The
 * sections are *constructed into a list* and the list is filtered — a
 * section object is never created unless its content exists — so there is
 * no code path that can render an empty heading, and no need for a
 * "coming soon" state to paper over one. A project with seven photographs
 * and no prose gets a page with a spec strip and seven photographs, which
 * is a complete thing rather than a stub of a bigger thing.
 *
 * Ranks leave gaps so a section can be slipped in later without renumbering.
 * Media sits at 25 (video) and 30 (photographs): on a thin page it floats to
 * the top and leads; on a rich one it lands after the context prose and
 * before the design detail. One ordering, two correct layouts, no branching.
 */

/** Unlisted slugs 404 structurally rather than being rendered on demand. */
export const dynamicParams = false;

export function generateStaticParams() {
  return routedSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getProjectPage(slug);
  if (!page) return {};

  /* `pageMetadata` is what makes a shared project link preview as *this*
     project. Returning a bare title/description here would leave og:title
     inherited from the root layout — see lib/site.ts. */
  return pageMetadata({
    title: page.detail?.title ?? page.item.title,
    description: page.detail?.summary ?? page.item.summary,
    path: `/projects/${slug}`,
    // This segment has its own `opengraph-image.tsx`, which Next only
    // applies when the segment's metadata declares no `images` of its own.
    image: null,
  });
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

function Prose({ children }: { children: string }) {
  return <p className="leading-relaxed text-zinc-300">{children}</p>;
}

const has = (arr: unknown[] | undefined) => Array.isArray(arr) && arr.length > 0;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getProjectPage(slug);
  if (!page) notFound();

  const { item, detail } = page;
  const title = detail?.title ?? item.title;
  const summary = detail?.summary ?? item.summary;
  const technologies = detail?.technologies ?? item.technologies;
  const realLinks = (detail?.links ?? []).filter(
    (l) => !l.isPlaceholder && l.url !== "#",
  );

  /* `body` is evaluated eagerly, so `add` receives either a node or a
     falsy value. That is the whole mechanism: a section that would have
     been empty is never pushed, so it cannot render a bare heading. */
  const sections: { rank: number; eyebrow: string; title: string; body: React.ReactNode }[] =
    [];
  const add = (
    rank: number,
    eyebrow: string,
    heading: string,
    body: React.ReactNode | false | undefined,
  ) => {
    if (body) sections.push({ rank, eyebrow, title: heading, body });
  };

  add(
    10,
    "Overview",
    "Executive summary",
    detail?.executiveSummary && <Prose>{detail.executiveSummary}</Prose>,
  );

  add(
    20,
    "Context",
    "Problem & requirements",
    detail?.problemAndRequirements && <Prose>{detail.problemAndRequirements}</Prose>,
  );

  /* Ahead of the photographs at 30, and that ordering is the argument: the
     stills tell the build story, the video is the result. A reader who
     watches one thing should watch the thing working. */
  add(
    25,
    "Demonstration",
    "Video",
    item.video && (
      <div className="max-w-xl">
        <ProjectVideo video={item.video} />
      </div>
    ),
  );

  add(
    30,
    "Build log",
    "Photographs",
    has(item.images) && (
      <>
        {/* Capped narrower than the article: see ProjectGallery — the
            source files top out at 570px and are never upscaled. */}
        <div className="max-w-xl">
          <ProjectGallery images={item.images!} />
        </div>
      </>
    ),
  );

  add(
    40,
    "Design",
    "System architecture",
    detail?.systemArchitecture && (
      <>
        <Prose>{detail.systemArchitecture}</Prose>
        {has(detail.architectureDiagrams) && (
          <div className="mt-6 space-y-4">
            {detail.architectureDiagrams!.map((diagram) => (
              <ProjectImage
                key={diagram.src + diagram.alt}
                asset={diagram}
                className="aspect-video w-full"
              />
            ))}
          </div>
        )}
      </>
    ),
  );

  add(
    50,
    "Trade-offs",
    "Technical decisions",
    has(detail?.technicalDecisions) && (
      <div className="space-y-4">
        {detail!.technicalDecisions!.map((decision) => (
          <div key={decision.title} className="panel p-5">
            <h3 className="mb-4 text-sm font-semibold text-zinc-100">{decision.title}</h3>
            <dl className="space-y-3">
              {[
                { label: "Decision", value: decision.decision },
                { label: "Alternatives", value: decision.alternativesConsidered },
                { label: "Reasoning", value: decision.reasoning },
              ].map(({ label, value }) => (
                <div key={label} className="sm:flex sm:gap-4">
                  <dt className="mb-1 w-28 shrink-0 font-mono text-xs text-emerald-400 sm:mb-0 sm:pt-0.5">
                    {label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-zinc-400">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    ),
  );

  add(
    60,
    "Evidence",
    "Validation & results",
    has(detail?.validationResults) && (
      <div className="panel divide-y divide-zinc-800">
        {detail!.validationResults!.map((result) => (
          <div key={result.test} className="px-5 py-4 sm:flex sm:gap-5">
            <p className="mb-1 w-56 shrink-0 font-mono text-xs text-emerald-400 sm:mb-0 sm:pt-0.5">
              {result.test}
            </p>
            <p className="text-sm leading-relaxed text-zinc-300">{result.outcome}</p>
          </div>
        ))}
      </div>
    ),
  );

  add(
    70,
    "Honesty",
    "Failures & lessons",
    has(detail?.failuresAndLessons) && (
      <div className="space-y-4">
        {detail!.failuresAndLessons!.map((lesson) => (
          <div key={lesson.title} className="panel p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
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
                  <dt className="mb-1 w-28 shrink-0 font-mono text-xs text-zinc-500 sm:mb-0 sm:pt-0.5">
                    {label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-zinc-400">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    ),
  );

  add(80, "Roadmap", "What's next", detail?.whatsNext && <Prose>{detail.whatsNext}</Prose>);

  add(
    90,
    "Resources",
    "Links & reports",
    (realLinks.length > 0 || detail?.technicalReport?.available) && (
      <div className="flex flex-wrap gap-3">
        {realLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-emerald-400 hover:text-emerald-400"
          >
            {link.label} <ArrowUpRight size={14} />
          </a>
        ))}
        {detail?.technicalReport?.available && (
          <a
            href={detail.technicalReport.pdfPath}
            download
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Technical report <Download size={14} />
          </a>
        )}
      </div>
    ),
  );

  sections.sort((a, b) => a.rank - b.rank);

  return (
    <article className="mx-auto max-w-3xl px-4 pt-28 pb-24 sm:px-6">
      {/* ── Header ───────────────────────────────────────────── */}
      <Link
        href="/projects"
        transitionTypes={["nav-back"]}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-emerald-400"
      >
        <ArrowLeft size={14} /> All projects
      </Link>

      {has(detail?.domainTags) && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {detail!.domainTags!.map((tag) => (
            <Tag key={tag} label={tag} variant="domain" />
          ))}
        </div>
      )}

      {/* Paired with the card title on /projects and on the home page — same
          `name`, so the browser morphs one into the other instead of
          crossfading two unrelated headings. See WorkItemCard. */}
      <ViewTransition name={`project-title-${slug}`} share="project-title">
        <h1 className="text-gradient mb-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {title}
        </h1>
      </ViewTransition>

      <p className="mb-6 text-lg leading-relaxed text-zinc-400">{summary}</p>

      {/* Spec strip. Built from fields every work item already has, so it is
          never invented. On a page with no prose yet this is what makes the
          header read as a deliberate index card rather than a page that
          failed to load.

          Same discipline as the sections below: the cells are a filtered
          list, so a label can never appear above an empty value. Note that
          status is the *word* here rather than the card's badge — the badge
          deliberately renders nothing for completed work, which is right on
          a card and would be a labelled blank here. */}
      <dl className="mb-6 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-zinc-800/60 py-4">
        {[
          { label: "Status", value: STATUS_LABELS[item.status] },
          { label: "Domain", value: item.domain },
          { label: "Context", value: item.context },
        ]
          .filter((cell) => cell.value)
          .map((cell) => (
            <div key={cell.label}>
              <dt className="mb-1 font-mono text-[11px] uppercase tracking-widest text-zinc-600">
                {cell.label}
              </dt>
              <dd className="text-sm text-zinc-300">{cell.value}</dd>
            </div>
          ))}
      </dl>

      <div className="mb-12 flex flex-wrap gap-x-3 gap-y-1.5">
        {technologies.map((tech) => (
          <Tag key={tech} label={tech} variant="tech" />
        ))}
      </div>

      <div className="space-y-10">
        {sections.map((section) => (
          <Section key={section.title} eyebrow={section.eyebrow} title={section.title}>
            {section.body}
          </Section>
        ))}
      </div>

      {/* ── Footer nav ───────────────────────────────────────── */}
      <div className="mt-16 border-t border-zinc-800/60 pt-8">
        <Link
          href="/projects"
          transitionTypes={["nav-back"]}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
        >
          <ArrowLeft size={14} /> Back to all projects
        </Link>
      </div>
    </article>
  );
}
