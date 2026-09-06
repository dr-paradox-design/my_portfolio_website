/**
 * lib/data/portfolio.ts
 *
 * The complete engineering inventory, organised by technical domain
 * rather than chronology.
 *
 * **This file owns project identity and routing.** `workItems` is the single
 * list; an item gets a page at `/projects/<slug>` the moment it is given a
 * `slug`, and the page renders whatever that item actually has — photos,
 * video, and (optionally) the deep write-up in `projects.ts` keyed by the
 * same slug.
 *
 * `projects.ts` is a *sidecar*, not a parallel inventory. It holds only the
 * long-form content: decisions, validation, failures. Most items will never
 * have an entry there and that is fine.
 *
 * The rule that keeps this honest: give an item a `slug` when there is
 * something to show behind it, not before. `lib/data/projectPage.ts` fails
 * the build if a routed slug resolves to an empty page.
 */

import type { StaticImageData } from "next/image";

/* Photos are imported, not referenced by path string.
 *
 * Three things this buys, all of which matter here:
 *   1. `next/image` learns each file's intrinsic width and height, which is
 *      what lets the project gallery show a photo at its true size instead
 *      of upscaling it into a fixed frame. These are WhatsApp-compressed
 *      phone shots — several are barely 200px on the long edge — so knowing
 *      the real resolution is not a nicety.
 *   2. `placeholder="blur"` works with no extra work.
 *   3. A typo in a filename is a build error, not a 404 nobody notices. */
import nidarArena from "@/public/projects/nidar-arena.png";
import nidarDrones from "@/public/projects/nidar-drones.webp";
import nidarFinalTest from "@/public/projects/nidar-final-test.png";
import nidarNightTest from "@/public/projects/nidar-night-test.png";
import eyantraFirstTask1 from "@/public/projects/eyantra-first-task-1.png";
import eyantraFirstTask2 from "@/public/projects/eyantra-first-task-2.png";
import eyantraSimPidTuning from "@/public/projects/eyantra-sim-pid-tuning.webp";
import eyantraDrone from "@/public/projects/eyantra-drone.png";
import eyantraTestSetup from "@/public/projects/eyantra-test-setup.png";
import eyantraTeammates from "@/public/projects/eyantra-teammates.png";
import eyantraCompetitionDay from "@/public/projects/eyantra-competition-day.webp";

export type WorkStatus = "complete" | "ongoing" | "upcoming";

/** Relative weight in the profile — drives ordering and emphasis, not truth. */
export type WorkTier = "flagship" | "major" | "supporting" | "foundational";

export type WorkDomain =
  | "Autonomous Systems & Robotics"
  | "Digital Design & Computer Architecture"
  | "Analog, Mixed-Signal & Instrumentation"
  | "Embedded Systems & Firmware";

/**
 * A photograph of the built thing.
 *
 * Optional on purpose. A card with no photos renders exactly as it did
 * before — no empty frame, no "photo coming soon" box — so photos can be
 * added one project at a time without any card ever looking broken.
 *
 * Convention: drop the file in `public/projects/` and point `src` at it.
 *
 * **Order is the gallery order** — tell the story of the build from first
 * task to competition day. The card hero is a separate concern: flag one
 * image with `cover` and the cards will lead with that instead of the first
 * one. Without a flag the cards fall back to `images[0]`.
 */
export interface WorkImage {
  /** A static import from `public/projects/`, never a path string. */
  src: StaticImageData;
  /** Required — describe what is actually in the frame, not the project. */
  alt: string;
  /** Shown under the hero image. Keep it to a few words. */
  caption?: string;
  /**
   * CSS object-position. Card bands are 16:9, so portrait phone photos get
   * cropped hard — set this to "50% 30%" or similar to keep the subject.
   * Cards only — the project page shows photos at their natural ratio and
   * never crops, so `focus` has no effect there.
   */
  focus?: string;
  /**
   * Lead this project's cards with this photo, regardless of where it sits
   * in the narrative sequence. At most one per project; the first flagged
   * one wins.
   */
  cover?: boolean;
}

/**
 * A YouTube video of the thing working.
 *
 * Deliberately stores the bare video ID rather than a URL: the embed URL,
 * the watch URL, and the privacy-preserving `youtube-nocookie` host are all
 * derived from it, so there is exactly one place a malformed link could
 * enter and it is validated by shape.
 *
 * `poster` is required and must be a local image. Pulling the thumbnail
 * from `i.ytimg.com` would mean a remote image host in `next.config.ts`, a
 * build-time dependency on Google, and a broken frame whenever
 * `maxresdefault.jpg` doesn't exist for a given upload.
 */
export interface WorkVideo {
  /** YouTube video ID only — e.g. "dQw4w9WgXcQ", never a full URL. */
  youtubeId: string;
  /** Used as the iframe title and the play button's accessible name. */
  title: string;
  /** A local still frame. See above — never a remote thumbnail. */
  poster: WorkImage;
  /** Shown under the player. */
  caption?: string;
  /** Label on the outbound link. Defaults to "Watch on YouTube". */
  linkLabel?: string;
}

export interface WorkItem {
  title: string;
  domain: WorkDomain;
  status: WorkStatus;
  tier: WorkTier;
  summary: string;
  technologies: string[];
  /** Where the work happened, e.g. a competition or lab. */
  context?: string;
  /**
   * Opens a page at `/projects/<slug>`. Set this only when the item has
   * photos, video, or a `ProjectDetail` behind it — the build fails
   * otherwise, on purpose.
   */
  slug?: string;
  /** Photos of the build, in narrative order. Absent until real photos exist. */
  images?: WorkImage[];
  /** Video of it working. Absent until a real upload exists. */
  video?: WorkVideo;
}

/** Domain order used for grouping in the UI. */
export const workDomains: WorkDomain[] = [
  "Autonomous Systems & Robotics",
  "Digital Design & Computer Architecture",
  "Analog, Mixed-Signal & Instrumentation",
  "Embedded Systems & Firmware",
];

export const workItems: WorkItem[] = [
  // ── Autonomous Systems & Robotics ───────────────────────────────
  {
    title: "Tiburon AUV Platform",
    domain: "Autonomous Systems & Robotics",
    status: "complete",
    tier: "flagship",
    summary:
      "Autonomous underwater vehicle built from scratch over roughly 1.5 years — mechanical design, manufacturing, electronics, software, and system integration. Owned the firmware, sensor interfaces, state estimator, and the 6-DOF control and thrust-allocation chain.",
    technologies: [
      "RP2350",
      "C++",
      "ROS2",
      "EKF",
      "MATLAB",
      "VectorNav VN-200",
      "Teledyne DVL",
    ],
    context: "Team Tiburon — Team Captain & Firmware Lead",
    slug: "tiburon-auv",
  },
  {
    title: "Autonomous Disaster-Management Drones",
    domain: "Autonomous Systems & Robotics",
    status: "complete",
    tier: "major",
    summary:
      "Problem statement built around two autonomous drones operating together for disaster management. Placed Rank 6.",
    technologies: ["Autonomous drones", "Disaster response"],
    context: "NIDAR 2025",
    /* Photographs only for now — no write-up yet, so the page is a spec
       strip and a build log. That is a complete thing, not a stub. */
    slug: "disaster-management-drones",
    images: [
      {
        src: nidarDrones,
        alt: "The two drones of the disaster-management system side by side, one large carbon-frame quadcopter and one smaller airframe",
        caption: "The two-drone system",
      },
      {
        src: nidarFinalTest,
        alt: "Ground station laptop showing the mission view during the final test day",
        caption: "Final test day",
        /* Portrait phone photo — bias the 16:9 crop up onto the laptop screen. */
        focus: "50% 35%",
      },
      {
        src: nidarNightTest,
        alt: "Night field testing, laptop on the ground beside the drone",
        caption: "Field testing at 3am",
        focus: "50% 40%",
      },
      {
        src: nidarArena,
        alt: "Team working on the drones in the competition arena",
        caption: "In the arena",
      },
    ],
  },
  {
    title: "Autonomous Warehouse Drone",
    domain: "Autonomous Systems & Robotics",
    status: "complete",
    tier: "major",
    summary:
      "Indoor warehouse automation and navigation stack, developed simulation-first in Gazebo and deployed headless to a Raspberry Pi.",
    technologies: ["ROS2", "Gazebo", "Python", "Raspberry Pi", "systemd"],
    context: "e-Yantra",
    slug: "warehouse-drone",
    /* Ordered as the project happened — first task, then simulation and
       tuning, then the airframe, the test arena, the team, and competition
       day. He sent them in reverse; the sequence is the story, so it is
       stored the way it was lived, not the way it arrived. */
    images: [
      {
        src: eyantraFirstTask1,
        alt: "Monitor showing Python waypoint code beside a simulator window with the drone's four-rotor outline over a coloured target",
        caption: "The first task",
      },
      {
        src: eyantraFirstTask2,
        alt: "Laptop screen with a terminal and editor open on the first task's code",
        caption: "The first task, continued",
      },
      {
        src: eyantraSimPidTuning,
        alt: "Laptop running the Swift Pico PID tuning panel with throttle, pitch, and roll gain fields, surrounded by ROS2 terminals logging waypoints",
        caption: "Simulation and PID tuning — stage one",
      },
      {
        src: eyantraDrone,
        alt: "Collage of the small quadcopter: held in a hand, its circular target marker fitted, and the assembled airframe on the bench",
        caption: "The drone",
        /* Card hero. The gallery opens on a code screenshot, which is the
           truthful first step but a poor thumbnail. */
        cover: true,
      },
      {
        src: eyantraTestSetup,
        alt: "Indoor test arena of stacked blocks laid out on the floor, with a teammate at a laptop against the far wall",
        caption: "Our test setup",
      },
      {
        src: eyantraTeammates,
        alt: "The two-person team standing together against a dark backdrop",
        caption: "The two of us",
      },
      {
        src: eyantraCompetitionDay,
        alt: "The two of us in a lift on competition day, lanyards on, carrying the drone box",
        caption: "Competition day",
      },
    ],
  },
  {
    title: "3D-Printed Quadcopter",
    domain: "Autonomous Systems & Robotics",
    status: "complete",
    tier: "major",
    /* Deliberately does not claim it flew — "implemented its movement" is what
       was reported, and a flight claim is the kind of thing an interviewer
       will ask to see. Upgrade this line if it did fly. */
    summary:
      "Second-year quadcopter taken from CAD to hardware solo: the complete airframe modelled in SolidWorks, 3D printed, then assembled with its electronics and brought up until it moved under its own power.",
    technologies: ["SolidWorks", "3D printing", "Mechanical design"],
  },
  {
    title: "Aquatic Robotics for Sustainability",
    domain: "Autonomous Systems & Robotics",
    status: "complete",
    tier: "supporting",
    summary:
      "Hackathon work on how robotics can contribute to global and environmental sustainability, in an aquatic robotics context.",
    technologies: ["Aquatic robotics"],
    context: "IIT Guwahati Aquatic Hackathon",
  },
  {
    title: "Line Following Robot",
    domain: "Autonomous Systems & Robotics",
    status: "complete",
    tier: "foundational",
    summary:
      "First-year build using IR sensors, completed in roughly two days. The entry point into the robotics work that followed.",
    technologies: ["IR sensors"],
  },

  // ── Digital Design & Computer Architecture ──────────────────────
  {
    title: "Pipelined RISC-V CPU",
    domain: "Digital Design & Computer Architecture",
    status: "ongoing",
    tier: "flagship",
    summary:
      "Pipelined RISC-V processor design, currently complete through RTL. The full ASIC design flow is planned but not yet implemented.",
    technologies: ["Verilog", "RISC-V", "Pipelined microarchitecture", "RTL"],
  },
  {
    title: "FPGA Sensor Fusion",
    domain: "Digital Design & Computer Architecture",
    status: "complete",
    tier: "major",
    summary:
      "Sensor fusion of IMU, GPS, and compass data targeting an FPGA — moving estimation work out of software and into fabric.",
    technologies: ["FPGA", "Sensor fusion", "IMU", "GPS", "Compass"],
  },

  // ── Analog, Mixed-Signal & Instrumentation ──────────────────────
  {
    title: "Embedded SAR ADC Platform",
    domain: "Analog, Mixed-Signal & Instrumentation",
    status: "complete",
    tier: "flagship",
    summary:
      "Mixed-signal acquisition board: a 6-layer PCB carrying the analog front end, a Verilog FSM sequencing the SAR conversion, and DMA-driven STM32 capture firmware, benchmarked with spectral analysis.",
    technologies: ["STM32", "Verilog", "6-layer PCB", "DMA", "SPI", "FFT"],
    slug: "embedded-sar-adc",
  },
  {
    title: "Acoustic Processing Stack",
    domain: "Analog, Mixed-Signal & Instrumentation",
    status: "ongoing",
    tier: "flagship",
    summary:
      "Acoustic hardware and software processing stack. Currently working on the analog backend architecture, with DSP implementation on FPGA planned.",
    technologies: ["DSP", "FPGA", "Analog front-end", "Signal processing"],
  },
  {
    title: "Analog Compute-in-Memory",
    domain: "Analog, Mixed-Signal & Instrumentation",
    status: "ongoing",
    tier: "major",
    summary:
      "Design work on an analog compute-in-memory architecture. In progress — no results yet.",
    technologies: ["Analog compute-in-memory", "Mixed-signal architecture"],
  },
  {
    title: "Embedded Test Equipment Suite",
    domain: "Analog, Mixed-Signal & Instrumentation",
    status: "complete",
    tier: "supporting",
    summary:
      "ESP32-based lab instrumentation — oscilloscope-style capture and transformer-isolated AC voltage sensing through a ZMPT101B, with host-side analysis.",
    technologies: ["ESP32", "ZMPT101B", "Python", "MATLAB", "Signal conditioning"],
    slug: "test-equipment-suite",
  },
  {
    title: "Headphone Electronics Reverse Engineering",
    domain: "Analog, Mixed-Signal & Instrumentation",
    status: "upcoming",
    tier: "supporting",
    summary:
      "Planned teardown and reverse engineering of headphone electronics. Not yet started.",
    technologies: ["Audio electronics", "Reverse engineering"],
  },

  // ── Embedded Systems & Firmware ─────────────────────────────────
  {
    title: "Flight Controller PCB",
    domain: "Embedded Systems & Firmware",
    status: "complete",
    tier: "major",
    summary:
      "Four-layer flight controller board designed in KiCad around an STM32H743, carrying an ESP32 module, dual IMUs, and integrated power management.",
    technologies: [
      "KiCad",
      "STM32H743",
      "ESP32",
      "4-layer PCB",
      "Dual IMU",
      "Power management",
    ],
  },
  {
    title: "ESP32 Non-Volatile Memory",
    domain: "Embedded Systems & Firmware",
    status: "complete",
    tier: "supporting",
    summary:
      "24-hour hackathon build focused on accessing and modifying the non-volatile memory of the ESP32.",
    technologies: ["ESP32", "Non-volatile memory"],
    context: "24-hour hackathon",
  },
  {
    title: "Hostel Room Automation",
    domain: "Embedded Systems & Firmware",
    status: "complete",
    tier: "supporting",
    summary:
      "Automation of hostel-room fans and lights using an ESP32 and sensors.",
    technologies: ["ESP32", "Sensors"],
  },
];

/**
 * The work items that have their own page, narrowed so `slug` is a plain
 * `string` rather than `string | undefined`.
 *
 * The type predicate is doing real work: `generateStaticParams` and the card
 * `href` both need the slug, and without this they would each need a
 * non-null assertion — which would silently keep compiling if the filter
 * above were ever changed to let a slugless item through.
 */
export const routedWorkItems = workItems.filter(
  (item): item is WorkItem & { slug: string } => Boolean(item.slug),
);

/**
 * Picks the photo the cards should lead with — the `cover`-flagged one if
 * there is one, otherwise the first. See `WorkImage.cover`: the gallery is
 * in narrative order, which often starts with something unphotogenic like a
 * screenshot of the first task.
 */
export function coverImage(images: WorkImage[] | undefined): WorkImage | undefined {
  if (!images || images.length === 0) return undefined;
  return images.find((img) => img.cover) ?? images[0];
}

/**
 * Technical threads that run across multiple projects. These are the
 * strongest narrative in the profile — the same problem solved repeatedly
 * at increasing depth — so they are surfaced explicitly.
 */
export interface TechnicalThread {
  title: string;
  insight: string;
  chain: string[];
}

export const technicalThreads: TechnicalThread[] = [
  {
    title: "GPS-denied state estimation",
    insight:
      "The same core problem — estimating pose with no absolute reference — solved across underwater, aerial, and hardware-accelerated implementations.",
    chain: [
      "Tiburon EKF (DVL + pressure + AHRS)",
      "Sub-250 g drone localization (optical flow + IMU + LiDAR)",
      "FPGA sensor fusion (IMU + GPS + compass)",
    ],
  },
  {
    title: "Mixed-signal acquisition to analog compute",
    insight:
      "Board-level instrumentation escalating into analog architecture design.",
    chain: [
      "ESP32 oscilloscope & ZMPT sensing",
      "SAR ADC platform (6-layer PCB, FSM, DMA)",
      "Acoustic analog backend",
      "Analog compute-in-memory",
    ],
  },
  {
    title: "Digital design escalation",
    insight:
      "From a single conversion state machine up to a full pipelined processor.",
    chain: [
      "Verilog SAR control FSM",
      "FPGA sensor fusion",
      "DSP on FPGA",
      "Pipelined RISC-V CPU",
    ],
  },
  {
    title: "Autonomy scale-up",
    insight:
      "Increasing autonomy and system complexity, from a two-day build to a multi-year vehicle.",
    chain: [
      "Line following robot",
      "e-Yantra warehouse drone",
      "NIDAR dual-drone system",
      "Tiburon AUV",
    ],
  },
];

// ── Competitions & achievements ───────────────────────────────────

export interface Achievement {
  name: string;
  result: string;
  status: WorkStatus;
  /** Related work item, for cross-referencing in the UI. */
  related?: string;
}

export const competitions: Achievement[] = [
  {
    name: "SAUVC 2026",
    result: "Global podium",
    status: "complete",
    related: "Tiburon AUV Platform",
  },
  {
    name: "NIDAR 2025",
    result: "Rank 6",
    status: "complete",
    related: "Autonomous Disaster-Management Drones",
  },
  {
    name: "Lam Research Challenge 2026",
    result: "Currently competing",
    status: "ongoing",
  },
  {
    name: "e-Yantra Robotics Competition",
    result: "Participant",
    status: "complete",
    related: "Autonomous Warehouse Drone",
  },
  {
    name: "IIT Guwahati Aquatic Hackathon",
    result: "Participant",
    status: "complete",
    related: "Aquatic Robotics for Sustainability",
  },
  {
    name: "ESP32 Non-Volatile Memory Hackathon",
    result: "Participant — 24 hour",
    status: "complete",
    related: "ESP32 Non-Volatile Memory",
  },
];

// ── Internships ───────────────────────────────────────────────────

export interface Internship {
  organisation: string;
  lab: string;
  focus: string;
  details: string[];
  technologies: string[];
}

export const internships: Internship[] = [
  {
    organisation: "IIT Bombay",
    lab: "Embedded and Robotics Lab, Department of CSE",
    focus: "Localization of a sub-250 g drone",
    details: [
      "Designed a localization algorithm for non-GPS / GPS-denied operation.",
      "Worked across the flight controller, companion computer, and sensor suite.",
    ],
    technologies: [
      "Flight controller",
      "Raspberry Pi",
      "Optical-flow sensor",
      "Flight-controller IMU",
      "1D LiDAR",
    ],
  },
];

// ── Workshops, schools & memberships ──────────────────────────────

export interface Workshop {
  title: string;
  host: string;
}

export const workshops: Workshop[] = [
  { title: "Semiconductor Manufacturing", host: "IISc" },
  { title: "CENS Summer School", host: "IISc" },
  { title: "Advanced PV Technology", host: "Workshop" },
  { title: "Microcontroller Lab (EE3472)", host: "NIT Rourkela — 8051 coursework" },
];

export interface Membership {
  organisation: string;
  role: string;
}

export const memberships: Membership[] = [
  { organisation: "IEEE Oceanic Engineering Society", role: "Member" },
];

/**
 * Headline stats, derived from the data above so they cannot drift out of
 * sync the way hardcoded counts did. Upcoming work is excluded from the
 * project count deliberately — it has not been built yet.
 *
 * Graduation year is deliberately NOT a stat — the eyebrow already states it.
 *
 * A single competition result is not a stat either. SAUVC used to sit here,
 * which made one event carry the whole headline. Breadth across domains says
 * more about the engineer than any one podium, and it stays true as the work
 * grows.
 */
export const portfolioStats = [
  {
    label: "Projects & builds",
    value: String(workItems.filter((w) => w.status !== "upcoming").length),
  },
  {
    label: "Technical domains",
    value: String(new Set(workItems.map((w) => w.domain)).size),
  },
  { label: "Competitions", value: String(competitions.length) },
];
