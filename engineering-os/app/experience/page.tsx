import type { Metadata } from "next";
import { Award, BookOpen, Building2, Users } from "lucide-react";
import {
  competitions,
  internships,
  workshops,
  memberships,
} from "@/lib/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tag } from "@/components/ui/Tag";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Internships, competition results, technical workshops, and professional memberships.",
};

/** Section wrapper with a mono eyebrow and icon, matching the case-study pages. */
function Block({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-6">
        <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
          <Icon size={13} aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="text-gradient text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-28 pb-24 sm:px-6">
      <div className="mb-14">
        <SectionHeading
          eyebrow="Background"
          title="Experience"
          description="Research internships, competition results, and technical training — kept separate from project work so each reads for what it actually is."
        />
      </div>

      <div className="space-y-16">
        {/* ── Internships ──────────────────────────────────────── */}
        <Block icon={Building2} eyebrow="Research" title="Internships">
          <div className="space-y-4">
            {internships.map((role) => (
              <div key={role.organisation} className="panel p-6">
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold tracking-tight text-zinc-100">
                    {role.organisation}
                  </h3>
                  <p className="font-mono text-xs text-zinc-500">{role.lab}</p>
                </div>

                <p className="mb-4 text-sm font-medium text-emerald-400">
                  {role.focus}
                </p>

                <ul className="mb-5 space-y-1.5">
                  {role.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2 text-sm leading-relaxed text-zinc-400"
                    >
                      <span className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true">
                        →
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  {role.technologies.map((tech) => (
                    <Tag key={tech} label={tech} variant="tech" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Block>

        {/* ── Competitions ─────────────────────────────────────── */}
        <Block icon={Award} eyebrow="Results" title="Competitions">
          <div className="panel divide-y divide-zinc-800">
            {competitions.map((competition) => (
              <div
                key={competition.name}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-zinc-100">
                      {competition.name}
                    </p>
                    <StatusBadge status={competition.status} />
                  </div>
                  {competition.related && (
                    <p className="mt-0.5 font-mono text-xs text-zinc-600">
                      {competition.related}
                    </p>
                  )}
                </div>
                <p className="shrink-0 font-mono text-xs text-emerald-400">
                  {competition.result}
                </p>
              </div>
            ))}
          </div>
        </Block>

        {/* ── Workshops ────────────────────────────────────────── */}
        <Block icon={BookOpen} eyebrow="Training" title="Workshops & schools">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {workshops.map((workshop) => (
              <div key={workshop.title} className="panel px-5 py-4">
                <p className="text-sm font-medium text-zinc-100">{workshop.title}</p>
                <p className="mt-0.5 font-mono text-xs text-zinc-500">
                  {workshop.host}
                </p>
              </div>
            ))}
          </div>
        </Block>

        {/* ── Memberships ──────────────────────────────────────── */}
        <Block icon={Users} eyebrow="Professional" title="Memberships">
          <div className="space-y-3">
            {memberships.map((membership) => (
              <div
                key={membership.organisation}
                className="panel flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-4"
              >
                <p className="text-sm font-medium text-zinc-100">
                  {membership.organisation}
                </p>
                <p className="font-mono text-xs text-emerald-400">
                  {membership.role}
                </p>
              </div>
            ))}
          </div>
        </Block>
      </div>
    </div>
  );
}
