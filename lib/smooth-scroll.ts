"use client";

import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

export function initSmoothScroll() {
  registerGsap();

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return null;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const ticker = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy() {
      gsap.ticker.remove(ticker);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    },
  };
}
