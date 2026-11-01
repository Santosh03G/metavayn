import React, { type ReactNode } from "react";
import { TitleBlock } from "@/components/drawing/TitleBlock";
import { type SurfaceType } from "@/components/ui/Button";

export interface DrawingSheetProps {
  surface?: SurfaceType;
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
  surface = "paper",
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
  const horizontalZones = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const verticalZones = ["A", "B", "C", "D"];

  const stylesBySurface: Record<
    SurfaceType,
    {
      container: string;
      zones: string;
      divider: string;
    }
  > = {
    royal: {
      container: "border border-paper/40 bg-royal/90 text-paper",
      zones: "text-paper/40",
      divider: "border-paper/20",
    },
    black: {
      container: "border border-pale-blue/30 bg-black text-paper",
      zones: "text-pale-blue/40",
      divider: "border-pale-blue/20",
    },
    paper: {
      container: "border border-paper-line bg-paper text-black",
      zones: "text-black/40",
      divider: "border-paper-line",
    },
  };

  const s = stylesBySurface[surface];

  return (
    <div
      className={`relative p-4 sm:p-6 lg:p-8 ${s.container} ${className}`}
      aria-label="Engineering Drawing Sheet Frame"
    >
      {/* Corner Registration Crosshairs */}
      <div className={`absolute top-1 left-1 font-mono text-[9px] ${s.zones} pointer-events-none`}>
        +
      </div>
      <div className={`absolute top-1 right-1 font-mono text-[9px] ${s.zones} pointer-events-none`}>
        +
      </div>
      <div className={`absolute bottom-1 left-1 font-mono text-[9px] ${s.zones} pointer-events-none`}>
        +
      </div>
      <div className={`absolute bottom-1 right-1 font-mono text-[9px] ${s.zones} pointer-events-none`}>
        +
      </div>

      {/* Top Zone Identifiers (1-8) */}
      <div className={`hidden sm:flex justify-between px-6 pb-2 text-[8px] font-mono ${s.zones} border-b ${s.divider} select-none`}>
        {horizontalZones.map((z) => (
          <span key={`top-${z}`}>{z}</span>
        ))}
      </div>

      {/* Main Drawing Working Area */}
      <div className="relative py-6 sm:py-8 min-h-[280px] flex flex-col justify-between">
        {/* Left Vertical Zone Markers (A-D) */}
        <div className={`hidden sm:flex flex-col justify-between absolute left-0 top-6 bottom-6 text-[8px] font-mono ${s.zones} select-none`}>
          {verticalZones.map((v) => (
            <span key={`left-${v}`}>{v}</span>
          ))}
        </div>

        {/* Content Viewport */}
        <div className="sm:px-6 flex-1 flex flex-col">{children}</div>

        {/* Right Vertical Zone Markers (A-D) */}
        <div className={`hidden sm:flex flex-col justify-between absolute right-0 top-6 bottom-6 text-[8px] font-mono ${s.zones} select-none`}>
          {verticalZones.map((v) => (
            <span key={`right-${v}`}>{v}</span>
          ))}
        </div>
      </div>

      {/* Bottom Zone Identifiers (1-8) */}
      <div className={`hidden sm:flex justify-between px-6 pt-2 pb-4 text-[8px] font-mono ${s.zones} border-t ${s.divider} select-none`}>
        {horizontalZones.map((z) => (
          <span key={`bottom-${z}`}>{z}</span>
        ))}
      </div>

      {/* Integrated ASME/ISO Title Block */}
      {showTitleBlock && (
        <div className={`mt-4 pt-4 border-t ${s.divider}`}>
          <TitleBlock
            surface={surface}
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
