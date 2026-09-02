"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";

export function Ato04Revelacao() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".revelacao__pie",
          { scale: 0.92 },
          {
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=140%",
              pin: true,
              scrub: 1.2,
              invalidateOnRefresh: true,
              refreshPriority: 0,
            },
          },
        );

        gsap.fromTo(
          ".revelacao__name",
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=80%",
              scrub: 0.8,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="ato-04"
      className="act revelacao"
      data-hud="ATO 04 — A REVELAÇÃO"
    >
      <div className="revelacao__pie" aria-hidden="true">
        <span className="revelacao__crust" />
        <span className="revelacao__sauce" />
        <span className="revelacao__cheese" />
      </div>
      <h2 className="revelacao__name">A Brasileira</h2>
    </section>
  );
}
