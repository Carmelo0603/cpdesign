import { useEffect, useRef, type ReactNode, type SVGProps } from "react";

/**
 * Frame for every authored illustration. Strokes marked `data-draw` draw themselves,
 * shapes marked `data-pop` / `data-rise` arrive, once the drawing scrolls into view.
 * Without JS, or with reduced motion, the drawing is simply there.
 */
const Illo = ({
  viewBox,
  label,
  children,
  className = "",
  eager = false,
  ...rest
}: {
  viewBox: string;
  /** Accessible description; omit for purely decorative drawings. */
  label?: string;
  children: ReactNode;
  className?: string;
  /** Above the fold: play on mount instead of waiting for the viewport. */
  eager?: boolean;
} & Omit<SVGProps<SVGSVGElement>, "children">) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Phase classes are set on the node directly: they only drive CSS, never React output.
    if (eager) {
      el.classList.add("is-in");
      return;
    }
    const rect = el.getBoundingClientRect();
    // Already on screen at mount: leave it drawn rather than blanking it.
    if (rect.top < window.innerHeight * 0.9) return;
    el.classList.add("is-waiting");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.replace("is-waiting", "is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      className={`illo ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
};

export default Illo;
