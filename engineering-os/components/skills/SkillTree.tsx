import type { Skill, SkillCategory } from "@/lib/data/skills";

/**
 * Renders one skill node and, recursively, its children.
 * Leaves read as mono entries; groups read as plain-text labels.
 */
function SkillNode({ skill }: { skill: Skill }) {
  const hasChildren = Boolean(skill.children?.length);

  return (
    <li className="relative pl-5">
      {/* tree connector */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-[0.6rem] h-px w-3 bg-zinc-800"
      />
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span
          className={
            hasChildren
              ? "text-sm font-medium text-zinc-200"
              : "font-mono text-sm text-emerald-400"
          }
        >
          {skill.name}
        </span>
        {skill.note && (
          <span className="text-xs text-zinc-500">— {skill.note}</span>
        )}
      </div>

      {hasChildren && (
        <ul className="mt-2 space-y-2 border-l border-zinc-800">
          {skill.children!.map((child) => (
            <SkillNode key={child.name} skill={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function SkillTree({ categories }: { categories: SkillCategory[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {categories.map((category) => (
        <section
          key={category.category}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <div className="mb-5">
            <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-zinc-100">
              <span aria-hidden="true">{category.icon}</span>
              {category.category}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">{category.description}</p>
          </div>

          <ul className="space-y-3 border-l border-zinc-800">
            {category.skills.map((skill) => (
              <SkillNode key={skill.name} skill={skill} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
