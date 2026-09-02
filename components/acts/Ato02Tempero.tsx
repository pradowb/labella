"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";

const RETRATOS = [
  {
    id: "manjericao",
    name: "Manjericão",
    origin: "do quintal",
    note: "folha verde, colhida no dia",
    drift: -42,
  },
  {
    id: "calabresa",
    name: "Calabresa",
    origin: "da casa",
    note: "defumada, fatiada fina",
    drift: 28,
  },
  {
    id: "catupiry",
    name: "Catupiry",
    origin: "brasileiro",
    note: "creme, o sotaque na massa",
    drift: -58,
  },
] as const;

export function Ato02Tempero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });

          RETRATOS.forEach((_, i) => {
            tl.fromTo(
              `.polaroid:nth-child(${i + 1})`,
              { autoAlpha: 0, y: 56 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
              },
              i * 0.28,
            );
          });

          RETRATOS.forEach((item, i) => {
            tl.to(
              `.polaroid:nth-child(${i + 1})`,
              { y: item.drift, duration: 1.1, ease: "none" },
              1.35,
            );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="ato-02"
      className="act tempero"
      data-hud="ATO 02 — O TEMPERO"
    >
      <div className="act__inner">
        <div className="tempero__intro">
          <p className="act__kicker">Ato 02</p>
          <h2 className="act__title">O tempero brasileiro.</h2>
          <p className="act__lede">
            Três stills na mesa. Luz de estúdio. O sotaque que a Itália não
            esperava.
          </p>
        </div>

        <ul className="tempero__grid">
          {RETRATOS.map((item) => (
            <li key={item.id} className={`polaroid polaroid--${item.id}`}>
              <figure className="polaroid__frame">
                <div className="polaroid__photo" aria-hidden="true" />
                <figcaption className="polaroid__caption">
                  <p className="polaroid__code">{item.origin}</p>
                  <h3 className="polaroid__name">{item.name}</h3>
                  <p className="polaroid__note">{item.note}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
