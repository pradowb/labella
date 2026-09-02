"use client";

import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { PilhaDeCaixas } from "@/components/PilhaDeCaixas";
import { usePilhaScroll } from "@/components/PilhaScrollContext";

type Keyframe = {
  at: number;
  x: number;
  y: number;
  ember: number;
  fade: number;
};

function sample(frames: Keyframe[], t: number) {
  const p = Math.max(0, Math.min(1, t));
  if (p <= frames[0].at) return frames[0];
  const last = frames[frames.length - 1];
  if (p >= last.at) return last;
  let i = 0;
  while (i < frames.length - 1 && frames[i + 1].at < p) i += 1;
  const a = frames[i];
  const b = frames[i + 1];
  const u = (p - a.at) / (b.at - a.at);
  return {
    at: p,
    x: a.x + (b.x - a.x) * u,
    y: a.y + (b.y - a.y) * u,
    ember: a.ember + (b.ember - a.ember) * u,
    fade: a.fade + (b.fade - a.fade) * u,
  };
}

export function PilhaCompanheira() {
  const { progress, pointer, pose, invalidate } = usePilhaScroll();

  useGSAP(() => {
    registerGsap();
    const mm = gsap.matchMedia();
    const el = document.querySelector<HTMLElement>(".pilha-companheira");
    if (!el) return;

    const setX = gsap.quickSetter(el, "x", "px");
    const setY = gsap.quickSetter(el, "y", "px");
    const setA = gsap.quickSetter(el, "autoAlpha");

    const apply = (x: number, y: number, fade: number, ember: number) => {
      pose.current.x = x;
      pose.current.y = y;
      pose.current.fade = fade;
      pose.current.ember = ember;
      setX(x);
      setY(y);
      setA(fade);
    };

    mm.add("(prefers-reduced-motion: reduce)", () => {
      progress.current = 1;
      apply(0, 0, 1, 0);
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const frames: Keyframe[] = mobile
        ? [
            { at: 0, x: 0, y: 0, ember: 0, fade: 1 },
            { at: 0.16, x: 0, y: 0, ember: 0, fade: 1 },
            { at: 0.32, x: 0, y: -6, ember: 0, fade: 1 },
            { at: 0.5, x: -4, y: -40, ember: 1, fade: 1 },
            { at: 0.68, x: -6, y: -48, ember: 0.2, fade: 0.85 },
            { at: 1, x: 0, y: 4, ember: 0, fade: 1 },
          ]
        : [
            { at: 0, x: 0, y: 0, ember: 0, fade: 1 },
            { at: 0.16, x: 0, y: 4, ember: 0, fade: 1 },
            { at: 0.32, x: -8, y: 8, ember: 0, fade: 1 },
            { at: 0.5, x: -10, y: -48, ember: 1, fade: 1 },
            { at: 0.68, x: -14, y: -56, ember: 0.2, fade: 0.85 },
            { at: 1, x: -8, y: 6, ember: 0, fade: 1 },
          ];

      apply(0, 0, 0, 0);

      const journey = ScrollTrigger.create({
        trigger: "#ato-01",
        endTrigger: "#ato-05",
        start: "top 80%",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const k = sample(frames, self.progress);
          apply(k.x, k.y, k.fade, k.ember);
          invalidate.current?.();
        },
        onRefresh: (self) => {
          if (!self.isActive && self.progress <= 0) {
            apply(0, 0, 0, 0);
            return;
          }
          const k = sample(frames, self.progress);
          apply(k.x, k.y, k.fade, k.ember);
        },
        onLeaveBack: () => apply(0, 0, 0, 0),
      });

      const onMove = (e: PointerEvent) => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        pointer.current.x = (e.clientX / w) * 2 - 1;
        pointer.current.y = (e.clientY / h) * 2 - 1;
        invalidate.current?.();
      };
      const onLeave = () => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerleave", onLeave);

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        journey.kill();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => mm.revert();
  });

  return (
    <div className="pilha-companheira" aria-hidden="true">
      <PilhaDeCaixas progress={progress} pointer={pointer} ember={pose} />
    </div>
  );
}
