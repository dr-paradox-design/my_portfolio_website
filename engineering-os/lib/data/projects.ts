import type { Project } from "./projects-full";

const placeholderHeroImage = {
  src: "/images/placeholders/project-hero.jpg",
  alt: "Placeholder project hero image",
  isPlaceholder: true,
};

const placeholderDiagram = {
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