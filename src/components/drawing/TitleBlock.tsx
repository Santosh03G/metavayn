"use client";

import { useEffect, useState } from "react";
import { type SurfaceType } from "@/components/ui/Button";

interface TitleBlockProps {
  drawingTitle?: string;
  drawingNumber?: string;
  sheetNumber?: string;
  totalSheets?: string;
  scale?: string;
  revision?: string;
  surface?: SurfaceType;
  className?: string;
}

export function TitleBlock({
  drawingTitle = "SYSTEM ARCHITECTURE & GENERAL ARRANGEMENT",
  drawingNumber = "DWG-2026-001",
  sheetNumber = "01",
  totalSheets = "07",
  scale = "1:1",
  revision = "01",
  surface = "royal",
  className = "",
}: TitleBlockProps) {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xMm = Math.round((e.clientX / window.innerWidth) * 420);
      const yMm = Math.round((e.clientY / window.innerHeight) * 297);
      setCoords({ x: xMm, y: yMm });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const stylesBySurface: Record<
    SurfaceType,
    {
      container: string;
      dividers: string;
      label: string;
      title: string;
      docId: string;
      badge: string;
    }
  > = {
    royal: {
      container: "border border-paper/30 bg-royal/90 text-paper",
      dividers: "divide-paper/20",
      label: "text-paper/70",
      title: "text-paper",
      docId: "text-paper",
      badge: "bg-paper/15 border-paper text-paper",
    },
    black: {
      container: "border border-pale-blue/30 bg-black text-paper",
      dividers: "divide-pale-blue/20",
      label: "text-pale-blue",
      title: "text-paper",
      docId: "text-pale-blue",
      badge: "bg-pale-blue/15 border-pale-blue text-pale-blue",
    },
    paper: {
      container: "border border-paper-line bg-paper text-black",
      dividers: "divide-paper-line",
      label: "text-black/70",
      title: "text-black",
      docId: "text-royal",
      badge: "bg-redline/10 border-redline text-redline-text",
    },
  };

  const currentStyles = stylesBySurface[surface];

  return (
    <div
      className={`font-mono text-xs select-none ${currentStyles.container} ${className}`}
      aria-label="Engineering Drawing Title Block"
    >
      <div className={`grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x ${currentStyles.dividers}`}>
        {/* Company & Standard */}
        <div className="md:col-span-4 p-2.5 space-y-1">
          <div className={`text-[10px] uppercase tracking-wider ${currentStyles.label}`}>
            ORGANIZATION
          </div>
          <div className={`font-semibold tracking-wide text-sm ${currentStyles.title}`}>
            METAVAYN TECHNOLOGIES PVT. LTD.
          </div>
          <div className={`text-[10px] ${currentStyles.label}`}>
            ENGINEERING SERVICES SPECIFICATION
          </div>
        </div>

        {/* Drawing Title & Projection */}
        <div className="md:col-span-5 p-2.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] uppercase tracking-wider ${currentStyles.label}`}>
              DRAWING TITLE
            </span>
            {/* First Angle Projection Symbol */}
            <svg
              className={`w-10 h-4 ${currentStyles.label}`}
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
          <div className={`text-xs font-medium truncate ${currentStyles.title}`}>
            {drawingTitle}
          </div>
          <div className={`flex items-center space-x-3 text-[10px] ${currentStyles.label}`}>
            <span>SCALE: {scale}</span>
            <span>•</span>
            <span>
              SHEET: {sheetNumber} OF {totalSheets}
            </span>
            <span>•</span>
            <span>
              X: {coords.x}mm Y: {coords.y}mm
            </span>
          </div>
        </div>

        {/* DWG No & Revision */}
        <div className="md:col-span-3 p-2.5 flex flex-col justify-between">
          <div>
            <div className={`text-[10px] uppercase tracking-wider ${currentStyles.label}`}>
              DRAWING REFERENCE
            </div>
            <div className={`text-xs font-bold tracking-wider ${currentStyles.docId}`}>
              {drawingNumber}
            </div>
          </div>
          <div className={`flex items-center justify-between pt-1 border-t ${currentStyles.dividers} text-[10px]`}>
            <span className={currentStyles.label}>REV: {revision}</span>
            <span className={`px-1.5 py-0.5 border text-[9px] font-bold ${currentStyles.badge}`}>
              RELEASE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}