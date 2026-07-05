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
