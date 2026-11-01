"use client";

import { useState } from "react";
import { Scene } from "@/components/canvas/Scene";
import { M2SheetMetalUnfold } from "@/components/canvas/M2SheetMetalUnfold";
import { M3WeldmentCallout } from "@/components/canvas/M3WeldmentCallout";
import { type SurfaceType } from "@/components/ui/Button";

interface MechanicalDesignViewerProps {
  surface?: SurfaceType;
}

export function MechanicalDesignViewer({ surface = "royal" }: MechanicalDesignViewerProps) {
  const [unfoldProgress, setUnfoldProgress] = useState<number>(0.3);

  const bendDegrees = Math.round((1 - unfoldProgress) * 90);
  const isRoyal = surface === "royal";

  const containerClass = isRoyal
    ? "border-paper/30 bg-royal/90 text-paper"
    : "border-pale-blue/30 bg-black text-paper";

  const dividerClass = isRoyal ? "border-paper/20" : "border-pale-blue/20";
  const labelClass = isRoyal ? "text-paper/80" : "text-pale-blue";

  return (
    <div className="space-y-4 select-none">
      <div className={`border p-4 sm:p-6 ${containerClass}`}>
        {/* Header telemetry */}
        <div className={`flex items-center justify-between border-b ${dividerClass} pb-2 mb-3 text-mono-xs font-mono ${labelClass}`}>
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-copper animate-pulse" />
            <span>M2 SHEET METAL KINEMATIC UNFOLD SIMULATOR</span>
          </span>
          {/* Text on royal must be --paper (5.9:1), not copper */}
          <span className="font-semibold text-paper">BEND ANGLE: {bendDegrees}°</span>
        </div>

        {/* 3D Viewport */}
        <Scene surface={surface} aspectRatio="aspect-[16/10]" cameraPosition={[2.8, 2.2, 3.6]}>
          <M2SheetMetalUnfold unfoldProgress={unfoldProgress} />
        </Scene>

        {/* Interactive Scrubber Slider */}
        <div className={`mt-4 pt-3 border-t ${dividerClass} space-y-2`}>
          <div className={`flex items-center justify-between font-mono text-[10px] ${labelClass}`}>
            <span>FLAT PATTERN (0°)</span>
            <span className="text-paper font-semibold">
              SCRUBBER: {Math.round(unfoldProgress * 100)}% UNFOLDED
            </span>
            <span>FORMED BRACKET (90°)</span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={unfoldProgress}
            onChange={(e) => setUnfoldProgress(parseFloat(e.target.value))}
            className="w-full accent-copper bg-black/40 cursor-pointer h-1.5 rounded-none"
            aria-label="Sheet metal unfold percentage scrubber"
          />

          <div className={`flex justify-between items-center text-[9px] font-mono ${labelClass} opacity-80 pt-1`}>
            <span>NEUTRAL AXIS K-FACTOR: 0.44</span>
            <span>BEND RADIUS R = 2.0mm • DIN 6935</span>
            <span>MATERIAL: AL 5052-H32</span>
          </div>
        </div>
      </div>

      {/* M3 Weldment Callout underneath */}
      <M3WeldmentCallout surface={surface} />
    </div>
  );
}
