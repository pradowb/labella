"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
export type PointerNorm = { x: number; y: number };

export type PilhaPose = {
  x: number;
  y: number;
  ember: number;
  fade: number;
};

type PilhaScrollValue = {
  progress: RefObject<number>;
  pointer: RefObject<PointerNorm>;
  pose: RefObject<PilhaPose>;
  invalidate: RefObject<(() => void) | null>;
};

const PilhaScrollContext = createContext<PilhaScrollValue | null>(null);

export function PilhaScrollProvider({ children }: { children: ReactNode }) {
  const progress = useRef(0);
  const pointer = useRef<PointerNorm>({ x: 0, y: 0 });
  const pose = useRef<PilhaPose>({
    x: 24,
    y: -1,
    ember: 0,
    fade: 0,
  });
  const invalidate = useRef<(() => void) | null>(null);

  const value = useMemo(
    () => ({ progress, pointer, pose, invalidate }),
    [],
  );

  return (
    <PilhaScrollContext.Provider value={value}>
      {children}
    </PilhaScrollContext.Provider>
  );
}

export function usePilhaScroll() {
  const ctx = useContext(PilhaScrollContext);
  if (!ctx) {
    throw new Error("usePilhaScroll must be used within PilhaScrollProvider");
  }
  return ctx;
}
