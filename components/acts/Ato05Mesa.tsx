"use client";

import { Selo } from "@/components/Selo";

export function Ato05Mesa() {
  return (
    <section
      id="ato-05"
      className="act mesa"
      data-hud="ATO 05 — A MESA"
    >
      <div className="act__inner mesa__inner">
        <p className="act__kicker">Ato 05</p>
        <h2 className="act__title mesa__title">A mesa está posta.</h2>
        <p className="act__lede mesa__lede">
          O único convite da página. Pegue o cartão — reserve a noite, ou leve a
          casa embora.
        </p>

        <a className="mesa-ticket" href="#reservar">
          <p className="mesa-ticket__kicker">Lugar à mesa</p>
          <h3 className="mesa-ticket__title">Mesa para a noite</h3>
          <p className="mesa-ticket__copy">
            Um cartão. Uma noite. A massa já está fermentando.
          </p>
          <span className="mesa-ticket__cta">Reservar uma mesa</span>
        </a>

        <nav className="mesa__nav" aria-label="Menu principal">
          <a href="#cardapio">Cardápio</a>
          <a href="#sobre">Sobre</a>
          <a href="#reservar">Reservar</a>
        </nav>
      </div>

      <footer className="mesa__foot" id="reservar">
        <div className="mesa__brand">
          <Selo size={72} compact rimId="foot" />
          <p className="hud__wordmark">Lá Bella</p>
        </div>
        <div className="mesa__meta">
          <p>Pizzaria brasileira</p>
          <p>Duas pátrias. Uma massa. Um forno só.</p>
          <p className="mesa__legal">© {new Date().getFullYear()} Lá Bella</p>
        </div>
      </footer>
    </section>
  );
}
