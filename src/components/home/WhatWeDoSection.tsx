"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/canvas/Scene";
import { M1AirHandlingUnit } from "@/components/canvas/M1AirHandlingUnit";
import { M1DrawingFallback } from "@/components/canvas/M1DrawingFallback";
import { BomTable } from "@/components/drawing/BomTable";

export interface DisciplineData {
  id: string;
  number: string;
  title: string;
  description: string;
  mappingType: "3d" | "bom";
}

export const DISCIPLINES: DisciplineData[] = [
  {
    id: "product",
    number: "01",
    title: "Product Engineering",
    description:
      "From concept development to detailed engineering, we help transform product ideas into practical and manufacturable designs.",
    mappingType: "3d",
  },
  {
    id: "mechanical",
    number: "02",
    title: "Mechanical Design Engineering",
    description:
      "Our mechanical engineering capabilities support OEMs and manufacturers with accurate, production-ready designs.",
    mappingType: "3d",
  },
  {
    id: "hvac",
    number: "03",
    title: "HVAC & Thermal Engineering",
    description:
      "We support HVAC and thermal-system companies with engineering design and documentation services.",
    mappingType: "3d",
  },
  {
    id: "documentation",
    number: "04",
    title: "Engineering Documentation",
    description:
      "Accurate documentation is critical for successful product development and manufacturing.",
    mappingType: "bom",
  },
  {
    id: "support",
    number: "05",
    title: "Engineering Support",
    description:
      "Extend your engineering capacity without increasing your internal overhead.",
    mappingType: "3d",
  },
];

export function WhatWeDoSection() {
  const [activeId, setActiveId] = useState<string>("hvac");

  const activeDiscipline =
    DISCIPLINES.find((d) => d.id === activeId) || DISCIPLINES[0];

  return (
    <section
      id="what-we-do"
      className="relative py-16 sm:py-24 border-b border-pale-blue/20 bg-black text-paper select-none scroll-mt-16"
    >
      <Container size="wide">
        {/* Section Header */}
        <div className="border-b border-pale-blue/20 pb-4 mb-12">
          <h2 className="font-display text-display-xl sm:text-display-2xl text-paper">
            What We Do
          </h2>
        </div>

        {/* Desktop Layout: Index List (Left) + Pinned Inspection Viewport (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Hairline Index List */}
          <div className="lg:col-span-5 divide-y divide-pale-blue/20 border-t border-b border-pale-blue/20">
            {DISCIPLINES.map((d) => {
              const isSelected = d.id === activeId;
              return (
                <div
                  key={d.id}
                  onMouseEnter={() => setActiveId(d.id)}
                  onFocus={() => setActiveId(d.id)}
                  tabIndex={0}
                  className="py-6 transition-colors duration-fast cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-pale-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black group"
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${d.title} capability details`}
                >
                  <div className="flex items-baseline justify-between mb-1.5">
                    <h3
                      className={`font-display text-display-base sm:text-display-lg transition-colors ${
                        isSelected
                          ? "font-bold text-paper"
                          : "font-normal text-paper/80 group-hover:text-paper"
                      }`}
                    >
                      {d.title}
                    </h3>
                  </div>

                  {/* Active Indicator Rule */}
                  {isSelected ? (
                    <div className="w-10 h-0.5 bg-copper mb-3 transition-all duration-fast" />
                  ) : (
                    <div className="w-0 h-0.5 bg-transparent mb-3 transition-all duration-fast" />
                  )}

                  <p className="font-sans text-body-sm text-paper/80 leading-relaxed mb-3">
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

          {/* Right Column: Pinned Viewport */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="border border-pale-blue/30 bg-black/60 p-4 sm:p-6">
              {activeDiscipline.mappingType === "bom" ? (
                <div className="space-y-4">
                  <BomTable surface="black" />
                </div>
              ) : (
                <Scene
                  aspectRatio="aspect-[4/3]"
                  surface="black"
                  orthographic={true}
                  cameraPosition={[15, 12, 15]}
                  borderless={true}
                  fallback={<M1DrawingFallback surface="black" exploded={true} />}
                >
                  <M1AirHandlingUnit
                    surface="black"
                    explodeFactor={0.7}
                    activeDiscipline={activeId}
                    interactiveTilt={true}
                  />
                </Scene>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}