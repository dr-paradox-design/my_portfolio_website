interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      {eyebrow && (
        <p
          className={`mb-3 flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-emerald-400 ${
            centered ? "justify-center" : ""
          }`}
        >
          {/* Short accent rule — reads like a section marker on a schematic */}
          <span
            className="h-px w-6 bg-gradient-to-r from-emerald-400 to-emerald-400/0"
            aria-hidden="true"
          />
          {eyebrow}
        </p>
      )}

      <h2 className="text-gradient text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p
          className={`mt-3 max-w-2xl leading-relaxed text-zinc-400 ${
            centered ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
