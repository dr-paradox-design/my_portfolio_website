import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { workItems, workDomains, technicalThreads } from "@/lib/data/portfolio";
import { WorkItemCard } from "@/components/projects/WorkItemCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Engineering work across autonomous systems, digital design, analog and mixed-signal hardware, and embedded firmware.",
};

/** Tier ordering — flagship work leads each domain. */
const tierRank = { flagship: 0, major: 1, supporting: 2, foundational: 3 } as const;

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6">
      <div className="mb-14">
        <SectionHeading
          eyebrow="Engineering work"
          title="Projects"
          description="Grouped by technical domain rather than chronology. Projects with enough documented depth link through to a full case study covering decisions, validation, and failures."
        />
      </div>

      <div className="space-y-16">
        {workDomains.map((domain) => {
          const items = workItems
            .filter((item) => item.domain === domain)
            .sort((a, b) => tierRank[a.tier] - tierRank[b.tier]);

          if (items.length === 0) return null;

          return (
            <section key={domain}>
              <div className="mb-6 flex items-center gap-4">
                <h2 className="shrink-0 font-mono text-xs uppercase tracking-widest text-emerald-400">
                  {domain}
                </h2>
                <span className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                <span className="shrink-0 font-mono text-xs tabular-nums text-zinc-700">
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <WorkItemCard key={item.title} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── How the work connects ───────────────────────────────── */}
      <section className="mt-24 border-t border-zinc-800/60 pt-14">
        <div className="mb-8">
          <SectionHeading
            eyebrow="Continuity"
            title="How this work connects"
            description="The same problems recur across projects at increasing depth. These are the threads that run through the domains above."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {technicalThreads.map((thread) => (
            <div key={thread.title} className="panel p-5">
              <h3 className="mb-1.5 text-sm font-semibold tracking-tight text-zinc-100">
                {thread.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-zinc-500">
                {thread.insight}
              </p>
              <ol className="flex flex-wrap items-center gap-y-2">
                {thread.chain.map((step, i) => (
                  <li key={step} className="flex items-center">
                    <span className="font-mono text-xs text-emerald-400/90">
                      {step}
                    </span>
                    {i < thread.chain.length - 1 && (
                      <ChevronRight
                        size={13}
                        className="mx-1.5 shrink-0 text-zinc-700"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
