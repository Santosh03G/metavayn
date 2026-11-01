"use client";

import { useState, useEffect, useRef } from "react";
import { Scene } from "@/components/canvas/Scene";
import { CADModelView } from "@/components/canvas/CADModelView";
import { BomTable } from "@/components/drawing/BomTable";
import { TitleBlock } from "@/components/drawing/TitleBlock";
import { DimensionLine } from "@/components/drawing/DimensionLine";

export interface StepItem {
  num: string;
  stepIndex: number;
  title: string;
  description: string;
}

export const APPROACH_STEPS: StepItem[] = [
  {
    num: "1",
    stepIndex: 1,
    title: "Define",
    description:
      "We understand your product requirements, engineering objectives, specifications, and project constraints.",
  },
  {
    num: "2",
    stepIndex: 2,
    title: "Design",
    description:
      "Our engineers transform requirements into detailed, accurate, and manufacturable engineering solutions.",
  },
  {
    num: "3",
    stepIndex: 3,
    title: "Validate",
    description:
      "We review designs, documentation, assemblies, BOMs, and engineering requirements to ensure quality and consistency.",
  },
  {
    num: "4",
    stepIndex: 4,
    title: "Deliver",
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

  // Auto-resolve redlines after 1.5s when step 3 is active
  useEffect(() => {
    if (activeStep === 3) {
      const timer = setTimeout(() => setIsResolved(true), 1400);
      return () => clearTimeout(timer);
    } else {
      setIsResolved(false);
    }
  }, [activeStep]);

  // Reduced motion: static stops in sequence
  if (reducedMotion) {
    return (
      <div className="space-y-8 select-none text-paper">
        {APPROACH_STEPS.map((s) => (
          <div key={s.num} className="border-b border-paper/20 pb-6 space-y-2">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full border border-paper flex items-center justify-center font-display font-semibold text-sm text-paper">
                {s.num}
              </span>
              <h3 className="font-display text-display-base text-paper font-semibold">
                {s.title}
              </h3>
            </div>
            <p className="font-sans text-body-base text-paper/90 leading-relaxed max-w-prose">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-12 select-none text-paper">
      {/* Horizontal Line with 4 Stops (stacked vertically on mobile) */}
      <div className="relative">
        {/* Desktop Horizontal Line */}
        <div className="hidden lg:block absolute top-5 left-6 right-6 h-[1px] bg-paper/25 -z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {APPROACH_STEPS.map((s) => {
            const isActive = activeStep === s.stepIndex;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setActiveStep(s.stepIndex)}
                className="text-left flex flex-col space-y-3 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-royal"
                aria-pressed={isActive}
              >
                {/* Node on line */}
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center font-display font-semibold text-sm transition-colors ${
                    isActive
                      ? "border-paper bg-paper text-royal shadow-sm"
                      : "border-paper/40 bg-royal text-paper group-hover:border-paper"
                  }`}
                >
                  {s.num}
                </div>
                <div>
                  <h3
                    className={`font-display text-display-base mb-1 transition-colors ${
                      isActive ? "font-bold text-paper" : "font-normal text-paper/80 group-hover:text-paper"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p className="font-sans text-body-sm text-paper/80 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive CAD Stage Viewport */}
      <div className="border border-paper/30 bg-royal/80 p-6 sm:p-8 min-h-[420px]">
        {/* STAGE 01: DEFINE — Hand-sketch style lines & Requirements Note */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-normal">
            <h3 className="font-display text-display-base text-paper font-semibold border-b border-paper/20 pb-3">
              Define: Requirements and Constraints
            </h3>

            <div className="border border-paper/30 bg-royal p-6 relative overflow-hidden">
              <svg
                className="w-full h-48 stroke-current text-paper"
                viewBox="0 0 320 160"
                fill="none"
                strokeWidth="1.2"
              >
                <ellipse cx="160" cy="80" rx="90" ry="45" strokeDasharray="3,2" opacity="0.7" />
                <ellipse cx="160" cy="80" rx="40" ry="20" strokeDasharray="2,2" opacity="0.8" />
                <line x1="40" y1="80" x2="280" y2="80" strokeDasharray="4,4" opacity="0.4" />
                <line x1="160" y1="20" x2="160" y2="140" strokeDasharray="4,4" opacity="0.4" />
                <line x1="70" y1="40" x2="250" y2="120" stroke="#F1EEE6" strokeWidth="0.8" opacity="0.5" />
                <line x1="70" y1="120" x2="250" y2="40" stroke="#F1EEE6" strokeWidth="0.8" opacity="0.5" />
                <circle cx="105" cy="80" r="6" stroke="#F0A06A" strokeDasharray="2,2" />
                <circle cx="215" cy="80" r="6" stroke="#F0A06A" strokeDasharray="2,2" />
              </svg>

              <div className="mt-4 border-l-2 border-paper bg-paper/10 p-3.5 font-sans text-xs space-y-1 text-paper">
                <div className="font-semibold">
                  Engineering Requirements Note
                </div>
                <div>• Operational torque: ≥ 140 N·m (Safety factor 1.8)</div>
                <div>• Physical envelope: Ø120.00 × 80.00 mm</div>
                <div>• Material specification: AL 6061-T6 Anodized</div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 02: DESIGN — Sketch Resolves into Clean 3D Model with Dimensions */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-normal">
            <h3 className="font-display text-display-base text-paper font-semibold border-b border-paper/20 pb-3">
              Design: 3D Model and Geometry
            </h3>

            <Scene surface="royal" aspectRatio="aspect-[16/10]" cameraPosition={[2.8, 2.2, 3.6]}>
              <CADModelView surface="royal" mode="drawing" autoRotate={true} />
            </Scene>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-paper/20 text-xs text-paper/80 font-sans">
              <DimensionLine surface="royal" value="BORE: Ø40.00" tolerance="0.015" />
              <DimensionLine surface="royal" value="OUTER: Ø120.00" tolerance="0.020" />
            </div>
          </div>
        )}

        {/* STAGE 03: VALIDATE — Explicitly drawn on a PAPER SHEET so Redline marks read clearly */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-normal">
            <div className="flex items-center justify-between border-b border-paper/20 pb-3">
              <h3 className="font-display text-display-base text-paper font-semibold">
                Validate: Drawing Review and Markup Resolution
              </h3>
              <button
                type="button"
                onClick={() => setIsResolved(!isResolved)}
                className="px-3 py-1 border border-paper text-xs text-paper hover:bg-paper/10 transition-colors"
              >
                {isResolved ? "Re-open markups" : "Resolve markups"}
              </button>
            </div>

            {/* Validated on a PAPER sheet per Step 3 specification */}
            <div className="border border-paper-line bg-paper p-6 relative text-black">
              <svg
                className="w-full h-44 text-black"
                viewBox="0 0 320 160"
                fill="none"
                stroke="#050505"
                strokeWidth="1.2"
              >
                {/* Underlying Part Geometry on Paper */}
                <rect x="60" y="40" width="200" height="80" stroke="#050505" opacity="0.6" />
                <circle cx="160" cy="80" r="25" stroke="#050505" opacity="0.6" />

                {/* Revision Cloud 1: Scalloped Redline (#E5484D) turning to Royal (#2347E0) on paper */}
                <g
                  className="transition-colors duration-normal"
                  stroke={isResolved ? "#2347E0" : "#E5484D"}
                  strokeWidth="1.6"
                >
                  <path d="M 45,35 Q 55,25 65,32 Q 75,22 85,32 Q 95,25 105,35 Q 115,45 105,55 Q 115,65 105,75 Q 95,85 85,75 Q 75,85 65,75 Q 55,85 45,75 Q 35,65 45,55 Q 35,45 45,35 Z" />
                  <line x1="85" y1="32" x2="115" y2="15" />
                </g>

                {/* Revision Cloud 2 */}
                <g
                  className="transition-colors duration-normal"
                  stroke={isResolved ? "#2347E0" : "#E5484D"}
                  strokeWidth="1.6"
                >
                  <path d="M 140,65 Q 150,55 160,62 Q 170,55 180,65 Q 190,75 180,85 Q 190,95 180,105 Q 170,115 160,108 Q 150,115 140,105 Q 130,95 140,85 Q 130,75 140,65 Z" />
                  <line x1="180" y1="85" x2="220" y2="105" />
                </g>
              </svg>

              {/* Discrepancy Note Cards: on paper: border --redline, text --redline-text */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                <div
                  className={`p-3 border transition-colors duration-normal ${
                    isResolved
                      ? "border-royal bg-royal/10 text-royal"
                      : "border-redline bg-redline/10 text-redline-text"
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between">
                    <span>Revision Item 1</span>
                    <span>{isResolved ? "Resolved" : "Active"}</span>
                  </div>
                  <div className="mt-1 text-xs">
                    Fillet radius increased to relieve stress concentration.
                  </div>
                </div>

                <div
                  className={`p-3 border transition-colors duration-normal ${
                    isResolved
                      ? "border-royal bg-royal/10 text-royal"
                      : "border-redline bg-redline/10 text-redline-text"
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between">
                    <span>Revision Item 2</span>
                    <span>{isResolved ? "Resolved" : "Active"}</span>
                  </div>
                  <div className="mt-1 text-xs">
                    Internal shaft bore tolerance adjusted to specified fit.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 04: DELIVER — Drawing Sheet, BOM & Title Block Sealed */}
        {activeStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-normal">
            <h3 className="font-display text-display-base text-paper font-semibold border-b border-paper/20 pb-3">
              Deliver: Production Documentation Package
            </h3>

            <div className="space-y-4">
              <BomTable surface="royal" />
              <TitleBlock
                surface="royal"
                drawingTitle="MECHANICAL ASSEMBLY - PRODUCTION RELEASE"
                drawingNumber="DWG-REL-04"
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
  );
}