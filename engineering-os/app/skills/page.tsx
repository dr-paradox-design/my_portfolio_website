import type { Metadata } from "next";
import { skills } from "@/lib/data/skills";
import { SkillTree } from "@/components/skills/SkillTree";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Skills",
  description:
    "Hardware, software, programming, and control-theory skills — with the projects each one was actually used in.",
  path: "/skills",
});

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-28 pb-24">
      <div className="mb-12">
        <SectionHeading
          eyebrow="Capabilities"
          title="Skills"
          description="Grouped by domain. Where a skill was used in real project work, the context is noted alongside it."
        />
      </div>
      <SkillTree categories={skills} />
    </div>
  );
}
