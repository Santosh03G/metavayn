import React, { type HTMLAttributes } from "react";
import { Container } from "./Container";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  theme?: "dark" | "light";
  sectionCutLabel?: string;
  sheetRef?: string;
  grid?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Section({
  theme = "dark",
  sectionCutLabel,
  sheetRef,
  grid = true,
  className = "",
  children,
  ...props
}: SectionProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={`relative py-16 sm:py-24 border-b border-[rgba(127,178,255,0.2)] ${
        isDark
          ? `bg-blueprint-deep text-blueprint-linen ${grid ? "bg-cad-grid" : ""}`
          : `bg-blueprint-linen text-blueprint-graphite ${grid ? "bg-cad-grid-light" : ""}`
      } ${className}`}
      {...props}
    >
      {/* Section Cut Header Marker */}
      {(sectionCutLabel || sheetRef) && (
        <Container className="mb-8">
          <div className="flex items-center justify-between border-b pb-2 font-mono text-mono-xs tracking-wider uppercase select-none opacity-80 border-current/20">
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
