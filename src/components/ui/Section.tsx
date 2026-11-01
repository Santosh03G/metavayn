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
    { section: string; border: string; text: string }
  > = {
    royal: {
      section: "bg-royal text-paper border-b border-paper/30",
      border: "border-paper/20",
      text: "text-paper/80",
    },
    black: {
      section: "bg-black text-paper border-b border-pale-blue/20",
      border: "border-pale-blue/20",
      text: "text-pale-blue",
    },
    paper: {
      section: "bg-paper text-black border-b border-paper-line",
      border: "border-paper-line",
      text: "text-black/70",
    },
  };

  const currentConfig = surfaceClasses[effectiveSurface];

  return (
    <section
      className={`relative py-16 sm:py-24 ${currentConfig.section} ${className}`}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}