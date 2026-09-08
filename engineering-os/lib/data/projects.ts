import type { ProjectDetail } from "@/types/project";

/**
 * Long-form content for the projects that have been written up, keyed by
 * the `slug` on their `WorkItem` in `lib/data/portfolio.ts`.
 *
 * This is a *sidecar*, not an inventory — identity, routing, photos, and
 * technologies all live on the work item. Only set `title`, `summary`, or
 * `technologies` here when the case study genuinely says it better than the
 * work item does; duplicating them means two places to edit and one of them
 * will go stale.
 *
 * There is no placeholder hero image and no placeholder diagram. There used
 * to be, and all four pages opened with an identical dashed grey box, which
 * told a reader nothing except that the site was unfinished. A section with
 * no content now renders as no section at all.
 */
export const projectDetails: ProjectDetail[] = [
  {
    slug: "tiburon-auv",
    summary:
      "Firmware, sensor fusion, and 6-DOF control stack for an autonomous underwater vehicle — global podium at SAUVC 2026.",
    domainTags: ["Robotics", "Control Theory", "Embedded Systems"],
    executiveSummary:
      "Tiburon is NIT Rourkela's autonomous underwater vehicle. As team captain and firmware lead I owned the low-level stack: RP2350 firmware, the sensor interfaces, the state estimator, and the 6-DOF control and thrust-allocation chain that turns a desired motion into eight thruster commands. The vehicle took a global podium place at SAUVC 2026.",
    problemAndRequirements:
      "An AUV has no GPS and no reliable external reference once it submerges. The vehicle had to estimate its own pose from onboard sensing alone, hold depth and heading against drag and buoyancy trim, and accept high-level motion commands — all while running on a microcontroller, underwater, with no opportunity to debug mid-run.",
    systemArchitecture:
      "A RP2350 running C++ on the Arduino-Pico core handles the real-time loop. Attitude comes from a VectorNav VN-200 AHRS; a Teledyne DVL supplies bottom-lock velocity over RS-232 through a MAX3232 level shifter; a pressure sensor gives depth through a lowpass filter. A 9-state Extended Kalman Filter fuses DVL velocity and pressure depth into a position estimate. Cascaded PID loops close the 6-DOF control problem, with Fossen feedforward compensating the hydrodynamic model, and a pseudo-inverse thrust-allocation stage maps the resulting force/torque wrench onto eight thrusters. ROS2 handles mission-level orchestration and logging above the firmware.",
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
  },
  {
    slug: "fpga-sensor-fusion",
    domainTags: ["FPGA", "Digital Design", "Sensor Fusion"],
    executiveSummary:
      "The interesting part of this project is where the line was drawn. Serial protocol timing — UART framing for a NMEA GPS, a full I2C transaction engine for an MPU6050 — was pushed down into Verilog as two custom AXI4-Lite peripherals, so the processor reads a register instead of a waveform. Everything above that line stayed in C on the Zynq's ARM cores: the drivers, a complementary filter for attitude, and a pair of 1-D Kalman filters for North and East position. The result holds a 100 Hz loop in about 1.4% of the device's logic, and it was walked around a field rather than declared finished at the end of simulation.",
    problemAndRequirements:
      "The two sensors speak incompatible protocols at incompatible rates: the GPS streams asynchronous NMEA sentences over UART at roughly 1 Hz, while the IMU is polled over I2C at hundreds of hertz. Bit-banging both from software would have put protocol timing at the mercy of whatever else the processor was doing, and the fusion loop needs a trustworthy time step more than it needs raw speed. The requirement was deterministic sensor access — the processor should read a register, never a waveform.",
    systemArchitecture:
      "A ZYNQ7 processing system connects through an AXI Interconnect to two custom IP blocks in the programmable logic. The GPS controller is a UART receiver and transmitter with FIFO buffering behind a register map; the IMU controller is an I2C master stack — bit engine, byte engine, and a data controller handling MPU6050 initialisation, burst fetch, and an interrupt-aware ready/acknowledge handshake. On the software side, C drivers hide the register layout behind a two-call fetch-and-update API, and the fusion stack above them runs a complementary filter for orientation (gyro integration corrected by accelerometer tilt) and two independent 1-D Kalman filters for North and East position. Body-frame acceleration is rotated into the Earth frame using the current attitude before it becomes a prediction input.",
    architectureDiagrams: [
      {
        src: "/projects/sensorfusion-block-diagram.webp",
        alt: "Vivado IP integrator block design. A ZYNQ7 Processing System block on the left drives an AXI Interconnect, which fans out to two custom blocks: gps_controller_0, with uart_rx_pin and uart_tx_pin brought to external ports, and imu_controller_0, with scl and sda brought out. A Processor System Reset block feeds the reset lines, and the PS exposes DDR and FIXED_IO externally.",
        caption:
          "The Vivado block design: both custom IPs sit behind the AXI interconnect, so the processor sees registers rather than protocol timing.",
      },
    ],
    technicalDecisions: [
      {
        title: "Protocol timing in fabric, estimation in C",
        decision:
          "Put the UART and I2C engines in programmable logic as AXI4-Lite IP, and leave the complementary filter and Kalman filters as C running on the ARM cores.",
        alternativesConsidered:
          "Bit-banging both protocols from software on the PS, or pushing the filter maths into the fabric as well.",
        reasoning:
          "The split follows where determinism actually matters. Serial framing is unforgiving about timing and trivially parallel, which is what fabric is good at; the fusion maths is floating point, changed constantly during tuning, and runs at 100 Hz — a rate a processor meets without effort. Hardening the filters would have bought no headroom and made every gain change a resynthesis.",
      },
      {
        title: "Freeze position under ZUPT instead of tracking GPS while stationary",
        decision:
          "Gate the estimator with a Zero-Velocity Update: when gyro rates are under 1.0 deg/s on all axes and Earth-frame acceleration is under 0.30 m/s² on both horizontal axes, force the Kalman velocities to zero, zero the prediction input, and skip the GPS correction entirely.",
        alternativesConsidered:
          "Continuing to apply GPS updates at standstill, which is what the filter would otherwise do with a perfectly valid fix.",
        reasoning:
          "A stationary GPS receiver does not report a stationary position — multipath makes the fix wander, measured here at up to 0.45 m. Feeding that into the filter converts sensor noise into apparent motion, which is exactly the error a pedestrian-scale system can least afford. When the IMU says the platform is not moving, the IMU is the better witness, so the correct output is a frozen position rather than an honestly-derived wrong one.",
      },
      {
        title: "Reset the loop timestamp on IMU recovery, not just on boot",
        decision:
          "When an IMU fetch fails and re-initialisation succeeds, reset the loop timestamp immediately before the next fusion update; on failed re-init, back off one second before retrying.",
        alternativesConsidered:
          "Letting the loop resume with its existing timestamp and computing the time step normally.",
        reasoning:
          "The time step is a multiplier on every integration in the stack. A recovery that takes a second and then reports it as one loop interval injects a time step roughly two orders of magnitude too large, and the filter integrates that into a position jump that it has no way to undo. Resetting the timestamp discards the outage instead of pretending it was a sample.",
      },
    ],
    validationResults: [
      {
        test: "Module-level simulation of all six RTL blocks",
        outcome:
          "GPS UART top integration, UART RX, UART TX, I2C bit engine, I2C byte engine and the IMU data controller each ran under their own testbench, with Tcl console pass logs and waveform captures kept as evidence.",
      },
      {
        test: "Vivado implementation timing at 100 MHz",
        outcome:
          "Worst negative slack +3.100 ns and worst hold slack +0.037 ns, both MET.",
      },
      {
        test: "Post-implementation resource utilisation",
        outcome:
          "767 LUTs (1.44%), 1,094 flip-flops (1.03%) and 164 LUTs as distributed RAM (0.94%) on the Zynq-7000.",
      },
      {
        test: "Vivado power estimate",
        outcome: "1.537 W dynamic, 0.141 W device static, 1.678 W total on-chip.",
      },
      {
        test: "Stationary hold with live GPS",
        outcome:
          "Fused local X and Y stayed at 0.00 while the raw GPS fix wandered up to 0.45 m from multipath — the ZUPT gate rejected the updates as intended.",
      },
      {
        test: "Axis isolation under manual rotation",
        outcome:
          "Yaw rotation moved heading, nose-up and nose-down moved pitch, and side tilt moved roll, with the cross-coupling low enough to confirm the configured ENU frame mapping was correct.",
      },
      {
        test: "Large-angle orientation sweep",
        outcome:
          "The complementary filter tracked pitch beyond 150° and roll beyond 90° without losing stability.",
      },
      {
        test: "Outdoor dynamic position test, roughly 50 m",
        outcome:
          "The hardware was walked across a test field with raw GPS and filtered X/Y logged to CSV at 115200 baud. The filtered trajectory followed the walked path with visibly less scatter than the raw fixes, and held position at each standstill.",
      },
    ],
    failuresAndLessons: [
      {
        title: "Yaw has no absolute reference",
        whatHappened:
          "Yaw drifts over a long run in a way roll and pitch do not.",
        rootCause:
          "There is no magnetometer in the build. Roll and pitch are continuously corrected by gravity through the accelerometer, so their gyro drift is bounded. Yaw is rotation about the gravity vector, so the accelerometer says nothing about it, and it is left as a pure integration of gyro Z — which accumulates bias without limit.",
        resolved: false,
        resolutionOrNextStep:
          "Add a magnetometer for an absolute heading reference, or derive a heading correction from GPS course-over-ground once the platform is reliably moving. Until then, yaw should be read as short-term relative rotation, not as a compass bearing.",
      },
      {
        title: "A stale time-step spike after an IMU fetch failure",
        whatHappened:
          "When the IMU dropped out and the driver re-initialised it, the next fusion update ran with a time step covering the whole outage, and the integrators took a large step.",
        rootCause:
          "The recovery path restored the sensor but not the loop's notion of time. The interval was still measured from the last successful sample, so the gap was silently reported to the filter as one very long loop interval.",
        resolved: true,
        resolutionOrNextStep:
          "The loop timestamp is now reset immediately on successful re-initialisation, and a failed re-init backs off for one second before retrying instead of spinning.",
      },
      {
        title: "ZUPT rejects genuine slow motion",
        whatHappened:
          "Motion slower than the ZUPT thresholds is treated as standstill, so position stops updating while the platform is still moving.",
        rootCause:
          "The gate is a fixed threshold on gyro rate and Earth-frame acceleration. It cannot distinguish very slow real motion from sensor noise, because at that scale they are the same size.",
        resolved: false,
        resolutionOrNextStep:
          "Accepted for now — the alternative is drifting on GPS multipath at every standstill, which is the more common case for this platform. A velocity-aware or adaptive threshold would narrow the dead band, at the cost of a harder gate to reason about.",
      },
    ],
    whatsNext:
      "The repository sets out a roadmap for hardening the sensor-fusion IP into an ASIC on the SkyWater 130 nm open PDK — integrating it into an Efabless Caravel user project and taking it through the OpenLane RTL-to-GDSII flow. That is planned work, not work in progress; the design currently exists only on FPGA.",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/dr-paradox-design/AXI4-IP-for-GPS-IMU-Sensor-Fusion",
      },
      {
        label: "Calibration and ZUPT validation (video)",
        url: "https://www.youtube.com/watch?v=hqHYkSqaP-g",
      },
      {
        label: "Dynamic position test (video)",
        url: "https://www.youtube.com/watch?v=Ww-xqwfYFvs",
      },
      {
        label: "Orientation test (video)",
        url: "https://www.youtube.com/watch?v=I062Mg0MvDc",
      },
    ],
  },
  {
    slug: "embedded-sar-adc",
    domainTags: ["Hardware", "FPGA", "Data Acquisition"],
    executiveSummary:
      "A board-level mixed-signal project built around a successive-approximation ADC: a 6-layer PCB carrying the analog front end, a Verilog finite state machine sequencing the conversion, and STM32 firmware moving samples out over DMA. Spectral analysis of captured data was used to benchmark front-end revisions.",
    problemAndRequirements:
      "SAR conversion is timing-critical — each bit trial has to settle before the comparator is sampled, and the sequence must be deterministic. The platform needed to drive that sequence reliably, stream results without dropping samples, and keep the analog path clean enough that the measurements reflected the front end rather than digital noise coupling into it.",
    systemArchitecture:
      "The 6-layer stackup separates the analog front end and its signal conditioning from the digital section, with the layer budget spent on isolation rather than density. A Verilog FSM on the FPGA drives the SAR conversion sequence cycle by cycle. STM32 firmware handles the SPI capture path and uses DMA to move samples into memory without CPU involvement. Captured records are analysed offline with FFT and spectral tooling to characterise each board revision.",
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
  },
  {
    slug: "warehouse-drone",
    domainTags: ["Robotics", "ROS2", "Simulation"],
    executiveSummary:
      "An indoor autonomy stack for a warehouse-style drone, built for the e-Yantra competition. Navigation and mission logic were developed against a Gazebo model first, then deployed to a headless Raspberry Pi, with ROS2 node boundaries chosen so individual pieces could be tested and replaced independently.",
    problemAndRequirements:
      "Indoor flight rules out GPS and leaves little room for error — a failed waypoint means a collision, not a slow drift. The stack needed repeatable waypoint navigation in a constrained environment, mission logic that could be exercised without risking hardware, and a deployment story that survived running unattended on an embedded board.",
    systemArchitecture:
      "ROS2 nodes split sensing, planning, and control across separate processes communicating over topics, with launch files and parameter servers holding the configuration so behaviour could be retuned without touching code. A Gazebo model of the warehouse environment provides repeatable test scenarios. On hardware, the stack runs headless on a Raspberry Pi with Python nodes supervised as systemd services.",
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
  },
  {
    slug: "test-equipment-suite",
    domainTags: ["Embedded Systems", "Instrumentation", "Tooling"],
    executiveSummary:
      "A set of lab instruments built on the ESP32 — oscilloscope-style capture and AC voltage measurement through a ZMPT101B sensor — paired with host-side Python and MATLAB analysis. The goal was to cut the setup time between suspecting a problem and having a trace that shows it.",
    problemAndRequirements:
      "Debugging embedded hardware in a student lab means waiting for shared bench instruments or working without them. The suite needed to verify sensor behaviour, capture traces on demand, and stay fast enough that reaching for it was quicker than reaching for the alternative.",
    systemArchitecture:
      "An ESP32 handles acquisition, with signal conditioning ahead of its ADC to bring inputs into range. AC line voltage is measured through a ZMPT101B transformer-based sensor. Captured data is streamed to a host, where small Python scripts and MATLAB handle analysis and plotting rather than the firmware trying to do it in place.",
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
  },
  {
    slug: "flight-controller-pcb",
    domainTags: ["PCB Design", "Embedded Systems", "Avionics"],
    executiveSummary:
      "A four-layer flight-controller PCB built around an STM32H743, carrying dual redundant IMUs, a barometer, an ESP32-S3 telemetry co-processor, and a power-path chain that runs the board from either the flight battery or USB alone. The schematic and component selection are finished; layout is roughly three-quarters routed, with the board outline and a clean DRC still outstanding, so this is written up as work in progress rather than a finished board.",
    problemAndRequirements:
      "A flight controller has one job that can't fail quietly: knowing the vehicle's attitude. That called for inertial sensing with a fallback if one sensor drifts or drops out, enough I/O to take GPS, an external compass, an RC receiver, and motor/servo PWM without contention, a telemetry/OSD path that couldn't stall the control loop if it misbehaved, and a power input that didn't require the flight battery just to flash firmware on the bench.",
    systemArchitecture:
      "The STM32H743 (LQFP-100) sits at the centre of a 4-layer stack. Two IMUs — a BMI088 and an ICM-42688-P — share one SPI bus with independent chip-selects for redundant, independently-sampled inertial data; a BMP581 barometer is on I2C instead, since it's the slower device of the three. A GPS+external-compass header, two auxiliary I2C headers, an SPI breakout, two spare UARTs, an SBUS/PPM RC input, and ten PWM/timer channels are broken out on dedicated connectors. An ESP32-S3-WROOM module talks to the STM32 over a single UART for telemetry/OSD, and a microSD card sits on its own SPI bus for logging. Power comes from either the flight battery through a TPS54531 synchronous buck or USB-C VBUS; a TI LM66200 dual ideal diode ORs the two resulting 5V rails together before AMS1117 linear regulators derive 3.3V and 1.8V, and a CR2032 coin cell backs up the MCU's VBAT domain. Programming is over SWD through a TC2030 Tag-Connect pogo-pin footprint rather than a soldered header.",
    architectureDiagrams: [
      {
        src: "/projects/flight-controller-io-map.webp",
        alt: "KiCad schematic sheet titled 'peripheral', showing labelled connector groups for PWM (ten headers with TIM1/TIM3/TIM4 channel labels), SBUS/PPM, GPS1 (with MAG_SCL, MAG_SDA, GPS_TX, GPS_RX), I2C_1, I2C_2, SPI, UART1, and UART2",
        caption: "The board's I/O map: PWM/timer outputs, RC input, GPS+compass, I2C, SPI, and UART headers, each on its own connector.",
      },
      {
        src: "/projects/flight-controller-sensors.webp",
        alt: "KiCad schematic sheet titled 'SENSORS', showing a BMP581 barometer on I2C, a BMI088 IMU with separate accelerometer and gyroscope chip-select lines on SPI, and an ICM-42688-P IMU also on SPI, each block annotated with a handwritten note reading 'INTERRUPT IS LEFT!!!'",
        caption: "Dual-IMU sensor sheet — the schematic's own annotation flags all three interrupt lines as not yet wired.",
      },
      {
        src: "/projects/flight-controller-power.webp",
        alt: "KiCad schematic sheet titled 'POWER & USB', showing a TPS54531 buck converter feeding a 5V/5A rail, separate 3.3V and 1.8V regulator sections, a USB Type-C input, and a coin-cell backup block annotated with a handwritten note reading 'we can use supercapacitor also instead of coin'",
        caption: "Power tree: battery and USB rails OR'd together ahead of the 3.3V/1.8V regulators, plus the coin-cell backup.",
      },
    ],
    technicalDecisions: [
      {
        title: "Two IMUs on one SPI bus, independent chip-selects",
        decision:
          "Wire a BMI088 and an ICM-42688-P as two independent SPI devices sharing MOSI/MISO/SCK, each with its own chip-select, and move the barometer to I2C instead.",
        alternativesConsidered:
          "A single IMU, or splitting the two inertial sensors across SPI and I2C to simplify the pinout.",
        reasoning:
          "Attitude error compounds directly into flight stability, so redundant, independently-sampled inertial data was judged worth the extra chip-select pin. SPI is the faster, lower-latency bus of the two available, and the barometer is comparatively slow, so it's the one that moved to I2C rather than the IMUs.",
      },
      {
        title: "ESP32-S3 as a UART co-processor, not wireless on the flight MCU",
        decision:
          "Give the STM32H743 an ESP32-S3-WROOM module on its own UART for telemetry/OSD, instead of running any wireless stack on the flight-critical MCU.",
        alternativesConsidered:
          "A Wi-Fi/Bluetooth-capable MCU series for the main controller, or adding a wireless module directly onto a bus shared with flight sensors.",
        reasoning:
          "Keeping wireless connectivity on a separate chip means a stalled radio stack can't stall the control loop — the two processors only ever exchange whatever fits down a UART.",
      },
      {
        title: "Ideal-diode power ORing so the board runs on USB alone",
        decision:
          "OR the battery-derived 5V rail and the USB-C VBUS rail through a TI LM66200 dual ideal diode before the 3.3V/1.8V linear regulators.",
        alternativesConsidered:
          "A single power input with a manual switch or jumper to pick battery vs. USB.",
        reasoning:
          "Firmware flashing and bench bring-up need to work with no flight battery connected. The ideal-diode OR does that with no moving parts and without either source backfeeding the other.",
      },
      {
        title: "Tag-Connect footprint instead of a soldered SWD header",
        decision: "Bring SWD out on a TC2030 Tag-Connect pogo-pin footprint.",
        alternativesConsidered: "A standard 10-pin ARM SWD header.",
        reasoning:
          "A pogo-pin connector needs no header permanently soldered onto an already dense board, where the header footprint would otherwise be competing with a sensor or a rail for space.",
      },
    ],
    failuresAndLessons: [
      {
        title: "Sensor interrupt lines left unrouted",
        whatHappened:
          "The BMI088, ICM-42688-P, and BMP581 interrupt pins are placed on their symbols but never wired to the MCU — flagged directly on the schematic with a repeated \"INTERRUPT IS LEFT!!!\" note.",
        rootCause:
          "Interrupt routing was deferred while getting the SPI and I2C data paths for all three sensors working first, and the note was left as a reminder rather than resolved at the time.",
        resolved: false,
        resolutionOrNextStep:
          "Wire the three interrupt lines to free MCU GPIOs before finalising the schematic — needed for data-ready-driven sampling instead of polling.",
      },
      {
        title: "No board outline; 336 open DRC violations",
        whatHappened:
          "The PCB has no Edge.Cuts geometry anywhere — every footprint is placed, but the board's physical shape itself was never drawn. A kicad-cli DRC pass currently reports 336 violations (mostly solder-mask bridges, silkscreen overlapping copper or other silkscreen, and footprint/library mismatches from the MCU swap below) and 62 unconnected nets.",
        rootCause:
          "Layout has been worked component-by-component, at roughly three-quarters placed and routed by the project's own status notes, with the mechanical outline and a full DRC pass left for the end of the layout phase instead of done incrementally.",
        resolved: false,
        resolutionOrNextStep:
          "Draw the real board outline, finish routing the remaining nets, then clear the DRC report category by category before ordering prototypes.",
      },
      {
        title: "MCU changed mid-design; filenames and docs didn't follow",
        whatHappened:
          "Every schematic sheet file and the project's own README still refer to an STM32F7, but the part actually placed on the board is an STM32H743 in an LQFP-100 footprint.",
        rootCause:
          "The MCU was swapped to the H7 series after the project was scaffolded around the F7, and the rename never propagated past the schematic symbol itself.",
        resolved: false,
        resolutionOrNextStep:
          "Rename the sheet files and update the README once the layout is finished, so the repository stops telling a different story than the board.",
      },
    ],
    whatsNext:
      "Finish routing the remaining nets, draw the board outline, wire the three sensor interrupt lines, clear the DRC report, then generate Gerbers and order a prototype run for bring-up and testing — none of which has happened yet.",
  },
  {
    slug: "acoustic-processing-stack",
    domainTags: ["Analog Design", "Signal Processing", "Robotics"],
    executiveSummary:
      "Tiburon's acoustic homing needs to pick a 45 kHz continuous-wave pulse out of a piezoelectric hydrophone's output while everything else in the water — thrusters, ESC switching noise, vibration — is trying to drown it out. This is the analog front end that does that: a charge amplifier, an 8th-order Butterworth bandpass filter, and an ADC-facing output buffer, designed and validated in SPICE, then built by hand as a Manhattan-style prototype and brought up on the bench. DSP and Time Difference of Arrival (TDOA) localization on top of this signal are the next phase, not yet started.",
    problemAndRequirements:
      "The target is a ULB-362 underwater locator beacon, which emits a 45 kHz tone burst once a second. At 1 meter, the estimated unconditioned signal at the hydrophone is only tens of millivolts, and a hydrophone's output impedance and cable capacitance make naive voltage amplification gain-dependent on cable length — a problem if the cable run changes between bench and vehicle. The frontend has to reject thruster and EMI noise well outside the 45 kHz band, present a clean, correctly-biased signal to a unipolar ADC, and survive the transition from an idealized SPICE model to real, tolerance-bearing hardware.",
    systemArchitecture:
      "Three cascaded stages. First, a charge amplifier (inverting, with the hydrophone modeled as a voltage source in series with its own capacitance and resistance) converts the hydrophone's charge output into a voltage, which makes the gain independent of cable length — the feedback resistor and capacitor are sized for unity DC gain and 20 dB of midband gain. Second, an 8th-order Butterworth bandpass filter built from two cascaded 2nd-order Multiple Feedback (MFB) high-pass stages and two cascaded 2nd-order MFB low-pass stages isolates a 35–58 kHz passband around the 45 kHz tone. Third, an inverting output buffer restores the signal to be in-phase with the original acoustic wave (the charge amp and filter stages together apply a net 180° shift), biases it to 1.65 V to center it in a unipolar 0–3.3 V ADC window, and a passive RC feedthrough filter ahead of the ADC suppresses sampling kickback and high-frequency EMI.",
    technicalDecisions: [
      {
        title: "Charge amplifier front end instead of a direct voltage amplifier",
        decision:
          "Model the hydrophone as a voltage source behind its own capacitance and resistance, and condition its output with an inverting charge amplifier rather than amplifying the raw sensor voltage directly.",
        alternativesConsidered:
          "A conventional voltage (transimpedance-free) amplifier stage directly on the hydrophone output.",
        reasoning:
          "A charge amplifier's gain is set by the ratio of feedback to sensor capacitance, not by the cable or sensor's absolute impedance, so it stays correct if the hydrophone cable length changes between the bench and the vehicle — a voltage amplifier's gain would drift with exactly that.",
      },
      {
        title: "Component values synthesized computationally against the E6 series, not hand-rounded",
        decision:
          "Write a Python script that sweeps standard E6 capacitor values, solves the MFB design equations for the matching resistors, and rejects any combination that falls outside a practical 1 kΩ–1 MΩ manufacturing range, instead of calculating exact theoretical values and rounding to the nearest stock part afterward.",
        alternativesConsidered:
          "Solving the filter equations for exact theoretical component values, then rounding each to the nearest standard part.",
        reasoning:
          "The two MFB stages needed for the bandpass response run at Q factors up to 1.3, and rounding continuous values post-hoc drifts the center frequency and Q of a high-Q stage much more than the same rounding error would in a low-Q stage. Anchoring the search to real stock values from the start avoids that drift entirely.",
      },
      {
        title: "Manhattan-style build for the first hardware iteration, not a PCB",
        decision:
          "Build the first physical prototype by hand on a copper-clad board scored into isolated copper islands, soldering components point-to-point between islands over a continuous ground plane, rather than laying out and fabricating a PCB first.",
        alternativesConsidered: "Going straight to PCB layout and fabrication before any hardware existed.",
        reasoning:
          "The SPICE model assumes ideal components; a Manhattan build lets the topology be bench-tested and reworked with real hydrophone-driven signals — including a wet test — before committing the tuned component values to a fixed board layout that's expensive to iterate on.",
      },
    ],
    validationResults: [
      {
        test: "Charge amplifier AC sweep",
        outcome:
          "Simulated midband gain of 19.74 dB against a 20.00 dB target (1.28% error), with upper and lower -3 dB corners landing within 2.6–3.7% of their theoretical values.",
      },
      {
        test: "Full-chain AC sweep across the 35–58 kHz passband",
        outcome:
          "Peak gain came in 7.75% below target (18.45 dB vs. 20.00 dB) and both passband edges landed within about 4–8% of their 35/58 kHz targets, but the resulting -3 dB bandwidth was 28.18 kHz against a 23.00 kHz target — a 22.5% overshoot, the largest error in the whole AC analysis.",
      },
      {
        test: "Transient response and phase check",
        outcome:
          "The output tracked the input in phase (after the deliberate 180° restoration in the buffer stage) and sat centered on the 1.65 V bias, at 788.7 mV peak-to-peak against a 950 mV theoretical amplitude.",
      },
      {
        test: "Harmonic rejection with 90 kHz and 135 kHz interferers injected",
        outcome: "The filter stripped both injected harmonics, leaving a clean 45 kHz tone at the output.",
      },
      {
        test: "10,000-run Monte Carlo tolerance sweep (Gaussian, 1% resistors / 5% capacitors)",
        outcome:
          "Worst-case channel-to-channel phase spread at 45 kHz came out to 27°, which the design's own analysis judged workable for short-range passive acoustic localization but non-trivial for TDOA timing precision.",
      },
      {
        test: "Bench bring-up of the Manhattan-style build",
        outcome:
          "The hand-built prototype, powered from a battery/buck-boost supply, produced a captured waveform on the oscilloscope confirming the stage chain is alive end-to-end; a basin (wet) test with the assembled frontend has also been run as a first check outside dry-bench conditions.",
      },
    ],
    failuresAndLessons: [
      {
        title: "-3 dB bandwidth overshot its target by 22.5%",
        whatHappened:
          "The simulated passband came out to 28.18 kHz wide against a 23.00 kHz design target — by far the largest error of any measured AC parameter, well beyond the 1.28–8.4% errors everywhere else in the same analysis.",
        rootCause:
          "The bandpass filter's two MFB stages run at Q factors up to 1.3, and high-Q MFB stages are inherently more sensitive to passive component tolerance than low-Q ones — the 1%/5% resistor and capacitor tolerances used compound across four cascaded 2nd-order stages instead of averaging out.",
        resolved: false,
        resolutionOrNextStep:
          "Tighter-tolerance components, or re-deriving the filter with a Leapfrog topology (which is inherently less tolerance-sensitive than cascaded MFB stages), are the two directions flagged for reducing this before it becomes a hardware problem.",
      },
      {
        title: "Group delay was never optimized for, and it shows",
        whatHappened:
          "The simulated chain carries roughly 9 µs of group delay, which a Butterworth response — chosen for its maximally flat magnitude and steep rolloff — does not control for.",
        rootCause:
          "Butterworth was picked to guarantee stopband rejection of thruster and EMI noise well outside 45 kHz, and that objective was prioritized over phase linearity at design time.",
        resolved: false,
        resolutionOrNextStep:
          "A Bessel-Butterworth hybrid filter is the planned fix — it trades some of the current stopband steepness for a flatter group delay, which matters directly once TDOA localization starts timing arrivals across channels.",
      },
      {
        title: "Hardware is still a hand-built prototype, not a fabricated board",
        whatHappened:
          "The only physical version of this frontend that exists is the Manhattan-style build: components soldered point-to-point onto copper islands, with no solder mask, no controlled trace impedance, and no fixed component placement.",
        rootCause:
          "SPICE validation was the deliverable at the design stage; PCB fabrication was deliberately deferred so the topology and tuned component values could be proven point-to-point first, where a wiring mistake costs a rework instead of a re-fabrication.",
        resolved: false,
        resolutionOrNextStep:
          "Lay out and fabricate a PCB once the Manhattan build's bring-up and wet testing are fully characterized, to get a real read on noise performance the hand-built ground plane can't guarantee.",
      },
    ],
    whatsNext:
      "PCB layout to replace the Manhattan prototype, a Bessel-Butterworth hybrid redesign to fix the group delay, tighter-tolerance or Leapfrog-topology component selection to close the bandwidth gap, and — once the analog front end is trusted — the DSP and Time Difference of Arrival (TDOA) localization work on FPGA that this whole stack exists to feed.",
  },
  {
    slug: "pipelined-risc-v",
    domainTags: ["Digital Design", "Computer Architecture", "RTL Verification"],
    executiveSummary:
      "A from-scratch RV32I processor core in Verilog, built deliberately in two stages: first a working Harris & Harris-style single-cycle datapath, then a 5-stage pipeline (IF-ID-EX-MEM-WB) cut from that same datapath by inserting pipeline registers between its stages. Both cores pass the same 12-check self-checking regression — they differ in schedule, not in what the program computes. The pipeline currently has no forwarding, hazard detection, or flush logic; every hazard is scheduled by hand in the test program, which is a deliberate sequencing choice, not an oversight.",
    problemAndRequirements:
      "The goal was to understand pipelining by building it, not by reading about it: take a functionally-correct single-cycle RV32I core and turn it into a 5-stage pipeline without changing a single line of the functional units it's built from, so that any bug introduced while pipelining is provably a pipelining bug and not a datapath bug. Both cores need to support the same instruction subset (R-type arithmetic, addi, lw, sw, beq) and pass the same assertions, so the pipeline is checked against the single-cycle core's own behavior rather than an external reference.",
    systemArchitecture:
      "The single-cycle datapath (`single_core/`) is Harris & Harris-style: PC, PC+4 and branch adders, instruction memory, a 32x32 register file, sign extension, an ALU, data memory, and a control unit split into a main decoder and an ALU decoder. The pipeline (`src/`) reuses every one of those modules unmodified and separates five stage modules (Fetch, Decode, Execute, Memory, Writeback) with four pipeline registers (IF/ID, ID/EX, EX/MEM, MEM/WB). Every signal carries a stage-suffix letter (F/D/E/M/W), so a value's name changes the moment it crosses a pipeline register — RD2E and RD2M are the same wire one cycle apart. Two paths run backwards against the pipeline's forward flow: the branch decision (resolved in EX, needed in IF) and the register writeback (committed in WB, needed in ID) — and because neither has hardware support yet, both costs are currently paid in software as NOPs in the test program.",
    technicalDecisions: [
      {
        title: "Single-cycle modules frozen and reused unmodified for the pipeline",
        decision:
          "Build the pipeline's five stage modules entirely out of the existing single-cycle modules (ALU, register file, control unit, decoders, memories), without editing a single line of them.",
        alternativesConsidered:
          "Writing pipeline-specific versions of the datapath modules, or refactoring them as the pipeline was built.",
        reasoning:
          "Pipelining a processor doesn't change its functional units, it puts registers between them. Keeping the single-cycle modules frozen means any pipeline failure is provably a pipelining bug rather than a reintroduced functional bug, which matters a lot when the two cores are being cross-checked against each other.",
      },
      {
        title: "Software-scheduled NOPs before any hazard hardware",
        decision:
          "Get the four pipeline registers and both backward paths working first, with every data and control hazard scheduled by hand as NOPs in the test program, before writing any forwarding, hazard-detection, or flush logic.",
        alternativesConsidered:
          "Building the hazard-detection unit, forwarding paths, and branch-flush logic as part of the same pass that added the pipeline registers.",
        reasoning:
          "A fully software-scheduled pipeline has a completely predictable, hand-derivable timing model, which makes it possible to verify the pipeline registers and backward paths are wired correctly in isolation. Forwarding and flushing are additive on top of that once it is proven right — building them at the same time would have made a register-boundary bug and a hazard-logic bug indistinguishable.",
      },
      {
        title: "Branch target computed in EX, not IF or ID",
        decision:
          "Move the branch-target adder from fetch (where the single-cycle core has it) into the execute stage, alongside the branch decision itself.",
        alternativesConsidered:
          "Keeping the branch adder in IF or ID and forwarding just the resolved target back to fetch separately from the decision.",
        reasoning:
          "The branch target needs the sign-extended immediate, which doesn't exist until decode, and the branch decision needs the ALU comparison, which doesn't exist until execute. Computing both in EX means only one backward bundle (target and decision together) has to route up to fetch, instead of two separate backward paths.",
      },
      {
        title: "Control unit reused via a tied-high zero input, not rewritten per stage",
        decision:
          "Instantiate the unmodified single-cycle `Control_Unit_Top` with its `zero` port tied to `1'b1`, so it emits the raw branch-opcode bit, then complete the actual branch test in EX as `PCSrcE = BranchE & ZeroE` once the real zero flag exists.",
        alternativesConsidered:
          "Writing a pipeline-specific decoder that splits branch-condition logic across stages explicitly.",
        reasoning:
          "This keeps the single-cycle control unit frozen (consistent with the first decision) while correctly relocating the zero-flag test to the stage where the flag is actually computed. It reads the same as the single-cycle core's old genuine bug — zero hardcoded to a constant — so it's called out explicitly in the RTL comments to distinguish deliberate reuse from a regression.",
      },
    ],
    validationResults: [
      {
        test: "Single-cycle self-checking regression (12 assertions)",
        outcome:
          "All 12 checks pass, covering R-type (add/sub/and/or/slt), I-type (addi/lw), S-type (sw), and B-type (beq, both taken and not-taken) instructions against expected final register values.",
      },
      {
        test: "5-stage pipeline self-checking regression (same 12 assertions)",
        outcome:
          "The pipelined core passes the identical 12 checks over its own, longer, NOP-padded schedule — confirming the pipeline registers and both backward paths preserve program behavior, not just throughput.",
      },
      {
        test: "3-NOP data-hazard rule, verified experimentally rather than only derived",
        outcome:
          "Rebuilding the pipelined program with only 2 NOPs between a dependent instruction pair produced x3 = 5 instead of the expected 8 — one operand read correctly, the other stale — which is exactly the failure signature the clock-cycle derivation predicts, confirming the 3-NOP requirement is real and not just a paper calculation.",
      },
      {
        test: "Branch resolution regression, before and after the single-cycle fix",
        outcome:
          "With the ALU's zero flag wired through and the branch adder and PC-source mux added, both the taken and not-taken beq paths produce the expected register state (x10/x11/x12) on both cores.",
      },
    ],
    failuresAndLessons: [
      {
        title: "Branch resolution was silently broken in the first single-cycle build",
        whatHappened:
          "beq decoded correctly but never redirected fetch: the ALU's zero flag was left unconnected, the control unit hardcoded zero to 0, and there was no branch-target adder or PC-source mux at all — the PC only ever advanced by PC+4, so every branch behaved as not-taken regardless of the comparison.",
        rootCause:
          "The control unit's zero input was left at a stub constant from an earlier stage of building the datapath, and the branch-target hardware was never added at the same time the branch opcode was wired into the decoder — the instruction looked complete because it decoded without error.",
        resolved: true,
        resolutionOrNextStep:
          "Wired the ALU's zero flag through to the control unit, and added the branch-target adder and PC-source mux so a taken branch actually redirects fetch. Each change is marked with a `//FIX:` comment in the RTL so the defect and its fix stay traceable in the source.",
      },
      {
        title: "The pipeline has no hazard hardware yet — every hazard is paid for by hand",
        whatHappened:
          "The pipelined core requires exactly 3 NOPs after any instruction that produces a register value consumed soon after, and 2 delay-slot NOPs after every branch, both inserted by hand into the test program. There is no forwarding, no hazard-detection unit, and no flush logic.",
        rootCause:
          "This is the direct consequence of the decision to prove the pipeline registers and backward paths correct under a fully software-controlled schedule before adding hazard hardware on top — it is an open item by design, not an unnoticed gap.",
        resolved: false,
        resolutionOrNextStep:
          "EX/MEM and MEM/WB forwarding paths come next — they remove the 3 data-hazard NOPs and are the highest-value next step. A hazard-detection unit for the one case forwarding can't fix (load-use) and branch-flush logic (removing the 2 delay slots) follow after.",
      },
    ],
    whatsNext:
      "EX/MEM and MEM/WB forwarding paths, a hazard-detection unit with load-use stall logic, branch-flush logic, and finally PYNQ-Z2 FPGA synthesis and on-board verification. Each remaining feature has a falsifiable definition of done: it deletes specific NOPs from the test program while the same 12 assertions keep passing.",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/dr-paradox-design/5_Stage_Pipelined_RISC-V",
      },
    ],
  },

  /* Deliberately thin. This was a 24-hour hackathon with no surviving repo,
     so the method — tooling, partition offsets, how the encryption was
     broken — is not recorded anywhere and is not reconstructed here. Kept
     in prose rather than structured validationResults/technicalDecisions:
     Swastik confirmed the run had no real failure, and projectPage.ts's
     honesty guard requires a genuine failuresAndLessons entry the moment
     either of those arrays is non-empty. Forcing one in to unlock structure
     would be inventing a failure to satisfy a check written to prevent
     exactly that. Expand into full structure only if a real failure
     surfaces on review, or drop this comment if one already has. */
  {
    slug: "esp32-nvm",
    domainTags: ["Embedded Systems", "Firmware"],
    executiveSummary:
      "A 24-hour hackathon build centered on the ESP32's non-volatile storage (NVM). The team read a message the challenge had stored in NVM, decrypted it, and separately wrote their own data into NVM over serial — confirming both read and write access to persistent storage from outside the running firmware.",
    problemAndRequirements:
      "Non-volatile storage is what an ESP32 keeps across a power cycle. The challenge planted an encrypted message inside it; the task was to recover and decrypt that message, and to demonstrate write access by storing new data of the team's own.",
  },
];
