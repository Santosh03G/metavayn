"use client";

import { useState } from "react";
import { Scene } from "@/components/canvas/Scene";
import { M1AirHandlingUnit } from "@/components/canvas/M1AirHandlingUnit";
import { M1DrawingFallback } from "@/components/canvas/M1DrawingFallback";

export function HvacThermalViewer() {
  const [viewMode, setViewMode] = useState<"shaded" | "wireframe" | "drawing">("shaded");

  return (
    <div className="border border-pale-blue/30 bg-black p-4 sm:p-6 select-none space-y-4">
      {/* View Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-pale-blue/20 pb-2 gap-2 text-mono-xs font-mono text-pale-blue">
        <span className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-pale-blue animate-pulse" />
          <span>HVAC & THERMAL UNIT: M1 AHU INSPECTION</span>
        </span>

        {/* View Mode Buttons */}
        <div className="flex items-center space-x-1.5">
          {(["drawing", "shaded", "wireframe"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setViewMode(m)}
              className={`px-2.5 py-1 text-[10px] uppercase font-semibold border transition-colors ${
                viewMode === m
                  ? "bg-pale-blue text-black border-pale-blue"
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
          mode={viewMode}
          interactiveTilt={true}
        />
      </Scene>

      <div className="flex justify-between items-center text-[10px] font-mono text-pale-blue/80 pt-1 border-t border-pale-blue/20">
        <span>CHILLED WATER COILS & CENTRIFUGAL BLOWERS HIGHLIGHTED</span>
        <span>DRAG TO ORBIT • ACTIVE: [{viewMode.toUpperCase()}]</span>
      </div>
    </div>
  );
}
