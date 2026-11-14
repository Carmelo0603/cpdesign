---
name: CPDESIGN
description: Portfolio of Carmelo Provenzani, Front-End Developer e UX Engineer. An immersive night-time journey in sunset light, from the lens over his name to the deck of disciplines, the road from Catania and the work.
colors:
  paper: "#13161c"
  paper-2: "#1b1f27"
  paper-3: "#232835"
  ink: "#efe9de"
  ink-2: "#cfc9d6"
  ink-3: "#9d98ad"
  rule: "#2c3140"
  night: "#13161c"
  night-2: "#1b1f27"
  sand: "#efe9de"
  sand-rule: "#c9c1b3"
  violet: "#3b2a6b"
  violet-glow: "#5a3fa0"
  lilac: "#c9b8f5"
  coral: "#e8735a"
  peach: "#f0b8a0"
  danger: "#ff6b6b"
typography:
  display:
    fontFamily: "Archivo Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(3.5rem, 1rem + 10.6vw, 10.5rem) on the cover; clamp(3rem, 15vw, 9rem) for page titles"
    fontWeight: 700
    lineHeight: 0.88
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Archivo Variable"
    fontSize: "clamp(2rem, 1.15rem + 3vw, 3.75rem)"
    fontWeight: 700
    letterSpacing: "-0.03em"
  voice:
    fontFamily: "Instrument Serif, Iowan Old Style, Georgia, serif"
    fontStyle: "italic"
    fontWeight: 400
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    usage: "Only for real code: the lens layer, the code toggle, the deck counter, project years and journey place names"
  body:
    fontFamily: "Archivo Variable"
    fontSize: "1.0625rem to 1.125rem"
    lineHeight: 1.65
rounded:
  pill: "9999px"
  card: "28px"
spacing:
  gutter: "16px / 24px / 40px"
  section: "96px to 128px"
  container-max: "1440px"
---

# Design System: CPDESIGN

## Overview

**Creative North Star: "Tramonto sullo Ionio"**

The home page is a night walk lit by a sunset. The ground is a deep night (#13161C). Behind every page, slow glows of violet, coral and lilac drift and lean toward the pointer, and a film grain sits over everything.

The visitor moves through five scenes:

1. **The lens.** The name sits on the cover in heavy Archivo, with a coral serif aside: "designer che programma".
   - A small glass lens (radius 44 to 72px) follows the pointer and replaces the cursor there.
   - Under it lies the real JSX of this cover: 14 indented, syntax-coloured lines with line numbers, on a dotted editor grid, plus a second column of comments.
   - The code is sized from the title size, so line 4 (`Carmelo`) sits under the first name and line 8 (`Provenzani`) under the surname.
   - When idle, or on touch, the lens wanders by itself. A toggle, "Mostra il codice", reveals the whole layer.
2. **The deck.** Four cards, one per discipline, stacked in the middle of a pinned stage: Il segno (lilac), La struttura (coral), Il codice (violet), Insieme (night). Scrolling draws the top card's illustration and then throws the card away, rotated, to uncover the next. Each card has about 1.9 viewports of scroll, so the deck reads slowly. A counter and arrows move between cards.
3. **The journey.** Vertical scroll drives a horizontal ride through the places of the path:
   - Catania and the Accademia (Etna);
   - Epicode (laptop and coffee);
   - the degree, 108/110 (cap and thesis);
   - FLOWFRAME (app flow);
   - today (signpost).

   A coral line draws along the route with a glowing head, and each stop wakes up as the line reaches it.
4. **The work.** A large typographic index. On a mouse, the cover of the hovered project floats beside the pointer on its colour plate, tilting with speed. On touch, every row shows its own thumbnail.
5. **The finale.** "Parliamo? di un progetto, di un'idea." A coral magnetic button leans toward the pointer and copies the email. Next to it, the contact form sits on a soft glass card.

**Tone:** the site shows the work. It never says Carmelo is looking for a job, and the back-end is presented as a field he is growing in, never as "basics".

The palette replaces "Notte sull'Etna" (option A) with option B, which the user chose on 2026-11-13, while keeping all of A's interaction ideas. It also replaces the earlier bright editorial fields (electric blue, yellow, orange), which the user found too loud.

## Colors

- **Night** (paper, night): the page ground. The fixed tokens night and sand keep their value inside colour fields and illustrations, where the theme tokens would flip.
- **Sand** (ink, sand): text and primary pills. Ink 2 and Ink 3 are lilac-tinted greys for secondary text, both above 6:1 on night.
- **Violet / Violet glow**: the sunset field (About cover, 404, next-project band, the Code card) and illustration fills.
- **Coral**: the warm accent. It is used for the cover aside, the journey line and head, hovers, the cursor dot, the magnetic button and selection. Night text goes on it.
- **Lilac**: the cool accent, for the availability dot, code tokens, the Segno card and focus rings.
- **Peach**: the soft accent for light-button hovers and illustration fills.
- **Rules** (rule): hairlines, #2C3140.

## Typography

- **Archivo 700** for the name, page titles and section titles, in sentence case, tracked -0.03 to -0.045em.
- **Instrument Serif italic** is the personal voice: asides, leads, kickers, years.
- **Monospace** only where something is literally code or data.

## Atmosphere and motion

- **Ambient** (`atmosphere/Ambient.tsx`): three radial-gradient glows with no blur filters, drifting over 38 to 52 seconds and following the pointer with damping. Grain is an SVG noise tile at 7% in overlay.
- **Cursor** (`atmosphere/Cursor.tsx`): only for a fine pointer with motion allowed. A coral dot sits on the exact position and a ring follows it.
  - Over links and buttons the ring opens to 56px.
  - Over `data-cursor` elements it becomes a sand disc with a word: Codice, Scorri, Apri, Copia.
  - Inputs keep the text cursor.
- **Smooth scroll** (`atmosphere/SmoothScroll.tsx`): Lenis, only for a fine pointer with motion allowed.
- **Scroll scenes**: the deck and the journey are pinned sections. Their progress is written to CSS variables (`--cp`, `--fly`, `--depth`) or to transforms in a requestAnimationFrame callback. React state changes only when the active card changes.
- **Reduced motion**: there is no lens, cursor, smooth scroll or glow drift. The deck and the journey become plain stacked sections, fully drawn.
- **Transitions**: View Transitions carry the project image from the index or the plate to the detail page.

## Components

- **Pills** (rounded-full) for every button and tag.
- **Cards** with a 28px radius only in the deck and the contact form.
- **Project plates**: square, tinted violet, coral or peach by the project's position in the archive.

## Illustrations

- **Stages** (deck): flat, with a night line on a sand sheet. They build with the scroll: `data-d` strokes draw, `data-s` shapes rise, `data-p` shapes pop, and each starts at its own `--a`.
- **Doodles** (journey): a sand line with fills printed slightly off register, like a two-colour riso print.
- All illustrations are decorative and authored as SVG. There is no portrait and no stock imagery.

## Do / Don't

- Do let the night and the glows carry the mood, and keep colour fields for a few moments.
- Do give every pointer interaction a keyboard, touch and reduced-motion path.
- Don't use eyebrow labels over headings, neon, gradient text or heavy WebGL.
