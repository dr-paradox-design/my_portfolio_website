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
import eyantraVideoPoster from "@/public/projects/eyantra-video-poster.webp";
import quadcopterCad from "@/public/projects/quadcopter-cad.webp";
import quadcopterPrintedParts from "@/public/projects/quadcopter-printed-parts.webp";
import quadcopterAssembled from "@/public/projects/quadcopter-assembled.webp";
import sensorFusionHitlSetup from "@/public/projects/sensorfusion-hitl-setup.webp";
import sensorFusionPositionTest from "@/public/projects/sensorfusion-position-test.webp";
import flightControllerIso from "@/public/projects/flight-controller-iso.webp";
import flightControllerTop from "@/public/projects/flight-controller-top.webp";
import flightControllerBottom from "@/public/projects/flight-controller-bottom.webp";
import tiburonTeamSauvc from "@/public/projects/tiburon-team-sauvc.webp";
import tiburonPoolTest from "@/public/projects/tiburon-pool-test.webp";
import tiburonBenchTest from "@/public/projects/tiburon-bench-test.webp";
import tiburonIeeeOesBanner from "@/public/projects/tiburon-ieee-oes-banner.webp";
import acousticFrontendManhattanBuild from "@/public/projects/acoustic-frontend-manhattan-build.webp";
import acousticFrontendPowerSupply from "@/public/projects/acoustic-frontend-power-supply.webp";
import acousticFrontendBenchBringup from "@/public/projects/acoustic-frontend-bench-bringup.webp";
import acousticFrontendWetTest from "@/public/projects/acoustic-frontend-wet-test.webp";
import esp32DevkitBoard from "@/public/projects/esp32-devkit-board.webp";
import auvSimDepthHold from "@/public/projects/auv-sim-depth-hold.webp";

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
  /**
   * Public source repository, rendered as a link on the card itself.
   *
   * **Only for items with no `slug`.** An item that has a page already has
   * somewhere better to put its links — `ProjectDetail.links` renders them
   * in a proper row there — and, more practically, a card with a `slug` *is*
   * a `<Link>`, so an anchor inside it would be a nested anchor. The two are
   * mutually exclusive and `projectPage.ts` fails the build if both are set.
   *
   * This exists because a repo is sometimes the only thing behind an item.
   * Work that is real and public but has no photographs and no write-up
   * would otherwise render as a dead card, which undersells it.
   */
  repoUrl?: string;
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
    /* Build-up order: pool validation, then the bench/debug setup, then the
       competition itself — team photo as the cover, banner last since it is
       venue signage rather than the team or the vehicle. */
    images: [
      {
        src: tiburonPoolTest,
        alt: "Teammates crouched on a poolside mat working on the AUV, with the swimming pool used for testing visible behind them",
        caption: "Pool testing",
        /* Ceiling lighting fills the top of this frame; bias the 16:9 crop
           down onto the people and the vehicle. */
        focus: "50% 65%",
      },
      {
        src: tiburonBenchTest,
        alt: "The AUV on a paved courtyard floor, tethered by cables to a laptop, with three teammates seated around it",
        caption: "Bench debugging setup",
      },
      {
        src: tiburonTeamSauvc,
        alt: "The Team Tiburon members standing behind the AUV on a table at the SAUVC competition, with the event's banners behind them",
        caption: "Team Tiburon at SAUVC 2026",
        cover: true,
        /* Portrait phone photo — bias the 16:9 crop up onto the team's faces
           and the vehicle, not the floor below the table. */
        focus: "50% 35%",
      },
      {
        src: tiburonIeeeOesBanner,
        alt: "A tall IEEE Oceanic Engineering Society banner reading \"To the Ocean, Through Hard Work\", standing against a wall near a staircase",
        caption: "IEEE OES at SAUVC 2026",
        focus: "50% 30%",
      },
    ],
  },
  {
    title: "AUV Simulation & Validation Testbench",
    domain: "Autonomous Systems & Robotics",
    status: "ongoing",
    tier: "major",
    summary:
      "6-DOF nonlinear plant model for a BlueROV2-Heavy class vehicle in MATLAB/Octave, with an environment layer, a fixed-step simulator driving a discrete controller, and a seven-suite validation testbench that cross-checks the plant against closed-form solutions and an independent quaternion implementation.",
    technologies: [
      "MATLAB",
      "GNU Octave",
      "6-DOF dynamics",
      "Fossen model",
      "RK4",
      "Thrust allocation",
      "PID",
    ],
    slug: "auv-sim",
    images: [
      {
        src: auvSimDepthHold,
        alt: "Six-panel MATLAB figure titled with NED position, attitude, body linear and angular velocity, post-lag thruster forces, and a heave force budget, showing a depth step to 1 m then 1.5 m and a 45 degree yaw step settling without steady-state error",
        caption: "Closed-loop depth and heading hold — the six-panel output of plot_results, including the heave force budget",
        cover: true,
      },
    ],
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
    video: {
      youtubeId: "LUDBbLdliyw",
      /* Deliberately just the project name. This string is the iframe title
         and the play button's accessible name, so anything more descriptive
         would be a claim about what the footage shows — and the quadcopter
         entry immediately below is a standing reminder of why that matters.
         Sharpen it once the content is described. */
      title: "Autonomous Warehouse Drone",
      /* A real frame from this footage, which is what `WorkVideo.poster`
         asks for — previously the test-arena gallery photo standing in.
         Sourced from the video's own YouTube thumbnail (maxresdefault,
         1280×720) and trimmed to 1280×542 to drop the letterbox bars the
         frame was pillared with; the container is `aspect-video` with
         `object-cover`, so leaving the bars in would have shown them as
         dead black bands. No other alteration. */
      poster: {
        src: eyantraVideoPoster,
        alt: "Split-screen frame from the run: on the left the indoor arena of stacked blocks with a teammate walking past, on the right the overhead WhyCon tracking view of the e-YRC 2024-25 arena alongside scrolling ROS terminal output",
      },
    },
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
    slug: "3d-printed-quadcopter",
    /* Design → parts → assembly, which is the order the work happened in and
       the only ordering that explains the project without a paragraph.
       The assembly shot is the `cover` because it is the only one of the
       three that reads as an aircraft at card size; the CAD screenshot is a
       single bracket and the parts photo is a pile of green. */
    images: [
      {
        src: quadcopterCad,
        alt: "CAD model of one of the quadcopter's frame components on screen, a dark twin-armed bracket viewed in the modelling software.",
        caption: "Frame part in CAD",
      },
      {
        src: quadcopterPrintedParts,
        alt: "The printed airframe laid out on a workbench in bright green filament: four arms, motor mounts, the centre chassis, and an assortment of spacers and discs.",
        caption: "The airframe, printed",
      },
      {
        src: quadcopterAssembled,
        /* Says "housings" and "wiring", not "motors" and "propellers" — at
           this resolution the ducts read as empty lattice mounts and neither
           is actually visible in the frame. Alt text describes what is in the
           photograph; the summary is where the build gets characterised. */
        alt: "The assembled green quadcopter on the floor beside a laptop, with four square ducted rotor housings, electronics mounted on the centre plate, and orange wiring run along the arms.",
        caption: "Assembled with electronics",
        cover: true,
        /* Portrait phone shot — the card band is 16:9, so without this the
           crop lands on the floor and the laptop instead of the aircraft. */
        focus: "50% 40%",
      },
    ],
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
    /* Wording tracks the repo's README, which is the only source that is
       updated as the work lands. Two earlier claims were removed because the
       README contradicts them: "complete through RTL" (the hazard unit,
       forwarding and flush logic are still open) and "the full ASIC design
       flow is planned" (the roadmap ends at PYNQ-Z2 FPGA verification, not an
       ASIC flow). The repo's own GitHub *description* still carries the first
       claim — the README wins, because it is the one he keeps current. */
    summary:
      "RV32I core written from scratch in Verilog, built in stages: a single-cycle datapath first, then the four pipeline registers that split it into five stages. Both cores pass the same 12-check self-checking regression. Hazards are currently scheduled by hand in software — forwarding, hazard detection, and flush logic are the next milestones, then FPGA verification on a PYNQ-Z2.",
    technologies: ["Verilog", "RV32I", "5-stage pipeline", "Icarus Verilog", "GTKWave"],
    slug: "pipelined-risc-v",
  },
  {
    title: "FPGA Sensor Fusion",
    domain: "Digital Design & Computer Architecture",
    status: "complete",
    tier: "major",
    /* Rewritten against the repo's README, which corrected two things the old
       copy asserted. There is no compass — the sensors are a UART GPS and an
       I2C IMU, nothing else. And the fusion was never "moved into fabric":
       the custom AXI4-Lite IP is the *sensor interface*, while the
       complementary/Kalman estimator runs in C on the Zynq's ARM cores. That
       is a normal and defensible split, but it is the opposite of what the
       sentence claimed, and the claim was the more impressive one. */
    summary:
      "Two custom AXI4-Lite peripherals on a Zynq-7000 ZedBoard — a UART front end for the GPS and an I2C master for the IMU — feeding a C fusion pipeline that outputs orientation and local position at 100 Hz. Implemented in Vivado at 100 MHz with setup and hold both met, in roughly 1.4% of the device's LUTs. Validated hardware-in-the-loop, including a ~50 m outdoor trajectory logged against a GPS reference.",
    technologies: [
      "Zynq-7000",
      "AXI4-Lite",
      "Verilog",
      "Vivado",
      "C",
      "Kalman filter",
      "MPU6050",
    ],
    slug: "fpga-sensor-fusion",
    /* `repoUrl` moved to this project's `links` in projects.ts when the slug
       was added — a slugged card is a link, so the two cannot coexist and
       projectPage.ts fails the build if they do. */
    images: [
      {
        src: sensorFusionHitlSetup,
        alt: "Hardware-in-the-loop bench: a ZedBoard wired by jumper leads to an MPU6050 breakout on a breadboard, with a USB serial lead running to a laptop.",
        caption: "HITL bench setup",
        cover: true,
      },
      {
        src: sensorFusionPositionTest,
        alt: "Two plots. Left: an outdoor walking loop about 28 by 14 metres, with scattered raw GPS crosses and a smooth filtered path through them. Right: pitch, roll and yaw against sample index, yaw sweeping continuously through roughly 450 degrees.",
        caption: "Position test: filtered path vs raw GPS",
      },
    ],
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
      "Analog front end for acquiring the 45 kHz tone from an underwater locator beacon, for the Tiburon AUV's acoustic homing: a charge amplifier feeding an 8th-order Butterworth bandpass filter and an inverting output buffer with an ADC kickback filter. SPICE-validated — component values solved computationally against the E6 capacitor series, confirmed with AC, transient, and a 10,000-run Monte Carlo tolerance analysis — then built as a Manhattan-style hardware prototype and bench-tested. DSP and TDOA localization on FPGA are next.",
    technologies: [
      "LTspice",
      "Charge amplifier",
      "MFB Butterworth filter",
      "Piezoelectric hydrophone",
      "Python",
      "DSP",
      "FPGA",
    ],
    context: "Team Tiburon — analog frontend design & bring-up",
    slug: "acoustic-processing-stack",
    /* Build order: fabricate, power it, bring it up on the bench, then the
       wet test — the bench shot is the cover because it is the one frame
       that shows the actual design decision (a clean captured tone) paying
       off, not just hardware sitting on a table. */
    images: [
      {
        src: acousticFrontendManhattanBuild,
        alt: "Close-up of the analog frontend built Manhattan-style: op-amp ICs and passive components soldered onto individual copper islands scored into a copper-clad board, wired point-to-point",
        caption: "Manhattan-style hardware build",
      },
      {
        src: acousticFrontendPowerSupply,
        alt: "The Manhattan-style board wired to a small buck/boost converter module, powered by two loose battery cells",
        caption: "Bench power supply",
      },
      {
        src: acousticFrontendBenchBringup,
        alt: "The board connected to a microcontroller, with a Rigol oscilloscope beside it displaying a captured sine-wave signal",
        caption: "Bench bring-up on the oscilloscope",
        cover: true,
      },
      {
        src: acousticFrontendWetTest,
        alt: "A basin of water used as an ad hoc test tank, with a sealed probe partly submerged and wires running to the board and a laptop on the floor",
        caption: "Wet test setup",
      },
    ],
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
    status: "ongoing",
    tier: "major",
    summary:
      "Four-layer flight controller board designed in KiCad around an STM32H743, carrying an ESP32-S3 co-processor, dual redundant IMUs, and a USB/battery power-path management chain. Schematic and component selection are done; layout, routing, and bring-up are still in progress.",
    technologies: [
      "KiCad",
      "STM32H743",
      "ESP32-S3",
      "4-layer PCB",
      "Dual IMU",
      "SPI",
      "Power management",
    ],
    slug: "flight-controller-pcb",
    /* KiCad-rendered 3D views generated directly from the design's own
       .kicad_pcb data, not photographs — the board hasn't been fabricated
       yet. The renderer fills in a rounded-rectangle board edge whenever
       Edge.Cuts has no geometry, which is the case here (see the caption
       and failuresAndLessons in projects.ts) — that outline is a rendering
       fallback, not a designed board shape. */
    images: [
      {
        src: flightControllerIso,
        alt: "Isometric KiCad 3D render of the flight controller PCB, showing the STM32 LQFP package at the centre surrounded by decoupling capacitors and pin headers along the board edges, on a synthesized rounded-rectangle outline",
        caption: "KiCad 3D render — no board outline has been drawn yet, so the renderer's default edge is shown",
        cover: true,
      },
      {
        src: flightControllerTop,
        alt: "Top-down KiCad 3D render of the flight controller PCB, showing the STM32 LQFP-100 package, surrounding headers, and two crystal/oscillator cans",
        caption: "Top side",
      },
      {
        src: flightControllerBottom,
        alt: "Bottom-side KiCad 3D render of the flight controller PCB, showing the ESP32-S3-WROOM module footprint, a coin-cell holder outline, and rows of unpopulated header pads",
        caption: "Bottom side — ESP32-S3 module and coin-cell backup footprints",
      },
    ],
  },
  {
    title: "ESP32 Non-Volatile Memory",
    domain: "Embedded Systems & Firmware",
    status: "complete",
    tier: "supporting",
    summary:
      "24-hour hackathon build focused on accessing and modifying the non-volatile memory of the ESP32: decrypted a message the challenge had stored in NVM, and wrote the team's own data into NVM over serial.",
    technologies: ["ESP32", "Non-volatile memory", "Serial flash dump"],
    context: "24-hour hackathon",
    slug: "esp32-nvm",
    images: [
      {
        src: esp32DevkitBoard,
        alt: "An ESP32-WROOM-32 development board on a plain white background, showing the module, micro-USB port, and pin headers",
        caption: "An ESP32 dev board — stock photo, not the team's own hardware; no photos from the hackathon survive",
        cover: true,
      },
    ],
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
