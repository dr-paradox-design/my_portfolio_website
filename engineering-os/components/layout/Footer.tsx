import { profile } from "@/lib/data/profile";

/* LinkedIn drops out of this row entirely while `profile.social.linkedin`
   is null, rather than rendering a dead link. See lib/data/profile.ts. */
const links = [
  { label: "GitHub", href: profile.social.github, external: true },
  ...(profile.social.linkedin
    ? [{ label: "LinkedIn", href: profile.social.linkedin, external: true }]
    : []),
  { label: "Email", href: `mailto:${profile.social.email}`, external: false },
];

/**
 * The drawing title block.
 *
 * Every field here is a real value pulled from `profile.ts` — there is no
 * invented drawing number, no revision letter, no "checked by". A title
 * block full of fabricated metadata would look the part and be a lie, and
 * the no-fabrication rule in AGENTS.md does not stop being true because
 * the fabrication is decorative.
 *
 * The rules between cells are drawn by `gap-px` over a `board-800`
 * background rather than by borders on each cell, which is what keeps them
 * single-width where cells meet instead of doubling up.
 */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-board-950 px-4 py-3">
      <p className="field">{label}</p>
      <div className="mt-1 text-sm text-board-200">{children}</div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-board-800">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-px border border-board-800 bg-board-800 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Drawn by">{profile.name}</Field>
          <Field label="Institution">{profile.institution}</Field>
          <Field label="Program">{profile.program}</Field>
          <Field label="Graduation">
            <span className="font-mono tabular-nums">{profile.graduationYear}</span>
          </Field>
        </div>

        <div className="mt-px grid grid-cols-1 gap-px border border-t-0 border-board-800 bg-board-800 sm:grid-cols-[1fr_auto]">
          <div className="bg-board-950 px-4 py-3">
            <p className="field">Contact</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1">
              {links.map(({ label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="text-sm text-board-300 underline-offset-4 transition-colors hover:text-copper-400 hover:underline"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-end bg-board-950 px-4 py-3">
            <p className="font-mono text-xs text-board-600">
              © {new Date().getFullYear()} {profile.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
