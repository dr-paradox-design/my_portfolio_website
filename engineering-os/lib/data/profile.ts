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

    /**
     * Leave as `null` while the real profile URL is unknown — the footer
     * link and the contact-page row hide themselves. Set it to the real URL
     * to turn both back on; nothing else needs changing.
     *
     * This was `https://linkedin.com/in/swastikaditya` with a
     * `TODO: replace with real URL` comment — a guessed handle, live in the
     * footer of every page and as a primary row on /contact. An invented URL
     * is what the no-fabrication rule in AGENTS.md forbids, and this was the
     * worst placement of one on the site: /contact is where a recruiter
     * lands, and a link to a dead page or to the wrong person costs more
     * than no link. It could not be verified either way — LinkedIn answers
     * bots with HTTP 999 for real and fake handles alike.
     */
    linkedin: null as string | null,

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
