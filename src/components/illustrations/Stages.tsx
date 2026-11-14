import type { CSSProperties, ReactNode } from "react";

/* Scroll-driven stages for the home story. Each element declares the chapter progress at
   which it starts (--a): data-d strokes draw, data-s shapes rise in, data-p shapes pop.
   The stage's --cp is written by the scroll; without it everything rests drawn (--cp: 1). */

const INK = "var(--color-night)";
const PAPER = "var(--color-sand)";
const BLUE = "var(--color-violet-glow)";
const BLUE_SOFT = "var(--color-lilac)";
const ORANGE = "var(--color-coral)";
const YELLOW = "var(--color-peach)";
const RULE = "var(--color-sand-rule)";
const HAIR = "var(--color-night-2)";

const a = (v: number) => ({ "--a": v }) as CSSProperties;

const Stage = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <svg viewBox="0 0 640 520" className={`block h-auto w-full ${className}`} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

/** Chapter 1 — the sign: a letterform built on its construction grid. */
export const SignStage = () => (
  <Stage>
    <g data-s style={a(0)}>
      <rect x="70" y="40" width="500" height="440" fill={PAPER} stroke={INK} strokeWidth="3" />
    </g>
    <path d="M100 380 H540" stroke={INK} strokeWidth="2" pathLength={1} data-d style={a(0.06)} />
    <path d="M100 200 H540" stroke={BLUE} strokeWidth="2" pathLength={1} data-d style={a(0.12)} />
    <path d="M100 120 H540" stroke={RULE} strokeWidth="2" pathLength={1} data-d style={a(0.18)} />
    <circle cx="300" cy="290" r="92" stroke={BLUE} strokeWidth="2" pathLength={1} data-d style={a(0.22)} />
    <path d="M168 380 L300 112 L432 380" stroke={RULE} strokeWidth="2" pathLength={1} data-d style={a(0.3)} />
    <g data-s style={a(0.4)}>
      <text x="196" y="380" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="300" fill={INK}>
        a
      </text>
    </g>
    {[
      [258, 204],
      [372, 232],
      [222, 372],
    ].map(([x, y], i) => (
      <rect key={i} x={x - 8} y={y - 8} width="16" height="16" fill={ORANGE} stroke={INK} strokeWidth="2" data-p style={a(0.55 + i * 0.04)} />
    ))}
    <g transform="translate(474 340) rotate(-30)">
      <g data-s style={a(0.62)}>
        <rect x="-16" y="-190" width="32" height="28" fill={BLUE_SOFT} stroke={INK} strokeWidth="3" />
        <rect x="-16" y="-162" width="32" height="10" fill={INK} />
        <rect x="-16" y="-152" width="32" height="128" fill={ORANGE} stroke={INK} strokeWidth="3" />
        <path d="M-16 -24 L0 16 L16 -24 Z" fill={PAPER} stroke={INK} strokeWidth="3" />
        <path d="M-5 -1 L0 16 L5 -1 Z" fill={INK} />
      </g>
    </g>
    {[INK, BLUE, ORANGE, YELLOW].map((c, i) => (
      <circle key={c} cx={118 + i * 40} cy="440" r="14" fill={c} stroke={INK} strokeWidth="2" data-p style={a(0.72 + i * 0.04)} />
    ))}
  </Stage>
);

/** Chapter 2 — the structure: three wireframe screens, a flow, the questions behind it. */
export const StructureStage = ({ notes }: { notes: [string, string, string] }) => (
  <Stage>
    {[40, 245, 450].map((x, i) => (
      <g key={x} data-s style={a(i * 0.1)}>
        <rect x={x} y="80" width="150" height="290" rx="16" fill={PAPER} stroke={INK} strokeWidth="3" />
        <rect x={x + 18} y="104" width="114" height="22" rx="4" fill={INK} />
        <rect x={x + 18} y="142" width="114" height="70" rx="6" fill={RULE} />
        <path d={`M${x + 18} 232 H${x + 120} M${x + 18} 252 H${x + 96} M${x + 18} 272 H${x + 108}`} stroke={RULE} strokeWidth="8" />
        <rect x={x + 18} y="306" width={i === 2 ? 114 : 80} height="36" rx="18" fill={i === 2 ? BLUE : PAPER} stroke={INK} strokeWidth="2.5" />
      </g>
    ))}
    {[190, 395].map((x, i) => (
      <g key={x}>
        <circle cx={x + 10} cy="226" r="4" fill={INK} data-p style={a(0.32 + i * 0.12)} />
        <path
          d={`M${x + 10} 226 H${x + 47} M${x + 39} 218 L${x + 47} 226 L${x + 39} 234`}
          stroke={INK}
          strokeWidth="3"
          pathLength={1}
          data-d
          style={a(0.34 + i * 0.12)}
        />
      </g>
    ))}
    {notes.map((n, i) => {
      const pos = [
        [60, 400, -4],
        [262, 410, 3],
        [470, 396, -2],
      ][i];
      return (
        <g key={n} transform={`rotate(${pos[2]} ${pos[0] + 60} ${pos[1] + 40})`}>
          <g data-p style={a(0.6 + i * 0.08)}>
            <rect x={pos[0]} y={pos[1]} width="124" height="78" fill={YELLOW} stroke={INK} strokeWidth="2.5" />
            <text x={pos[0] + 62} y={pos[1] + 48} textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="24" fill={INK}>
              {n}
            </text>
          </g>
        </g>
      );
    })}
  </Stage>
);

/** Chapter 3 — the code: lines written in the editor build the interface beside it. */
export const CodeStage = () => {
  const lines: [number, number, string][] = [
    [60, 120, YELLOW],
    [84, 150, BLUE_SOFT],
    [84, 110, PAPER],
    [108, 140, ORANGE],
    [108, 96, PAPER],
    [84, 130, BLUE_SOFT],
    [60, 70, YELLOW],
    [60, 160, PAPER],
  ];
  return (
    <Stage>
      <g data-s style={a(0)}>
        <rect x="24" y="56" width="300" height="410" rx="16" fill={INK} />
        <circle cx="50" cy="82" r="6" fill={ORANGE} />
        <circle cx="70" cy="82" r="6" fill={YELLOW} />
        <circle cx="90" cy="82" r="6" fill={BLUE_SOFT} />
      </g>
      {lines.map(([x, w, c], i) => (
        <path key={i} d={`M${x} ${126 + i * 40} h${w}`} stroke={c} strokeWidth="9" pathLength={1} data-d style={a(0.06 + i * 0.06)} />
      ))}
      <g data-s style={a(0.12)}>
        <rect x="350" y="86" width="266" height="350" rx="14" fill={PAPER} stroke={INK} strokeWidth="3" />
        <path d="M350 120 H616" stroke={INK} strokeWidth="3" />
      </g>
      <g data-s style={a(0.24)}>
        <rect x="372" y="138" width="222" height="32" rx="6" fill={BLUE} />
      </g>
      <g data-s style={a(0.38)}>
        <rect x="372" y="186" width="222" height="112" rx="10" fill={YELLOW} stroke={INK} strokeWidth="2.5" />
        <circle cx="408" cy="232" r="20" fill={PAPER} stroke={INK} strokeWidth="2.5" />
        <path d="M442 222 H560 M442 246 H516" stroke={INK} strokeWidth="7" />
      </g>
      <g data-s style={a(0.52)}>
        <rect x="372" y="316" width="132" height="42" rx="21" fill={ORANGE} stroke={INK} strokeWidth="2.5" />
        <path d="M402 337 H474" stroke={INK} strokeWidth="5" />
      </g>
      <g data-s style={a(0.64)}>
        <path d="M372 386 H594 M372 410 H532" stroke={RULE} strokeWidth="8" />
      </g>
    </Stage>
  );
};

/** Chapter 4 — together: the selected button, its code, and the data behind it. */
export const TogetherStage = () => (
  <Stage>
    <g data-s style={a(0)}>
      <rect x="30" y="64" width="270" height="240" fill={PAPER} stroke={PAPER} strokeWidth="3" />
      <path d="M64 112 H230" stroke={INK} strokeWidth="11" />
      <path d="M64 140 H190" stroke={RULE} strokeWidth="7" />
      <rect x="64" y="206" width="170" height="48" rx="24" fill={BLUE} />
      <path d="M112 230 H186" stroke={PAPER} strokeWidth="5" />
    </g>
    <rect x="54" y="196" width="190" height="68" stroke={YELLOW} strokeWidth="2.5" pathLength={1} data-d style={a(0.12)} />
    {[
      [54, 196],
      [244, 196],
      [54, 264],
      [244, 264],
    ].map(([x, y], i) => (
      <rect key={i} x={x - 6} y={y - 6} width="12" height="12" fill={INK} stroke={YELLOW} strokeWidth="2.5" data-p style={a(0.22 + i * 0.03)} />
    ))}
    <g data-s style={a(0.18)}>
      <rect x="350" y="64" width="262" height="240" rx="14" fill={HAIR} stroke={PAPER} strokeWidth="2" />
    </g>
    {(
      [
        [378, 70, YELLOW],
        [402, 150, BLUE_SOFT],
        [402, 104, PAPER],
        [378, 120, ORANGE],
      ] as [number, number, string][]
    ).map(([x, w, c], i) => (
      <path key={i} d={`M${x} ${110 + i * 44} h${w}`} stroke={c} strokeWidth="9" pathLength={1} data-d style={a(0.26 + i * 0.05)} />
    ))}
    <path d="M246 230 C 300 230, 320 154, 396 154" stroke={ORANGE} strokeWidth="4" strokeDasharray="0" pathLength={1} data-d style={a(0.46)} />
    <path d="M481 304 V362" stroke={PAPER} strokeWidth="3" pathLength={1} data-d style={a(0.6)} />
    <g data-s style={a(0.56)}>
      <path d="M421 372 V446 A60 18 0 0 0 541 446 V372" fill={BLUE_SOFT} stroke={PAPER} strokeWidth="2.5" />
      <ellipse cx="481" cy="372" rx="60" ry="18" fill={BLUE_SOFT} stroke={PAPER} strokeWidth="2.5" />
      <path d="M421 408 A60 18 0 0 0 541 408" stroke={INK} strokeWidth="2" />
    </g>
    <g data-p style={a(0.78)}>
      <circle cx="200" cy="410" r="44" fill={YELLOW} stroke={PAPER} strokeWidth="3" />
      <path d="M180 410 L195 426 L222 394" stroke={INK} strokeWidth="6" />
    </g>
  </Stage>
);
