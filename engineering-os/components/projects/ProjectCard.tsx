import Link from "next/link";
import type { Project } from "@/types/project";
import { Tag } from "@/components/ui/Tag";
import { SpotlightEffect } from "@/components/ui/SpotlightEffect";
import { ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  /** Position in the grid, used for the corner index label. */
  index?: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="panel spotlight brackets group relative isolate flex flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)]"
    >
      <SpotlightEffect />

      {/* Crop marks — technical-drawing cue, drawn in on hover */}
      <span className="bracket left-2.5 top-2.5 border-l border-t" aria-hidden="true" />
      <span className="bracket right-2.5 top-2.5 border-r border-t" aria-hidden="true" />
      <span className="bracket bottom-2.5 left-2.5 border-b border-l" aria-hidden="true" />
      <span className="bracket bottom-2.5 right-2.5 border-b border-r" aria-hidden="true" />

      {/* Content sits above the spotlight layer */}
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {project.domainTags.map((tag) => (
              <Tag key={tag} label={tag} variant="domain" />
            ))}
          </div>
          {index !== undefined && (
            <span className="shrink-0 font-mono text-xs tabular-nums text-zinc-700 transition-colors group-hover:text-emerald-400/70">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>

        <h3 className="mb-2 text-base font-semibold leading-snug tracking-tight text-zinc-100 transition-colors group-hover:text-emerald-400">
          {project.title}
        </h3>

        <p className="mb-5 text-sm leading-relaxed text-zinc-400">
          {project.summary}
        </p>

        {/* Push the footer down so cards in a row align */}
        <div className="mt-auto">
          <div className="mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <Tag key={tech} label={tech} variant="tech" />
            ))}
            {project.technologies.length > 4 && (
              <span className="font-mono text-xs text-zinc-600">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Hairline rule with a signal pulse that runs on hover */}
          <div className="relative mb-4 h-px overflow-hidden bg-zinc-800">
            <div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent opacity-0 group-hover:animate-trace group-hover:opacity-100"
              aria-hidden="true"
            />
          </div>

          <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
            View case study
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
