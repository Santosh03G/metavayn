"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_TOKENS } from "./tokens";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SplitLinesProps {
  children?: ReactNode;
  lines?: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  scrub?: boolean | number;
  triggerOnScroll?: boolean;
}

export function SplitLines({
  children,
  lines: customLines,
  as: Component = "div",
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.08,
  duration = MOTION_TOKENS.durations.base,
  scrub = false,
  triggerOnScroll = false,
}: SplitLinesProps) {
  const containerRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReduced = usePrefersReducedMotion();

  // Determine lines: either explicit array or children string split by line breaks
  const lines: string[] =
    customLines ||
    (typeof children === "string"
      ? children.split("\n").filter((l) => l.trim().length > 0)
      : []);

  useEffect(() => {
    // If reduced motion is requested, render static immediately
    if (prefersReduced || lineRefs.current.length === 0) {
      lineRefs.current.forEach((el) => {
        if (el) {
          el.style.transform = "none";
          el.style.opacity = "1";
          el.style.willChange = "auto";
        }
      });
      return;
    }

    const elements = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (elements.length === 0) return;

    if (scrub) {
      // Scroll-scrubbed reveal (for section quotes / value props)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 40%",
          scrub: scrub === true ? 1 : scrub,
        },
      });

      tl.fromTo(
        elements,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          stagger: stagger,
          ease: "none",
          onStart: () => {
            elements.forEach((el) => (el.style.willChange = "transform, opacity"));
          },
          onComplete: () => {
            elements.forEach((el) => (el.style.willChange = "auto"));
          },
        }
      );

      return () => {
        tl.kill();
      };
    } else if (triggerOnScroll) {
      // Triggered once when scrolled into view
      const anim = gsap.fromTo(
        elements,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: duration,
          stagger: stagger,
          delay: delay,
          ease: MOTION_TOKENS.easings.gsapEaseOut,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onStart: () => {
            elements.forEach((el) => (el.style.willChange = "transform, opacity"));
          },
          onComplete: () => {
            elements.forEach((el) => (el.style.willChange = "auto"));
          },
        }
      );

      return () => {
        anim.kill();
      };
    } else {
      // Mount / Page Load entrance animation
      const anim = gsap.fromTo(
        elements,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: duration,
          stagger: stagger,
          delay: delay,
          ease: MOTION_TOKENS.easings.gsapEaseOut,
          onStart: () => {
            elements.forEach((el) => (el.style.willChange = "transform, opacity"));
          },
          onComplete: () => {
            elements.forEach((el) => (el.style.willChange = "auto"));
          },
        }
      );

      return () => {
        anim.kill();
      };
    }
  }, [prefersReduced, scrub, triggerOnScroll, delay, stagger, duration]);

  // Fallback if children is complex non-string and lines not provided
  if (lines.length === 0 && children) {
    return (
      <Component ref={containerRef} className={className}>
        <span className="block overflow-hidden">
          <span
            ref={(el) => {
              lineRefs.current[0] = el;
            }}
            className={`block ${lineClassName}`}
            style={prefersReduced ? {} : { transform: "translateY(100%)", opacity: 0 }}
          >
            {children}
          </span>
        </span>
      </Component>
    );
  }

  return (
    <Component ref={containerRef} className={className}>
      {lines.map((line, idx) => (
        <span key={idx} className="block overflow-hidden">
          <span
            ref={(el) => {
              lineRefs.current[idx] = el;
            }}
            className={`block ${lineClassName}`}
            style={prefersReduced ? {} : { transform: "translateY(100%)", opacity: 0 }}
          >
            {line}
          </span>
        </span>
      ))}
    </Component>
  );
}
