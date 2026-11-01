interface M3WeldmentCalloutProps {
  className?: string;
}

export function M3WeldmentCallout({ className = "" }: M3WeldmentCalloutProps) {
  return (
    <div
      className={`border border-[rgba(127,178,255,0.25)] bg-blueprint-deep p-4 font-mono text-xs select-none ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[rgba(127,178,255,0.15)] pb-1.5 mb-3">
        <span className="text-[10px] text-blueprint-dimension uppercase tracking-wider font-semibold">
          WELDMENT SYMBOLOGY (ISO 2553 / AWS D1.1)
        </span>
        <span className="text-[9px] text-blueprint-dimension/60">
          JOINT REF: W-04 • ISMC 100
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* ISO 2553 Weld Leader Line SVG */}
        <svg
          className="w-48 h-20 text-blueprint-dimension"
          viewBox="0 0 190 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* Joint Cross Section (Two Steel Plates) */}
          <rect x="15" y="45" width="40" height="25" fill="#0D2B52" stroke="#7FB2FF" />
          <rect x="40" y="15" width="20" height="30" fill="#0D2B52" stroke="#7FB2FF" />
          {/* Fillet Weld Throat Triangle */}
          <polygon points="60,45 60,35 70,45" fill="#2F7BFF" stroke="#2F7BFF" />

          {/* Leader Arrow Line */}
          <line x1="62" y1="42" x2="95" y2="25" stroke="#7FB2FF" />
          <polygon points="60,43 66,40 64,45" fill="#7FB2FF" />

          {/* Reference Line */}
          <line x1="95" y1="25" x2="165" y2="25" stroke="#7FB2FF" />
          {/* Identification Dashed Line (ISO Standard) */}
          <line x1="95" y1="30" x2="165" y2="30" stroke="#7FB2FF" strokeDasharray="3,3" opacity="0.6" />

          {/* Weld Symbol: Fillet Triangle on reference line */}
          <polygon points="120,25 130,25 120,15" fill="#7FB2FF" stroke="#7FB2FF" />
          {/* Throat Dimension */}
          <text x="105" y="20" fill="#7FB2FF" fontSize="9" fontFamily="monospace">
            a5
          </text>
          {/* Length & Pitch */}
          <text x="135" y="20" fill="#7FB2FF" fontSize="9" fontFamily="monospace">
            50(100)
          </text>
          {/* Weld Tail Specification */}
          <polyline points="165,15 175,25 165,35" stroke="#7FB2FF" />
          <text x="150" y="50" fill="#7FB2FF" fontSize="8" fontFamily="monospace">
            GMAW-135
          </text>
        </svg>

        {/* Technical Callout Text */}
        <div className="space-y-1 text-[11px] text-blueprint-linen/80">
          <div className="font-semibold text-blueprint-signal">
            CONTINUOUS FILLET WELD (THROAT a=5mm)
          </div>
          <div className="text-[10px] text-blueprint-dimension/70">
            Process: Gas Metal Arc Welding (GMAW 135)
          </div>
          <div className="text-[10px] text-blueprint-dimension/70">
            Inspection: 100% Visual (VT) + Magnetic Particle (MT)
          </div>
        </div>
      </div>
    </div>
  );
}
