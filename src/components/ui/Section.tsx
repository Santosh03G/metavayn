import React, { type HTMLAttributes } from "react";
import { Container } from "./Container";
import { type SurfaceType } from "./Button";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  surface?: SurfaceType;
  theme?: "dark" | "light"; // backwards-compat mapping
  sectionCutLabel?: string;
  sheetRef?: string;
  className?: string;
  children: React.ReactNode;
}

export function Section({
  surface,
  theme,
  sectionCutLabel,
  sheetRef,
  className = "",
  children,
  ...props
}: SectionProps) {
  // Resolve surface
  const effectiveSurface: SurfaceType =
    surface || (theme === "light" ? "paper" : "black");

  const surfaceClasses: Record<
    SurfaceType,
    { section: string; markerBorder: string; markerText: string }
  > = {
    royal: {
      section: "bg-royal text-paper border-b border-paper/30",
      markerBorder: "border-paper/20",
      markerText: "text-paper/80",
    },
    black: {
      section: "bg-black text-paper border-b border-pale-blue/20",
      markerBorder: "border-pale-blue/20",
      markerText: "text-pale-blue",
    },
    paper: {
      section: "bg-paper text-black border-b border-paper-line",
      markerBorder: "border-paper-line",
      markerText: "text-black/70",
    },
  };

  const currentConfig = surfaceClasses[effectiveSurface];

  return (
    <section
      className={`relative py-16 sm:py-24 ${currentConfig.section} ${className}`}
      {...props}
    >
      {/* Section Cut Header Marker */}
      {(sectionCutLabel || sheetRef) && (
        <Container className="mb-8">
          <div
            className={`flex items-center justify-between border-b pb-2 font-mono text-mono-xs tracking-wider uppercase select-none ${currentConfig.markerBorder} ${currentConfig.markerText}`}
          >
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 border border-current" />
              <span>{sectionCutLabel || "SECTION CUT"}</span>
            </div>
            {sheetRef && <span>DWG REF: {sheetRef}</span>}
          </div>
        </Container>
      )}

      <Container>{children}</Container>
    </section>
  );
}
