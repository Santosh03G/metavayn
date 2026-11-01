"use client";

import { useState } from "react";
import { Scene } from "@/components/canvas/Scene";
import { M2SheetMetalUnfold } from "@/components/canvas/M2SheetMetalUnfold";
import { M3WeldmentCallout } from "@/components/canvas/M3WeldmentCallout";

export function MechanicalDesignViewer() {
  const [unfoldProgress, setUnfoldProgress] = useState<number>(0.3); // 0 = 90 deg formed, 1 = flat

  const bendDegrees = Math.round((1 - unfoldProgress) * 90);

  return (
    <div className="space-y-4 select-none">
      <div className="border border-[rgba(127,178,255,0.3)] bg-blueprint-deep/95 p-4 sm:p-6">
        {/* Header telemetry */}
        <div className="flex items-center justify-between border-b border-[rgba(127,178,255,0.2)] pb-2 mb-3 text-mono-xs font-mono text-blueprint-dimension">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blueprint-signal animate-pulse" />
            <span>M2 SHEET METAL KINEMATIC UNFOLD SIMULATOR</span>
          </span>
          <span>BEND ANGLE: {bendDegrees}°</span>
        </div>

        {/* 3D Viewport */}
        <Scene aspectRatio="aspect-[16/10]" cameraPosition={[2.8, 2.2, 3.6]}>
          <M2SheetMetalUnfold unfoldProgress={unfoldProgress} />
        </Scene>

        {/* Interactive Scrubber Slider */}
        <div className="mt-4 pt-3 border-t border-[rgba(127,178,255,0.2)] space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px] text-blueprint-dimension/80">
            <span>FLAT PATTERN (0°)</span>
            <span className="text-blueprint-signal font-semibold">
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
            className="w-full accent-blueprint-signal bg-blueprint-cyanotype cursor-pointer h-1.5 rounded-none"
            aria-label="Sheet metal unfold percentage scrubber"
          />

          <div className="flex justify-between items-center text-[9px] font-mono text-blueprint-dimension/60 pt-1">
            <span>NEUTRAL AXIS K-FACTOR: 0.44</span>
            <span>BEND RADIUS R = 2.0mm • DIN 6935</span>
            <span>MATERIAL: AL 5052-H32</span>
          </div>
        </div>
      </div>

      {/* M3 Weldment Callout underneath */}
      <M3WeldmentCallout />
    </div>
  );
}
