import { ReactNode } from "react";
import { type SurfaceType } from "@/components/ui/Button";

interface SectionCutProps {
  id?: string;
  surface?: SurfaceType;
  theme?: "dark" | "light";
  sectionLabel?: string;
  sheetCode?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCut({
  id,
  surface,
  theme,
  sectionLabel,
  sheetCode,
  children,
  className = "",
}: SectionCutProps) {
  const effectiveSurface: SurfaceType =
    surface || (theme === "light" ? "paper" : "black");

  const surfaceClasses: Record<SurfaceType, { section: string; border: string; text: string }> = {
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
      id={id}
      className={`relative py-16 sm:py-24 ${currentConfig.section} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}