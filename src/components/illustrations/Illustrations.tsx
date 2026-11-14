import type { CSSProperties } from "react";
import Illo from "./Illo";

/* Authored editorial illustrations that tell the path from graphic design to code.
   Flat colour fields with one ink line weight; strokes with pathLength=1 can draw in. */

const INK = "var(--color-night)";
const PAPER = "var(--color-sand)";
const BLUE = "var(--color-violet-glow)";
const BLUE_SOFT = "var(--color-lilac)";
const ORANGE = "var(--color-coral)";
const YELLOW = "var(--color-peach)";
const RULE = "var(--color-sand-rule)";

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

type Props = { className?: string; label?: string; eager?: boolean };

/** Chapter three: today — a designed button, selected, and its code beside it. */
export const DesignAndCode = ({ className, label }: Props) => (
  <Illo viewBox="0 0 400 320" className={className} label={label}>
    <g data-rise style={d(0)}>
      <rect x="30" y="40" width="226" height="196" fill={PAPER} stroke={INK} strokeWidth="3" />
      <path d="M62 86 H196" stroke={INK} strokeWidth="9" />
      <path d="M62 110 H160" stroke={RULE} strokeWidth="6" />
      <rect x="62" y="150" width="140" height="42" rx="21" fill={BLUE} />
      <path d="M100 171 H164" stroke={PAPER} strokeWidth="5" />
    </g>
    <rect x="54" y="142" width="156" height="58" stroke={BLUE} strokeWidth="2.5" pathLength={1} data-draw style={d(300)} />
    {[
      [54, 142],
      [210, 142],
      [54, 200],
      [210, 200],
    ].map(([x, y], i) => (
      <rect key={i} x={x - 5} y={y - 5} width="10" height="10" fill={PAPER} stroke={BLUE} strokeWidth="2.5" data-pop style={d(600 + i * 70)} />
    ))}
    <g data-rise style={d(700)}>
      <rect x="226" y="150" width="152" height="140" rx="12" fill={INK} />
    </g>
    <path d="M246 180 H280" stroke={YELLOW} strokeWidth="6" pathLength={1} data-draw style={d(900)} />
    <path d="M288 180 H350" stroke={BLUE_SOFT} strokeWidth="6" pathLength={1} data-draw style={d(980)} />
    <path d="M262 204 H340" stroke={PAPER} strokeWidth="6" pathLength={1} data-draw style={d(1060)} />
    <path d="M262 228 H318" stroke={ORANGE} strokeWidth="6" pathLength={1} data-draw style={d(1140)} />
    <path d="M246 252 H286" stroke={YELLOW} strokeWidth="6" pathLength={1} data-draw style={d(1220)} />
    <g transform="translate(212 204)">
      <g data-rise style={d(1300)}>
      <path d="M0 0 L0 38 L10 29 L18 46 L26 42 L18 26 L32 26 Z" fill={INK} stroke={PAPER} strokeWidth="2.5" />
      </g>
    </g>
  </Illo>
);

/** Off screen: calisthenics and streetlifting. */
export const Calisthenics = ({ className, label }: Props) => (
  <Illo viewBox="0 0 400 320" className={className} label={label}>
    <path d="M40 300 H360" stroke={INK} strokeWidth="3" />
    <path d="M70 300 V54 M330 300 V54" stroke={INK} strokeWidth="7" pathLength={1} data-draw style={d(0)} />
    <path d="M52 54 H348" stroke={INK} strokeWidth="9" pathLength={1} data-draw style={d(200)} />
    <path d="M160 58 V150 M240 58 V150" stroke={ORANGE} strokeWidth="7" pathLength={1} data-draw style={d(450)} />
    <circle cx="160" cy="176" r="25" stroke={INK} strokeWidth="9" data-pop style={d(700)} />
    <circle cx="240" cy="176" r="25" stroke={INK} strokeWidth="9" data-pop style={d(780)} />
    <g data-rise style={d(600)}>
      <circle cx="124" cy="256" r="44" fill={BLUE} stroke={INK} strokeWidth="3" />
      <circle cx="124" cy="256" r="30" stroke={BLUE_SOFT} strokeWidth="2.5" />
      <circle cx="124" cy="256" r="9" fill={PAPER} stroke={INK} strokeWidth="2.5" />
    </g>
    <g data-pop style={d(950)}>
      <circle cx="262" cy="286" r="14" fill={PAPER} stroke={INK} strokeWidth="2.5" />
      <circle cx="284" cy="278" r="18" fill={PAPER} stroke={INK} strokeWidth="2.5" />
      <circle cx="306" cy="287" r="12" fill={PAPER} stroke={INK} strokeWidth="2.5" />
    </g>
  </Illo>
);

/** 404: a path whose last anchor came loose. */
export const LostAnchor = ({ className, label }: Props) => (
  <Illo viewBox="0 0 400 300" className={className} label={label} eager>
    <path d="M40 236 C 96 60, 186 270, 232 140" stroke={PAPER} strokeWidth="6" pathLength={1} data-draw style={d(0)} />
    <path d="M238 128 L322 74" stroke={PAPER} strokeWidth="3" strokeDasharray="2 10" />
    <rect x="29" y="225" width="22" height="22" fill={BLUE} stroke={PAPER} strokeWidth="3" data-pop style={d(200)} />
    <rect x="221" y="129" width="22" height="22" fill={BLUE} stroke={PAPER} strokeWidth="3" data-pop style={d(900)} />
    <g transform="rotate(18 340 62)">
      <g data-pop style={d(1200)}>
      <rect x="326" y="48" width="28" height="28" fill={ORANGE} stroke={PAPER} strokeWidth="3" />
      </g>
    </g>
    <text x="318" y="210" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="110" fill={YELLOW} data-rise style={d(1400)}>
      ?
    </text>
  </Illo>
);
