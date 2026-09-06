/**
 * lib/data/portfolio.ts
 *
 * The complete engineering inventory, organised by technical domain
 * rather than chronology.
 *
 * Two levels of detail exist deliberately:
 *   - `projects.ts` holds full case studies (decisions, validation, failures)
 *     for the four projects with enough documented substance to support one.
 *   - `workItems` below covers everything else at summary depth. An item with
 *     a `caseStudy` slug links through to its deep write-up.
 *
 * Nothing here should be padded out to look like a case study. When a project
 * gains real documented content, promote it into `projects.ts` instead.
 */

export type WorkStatus = "complete" | "ongoing" | "upcoming";

/** Relative weight in the profile — drives ordering and emphasis, not truth. */
export type WorkTier = "flagship" | "major" | "supporting" | "foundational";

export type WorkDomain =
  | "Autonomous Systems & Robotics"
  | "Digital Design & Computer Architecture"
  | "Analog, Mixed-Signal & Instrumentation"
  | "Embedded Systems & Firmware";

export interface WorkItem {
  title: string;
  domain: WorkDomain;
  status: WorkStatus;
  tier: WorkTier;
  summary: string;
  technologies: string[];
  /** Where the work happened, e.g. a competition or lab. */
  context?: string;
  /** Slug in projects.ts when a full case study exists. */
  caseStudy?: string;
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
    caseStudy: "tiburon-auv",
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
    caseStudy: "warehouse-drone",
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
    caseStudy: "embedded-sar-adc",
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
      "Design work on an analog compute-in-memory architecture. Entered in the Lam Research Challenge 2026 — in progress, no results yet.",
    technologies: ["Analog compute-in-memory", "Mixed-signal architecture"],
    context: "Lam Research Challenge 2026",
  },
  {
    title: "Embedded Test Equipment Suite",
    domain: "Analog, Mixed-Signal & Instrumentation",
    status: "complete",
    tier: "supporting",
    summary:
      "ESP32-based lab instrumentation — oscilloscope-style capture and transformer-isolated AC voltage sensing through a ZMPT101B, with host-side analysis.",
    technologies: ["ESP32", "ZMPT101B", "Python", "MATLAB", "Signal conditioning"],
    caseStudy: "test-equipment-suite",
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
    related: "Analog Compute-in-Memory",
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
 */
export const portfolioStats = [
  {
    label: "Projects & builds",
    value: String(workItems.filter((w) => w.status !== "upcoming").length),
  },
  { label: "Competitions", value: String(competitions.length) },
  { label: "Global podium", value: "SAUVC 2026" },
  { label: "Graduating", value: "2027" },
];
