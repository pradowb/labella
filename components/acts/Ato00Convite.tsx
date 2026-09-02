"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";

export function Ato00Convite() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".hero__shot-img",
          { scale: 1.12 },
          { scale: 1.06, duration: 2.4, ease: "power2.out" },
        );

        gsap.to(".hero__stage", {
          scale: 0.86,
          autoAlpha: 0,
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });

        gsap.fromTo(
          ".hero__shot-img",
          { scale: 1.06 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
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
      id="ato-00"
      className="act hero"
      data-hud="ATO 00 — O CONVITE"
    >
      <div className="hero__shot" aria-hidden="true">
        <img
          className="hero__shot-img"
          src="/hero/pizza-hero.jpg"
          alt=""
          draggable={false}
        />
      </div>
      <div className="hero__stage">
        <h1 className="hero__title">Lá Bella</h1>
        <p className="hero__tagline">Duas pátrias. Uma massa. Um forno só.</p>
        <a className="hero__cta" href="#ato-01">
          Entrar na cozinha
        </a>
      </div>
      <div className="hero__cue" aria-hidden="true">
        <span className="hero__cue-line" />
        <span className="hero__cue-label">Deslize</span>
      </div>
    </section>
  );
}
