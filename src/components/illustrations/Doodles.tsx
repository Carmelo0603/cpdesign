import type { ReactNode } from "react";

/* Doodles for the journey: a sand ink line, and fills printed slightly off register,
   like a two-colour riso print. Each one is 260 x 200 and decorative. */

const LINE = "var(--color-sand)";
const CORAL = "var(--color-coral)";
const LILAC = "var(--color-lilac)";
const VIOLET = "var(--color-violet-glow)";
const PEACH = "var(--color-peach)";

const Doodle = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 260 200" className="block h-auto w-full" fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/** 2022, Catania: Etna smoking over the sea, and a pencil. */
export const EtnaDoodle = () => (
  <Doodle>
    <path d="M28 168 L104 62 Q118 48 132 60 L214 168 Z" fill={VIOLET} stroke="none" transform="translate(7 6)" />
    <path d="M100 74 Q112 92 106 112 Q118 100 128 116 Q132 96 140 80" fill={CORAL} stroke="none" transform="translate(5 4)" />
    <path d="M24 168 L100 60 Q116 44 130 58 L210 168" />
    <path d="M100 66 Q114 84 104 108 M130 62 Q124 84 136 104" />
    <path d="M110 40 q-14 -8 -4 -20 q6 -12 20 -6 q12 -10 22 2 q14 0 10 14 q8 12 -6 16" />
    <path d="M10 180 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0" />
    <g transform="rotate(-28 206 70)">
      <rect x="196" y="18" width="20" height="96" rx="2" fill={PEACH} stroke="none" transform="translate(4 4)" />
      <rect x="196" y="18" width="20" height="96" rx="2" />
      <path d="M196 114 L206 136 L216 114 M202 127 L210 127" />
    </g>
  </Doodle>
);

/** 2025, Epicode: a laptop with code, and coffee. */
export const LaptopDoodle = () => (
  <Doodle>
    <rect x="44" y="40" width="150" height="100" rx="8" fill={VIOLET} stroke="none" transform="translate(7 6)" />
    <rect x="44" y="40" width="150" height="100" rx="8" />
    <path d="M24 156 H214 L200 170 H38 Z" />
    <path d="M78 76 L64 90 L78 104 M104 108 L118 72 M144 76 L158 90 L144 104" stroke={CORAL} strokeWidth="4" />
    <path d="M214 120 h26 v34 a12 12 0 0 1 -12 12 h-2 a12 12 0 0 1 -12 -12 Z" fill={LILAC} stroke="none" transform="translate(4 4)" />
    <path d="M214 120 h26 v34 a12 12 0 0 1 -12 12 h-2 a12 12 0 0 1 -12 -12 Z M240 128 q12 0 10 12 q-2 8 -10 8" />
    <path d="M222 110 q-6 -8 0 -16 q6 -8 0 -16 M232 110 q-6 -8 0 -16" />
  </Doodle>
);

/** February 2026: the degree, a cap on top of the thesis. */
export const DegreeDoodle = () => (
  <Doodle>
    <path d="M58 120 L186 120 L196 172 L48 172 Z" fill={LILAC} stroke="none" transform="translate(6 5)" />
    <path d="M58 120 L186 120 L196 172 L48 172 Z" />
    <path d="M66 138 H178 M70 152 H140" />
    <path d="M130 30 L214 62 L130 94 L46 62 Z" fill={CORAL} stroke="none" transform="translate(6 5)" />
    <path d="M130 30 L214 62 L130 94 L46 62 Z" />
    <path d="M86 78 V100 Q130 122 174 100 V78" />
    <path d="M214 62 V100" />
    <circle cx="214" cy="106" r="6" fill={PEACH} />
    <text x="150" y="166" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="22" fill={LINE} stroke="none">
      108/110
    </text>
  </Doodle>
);

/** 2026, FLOWFRAME: an app window with blocks connected by a flow. */
export const FlowDoodle = () => (
  <Doodle>
    <rect x="30" y="28" width="200" height="146" rx="10" fill={VIOLET} stroke="none" transform="translate(7 6)" />
    <rect x="30" y="28" width="200" height="146" rx="10" />
    <path d="M30 54 H230" />
    <circle cx="46" cy="41" r="3" fill={LINE} />
    <circle cx="58" cy="41" r="3" fill={LINE} />
    <rect x="52" y="72" width="54" height="36" rx="6" fill={CORAL} />
    <rect x="152" y="72" width="56" height="36" rx="6" fill={LILAC} stroke="none" />
    <rect x="102" y="128" width="56" height="30" rx="6" fill={PEACH} stroke="none" />
    <path d="M106 90 H148 M142 84 L150 90 L142 96 M180 108 Q180 140 162 142 M168 136 L160 142 L168 148" />
  </Doodle>
);

/** Today: a signpost with the road still to draw. */
export const SignpostDoodle = () => (
  <Doodle>
    <path d="M70 46 H190 L210 66 L190 86 H70 Z" fill={CORAL} stroke="none" transform="translate(6 5)" />
    <path d="M70 46 H190 L210 66 L190 86 H70 Z" />
    <path d="M190 100 H80 L60 120 L80 140 H190 Z" fill={LILAC} stroke="none" transform="translate(6 5)" />
    <path d="M190 100 H80 L60 120 L80 140 H190 Z" />
    <path d="M126 30 V186" strokeWidth="4" />
    <path d="M20 186 H240" />
    <path d="M206 186 q10 -20 24 -28" strokeDasharray="2 8" />
    <text x="116" y="74" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="24" fill="var(--color-night)" stroke="none">
      ?
    </text>
  </Doodle>
);
