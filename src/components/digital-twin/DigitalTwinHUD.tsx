"use client";

import React, { useCallback } from "react";
import { useDigitalTwin } from "@/lib/digital-twin/context";
import { SUB_ASSEMBLIES } from "@/lib/digital-twin/data";
import type { CameraPreset } from "@/lib/digital-twin/types";
import { FloatingSpecCard } from "./FloatingSpecCard";

export interface DigitalTwinHUDProps {
  className?: string;
  forceVisible?: boolean;
}

const PRESET_BUTTONS: { preset: CameraPreset; label: string; ariaLabel: string }[] = [
  { preset: "ISO", label: "ISO", ariaLabel: "ISO view preset" },
  { preset: "FRONT", label: "FRONT", ariaLabel: "FRONT view preset" },
  { preset: "PLAN", label: "PLAN", ariaLabel: "PLAN view preset" },
  { preset: "END", label: "END", ariaLabel: "END view preset" },
];

export function DigitalTwinHUD({ className = "", forceVisible = false }: DigitalTwinHUDProps) {
  const {
    mode,
    cameraPreset,
    setCameraPreset,
    explodeFactor,
    setExplodeFactor,
    isFullscreen,
    toggleFullscreen,
    resetInspector,
  } = useDigitalTwin();

  const handleSliderKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        setExplodeFactor(Math.max(0, Number((explodeFactor - 0.05).toFixed(2))));
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        setExplodeFactor(Math.min(1, Number((explodeFactor + 0.05).toFixed(2))));
      } else if (e.key === "Home") {
        e.preventDefault();
        setExplodeFactor(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setExplodeFactor(1);
      }
    },
    [explodeFactor, setExplodeFactor]
  );

  if (mode !== "inspector" && !forceVisible) {
    return null;
  }

  const currentPercent = Math.round(explodeFactor * 100);

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-5 select-none ${className}`}
      data-testid="digital-twin-hud"
    >
      {/* Top Status Bar */}
      <header className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Left: LIVE CAD INSPECTION with pulsing royal indicator */}
        <div className="flex items-center gap-2.5 font-mono text-mono-xs sm:text-mono-sm font-semibold tracking-wider text-paper bg-[#050505]/85 px-3 py-1.5 border border-paper-line/50 rounded-[2px] backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2347E0] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2347E0]" />
          </span>
          <span>● LIVE CAD INSPECTION // AHU-M1 MODULAR</span>
        </div>

        {/* Right: Fullscreen Toggle & Resume Story */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="inline-flex items-center px-3 py-1.5 text-mono-xs font-mono font-medium rounded-[2px] border border-paper-line bg-paper text-black hover:bg-black hover:text-white transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2347E0]"
          >
            [ ⛶ {isFullscreen ? "Exit Fullscreen" : "Fullscreen"} ]
          </button>

          <button
            type="button"
            onClick={resetInspector}
            aria-label="Resume Story"
            className="inline-flex items-center px-3 py-1.5 text-mono-xs font-mono font-medium rounded-[2px] border border-paper-line bg-paper text-black hover:bg-black hover:text-white transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2347E0]"
          >
            [ ✕ Resume Story ]
          </button>
        </div>
      </header>

      {/* Center / Floating Spec Card */}
      <FloatingSpecCard />

      {/* Bottom Precision Dock */}
      <footer className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 pointer-events-auto bg-[#050505]/90 border border-paper-line/40 px-4 py-2.5 rounded-[2px] backdrop-blur-md mx-auto max-w-full">
        {/* Camera View Preset Buttons */}
        <div className="flex items-center gap-1.5" role="group" aria-label="Camera view presets">
          <span className="font-mono text-mono-xs uppercase tracking-wider text-paper/60 mr-1 hidden sm:inline">
            View:
          </span>
          {PRESET_BUTTONS.map(({ preset, label, ariaLabel }) => {
            const isActive = cameraPreset === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => setCameraPreset(preset)}
                aria-label={ariaLabel}
                aria-pressed={isActive}
                className={`px-2.5 py-1 text-mono-xs font-mono font-semibold rounded-[2px] border transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2347E0] ${
                  isActive
                    ? "bg-[#2347E0] text-white border-[#2347E0] shadow-sm"
                    : "bg-paper text-black border-paper-line hover:border-black hover:bg-white"
                }`}
              >
                [ {label} ]
              </button>
            );
          })}
        </div>

        <div className="hidden md:block w-px h-5 bg-paper-line/30" />

        {/* 0-100% Manual Explosion Scrubber */}
        <div className="flex items-center gap-2 sm:gap-3" role="group" aria-label="Explosion kinematics controls">
          <button
            type="button"
            onClick={() => setExplodeFactor(0)}
            aria-label="Assemble AHU model (0%)"
            className="px-2 py-1 text-mono-xs font-mono font-medium rounded-[2px] border border-paper-line bg-paper text-black hover:bg-white transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2347E0]"
          >
            [ Assemble ]
          </button>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={currentPercent}
              onChange={(e) => setExplodeFactor(Number(e.target.value) / 100)}
              onKeyDown={handleSliderKeyDown}
              role="slider"
              aria-label="Explosion gap percentage"
              aria-valuenow={currentPercent}
              aria-valuemin={0} /* aria-valuemin="0" */
              aria-valuemax={100} /* aria-valuemax="100" */
              aria-valuetext={`${currentPercent}%`}
              className="w-24 sm:w-32 md:w-36 h-1.5 bg-paper-line/50 rounded appearance-none cursor-pointer accent-[#2347E0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2347E0]"
            />
            <span className="font-mono text-mono-xs font-semibold text-paper min-w-[4ch] text-right">
              {currentPercent}%
            </span>
          </div>

          <button
            type="button"
            onClick={() => setExplodeFactor(1)}
            aria-label="Explode AHU model (100%)"
            className="px-2 py-1 text-mono-xs font-mono font-medium rounded-[2px] border border-paper-line bg-paper text-black hover:bg-white transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2347E0]"
          >
            [ Explode ]
          </button>
        </div>
      </footer>
    </div>
  );
}
