"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

const STEPS = [
  {
    num: "1",
    title: "Define",
    desc: "We understand your product requirements, engineering objectives, specifications, and project constraints.",
  },
  {
    num: "2",
    title: "Design",
    desc: "Our engineers transform requirements into detailed, accurate, and manufacturable engineering solutions.",
  },
  {
    num: "3",
    title: "Validate",
    desc: "We review designs, documentation, assemblies, BOMs, and engineering requirements to ensure quality and consistency.",
  },
  {
    num: "4",
    title: "Deliver",
    desc: "We deliver production-ready engineering outputs while maintaining documentation and revision control.",
  },
];

export function ApproachTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const node1Ref = useRef<HTMLDivElement>(null);
  const node4Ref = useRef<HTMLDivElement>(null);

  const [lineBounds, setLineBounds] = useState<{ left: number; width: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  const updateBounds = () => {
    if (!node1Ref.current || !node4Ref.current || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const node1Rect = node1Ref.current.getBoundingClientRect();
    const node4Rect = node4Ref.current.getBoundingClientRect();

    const left = node1Rect.left - containerRect.left + node1Rect.width / 2;
    const right = node4Rect.left - containerRect.left + node4Rect.width / 2;
    const width = Math.max(0, right - left);
    setLineBounds({ left, width });
  };

  useEffect(() => {
    if (prefersReduced) {
      setProgress(1);
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start fill as section enters view, finish as it centers
      const startY = windowHeight * 0.85;
      const endY = windowHeight * 0.35;
      const currentY = rect.top;

      let p = (startY - currentY) / (startY - endY);
      p = Math.max(0, Math.min(1, p));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateBounds);

    updateBounds();
    handleScroll();

    const timer = setTimeout(updateBounds, 250);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateBounds);
      clearTimeout(timer);
    };
  }, [prefersReduced]);

  const isNodeActive = (idx: number) => {
    if (prefersReduced) return true;
    if (idx === 0) return true;
    return progress >= idx / 3;
  };

  return (
    <div ref={containerRef} className="relative select-none">
      {/* Desktop Horizontal Line: Between Step 1 and Step 4 node centers */}
      {lineBounds && (
        <div
          className="hidden lg:block absolute top-5 -z-0 pointer-events-none"
          style={{ left: `${lineBounds.left}px`, width: `${lineBounds.width}px` }}
        >
          {/* Base Hairline */}
          <div className="w-full h-[1px] bg-paper-line" />
          {/* Scroll-Driven Royal Fill Line */}
          <div
            className="absolute top-0 left-0 h-[2px] bg-royal -translate-y-[0.5px]"
            style={{
              width: "100%",
              transformOrigin: "left",
              transform: `scaleX(${prefersReduced ? 1 : progress})`,
              transition: prefersReduced ? "none" : "transform 75ms ease-out",
            }}
          />
        </div>
      )}

      {/* Mobile Vertical Line: Along left column between nodes */}
      <div className="block lg:hidden absolute left-5 top-5 bottom-8 w-[1px] bg-paper-line -z-0 pointer-events-none">
        <div
          className="w-[2px] -translate-x-[0.5px] bg-royal"
          style={{
            height: "100%",
            transformOrigin: "top",
            transform: `scaleY(${prefersReduced ? 1 : progress})`,
            transition: prefersReduced ? "none" : "transform 75ms ease-out",
          }}
        />
      </div>

      {/* 4 Steps: Stacked vertically with left padding on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {STEPS.map((s, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === STEPS.length - 1;
          const active = isNodeActive(idx);

          return (
            <div
              key={s.num}
              className="flex flex-row lg:flex-col items-start gap-4 lg:gap-0 lg:space-y-3"
            >
              {/* Number Node on Line: Fills royal when line reaches it */}
              <div
                ref={isFirst ? node1Ref : isLast ? node4Ref : undefined}
                className={`w-10 h-10 shrink-0 rounded-full border flex items-center justify-center font-display font-semibold text-sm transition-all duration-300 ${
                  active
                    ? "border-royal bg-royal text-paper shadow-sm"
                    : "border-paper-line bg-paper text-royal/60"
                }`}
              >
                {s.num}
              </div>

              {/* Step Heading and Description: Brighten from 40% to 100% opacity */}
              <div
                className="transition-opacity duration-300"
                style={{ opacity: active ? 1 : 0.4 }}
              >
                <h3 className="font-display text-display-base text-black font-semibold mb-1.5">
                  {s.title}
                </h3>
                <p className="font-sans text-body text-black/85 leading-relaxed max-w-[68ch]">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
