"use client";

import { useId, useMemo } from "react";

export interface IdeaToProductGraphicProps {
  progress: number; // 0.0 to 1.0 scrub progress
  className?: string;
}

// Calibrated Isometric Projection Constants:
// ViewBox: 0 0 760 480
// Center: X0 = 360, Y0 = 300
// Yields bounding box: X in [140, 580], Y in [20, 440]
const X0 = 360;
const Y0 = 300;
const COS30 = Math.cos(Math.PI / 6); // ~0.866
const SIN30 = Math.sin(Math.PI / 6); // 0.5

function pt(x: number, y: number, z: number): [number, number] {
  const px = X0 + (x - z) * COS30;
  const py = Y0 - y + (x + z) * SIN30;
  return [Number(px.toFixed(1)), Number(py.toFixed(1))];
}

function polyStr(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

export function IdeaToProductGraphic({
  progress = 0,
  className = "",
}: IdeaToProductGraphicProps) {
  const filterId = useId();
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // State Opacity Transitions
  // State 1: 0.00 to 0.35 (Rough Sketch) -> fades out 0.35 to 0.45
  const sketchOpacity =
    clampedProgress < 0.35
      ? 1
      : clampedProgress < 0.45
      ? 1 - (clampedProgress - 0.35) / 0.1
      : 0;

  const sketchDraw = Math.min(1, clampedProgress / 0.3);

  // State 2: 0.35 to 0.65 (Clean black line drawing + dimension lines)
  const cleanLineOpacity =
    clampedProgress < 0.35
      ? 0
      : clampedProgress < 0.45
      ? (clampedProgress - 0.35) / 0.1
      : 1;

  const dimensionOpacity =
    clampedProgress < 0.42
      ? 0
      : clampedProgress < 0.55
      ? (clampedProgress - 0.42) / 0.13
      : clampedProgress < 0.85
      ? 1
      : Math.max(0.4, 1 - (clampedProgress - 0.85) / 0.15);

  // State 3: 0.65 to 1.00 (Tonal Royal Shading & Copper Accents)
  const fillOpacity =
    clampedProgress < 0.65
      ? 0
      : Math.min(1, (clampedProgress - 0.65) / 0.25);

  const copperOpacity =
    clampedProgress < 0.75
      ? 0
      : Math.min(1, (clampedProgress - 0.75) / 0.2);

  // Structural Isometric Geometry matching M1AirHandlingUnit
  const geom = useMemo(() => {
    // 0. Base Contact Shadow
    const shadow = polyStr([
      pt(-200, -20, -68),
      pt(200, -20, -68),
      pt(200, -20, 68),
      pt(-200, -20, 68),
    ]);

    // 1. Skid Frame (ISMC C-Channels)
    const skidTop = polyStr([
      pt(-190, 0, -60),
      pt(190, 0, -60),
      pt(190, 0, 60),
      pt(-190, 0, 60),
    ]);
    const skidFront = polyStr([
      pt(-190, -18, 60),
      pt(190, -18, 60),
      pt(190, 0, 60),
      pt(-190, 0, 60),
    ]);
    const skidSide = polyStr([
      pt(190, -18, 60),
      pt(190, -18, -60),
      pt(190, 0, -60),
      pt(190, 0, 60),
    ]);

    // 2. Module 1: Filter Bank (Intake)
    const m1Top = polyStr([
      pt(-180, 150, -60),
      pt(-65, 150, -60),
      pt(-65, 150, 60),
      pt(-180, 150, 60),
    ]);
    const m1Front = polyStr([
      pt(-180, 0, 60),
      pt(-65, 0, 60),
      pt(-65, 150, 60),
      pt(-180, 150, 60),
    ]);
    const m1Door = polyStr([
      pt(-165, 15, 61),
      pt(-80, 15, 61),
      pt(-80, 135, 61),
      pt(-165, 135, 61),
    ]);

    // 3. Module 2: Cooling Coil (Center)
    const m2Top = polyStr([
      pt(-60, 150, -60),
      pt(55, 150, -60),
      pt(55, 150, 60),
      pt(-60, 150, 60),
    ]);
    const m2Front = polyStr([
      pt(-60, 0, 60),
      pt(55, 0, 60),
      pt(55, 150, 60),
      pt(-60, 150, 60),
    ]);
    const m2Door = polyStr([
      pt(-45, 15, 61),
      pt(40, 15, 61),
      pt(40, 135, 61),
      pt(-45, 135, 61),
    ]);

    // 4. Module 3: Fan & Blower (Discharge)
    const m3Top = polyStr([
      pt(60, 150, -60),
      pt(180, 150, -60),
      pt(180, 150, 60),
      pt(60, 150, 60),
    ]);
    const m3Front = polyStr([
      pt(60, 0, 60),
      pt(180, 0, 60),
      pt(180, 150, 60),
      pt(60, 150, 60),
    ]);
    const m3Side = polyStr([
      pt(180, 0, 60),
      pt(180, 0, -60),
      pt(180, 150, -60),
      pt(180, 150, 60),
    ]);

    // 5. Discharge Collar on Module 3
    const collarTop = polyStr([
      pt(85, 175, -35),
      pt(155, 175, -35),
      pt(155, 175, 35),
      pt(85, 175, 35),
    ]);
    const collarFront = polyStr([
      pt(85, 150, 35),
      pt(155, 150, 35),
      pt(155, 175, 35),
      pt(85, 175, 35),
    ]);
    const collarSide = polyStr([
      pt(155, 150, 35),
      pt(155, 150, -35),
      pt(155, 175, -35),
      pt(155, 175, 35),
    ]);

    // 6. Copper Handles & Pipe Manifolds
    const h1 = pt(-90, 75, 62);
    const h2 = pt(30, 75, 62);
    const h3 = pt(75, 75, 62);

    // Pipe manifold headers on Module 2 front
    const pipe1Top = pt(-5, 120, 63);
    const pipe1Bot = pt(-5, 30, 63);
    const pipe2Top = pt(15, 120, 63);
    const pipe2Bot = pt(15, 30, 63);

    // 7. Dimension Reference Points (calibrated for zero clipping)
    const dTopStart = pt(-180, 150, -60);
    const dTopEnd = pt(180, 150, -60);
    const dSideStart = pt(180, 0, -60);
    const dSideEnd = pt(180, 150, -60);

    // Inspection circle on Module 3 front
    const fanCenter = pt(120, 75, 61);

    return {
      shadow,
      skidTop,
      skidFront,
      skidSide,
      m1Top,
      m1Front,
      m1Door,
      m2Top,
      m2Front,
      m2Door,
      m3Top,
      m3Front,
      m3Side,
      collarTop,
      collarFront,
      collarSide,
      h1,
      h2,
      h3,
      pipe1Top,
      pipe1Bot,
      pipe2Top,
      pipe2Bot,
      dTopStart,
      dTopEnd,
      dSideStart,
      dSideEnd,
      fanCenter,
    };
  }, []);

  return (
    <div className={`relative w-full aspect-[16/10] max-w-[620px] select-none mx-auto ${className}`}>
      <svg
        viewBox="0 0 760 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-hidden"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle Hand-Drawn Wobble Noise Filter */}
          <filter id={`sketch-wobble-${filterId}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* -----------------------------------------------------------
            STAGE 3: TONAL FACET FILLS (Fades in p: 0.65 -> 1.00)
            Top: #DCE3FC | Long Front: #B9C6FA | End Side: #8FA3F5
            ----------------------------------------------------------- */}
        {fillOpacity > 0 && (
          <g opacity={fillOpacity} style={{ willChange: "opacity" }}>
            {/* Flat Contact Shadow */}
            <polygon points={geom.shadow} fill="#050505" opacity="0.09" />

            {/* Skid Base */}
            <polygon points={geom.skidTop} fill="#DCE3FC" />
            <polygon points={geom.skidFront} fill="#8FA3F5" />
            <polygon points={geom.skidSide} fill="#8FA3F5" />

            {/* Top Faces (#DCE3FC) */}
            <polygon points={geom.m1Top} fill="#DCE3FC" />
            <polygon points={geom.m2Top} fill="#DCE3FC" />
            <polygon points={geom.m3Top} fill="#DCE3FC" />
            <polygon points={geom.collarTop} fill="#DCE3FC" />

            {/* Front Long Faces (#B9C6FA) */}
            <polygon points={geom.m1Front} fill="#B9C6FA" />
            <polygon points={geom.m2Front} fill="#B9C6FA" />
            <polygon points={geom.m3Front} fill="#B9C6FA" />
            <polygon points={geom.collarFront} fill="#B9C6FA" />

            {/* End Side Faces (#8FA3F5) */}
            <polygon points={geom.m3Side} fill="#8FA3F5" />
            <polygon points={geom.collarSide} fill="#8FA3F5" />

            {/* Access Door Panels */}
            <polygon points={geom.m1Door} fill="#C6D2FC" stroke="#050505" strokeWidth="1" />
            <polygon points={geom.m2Door} fill="#C6D2FC" stroke="#050505" strokeWidth="1" />
          </g>
        )}

        {/* -----------------------------------------------------------
            STAGE 2: CLEAN BLACK DRAFTING LINES (Draws on p: 0.35 -> 0.65)
            ----------------------------------------------------------- */}
        {cleanLineOpacity > 0 && (
          <g
            opacity={cleanLineOpacity}
            stroke="#050505"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ willChange: "opacity" }}
          >
            {/* Skid Outline */}
            <polygon points={geom.skidFront} />
            <polygon points={geom.skidSide} />

            {/* Module Outlines */}
            <polygon points={geom.m1Top} />
            <polygon points={geom.m1Front} />
            <polygon points={geom.m1Door} strokeWidth="1.2" />

            <polygon points={geom.m2Top} />
            <polygon points={geom.m2Front} />
            <polygon points={geom.m2Door} strokeWidth="1.2" />

            <polygon points={geom.m3Top} />
            <polygon points={geom.m3Front} />
            <polygon points={geom.m3Side} />

            <polygon points={geom.collarTop} />
            <polygon points={geom.collarFront} />
            <polygon points={geom.collarSide} />

            {/* Circular Fan Viewport on Module 3 */}
            <ellipse
              cx={geom.fanCenter[0]}
              cy={geom.fanCenter[1]}
              rx="24"
              ry="14"
              stroke="#050505"
              strokeWidth="1.2"
              fill={fillOpacity > 0 ? "#C6D2FC" : "none"}
            />

            {/* Vertical Module Seams */}
            <line
              x1={geom.m1Front.split(" ")[1].split(",")[0]}
              y1={geom.m1Front.split(" ")[1].split(",")[1]}
              x2={geom.m1Front.split(" ")[2].split(",")[0]}
              y2={geom.m1Front.split(" ")[2].split(",")[1]}
              stroke="#050505"
              strokeWidth="1.8"
            />
            <line
              x1={geom.m2Front.split(" ")[1].split(",")[0]}
              y1={geom.m2Front.split(" ")[1].split(",")[1]}
              x2={geom.m2Front.split(" ")[2].split(",")[0]}
              y2={geom.m2Front.split(" ")[2].split(",")[1]}
              stroke="#050505"
              strokeWidth="1.8"
            />
          </g>
        )}

        {/* -----------------------------------------------------------
            STAGE 2 & 3: ROYAL CAD DIMENSION LINES (#2347E0, NO NUMBERS)
            Calibrated with generous clearance from quote text
            ----------------------------------------------------------- */}
        {dimensionOpacity > 0 && (
          <g
            opacity={dimensionOpacity}
            stroke="#2347E0"
            strokeWidth="1.2"
            style={{ willChange: "opacity" }}
          >
            {/* Top Length Dimension Line */}
            <line
              x1={geom.dTopStart[0]}
              y1={geom.dTopStart[1]}
              x2={geom.dTopStart[0]}
              y2={geom.dTopStart[1] - 32}
              strokeDasharray="2 3"
            />
            <line
              x1={geom.dTopEnd[0]}
              y1={geom.dTopEnd[1]}
              x2={geom.dTopEnd[0]}
              y2={geom.dTopEnd[1] - 32}
              strokeDasharray="2 3"
            />
            {/* Dimension Span Line along isometric angle */}
            <line
              x1={geom.dTopStart[0]}
              y1={geom.dTopStart[1] - 26}
              x2={geom.dTopEnd[0]}
              y2={geom.dTopEnd[1] - 26}
              strokeWidth="1.3"
            />
            {/* 45-degree architectural slash ticks */}
            <line
              x1={geom.dTopStart[0] - 3.5}
              y1={geom.dTopStart[1] - 22.5}
              x2={geom.dTopStart[0] + 3.5}
              y2={geom.dTopStart[1] - 29.5}
              strokeWidth="1.8"
            />
            <line
              x1={geom.dTopEnd[0] - 3.5}
              y1={geom.dTopEnd[1] - 22.5}
              x2={geom.dTopEnd[0] + 3.5}
              y2={geom.dTopEnd[1] - 29.5}
              strokeWidth="1.8"
            />

            {/* Height Dimension Line (Right Side) */}
            <line
              x1={geom.dSideStart[0]}
              y1={geom.dSideStart[1]}
              x2={geom.dSideStart[0] + 32}
              y2={geom.dSideStart[1]}
              strokeDasharray="2 3"
            />
            <line
              x1={geom.dSideEnd[0]}
              y1={geom.dSideEnd[1]}
              x2={geom.dSideEnd[0] + 32}
              y2={geom.dSideEnd[1]}
              strokeDasharray="2 3"
            />
            <line
              x1={geom.dSideStart[0] + 26}
              y1={geom.dSideStart[1]}
              x2={geom.dSideEnd[0] + 26}
              y2={geom.dSideEnd[1]}
              strokeWidth="1.3"
            />
            <line
              x1={geom.dSideStart[0] + 22.5}
              y1={geom.dSideStart[1] + 3.5}
              x2={geom.dSideStart[0] + 29.5}
              y2={geom.dSideStart[1] - 3.5}
              strokeWidth="1.8"
            />
            <line
              x1={geom.dSideEnd[0] + 22.5}
              y1={geom.dSideEnd[1] + 3.5}
              x2={geom.dSideEnd[0] + 29.5}
              y2={geom.dSideEnd[1] - 3.5}
              strokeWidth="1.8"
            />
          </g>
        )}

        {/* -----------------------------------------------------------
            STAGE 3: COPPER DETAILS (#F0A06A) (Handles & Manifold Pipes)
            ----------------------------------------------------------- */}
        {copperOpacity > 0 && (
          <g opacity={copperOpacity} style={{ willChange: "opacity" }}>
            {/* Door Handles */}
            <rect
              x={geom.h1[0] - 3}
              y={geom.h1[1] - 12}
              width="6"
              height="24"
              rx="1.5"
              fill="#F0A06A"
              stroke="#050505"
              strokeWidth="0.8"
            />
            <rect
              x={geom.h2[0] - 3}
              y={geom.h2[1] - 12}
              width="6"
              height="24"
              rx="1.5"
              fill="#F0A06A"
              stroke="#050505"
              strokeWidth="0.8"
            />
            <rect
              x={geom.h3[0] - 3}
              y={geom.h3[1] - 12}
              width="6"
              height="24"
              rx="1.5"
              fill="#F0A06A"
              stroke="#050505"
              strokeWidth="0.8"
            />

            {/* Copper Pipe Manifolds on Module 2 Front */}
            <line
              x1={geom.pipe1Top[0]}
              y1={geom.pipe1Top[1]}
              x2={geom.pipe1Bot[0]}
              y2={geom.pipe1Bot[1]}
              stroke="#F0A06A"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <line
              x1={geom.pipe2Top[0]}
              y1={geom.pipe2Top[1]}
              x2={geom.pipe2Bot[0]}
              y2={geom.pipe2Bot[1]}
              stroke="#F0A06A"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* -----------------------------------------------------------
            STAGE 1: ROUGH HAND-DRAWN SKETCH (p: 0.00 -> 0.35)
            ----------------------------------------------------------- */}
        {sketchOpacity > 0 && (
          <g
            opacity={sketchOpacity}
            filter={`url(#sketch-wobble-${filterId})`}
            style={{ willChange: "opacity" }}
          >
            {/* Primary Hand-Drawn Stroke (Royal #2347E0) */}
            <g
              stroke="#2347E0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1400"
              strokeDashoffset={1400 * (1 - sketchDraw)}
            >
              <polygon points={geom.skidFront} />
              <polygon points={geom.m1Top} />
              <polygon points={geom.m1Front} />
              <polygon points={geom.m2Top} />
              <polygon points={geom.m2Front} />
              <polygon points={geom.m3Top} />
              <polygon points={geom.m3Front} />
              <polygon points={geom.m3Side} />
              <polygon points={geom.collarFront} />
              <polygon points={geom.collarTop} />
            </g>

            {/* Double Stroke (Architectural draft pencil lines) */}
            <g
              stroke="#2347E0"
              strokeWidth="1.2"
              opacity="0.65"
              transform="translate(1.5, -1)"
              strokeDasharray="1400"
              strokeDashoffset={1400 * (1 - sketchDraw)}
            >
              <polygon points={geom.m1Front} />
              <polygon points={geom.m2Front} />
              <polygon points={geom.m3Front} />
              <polygon points={geom.skidFront} />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
