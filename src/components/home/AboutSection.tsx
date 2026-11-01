"use client";

import { useEffect, useRef, useState } from "react";
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

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced || !containerRef.current) {
      setScrollProgress(1);
      wordRefs.current.forEach((el) => {
        if (el) el.style.opacity = "1";
      });
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
          setScrollProgress(p);

          // Word-by-word reveal: 20% to 100% opacity in sequence
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
          setScrollProgress(p);

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
      });
    }

    return () => {
      trigger.kill();
    };
  }, [prefersReduced]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative bg-paper text-black scroll-mt-16 select-none"
    >
      <div
        ref={pinTargetRef}
        className="py-12 sm:py-16 lg:py-20 w-full flex flex-col justify-center min-h-[calc(100vh-64px)]"
      >
        <Container>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-14 items-center">
            {/* Left Column: Anchored narrative & 3-stage capability milestones (columns 1 to 5) */}
            <div className="xl:col-span-5 space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
                  About Metavayn
                </h2>
                {/* Royal subheading */}
                <h3 className="font-display text-display-base sm:text-display-lg text-royal font-semibold">
                  Your engineering partner for faster product delivery
                </h3>
              </div>

              <p className="font-sans text-body text-black/90 leading-relaxed max-w-[68ch]">
                Metavayn Technologies Pvt. Ltd. is an engineering services company
                focused on delivering reliable, scalable, and technology-driven
                engineering solutions. We work as an extension of our clients&apos;
                engineering teams, supporting them across product design,
                mechanical engineering, engineering documentation, product
                development, and manufacturing readiness.
              </p>

              {/* 3 Core Transformation Stages: Directly mirrors the right visual evolution */}
              <div className="pt-6 border-t border-paper-line space-y-4">
                <div className="space-y-1">
                  <h4 className="font-display text-body-base font-semibold text-black">
                    Engineering Concept & Architecture
                  </h4>
                  <p className="font-sans text-body-sm text-black/75 leading-relaxed">
                    Translating high-level product vision into robust mechanical architecture and functional layouts.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-display text-body-base font-semibold text-black">
                    Precision CAD & Design Validation
                  </h4>
                  <p className="font-sans text-body-sm text-black/75 leading-relaxed">
                    Detailed modeling, tolerance analysis, structural integrity verification, and production drafting.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-display text-body-base font-semibold text-black">
                    Manufacturing-Ready Delivery
                  </h4>
                  <p className="font-sans text-body-sm text-black/75 leading-relaxed">
                    Validated fabrication packages, vendor-ready BOMs, and seamless engineering transition to shop floor.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Statement-size Quote + Calibrated 3-Stage SVG AHU Graphic (columns 7 to 12) */}
            <div className="xl:col-span-7 xl:col-start-6 flex flex-col items-center xl:items-start space-y-8">
              {/* Quote Words: 3-line statement size, comfortable measure, real HTML spans */}
              <blockquote
                className="font-display text-[24px] sm:text-[28px] lg:text-[32px] font-medium text-black leading-[1.3] max-w-[46ch] border-t xl:border-t-0 border-paper-line pt-6 xl:pt-0"
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

              {/* 3-State SVG AHU Evolution: Generous breathing margin, zero clipping, zero quote collision */}
              <div className="w-full flex justify-center pt-2">
                <IdeaToProductGraphic
                  progress={prefersReduced ? 1 : scrollProgress}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
