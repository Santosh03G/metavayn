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
        <div className={`flex items-center justify-between border-b ${dividerClass} pb-2 mb-3 text-xs font-sans ${labelClass}`}>
          <span className="flex items-center space-x-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-copper" />
            <span>Sheet Metal Kinematic Unfold Simulator</span>
          </span>
          <span className="font-semibold text-paper">Bend Angle: {bendDegrees}°</span>
        </div>

        {/* 3D Viewport */}
        <Scene surface={surface} aspectRatio="aspect-[16/10]" cameraPosition={[2.8, 2.2, 3.6]}>
          <M2SheetMetalUnfold unfoldProgress={unfoldProgress} />
        </Scene>

        {/* Interactive Scrubber Slider */}
        <div className={`mt-4 pt-3 border-t ${dividerClass} space-y-2`}>
          <div className={`flex items-center justify-between font-sans text-xs ${labelClass}`}>
            <span>Flat pattern (0°)</span>
            <span className="text-paper font-semibold">
              {Math.round(unfoldProgress * 100)}% unfolded
            </span>
            <span>Formed bracket (90°)</span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={unfoldProgress}
            onChange={(e) => setUnfoldProgress(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-paper/20 rounded-lg appearance-none cursor-pointer accent-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
            aria-label="Sheet metal unfolding scrubber"
          />
        </div>
      </div>

      {/* Weldment Callout Demonstration below Scrubber */}
      <M3WeldmentCallout surface={surface} />
    </div>
  );
}