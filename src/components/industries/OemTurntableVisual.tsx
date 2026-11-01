"use client";

import { Scene } from "@/components/canvas/Scene";
import { CADModelView } from "@/components/canvas/CADModelView";
import { type SurfaceType } from "@/components/ui/Button";

export function OemTurntableVisual({
  surface = "black",
}: {
  surface?: SurfaceType;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-black text-paper relative select-none overflow-hidden">
      {/* 3D Precision Flange Assembly Turntable */}
      <div className="w-full flex-1 min-h-[260px] sm:min-h-[300px]">
        <Scene
          surface={surface}
          aspectRatio="aspect-[16/10]"
          cameraPosition={[4.5, 3.5, 4.5]}
          borderless={true}
          modelScale={1.25}
        >
          <CADModelView
            mode="shaded"
            surface="black"
            autoRotate={true}
            color="#F1EEE6"
            edgeColor="#050505"
          />
        </Scene>
      </div>

      {/* CAD Telemetry & Part Data Bar */}
      <div className="border border-pale-blue/20 bg-black/80 px-3.5 py-2 font-mono text-[10px] sm:text-xs flex flex-wrap items-center justify-between gap-2 mt-3">
        <span className="text-pale-blue flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-copper" />
          TURNTABLE ROTATION ACTIVE
        </span>
        <span className="text-paper/80">ASSEMBLY: OEM-402</span>
        <span className="text-copper">PCD: 4x Ø12.0 mm</span>
      </div>
    </div>
  );
}
