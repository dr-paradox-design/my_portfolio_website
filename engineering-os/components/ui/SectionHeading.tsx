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
      {/* `.marker` draws the short copper rule via ::before — see globals.css.
          It replaced a gradient-to-transparent rule, which faded out because
          it had nowhere to end. A drawing's section marker is a definite
          length: it starts, it stops. */}
      {eyebrow && (
        <p
          className={`marker field mb-3 text-copper-400 ${
            centered ? "justify-center" : ""
          }`}
        >
          {eyebrow}
        </p>
      )}

      <h2 className="text-2xl font-semibold tracking-tight text-board-50 sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p
          className={`mt-3 max-w-2xl leading-relaxed text-board-400 ${
            centered ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
