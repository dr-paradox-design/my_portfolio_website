import type { Metadata } from "next";
import { Code2, Globe, Mail } from "lucide-react";
import { profile } from "@/lib/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${profile.name}`,
};

/** Show the bare host + path so the displayed handle always matches the real link. */
const displayUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const contactLinks = [
  { label: "Email", value: profile.social.email, href: `mailto:${profile.social.email}`, icon: Mail, description: "Best for project inquiries and collaboration" },
  { label: "LinkedIn", value: displayUrl(profile.social.linkedin), href: profile.social.linkedin, icon: Globe, description: "Professional updates and connection" },
  { label: "GitHub", value: displayUrl(profile.social.github), href: profile.social.github, icon: Code2, description: "Code, projects, and contributions" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-28 pb-24">
      <div className="mb-12">
        <SectionHeading eyebrow="Get in touch" title="Contact"
          description="Open to conversations about embedded systems, robotics, semiconductor roles, and research opportunities." />
      </div>
      <div className="space-y-3">
        {contactLinks.map(({ label, value, href, icon: Icon, description }) => (
          <a key={label} href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 group-hover:bg-emerald-400/10 transition-colors">
              <Icon size={18} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-100">{label}</p>
              <p className="font-mono text-xs text-emerald-400 truncate">{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-5">
        <p className="font-mono text-xs text-emerald-400 mb-2">currently open to</p>
        <ul className="space-y-1">
          {[
            "Full-time roles in semiconductor fabrication (graduating 2027)",
            "Internships in embedded systems and robotics",
            "Research collaborations in control theory and autonomous systems",
            "Technical conversations — always",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
              <span className="text-emerald-400 mt-0.5 shrink-0">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
