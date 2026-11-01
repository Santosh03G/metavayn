"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type SectionSurface = "royal" | "paper" | "black";

export interface SectionCutProps {
  id?: string;
  fromSurface: SectionSurface;
  toSurface: SectionSurface;
  className?: string;
}

const SURFACE_BG: Record<SectionSurface, string> = {
  royal: "bg-royal",
  paper: "bg-paper",
  black: "bg-black",
};

// Opposite contrast shade for the 45-degree hatch band
const HATCH_COLOR: Record<SectionSurface, string> = {
  royal: "#F1EEE6", // Paper hatch against royal
  paper: "#050505", // Black hatch against paper
  black: "#F1EEE6", // Paper hatch against black
};

export function SectionCut({
  id,
  fromSurface,
  toSurface,
  className = "",
}: SectionCutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const hatchRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const hatchColor = HATCH_COLOR[toSurface];

  useEffect(() => {
    if (prefersReduced || !containerRef.current || !wipeRef.current || !hatchRef.current) {
      if (wipeRef.current) {
        wipeRef.current.style.clipPath = "none";
      }
      if (hatchRef.current) {
        hatchRef.current.style.opacity = "0";
      }
      return;
    }

    const wipeEl = wipeRef.current;
    const hatchEl = hatchRef.current;
    const container = containerRef.current;

    // Scrubbed 0.9s duration transition along 30-degree isometric angle
    const proxy = { progress: 0 };

    const tl = gsap.to(proxy, {
      progress: 1,
      duration: 0.9,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top 95%",
        end: "bottom 35%",
        scrub: 0.9,
      },
      onStart: () => {
        wipeEl.style.willChange = "clip-path";
        hatchEl.style.willChange = "opacity, clip-path";
      },
      onUpdate: () => {
        const p = proxy.progress;
        // 30 degree slope offset across container width (~14% vertical skew)
        const delta = 14;
        const topYLeft = (1 - p) * (100 + delta * 2) - delta;
        const topYRight = topYLeft + delta * 2;

        // Wipe polygon for incoming surface
        wipeEl.style.clipPath = `polygon(0% ${topYLeft}%, 100% ${topYRight}%, 100% 100%, 0% 100%)`;

        // 24px wide hatch band along the cutting boundary (approx 20% of 80px container)
        const bandHeight = 22;
        const hatchTopLeft = topYLeft - bandHeight;
        const hatchTopRight = topYRight - bandHeight;

        hatchEl.style.clipPath = `polygon(0% ${hatchTopLeft}%, 100% ${hatchTopRight}%, 100% ${topYRight}%, 0% ${topYLeft}%)`;
        // Settles from 40% (0.4) to 0 opacity as progress reaches 1.0
        hatchEl.style.opacity = `${Math.max(0, (1 - p) * 0.4)}`;
      },
      onComplete: () => {
        wipeEl.style.willChange = "auto";
        hatchEl.style.willChange = "auto";
        hatchEl.style.opacity = "0";
      },
    });

    return () => {
      tl.kill();
    };
  }, [prefersReduced]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={`relative w-full h-16 sm:h-20 overflow-hidden select-none ${SURFACE_BG[fromSurface]} ${className}`}
      aria-hidden="true"
    >
      {/* Incoming surface wipe layer */}
      <div
        ref={wipeRef}
        className={`absolute inset-0 w-full h-full ${SURFACE_BG[toSurface]}`}
        style={prefersReduced ? {} : { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}
      />

      {/* 24px band of 45-degree hatch lines at 40% opacity settling to 0 */}
      <div
        ref={hatchRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: prefersReduced ? 0 : 0.4,
          backgroundImage: `repeating-linear-gradient(45deg, ${hatchColor} 0px, ${hatchColor} 1.5px, transparent 1.5px, transparent 6px)`,
        }}
      />
    </div>
  );
}
