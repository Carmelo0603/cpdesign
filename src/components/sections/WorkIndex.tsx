import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { LocalizedProject } from "../../types/portfolio";
import { vtName } from "../../lib/projects";
import { TONE_BG, toneAt } from "../../lib/tone";
import Img from "../ui/Img";
import Icon from "../ui/Icon";

/**
 * Selected work as a large typographic index. On a mouse, the cover of the hovered
 * project floats next to the pointer on its colour plate; on touch each row shows
 * its own thumbnail. Clicking carries the image into the project page.
 */
const WorkIndex = ({ projects }: { projects: LocalizedProject[] }) => {
  const { t } = useTranslation();
  const listRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [fine] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches);
  const year = (iso: string) => new Date(iso).getFullYear();

  useEffect(() => {
    const list = listRef.current;
    const float = floatRef.current;
    if (!fine || !list || !float) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      const vx = (tx - x) * 0.25;
      float.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${Math.max(-8, Math.min(8, vx)).toFixed(2)}deg)`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = list.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    list.addEventListener("pointermove", onMove);
    return () => {
      list.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [fine]);

  return (
    <div ref={listRef} className="relative" onPointerLeave={() => setHovered(null)}>
      <ol className="border-t border-rule">
        {projects.map((p, i) => (
          <li key={p.id} className="border-b border-rule">
            <Link
              to={`/progetti/${p.id}`}
              viewTransition
              data-cursor={t("projects.cursor")}
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(null)}
              className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 py-6 md:grid-cols-[minmax(0,1fr)_14rem_6rem_auto] md:py-8"
            >
              <span className="flex min-w-0 items-center gap-5">
                {!fine && (
                  <span className={`${TONE_BG[toneAt(i)]} block w-20 shrink-0 p-1.5`}>
                    {p.cover && <Img src={p.cover} sizes="80px" alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />}
                  </span>
                )}
                <span className="block truncate text-[clamp(1.75rem,1.1rem+2.6vw,4rem)] leading-[1.05] font-bold tracking-[-0.035em] transition-[color,translate] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:text-coral">
                  {p.title}
                </span>
              </span>
              <span className="hidden text-[0.9375rem] text-ink-3 md:block">{p.category}</span>
              <span className="hidden font-mono text-sm text-ink-3 tabular-nums md:block">{year(p.createdAt)}</span>
              <span
                aria-hidden="true"
                className="inline-flex size-11 items-center justify-center rounded-full border border-ink/25 transition-colors duration-300 group-hover:border-coral group-hover:bg-coral group-hover:text-night"
              >
                <Icon name="arrowUpRight" size={18} />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {fine && (
        <div ref={floatRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 z-10">
          {projects.map((p, i) => (
            <div
              key={p.id}
              className={`work-float absolute -top-[8.5rem] left-8 w-[22rem] p-3 ${TONE_BG[toneAt(i)]} ${hovered === i ? "is-on" : ""}`}
            >
              {p.cover && (
                <Img
                  src={p.cover}
                  sizes="352px"
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                  style={hovered === i ? { viewTransitionName: vtName(p.id) } : undefined}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkIndex;
