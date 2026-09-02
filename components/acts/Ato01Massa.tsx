"use client";

import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePilhaScroll } from "@/components/PilhaScrollContext";

export function Ato01Massa() {
  const { progress, invalidate } = usePilhaScroll();

  useGSAP(() => {
    registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      progress.current = 1;
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      progress.current = 0;

      gsap.fromTo(
        ".massa__copy",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#ato-01",
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        },
      );

      ScrollTrigger.create({
        trigger: "#ato-01",
        endTrigger: "#ato-05",
        start: "top 80%",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        refreshPriority: 10,
        onUpdate: (self) => {
          progress.current = self.progress;
          invalidate.current?.();
        },
        onLeaveBack: () => {
          progress.current = 0;
          invalidate.current?.();
        },
      });
    });

    return () => mm.revert();
  });

  return (
    <section id="ato-01" className="act massa" data-hud="ATO 01 — A MASSA">
      <div className="act__inner massa__inner">
        <p className="act__kicker">Ato 01</p>
        <div className="massa__copy">
          <h2 className="act__title">
            A massa
            <br />
            italiana.
          </h2>
          <p className="act__lede">
            Esticada à mão, fermentada com calma. Farinha no ar, luz baixa, o
            primeiro gesto da casa.
          </p>
        </div>

        <div className="massa__stage" aria-hidden="true">
          <div className="massa__slot" />
        </div>
      </div>
    </section>
  );
}
