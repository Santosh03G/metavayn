"use client";

import { useState } from "react";
import { Scene } from "@/components/canvas/Scene";
import { M1AirHandlingUnit } from "@/components/canvas/M1AirHandlingUnit";
import { M1DrawingFallback } from "@/components/canvas/M1DrawingFallback";

export function HvacThermalViewer() {
  const [viewMode, setViewMode] = useState<"shaded" | "wireframe" | "drawing">("shaded");

  return (
    <div className="border border-pale-blue/30 bg-black/60 p-4 sm:p-6 select-none space-y-4">
      {/* View Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-pale-blue/20 pb-2 gap-2 text-xs font-sans text-pale-blue">
        <span className="flex items-center space-x-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-pale-blue" />
          <span>HVAC & Thermal Unit: M1 AHU Inspection</span>
        </span>

        {/* View Mode Buttons */}
        <div className="flex items-center space-x-1.5">
          {(["drawing", "shaded", "wireframe"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setViewMode(m)}
              className={`px-2.5 py-1 text-xs capitalize font-medium border transition-colors ${
                viewMode === m
                  ? "bg-pale-blue text-black border-pale-blue font-semibold"
                  : "bg-transparent text-pale-blue/80 border-pale-blue/30 hover:border-pale-blue"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Viewport on Black Section */}
      <Scene
        surface="black"
        aspectRatio="aspect-[16/10]"
        cameraPosition={[3.6, 2.5, 4.6]}
        fallback={<M1DrawingFallback surface="black" exploded={true} />}
      >
        <M1AirHandlingUnit
          surface="black"
          explodeFactor={0.5}
          activeDiscipline="hvac"
          interactiveTilt={true}
        />
      </Scene>
    </div>
  );
}