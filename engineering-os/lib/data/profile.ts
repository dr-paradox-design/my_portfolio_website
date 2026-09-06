/**
 * lib/data/profile.ts
 *
 * Your personal information. Edit this file to update any detail
 * across the entire site — name, bio, stats, social links.
 * Nothing else needs to change.
 */

export const profile = {
  name: "Swastik Aditya Ranjan",
  title: "Electrical Engineer",
  secondaryTitle: "Silicon & Robotics Engineer",
  institution: "NIT Rourkela",
  program: "B.Tech Electrical Engineering",
  graduationYear: 2027,

  tagline:
    "Building intelligent autonomous systems from the silicon up — chip design, embedded electronics, control theory, and robotics.",

  bio: "Final-year Electrical Engineering student at NIT Rourkela, team captain of Team Tiburon (AUV robotics), and firmware lead. I work at the intersection of embedded systems and control theory — writing firmware that runs on hardware I've designed and understanding why the math says what it does. Currently targeting roles in chip design and semiconductor fabrication, alongside embedded systems.",

  /**
   * Home-page stats now live in `lib/data/portfolio.ts` as `portfolioStats`,
   * where the counts are derived from the actual project and competition
   * lists. They were hardcoded here and had drifted badly out of date.
   */

  /** Social/contact links */
  social: {
    github: "https://github.com/dr-paradox-design",
    linkedin: "https://linkedin.com/in/swastikaditya", // TODO: replace with real URL
    email: "123ee0320raj@gmail.com"
  },

  /**
   * Path to the resume PDF, relative to /public.
   * Leave as `null` while there is no PDF — the download buttons and the
   * embedded preview are hidden automatically. Drop the file at
   * `public/resume.pdf` and set this to "/resume.pdf" to turn them on.
   */
  resumePath: null as string | null,
} as const;
