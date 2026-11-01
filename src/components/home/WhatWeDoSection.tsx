"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/canvas/Scene";
import { M1AirHandlingUnit } from "@/components/canvas/M1AirHandlingUnit";
import { M1DrawingFallback } from "@/components/canvas/M1DrawingFallback";
import { BomTable } from "@/components/drawing/BomTable";
import { RedlineCallout } from "@/components/drawing/RedlineCallout";

export interface DisciplineData {
  id: string;
  number: string;
  title: string;
  description: string;
  mappingType: "3d" | "drawing" | "bom";
  tag: string;
}

export const DISCIPLINES: DisciplineData[] = [
  {
    id: "product",
    number: "01",
    title: "Product Engineering",
    description:
      "From concept development to detailed engineering, we help transform product ideas into practical and manufacturable designs.",
    mappingType: "3d",
    tag: "COMPLETE UNIT INTEGRATION",
  },
  {
    id: "mechanical",
    number: "02",
    title: "Mechanical Design Engineering",
    description:
      "Our mechanical engineering capabilities support OEMs and manufacturers with accurate, production-ready designs.",
    mappingType: "3d",
    tag: "SHEET METAL & BASE SKID",
  },
  {
    id: "hvac",
    number: "03",
    title: "HVAC & Thermal Engineering",
    description:
      "We support HVAC and thermal-system companies with engineering design and documentation services.",
    mappingType: "3d",
    tag: "COILS & CENTRIFUGAL BLOWERS",
  },
  {
    id: "documentation",
    number: "04",
    title: "Engineering Documentation",
    description:
      "Accurate documentation is critical for successful product development and manufacturing.",
    mappingType: "bom",
    tag: "ASME BILL OF MATERIALS",
  },
  {
    id: "support",
    number: "05",
    title: "Engineering Support",
    description:
      "Extend your engineering capacity without increasing your internal overhead.",
    mappingType: "3d",
    tag: "REVISION & MAINTENANCE ACCESS",
  },
];

export function WhatWeDoSection() {
  const [activeId, setActiveId] = useState<string>("hvac");

  const activeDiscipline =
    DISCIPLINES.find((d) => d.id === activeId) || DISCIPLINES[0];

  return (
    <section
      id="what-we-do"
      className="relative py-16 sm:py-24 border-b border-[rgba(127,178,255,0.2)] bg-blueprint-deep bg-cad-grid"
    >
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[rgba(127,178,255,0.2)] pb-4 mb-10 gap-4">
          <div>
            <div className="font-mono text-mono-xs text-blueprint-dimension/70 uppercase tracking-widest mb-1 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 border border-blueprint-dimension" />
              <span>CAPABILITIES INDEX • FIVE CORE DISCIPLINES</span>
            </div>
            <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-linen">
              What We Do
            </h2>
          </div>
          <div className="font-mono text-mono-xs text-blueprint-dimension/60">
            SYSTEM: M1 AIR HANDLING UNIT SUBASSEMBLY MAPPING
          </div>
        </div>

        {/* Desktop Layout: Interactive Discipline Index (Left) + Sticky Inspection Viewport (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Five Disciplines Index List */}
          <div className="lg:col-span-5 space-y-3">
            {DISCIPLINES.map((d) => {
              const isSelected = d.id === activeId;
              return (
                <div
                  key={d.id}
                  onMouseEnter={() => setActiveId(d.id)}
                  onFocus={() => setActiveId(d.id)}
                  tabIndex={0}
                  className={`p-5 border transition-all duration-fast cursor-pointer select-none outline-none ${
                    isSelected
                      ? "border-blueprint-signal bg-blueprint-cyanotype/60 shadow-sm"
                      : "border-[rgba(127,178,255,0.2)] bg-blueprint-deep/80 hover:border-blueprint-dimension/60 hover:bg-blueprint-cyanotype/25"
                  }`}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${d.title} capability details`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`font-mono text-mono-xs font-semibold ${
                        isSelected
                          ? "text-blueprint-signal"
                          : "text-blueprint-dimension/60"
                      }`}
                    >
                      {d.number}
                    </span>
                    <span className="font-mono text-[10px] text-blueprint-dimension/70 uppercase">
                      [{d.tag}]
                    </span>
                  </div>

                  <h3
                    className={`font-display text-display-base font-semibold mb-2 ${
                      isSelected ? "text-white" : "text-blueprint-linen"
                    }`}
                  >
                    {d.title}
                  </h3>

                  <p className="font-sans text-body-sm text-blueprint-linen/80 leading-relaxed">
                    {d.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                    <span
                      className={`transition-colors ${
                        isSelected
                          ? "text-blueprint-signal"
                          : "text-blueprint-dimension/50"
                      }`}
                    >
                      {isSelected ? "▶ ACTIVE MAPPING" : "INSPECT"}
                    </span>
                    <Link
                      href={`/services#${d.id}`}
                      className="text-blueprint-dimension hover:text-blueprint-linen underline underline-offset-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Capabilities
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Pinned Inspection Viewport (3D or BOM Drawing Sheet) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="border border-[rgba(127,178,255,0.3)] bg-blueprint-deep/95 p-4 sm:p-6 relative">
              {/* Header Status Bar */}
              <div className="flex items-center justify-between border-b border-[rgba(127,178,255,0.2)] pb-2 mb-4 font-mono text-mono-xs text-blueprint-dimension/80">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blueprint-signal animate-pulse" />
                  <span>
                    TARGET: {activeDiscipline.title.toUpperCase()}
                  </span>
                </span>
                <span>
                  {activeDiscipline.mappingType === "bom"
                    ? "MODE: 2D BOM SPECIFICATION"
                    : "MODE: 3D CAD EXPLODED VIEW"}
                </span>
              </div>

              {/* Viewport Content */}
              {activeDiscipline.mappingType === "bom" ? (
                /* Documentation Discipline: Swaps to authentic ASME Bill of Materials Table */
                <div className="space-y-4">
                  <BomTable />
                  <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-blueprint-dimension/70">
                    <RedlineCallout revision="01" note="DRAWING BOM EXTRACTED" />
                    <span>ISO 128 TECHNICAL DOCUMENTATION SHEET</span>
                  </div>
                </div>
              ) : (
                /* Other Disciplines: Highlighted 3D Assembly */
                <div className="space-y-4">
                  <Scene
                    aspectRatio="aspect-[4/3]"
                    cameraPosition={[3.5, 2.5, 4.5]}
                    fallback={<M1DrawingFallback exploded={true} />}
                  >
                    <M1AirHandlingUnit
                      explodeFactor={0.65}
                      activeDiscipline={activeId}
                      interactiveTilt={true}
                    />
                  </Scene>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-mono-xs font-mono text-blueprint-dimension/70 pt-2 border-t border-[rgba(127,178,255,0.15)] gap-2">
                    <span>
                      ACTIVE SUBASSEMBLY: {activeDiscipline.tag}
                    </span>
                    <span>CURSOR DRAG TO ORBIT • EXPLODE FACTOR: 0.65</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
