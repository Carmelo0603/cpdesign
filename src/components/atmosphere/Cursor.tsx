import { useEffect, useRef, useState } from "react";

/**
 * Pointer companion for mouse users: a dot on the exact position and a ring that
 * follows with a little lag. Over anything interactive the ring opens; elements
 * with data-cursor="Label" show that word inside it; inside data-cursor-hide the
 * companion steps aside (the hero lens takes its place). Touch and reduced motion get
 * the native cursor only.
 */
const Cursor = () => {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches,
  );
  const [label, setLabel] = useState("");
  const [state, setState] = useState<"idle" | "hover" | "label" | "text" | "hidden">("hidden");

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let frame = 0;
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const classify = (target: Element | null) => {
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (target?.closest("[data-cursor-hide]")) {
        // The hero lens is the cursor there.
        setState("hidden");
      } else if (labelled) {
        setLabel(labelled.dataset.cursor ?? "");
        setState("label");
      } else if (target?.closest("input, textarea, select, [contenteditable]")) {
        setState("text");
      } else if (target?.closest("a, button, [role=slider], label")) {
        setState("hover");
      } else {
        setState("idle");
      }
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      classify(e.target as Element | null);
    };
    // Scrolling moves content under a still pointer: re-read what is under it.
    const onScroll = () => classify(document.elementFromPoint(x, y));
    const onLeave = () => setState("hidden");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className={`cursor cursor--${state}`}>
      <div ref={ring} className="cursor-ring">
        <span className="cursor-ring__shape">
          <span className="cursor-ring__label">{label}</span>
        </span>
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
};

export default Cursor;
