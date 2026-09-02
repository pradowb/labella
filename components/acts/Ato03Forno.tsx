"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";

export function Ato03Forno() {
  const root = useRef<HTMLElement>(null);
  const temp = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { value: 180 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
        });

        tl.fromTo(
          ".forno__mouth",
          { scale: 0.82, autoAlpha: 0.55 },
          { scale: 1, autoAlpha: 1, duration: 1, ease: "none" },
        ).fromTo(
          ".forno__ember",
          { scale: 0.4, autoAlpha: 0.2 },
          { scale: 1.15, autoAlpha: 1, duration: 1, ease: "none" },
          0,
        );

        gsap.to(state, {
          value: 450,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=160%",
            scrub: 1,
            onUpdate: () => {
              if (temp.current) {
                temp.current.textContent = `${Math.round(state.value).toString().padStart(3, "0")}°`;
              }
            },
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="ato-03"
      className="act forno"
      data-hud="ATO 03 — O FORNO"
    >
      <div className="forno__ember" aria-hidden="true" />
      <div className="act__inner forno__inner">
        <p className="act__kicker">Ato 03</p>
        <h2 className="act__title">O forno a lenha.</h2>
        <p className="act__lede">
          A pizza entra. O tempo passa no scroll. A temperatura sobe com você.
        </p>
        <p className="forno__temp">
          <span ref={temp}>180°</span>
          <span className="forno__unit">C</span>
        </p>
        <div className="forno__mouth" aria-hidden="true" />
      </div>
    </section>
  );
}
