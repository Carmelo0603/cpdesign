/** Colour plate behind a project image. Assigned by the project's position in the
    archive (newest first), so neighbours never share a colour and a project keeps
    the same plate on the home page, in the archive and on its own page. */
export type Tone = "blue" | "orange" | "yellow";

const TONES: Tone[] = ["blue", "orange", "yellow"];

export const toneAt = (index: number): Tone => TONES[Math.max(index, 0) % TONES.length];

export const TONE_BG: Record<Tone, string> = {
  blue: "bg-violet",
  orange: "bg-coral",
  yellow: "bg-peach",
};
