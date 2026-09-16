/**
 * The two drawings in the hero: a package cross-stack and an airframe, each
 * sitting in its own bracketed panel.
 *
 * Both are **static**. There is no scan sweep, no flowing net and no pulsing
 * indicator — Swastik's call, and the right one: the page is now dense
 * enough that anything moving inside it competes with the work rather than
 * framing it. Nothing here needs state or effects, so nothing here ships a
 * bundle; they are plain server-rendered SVG.
 *
 * They are *illustrations*. Nothing on this site claims Swastik taped out
 * this package or flew this exact airframe, and the panels label them
 * `ILLUSTRATIVE` for the same reason the no-fabrication rule in AGENTS.md
 * applies to pictures as well as prose.
 *
 * ── Projection ───────────────────────────────────────────────────────
 * `iso(x, y, z)` drops a point in part space onto the sheet. `KX` is
 * cos 30°, the true isometric horizontal. `KY` is *not* sin 30°: at 0.5 a
 * plate is as tall as it is deep and the stack needs a panel twice this
 * height to breathe. 0.34 flattens the view toward a drafting three-quarter,
 * which is also closer to how a datasheet draws a package.
 *
 * A circle lying in the x-y plane projects to an *axis-aligned* ellipse
 * under this transform, which is worth deriving once rather than
 * approximating with a polygon:
 *
 *   X = X0 + r·KX(cosθ − sinθ) = X0 + r√2·KX·cos(θ+45°)
 *   Y = Y0 + r·KY(cosθ + sinθ) = Y0 + r√2·KY·sin(θ+45°)
 *
 * so rx = r√2·KX and ry = r√2·KY, with no rotation.
 */

const KX = 0.866;
const KY = 0.34;
const RX = Math.SQRT2 * KX;
const RY = Math.SQRT2 * KY;

/** Both figures share a viewBox, so both share a projection origin. */
const CX = 160;
const CY = 106;

const iso = (x: number, y: number, z: number): [number, number] => [
  CX + (x - y) * KX,
  CY + (x + y) * KY - z,
];

const pt = (p: [number, number]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

/** Top face of an axis-aligned square of half-extent `h`, at height `z`. */
const top = (h: number, z: number) =>
  [iso(-h, -h, z), iso(h, -h, z), iso(h, h, z), iso(-h, h, z)].map(pt).join(" ");

/** Top face of an arbitrary axis-aligned rectangle. */
const face = (x0: number, y0: number, x1: number, y1: number, z: number) =>
  [iso(x0, y0, z), iso(x1, y0, z), iso(x1, y1, z), iso(x0, y1, z)]
    .map(pt)
    .join(" ");

/* The two side walls that face the viewer — +x on the right, +y on the
   left. The other two are hidden behind the plate, so drawing them would
   cost nodes and change nothing. */
const wallR = (h: number, z: number, t: number) =>
  [iso(h, -h, z), iso(h, h, z), iso(h, h, z - t), iso(h, -h, z - t)]
    .map(pt)
    .join(" ");
const wallL = (h: number, z: number, t: number) =>
  [iso(-h, h, z), iso(h, h, z), iso(h, h, z - t), iso(-h, h, z - t)]
    .map(pt)
    .join(" ");

const seg = (x0: number, y0: number, x1: number, y1: number, z: number) => {
  const [ax, ay] = iso(x0, y0, z);
  const [bx, by] = iso(x1, y1, z);
  return { x1: ax, y1: ay, x2: bx, y2: by };
};

const disc = (x: number, y: number, z: number, r: number) => {
  const [cx, cy] = iso(x, y, z);
  return { cx, cy, rx: r * RX, ry: r * RY };
};

/* Fill literals. These sit *between* board-950 and board-900 rather than on
   them: the top face and the two walls have to read as the same surface at
   three angles to the light, and a token step is too coarse for that. */
const TOP_FILL = "#151b26";
const WALL_L = "#0f141c";
const WALL_R = "#0b0f15";
const PART_FILL = "#1c2532";

/** Shared wrapper: one plate drawn as top face over its two visible walls. */
function Plate({
  h,
  z,
  t,
  fill = TOP_FILL,
  stroke = "var(--color-board-600)",
}: {
  h: number;
  z: number;
  t: number;
  fill?: string;
  stroke?: string;
}) {
  return (
    <>
      <polygon
        points={wallL(h, z, t)}
        fill={WALL_L}
        stroke="var(--color-board-700)"
        strokeWidth="0.75"
      />
      <polygon
        points={wallR(h, z, t)}
        fill={WALL_R}
        stroke="var(--color-board-700)"
        strokeWidth="0.75"
      />
      <polygon points={top(h, z)} fill={fill} stroke={stroke} strokeWidth="1" />
    </>
  );
}

/**
 * Package cross-stack: substrate, body, die. Heights are stated the way a
 * stack is actually built — a plate's *top* face is at `z` and its walls
 * drop to `z - t`, so each layer starts where the one below it ended.
 */
export function PackageFigure() {
  return (
    <svg
      viewBox="0 0 320 190"
      className="font-mono w-full"
      aria-hidden="true"
      focusable="false"
    >
      {/* Substrate, 0 → −10 */}
      <Plate h={75} z={0} t={10} />

      {/* Pad ring on the substrate margin, outside the body footprint. */}
      <g fill="var(--color-copper-600)">
        {[-44, -26, -8, 10, 28].map((p) => (
          <g key={p}>
            <polygon points={face(p, -66, p + 8, -60, 0)} />
            <polygon points={face(p, 60, p + 8, 66, 0)} />
            <polygon points={face(-66, p, -60, p + 8, 0)} />
            <polygon points={face(60, p, 66, p + 8, 0)} />
          </g>
        ))}
      </g>

      {/* Escape routing from the body edge out to the ring. Only the nets
          that clear the body footprint are drawn — a trace from a corner pad
          to the die would cross its neighbours, which is not how escape
          routing works and reads wrong to anyone who has laid out a board. */}
      <g stroke="var(--color-copper-600)" strokeWidth="0.7">
        {[-40, -22, -4, 14].map((p) => (
          <g key={p}>
            <line {...seg(p + 4, -60, p + 4, -44, 0)} />
            <line {...seg(p + 4, 60, p + 4, 44, 0)} />
            <line {...seg(-60, p + 4, -44, p + 4, 0)} />
            <line {...seg(60, p + 4, 44, p + 4, 0)} />
          </g>
        ))}
      </g>

      {/* Pin-1 identifier — the one asymmetry that orients the part. */}
      <ellipse {...disc(-66, -66, 0, 4)} fill="var(--color-copper-400)" />

      {/* Body, 16 → 0 */}
      <Plate h={44} z={16} t={16} fill={PART_FILL} />

      {/* Die, 21 → 16 */}
      <Plate
        h={24}
        z={21}
        t={5}
        fill="#222c3b"
        stroke="var(--color-copper-400)"
      />

      {/* Floorplan blocks on the die, not a texture fill — a die is
          partitioned, and the partitions are the only thing that makes a
          rectangle read as silicon. */}
      <g stroke="var(--color-board-600)" strokeWidth="0.6">
        <line {...seg(-24, -7, 24, -7, 21)} />
        <line {...seg(-24, 8, 24, 8, 21)} />
        <line {...seg(-3, -24, -3, -7, 21)} />
        <line {...seg(9, -7, 9, 8, 21)} />
      </g>
    </svg>
  );
}

/**
 * Airframe: body, four booms along the part axes, four rotor discs.
 *
 * Booms along ±x and ±y are what a quad actually has, and under this
 * projection the two axes land on the same pair of screen verticals — so
 * the four rotors resolve into a rectangle on the sheet rather than the
 * plus-sign that diagonal booms would give.
 */
export function AirframeFigure() {
  const arms: [number, number][] = [
    [72, 0],
    [-72, 0],
    [0, 72],
    [0, -72],
  ];

  return (
    <svg
      viewBox="0 0 320 190"
      className="font-mono w-full"
      aria-hidden="true"
      focusable="false"
    >
      {/* Booms first, so the body and the hubs cover where they meet. */}
      <g stroke="var(--color-board-600)" strokeWidth="3.5" strokeLinecap="round">
        {arms.map(([x, y]) => (
          <line key={`${x},${y}`} {...seg(0, 0, x, y, 10)} />
        ))}
      </g>

      {/* Rotor discs: swept circle, then the hub. Outline only — a filled
          disc reads as a solid plate, and a propeller is mostly air. */}
      <g fill="none" stroke="var(--color-copper-600)" strokeWidth="1">
        {arms.map(([x, y]) => (
          <ellipse key={`${x},${y}`} {...disc(x, y, 10, 30)} />
        ))}
      </g>
      <g fill="none" stroke="var(--color-board-700)" strokeWidth="0.7">
        {arms.map(([x, y]) => (
          <ellipse key={`${x},${y}`} {...disc(x, y, 10, 19)} />
        ))}
      </g>
      <g fill="var(--color-copper-500)">
        {arms.map(([x, y]) => (
          <ellipse key={`${x},${y}`} {...disc(x, y, 10, 5)} />
        ))}
      </g>

      {/* Stack: airframe deck, then the flight controller sitting on it. */}
      <Plate h={30} z={10} t={9} />
      <Plate
        h={17}
        z={18}
        t={8}
        fill={PART_FILL}
        stroke="var(--color-copper-400)"
      />
      <g stroke="var(--color-board-600)" strokeWidth="0.6">
        <line {...seg(-17, 1, 17, 1, 18)} />
        <line {...seg(1, -17, 1, 17, 18)} />
      </g>

      {/* Payload slung under the deck — the reason any of this flies. */}
      <g>
        <polygon
          points={face(-11, -11, 11, 11, -6)}
          fill={PART_FILL}
          stroke="var(--color-board-600)"
          strokeWidth="0.8"
        />
        <ellipse {...disc(0, 0, -8, 6)} fill="none" stroke="var(--color-copper-500)" strokeWidth="1" />
      </g>
    </svg>
  );
}
