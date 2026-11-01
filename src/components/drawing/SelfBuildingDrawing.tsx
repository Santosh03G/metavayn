"use client";

import { useState, useEffect } from "react";
import { BomTable } from "./BomTable";
import { RedlineCallout } from "./RedlineCallout";
import { type SurfaceType } from "@/components/ui/Button";

interface SelfBuildingDrawingProps {
  surface?: SurfaceType;
}

export function SelfBuildingDrawing({ surface = "paper" }: SelfBuildingDrawingProps) {
  const [step, setStep] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const isPaper = surface === "paper";
  const isRoyal = surface === "royal";

  const strokeColor = isPaper ? "#050505" : isRoyal ? "#F1EEE6" : "#9DB2FF";
  const dimColor = isPaper ? "#050505" : isRoyal ? "#F1EEE6" : "#9DB2FF";

  const containerClass = isPaper
    ? "border-paper-line bg-paper text-black"
    : isRoyal
    ? "border-paper/30 bg-royal/90 text-paper"
    : "border-pale-blue/30 bg-black text-paper";

  const dividerClass = isPaper
    ? "border-paper-line"
    : isRoyal
    ? "border-paper/20"
    : "border-pale-blue/20";

  return (
    <div className={`border p-4 sm:p-6 font-mono ${containerClass}`}>
      {/* Control Toolbar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b ${dividerClass} pb-3 mb-4 gap-3 text-mono-xs`}>
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${isPaper ? "bg-royal" : "bg-paper"} animate-pulse`} />
          <span className="font-semibold">
            DRAWING BUILD SEQUENCE: STEP {step} OF 4
          </span>
        </div>

        {/* Step Trigger Buttons */}
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          {[
            { num: 1, label: "1. Views" },
            { num: 2, label: "2. Dimensions" },
            { num: 3, label: "3. BOM Rows" },
            { num: 4, label: "4. Stamp Rev" },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStep(s.num);
              }}
              className={`px-2 py-1 border text-[10px] transition-colors focus-visible:outline-none ${
                step >= s.num
                  ? isPaper
                    ? "bg-royal text-paper border-royal font-semibold"
                    : "bg-paper text-black border-paper font-semibold"
                  : isPaper
                  ? "bg-transparent text-black/70 border-paper-line hover:border-black"
                  : "bg-transparent text-paper/70 border-paper/30 hover:border-paper"
              }`}
            >
              {s.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-2 py-1 border text-[10px] font-semibold transition-colors ${
              isPlaying
                ? "bg-copper text-black border-copper"
                : isPaper
                ? "border-paper-line text-black hover:bg-black/5"
                : "border-paper/30 text-paper hover:bg-paper/10"
            }`}
          >
            {isPlaying ? "PAUSE" : "PLAY"}
          </button>
        </div>
      </div>

      {/* SVG Drawing Canvas Canvas Sheet */}
      <div className="relative min-h-[320px] select-none">
        {/* Step 1: Orthographic Views appear */}
        <div
          className={`transition-opacity duration-normal ${
            step >= 1 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Front & Top Orthographic Projections */}
            <div className={`border ${dividerClass} p-4`}>
              <span className={`text-[9px] uppercase block mb-2 ${isPaper ? "text-black/60" : "text-paper/60"}`}>
                ORTHOGRAPHIC PROJECTION (FIRST ANGLE)
              </span>
              <svg
                className="w-full h-36"
                viewBox="0 0 240 120"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
              >
                {/* Front Elevation View */}
                <rect x="20" y="20" width="80" height="50" stroke={strokeColor} />
                <circle cx="60" cy="45" r="12" stroke={strokeColor} strokeDasharray="2,2" />
                <line x1="10" y1="45" x2="110" y2="45" stroke={strokeColor} strokeDasharray="4,4" opacity="0.4" />
                <line x1="60" y1="10" x2="60" y2="80" stroke={strokeColor} strokeDasharray="4,4" opacity="0.4" />

                {/* Right Side View */}
                <rect x="130" y="20" width="50" height="50" stroke={strokeColor} />
                <rect x="130" y="33" width="50" height="24" stroke={strokeColor} strokeDasharray="2,2" />

                {/* Step 2: Dimension Leaders Draw In */}
                {step >= 2 && (
                  <g stroke={dimColor} fill={dimColor} fontSize="7" opacity="0.9">
                    {/* Width Dimension */}
                    <line x1="20" y1="85" x2="100" y2="85" />
                    <line x1="20" y1="75" x2="20" y2="90" />
                    <line x1="100" y1="75" x2="100" y2="90" />
                    <text x="60" y="95" textAnchor="middle">80.00</text>

                    {/* Height Dimension */}
                    <line x1="195" y1="20" x2="195" y2="70" />
                    <line x1="185" y1="20" x2="200" y2="20" />
                    <line x1="185" y1="70" x2="200" y2="70" />
                    <text x="210" y="47" textAnchor="middle">50.00</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Step 3: BOM Rows Populate */}
            <div
              className={`transition-all duration-normal ${
                step >= 3 ? "opacity-100 translate-y-0" : "opacity-20 translate-y-2"
              }`}
            >
              <BomTable surface={surface} />
            </div>
          </div>
        </div>

        {/* Step 4: Revision Block Updates */}
        <div
          className={`mt-6 pt-3 border-t ${dividerClass} flex flex-col sm:flex-row items-center justify-between text-mono-xs transition-opacity duration-normal ${
            step >= 4 ? "opacity-100" : "opacity-30"
          }`}
        >
          <div className="flex items-center space-x-3">
            <RedlineCallout surface={surface} revision="01" note="ALL TOLERANCES APPLIED" />
            <span className={isPaper ? "text-black/70" : "text-paper/70"}>
              DRAWING AUDIT: GEOMETRIC TOLERANCES APPLIED
            </span>
          </div>
          <span className={`text-[10px] mt-1 sm:mt-0 ${isPaper ? "text-black/60" : "text-paper/60"}`}>
            METAVAYN DOCUMENTATION RELEASE STAMP
          </span>
        </div>
      </div>
    </div>
  );
}