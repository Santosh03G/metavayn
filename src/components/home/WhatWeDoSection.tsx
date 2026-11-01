"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/canvas/Scene";
import { M1AirHandlingUnit } from "@/components/canvas/M1AirHandlingUnit";
import { M1DrawingFallback } from "@/components/canvas/M1DrawingFallback";
import { BomTable } from "@/components/drawing/BomTable";
import {
  DISCIPLINE_HIGHLIGHT_MAPPINGS,
  type DisciplineMapping,
} from "@/lib/discipline-highlight-mapping";

const DISCIPLINES: DisciplineMapping[] = Object.values(DISCIPLINE_HIGHLIGHT_MAPPINGS);

export function WhatWeDoSection() {
  // First item active on load
  const [activeId, setActiveId] = useState<string>("product");
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const activeDiscipline =
    DISCIPLINE_HIGHLIGHT_MAPPINGS[activeId] || DISCIPLINES[0];

  // Scroll-driven active item detection using IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    DISCIPLINES.forEach((d) => {
      const el = itemRefs.current[d.id];
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(d.id);
            }
          });
        },
        {
          rootMargin: "-30% 0px -30% 0px",
          threshold: 0.2,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section
      id="what-we-do"
      className="relative py-16 sm:py-24 border-b border-pale-blue/20 bg-black text-paper select-none scroll-mt-16"
    >
      <Container>
        {/* Section Header in Sentence Case */}
        <div className="border-b border-pale-blue/20 pb-4 mb-10">
          <h2 className="font-display text-display-xl sm:text-display-2xl text-paper">
            What we do
          </h2>
        </div>

        {/* Layout: Left Column Scrolls Past Sticky Right Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start relative">
          {/* Left Column: Exactly one hairline rule above first item only, then one hairline between items */}
          <div className="lg:col-span-5 border-t border-pale-blue/20 divide-y divide-pale-blue/20">
            {DISCIPLINES.map((d) => {
              const isSelected = d.id === activeId;
              return (
                <div
                  key={d.id}
                  ref={(el) => {
                    itemRefs.current[d.id] = el;
                  }}
                  onMouseEnter={() => setActiveId(d.id)}
                  onFocus={() => setActiveId(d.id)}
                  tabIndex={0}
                  className="py-6 sm:py-7 transition-colors duration-fast cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-pale-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black group"
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${d.title} capability details`}
                >
                  <div className="flex items-baseline justify-between">
                    <h3
                      className={`font-display text-display-base sm:text-display-lg transition-colors duration-fast ${
                        isSelected
                          ? "font-semibold text-paper"
                          : "font-normal text-paper/80 group-hover:text-paper"
                      }`}
                    >
                      {d.title}
                    </h3>
                  </div>

                  {/* Active Indicator Rule: short copper bar (2px x 40px) under heading */}
                  <div className="h-[2px] mt-1.5 mb-2.5">
                    {isSelected ? (
                      <div className="w-10 h-[2px] bg-copper transition-all duration-300" />
                    ) : (
                      <div className="w-0 h-[2px] bg-transparent transition-all duration-300" />
                    )}
                  </div>

                  {/* Reduced gap to body text and constrained line length */}
                  <p className="font-sans text-body text-paper/80 leading-relaxed mb-2.5 max-w-[68ch]">
                    {d.description}
                  </p>

                  <div>
                    <Link
                      href={`/services#${d.id}`}
                      className="text-body-sm text-pale-blue hover:text-paper underline underline-offset-4 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View capabilities
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Centered Viewport on Black Field (No Border Box) */}
          <div className="lg:col-span-7 lg:sticky lg:top-[calc(50vh-220px)] self-start py-4">
            <div className="w-full flex items-center justify-center">
              {!activeDiscipline.has3DModel ? (
                /* Engineering Documentation: No 3D model; clean 2D drawing sheet & BOM preview */
                <div className="w-full space-y-4 animate-in fade-in duration-normal">
                  <div className="border border-pale-blue/30 bg-black/80 p-4 sm:p-6">
                    <BomTable surface="black" />
                  </div>
                </div>
              ) : (
                /* 3D AHU Model: Direct on black field, horizontal orientation, same isometric angle as hero, length-axis explode */
                <div className="w-full animate-in fade-in duration-normal">
                  <Scene
                    aspectRatio="aspect-[16/10]"
                    surface="black"
                    orthographic={true}
                    cameraPosition={[16, 13, 16]}
                    borderless={true}
                    modelScale={1.35}
                    fallback={<M1DrawingFallback surface="black" exploded={true} />}
                  >
                    <M1AirHandlingUnit
                      surface="black"
                      explodeFactor={0.7}
                      activeDiscipline={activeId}
                    />
                  </Scene>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
