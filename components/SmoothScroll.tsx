"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { initSmoothScroll } from "@/lib/smooth-scroll";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerGsap();
    const instance = initSmoothScroll();
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      instance?.destroy();
    };
  }, []);

  return <>{children}</>;
}
