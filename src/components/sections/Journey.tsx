import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "../ui/Section";
import { DegreeDoodle, EtnaDoodle, FlowDoodle, LaptopDoodle, SignpostDoodle } from "../illustrations/Doodles";

interface Stop {
  n: 1 | 2 | 3 | 4 | 5;
  art: ReactNode;
}

const STOPS: Stop[] = [
  { n: 1, art: <EtnaDoodle /> },
  { n: 2, art: <LaptopDoodle /> },
  { n: 3, art: <DegreeDoodle /> },
  { n: 4, art: <FlowDoodle /> },
  { n: 5, art: <SignpostDoodle /> },
];

// The route the line takes across the track, in a 1000 x 100 box.
const ROUTE =
  "M0 62 C 60 62, 80 30, 120 34 S 190 78, 240 70 S 320 20, 380 30 S 460 82, 520 74 S 600 26, 660 30 S 740 80, 800 70 S 880 36, 940 40 L1000 40";

/** The route scaled to the track's real size, so dash length and the head share one unit. */
const scaleRoute = (w: number, h: number) =>
  ROUTE.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${((+x * w) / 1000).toFixed(1)} ${((+y * h) / 100).toFixed(1)}`);

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const StopCopy = ({ n }: { n: Stop["n"] }) => {
  const { t } = useTranslation();
  return (
    <div>
      <p className="voice text-[2rem] leading-none text-coral tabular-nums md:text-[2.5rem]">{t(`journey.s${n}Year`)}</p>
      <p className="mt-2 font-mono text-[0.8125rem] tracking-wide text-ink-3">{t(`journey.s${n}Place`)}</p>
      <h3 className="mt-3 text-title font-bold">{t(`journey.s${n}Title`)}</h3>
      <p className="mt-2 max-w-[36ch] text-[1.0625rem] leading-relaxed text-ink-2">{t(`journey.s${n}Text`)}</p>
    </div>
  );
};

/**
 * The journey: vertical scroll drives a horizontal ride through the places of the path,
 * from the Academy in Catania to today. A line draws itself along the route and a glowing
 * pen point travels at its head. Reduced motion gets a plain vertical list.
 */
const Journey = () => {
  const { t } = useTranslation();
  const [reduced] = useState(reducedMotion);
  const wrapRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 100 });

  useEffect(() => {
    const track = trackRef.current;
    if (reduced || !track) return;
    const ro = new ResizeObserver(() => setSize({ w: track.scrollWidth, h: track.clientHeight }));
    ro.observe(track);
    return () => ro.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const wrap = wrapRef.current;
      const sticky = stickyRef.current;
      const track = trackRef.current;
      const route = routeRef.current;
      if (!wrap || !sticky || !track || !route) return;
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const distance = wrap.offsetHeight - sticky.offsetHeight;
      const p = Math.min(1, Math.max(0, (top - wrap.getBoundingClientRect().top) / Math.max(distance, 1)));
      const travel = track.scrollWidth - sticky.clientWidth;
      track.style.transform = `translate3d(${(-p * travel).toFixed(1)}px, 0, 0)`;
      // The line runs a little ahead of the viewport's centre.
      const reach = Math.min(1, (p * travel + sticky.clientWidth * 0.62) / track.scrollWidth);
      route.style.strokeDashoffset = String(1 - reach);
      const len = route.getTotalLength();
      const pt = route.getPointAtLength(len * reach);
      if (headRef.current) {
        headRef.current.style.left = `${pt.x}px`;
        headRef.current.style.top = `${pt.y}px`;
      }
      track.querySelectorAll<HTMLElement>("[data-stop]").forEach((el) => {
        const x = el.offsetLeft + el.offsetWidth * 0.3;
        el.classList.toggle("is-reached", x < reach * track.scrollWidth);
      });
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
  }, [reduced, size]);

  const head = (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end md:gap-8">
      <h2 id="journey-title" className="text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-[1] font-bold tracking-[-0.03em] md:col-span-6">
        {t("journey.title")}
      </h2>
      <p className="voice text-[1.375rem] leading-snug text-ink-2 md:col-span-6 md:justify-self-end md:text-right md:text-[1.625rem]">{t("journey.lead")}</p>
    </div>
  );

  if (reduced) {
    return (
      <section aria-labelledby="journey-title" className="py-20">
        <Container>
          {head}
          <ol className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {STOPS.map((s) => (
              <li key={s.n} className="flex flex-col gap-5">
                <div className="max-w-[260px]">{s.art}</div>
                <StopCopy n={s.n} />
              </li>
            ))}
          </ol>
        </Container>
      </section>
    );
  }

  return (
    <section aria-labelledby="journey-title" ref={wrapRef} className="relative" style={{ height: "380svh" }}>
      <div ref={stickyRef} className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col overflow-hidden lg:top-[72px] lg:h-[calc(100svh-72px)]">
        <Container className="pt-6 md:pt-8">{head}</Container>
        <div className="relative min-h-0 flex-1" data-cursor={t("story.cursor")}>
          <div ref={trackRef} className="relative flex h-full w-max items-stretch will-change-transform">
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
              <path d={scaleRoute(size.w, size.h)} stroke="rgb(239 233 222 / 0.14)" strokeWidth="2" fill="none" strokeDasharray="4 8" />
              <path ref={routeRef} d={scaleRoute(size.w, size.h)} stroke="var(--color-coral)" strokeWidth="3" fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" />
            </svg>
            <span ref={headRef} aria-hidden="true" className="journey-head" />
            <ol className="relative flex h-full">
              {STOPS.map((s, i) => (
                <li
                  key={s.n}
                  data-stop
                  className={`journey-stop flex w-[82vw] shrink-0 flex-col justify-center gap-6 px-6 sm:w-[60vw] lg:w-[38vw] lg:px-10 ${i % 2 ? "lg:justify-end lg:pb-10" : "lg:justify-start lg:pt-6"}`}
                >
                  <div className="journey-art w-[min(240px,60%)]">{s.art}</div>
                  <StopCopy n={s.n} />
                </li>
              ))}
              <li aria-hidden="true" className="w-[20vw] shrink-0" />
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
