import React, { type ReactNode } from "react";
import { TitleBlock } from "@/components/drawing/TitleBlock";

export interface DrawingSheetProps {
  drawingTitle?: string;
  drawingNumber?: string;
  sheetNumber?: string;
  totalSheets?: string;
  scale?: string;
  revision?: string;
  children: ReactNode;
  className?: string;
  showTitleBlock?: boolean;
}

export function DrawingSheet({
  drawingTitle = "GENERAL ARRANGEMENT",
  drawingNumber = "MV-2026-001",
  sheetNumber = "01",
  totalSheets = "07",
  scale = "1:1",
  revision = "01",
  children,
  className = "",
  showTitleBlock = true,
}: DrawingSheetProps) {
  // 8 horizontal zone columns, 4 vertical zone rows
  const horizontalZones = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const verticalZones = ["A", "B", "C", "D"];

  return (
    <div
      className={`relative border border-[rgba(127,178,255,0.35)] bg-blueprint-deep/90 p-4 sm:p-6 lg:p-8 ${className}`}
      aria-label="Engineering Drawing Sheet Frame"
    >
      {/* Corner Registration Crosshairs */}
      <div className="absolute top-1 left-1 font-mono text-[9px] text-blueprint-dimension/40 pointer-events-none">
        +
      </div>
      <div className="absolute top-1 right-1 font-mono text-[9px] text-blueprint-dimension/40 pointer-events-none">
        +
      </div>
      <div className="absolute bottom-1 left-1 font-mono text-[9px] text-blueprint-dimension/40 pointer-events-none">
        +
      </div>
      <div className="absolute bottom-1 right-1 font-mono text-[9px] text-blueprint-dimension/40 pointer-events-none">
        +
      </div>

      {/* Top Zone Identifiers (1-8) */}
      <div className="hidden sm:flex justify-between px-6 pb-2 text-[8px] font-mono text-blueprint-dimension/40 border-b border-[rgba(127,178,255,0.15)] select-none">
        {horizontalZones.map((z) => (
          <span key={`top-${z}`}>{z}</span>
        ))}
      </div>

      {/* Main Drawing Working Area */}
      <div className="relative py-6 sm:py-8 min-h-[280px] flex flex-col justify-between">
        {/* Left Vertical Zone Markers (A-D) */}
        <div className="hidden sm:flex flex-col justify-between absolute left-0 top-6 bottom-6 text-[8px] font-mono text-blueprint-dimension/40 select-none">
          {verticalZones.map((v) => (
            <span key={`left-${v}`}>{v}</span>
          ))}
        </div>

        {/* Content Viewport */}
        <div className="sm:px-6 flex-1 flex flex-col">{children}</div>

        {/* Right Vertical Zone Markers (A-D) */}
        <div className="hidden sm:flex flex-col justify-between absolute right-0 top-6 bottom-6 text-[8px] font-mono text-blueprint-dimension/40 select-none">
          {verticalZones.map((v) => (
            <span key={`right-${v}`}>{v}</span>
          ))}
        </div>
      </div>

      {/* Bottom Zone Identifiers (1-8) */}
      <div className="hidden sm:flex justify-between px-6 pt-2 pb-4 text-[8px] font-mono text-blueprint-dimension/40 border-t border-[rgba(127,178,255,0.15)] select-none">
        {horizontalZones.map((z) => (
          <span key={`bottom-${z}`}>{z}</span>
        ))}
      </div>

      {/* Integrated ASME/ISO Title Block */}
      {showTitleBlock && (
        <div className="mt-4 pt-4 border-t border-[rgba(127,178,255,0.25)]">
          <TitleBlock
            drawingTitle={drawingTitle}
            drawingNumber={drawingNumber}
            sheetNumber={sheetNumber}
            totalSheets={totalSheets}
            scale={scale}
            revision={revision}
          />
        </div>
      )}
    </div>
  );
}
