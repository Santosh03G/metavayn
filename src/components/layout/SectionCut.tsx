import { ReactNode } from "react";

interface SectionCutProps {
  id?: string;
  theme?: "dark" | "light";
  sectionLabel?: string;
  sheetCode?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCut({
  id,
  theme = "dark",
  sectionLabel,
  sheetCode,
  children,
  className = "",
}: SectionCutProps) {
  const isDark = theme === "dark";

  return (
    <section
      id={id}
      className={`relative py-16 sm:py-24 border-b border-[rgba(127,178,255,0.2)] ${
        isDark
          ? "bg-blueprint-deep text-blueprint-linen bg-cad-grid"
          : "bg-blueprint-linen text-blueprint-graphite"
      } ${className}`}
    >
      {/* Section Cut Header Callout */}
      {(sectionLabel || sheetCode) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center justify-between border-b pb-2 font-mono text-[10px] tracking-wider uppercase select-none opacity-80 border-current/20">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full border border-current" />
              <span>{sectionLabel || "SECTION CUT"}</span>
            </div>
            {sheetCode && <span>DWG REF: {sheetCode}</span>}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
