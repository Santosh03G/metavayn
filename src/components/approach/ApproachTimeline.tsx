"use client";

import { useEffect, useRef, useState } from "react";

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
  const [reducedMotion, setReducedMotion] = useState(false);

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
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    if (motionQuery.matches) {
      setProgress(1);
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setProgress(1);
        return;
      }

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

    // Initial measurements
    updateBounds();
    handleScroll();

    // Recheck after DOM stabilizes
    const timer = setTimeout(updateBounds, 250);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateBounds);
      clearTimeout(timer);
    };
  }, []);

  const isNodeActive = (idx: number) => {
    if (reducedMotion) return true;
    if (idx === 0) return true;
    return progress >= idx / 3;
  };

  return (
    <div ref={containerRef} className="relative select-none">
      {/* Desktop Horizontal Line: Exactly between Step 1 and Step 4 node centers */}
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
              transform: `scaleX(${reducedMotion ? 1 : progress})`,
              transition: reducedMotion ? "none" : "transform 75ms ease-out",
            }}
          />
        </div>
      )}

      {/* 4 Steps Grid: Stacked vertically on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {STEPS.map((s, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === STEPS.length - 1;
          const active = isNodeActive(idx);

          return (
            <div key={s.num} className="flex flex-col space-y-3">
              {/* Number Node on Line */}
              <div
                ref={isFirst ? node1Ref : isLast ? node4Ref : undefined}
                className={`w-10 h-10 rounded-full border flex items-center justify-center font-display font-semibold text-sm transition-colors duration-200 ${
                  active
                    ? "border-royal bg-paper text-royal ring-2 ring-royal/20"
                    : "border-paper-line bg-paper text-royal/60"
                }`}
              >
                {s.num}
              </div>

              <div>
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
