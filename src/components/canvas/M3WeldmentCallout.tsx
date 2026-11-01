import { type SurfaceType } from "@/components/ui/Button";

interface M3WeldmentCalloutProps {
  surface?: SurfaceType;
  className?: string;
}

export function M3WeldmentCallout({
  surface = "royal",
  className = "",
}: M3WeldmentCalloutProps) {
  const isRoyal = surface === "royal";
  const isBlack = surface === "black";

  // Surface-dependent token mapping
  const containerClass = isRoyal
    ? "border-paper/30 bg-royal/90 text-paper"
    : isBlack
    ? "border-pale-blue/30 bg-black text-paper"
    : "border-paper-line bg-paper text-black";

  const dividerClass = isRoyal
    ? "border-paper/20"
    : isBlack
    ? "border-pale-blue/20"
    : "border-paper-line";

  const strokeColor = isRoyal ? "#F1EEE6" : isBlack ? "#9DB2FF" : "#050505";
  const plateFill = isRoyal
    ? "rgba(241, 238, 230, 0.15)"
    : isBlack
    ? "rgba(157, 178, 255, 0.15)"
    : "rgba(5, 5, 5, 0.05)";

  const labelClass = isRoyal
    ? "text-paper/80"
    : isBlack
    ? "text-pale-blue"
    : "text-black/70";

  const headingTextClass = isRoyal
    ? "text-paper font-semibold"
    : isBlack
    ? "text-pale-blue font-semibold"
    : "text-black font-semibold";

  return (
    <div
      className={`border p-4 font-mono text-xs select-none ${containerClass} ${className}`}
    >
      <div className={`flex items-center justify-between border-b pb-1.5 mb-3 ${dividerClass}`}>
        <span className={`text-[10px] uppercase tracking-wider font-semibold ${labelClass}`}>
          WELDMENT CALLOUT SYMBOLOGY
        </span>
        <span className={`text-[9px] ${labelClass}`}>
          JOINT REF: W-04 • ISMC 100
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Weld Leader Line SVG */}
        <svg
          className="w-48 h-20"
          viewBox="0 0 190 80"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.2"
        >
          {/* Joint Cross Section (Two Steel Plates) */}
          <rect x="15" y="45" width="40" height="25" fill={plateFill} stroke={strokeColor} />
          <rect x="40" y="15" width="20" height="30" fill={plateFill} stroke={strokeColor} />
          {/* Fillet Weld Throat Triangle: --copper accent */}
          <polygon points="60,45 60,35 70,45" fill="#F0A06A" stroke="#F0A06A" />

          {/* Leader Arrow Line */}
          <line x1="62" y1="42" x2="95" y2="25" stroke={strokeColor} />
          <polygon points="60,43 66,40 64,45" fill={strokeColor} />

          {/* Reference Line */}
          <line x1="95" y1="25" x2="165" y2="25" stroke={strokeColor} />
          {/* Identification Dashed Line */}
          <line x1="95" y1="30" x2="165" y2="30" stroke={strokeColor} strokeDasharray="3,3" opacity="0.6" />

          {/* Weld Symbol: Fillet Triangle on reference line */}
          <polygon points="120,25 130,25 120,15" fill={strokeColor} stroke={strokeColor} />
          {/* Throat Dimension */}
          <text x="105" y="20" fill={strokeColor} fontSize="9" fontFamily="monospace">
            a5
          </text>
          {/* Length & Pitch */}
          <text x="135" y="20" fill={strokeColor} fontSize="9" fontFamily="monospace">
            50(100)
          </text>
          {/* Weld Tail Specification */}
          <polyline points="165,15 175,25 165,35" stroke={strokeColor} />
          <text x="150" y="50" fill={strokeColor} fontSize="8" fontFamily="monospace">
            GMAW
          </text>
        </svg>

        {/* Technical Callout Text */}
        <div className="space-y-1 text-[11px]">
          <div className={headingTextClass}>
            CONTINUOUS FILLET WELD (THROAT a=5mm)
          </div>
          <div className={labelClass}>
            All joints modeled for structural fabrication and production drawing release.
          </div>
        </div>
      </div>
    </div>
  );
}