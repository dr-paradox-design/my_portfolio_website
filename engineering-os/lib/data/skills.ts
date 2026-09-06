/**
 * lib/data/skills.ts
 *
 * The skills tree. Each top-level entry is a category.
 * Each category has children (skills), which can have their own children.
 * Add, remove, or rename entries here — the SkillTree component reads this.
 *
 * Rule: only list skills actually exercised in real work. Things that are
 * planned but not yet done (the ASIC flow, DSP-on-FPGA) live in
 * `portfolio.ts` with an "ongoing" status instead — a skills page reads as
 * a capability claim, so speculative entries do not belong here.
 */

export interface Skill {
  name: string;
  note?: string; // optional one-line context, e.g. "used in Tiburon firmware"
  children?: Skill[];
}

export interface SkillCategory {
  category: string;
  icon: string; // emoji icon for the category header
  description: string;
  skills: Skill[];
}

export const skills: SkillCategory[] = [
  {
    category: "Digital Design & VLSI",
    icon: "🔲",
    description: "RTL design, processor microarchitecture, and FPGA targets",
    skills: [
      {
        name: "RTL Design",
        children: [
          { name: "Verilog HDL", note: "SAR ADC control FSM, RISC-V CPU" },
          { name: "Finite state machine design", note: "Cycle-accurate SAR sequencing" },
          { name: "Pipelined microarchitecture", note: "RISC-V CPU, complete to RTL" },
        ],
      },
      {
        name: "Processor Architecture",
        children: [
          { name: "RISC-V ISA" },
          { name: "Pipeline hazards & datapath design" },
        ],
      },
      {
        name: "FPGA Platforms",
        children: [
          { name: "Pynq Z2" },
          { name: "AMD Kria KR260", note: "Edge AI acceleration" },
          { name: "Hardware sensor fusion", note: "IMU + GPS + compass on FPGA" },
        ],
      },
    ],
  },
  {
    category: "Analog & Mixed-Signal",
    icon: "〰️",
    description: "Front-end design, PCB signal integrity, and data conversion",
    skills: [
      {
        name: "Data Conversion",
        children: [
          { name: "SAR ADC architecture", note: "Verilog-sequenced conversion" },
          { name: "ADC sampling theory" },
          { name: "AD7606C-18 ADC", note: "SPI, DMA, SD card logging on RP2040" },
        ],
      },
      {
        name: "PCB & Signal Integrity",
        children: [
          { name: "6-layer PCB design", note: "Analog/digital domain isolation" },
          { name: "Grounding & return-path design" },
          { name: "Analog front-end design" },
          { name: "Signal conditioning circuits" },
        ],
      },
      {
        name: "Measurement & Isolation",
        children: [
          { name: "Transformer-based isolation", note: "ZMPT101B AC sensing" },
          { name: "Noise-floor characterisation", note: "Spectral comparison of board revisions" },
        ],
      },
      {
        name: "Emerging Architectures",
        children: [
          {
            name: "Analog compute-in-memory",
            note: "In progress — Lam Research Challenge 2026",
          },
        ],
      },
    ],
  },
  {
    category: "Embedded Systems",
    icon: "⚡",
    description: "Microcontrollers, peripherals, and bare-metal firmware",
    skills: [
      {
        name: "Microcontrollers",
        children: [
          { name: "STM32", note: "SAR ADC project, DMA firmware" },
          { name: "ESP32", note: "Test equipment suite, oscilloscope, NVM work" },
          { name: "RP2040 / RP2350", note: "Tiburon AUV firmware" },
          { name: "8051", note: "EE3472 Microcontroller Lab, NIT Rourkela" },
        ],
      },
      {
        name: "Peripherals & Interfaces",
        children: [
          { name: "DMA-driven acquisition", note: "Decoupled capture from CPU execution" },
          { name: "SPI" },
          { name: "UART / RS-232", note: "DVL interface via MAX3232" },
          { name: "Non-volatile memory", note: "ESP32 NVM access and modification" },
        ],
      },
      {
        name: "Sensors",
        children: [
          { name: "DVL (Teledyne)", note: "Bottom-lock velocity, Tiburon" },
          { name: "VectorNav VN-200", note: "AHRS/IMU, Tiburon attitude oracle" },
          { name: "Pressure sensors", note: "Depth estimation, EKF input" },
          { name: "Optical flow", note: "Drone localization, IIT Bombay" },
          { name: "1D LiDAR", note: "Altitude reference, IIT Bombay" },
          { name: "ZMPT101B", note: "Voltage sensor, ESP32 test suite" },
        ],
      },
    ],
  },
  {
    category: "Software",
    icon: "🖥️",
    description: "Robotics middleware, embedded Linux, and tooling",
    skills: [
      {
        name: "ROS2",
        children: [
          { name: "Node / topic architecture" },
          { name: "Gazebo simulation", note: "e-Yantra warehouse drone" },
          { name: "Launch files & parameter servers" },
        ],
      },
      {
        name: "Embedded Linux",
        children: [
          { name: "Raspberry Pi (headless deployment)" },
          { name: "Python daemons / systemd services" },
        ],
      },
      {
        name: "Tooling",
        children: [
          { name: "Docker" },
          { name: "Git / GitHub" },
          { name: "MATLAB / Simulink", note: "Thrust allocation, control design" },
        ],
      },
    ],
  },
  {
    category: "Programming",
    icon: "💻",
    description: "Languages used in production firmware and tooling",
    skills: [
      { name: "C", note: "Bare-metal firmware, 8051 assembly" },
      { name: "C++", note: "Arduino-Pico core, RP2350 firmware" },
      { name: "Python", note: "Control daemons, tooling, ROS2 nodes" },
      { name: "MATLAB", note: "Thrust allocation matrix, SVD, control design" },
      { name: "Verilog", note: "SAR ADC FSM, RISC-V CPU" },
      { name: "TypeScript", note: "Engineering-OS portfolio site" },
    ],
  },
  {
    category: "Control & Estimation",
    icon: "📐",
    description: "The math behind the vehicles and the sensing stacks",
    skills: [
      {
        name: "Control Theory",
        children: [
          { name: "Cascaded PID", note: "Tiburon 6-DOF control" },
          { name: "Fossen feedforward", note: "Hydrodynamic model compensation" },
          { name: "Thrust allocation (pseudo-inverse)", note: "6×8 B-matrix, SVD" },
          { name: "Overactuated system allocation", note: "8 thrusters, 6 DOF" },
          { name: "Transfer functions & Bode analysis" },
        ],
      },
      {
        name: "State Estimation",
        children: [
          { name: "Extended Kalman Filter (EKF)", note: "9-state position estimator" },
          { name: "Sensor fusion (DVL + pressure)", note: "Tiburon navigation" },
          { name: "AHRS attitude estimation", note: "Via VN-200" },
          { name: "GPS-denied localization", note: "Sub-250 g drone, IIT Bombay" },
        ],
      },
      {
        name: "Robotics",
        children: [
          { name: "Path planning" },
          { name: "Waypoint navigation", note: "e-Yantra drone" },
          { name: "SLAM (studied)" },
        ],
      },
      {
        name: "Signal Processing",
        children: [
          { name: "FFT & spectral analysis", note: "SAR ADC benchmarking" },
          { name: "Digital filtering", note: "Lowpass filter on pressure sensor" },
          { name: "Acoustic signal processing", note: "In progress" },
        ],
      },
    ],
  },
];
