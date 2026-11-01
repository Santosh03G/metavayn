"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  INDUSTRIES_DATA,
  type IndustryItem,
} from "@/lib/industries-data";
import { IndustryStage } from "./IndustryStage";
import { IndustrialVisual } from "./IndustrialVisual";
import { HvacAirflowVisual } from "./HvacAirflowVisual";
import { ManufacturingVisual } from "./ManufacturingVisual";
import { OemTurntableVisual } from "./OemTurntableVisual";
import { ModularTeamVisual } from "./ModularTeamVisual";

export function IndustriesInteractiveSection() {
  const [activeId, setActiveId] = useState<string>(INDUSTRIES_DATA[0].id);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const activeItem =
    INDUSTRIES_DATA.find((item) => item.id === activeId) || INDUSTRIES_DATA[0];

  // Scroll synchronization using IntersectionObserver on desktop
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    INDUSTRIES_DATA.forEach((ind) => {
      const el = itemRefs.current[ind.id];
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(ind.id);
            }
          });
        },
        {
          rootMargin: "-25% 0px -25% 0px",
          threshold: 0.25,
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
      id="industries-interactive"
      className="relative py-16 sm:py-24 border-b border-pale-blue/20 bg-black text-paper select-none scroll-mt-16"
    >
      <Container>
        {/* ========================================================= */}
        {/* 1. DESKTOP VIEW (>= 1024px): Left Index List + Sticky Stage */}
        {/* ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 xl:gap-16 items-start relative">
          {/* Left Column (Cols 1 to 5): Hairline Index List */}
          <div className="lg:col-span-5 border-t border-pale-blue/20 divide-y divide-pale-blue/20">
            {INDUSTRIES_DATA.map((ind) => {
              const isSelected = ind.id === activeId;

              return (
                <div
                  key={ind.id}
                  ref={(el) => {
                    itemRefs.current[ind.id] = el;
                  }}
                  onMouseEnter={() => setActiveId(ind.id)}
                  onFocus={() => setActiveId(ind.id)}
                  onClick={() => setActiveId(ind.id)}
                  tabIndex={0}
                  className="py-8 transition-colors duration-fast cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-pale-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black group"
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${ind.title} industry details`}
                >
                  {/* Number & Title */}
                  <div className="flex items-baseline space-x-3 mb-1">
                    <span className="font-mono text-xs text-pale-blue/60 group-hover:text-pale-blue transition-colors">
                      {ind.number}
                    </span>
                    <h3
                      className={`font-display text-display-base sm:text-display-lg transition-colors ${
                        isSelected
                          ? "font-semibold text-paper"
                          : "font-normal text-paper/75 group-hover:text-paper"
                      }`}
                    >
                      {ind.title}
                    </h3>
                  </div>

                  {/* Active Indicator Rule: short copper bar (2px x 40px) */}
                  <div className="h-[2px] mt-1.5 mb-2.5">
                    {isSelected ? (
                      <div className="w-10 h-[2px] bg-copper transition-all duration-300" />
                    ) : (
                      <div className="w-0 h-[2px] bg-transparent transition-all duration-300" />
                    )}
                  </div>

                  {/* Description verbatim from content/site-content.md */}
                  <p className="font-sans text-body text-paper/80 leading-relaxed mb-4 max-w-[68ch]">
                    {ind.description}
                  </p>

                  {/* Capabilities Sub-List */}
                  <ul className="space-y-1.5 mb-4 font-sans text-body-sm text-paper/70">
                    {ind.capabilities.map((cap, cIdx) => (
                      <li key={cIdx} className="flex items-center space-x-2">
                        <span className="w-1 h-1 rounded-full bg-pale-blue" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    <Link
                      href="/contact"
                      className="text-body-sm text-pale-blue hover:text-paper underline underline-offset-4 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Discuss {ind.shortTitle.toLowerCase()} support &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (Cols 7 to 12): Sticky Centered Stage with Section-Cut Wipe */}
          <div className="lg:col-span-7 lg:sticky lg:top-[calc(50vh-230px)] self-start py-4">
            <IndustryStage activeId={activeItem.visualId} />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. MOBILE / TABLET VIEW (< 1024px): Stacked Sections with Inline Visuals */}
        {/* ========================================================= */}
        <div className="lg:hidden flex flex-col divide-y divide-pale-blue/20 border-t border-b border-pale-blue/20">
          {INDUSTRIES_DATA.map((ind) => (
            <div key={`mobile-${ind.id}`} className="py-12 space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <span className="font-mono text-xs text-pale-blue font-semibold block">
                  {ind.number} // SECTOR
                </span>
                <h3 className="font-display text-display-xl text-paper">
                  {ind.title}
                </h3>
                <div className="w-10 h-[2px] bg-copper" />
              </div>

              {/* Description */}
              <p className="font-sans text-body text-paper/85 leading-relaxed max-w-[68ch]">
                {ind.description}
              </p>

              {/* Capabilities */}
              <ul className="space-y-2 font-sans text-body-sm text-paper/75 border-l border-pale-blue/30 pl-4 py-1">
                {ind.capabilities.map((cap, cIdx) => (
                  <li key={`m-cap-${cIdx}`} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pale-blue" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>

              {/* Inline Dedicated Visual */}
              <div className="border border-pale-blue/20 bg-black/50 overflow-hidden">
                {ind.visualId === "industrial" && <IndustrialVisual surface="black" />}
                {ind.visualId === "hvac" && <HvacAirflowVisual surface="black" />}
                {ind.visualId === "manufacturing" && <ManufacturingVisual surface="black" />}
                {ind.visualId === "oem" && <OemTurntableVisual surface="black" />}
                {ind.visualId === "tech" && <ModularTeamVisual surface="black" />}
              </div>

              <div>
                <Link href="/contact">
                  <Button surface="black" variant="secondary" size="sm">
                    Discuss {ind.shortTitle.toLowerCase()} support
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
