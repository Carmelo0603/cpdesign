import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SITE } from "../../config/site";
import { useLang } from "../../hooks/usePage";
import { ButtonAnchor, ButtonLink } from "../ui/Button";
import { Container } from "../ui/Section";

/** The title as it reads to a visitor. */
const Title = () => {
  const { t } = useTranslation();
  return (
    <h1 id="hero-title" className="hero-title">
      <span className="hero-line mast-in">{t("hero.first")}</span>
      <span className="hero-line hero-line--indent mast-in" style={{ ["--delay" as string]: "120ms" }}>
        {t("hero.last")}
      </span>
      <span className="hero-accent voice fade-in text-coral" style={{ ["--delay" as string]: "380ms" }}>
        {t("hero.accent")}
      </span>
    </h1>
  );
};

const TOKEN = /(\{\/\*.*?\*\/\}|"[^"]*"|<\/?[\w.]+|\/?>|\b(?:export|const)\b|[\w-]+(?==))/g;

/** Light syntax colouring for the few JSX lines the lens reveals. */
const Highlight = ({ line }: { line: string }) => (
  <>
    {line.split(TOKEN).map((part, i) => {
      if (!part) return null;
      const cls = part.startsWith("{/*")
        ? "text-ink-3 italic"
        : part.startsWith('"')
        ? "text-coral"
        : part.startsWith("<") || part === ">" || part === "/>"
          ? "text-lilac"
          : part === "export" || part === "const"
            ? "text-peach"
            : /^[\w-]+$/.test(part) && i % 2 === 1
              ? "text-peach/80"
              : "text-sand";
      return (
        <span key={i} className={cls}>
          {part}
        </span>
      );
    })}
  </>
);

/** The code of this very cover, indented, lined up so that the name falls under the name. */
const CodeLayer = () => {
  const { t } = useTranslation();
  const lines = [
    "export const Hero = () => (",
    '  <section className="hero" aria-labelledby="hero-title">',
    '    <h1 id="hero-title" className="hero-title">',
    `      <span className="hero-line">${t("hero.first")}</span>`,
    "      <span",
    '        className="hero-line hero-line--indent"',
    '        style={{ "--delay": "120ms" }}>',
    `        ${t("hero.last")}`,
    "      </span>",
    `      <em className="hero-accent voice">${t("hero.accent")}</em>`,
    "    </h1>",
    '    <Lens radius={64} follow="pointer" idle="wander" />',
    "  </section>",
    ");",
  ];
  // Comments sit in a second column, so the right side of the title has code under it too.
  const notes: Record<number, string> = { 1: t("hero.note1"), 3: t("hero.note2"), 7: t("hero.note3"), 9: t("hero.note4"), 11: t("hero.note5") };
  const withNotes = lines.map((line, i) => (notes[i] ? `${line.padEnd(Math.max(58, line.length + 3))}{/* ${notes[i]} */}` : line));
  return (
    <div className="hero-codeblock" aria-hidden="true">
      {withNotes.map((line, i) => (
        <div key={i} className="whitespace-pre">
          <span className="hero-gutter">{i + 1}</span>
          <Highlight line={line} />
        </div>
      ))}
    </div>
  );
};

/**
 * Cover. A lens follows the pointer (or wanders by itself on touch and when idle) and
 * shows the code layer under the title: design on top, code underneath. The toggle
 * reveals the whole code layer for keyboard, touch and reduced-motion users.
 */
const Hero = () => {
  const { t } = useTranslation();
  const lang = useLang();
  const stage = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let lastInput = -Infinity;
    let frame = 0;
    let visible = true;
    const start = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      lastInput = performance.now();
    };
    const tick = (now: number) => {
      const r = el.getBoundingClientRect();
      if (now - lastInput > 2600) {
        // Idle: wander over the title in a slow figure of eight.
        const s = (now - start) / 1000;
        tx = r.width * (0.36 + 0.24 * Math.sin(s * 0.45));
        ty = r.height * (0.42 + 0.2 * Math.sin(s * 0.9));
      }
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.setProperty("--lx", `${x.toFixed(1)}px`);
      el.style.setProperty("--ly", `${y.toFixed(1)}px`);
      frame = visible ? requestAnimationFrame(tick) : 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(tick);
    });
    io.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onMove);
    frame = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onMove);
    };
  }, []);

  return (
    <section aria-labelledby="hero-title" className="relative">
      <Container className="flex min-h-[calc(100svh-4rem)] flex-col pt-8 pb-10 lg:min-h-[calc(100svh-72px)] lg:pt-10">
        <div className="fade-in flex flex-wrap items-center justify-between gap-4 text-[0.9375rem] font-medium text-ink-2">
          <span>{t("hero.role")}</span>
        </div>

        <div ref={stage} className={`hero-stage relative my-auto py-10 ${revealed ? "is-revealed" : ""}`} data-cursor-hide>
          <Title />
          <div className="hero-code" aria-hidden="true">
            <CodeLayer />
          </div>
          <span className="hero-lens" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="fade-in lg:col-span-6" style={{ ["--delay" as string]: "480ms" }}>
            <p className="max-w-[52ch] text-lg leading-relaxed text-ink-2">{t("hero.lead")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink to="/progetti" viewTransition size="lg" icon="arrowRight">
                {t("hero.ctaProjects")}
              </ButtonLink>
              <ButtonAnchor href={SITE.cv[lang]} download variant="outline" size="lg" icon="download">
                {t("hero.ctaCv")}
              </ButtonAnchor>
            </div>
          </div>
          <div className="fade-in flex items-center justify-between gap-6 lg:col-span-6 lg:justify-end" style={{ ["--delay" as string]: "600ms" }}>
            <button
              type="button"
              aria-pressed={revealed}
              onClick={() => setRevealed((v) => !v)}
              className="inline-flex items-center gap-3 rounded-full border border-ink/25 py-2 pr-4 pl-2 font-mono text-sm text-ink-2 transition-colors duration-200 hover:border-lilac hover:text-ink"
            >
              <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-full bg-paper-3 text-lilac">
                {revealed ? "Aa" : "</>"}
              </span>
              {revealed ? t("hero.showDesign") : t("hero.showCode")}
            </button>
            <span className="hidden items-center gap-3 text-sm text-ink-3 sm:inline-flex">
              {t("hero.scroll")}
              <span aria-hidden="true" className="scroll-cue" />
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
