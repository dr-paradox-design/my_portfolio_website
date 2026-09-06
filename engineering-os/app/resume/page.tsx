import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { profile } from "@/lib/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}`,
};

const highlights = [
  { label: "Education", value: "B.Tech Electrical Engineering - NIT Rourkela (2027)" },
  { label: "Leadership", value: "Team Captain and Firmware Lead, Team Tiburon (AUV Robotics)" },
  { label: "Competition", value: "Global podium, SAUVC China 2026" },
  { label: "Core skills", value: "Embedded firmware (C/C++), control systems, EKF sensor fusion, ROS2" },
  { label: "Target roles", value: "Chip design, semiconductor fabrication, embedded systems engineering" },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-28 pb-24">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <SectionHeading eyebrow="CV" title="Resume" />
        {profile.resumePath && (
          <a
            href={profile.resumePath}
            download
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            <Download size={15} /> Download PDF
          </a>
        )}
      </div>

      <div className="panel mb-10 divide-y divide-zinc-800">
        {highlights.map(({ label, value }) => (
          <div key={label} className="flex gap-4 px-5 py-4">
            <span className="w-28 shrink-0 pt-0.5 font-mono text-xs text-emerald-400">{label}</span>
            <span className="text-sm text-zinc-300">{value}</span>
          </div>
        ))}
      </div>

      {profile.resumePath ? (
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-3">
            <FileText size={14} className="text-zinc-500" />
            <span className="font-mono text-xs text-zinc-500">resume.pdf</span>
          </div>
          <object
            data={profile.resumePath}
            type="application/pdf"
            className="h-[80vh] w-full"
            aria-label="Resume PDF"
          >
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <p className="text-sm text-zinc-400">PDF preview not available in this browser.</p>
              <a
                href={profile.resumePath}
                download
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-emerald-400 hover:text-emerald-400"
              >
                <Download size={14} /> Download Resume
              </a>
            </div>
          </object>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-800 px-6 py-14 text-center">
          <FileText size={20} className="text-zinc-600" />
          <p className="text-sm text-zinc-400">A downloadable PDF isn&apos;t published yet.</p>
          <p className="max-w-sm text-xs text-zinc-600">
            The summary above covers the essentials. For the full CV, reach out via the{" "}
            <Link href="/contact" className="text-emerald-400 hover:text-emerald-300">
              contact page
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
