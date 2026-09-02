"use client";

import { useEffect } from "react";
import { Selo } from "@/components/Selo";

export function Hud() {
  useEffect(() => {
    const hudLabel = document.getElementById("hudLabel");
    const hudEls = document.querySelectorAll<HTMLElement>("[data-hud]");
    const current = new Map<Element, boolean>();

    const hud = document.querySelector(".hud");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => current.set(e.target, e.isIntersecting));
        let active: HTMLElement | null = null;
        for (const el of hudEls) {
          if (current.get(el)) active = el;
        }
        if (active && hudLabel) hudLabel.textContent = active.dataset.hud ?? "";
        hud?.toggleAttribute("data-on-hero", active?.id === "ato-00");
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );

    hudEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="hud" data-on-hero="">
      <a className="hud__brand" href="#ato-00">
        <Selo size={34} compact rimId="hud" className="hud__seal" />
        <span className="hud__wordmark">Lá Bella</span>
      </a>
      <p className="hud__act">
        <span className="hud__dot" aria-hidden="true" />
        <span id="hudLabel">ATO 00 — O CONVITE</span>
      </p>
    </header>
  );
}
