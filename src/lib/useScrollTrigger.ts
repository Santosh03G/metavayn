"use client";

import { useEffect, useRef, type DependencyList } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger once on the client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ScrollTriggerCallback = (ctx: gsap.Context) => void | (() => void);

/**
 * Custom hook to safely manage GSAP ScrollTrigger lifecycles in React.
 * Handles automatic context creation, SSR safety, resize sync, and teardown.
 */
export function useScrollTrigger(
  callback: ScrollTriggerCallback,
  deps: DependencyList = []
) {
  const isReducedMotion = useRef(false);

  useEffect(() => {
    // Check reduced motion preference
    isReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isReducedMotion.current) {
      return;
    }

    // Create GSAP context for scope cleanup
    const ctx = gsap.context(() => {
      callback(ctx);
    });

    return () => {
      ctx.revert(); // Automatically kills triggers and reverts DOM styles
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { gsap, ScrollTrigger };
