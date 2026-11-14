import { useEffect } from "react";
import Lenis from "lenis";

/** Inertial scrolling for mouse and trackpad users. Touch keeps native scrolling; reduced motion turns it off. */
const SmoothScroll = () => {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -72 } });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
};

export default SmoothScroll;
