"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { IdeaToProductGraphic } from "./IdeaToProductGraphic";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const QUOTE_WORDS = [
  "“Help",
  "businesses",
  "transform",
  "engineering",
  "ideas",
  "into",
  "production-ready",
  "products",
  "—",
  "faster,",
  "smarter,",
  "and",
  "with",
  "greater",
  "confidence.”",
];

export interface StageInfo {
  id: string;
  num: string;
  shortTitle: string;
  title: string;
  description: string;
  targetProgress: number;
}

export const STAGES: StageInfo[] = [
  {
    id: "concept",
    num: "01",
    shortTitle: "Concept",
    title: "Engineering Concept & Architecture",
    description:
      "Translating high-level product vision into robust mechanical architecture and functional layouts.",
    targetProgress: 0.15,
  },
  {
    id: "cad",
    num: "02",
    shortTitle: "CAD Validation",
    title: "Precision CAD & Design Validation",
    description:
      "Detailed modeling, tolerance analysis, structural integrity verification, and production drafting.",
    targetProgress: 0.5,
  },
  {
    id: "manufacturing",
    num: "03",
    shortTitle: "Production",
    title: "Manufacturing-Ready Delivery",
    description:
      "Validated fabrication packages, vendor-ready BOMs, and seamless engineering transition to shop floor.",
    targetProgress: 0.95,
  },
];

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progressProxy = useRef({ progress: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  // Helper to update quote words opacity in real time
  const updateWordOpacities = useCallback(
    (p: number) => {
      if (prefersReduced) {
        wordRefs.current.forEach((el) => {
          if (el) el.style.opacity = "1";
        });
        return;
      }
      const count = QUOTE_WORDS.length;
      wordRefs.current.forEach((el, idx) => {
        if (!el) return;
        const wordThreshold = idx / (count - 1);
        const spanWidth = 0.08;
        let opacity = 0.2;
        if (p >= wordThreshold + spanWidth) {
          opacity = 1.0;
        } else if (p > wordThreshold - spanWidth) {
          const localT = (p - (wordThreshold - spanWidth)) / (spanWidth * 2);
          opacity = 0.2 + localT * 0.8;
        }
        el.style.opacity = opacity.toFixed(2);
      });
    },
    [prefersReduced]
  );

  // Synchronize progress and opacities
  const handleProgressChange = useCallback(
    (newProgress: number) => {
      const clamped = Math.max(0, Math.min(1, newProgress));
      progressProxy.current.progress = clamped;
      setScrollProgress(clamped);
      updateWordOpacities(clamped);
    },
    [updateWordOpacities]
  );

  // Animated jump when selecting a stage
  const selectStage = (index: number) => {
    const target = STAGES[index].targetProgress;
    if (prefersReduced) {
      handleProgressChange(target);
      return;
    }
    gsap.killTweensOf(progressProxy.current);
    gsap.to(progressProxy.current, {
      progress: target,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => {
        const p = progressProxy.current.progress;
        setScrollProgress(p);
        updateWordOpacities(p);
      },
    });
  };

  // Active stage determination
  const activeStageIndex =
    scrollProgress < 0.35 ? 0 : scrollProgress < 0.65 ? 1 : 2;

  // Touch swipe handling on the graphic
  const touchStartRef = useRef<{ x: number; progress: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        progress: progressProxy.current.progress,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    // 260px horizontal drag scrubs across the full 0 -> 1 progress
    const newP = touchStartRef.current.progress + deltaX / 260;
    handleProgressChange(newP);
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  // Pointer drag handling on the scrubber bar track
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const updateFromClientX = (clientX: number) => {
      const p = (clientX - rect.left) / rect.width;
      handleProgressChange(p);
    };
    updateFromClientX(e.clientX);

    const onPointerMove = (ev: PointerEvent) => {
      updateFromClientX(ev.clientX);
    };
    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  useEffect(() => {
    if (prefersReduced || !containerRef.current) {
      handleProgressChange(1);
      return;
    }

    const container = containerRef.current;
    const isDesktop = window.innerWidth >= 1280;

    let trigger: ScrollTrigger;

    if (isDesktop) {
      // Desktop: Full-Section 150vh Pinned Scrub
      trigger = ScrollTrigger.create({
        trigger: container,
        start: "top 64px",
        end: "+=150%",
        pin: pinTargetRef.current,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          progressProxy.current.progress = p;
          setScrollProgress(p);
          updateWordOpacities(p);
        },
      });
    } else {
      // Mobile & Tablet: Unpinned inline scrub as section scrolls past
      trigger = ScrollTrigger.create({
        trigger: container,
        start: "top 75%",
        end: "bottom 25%",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          progressProxy.current.progress = p;
          setScrollProgress(p);
          updateWordOpacities(p);
        },
      });
    }

    return () => {
      trigger.kill();
    };
  }, [prefersReduced, handleProgressChange, updateWordOpacities]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative bg-paper text-black scroll-mt-16 select-none"
    >
      <div
        ref={pinTargetRef}
        className="py-6 sm:py-10 xl:py-10 w-full flex flex-col justify-center min-h-[calc(100vh-64px)]"
      >
        <Container>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-x-14 xl:gap-y-6 items-start xl:items-center">
            
            {/* -------------------------------------------------------------
                ITEM 1: HEADER (Title, Subheading) & Desktop Paragraph
                Mobile: order-1 | Desktop: col-span-5, row-start-1
                ------------------------------------------------------------- */}
            <div className="order-1 xl:col-span-5 xl:row-start-1 space-y-4">
              <div className="space-y-2">
                <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
                  About Metavayn
                </h2>
                <h3 className="font-display text-display-base sm:text-display-lg text-royal font-semibold">
                  Your engineering partner for faster product delivery
                </h3>
              </div>

              {/* Company Overview (Desktop View) */}
              <p className="hidden xl:block font-sans text-body text-black/90 leading-relaxed max-w-[68ch]">
                Metavayn Technologies Pvt. Ltd. is an engineering services company
                focused on delivering reliable, scalable, and technology-driven
                engineering solutions. We work as an extension of our clients&apos;
                engineering teams, supporting them across product design,
                mechanical engineering, engineering documentation, product
                development, and manufacturing readiness.
              </p>
            </div>

            {/* -------------------------------------------------------------
                ITEM 2: QUOTE STATEMENT (3-line statement, word reveals)
                Mobile: order-2 | Desktop: col-span-7 col-start-6 row-start-1
                ------------------------------------------------------------- */}
            <div className="order-2 xl:col-span-7 xl:col-start-6 xl:row-start-1 flex flex-col items-start">
              <blockquote
                className="font-display text-[22px] sm:text-[26px] lg:text-[30px] xl:text-[32px] font-medium text-black leading-[1.3] max-w-[46ch] border-t xl:border-t-0 border-paper-line pt-4 xl:pt-0"
                aria-label="Help businesses transform engineering ideas into production-ready products — faster, smarter, and with greater confidence."
              >
                {QUOTE_WORDS.map((word, idx) => (
                  <span
                    key={idx}
                    ref={(el) => {
                      wordRefs.current[idx] = el;
                    }}
                    data-quote-word="true"
                    className="inline-block mr-2"
                    style={{
                      opacity: prefersReduced ? 1 : 0.2,
                      willChange: "opacity",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </blockquote>
            </div>

            {/* -------------------------------------------------------------
                ITEM 3: INTERACTIVE AHU GRAPHIC & SCRUBBER TRACK
                Mobile: order-3 | Desktop: col-span-7 col-start-6 row-start-2
                ------------------------------------------------------------- */}
            <div className="order-3 xl:col-span-7 xl:col-start-6 xl:row-start-2 flex flex-col items-center w-full space-y-4 pt-2">
              {/* Graphic with Touch Scrub Gesture */}
              <div
                className="w-full flex justify-center touch-pan-y cursor-ew-resize"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                title="Drag or swipe to scrub between Sketch, CAD, and Production"
              >
                <IdeaToProductGraphic
                  progress={prefersReduced ? 1 : scrollProgress}
                  className="w-full max-w-[460px] sm:max-w-[500px]"
                />
              </div>

              {/* Interactive Precision Scrubber Bar */}
              <div className="w-full max-w-[460px] px-2 space-y-2">
                <div
                  role="slider"
                  aria-label="Engineering transformation progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(scrollProgress * 100)}
                  tabIndex={0}
                  onPointerDown={handleTrackPointerDown}
                  className="group relative h-7 flex items-center cursor-pointer select-none touch-none"
                >
                  {/* Background Track */}
                  <div className="w-full h-1.5 bg-paper-accent/60 border border-paper-line rounded-full overflow-hidden relative">
                    {/* Active Fill */}
                    <div
                      className="h-full bg-royal transition-[width] duration-75"
                      style={{ width: `${(scrollProgress * 100).toFixed(1)}%` }}
                    />
                  </div>

                  {/* Stage Milestone Markers on Track */}
                  {STAGES.map((stg, i) => (
                    <button
                      key={stg.id}
                      type="button"
                      aria-label={`Jump to stage ${stg.shortTitle}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectStage(i);
                      }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-paper-line bg-paper hover:scale-125 transition-transform"
                      style={{ left: `${(stg.targetProgress * 100).toFixed(1)}%` }}
                    >
                      <span
                        className={`block w-1.5 h-1.5 rounded-full mx-auto my-auto ${
                          activeStageIndex === i ? "bg-royal" : "bg-black/30"
                        }`}
                      />
                    </button>
                  ))}

                  {/* Scrubber Thumb */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-royal border-2 border-paper shadow pointer-events-none transition-[left] duration-75"
                    style={{ left: `${(scrollProgress * 100).toFixed(1)}%` }}
                  />
                </div>

                {/* Subtitle Hint & Milestone Names */}
                <div className="flex items-center justify-between text-[11px] font-mono text-black/60 px-1 uppercase tracking-wider">
                  <span>01 Concept</span>
                  <span>02 CAD Draft</span>
                  <span>03 Production</span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                ITEM 4A: DESKTOP 3 CAPABILITY CARDS (Interactive Click Targets)
                Desktop: col-span-5 row-start-2
                ------------------------------------------------------------- */}
            <div className="hidden xl:block xl:col-span-5 xl:row-start-2 pt-4 border-t border-paper-line space-y-3">
              {STAGES.map((stg, idx) => {
                const isActive = activeStageIndex === idx;
                return (
                  <button
                    key={stg.id}
                    type="button"
                    onClick={() => selectStage(idx)}
                    className={`w-full text-left p-3.5 rounded transition-all border ${
                      isActive
                        ? "bg-paper-accent/40 border-royal pl-4.5 shadow-sm"
                        : "border-transparent hover:border-paper-line hover:bg-paper-accent/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`font-display text-body-base font-semibold transition-colors ${
                          isActive ? "text-royal" : "text-black"
                        }`}
                      >
                        {stg.title}
                      </h4>
                      <span
                        className={`text-[12px] font-mono transition-colors ${
                          isActive ? "text-royal font-bold" : "text-black/40"
                        }`}
                      >
                        {stg.num}
                      </span>
                    </div>
                    <p className="font-sans text-body-sm text-black/75 leading-relaxed">
                      {stg.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* -------------------------------------------------------------
                ITEM 4B: MOBILE INTERACTIVE 3-PILL SELECTOR & ACTIVE CARD
                Mobile: order-4 (directly below Graphic & Scrubber)
                ------------------------------------------------------------- */}
            <div className="order-4 xl:hidden w-full space-y-4">
              {/* 3 Interactive Touch Pills (44px min height for touch) */}
              <div
                role="tablist"
                aria-label="Engineering transformation stages"
                className="grid grid-cols-3 gap-2"
              >
                {STAGES.map((stg, idx) => {
                  const isActive = activeStageIndex === idx;
                  return (
                    <button
                      key={stg.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => selectStage(idx)}
                      className={`min-h-[44px] py-2 px-2 rounded text-center transition-all border ${
                        isActive
                          ? "bg-royal text-white border-royal font-semibold shadow-sm"
                          : "bg-paper-accent/40 text-black/80 border-paper-line hover:border-black/30"
                      }`}
                    >
                      <span className="block text-[10px] opacity-75 font-mono uppercase tracking-wider">
                        {stg.num}
                      </span>
                      <span className="block text-body-sm font-medium leading-tight">
                        {stg.shortTitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Detail Card */}
              <div className="p-4 rounded border border-paper-line bg-paper-accent/25 space-y-1.5 transition-all">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-royal shrink-0" />
                  <h4 className="font-display text-body font-semibold text-black leading-snug">
                    {STAGES[activeStageIndex].title}
                  </h4>
                </div>
                <p className="font-sans text-body-sm text-black/80 leading-relaxed pl-4">
                  {STAGES[activeStageIndex].description}
                </p>
              </div>
            </div>

            {/* -------------------------------------------------------------
                ITEM 5: MOBILE COMPANY OVERVIEW PARAGRAPH
                Mobile: order-5 (clean summary closing the section)
                ------------------------------------------------------------- */}
            <div className="order-5 xl:hidden pt-4 border-t border-paper-line space-y-2">
              <p className="font-sans text-body-sm text-black/80 leading-relaxed">
                Metavayn Technologies Pvt. Ltd. is an engineering services company
                focused on delivering reliable, scalable, and technology-driven
                engineering solutions. We work as an extension of our clients&apos;
                engineering teams, supporting them across product design,
                mechanical engineering, engineering documentation, product
                development, and manufacturing readiness.
              </p>
            </div>

          </div>
        </Container>
      </div>
    </section>
  );
}
