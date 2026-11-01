import { type SurfaceType } from "@/components/ui/Button";

interface M1DrawingFallbackProps {
  surface?: SurfaceType;
  className?: string;
  exploded?: boolean;
}

export function M1DrawingFallback({
  surface = "royal",
  className = "",
  exploded = false,
}: M1DrawingFallbackProps) {
  const isRoyal = surface === "royal";
  const isBlack = surface === "black";

  // Tokens: --paper on royal, --pale-blue on black, --black on paper
  const strokeColor = isRoyal ? "#F1EEE6" : isBlack ? "#9DB2FF" : "#050505";
  const accentColor = isRoyal || isBlack ? "#F0A06A" : "#2347E0";

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-4 bg-transparent select-none ${className}`}
      role="img"
      aria-label="Orthographic Engineering Blueprint of M1 Air Handling Unit"
    >
      <svg
        className="w-full h-full max-h-[360px] max-w-[500px]"
        viewBox="0 0 500 360"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.2"
      >
        {/* Outer Casing / Enclosure Lines */}
        <rect x="70" y="60" width="360" height="220" stroke={strokeColor} strokeWidth="1.5" />
        <rect x="75" y="65" width="350" height="210" stroke={strokeColor} strokeDasharray="3,3" opacity="0.4" />

        {/* Structural Base Skid Frame (ISMC Channels) */}
        <rect x="60" y="280" width="380" height="24" stroke={strokeColor} strokeWidth="1.8" />
        <line x1="120" y1="280" x2="120" y2="304" stroke={strokeColor} />
        <line x1="250" y1="280" x2="250" y2="304" stroke={strokeColor} />
        <line x1="380" y1="280" x2="380" y2="304" stroke={strokeColor} />

        {/* Section 1: Damper & Intake Louvers (Left) */}
        <line x1="150" y1="60" x2="150" y2="280" stroke={strokeColor} strokeDasharray="4,4" opacity="0.5" />
        <g opacity="0.8">
          <line x1="80" y1="90" x2="140" y2="90" stroke={strokeColor} />
          <line x1="80" y1="120" x2="140" y2="120" stroke={strokeColor} />
          <line x1="80" y1="150" x2="140" y2="150" stroke={strokeColor} />
          <line x1="80" y1="180" x2="140" y2="180" stroke={strokeColor} />
          <line x1="80" y1="210" x2="140" y2="210" stroke={strokeColor} />
          <line x1="80" y1="240" x2="140" y2="240" stroke={strokeColor} />
        </g>

        {/* Section 2: Chilled Water Heat Exchanger Coil Fins (Center) */}
        <line x1="260" y1="60" x2="260" y2="280" stroke={strokeColor} strokeDasharray="4,4" opacity="0.5" />
        <g stroke={strokeColor} opacity="0.6">
          <line x1="170" y1="80" x2="240" y2="80" strokeWidth="0.8" />
          <line x1="170" y1="100" x2="240" y2="100" strokeWidth="0.8" />
          <line x1="170" y1="120" x2="240" y2="120" strokeWidth="0.8" />
          <line x1="170" y1="140" x2="240" y2="140" strokeWidth="0.8" />
          <line x1="170" y1="160" x2="240" y2="160" strokeWidth="0.8" />
          <line x1="170" y1="180" x2="240" y2="180" strokeWidth="0.8" />
          <line x1="170" y1="200" x2="240" y2="200" strokeWidth="0.8" />
          <line x1="170" y1="220" x2="240" y2="220" strokeWidth="0.8" />
          <line x1="170" y1="240" x2="240" y2="240" strokeWidth="0.8" />
          <line x1="170" y1="260" x2="240" y2="260" strokeWidth="0.8" />
        </g>

        {/* Section 3: Centrifugal Fan Blower Housing & Wheel (Right) */}
        <circle cx="340" cy="170" r="50" stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="340" cy="170" r="24" stroke={strokeColor} strokeDasharray="2,2" />
        <circle cx="340" cy="170" r="6" stroke={accentColor} fill={accentColor} />
        {/* Fan Discharge Duct */}
        <rect x="360" y="100" width="50" height="50" stroke={strokeColor} strokeWidth="1.2" />

        {/* Dimension Leaders & Annotation Lines */}
        <g stroke={strokeColor} opacity="0.7" strokeWidth="0.8">
          {/* Top Overall Length: 2400 mm */}
          <line x1="70" y1="35" x2="430" y2="35" />
          <line x1="70" y1="30" x2="70" y2="55" />
          <line x1="430" y1="30" x2="430" y2="55" />
          <text x="250" y="30" fill={strokeColor} fontSize="10" fontFamily="monospace" textAnchor="middle">
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

        {/* ASME Callout Annotation */}
        <g fontFamily="monospace" fontSize="9" fill={strokeColor}>
          <text x="75" y="330">SUBASSEMBLY: M1 AIR HANDLING UNIT</text>
          <text x="350" y="330">SCALE: 1:20 (ISO 128)</text>
        </g>
      </svg>
    </div>
  );
}
