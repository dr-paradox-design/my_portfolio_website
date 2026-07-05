/**
 * Shared type definitions for Engineering-OS project case studies.
 *
 * Design intent:
 * - This shape is used by all 4 case studies in v1 (Professional Mode).
 * - v2 (Engineer Mode) will read from this exact same data — do not change
 *   this shape casually once content is filled in for multiple projects.
 * - Every field that holds prose is a plain string so it can be authored
 *   in normal TypeScript files without an MDX/content pipeline (per the
 *   brief: no MDX collections in v1).
 */

/**
 * A media asset slot (image, diagram, or video).
 *
 * `src` is left as a placeholder path under /public until real assets
 * are dropped in. Keeping `alt` required (not optional) forces every
 * image to have real accessible text, even before the final asset exists.
 */
export interface MediaAsset {
  /** Path relative to /public, e.g. "/images/tiburon/hero.jpg" */
  src: string;
  /** Required accessible description — write this even for placeholders */
  alt: string;
  /** Optional caption shown under the image on the page */
  caption?: string;
  /** True if this is a placeholder awaiting a real asset */
  isPlaceholder?: boolean;
}

/**
 * One real engineering trade-off: a decision that had a genuine
 * alternative, plus the reasoning for why it was made.
 * The brief requires 2-4 of these per project — never generic.
 */
export interface TechnicalDecision {
  /** Short label for the decision, e.g. "Force/torque PID output vs. direct PWM" */
  title: string;
  /** What was actually decided */
  decision: string;
  /** The real alternative(s) that were considered and not chosen */
  alternativesConsidered: string;
  /** Why this path was chosen — constraints, reasoning, trade-offs accepted */
  reasoning: string;
}

/**
 * One honest failure or lesson learned. The brief requires at least one
 * of these per project, and explicitly forbids making every project sound
 * flawless. `resolved: false` is a valid, even preferred, value — an
 * honestly open problem is more credible than a falsely closed one.
 */
export interface FailureLesson {
  /** Short label, e.g. "Uncompensated reaction torque in thrust allocation" */
  title: string;
  /** What was observed/what went wrong, in concrete terms */
  whatHappened: string;
  /** Root cause if known. Use "suspected" language if not formally confirmed. */
  rootCause: string;
  /** Whether this has actually been resolved as of writing */
  resolved: boolean;
  /** If resolved: how. If not: what's still open / planned next step. */
  resolutionOrNextStep: string;
}

/**
 * A single measured/observed validation result. Kept loose (string value)
 * rather than forcing fake numeric precision — qualitative, honest
 * descriptions are explicitly preferred over invented metrics.
 */
export interface ValidationResult {
  /** What was tested, e.g. "Yaw-axis step response (isolated)" */
  test: string;
  /** What was observed/measured, in the team's own words */
  outcome: string;
}

/**
 * An external link related to the project (code, docs, media, competition page).
 */
export interface ProjectLink {
  label: string;
  url: string;
  /** True for links that don't exist yet (e.g. private repo) */
  isPlaceholder?: boolean;
}

/**
 * Optional downloadable technical report (LaTeX-generated PDF), per the
 * brief's "80% webpage / 20% downloadable PDF" guidance. Only major
 * projects need this — it's optional at the project level.
 */
export interface TechnicalReport {
  available: boolean;
  /** Path under /public/reports/ — placeholder path is fine before the PDF exists */
  pdfPath: string;
  /** One-line description of what's in the deeper report */
  description: string;
}

/**
 * Full shape of one project case study.
 */
export interface Project {
  /** URL-safe identifier, e.g. "tiburon-auv" — used for routing */
  slug: string;

  /** Card + hero title, e.g. "Industrial Inspection AUV Platform" */
  title: string;

  /** One-line summary used on cards and in hero */
  summary: string;

  /** Domain tags shown as small pills, e.g. ["Robotics", "Control Theory"] */
  domainTags: string[];

  /** Key technologies/hardware, shown on cards, e.g. ["ROS2", "RP2350", "EKF"] */
  technologies: string[];

  /** Hero image/diagram for the case study page and project card */
  heroImage: MediaAsset;

  /** 2-3 sentence executive summary: what it is, why it matters */
  executiveSummary: string;

  /** What needed solving — real constraints, real requirements */
  problemAndRequirements: string;

  /** Hardware + software + control architecture description */
  systemArchitecture: string;

  /** Diagram(s) supporting the architecture section */
  architectureDiagrams: MediaAsset[];

  /** 2-4 real decisions and the reasoning — required, never empty */
  technicalDecisions: TechnicalDecision[];

  /** What was tested, what was measured */
  validationResults: ValidationResult[];

  /** At least one genuine failure/lesson — required, never empty, never generic */
  failuresAndLessons: FailureLesson[];

  /** Realistic future improvements */
  whatsNext: string;

  /** GitHub / docs / media links */
  links: ProjectLink[];

  /** Optional deeper LaTeX/PDF technical report */
  technicalReport?: TechnicalReport;

  /** Whether this project should appear in the "4 featured" home page cards */
  featured: boolean;
}

const placeholderHeroImage: MediaAsset = {
  src: "/images/placeholders/project-hero.jpg",
  alt: "Placeholder project hero image",
  isPlaceholder: true,
};

const placeholderDiagram: MediaAsset = {
  src: "/images/placeholders/project-diagram.jpg",
  alt: "Placeholder architecture diagram",
  isPlaceholder: true,
};

export const projects: Project[] = [
  {
    slug: "tiburon-auv",
    title: "Tiburon AUV Platform",
    summary: "Autonomous underwater vehicle firmware, sensing, and control stack for competition runs.",
    domainTags: ["Robotics", "Control Theory", "Embedded Systems"],
    technologies: ["RP2040", "ROS2", "EKF", "C", "MATLAB"],
    heroImage: placeholderHeroImage,
    executiveSummary:
      "Tiburon is the team's autonomous underwater vehicle platform. This entry summarizes the firmware, sensing, and control work used to keep the vehicle stable and navigable in competition conditions.",
    problemAndRequirements:
      "Build a controllable AUV that can estimate its pose, accept high-level motion commands, and stay robust under noisy sensors, water drag, and tight power constraints.",
    systemArchitecture:
      "The stack combines a microcontroller-based low-level control loop with sensor fusion, thruster mixing, and a higher-level orchestration layer for mission logic and logging.",
    architectureDiagrams: [placeholderDiagram],
    technicalDecisions: [
      {
        title: "Closed-loop control instead of open-loop thrusters",
        decision: "Use cascaded feedback loops for depth, heading, and position control.",
        alternativesConsidered: "Direct throttle commands or manually tuned open-loop mappings.",
        reasoning: "The vehicle needed repeatable behavior despite changing loads and hydrodynamic drag.",
      },
      {
        title: "Sensor fusion over single-sensor navigation",
        decision: "Fuse DVL, IMU, and pressure data into a single navigation estimate.",
        alternativesConsidered: "Rely on IMU-only dead reckoning or pressure-only depth estimation.",
        reasoning: "Each sensor fails differently underwater, so the estimate had to stay useful when one signal drifted.",
      },
    ],
    validationResults: [
      { test: "Bench sensor fusion replay", outcome: "Fusion remained stable across noisy log playback." },
      { test: "Thruster command sweep", outcome: "Control outputs mapped cleanly to expected actuator responses." },
    ],
    failuresAndLessons: [
      {
        title: "Low-frequency drift in heading estimate",
        whatHappened: "The attitude estimate slowly wandered during long test runs.",
        rootCause: "Likely bias accumulation from IMU drift and imperfect calibration.",
        resolved: false,
        resolutionOrNextStep: "Tighten calibration flow and re-check sensor bias compensation against logged runs.",
      },
    ],
    whatsNext: "Replace placeholder calibration flow with a more repeatable field procedure and add better telemetry tools.",
    links: [{ label: "GitHub", url: "https://github.com/dr-paradox-design", isPlaceholder: true }],
    technicalReport: {
      available: false,
      pdfPath: "/reports/tiburon-auv.pdf",
      description: "Long-form technical report for the AUV stack.",
    },
    featured: true,
  },
  {
    slug: "embedded-sar-adc",
    title: "Embedded SAR ADC Platform",
    summary: "Mixed-signal acquisition board with firmware, logging, and FPGA control support.",
    domainTags: ["Hardware", "FPGA", "Data Acquisition"],
    technologies: ["STM32", "Verilog", "6-layer PCB", "DMA", "SPI"],
    heroImage: placeholderHeroImage,
    executiveSummary:
      "A board-level mixed-signal project focused on reliable data capture and deterministic control of an ADC front end.",
    problemAndRequirements:
      "Design a compact acquisition platform that could sample cleanly, stream results, and survive real lab wiring without losing data.",
    systemArchitecture:
      "The design splits analog front-end work from digital control so the firmware can trigger, capture, and log conversions without contaminating the signal path.",
    architectureDiagrams: [placeholderDiagram],
    technicalDecisions: [
      {
        title: "Dedicated front-end isolation",
        decision: "Keep the analog path physically and electrically isolated from the noisy digital section.",
        alternativesConsidered: "Use a denser all-in-one layout.",
        reasoning: "Signal integrity mattered more than board compactness for this prototype.",
      },
      {
        title: "DMA-driven capture path",
        decision: "Use DMA for sample transfer instead of CPU polling.",
        alternativesConsidered: "Busy-wait loops or interrupt-only handling.",
        reasoning: "Polling would waste cycles and introduce jitter during acquisition.",
      },
    ],
    validationResults: [
      { test: "Lab bench acquisition test", outcome: "Captured samples without buffer overruns." },
      { test: "Power and reset cycling", outcome: "Board recovered cleanly after repeated restarts." },
    ],
    failuresAndLessons: [
      {
        title: "Noisy readings during early bring-up",
        whatHappened: "Initial captures showed unstable values on the bench.",
        rootCause: "Grounding and routing choices were too optimistic for the first layout revision.",
        resolved: true,
        resolutionOrNextStep: "Split the layout review into analog and digital passes before the next spin.",
      },
    ],
    whatsNext: "Add a cleaner calibration routine and a richer logging pipeline for repeatable measurements.",
    links: [{ label: "Documentation", url: "#", isPlaceholder: true }],
    technicalReport: {
      available: false,
      pdfPath: "/reports/embedded-sar-adc.pdf",
      description: "Build notes and validation for the ADC platform.",
    },
    featured: true,
  },
  {
    slug: "warehouse-drone",
    title: "Autonomous Warehouse Drone",
    summary: "ROS2-based navigation and simulation stack for an indoor drone prototype.",
    domainTags: ["Robotics", "ROS2", "Simulation"],
    technologies: ["ROS2", "Gazebo", "Python", "Raspberry Pi"],
    heroImage: placeholderHeroImage,
    executiveSummary:
      "This project explored indoor autonomy for a small drone in a warehouse-style environment, with simulation-first validation and deployment on embedded Linux.",
    problemAndRequirements:
      "Navigate a constrained indoor environment, maintain stable position estimates, and expose clear operator controls for testing.",
    systemArchitecture:
      "ROS2 nodes manage sensing, mission state, and command routing while the simulation environment provides repeatable test cases before flight hardware is involved.",
    architectureDiagrams: [placeholderDiagram],
    technicalDecisions: [
      {
        title: "Simulation-first development",
        decision: "Model the drone behavior in Gazebo before relying on hardware tests.",
        alternativesConsidered: "Direct hardware bring-up with ad hoc field tests.",
        reasoning: "Indoor autonomy is easier to debug when scenarios can be replayed exactly.",
      },
      {
        title: "ROS2 modular node boundaries",
        decision: "Split sensing, planning, and control into separate nodes.",
        alternativesConsidered: "A single monolithic control script.",
        reasoning: "Separation made the system easier to test, replace, and observe.",
      },
    ],
    validationResults: [
      { test: "Repeated waypoint replay", outcome: "The same mission could be run multiple times in simulation." },
      { test: "Node restart handling", outcome: "Control services recovered after process restarts." },
    ],
    failuresAndLessons: [
      {
        title: "Tight coupling in early scripts",
        whatHappened: "A single failure could stall the whole stack during testing.",
        rootCause: "Too much logic lived in one node during the first implementation.",
        resolved: true,
        resolutionOrNextStep: "Refactor into smaller nodes with explicit message boundaries.",
      },
    ],
    whatsNext: "Bring the same node structure to a more realistic indoor flight controller.",
    links: [{ label: "Demo notes", url: "#", isPlaceholder: true }],
    technicalReport: {
      available: false,
      pdfPath: "/reports/warehouse-drone.pdf",
      description: "ROS2 architecture and simulation notes.",
    },
    featured: true,
  },
  {
    slug: "test-equipment-suite",
    title: "Embedded Test Equipment Suite",
    summary: "A practical hardware/software toolkit for verifying sensors and interfaces.",
    domainTags: ["Embedded Systems", "Instrumentation", "Tooling"],
    technologies: ["ESP32", "Python", "MATLAB", "Signal Conditioning"],
    heroImage: placeholderHeroImage,
    executiveSummary:
      "This project bundled sensor checks, logging, and quick diagnostic tools into a repeatable workflow for lab use.",
    problemAndRequirements:
      "Provide a compact way to verify sensor behavior, capture traces, and reduce setup time during development.",
    systemArchitecture:
      "The system combines microcontroller acquisition with lightweight desktop analysis scripts so measurements can be checked immediately.",
    architectureDiagrams: [placeholderDiagram],
    technicalDecisions: [
      {
        title: "Fast diagnostics over full automation",
        decision: "Optimize for quick checks and clear visibility rather than a large all-purpose app.",
        alternativesConsidered: "Build a single heavy desktop tool.",
        reasoning: "The workflow needed to stay fast enough for daily lab use.",
      },
      {
        title: "Scriptable analysis layer",
        decision: "Keep the analysis side in small scripts that can be reused and modified quickly.",
        alternativesConsidered: "Hard-code all analysis into firmware.",
        reasoning: "The team needed flexibility while prototypes were still changing.",
      },
    ],
    validationResults: [
      { test: "Sensor interface smoke test", outcome: "Quickly identified wiring and signal issues." },
      { test: "Repeated logging runs", outcome: "Produced consistent traces across back-to-back runs." },
    ],
    failuresAndLessons: [
      {
        title: "Feature creep in the analysis scripts",
        whatHappened: "The tool started growing into a generic app and became harder to maintain.",
        rootCause: "No hard boundary was set between quick checks and long-term tooling.",
        resolved: true,
        resolutionOrNextStep: "Split the diagnostics workflow from the experiment notebooks.",
      },
    ],
    whatsNext: "Keep the diagnostics focused and add a few more sensor-specific adapters as needed.",
    links: [{ label: "Reference notes", url: "#", isPlaceholder: true }],
    technicalReport: {
      available: false,
      pdfPath: "/reports/test-equipment-suite.pdf",
      description: "Internal notes on the diagnostic toolkit.",
    },
    featured: true,
  },
];
