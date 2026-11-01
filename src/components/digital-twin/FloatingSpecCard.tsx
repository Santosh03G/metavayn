"use client";

import React from "react";
import { useDigitalTwin } from "@/lib/digital-twin/context";
import { SUB_ASSEMBLIES } from "@/lib/digital-twin/data";

export interface FloatingSpecCardProps {
  className?: string;
}

export function FloatingSpecCard({ className = "" }: FloatingSpecCardProps) {
  const { selectedAssemblyId, setSelectedAssemblyId } = useDigitalTwin();

  if (!selectedAssemblyId) return null;

  const metadata = SUB_ASSEMBLIES[selectedAssemblyId];
  if (!metadata) return null;

  return (
    <aside
      role="complementary"
      aria-label={`Engineering specification for ${metadata.name}`}
      className={`pointer-events-auto z-40 bg-[#F1EEE6] text-[#050505] border border-[#050505] shadow-2xl backdrop-blur-md transition-all duration-300 ${
        /* Mobile: Bottom-sheet drawer sliding up from the bottom */
        "fixed md:absolute inset-x-0 bottom-0 md:inset-auto md:right-6 md:bottom-20 w-full md:w-[390px] md:max-w-md rounded-t-xl md:rounded-[2px] max-h-[85vh] md:max-h-none overflow-y-auto"
      } ${className}`}
    >
      {/* Mobile drag handle for quick dismissal */}
      <div className="flex justify-center pt-2.5 pb-1 md:hidden">
        <button
          type="button"
          onClick={() => setSelectedAssemblyId(null)}
          className="w-12 h-1.5 rounded-full bg-[#050505]/20 hover:bg-[#050505]/40 transition-colors"
          aria-label="Dismiss sheet"
        />
      </div>

      <div className="p-4 sm:p-5">
        {/* Header: Sub-assembly identifier, Discipline Badge, and Close Button */}
        <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#050505]/15">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-mono-xs font-semibold uppercase tracking-wider text-[#050505]/70">
                MODULE // {metadata.num}
              </span>
              <span className="inline-block px-2 py-0.5 font-mono text-mono-xs font-semibold bg-[#2347E0] text-white rounded-[2px]">
                {metadata.discipline}
              </span>
            </div>
            <h3 className="font-display text-display-base font-bold text-[#050505] leading-snug">
              {metadata.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setSelectedAssemblyId(null)}
            aria-label="Close specification card"
            className="flex items-center justify-center p-1.5 rounded-[2px] text-[#050505] hover:bg-[#050505]/10 font-mono text-xs transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2347E0]"
          >
            [ ✕ ]
          </button>
        </div>

        {/* Spec Sections */}
        <div className="mt-3.5 space-y-3 font-sans text-body-sm">
          {/* Materials */}
          <div>
            <span className="block font-mono text-mono-xs font-semibold uppercase tracking-wider text-[#050505]/60 mb-0.5">
              Material Specs
            </span>
            <p className="text-[#050505]/90 leading-relaxed font-normal">
              {metadata.materialSpecs}
            </p>
          </div>

          {/* Manufacturing Process */}
          <div>
            <span className="block font-mono text-mono-xs font-semibold uppercase tracking-wider text-[#050505]/60 mb-0.5">
              Manufacturing Process
            </span>
            <p className="text-[#050505]/90 leading-relaxed font-normal">
              {metadata.manufacturingProcess}
            </p>
          </div>

          {/* Design Tolerances */}
          <div>
            <span className="block font-mono text-mono-xs font-semibold uppercase tracking-wider text-[#050505]/60 mb-0.5">
              Design Tolerances
            </span>
            <div className="inline-block bg-[#050505] text-[#F0A06A] font-mono text-mono-xs font-medium px-2 py-1 rounded-[2px]">
              {metadata.designTolerances}
            </div>
          </div>

          {/* Governing Standard */}
          <div>
            <span className="block font-mono text-mono-xs font-semibold uppercase tracking-wider text-[#050505]/60 mb-0.5">
              Validation Standard
            </span>
            <div className="font-mono text-mono-xs text-[#050505] font-semibold">
              {metadata.validationStandard}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
