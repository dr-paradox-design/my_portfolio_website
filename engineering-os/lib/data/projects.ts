import type { Project } from "@/types/project";

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
    summary:
      "Firmware, sensor fusion, and 6-DOF control stack for an autonomous underwater vehicle — global podium at SAUVC 2026.",
    domainTags: ["Robotics", "Control Theory", "Embedded Systems"],
    technologies: ["RP2350", "ROS2", "EKF", "C++", "MATLAB", "VectorNav VN-200", "Teledyne DVL"],
    heroImage: placeholderHeroImage,
    executiveSummary:
      "Tiburon is NIT Rourkela's autonomous underwater vehicle. As team captain and firmware lead I owned the low-level stack: RP2350 firmware, the sensor interfaces, the state estimator, and the 6-DOF control and thrust-allocation chain that turns a desired motion into eight thruster commands. The vehicle took a global podium place at SAUVC 2026.",
    problemAndRequirements:
      "An AUV has no GPS and no reliable external reference once it submerges. The vehicle had to estimate its own pose from onboard sensing alone, hold depth and heading against drag and buoyancy trim, and accept high-level motion commands — all while running on a microcontroller, underwater, with no opportunity to debug mid-run.",
    systemArchitecture:
      "A RP2350 running C++ on the Arduino-Pico core handles the real-time loop. Attitude comes from a VectorNav VN-200 AHRS; a Teledyne DVL supplies bottom-lock velocity over RS-232 through a MAX3232 level shifter; a pressure sensor gives depth through a lowpass filter. A 9-state Extended Kalman Filter fuses DVL velocity and pressure depth into a position estimate. Cascaded PID loops close the 6-DOF control problem, with Fossen feedforward compensating the hydrodynamic model, and a pseudo-inverse thrust-allocation stage maps the resulting force/torque wrench onto eight thrusters. ROS2 handles mission-level orchestration and logging above the firmware.",
    architectureDiagrams: [placeholderDiagram],
    technicalDecisions: [
      {
        title: "Force/torque PID output instead of direct per-thruster PWM",
        decision:
          "The PID loops output a 6-DOF force/torque wrench, which a separate allocation stage converts into individual thruster commands.",
        alternativesConsidered:
          "Running an independent PID per thruster, or hand-mapping each control axis directly to PWM values.",
        reasoning:
          "Separating control from geometry means the controller is tuned in physical units and stays valid if a thruster is remounted or the frame changes — only the allocation matrix has to be regenerated. Per-thruster PID would have coupled the tuning to the mechanical layout.",
      },
      {
        title: "Pseudo-inverse thrust allocation over a hand-tuned mixing table",
        decision:
          "Build the 6×8 B-matrix from thruster positions and directions, then allocate using its Moore-Penrose pseudo-inverse, computed via SVD in MATLAB.",
        alternativesConsidered:
          "A hand-tuned mixing table mapping each axis to thruster percentages.",
        reasoning:
          "Eight thrusters driving six degrees of freedom is an overactuated system, so the mapping is underdetermined. The pseudo-inverse picks the minimum-norm solution, which spreads effort across thrusters instead of saturating a few. SVD also exposes how well-conditioned the geometry is — a hand-tuned table hides that entirely.",
      },
      {
        title: "Model-based feedforward alongside feedback control",
        decision:
          "Add a Fossen hydrodynamic-model feedforward term on top of the cascaded PID loops.",
        alternativesConsidered: "Pure feedback PID, tuned more aggressively to compensate.",
        reasoning:
          "Drag and added-mass effects underwater are large and reasonably predictable. Feedback alone only reacts after error has already accumulated, and pushing the gains high enough to hide that invites oscillation. Feedforward supplies the predictable part of the effort so the feedback loop only has to absorb what the model misses.",
      },
      {
        title: "RS-232 DVL interface through a MAX3232 level shifter",
        decision:
          "Interface the Teledyne DVL to the microcontroller UART over RS-232 via a MAX3232 transceiver.",
        alternativesConsidered: "Driving the DVL's serial lines directly from MCU logic pins.",
        reasoning:
          "The DVL speaks true RS-232 signalling levels while the RP2350 UART is 3.3V logic. Connecting them directly would misread frames at best and damage the pin at worst, so the level shifter is a correctness requirement rather than a convenience.",
      },
    ],
    validationResults: [
      {
        test: "Yaw-axis step response, tested in isolation",
        outcome:
          "Yaw converged without sustained oscillation once the cascaded gains were tuned; used as the reference case before enabling the remaining axes.",
      },
      {
        test: "EKF replay against logged DVL and pressure data",
        outcome:
          "The estimator stayed stable through recorded runs, including stretches where DVL bottom-lock dropped out.",
      },
      {
        test: "Thrust allocation sign and saturation sweep across all eight thrusters",
        outcome:
          "Commanded wrenches produced the expected direction on every thruster, and saturation behaved predictably at the limits.",
      },
      {
        test: "SAUVC 2026 competition runs",
        outcome: "The vehicle completed competition runs and finished on the global podium.",
      },
    ],
    failuresAndLessons: [
      {
        title: "Uncompensated reaction torque in thrust allocation",
        whatHappened:
          "Commanding pure translation produced a small but repeatable unwanted yaw.",
        rootCause:
          "The B-matrix models the thrust vector each motor produces, but not the reaction torque it exerts about its own axis. Those reaction terms do not cancel for the current thruster layout, so they show up as a net yaw the controller never asked for.",
        resolved: false,
        resolutionOrNextStep:
          "Extend the B-matrix with per-thruster reaction-torque terms so allocation cancels them directly, rather than leaving the yaw loop to fight a disturbance it cannot see.",
      },
      {
        title: "Low-frequency drift in heading estimate",
        whatHappened: "The attitude estimate slowly wandered during long test runs.",
        rootCause: "Likely bias accumulation from IMU drift and imperfect calibration.",
        resolved: false,
        resolutionOrNextStep:
          "Tighten the calibration procedure and re-check sensor bias compensation against logged runs.",
      },
    ],
    whatsNext:
      "Fold reaction-torque terms into the allocation matrix, replace the ad-hoc calibration step with a repeatable field procedure, and improve telemetry so post-run analysis does not depend on reproducing a fault on the bench.",
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
    summary:
      "Mixed-signal acquisition board: 6-layer PCB, Verilog SAR control FSM, and DMA-driven STM32 capture firmware.",
    domainTags: ["Hardware", "FPGA", "Data Acquisition"],
    technologies: ["STM32", "Verilog", "6-layer PCB", "DMA", "SPI", "FFT"],
    heroImage: placeholderHeroImage,
    executiveSummary:
      "A board-level mixed-signal project built around a successive-approximation ADC: a 6-layer PCB carrying the analog front end, a Verilog finite state machine sequencing the conversion, and STM32 firmware moving samples out over DMA. Spectral analysis of captured data was used to benchmark front-end revisions.",
    problemAndRequirements:
      "SAR conversion is timing-critical — each bit trial has to settle before the comparator is sampled, and the sequence must be deterministic. The platform needed to drive that sequence reliably, stream results without dropping samples, and keep the analog path clean enough that the measurements reflected the front end rather than digital noise coupling into it.",
    systemArchitecture:
      "The 6-layer stackup separates the analog front end and its signal conditioning from the digital section, with the layer budget spent on isolation rather than density. A Verilog FSM on the FPGA drives the SAR conversion sequence cycle by cycle. STM32 firmware handles the SPI capture path and uses DMA to move samples into memory without CPU involvement. Captured records are analysed offline with FFT and spectral tooling to characterise each board revision.",
    architectureDiagrams: [placeholderDiagram],
    technicalDecisions: [
      {
        title: "SAR sequencing as a Verilog FSM rather than in MCU firmware",
        decision:
          "Implement the conversion state machine in Verilog on the FPGA, leaving the STM32 responsible only for capture and transport.",
        alternativesConsidered:
          "Bit-banging the SAR sequence from MCU firmware, or driving it from a timer interrupt.",
        reasoning:
          "Each bit trial needs cycle-accurate timing with a settling window that does not vary. An MCU running other work introduces jitter from interrupts and bus contention, and that jitter shows up directly as conversion error. An FSM in fabric gives deterministic timing by construction.",
      },
      {
        title: "DMA-driven capture path instead of CPU polling",
        decision: "Use DMA for sample transfer rather than polling or per-sample interrupts.",
        alternativesConsidered: "Busy-wait loops, or an interrupt per completed conversion.",
        reasoning:
          "Polling wastes cycles and, worse, makes acquisition timing depend on whatever else the firmware is doing. At sustained rates a per-sample interrupt would spend most of its time in entry and exit overhead. DMA decouples transfer from execution entirely.",
      },
      {
        title: "6-layer stackup prioritising isolation over compactness",
        decision:
          "Spend the extra layers on separating analog and digital domains rather than routing the design more densely.",
        alternativesConsidered: "A cheaper 2- or 4-layer board with a tighter layout.",
        reasoning:
          "For a measurement instrument, signal integrity is the product. A denser board that couples digital switching noise into the front end produces numbers that characterise the layout mistake instead of the converter.",
      },
    ],
    validationResults: [
      {
        test: "Sustained bench acquisition",
        outcome: "Captured continuously without buffer overruns on the DMA path.",
      },
      {
        test: "FFT and spectral analysis of captured records",
        outcome:
          "Spectra were used to compare front-end revisions against each other and confirm that layout changes moved the noise floor in the expected direction.",
      },
      {
        test: "Power and reset cycling",
        outcome: "The board came up cleanly and repeatably after repeated restarts.",
      },
    ],
    failuresAndLessons: [
      {
        title: "Noisy readings during early bring-up",
        whatHappened: "Initial captures showed unstable values on the bench.",
        rootCause:
          "Grounding and return-path choices in the first layout revision were too optimistic — the digital section was coupling into the analog front end.",
        resolved: true,
        resolutionOrNextStep:
          "Split the layout review into separate analog and digital passes before committing the next spin, instead of reviewing the board as a single artifact.",
      },
    ],
    whatsNext:
      "Add a repeatable calibration routine and a richer logging pipeline so measurements can be compared across board revisions without reprocessing raw captures by hand.",
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
    summary:
      "ROS2 navigation stack for an indoor warehouse drone, developed simulation-first in Gazebo for e-Yantra.",
    domainTags: ["Robotics", "ROS2", "Simulation"],
    technologies: ["ROS2", "Gazebo", "Python", "Raspberry Pi", "systemd"],
    heroImage: placeholderHeroImage,
    executiveSummary:
      "An indoor autonomy stack for a warehouse-style drone, built for the e-Yantra competition. Navigation and mission logic were developed against a Gazebo model first, then deployed to a headless Raspberry Pi, with ROS2 node boundaries chosen so individual pieces could be tested and replaced independently.",
    problemAndRequirements:
      "Indoor flight rules out GPS and leaves little room for error — a failed waypoint means a collision, not a slow drift. The stack needed repeatable waypoint navigation in a constrained environment, mission logic that could be exercised without risking hardware, and a deployment story that survived running unattended on an embedded board.",
    systemArchitecture:
      "ROS2 nodes split sensing, planning, and control across separate processes communicating over topics, with launch files and parameter servers holding the configuration so behaviour could be retuned without touching code. A Gazebo model of the warehouse environment provides repeatable test scenarios. On hardware, the stack runs headless on a Raspberry Pi with Python nodes supervised as systemd services.",
    architectureDiagrams: [placeholderDiagram],
    technicalDecisions: [
      {
        title: "Simulation-first development in Gazebo",
        decision:
          "Model the drone and warehouse environment in Gazebo and validate navigation there before flying hardware.",
        alternativesConsidered: "Direct hardware bring-up with iterative field testing.",
        reasoning:
          "Indoor autonomy failures are expensive and hard to diagnose — a crash destroys both the airframe and the evidence. Simulation makes a scenario replayable, so a bug can be reproduced exactly instead of inferred from wreckage.",
      },
      {
        title: "Modular ROS2 node boundaries over a monolithic controller",
        decision:
          "Split sensing, planning, and control into separate nodes with explicit message interfaces, configured through launch files and parameter servers.",
        alternativesConsidered: "A single control script owning the whole loop.",
        reasoning:
          "Separate nodes can be tested in isolation, swapped for stubs, and observed live on their topics. Parameters living outside the code means retuning does not require a rebuild or a redeploy.",
      },
      {
        title: "Headless deployment as systemd services",
        decision:
          "Run the Python nodes as systemd services on a headless Raspberry Pi rather than launching them from an interactive session.",
        alternativesConsidered: "Starting the stack manually over SSH for each run.",
        reasoning:
          "A manually started stack dies with the SSH session and depends on someone remembering the right startup order. systemd handles ordering, restart-on-failure, and log capture, which matters when the drone is running unattended.",
      },
    ],
    validationResults: [
      {
        test: "Repeated waypoint replay in simulation",
        outcome: "The same mission ran repeatably across runs, making regressions visible.",
      },
      {
        test: "Node restart handling",
        outcome: "Control services recovered after individual processes were killed and restarted.",
      },
    ],
    failuresAndLessons: [
      {
        title: "Tight coupling in the first implementation",
        whatHappened: "A single node failing could stall the entire stack during testing.",
        rootCause:
          "Too much logic lived in one process early on, so there was no isolation boundary for a fault to stop at.",
        resolved: true,
        resolutionOrNextStep:
          "Refactored into smaller nodes with explicit message boundaries, which contained failures to the node that caused them.",
      },
    ],
    whatsNext:
      "Carry the same node structure onto a more realistic indoor flight controller and extend the simulation environment to cover the failure cases currently only reachable on hardware.",
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
    summary:
      "ESP32-based lab instrumentation — oscilloscope capture, isolated AC voltage sensing, and scriptable analysis.",
    domainTags: ["Embedded Systems", "Instrumentation", "Tooling"],
    technologies: ["ESP32", "Python", "MATLAB", "ZMPT101B", "Signal Conditioning"],
    heroImage: placeholderHeroImage,
    executiveSummary:
      "A set of lab instruments built on the ESP32 — oscilloscope-style capture and AC voltage measurement through a ZMPT101B sensor — paired with host-side Python and MATLAB analysis. The goal was to cut the setup time between suspecting a problem and having a trace that shows it.",
    problemAndRequirements:
      "Debugging embedded hardware in a student lab means waiting for shared bench instruments or working without them. The suite needed to verify sensor behaviour, capture traces on demand, and stay fast enough that reaching for it was quicker than reaching for the alternative.",
    systemArchitecture:
      "An ESP32 handles acquisition, with signal conditioning ahead of its ADC to bring inputs into range. AC line voltage is measured through a ZMPT101B transformer-based sensor. Captured data is streamed to a host, where small Python scripts and MATLAB handle analysis and plotting rather than the firmware trying to do it in place.",
    architectureDiagrams: [placeholderDiagram],
    technicalDecisions: [
      {
        title: "Transformer-based voltage sensing instead of a resistive divider",
        decision: "Measure AC voltage through a ZMPT101B sensor module.",
        alternativesConsidered: "A resistive divider feeding the ESP32 ADC directly.",
        reasoning:
          "A plain divider leaves the measurement circuit galvanically tied to the line, which puts mains potential on the microcontroller ground. The ZMPT101B's transformer provides isolation, making the measurement safe to reference against the ESP32 rather than merely scaled correctly.",
      },
      {
        title: "Host-side analysis over on-device processing",
        decision:
          "Keep the firmware focused on acquisition and transport, and do analysis in Python and MATLAB on the host.",
        alternativesConsidered: "Implementing filtering and measurement math on the ESP32 itself.",
        reasoning:
          "Analysis changed constantly while prototypes were in flux. Editing a script and re-running against an existing capture is a far shorter loop than reflashing, and it means old captures can be re-analysed with new logic.",
      },
      {
        title: "Fast diagnostics over general-purpose tooling",
        decision:
          "Optimise for quick checks and immediate visibility rather than building one comprehensive instrument application.",
        alternativesConsidered: "A single heavier desktop tool covering every measurement case.",
        reasoning:
          "The suite only earns its place if using it is faster than the alternative. A general-purpose tool would have been more capable and less used.",
      },
    ],
    validationResults: [
      {
        test: "Sensor interface smoke test",
        outcome: "Surfaced wiring and signal-level problems quickly during bring-up of other projects.",
      },
      {
        test: "Repeated logging runs",
        outcome: "Produced consistent traces across back-to-back runs on the same input.",
      },
    ],
    failuresAndLessons: [
      {
        title: "Feature creep in the analysis scripts",
        whatHappened:
          "The tooling started growing toward a general-purpose application and became harder to maintain than the problems it was solving.",
        rootCause:
          "No boundary was ever drawn between quick diagnostics and long-term experiment tooling, so every new need was absorbed into the same codebase.",
        resolved: true,
        resolutionOrNextStep:
          "Split the fast diagnostics path from the experiment notebooks, and kept the diagnostics side deliberately small.",
      },
    ],
    whatsNext:
      "Keep the diagnostics workflow narrow and add sensor-specific adapters only when a real bring-up needs one.",
    links: [{ label: "Reference notes", url: "#", isPlaceholder: true }],
    technicalReport: {
      available: false,
      pdfPath: "/reports/test-equipment-suite.pdf",
      description: "Internal notes on the diagnostic toolkit.",
    },
    featured: true,
  },
];
