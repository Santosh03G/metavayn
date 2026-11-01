"use client";

import { useState, useEffect, useRef } from "react";
import { type IndustryVisualId } from "@/lib/industries-data";
import { IndustrialVisual } from "./IndustrialVisual";
import { HvacAirflowVisual } from "./HvacAirflowVisual";
import { ManufacturingVisual } from "./ManufacturingVisual";
import { OemTurntableVisual } from "./OemTurntableVisual";
import { ModularTeamVisual } from "./ModularTeamVisual";

interface IndustryStageProps {
  activeId: IndustryVisualId;
  className?: string;
}

function renderVisualContent(id: IndustryVisualId) {
  switch (id) {
    case "industrial":
      return <IndustrialVisual surface="black" />;
    case "hvac":
      return <HvacAirflowVisual surface="black" />;
    case "manufacturing":
      return <ManufacturingVisual surface="black" />;
    case "oem":
      return <OemTurntableVisual surface="black" />;
    case "tech":
      return <ModularTeamVisual surface="black" />;
  }
}

export function IndustryStage({
  activeId,
  className = "",
}: IndustryStageProps) {
  const [currentId, setCurrentId] = useState<IndustryVisualId>(activeId);
  const [previousId, setPreviousId] = useState<IndustryVisualId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  // Trigger Section-Cut Wipe when activeId changes
  useEffect(() => {
    if (activeId === currentId) return;

    if (reducedMotion) {
      // Instant switch under reduced motion
      setCurrentId(activeId);
      setPreviousId(null);
      setIsTransitioning(false);
      return;
    }

    // Set up dual-layer wipe
    setPreviousId(currentId);
    setCurrentId(activeId);
    setIsTransitioning(true);
    setTransitionProgress(false);

    // Trigger CSS animation on next tick
    const startTimer = setTimeout(() => {
      setTransitionProgress(true);
    }, 20);

    // Complete transition after 400ms
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousId(null);
      setTransitionProgress(false);
    }, 450);

    return () => {
      clearTimeout(startTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeId, currentId, reducedMotion]);

  return (
    <div
      className={`relative w-full aspect-[16/10] sm:aspect-[16/11] lg:aspect-[16/10] border border-pale-blue/30 bg-black select-none overflow-hidden ${className}`}
      aria-label="Interactive Industry Visual Stage"
      role="region"
    >
      {/* Layer 1: Outgoing Visual (Base Layer) */}
      {previousId && (
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {renderVisualContent(previousId)}
        </div>
      )}

      {/* Layer 2: Incoming Visual (Clipped by the Section-Cut Plane) */}
      <div
        className="absolute inset-0 w-full h-full z-10"
        style={{
          clipPath: isTransitioning
            ? transitionProgress
              ? "inset(0 0 0 0%)"
              : "inset(0 0 0 100%)"
            : "inset(0 0 0 0%)",
          transition: isTransitioning
            ? "clip-path 400ms cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
        }}
      >
        {renderVisualContent(currentId)}
      </div>

      {/* Signature CAD Section-Cut Plane Line & Datum Callout (Sweeping Left to Right) */}
      {isTransitioning && (
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{
            left: transitionProgress ? "100%" : "0%",
            transition: "left 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* 1.5px Copper Cutting Rule with Ambient Glow */}
          <div className="absolute top-0 bottom-0 left-0 w-[1.5px] bg-copper shadow-[0_0_12px_rgba(240,160,106,0.6)]" />

          {/* Top Section Datum Marker: ▲ SECTION A–A */}
          <div className="absolute top-2 -translate-x-1/2 flex items-center space-x-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-copper font-bold whitespace-nowrap bg-black/90 px-1.5 py-0.5 border border-copper/50">
              ▲ SECTION A–A
            </span>
          </div>

          {/* Bottom Section Datum Arrow: ▼ */}
          <div className="absolute bottom-2 -translate-x-1/2">
            <span className="font-mono text-[9px] text-copper font-bold bg-black/90 px-1 border border-copper/50">
              ▼
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
