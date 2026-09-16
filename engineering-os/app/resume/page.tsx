import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { profile } from "@/lib/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Resume",
  description: `Resume of ${profile.name}`,
  path: "/resume",
});

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
            className="inline-flex shrink-0 items-center gap-2 bg-copper-400 px-4 py-2.5 text-sm font-semibold text-board-950 transition-colors hover:bg-copper-300"
          >
            <Download size={15} /> Download PDF
          </a>
        )}
      </div>

      <div className="panel mb-10 divide-y divide-board-800">
        {highlights.map(({ label, value }) => (
          <div key={label} className="flex gap-4 px-5 py-4">
            <span className="w-28 shrink-0 pt-0.5 font-mono text-xs text-copper-400">{label}</span>
            <span className="text-sm text-board-300">{value}</span>
          </div>
        ))}
      </div>

      {profile.resumePath ? (
        <div className="overflow-hidden border border-board-800">
          <div className="flex items-center gap-2 border-b border-board-800 bg-board-900 px-4 py-3">
            <FileText size={14} className="text-board-500" />
            <span className="font-mono text-xs text-board-500">resume.pdf</span>
          </div>
          <object
            data={profile.resumePath}
            type="application/pdf"
            className="h-[80vh] w-full"
            aria-label="Resume PDF"
          >
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <p className="text-sm text-board-400">PDF preview not available in this browser.</p>
              <a
                href={profile.resumePath}
                download
                className="inline-flex items-center gap-2 border border-board-700 px-4 py-2 text-sm font-medium text-board-300 transition-colors hover:border-copper-400 hover:text-copper-400"
              >
                <Download size={14} /> Download Resume
              </a>
            </div>
          </object>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 border border-dashed border-board-800 px-6 py-14 text-center">
          <FileText size={20} className="text-board-600" />
          <p className="text-sm text-board-400">A downloadable PDF isn&apos;t published yet.</p>
          <p className="max-w-sm text-xs text-board-600">
            The summary above covers the essentials. For the full CV, reach out via the{" "}
            <Link href="/contact" className="text-copper-400 hover:text-copper-300">
              contact page
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
