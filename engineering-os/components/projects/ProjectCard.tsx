import type { Project } from "@/lib/data/projects-full";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-700">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            {project.domainTags[0] ?? "Project"}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-zinc-100">{project.title}</h3>
        </div>
        <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] text-zinc-400">
          {project.featured ? "Featured" : "Case study"}
        </span>
      </div>
      <p className="text-sm leading-6 text-zinc-400">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.slice(0, 4).map((tech) => (
          <span key={tech} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
            {tech}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs text-zinc-500">{project.heroImage.alt}</p>
    </article>
  );
}