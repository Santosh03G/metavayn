"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Scene } from "@/components/canvas/Scene";
import { M1AirHandlingUnit } from "@/components/canvas/M1AirHandlingUnit";
import { M1DrawingFallback } from "@/components/canvas/M1DrawingFallback";
import { SplitLines } from "@/lib/motion/SplitLines";
import { MOTION_TOKENS } from "@/lib/motion/tokens";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

export function HeroSection() {
  const prefersReduced = usePrefersReducedMotion();
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced) {
      if (subheadRef.current) subheadRef.current.style.opacity = "1";
      if (bodyRef.current) bodyRef.current.style.opacity = "1";
      if (buttonsRef.current) buttonsRef.current.style.opacity = "1";
      return;
    }

    const tl = gsap.timeline();

    // 1. Subheading fades in shortly after headline starts (t = 0.35s)
    if (subheadRef.current) {
      tl.fromTo(
        subheadRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_TOKENS.durations.base,
          ease: MOTION_TOKENS.easings.gsapEaseOut,
          onStart: () => {
            if (subheadRef.current) subheadRef.current.style.willChange = "transform, opacity";
          },
          onComplete: () => {
            if (subheadRef.current) subheadRef.current.style.willChange = "auto";
          },
        },
        0.35
      );
    }

    // 2. Body paragraph fades in smoothly (t = 0.5s)
    if (bodyRef.current) {
      tl.fromTo(
        bodyRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_TOKENS.durations.base,
          ease: MOTION_TOKENS.easings.gsapEaseOut,
          onStart: () => {
            if (bodyRef.current) bodyRef.current.style.willChange = "transform, opacity";
          },
          onComplete: () => {
            if (bodyRef.current) bodyRef.current.style.willChange = "auto";
          },
        },
        0.5
      );
    }

    // 3. Buttons fade in last after model finishes filling (t = 1.3s)
    if (buttonsRef.current) {
      tl.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_TOKENS.durations.fast,
          ease: MOTION_TOKENS.easings.gsapEaseOut,
          onStart: () => {
            if (buttonsRef.current) buttonsRef.current.style.willChange = "transform, opacity";
          },
          onComplete: () => {
            if (buttonsRef.current) buttonsRef.current.style.willChange = "auto";
          },
        },
        1.3
      );
    }

    return () => {
      tl.kill();
    };
  }, [prefersReduced]);

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center py-12 sm:py-20 lg:py-24 bg-royal text-paper select-none">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Hero Copy Block */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              {/* Masked line-by-line slide-up reveal with 80ms stagger */}
              <SplitLines
                as="h1"
                lines={["Engineering the", "next dimension"]}
                className="font-display text-display-2xl sm:text-display-3xl text-paper tracking-tight"
                delay={0.1}
                stagger={0.08}
                duration={MOTION_TOKENS.durations.base}
              />

              {/* Royal subheading kept for Hero Tagline */}
              <p
                ref={subheadRef}
                className="font-display text-display-lg text-paper font-semibold"
                style={prefersReduced ? {} : { opacity: 0 }}
              >
                Engineering excellence. Delivered.
              </p>
            </div>

            <p
              ref={bodyRef}
              className="font-sans text-body max-w-[68ch] text-paper leading-relaxed"
              style={prefersReduced ? {} : { opacity: 0 }}
            >
              We help global OEMs and engineering-driven businesses accelerate
              product development, expand engineering capacity, and deliver
              better products faster.
            </p>

            {/* Action Buttons: Fade in last with magnetic hover shift */}
            <div
              ref={buttonsRef}
              className="pt-2 flex flex-wrap gap-4 items-center"
              style={prefersReduced ? {} : { opacity: 0 }}
            >
              <Link href="/services">
                <Button surface="royal" variant="primary" size="base">
                  Explore our services
                </Button>
              </Link>
              <Link href="/contact">
                <Button surface="royal" variant="secondary" size="base">
                  Talk to our engineers
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero 3D M1 AHU Assembly: 1.6x scale, 55-65% width on desktop, centered on headline
              Black edge lines draw first (0.8s), then fills with paper (0.5s). Spring tilt up to 4 deg */}
          <div className="lg:col-span-6 flex items-center justify-center w-full lg:pr-3">
            <div className="w-full">
              <Scene
                surface="royal"
                aspectRatio="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]"
                orthographic={true}
                cameraPosition={[16, 13, 16]}
                borderless={true}
                modelScale={1.6}
                orthoPadding={0.09}
                enableSpringTilt={true}
                fallback={<M1DrawingFallback surface="royal" />}
              >
                <M1AirHandlingUnit
                  surface="royal"
                  explodeFactor={0}
                  modelScale={1.6}
                  introAnimation={true}
                />
              </Scene>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
