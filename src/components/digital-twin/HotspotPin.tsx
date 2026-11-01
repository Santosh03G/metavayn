"use client";

import React from "react";
import { Html } from "@react-three/drei";
import { useDigitalTwin } from "@/lib/digital-twin/context";
import { SUB_ASSEMBLIES } from "@/lib/digital-twin/data";
import type { SubAssemblyId, SubAssemblyMetadata } from "@/lib/digital-twin/types";

export interface HotspotPinProps {
  id: SubAssemblyId;
  position?: [number, number, number];
  metadata?: SubAssemblyMetadata;
  className?: string;
}

export function HotspotPin({
  id,
  position,
  metadata,
  className = "",
}: HotspotPinProps) {
  const { selectedAssemblyId, setSelectedAssemblyId, explodeFactor } = useDigitalTwin();
  const meta = metadata ?? SUB_ASSEMBLIES[id];

  if (!meta) return null;

  const isSelected = selectedAssemblyId === id;

  // Compute dynamic pin position following exploded sub-assemblies if position is not overridden
  const baseAnchor = meta.hotspotAnchor;
  const clampedExplode = Math.max(0, Math.min(1, explodeFactor || 0));
  const spacing = clampedExplode * 1.4;

  let dynamicPos: [number, number, number] = position ?? [...baseAnchor];
  if (!position) {
    if (id === "filter-bank") {
      dynamicPos = [-1.4 - spacing, baseAnchor[1], baseAnchor[2]];
    } else if (id === "cooling-coil") {
      dynamicPos = [baseAnchor[0], baseAnchor[1], baseAnchor[2]];
    } else if (id === "centrifugal-fan") {
      dynamicPos = [1.35 + spacing, baseAnchor[1], baseAnchor[2]];
    } else if (id === "skid-base") {
      dynamicPos = [baseAnchor[0], -0.68 - clampedExplode * 0.25, baseAnchor[2]];
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAssemblyId(isSelected ? null : id);
  };

  return (
    <Html
      position={dynamicPos}
      center
      distanceFactor={10}
      zIndexRange={[60, 0]}
      className={className}
    >
      <button
        type="button"
        data-hotspot-id={id}
        aria-label={`Inspect ${meta.name}`}
        aria-pressed={isSelected}
        onClick={handleClick}
        className={`group relative flex items-center justify-center w-8 h-8 rounded-full border border-[#050505] transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2347E0] focus-visible:ring-offset-2 ${
          isSelected
            ? "bg-[#2347E0] text-[#FFFFFF] scale-110 shadow-lg ring-2 ring-white/60"
            : "bg-[#F1EEE6] text-[#050505] hover:scale-105 hover:border-[#2347E0]"
        }`}
      >
        {/* Pulsing royal core dot when not selected */}
        {!isSelected && (
          <span className="absolute w-2.5 h-2.5 rounded-full bg-[#2347E0] animate-ping opacity-75 pointer-events-none" />
        )}
        <span className="font-mono text-mono-xs font-bold leading-none">
          {meta.num}
        </span>
      </button>
    </Html>
  );
}

/**
 * Convenience collection component to render all sub-assembly hotspot pins
 * during digital twin inspector mode.
 */
export function DigitalTwinHotspots() {
  const { mode } = useDigitalTwin();

  if (mode !== "inspector") return null;

  return (
    <group name="digital-twin-hotspots">
      {(Object.keys(SUB_ASSEMBLIES) as SubAssemblyId[]).map((id) => (
        <HotspotPin key={id} id={id} />
      ))}
    </group>
  );
}
