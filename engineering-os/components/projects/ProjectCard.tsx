import Link from "next/link";
import type { Project } from "@/types/project";
import { Tag } from "@/components/ui/Tag";
import { ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all duration-200"
    >
      {/* Domain tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.domainTags.map((tag) => (
          <Tag key={tag} label={tag} variant="domain" />
        ))}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-zinc-100 tracking-tight leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
        {project.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-zinc-400 leading-relaxed mb-4">
        {project.summary}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.slice(0, 4).map((tech) => (
          <Tag key={tech} label={tech} variant="tech" />
        ))}
        {project.technologies.length > 4 && (
          <span className="font-mono text-xs text-zinc-600">
            +{project.technologies.length - 4} more
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1 text-sm font-medium text-emerald-400 group-hover:gap-2 transition-all">
        View case study <ArrowRight size={14} />
      </div>
    </Link>
  );
}
