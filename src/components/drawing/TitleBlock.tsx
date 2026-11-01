"use client";

import { useEffect, useState } from "react";

interface TitleBlockProps {
  drawingTitle?: string;
  drawingNumber?: string;
  sheetNumber?: string;
  totalSheets?: string;
  scale?: string;
  revision?: string;
  className?: string;
}

export function TitleBlock({
  drawingTitle = "SYSTEM ARCHITECTURE & GENERAL ARRANGEMENT",
  drawingNumber = "MV-2026-001",
  sheetNumber = "01",
  totalSheets = "07",
  scale = "1:1",
  revision = "01",
  className = "",
}: TitleBlockProps) {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to drafting millimeters relative to viewport
      const xMm = Math.round((e.clientX / window.innerWidth) * 420); // A3 sheet width (420mm)
      const yMm = Math.round((e.clientY / window.innerHeight) * 297); // A3 sheet height (297mm)
      setCoords({ x: xMm, y: yMm });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={`border border-[rgba(127,178,255,0.3)] bg-blueprint-deep/95 text-blueprint-linen font-mono text-xs select-none ${className}`}
      aria-label="Engineering Drawing Title Block"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[rgba(127,178,255,0.2)]">
        {/* Company & Standard */}
        <div className="md:col-span-4 p-2.5 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-blueprint-dimension/80">
            ORGANIZATION / STANDARDS
          </div>
          <div className="font-semibold tracking-wide text-sm text-blueprint-linen">
            METAVAYN TECHNOLOGIES PVT. LTD.
          </div>
          <div className="text-[10px] text-blueprint-dimension/60">
            ISO 128 / ASME Y14.5M COMPLIANT
          </div>
        </div>

        {/* Drawing Title & Projection */}
        <div className="md:col-span-5 p-2.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-blueprint-dimension/80">
              DRAWING TITLE
            </span>
            {/* First Angle Projection Symbol (ISO) */}
            <svg
              className="w-10 h-4 text-blueprint-dimension/80"
              viewBox="0 0 40 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-label="First Angle Projection Symbol"
            >
              {/* Truncated Cone */}
              <polygon points="2,3 16,6 16,10 2,13" />
              <line x1="0" y1="8" x2="18" y2="8" strokeDasharray="2,2" />
              {/* Concentric Circles */}
              <circle cx="28" cy="8" r="3" />
              <circle cx="28" cy="8" r="6" />
              <line x1="20" y1="8" x2="36" y2="8" strokeDasharray="2,2" />
              <line x1="28" y1="0" x2="28" y2="16" strokeDasharray="2,2" />
            </svg>
          </div>
          <div className="text-xs font-medium text-blueprint-linen truncate">
            {drawingTitle}
          </div>
          <div className="flex items-center space-x-3 text-[10px] text-blueprint-dimension/70">
            <span>SCALE: {scale}</span>
            <span>•</span>
            <span>
              SHEET: {sheetNumber} OF {totalSheets}
            </span>
            <span>•</span>
            <span className="text-blueprint-dimension">
              X: {coords.x}mm Y: {coords.y}mm
            </span>
          </div>
        </div>

        {/* DWG No & Revision */}
        <div className="md:col-span-3 p-2.5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-blueprint-dimension/80">
              DOCUMENT IDENTIFIER
            </div>
            <div className="text-xs font-bold text-blueprint-dimension tracking-wider">
              {drawingNumber}
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[rgba(127,178,255,0.15)] text-[10px]">
            <span className="text-blueprint-dimension/70">REV: {revision}</span>
            <span className="px-1.5 py-0.5 bg-blueprint-redline/15 border border-blueprint-redline/40 text-blueprint-redline text-[9px] font-bold">
              VALIDATED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
