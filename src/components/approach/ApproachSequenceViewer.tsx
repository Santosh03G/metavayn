"use client";

import { useState, useEffect, useRef } from "react";
import { Scene } from "@/components/canvas/Scene";
import { CADModelView } from "@/components/canvas/CADModelView";
import { BomTable } from "@/components/drawing/BomTable";
import { TitleBlock } from "@/components/drawing/TitleBlock";
import { DimensionLine } from "@/components/drawing/DimensionLine";
import { RedlineCallout } from "@/components/drawing/RedlineCallout";

export interface StepItem {
  num: string;
  stepIndex: number;
  title: string;
  summary: string;
  description: string;
}

export const APPROACH_STEPS: StepItem[] = [
  {
    num: "01",
    stepIndex: 1,
    title: "Define",
    summary: "REQUIREMENTS CAPTURE & CONSTRAINTS",
    description:
      "We understand your product requirements, engineering objectives, specifications, and project constraints.",
  },
  {
    num: "02",
    stepIndex: 2,
    title: "Design",
    summary: "CAD MODELING & DETAILED ENGINEERING",
    description:
      "Our engineers transform requirements into detailed, accurate, and manufacturable engineering solutions.",
  },
  {
    num: "03",
    stepIndex: 3,
    title: "Validate",
    summary: "REDLINE AUDIT & DISCREPANCY RESOLUTION",
    description:
      "We review designs, documentation, assemblies, BOMs, and engineering requirements to ensure quality and consistency.",
  },
  {
    num: "04",
    stepIndex: 4,
    title: "Deliver",
    summary: "PRODUCTION RELEASE & REVISION CONTROL",
    description:
      "We deliver production-ready engineering outputs while maintaining documentation and revision control.",
  },
];

export function ApproachSequenceViewer() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(q.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    q.addEventListener("change", handler);
    return () => q.removeEventListener("change", handler);
  }, []);

  // When step 3 is active, auto-resolve redlines after 1.5s if not already resolved
  useEffect(() => {
    if (activeStep === 3) {
      const timer = setTimeout(() => setIsResolved(true), 1200);
      return () => clearTimeout(timer);
    } else {
      setIsResolved(false);
    }
  }, [activeStep]);

  // Reduced motion fallback: 4 static sequence frames in a vertical stack
  if (reducedMotion) {
    return (
      <div className="space-y-12">
        {APPROACH_STEPS.map((s) => (
          <div
            key={s.num}
            className="border border-[rgba(127,178,255,0.25)] bg-blueprint-deep p-6 space-y-4"
          >
            <div className="font-mono text-mono-xs text-blueprint-signal font-bold pb-2 border-b border-[rgba(127,178,255,0.15)] flex justify-between">
              <span>{s.num} — {s.title.toUpperCase()}</span>
              <span>{s.summary}</span>
            </div>
            <h3 className="font-display text-display-base text-blueprint-linen font-semibold">
              {s.title}
            </h3>
            <p className="font-sans text-body-base text-blueprint-linen/85 leading-relaxed max-w-prose">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-8 select-none">
      {/* 4-Stage Step Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-[rgba(127,178,255,0.2)] pb-4">
        {APPROACH_STEPS.map((s) => {
          const isActive = activeStep === s.stepIndex;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setActiveStep(s.stepIndex)}
              className={`p-3 text-left border transition-all duration-fast ${
                isActive
                  ? "border-blueprint-signal bg-blueprint-cyanotype/60 shadow-sm"
                  : "border-[rgba(127,178,255,0.2)] bg-blueprint-deep/80 hover:border-blueprint-dimension/60 hover:bg-blueprint-cyanotype/30"
              }`}
              aria-pressed={isActive}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-mono text-mono-xs font-bold ${
                    isActive ? "text-blueprint-signal" : "text-blueprint-dimension/60"
                  }`}
                >
                  {s.num}
                </span>
                <span className="font-mono text-[9px] text-blueprint-dimension/60">
                  {isActive ? "[ACTIVE]" : "PHASE"}
                </span>
              </div>
              <div
                className={`font-display text-body-base font-semibold ${
                  isActive ? "text-white" : "text-blueprint-linen"
                }`}
              >
                {s.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive CAD Stage Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Current Step Text in Real HTML (Progressive Enhancement) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[rgba(127,178,255,0.25)] bg-blueprint-deep/90 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(127,178,255,0.15)] pb-2 text-mono-xs font-mono text-blueprint-dimension">
              <span className="text-blueprint-signal font-bold">
                PHASE: 0{activeStep} OF 04
              </span>
              <span>{APPROACH_STEPS[activeStep - 1].summary}</span>
            </div>

            <h2 className="font-display text-display-xl text-blueprint-linen">
              {APPROACH_STEPS[activeStep - 1].title}
            </h2>

            <p className="font-sans text-body-base text-blueprint-linen/90 leading-relaxed max-w-prose">
              {APPROACH_STEPS[activeStep - 1].description}
            </p>

            <div className="pt-4 border-t border-[rgba(127,178,255,0.15)] flex items-center justify-between text-mono-xs font-mono text-blueprint-dimension/70">
              <span>ISO 9001 QUALITY GATE: VERIFIED</span>
              <span>STAGE SHT: 0{activeStep}/04</span>
            </div>
          </div>
        </div>

        {/* Right Column: CAD Visual State for Active Step */}
        <div className="lg:col-span-7">
          <div className="border border-[rgba(127,178,255,0.3)] bg-blueprint-deep p-4 sm:p-6 min-h-[420px] flex flex-col justify-between">
            {/* STAGE 01: DEFINE — Hand-sketch style lines & Requirements Note */}
            {activeStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-normal">
                <div className="flex items-center justify-between border-b border-[rgba(127,178,255,0.2)] pb-2 text-mono-xs font-mono text-blueprint-dimension">
                  <span>STAGE 01: CONCEPTUAL HAND-SKETCH & REQUIREMENTS</span>
                  <span>STATUS: DRAFTING DATUM</span>
                </div>

                <div className="border border-[rgba(127,178,255,0.2)] bg-blueprint-deep/95 p-6 relative overflow-hidden">
                  {/* Hand-sketch style SVG construction drawing */}
                  <svg
                    className="w-full h-48 text-blueprint-dimension/80 stroke-current"
                    viewBox="0 0 320 160"
                    fill="none"
                    strokeWidth="1.2"
                  >
                    {/* Sketchy construction lines with jitter */}
                    <ellipse cx="160" cy="80" rx="90" ry="45" strokeDasharray="3,2" opacity="0.7" />
                    <ellipse cx="160" cy="80" rx="40" ry="20" strokeDasharray="2,2" opacity="0.8" />
                    {/* Datum Centerlines extending past geometry */}
                    <line x1="40" y1="80" x2="280" y2="80" strokeDasharray="4,4" opacity="0.4" />
                    <line x1="160" y1="20" x2="160" y2="140" strokeDasharray="4,4" opacity="0.4" />
                    {/* Hand-drawn crosshairs & tangents */}
                    <line x1="70" y1="40" x2="250" y2="120" stroke="#7FB2FF" strokeWidth="0.8" opacity="0.5" />
                    <line x1="70" y1="120" x2="250" y2="40" stroke="#7FB2FF" strokeWidth="0.8" opacity="0.5" />
                    {/* Fast sketch callouts */}
                    <circle cx="105" cy="80" r="6" stroke="#2F7BFF" strokeDasharray="2,2" />
                    <circle cx="215" cy="80" r="6" stroke="#2F7BFF" strokeDasharray="2,2" />
                  </svg>

                  {/* Requirements Engineering Note Card */}
                  <div className="mt-4 border-l-2 border-blueprint-signal bg-blueprint-cyanotype/40 p-3.5 font-mono text-[11px] space-y-1">
                    <div className="text-blueprint-signal font-semibold">
                      ENGINEERING REQUIREMENTS NOTE: REQ-MV-01
                    </div>
                    <div className="text-blueprint-linen/90">• OPERATIONAL TORQUE: ≥ 140 N·m (SAFETY FACTOR 1.8)</div>
                    <div className="text-blueprint-linen/90">• PHYSICAL ENVELOPE: Ø120.00 × 80.00 mm (MAX BOUND)</div>
                    <div className="text-blueprint-linen/90">• MATERIAL SPEC: AL 6061-T6 ANODIZED (MIL-A-8625)</div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 02: DESIGN — Sketch Resolves into Clean 3D Model with Dimensions */}
            {activeStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-normal">
                <div className="flex items-center justify-between border-b border-[rgba(127,178,255,0.2)] pb-2 text-mono-xs font-mono text-blueprint-dimension">
                  <span>STAGE 02: 3D PARAMETRIC MODEL WITH CAD DIMENSIONS</span>
                  <span>GEOMETRY: CRYSTALLIZED</span>
                </div>

                <Scene aspectRatio="aspect-[16/10]" cameraPosition={[2.8, 2.2, 3.6]}>
                  <CADModelView mode="drawing" autoRotate={true} />
                </Scene>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[rgba(127,178,255,0.15)] text-[10px] font-mono text-blueprint-dimension/80">
                  <DimensionLine value="BORE: Ø40.00 ±0.015" tolerance="0.015" />
                  <DimensionLine value="OUTER: Ø120.00 ±0.02" tolerance="0.020" />
                </div>
              </div>
            )}

            {/* STAGE 03: VALIDATE — Redline Revision Clouds Turn to Signal Blue */}
            {activeStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-normal">
                <div className="flex items-center justify-between border-b border-[rgba(127,178,255,0.2)] pb-2 text-mono-xs font-mono">
                  <span className={isResolved ? "text-blueprint-signal font-bold" : "text-blueprint-redline font-bold"}>
                    STAGE 03: DRAWING AUDIT • {isResolved ? "MARKUPS RESOLVED" : "ACTIVE REDLINES (#E5484D)"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsResolved(!isResolved)}
                    className="px-2.5 py-0.5 border text-[10px] font-mono text-blueprint-linen hover:border-blueprint-signal"
                  >
                    {isResolved ? "RE-OPEN REDLINES" : "RESOLVE ALL (→ BLUE)"}
                  </button>
                </div>

                <div className="border border-[rgba(127,178,255,0.2)] bg-blueprint-deep/95 p-6 relative">
                  {/* SVG Drawing Review with Revision Clouds */}
                  <svg
                    className="w-full h-44 text-blueprint-dimension"
                    viewBox="0 0 320 160"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    {/* Underlying Part Geometry */}
                    <rect x="60" y="40" width="200" height="80" stroke="#7FB2FF" opacity="0.6" />
                    <circle cx="160" cy="80" r="25" stroke="#7FB2FF" opacity="0.6" />

                    {/* Revision Cloud 1: Scalloped Redline / Blue Arc */}
                    <g
                      className="transition-colors duration-normal"
                      stroke={isResolved ? "#2F7BFF" : "#E5484D"}
                      strokeWidth="1.6"
                    >
                      {/* Scalloped revision cloud around left corner */}
                      <path d="M 45,35 Q 55,25 65,32 Q 75,22 85,32 Q 95,25 105,35 Q 115,45 105,55 Q 115,65 105,75 Q 95,85 85,75 Q 75,85 65,75 Q 55,85 45,75 Q 35,65 45,55 Q 35,45 45,35 Z" />
                      <line x1="85" y1="32" x2="115" y2="15" />
                    </g>

                    {/* Revision Cloud 2: Around central bore */}
                    <g
                      className="transition-colors duration-normal"
                      stroke={isResolved ? "#2F7BFF" : "#E5484D"}
                      strokeWidth="1.6"
                    >
                      <path d="M 140,65 Q 150,55 160,62 Q 170,55 180,65 Q 190,75 180,85 Q 190,95 180,105 Q 170,115 160,108 Q 150,115 140,105 Q 130,95 140,85 Q 130,75 140,65 Z" />
                      <line x1="180" y1="85" x2="220" y2="105" />
                    </g>
                  </svg>

                  {/* Redline Discrepancy Note Cards */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                    <div
                      className={`p-3 border transition-colors duration-normal ${
                        isResolved
                          ? "border-blueprint-signal bg-blueprint-signal/10 text-blueprint-linen"
                          : "border-blueprint-redline bg-blueprint-redline/10 text-blueprint-redline"
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>REV CLOUD 01</span>
                        <span>{isResolved ? "[RESOLVED]" : "[REDLINE]"}</span>
                      </div>
                      <div className="text-[10px] mt-1 opacity-90">
                        FILLET RADIUS R=1.0mm INCREASED TO R=2.5mm TO RELIEVE STRESS CONCENTRATION.
                      </div>
                    </div>

                    <div
                      className={`p-3 border transition-colors duration-normal ${
                        isResolved
                          ? "border-blueprint-signal bg-blueprint-signal/10 text-blueprint-linen"
                          : "border-blueprint-redline bg-blueprint-redline/10 text-blueprint-redline"
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>REV CLOUD 02</span>
                        <span>{isResolved ? "[RESOLVED]" : "[REDLINE]"}</span>
                      </div>
                      <div className="text-[10px] mt-1 opacity-90">
                        INTERNAL SHAFT BORE TOLERANCE ADJUSTED TO H7 FIT (+0.025 / 0.000 mm).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 04: DELIVER — Drawing Sheet, BOM & Title Block Sealed */}
            {activeStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-normal">
                <div className="flex items-center justify-between border-b border-[rgba(127,178,255,0.2)] pb-2 text-mono-xs font-mono text-blueprint-dimension">
                  <span className="text-blueprint-signal font-bold">
                    STAGE 04: PRODUCTION PACKAGE SEALED
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-semibold">
                    ✓ RELEASED FOR PRODUCTION
                  </span>
                </div>

                <div className="space-y-4">
                  <BomTable />
                  <TitleBlock
                    drawingTitle="M4 MECHANICAL ASSEMBLY - PRODUCTION RELEASE"
                    drawingNumber="MV-2026-REL-04"
                    sheetNumber="04"
                    totalSheets="04"
                    scale="1:1"
                    revision="01"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
