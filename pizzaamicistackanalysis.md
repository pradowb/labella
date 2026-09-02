# Análise Técnica — pizza-amici.nl

Levantamento feito a partir da inspeção dos requests de rede, scripts carregados e comportamento visual (desktop e mobile) do site.

## Stack / Tecnologias

O site é construído no **Webflow** (CMS/builder — confirmado pelos arquivos `webflow.schunk.*.js`, hospedagem em `cdn.prod.website-files.com`, e jQuery 3.5.1 carregado via CDN padrão do Webflow).

### Animação e interação

- **GSAP 3.15** como motor principal de animação, com os plugins **ScrollTrigger** (animações disparadas pelo scroll), **SplitText** (quebra de texto em caracteres/palavras para animar), **Observer**, **Draggable**, **InertiaPlugin** e **CustomEase** — tudo carregado do CDN oficial do Webflow para GSAP.
- **Locomotive Scroll** — responsável pelo scroll suave com inércia.
- **Swiper 8** — usado nos carrosséis (cards dos foodtrucks "IL BAMBINO", "IL CAPO DUE" etc. e o carrossel de depoimentos).

Nenhum uso de **Three.js** foi identificado — não há renderização 3D/WebGL no site.

### Outros itens do stack

- **Web Font Loader** (webfont.js do Google) + **Adobe Fonts/Typekit** (`use.typekit.net`) para as fontes customizadas (Azeret Mono, La Belle Aurore, e uma fonte serifada própria "Awesome Serif" hospedada no CDN do Webflow).
- **HLS.js + Bunny.net** — streaming de vídeo (`.m3u8`/`.ts`) usado no vídeo de fundo do hero.
- **Google Tag Manager** (GTM-N3VDHNM) para analytics/tags.
- **Cloudflare Turnstile** — proteção anti-bot, provavelmente no formulário de orçamento/contato.
- **@reform-digital/script-embed** e **embed-script** — pacotes que parecem alimentar um formulário embutido.
- **cdn.odyn.dev** (bundle.js/css) — widget de terceiros embutido (provavelmente chat, reviews ou agendamento).

## Structure (ordem das seções)

1. Barra de anúncio fixa no topo ("3000+ cateringen • 4.6 estrelas • 480-600 pizza's p/u")
2. Navegação fixa (logo central, links, CTA "Boek een truck")
3. Hero full screen (colagem de fotos, selo de reviews, headline, CTA)
4. Faixa de logos de clientes (KNVB, NOS, BMW, IKEA, ING, Bijenkorf, Lamborghini...)
5. Split about section ("CIAO!" — texto à esquerda, colagem de fotos e selos numéricos à direita)
6. Carrossel/grid de foodtrucks ("Onze foodtruck boeken?" — cards IL BAMBINO, IL CAPO DUE, IL CAPO UNO, IL LUNGO, IL PICCOLO, LO SPETTACOLO)
7. Seção de processo em colunas ("Hoe het werkt" — Stap 1 a 4, cartões estilo "ticket")
8. Barra de estatísticas/prêmios (nota 4.6, prêmios do setor)
9. Carrossel de testimonials (depoimentos de clientes)
10. Split services/benefits section ("Onze voordelen" — colagem de fotos à esquerda, lista de vantagens à direita)
11. Seção de duas colunas Pizza & Pasta
12. CTA de recrutamento full-bleed (vagas, "SBB erkend leerbedrijf")
13. Footer (4 colunas de links + logo + redes sociais + copyright/legal)

## Behavior

- A navegação (incluindo a barra de anúncio acima dela) permanece **fixa (sticky)** durante todo o scroll — confirmado rolando a página inteira, ela nunca sai do topo.
- O grid de "Hoe het werkt" (4 colunas no desktop) e o carrossel de foodtrucks se comportam como **grid horizontal de múltiplas colunas no desktop**; em viewport mobile (390px) ambos colapsam para **um item por vez em scroll horizontal (swipe)**, com prévia do próximo card visível na borda.
- As seções "split" (About/"CIAO!" e "Onze voordelen") ficam **lado a lado (texto + imagem) no desktop** e, no mobile, empilham em **coluna única**, mantendo a ordem do conteúdo (texto antes da imagem).
- O scroll geral tem inércia/suavização via Locomotive Scroll, e elementos entram na tela com animações reveal disparadas por scroll via GSAP ScrollTrigger (visível no efeito de "leque" dos cards do "Hoe het werkt" e nos elementos soltos tipo polaroid espalhados pela página).
- A faixa de logos de clientes roda como um **loop/marquee horizontal contínuo**.
- O carrossel de depoimentos tem navegação por setas (Swiper).

---
*Análise gerada a partir de inspeção de rede/DOM em 01/09/2026.*
