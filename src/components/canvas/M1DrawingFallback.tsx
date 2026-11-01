import { type SurfaceType } from "@/components/ui/Button";

interface M1DrawingFallbackProps {
  surface?: SurfaceType;
  exploded?: boolean;
}

export function M1DrawingFallback({
  surface = "royal",
  exploded = false,
}: M1DrawingFallbackProps) {
  const isRoyal = surface === "royal";
  const isBlack = surface === "black";

  const strokeColor = isRoyal ? "#F1EEE6" : isBlack ? "#9DB2FF" : "#050505";
  const accentColor = "#F0A06A";

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-6 select-none bg-transparent"
      role="img"
      aria-label="M1 Air Handling Unit Technical Drawing Blueprint"
    >
      <svg
        className="w-full h-64 max-w-md"
        viewBox="0 0 460 340"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.2"
      >
        {/* Base Skid Channel */}
        <rect x="50" y="270" width="360" height="24" stroke={strokeColor} />
        <line x1="140" y1="270" x2="140" y2="294" strokeDasharray="3,3" />
        <line x1="230" y1="270" x2="230" y2="294" strokeDasharray="3,3" />
        <line x1="320" y1="270" x2="320" y2="294" strokeDasharray="3,3" />

        {/* Section 1: Filter / Intake */}
        <g transform={exploded ? "translate(-20, 0)" : "translate(0, 0)"}>
          <rect x="60" y="70" width="100" height="195" stroke={strokeColor} />
          {/* Louvers */}
          <line x1="70" y1="95" x2="105" y2="95" />
          <line x1="70" y1="115" x2="105" y2="115" />
          <line x1="70" y1="135" x2="105" y2="135" />
          <line x1="70" y1="155" x2="105" y2="155" />
          {/* Filter Media Accordion */}
          <polyline
            points="120,85 130,95 120,105 130,115 120,125 130,135 120,145 130,155 120,165"
            stroke={strokeColor}
            strokeDasharray="2,2"
          />
        </g>

        {/* Section 2: Chilled Water Coil */}
        <g transform={exploded ? "translate(0, 0)" : "translate(0, 0)"}>
          <rect x="165" y="70" width="120" height="195" stroke={strokeColor} />
          {/* Coil Fin Bundle */}
          <line x1="180" y1="90" x2="230" y2="90" strokeDasharray="2,2" />
          <line x1="180" y1="110" x2="230" y2="110" strokeDasharray="2,2" />
          <line x1="180" y1="130" x2="230" y2="130" strokeDasharray="2,2" />
          <line x1="180" y1="150" x2="230" y2="150" strokeDasharray="2,2" />
          {/* Copper Header Manifold: --copper */}
          <circle cx="260" cy="110" r="10" stroke={accentColor} strokeWidth="1.6" />
          <circle cx="260" cy="150" r="10" stroke={accentColor} strokeWidth="1.6" />
          <line x1="260" y1="80" x2="260" y2="180" stroke={accentColor} strokeWidth="1.6" />
        </g>

        {/* Section 3: Centrifugal Fan */}
        <g transform={exploded ? "translate(20, 0)" : "translate(0, 0)"}>
          <rect x="290" y="70" width="115" height="195" stroke={strokeColor} />
          {/* Scroll Housing */}
          <circle cx="345" cy="170" r="45" stroke={strokeColor} />
          <circle cx="345" cy="170" r="20" stroke={strokeColor} strokeDasharray="2,2" />
          {/* Discharge Outlet */}
          <rect x="325" y="45" width="45" height="25" stroke={strokeColor} />
        </g>

        {/* Dimension Callouts: font-mono text */}
        <g stroke={strokeColor} fontSize="9" fontFamily="monospace" fill={strokeColor}>
          {/* Top Width: 2400 mm */}
          <line x1="50" y1="30" x2="410" y2="30" />
          <line x1="50" y1="25" x2="50" y2="45" />
          <line x1="410" y1="25" x2="410" y2="45" />
          <text x="230" y="24" fill={strokeColor} textAnchor="middle">
            L: 2400.00 mm
          </text>

          {/* Left Height: 1800 mm */}
          <line x1="35" y1="60" x2="35" y2="304" />
          <line x1="30" y1="60" x2="55" y2="60" />
          <line x1="30" y1="304" x2="55" y2="304" />
          <text x="28" y="185" fill={strokeColor} fontSize="10" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 28,185)">
            H: 1800.00 mm
          </text>
        </g>

        {/* Callout Annotation */}
        <g fontFamily="monospace" fontSize="9" fill={strokeColor}>
          <text x="75" y="330">SUBASSEMBLY: M1 AIR HANDLING UNIT</text>
          <text x="350" y="330">SCALE: 1:20</text>
        </g>
      </svg>
    </div>
  );
}