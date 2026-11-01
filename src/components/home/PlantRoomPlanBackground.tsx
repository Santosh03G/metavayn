"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

export function PlantRoomPlanBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [driftOffset, setDriftOffset] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  // 1. Pause animation when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 2. Slow ambient drift: max 24px over the section, pauses when off-screen
  useEffect(() => {
    if (prefersReduced || !isVisible) return;

    let animId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      // Slow sinus wave drift: max 24px range (-12px to +12px)
      const offset = Math.sin(elapsed * 0.25) * 12;
      setDriftOffset(offset);

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isVisible, prefersReduced]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          transform: `translate3d(${driftOffset.toFixed(1)}px, ${(driftOffset * 0.5).toFixed(1)}px, 0)`,
          willChange: isVisible && !prefersReduced ? "transform" : "auto",
        }}
      >
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          {/* Paper Equipment & Architectural Footprints at 12% opacity */}
          <g stroke="#F1EEE6" strokeWidth="1.2" opacity="0.12">
            {/* Grid & Perimeter Foundation */}
            <rect x="120" y="80" width="1200" height="440" strokeDasharray="4 4" />
            <line x1="120" y1="220" x2="1320" y2="220" strokeDasharray="2 4" />
            <line x1="120" y1="380" x2="1320" y2="380" strokeDasharray="2 4" />
            <line x1="480" y1="80" x2="480" y2="520" strokeDasharray="2 4" />
            <line x1="840" y1="80" x2="840" y2="520" strokeDasharray="2 4" />

            {/* AHU Unit 01 (Left Plant Room Zone) */}
            <rect x="160" y="120" width="260" height="130" />
            <rect x="180" y="140" width="60" height="90" />
            <rect x="250" y="140" width="70" height="90" />
            <circle cx="370" cy="185" r="35" />
            <line x1="370" y1="150" x2="370" y2="220" />
            <line x1="335" y1="185" x2="405" y2="185" />

            {/* AHU Unit 02 (Left Plant Room Zone Lower) */}
            <rect x="160" y="310" width="260" height="130" />
            <rect x="180" y="330" width="60" height="90" />
            <rect x="250" y="330" width="70" height="90" />
            <circle cx="370" cy="375" r="35" />
            <line x1="370" y1="340" x2="370" y2="410" />
            <line x1="335" y1="375" x2="405" y2="375" />

            {/* Primary Chillers (Center Bay) */}
            <rect x="540" y="140" width="240" height="90" rx="6" />
            <line x1="570" y1="140" x2="570" y2="230" />
            <line x1="750" y1="140" x2="750" y2="230" />

            <rect x="540" y="330" width="240" height="90" rx="6" />
            <line x1="570" y1="330" x2="570" y2="420" />
            <line x1="750" y1="330" x2="750" y2="420" />

            {/* Condenser Pump Bank (Right Bay) */}
            <rect x="920" y="120" width="80" height="60" />
            <circle cx="960" cy="150" r="18" />
            <rect x="920" y="210" width="80" height="60" />
            <circle cx="960" cy="240" r="18" />
            <rect x="920" y="300" width="80" height="60" />
            <circle cx="960" cy="330" r="18" />
            <rect x="920" y="390" width="80" height="60" />
            <circle cx="960" cy="420" r="18" />

            {/* Electrical & Control Cabinets */}
            <rect x="1080" y="140" width="180" height="40" />
            <rect x="1080" y="220" width="180" height="40" />
            <rect x="1080" y="300" width="180" height="40" />
            <rect x="1080" y="380" width="180" height="40" />
          </g>

          {/* Dashed Copper Pipe Routes with Subtle Flow Motion */}
          <g stroke="#F0A06A" strokeWidth="1.6" opacity="0.38">
            {/* Primary Chilled Water Supply Loop */}
            <path
              d="M 420 185 L 500 185 L 500 160 L 540 160 M 780 160 L 880 160 L 880 150 L 920 150 M 1000 150 L 1050 150"
              strokeDasharray="8 6"
              strokeDashoffset={prefersReduced ? 0 : driftOffset * 4}
            />

            {/* Chilled Water Return Loop */}
            <path
              d="M 420 375 L 500 375 L 500 350 L 540 350 M 780 350 L 880 350 L 880 330 L 920 330 M 1000 330 L 1050 330"
              strokeDasharray="8 6"
              strokeDashoffset={prefersReduced ? 0 : -driftOffset * 4}
            />

            {/* Header Cross-Tie */}
            <path
              d="M 500 185 L 500 375"
              strokeDasharray="6 4"
              strokeDashoffset={prefersReduced ? 0 : driftOffset * 2}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
