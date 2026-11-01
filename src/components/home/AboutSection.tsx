"use client";

import { useEffect, useRef, useState, useMemo } from "react";
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

    const proxy = { progress: 0 };

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
        className="py-12 sm:py-20 lg:py-24 w-full flex flex-col justify-center"
      >
        <Container>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 items-start">
            {/* Left Column: Anchored information (columns 1 to 5 at 1280+) */}
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
            </div>

            {/* Right Column: Quote word reveal + 3-stage SVG AHU Graphic (columns 7 to 12) */}
            <div className="xl:col-span-6 xl:col-start-7 flex flex-col space-y-8 items-start">
              {/* Quote Words: Real HTML spans, 20% to 100% opacity interpolation */}
              <blockquote
                className="font-display text-[26px] sm:text-[32px] xl:text-[38px] 2xl:text-[42px] font-medium text-black leading-tight border-t xl:border-t-0 border-paper-line pt-6 xl:pt-0"
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

              {/* 3-State SVG AHU Evolution (Sketch -> Drafting lines + dimensions -> Shaded CAD with copper handles) */}
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
