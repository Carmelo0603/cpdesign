import { useEffect, useRef } from "react";

/**
 * The sunset light behind every page: three soft glows that drift slowly and lean
 * a little toward the pointer, plus a film grain over everything. Pure CSS gradients,
 * no blur filters, so it stays cheap to composite.
 */
const Ambient = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const tick = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={ref} aria-hidden="true" className="ambient pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <span className="ambient-glow ambient-glow--violet" />
        <span className="ambient-glow ambient-glow--coral" />
        <span className="ambient-glow ambient-glow--lilac" />
      </div>
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[70]" />
    </>
  );
};

export default Ambient;
