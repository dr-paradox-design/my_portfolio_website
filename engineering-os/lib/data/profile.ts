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

    linkedin: "https://www.linkedin.com/in/swastik-aditya-ranjan-294b15282" as string | null,

    email: "123ee0320raj@gmail.com"
  },

  /**
   * Path to the resume PDF, relative to /public.
   * Setting this to `null` hides the download buttons, the embedded preview,
   * and the `/resume` entry in the sitemap — all automatically, so the site
   * never links to a resume that isn't there.
   *
   * The file itself is the robotics/controls version. Swastik keeps several
   * tailored variants; this is the one that belongs on a public page, because
   * it matches the work the site actually shows and, unlike the general
   * variant, carries no date of birth. Replace the PDF in place to update it
   * — the filename is deliberately generic so the URL never changes.
   */
  resumePath: "/resume.pdf" as string | null,
} as const;
