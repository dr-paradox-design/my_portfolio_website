import type { Metadata } from "next";
import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering case studies: AUV robotics, embedded systems, drones, and test equipment.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-28 pb-24">
      <div className="mb-12">
        <SectionHeading
          eyebrow="Case studies"
          title="Projects"
          description="Real engineering work — decisions, trade-offs, failures, and results."
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}