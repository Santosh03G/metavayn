"use client";

import { useState, useEffect } from "react";
import { BomTable } from "./BomTable";
import { RedlineCallout } from "./RedlineCallout";

export function SelfBuildingDrawing() {
  const [step, setStep] = useState<number>(4); // default to complete view, can be stepped through
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="border border-[rgba(127,178,255,0.3)] bg-blueprint-deep p-4 sm:p-6 font-mono">
      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[rgba(127,178,255,0.2)] pb-3 mb-4 gap-3 text-mono-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blueprint-signal animate-pulse" />
          <span className="text-blueprint-dimension font-semibold">
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
              className={`px-2 py-1 border text-[10px] transition-colors ${
                step >= s.num
                  ? "bg-blueprint-signal/20 border-blueprint-signal text-blueprint-linen"
                  : "border-blueprint-dimension/30 text-blueprint-dimension/50 hover:border-blueprint-dimension"
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 bg-blueprint-cyanotype border border-blueprint-dimension/40 text-[10px] text-blueprint-linen hover:border-blueprint-signal"
          >
            {isPlaying ? "❚❚ PAUSE" : "▶ AUTO BUILD"}
          </button>
        </div>
      </div>

      {/* Main Drawing Canvas / Sheet */}
      <div className="border border-[rgba(127,178,255,0.2)] bg-blueprint-deep/80 p-4 sm:p-6 min-h-[360px] flex flex-col justify-between relative overflow-hidden">
        {/* Step 1: Orthographic Views Materialize */}
        <div
          className={`transition-opacity duration-normal ${
            step >= 1 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Front & Top Orthographic Projections */}
            <div className="border border-[rgba(127,178,255,0.15)] p-4 bg-blueprint-deep">
              <span className="text-[9px] text-blueprint-dimension/60 uppercase block mb-2">
                ORTHOGRAPHIC PROJECTION (FIRST ANGLE ISO 128)
              </span>
              <svg
                className="w-full h-36 text-blueprint-dimension"
                viewBox="0 0 240 120"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                {/* Front Elevation View */}
                <rect x="20" y="20" width="80" height="50" stroke="#7FB2FF" />
                <circle cx="60" cy="45" r="12" stroke="#7FB2FF" strokeDasharray="2,2" />
                <line x1="10" y1="45" x2="110" y2="45" stroke="#7FB2FF" strokeDasharray="4,4" opacity="0.4" />
                <line x1="60" y1="10" x2="60" y2="80" stroke="#7FB2FF" strokeDasharray="4,4" opacity="0.4" />

                {/* Right Side View */}
                <rect x="130" y="20" width="50" height="50" stroke="#7FB2FF" />
                <rect x="130" y="33" width="50" height="24" stroke="#7FB2FF" strokeDasharray="2,2" />

                {/* Step 2: Dimension Leaders Draw In */}
                {step >= 2 && (
                  <g stroke="#2F7BFF" fill="#2F7BFF" fontSize="7" opacity="0.9">
                    {/* Width Dimension: 80.00 */}
                    <line x1="20" y1="85" x2="100" y2="85" />
                    <line x1="20" y1="75" x2="20" y2="90" />
                    <line x1="100" y1="75" x2="100" y2="90" />
                    <text x="60" y="95" textAnchor="middle">80.00 ±0.02</text>

                    {/* Height Dimension: 50.00 */}
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
              <BomTable />
            </div>
          </div>
        </div>

        {/* Step 4: Revision Block Updates */}
        <div
          className={`mt-6 pt-3 border-t border-[rgba(127,178,255,0.2)] flex flex-col sm:flex-row items-center justify-between text-mono-xs transition-opacity duration-normal ${
            step >= 4 ? "opacity-100" : "opacity-30"
          }`}
        >
          <div className="flex items-center space-x-3">
            <RedlineCallout revision="01" note="ALL TOLERANCES VALIDATED" />
            <span className="text-blueprint-dimension/70">
              CAD AUDIT: GD&T COMPLIANT (ASME Y14.5M)
            </span>
          </div>
          <span className="text-[10px] text-blueprint-dimension/60 mt-1 sm:mt-0">
            METAVAYN DOCUMENTATION RELEASE STAMP
          </span>
        </div>
      </div>
    </div>
  );
}
