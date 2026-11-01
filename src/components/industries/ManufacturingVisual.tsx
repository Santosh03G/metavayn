"use client";

import { BomTable } from "@/components/drawing/BomTable";
import { type SurfaceType } from "@/components/ui/Button";

export function ManufacturingVisual({
  surface = "black",
}: {
  surface?: SurfaceType;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-black text-paper relative select-none overflow-hidden">
      {/* 2D Orthographic Technical Drawing Preview */}
      <div className="border border-pale-blue/30 bg-black/60 p-4 relative mb-4">
        {/* Drawing Header */}
        <div className="flex items-center justify-between border-b border-pale-blue/20 pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-copper" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-pale-blue font-semibold">
              FABRICATION DRAWING & ASSEMBLY BOM
            </span>
          </div>
          <span className="font-mono text-[9px] text-paper/60">
            SHEET 01 / 01
          </span>
        </div>

        {/* Orthographic Geometry Illustration */}
        <div className="flex items-center justify-center py-4">
          <svg
            viewBox="0 0 420 120"
            className="w-full max-w-[380px] h-auto text-paper stroke-current"
            fill="none"
            strokeWidth="1.2"
          >
            {/* Front View */}
            <g transform="translate(30, 10)">
              <rect x="0" y="10" width="100" height="70" stroke="#F1EEE6" />
              <rect x="15" y="25" width="70" height="40" stroke="#9DB2FF" strokeDasharray="3 3" />
              <circle cx="50" cy="45" r="12" stroke="#F0A06A" />
              {/* Balloon Callout 1 */}
              <circle cx="85" cy="20" r="8" stroke="#F0A06A" fill="#050505" />
              <text x="85" y="23" textAnchor="middle" fill="#F0A06A" fontSize="8" fontFamily="monospace">1</text>
              <line x1="80" y1="20" x2="65" y2="30" stroke="#F0A06A" strokeWidth="0.8" />
            </g>

            {/* Projection Lines */}
            <line x1="140" y1="20" x2="175" y2="20" stroke="#9DB2FF" strokeDasharray="2 4" opacity="0.4" />
            <line x1="140" y1="90" x2="175" y2="90" stroke="#9DB2FF" strokeDasharray="2 4" opacity="0.4" />

            {/* Side View */}
            <g transform="translate(185, 10)">
              <rect x="0" y="10" width="55" height="70" stroke="#F1EEE6" />
              <line x1="25" y1="10" x2="25" y2="80" stroke="#9DB2FF" strokeDasharray="3 3" />
              {/* Balloon Callout 2 */}
              <circle cx="45" cy="20" r="8" stroke="#F0A06A" fill="#050505" />
              <text x="45" y="23" textAnchor="middle" fill="#F0A06A" fontSize="8" fontFamily="monospace">2</text>
              <line x1="40" y1="20" x2="28" y2="30" stroke="#F0A06A" strokeWidth="0.8" />
            </g>

            {/* Isometric Detail Thumbnail */}
            <g transform="translate(290, 15)">
              <polygon points="40,5 80,25 40,45 0,25" stroke="#F1EEE6" fill="rgba(241, 238, 230, 0.05)" />
              <polygon points="0,25 40,45 40,85 0,65" stroke="#F1EEE6" fill="rgba(241, 238, 230, 0.02)" />
              <polygon points="40,45 80,25 80,65 40,85" stroke="#F1EEE6" fill="rgba(241, 238, 230, 0.08)" />
              {/* Balloon Callout 3 */}
              <circle cx="70" cy="15" r="8" stroke="#F0A06A" fill="#050505" />
              <text x="70" y="18" textAnchor="middle" fill="#F0A06A" fontSize="8" fontFamily="monospace">3</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Production BOM Table Schedule */}
      <div className="w-full flex-1">
        <BomTable surface={surface} />
      </div>
    </div>
  );
}
