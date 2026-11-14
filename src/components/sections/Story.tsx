import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ButtonAnchor, ButtonLink } from "../ui/Button";
import Icon from "../ui/Icon";
import { Container } from "../ui/Section";
import { CodeStage, SignStage, StructureStage, TogetherStage } from "../illustrations/Stages";

interface Card {
  n: 1 | 2 | 3 | 4;
  /** Card surface and its text colour. */
  surface: string;
  dark: boolean;
  stage: ReactNode;
  skills: string[];
}

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CardCopy = ({ c, last }: { c: Card; last: boolean }) => {
  const { t } = useTranslation();
  const muted = c.dark ? "text-sand/75" : "text-night/70";
  return (
    <div className="flex flex-col items-start">
      <p className={`voice text-[1.25rem] leading-none tabular-nums md:text-[1.5rem] ${muted}`}>{t(`story.c${c.n}Kicker`)}</p>
      <h3 className="mt-3 text-[clamp(2.5rem,1.4rem+4.2vw,5.25rem)] leading-[0.9] font-bold tracking-[-0.04em]">{t(`story.c${c.n}Title`)}</h3>
      <p className="voice mt-4 max-w-[24ch] text-[clamp(1.375rem,1.1rem+1vw,2rem)] leading-[1.1]">{t(`story.c${c.n}Voice`)}</p>
      <p className={`mt-4 hidden max-w-[46ch] text-[1.0625rem] leading-relaxed sm:block ${muted}`}>{t(`story.c${c.n}Body`)}</p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label={t("detail.stack")}>
        {c.skills.map((s) => (
          <li key={s} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${c.dark ? "border-sand/45" : "border-night/40"}`}>
            {s}
          </li>
        ))}
      </ul>
      {last && (
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink to="/progetti" viewTransition variant="light" icon="arrowRight">
            {t("hero.ctaProjects")}
          </ButtonLink>
          <ButtonAnchor href="#contatti" variant="outlineLight">
            {t("story.write")}
          </ButtonAnchor>
        </div>
      )}
    </div>
  );
};

/**
 * The deck: four cards, one per discipline, stacked in the middle of a pinned stage.
 * Scrolling draws the top card's illustration, then throws the card away to reveal the
 * next one. Arrows and the counter move between cards; with reduced motion the cards
 * are simply laid out one after another, fully drawn.
 */
const Story = () => {
  const { t } = useTranslation();
  const [reduced] = useState(reducedMotion);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const activeRef = useRef(0);

  const cards: Card[] = [
    { n: 1, surface: "bg-lilac text-night", dark: false, stage: <SignStage />, skills: [t("story.s.typography"), t("story.s.layout"), t("story.s.identity"), "Illustrator"] },
    {
      n: 2,
      surface: "bg-coral text-night",
      dark: false,
      stage: <StructureStage notes={[t("story.note1"), t("story.note2"), t("story.note3")]} />,
      skills: [t("skills.research"), "Wireframing", t("skills.prototyping"), "Figma"],
    },
    { n: 3, surface: "bg-violet text-sand", dark: true, stage: <CodeStage />, skills: ["React", "TypeScript", "Redux", "Tailwind CSS", "SASS"] },
    { n: 4, surface: "bg-night-2 text-sand ring-1 ring-sand/15", dark: true, stage: <TogetherStage />, skills: ["Java", "Spring Boot", "MySQL", "Git"] },
  ];
  const total = cards.length;

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const wrap = wrapRef.current;
      const sticky = stickyRef.current;
      if (!wrap || !sticky) return;
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const distance = wrap.offsetHeight - sticky.offsetHeight;
      const p = Math.min(1, Math.max(0, (top - wrap.getBoundingClientRect().top) / Math.max(distance, 1)));
      const scaled = p * total;
      const i = Math.min(total - 1, Math.floor(scaled));
      const local = i === total - 1 ? Math.min(1, scaled - i) : scaled - i;
      cardRefs.current.forEach((el, j) => {
        if (!el) return;
        // Drawing fills the first 60% of a card's stretch; the last 30% throws it away.
        const cp = j < i ? 1 : j > i ? 0 : Math.min(1, local / 0.6);
        const fly = j < i ? 1 : j > i || j === total - 1 ? 0 : Math.max(0, (local - 0.7) / 0.3);
        const depth = Math.max(0, j - i - (j > i ? Math.max(0, (local - 0.7) / 0.3) : 0));
        el.style.setProperty("--cp", cp.toFixed(3));
        el.style.setProperty("--fly", fly.toFixed(3));
        el.style.setProperty("--depth", depth.toFixed(3));
      });
      if (i !== activeRef.current) {
        activeRef.current = i;
        setActive(i);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, total]);

  const jump = (j: number) => {
    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    if (!wrap || !sticky) return;
    const k = Math.max(0, Math.min(total - 1, j));
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const distance = wrap.offsetHeight - sticky.offsetHeight;
    const y = wrap.getBoundingClientRect().top + window.scrollY - top + ((k + 0.62) / total) * distance;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const head = (
    <div className="flex items-end justify-between gap-6">
      <h2 id="deck-title" className="max-w-[18ch] text-[clamp(1.375rem,1rem+2vw,3rem)] leading-[1] font-bold tracking-[-0.03em]">
        {t("story.title")}
      </h2>
      {!reduced && (
        <div className="flex shrink-0 items-center gap-3">
          <p className="font-mono text-sm text-ink-3 tabular-nums" aria-live="polite">
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={() => jump(active - 1)}
            disabled={active === 0}
            aria-label={t("story.prev")}
            className="inline-flex size-10 items-center justify-center rounded-full border border-ink/25 md:size-11 transition-colors duration-200 hover:border-ink disabled:opacity-30"
          >
            <Icon name="arrowLeft" size={18} />
          </button>
          <button
            type="button"
            onClick={() => jump(active + 1)}
            disabled={active === total - 1}
            aria-label={t("story.next")}
            className="inline-flex size-10 items-center justify-center rounded-full border border-ink/25 md:size-11 transition-colors duration-200 hover:border-ink disabled:opacity-30"
          >
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      )}
    </div>
  );

  const cardBody = (c: Card, stageClass: string) => (
    <div className="grid h-full grid-cols-1 content-center gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-8 lg:p-12">
      <div className="lg:col-span-5">
        <CardCopy c={c} last={c.n === total} />
      </div>
      <div className={`${stageClass} deck-stage mx-auto w-[min(100%,40svh)] lg:col-span-7 lg:w-full`}>{c.stage}</div>
    </div>
  );

  if (reduced) {
    return (
      <section aria-labelledby="deck-title" className="py-20">
        <Container>
          {head}
          <div className="mt-10 flex flex-col gap-6">
            {cards.map((c) => (
              <article key={c.n} className={`deck-card-static overflow-hidden rounded-[28px] ${c.surface}`}>
                {cardBody(c, "stage")}
              </article>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section aria-labelledby="deck-title" ref={wrapRef} style={{ height: `${total * 190}svh` }} className="relative">
      <div ref={stickyRef} className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col overflow-hidden lg:top-[72px] lg:h-[calc(100svh-72px)]">
        <Container className="pt-6 md:pt-8">{head}</Container>
        <Container className="relative min-h-0 flex-1 pt-5 pb-6 md:pt-6 lg:pb-10">
          <div className="relative h-full" data-cursor={t("story.cursor")}>
            {cards.map((c, j) => (
              <article
                key={c.n}
                ref={(el) => {
                  cardRefs.current[j] = el;
                }}
                aria-hidden={j !== active}
                className={`deck-card stage absolute inset-0 overflow-hidden rounded-[28px] ${c.surface}`}
                style={{ zIndex: total - j, ["--depth" as string]: j, ["--tilt" as string]: j % 2 ? 1 : -1 }}
              >
                {cardBody(c, "")}
              </article>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Story;
