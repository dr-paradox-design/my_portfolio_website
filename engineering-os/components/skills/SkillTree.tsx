import type { Skill, SkillCategory } from "@/lib/data/skills";
import { SpotlightEffect } from "@/components/ui/SpotlightEffect";

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
        className="absolute left-0 top-[0.6rem] h-px w-3 bg-board-800"
      />
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span
          className={
            hasChildren
              ? "text-sm font-medium text-board-200"
              : "font-mono text-sm text-copper-400"
          }
        >
          {skill.name}
        </span>
        {skill.note && (
          <span className="text-xs text-board-500">— {skill.note}</span>
        )}
      </div>

      {hasChildren && (
        <ul className="mt-2 space-y-2 border-l border-board-800">
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
          /* `probe`, not `panel-link`: this section is not clickable, so it
             gets the pointer-tracking highlight without the copper edge that
             elsewhere means "this opens something". */
          className="panel probe group relative isolate p-6 transition-colors duration-300 hover:border-board-700"
        >
          <SpotlightEffect />
          <div className="relative z-10 mb-5">
            <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-board-50">
              <span aria-hidden="true">{category.icon}</span>
              {category.category}
            </h2>
            <p className="mt-1 text-sm text-board-500">{category.description}</p>
          </div>

          <ul className="relative z-10 space-y-3 border-l border-board-800">
            {category.skills.map((skill) => (
              <SkillNode key={skill.name} skill={skill} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
