/**
 * lib/data/skills.ts
 *
 * The skills tree. Each top-level entry is a category.
 * Each category has children (skills), which can have their own children.
 * Add, remove, or rename entries here — the SkillTree component reads this.
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
    category: "Hardware",
    icon: "⚡",
    description: "Microcontrollers, FPGAs, sensors, and PCB design",
    skills: [
      {
        name: "Microcontrollers",
        children: [
          { name: "STM32", note: "SAR ADC project, DMA firmware" },
          { name: "ESP32", note: "Test equipment suite, oscilloscope" },
          { name: "RP2040 / RP2350", note: "Tiburon AUV firmware" },
          { name: "8051", note: "EE3472 Microcontroller Lab, NIT Rourkela" },
        ],
      },
      {
        name: "FPGA",
        children: [
          { name: "Pynq Z2" },
          { name: "AMD Kria KR260", note: "Edge AI acceleration" },
          { name: "Verilog HDL", note: "SAR ADC FSM design" },
        ],
      },
      {
        name: "Sensors & Interfaces",
        children: [
          { name: "DVL (Teledyne)", note: "RS-232/MAX3232 interface, Tiburon" },
          { name: "VectorNav VN-200", note: "AHRS/IMU, Tiburon attitude oracle" },
          { name: "Pressure Sensors", note: "Depth estimation, EKF input" },
          { name: "AD7606C-18 ADC", note: "SPI, DMA, SD card logging on RP2040" },
          { name: "ZMPT101B", note: "Voltage sensor, ESP32 test suite" },
        ],
      },
      {
        name: "PCB Design",
        children: [
          { name: "6-layer PCB", note: "SAR ADC project" },
          { name: "Analog front-end design" },
          { name: "Signal conditioning circuits" },
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
      { name: "Verilog", note: "FPGA FSM for SAR ADC" },
      { name: "TypeScript", note: "Engineering-OS portfolio site" },
    ],
  },
  {
    category: "Algorithms & Theory",
    icon: "📐",
    description: "The math and algorithms behind the systems",
    skills: [
      {
        name: "Control Theory",
        children: [
          { name: "Cascaded PID", note: "Tiburon 6-DOF control" },
          { name: "Fossen feedforward", note: "Hydrodynamic model compensation" },
          { name: "Thrust allocation (pseudo-inverse)", note: "6×8 B-matrix, SVD" },
          { name: "Transfer functions & Bode analysis" },
        ],
      },
      {
        name: "State Estimation",
        children: [
          { name: "Extended Kalman Filter (EKF)", note: "9-state position estimator" },
          { name: "Sensor fusion (DVL + pressure)", note: "Tiburon navigation" },
          { name: "AHRS attitude estimation", note: "Via VN-200" },
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
          { name: "ADC sampling theory" },
          { name: "FFT & spectral analysis", note: "SAR ADC benchmarking" },
          { name: "Digital filtering", note: "Lowpass filter on pressure sensor" },
        ],
      },
    ],
  },
];
