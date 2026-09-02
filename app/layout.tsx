import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
  Bowlby_One,
  Bricolage_Grotesque,
  Courier_Prime,
  Inter,
  Yellowtail,
} from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const script = Yellowtail({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

const display = Bowlby_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const lede = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-lede",
});

const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Lá Bella — Duas pátrias. Uma massa. Um forno só.",
  description:
    "Pizzaria brasileira. Massa italiana, tempero do quintal, forno a lenha.",
};

export const viewport: Viewport = {
  themeColor: "#f7e7ce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${script.variable} ${display.variable} ${body.variable} ${lede.variable} ${mono.variable}`}
    >
      <body className={body.className}>
        <a className="skip" href="#ato-00">
          Ir ao conteúdo
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
