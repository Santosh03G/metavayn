"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseScrubOptions {
  triggerRef: React.RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | HTMLElement | string;
  onUpdate?: (progress: number) => void;
  markers?: boolean;
}

/**
 * useScrub
 *
 * Hooks a DOM element into a GSAP ScrollTrigger scrub timeline.
 * Safely handles SSR, cleanup on unmount, and reduced-motion bypass.
 */
export function useScrub({
  triggerRef,
  start = "top bottom",
  end = "bottom top",
  scrub = 1,
  pin = false,
  onUpdate,
  markers = false,
}: UseScrubOptions) {
  const reducedMotion = usePrefersReducedMotion();
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !triggerRef.current) return;

    if (reducedMotion) {
      if (onUpdate) onUpdate(1);
      return;
    }

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start,
      end,
      scrub,
      pin,
      markers,
      onUpdate: (self) => {
        if (onUpdate) {
          onUpdate(self.progress);
        }
      },
    });

    stRef.current = st;

    return () => {
      st.kill();
      stRef.current = null;
    };
  }, [triggerRef, start, end, scrub, pin, onUpdate, markers, reducedMotion]);

  return stRef;
}
