import { profile } from "@/lib/data/profile";

const links = [
  { label: "GitHub", href: profile.social.github, external: true },
  { label: "LinkedIn", href: profile.social.linkedin, external: true },
  { label: "Email", href: `mailto:${profile.social.email}`, external: false },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-zinc-800/60">
      {/* Hairline accent that fades out from the left edge */}
      <div
        className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-emerald-400/40 via-emerald-400/5 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="font-mono text-xs text-zinc-600">
          © {new Date().getFullYear()} {profile.name}
          <span className="mx-2 text-zinc-800">/</span>
          {profile.institution}
        </p>

        <div className="flex items-center gap-5">
          {links.map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group relative text-sm text-zinc-500 transition-colors hover:text-emerald-400"
            >
              {label}
              <span
                className="absolute -bottom-0.5 left-0 h-px w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
