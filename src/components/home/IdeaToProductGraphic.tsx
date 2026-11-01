"use client";

import { useId, useMemo } from "react";

export interface IdeaToProductGraphicProps {
  progress: number; // 0.0 to 1.0 scrub progress
  className?: string;
}

const X0 = 350;
const Y0 = 260;
const COS30 = Math.cos(Math.PI / 6); // 0.866
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
  // State 1: 0.00 to 0.35 (Sketch) -> fades out between 0.35 and 0.45
  const sketchOpacity =
    clampedProgress < 0.35
      ? 1
      : clampedProgress < 0.45
      ? 1 - (clampedProgress - 0.35) / 0.1
      : 0;

  // Sketch draw-on stroke offset factor (0 to 1 in 0.00 to 0.30)
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
      : Math.max(0.4, 1 - (clampedProgress - 0.85) / 0.15); // soft reference at end

  // State 3: 0.65 to 1.00 (Tonal Royal Shading & Copper Handles)
  const fillOpacity =
    clampedProgress < 0.65
      ? 0
      : Math.min(1, (clampedProgress - 0.65) / 0.25);

  const copperOpacity =
    clampedProgress < 0.75
      ? 0
      : Math.min(1, (clampedProgress - 0.75) / 0.2);

  // Geometries matching M1AirHandlingUnit
  const geom = useMemo(() => {
    // 1. Skid Frame
    const skidTop = polyStr([pt(-190, 0, -60), pt(190, 0, -60), pt(190, 0, 60), pt(-190, 0, 60)]);
    const skidFront = polyStr([pt(-190, -18, 60), pt(190, -18, 60), pt(190, 0, 60), pt(-190, 0, 60)]);
    const skidSide = polyStr([pt(190, -18, 60), pt(190, -18, -60), pt(190, 0, -60), pt(190, 0, 60)]);

    // 2. Module 1: Filter Bank
    const m1Top = polyStr([pt(-180, 150, -60), pt(-65, 150, -60), pt(-65, 150, 60), pt(-180, 150, 60)]);
    const m1Front = polyStr([pt(-180, 0, 60), pt(-65, 0, 60), pt(-65, 150, 60), pt(-180, 150, 60)]);
    const m1Door = polyStr([pt(-165, 15, 61), pt(-80, 15, 61), pt(-80, 135, 61), pt(-165, 135, 61)]);

    // 3. Module 2: Cooling Coil
    const m2Top = polyStr([pt(-60, 150, -60), pt(55, 150, -60), pt(55, 150, 60), pt(-60, 150, 60)]);
    const m2Front = polyStr([pt(-60, 0, 60), pt(55, 0, 60), pt(55, 150, 60), pt(-60, 150, 60)]);
    const m2Door = polyStr([pt(-45, 15, 61), pt(40, 15, 61), pt(40, 135, 61), pt(-45, 135, 61)]);

    // 4. Module 3: Fan & Blower
    const m3Top = polyStr([pt(60, 150, -60), pt(180, 150, -60), pt(180, 150, 60), pt(60, 150, 60)]);
    const m3Front = polyStr([pt(60, 0, 60), pt(180, 0, 60), pt(180, 150, 60), pt(60, 150, 60)]);
    const m3Side = polyStr([pt(180, 0, 60), pt(180, 0, -60), pt(180, 150, -60), pt(180, 150, 60)]);

    // 5. Discharge Collar
    const collarTop = polyStr([pt(85, 175, -35), pt(155, 175, -35), pt(155, 175, 35), pt(85, 175, 35)]);
    const collarFront = polyStr([pt(85, 150, 35), pt(155, 150, 35), pt(155, 175, 35), pt(85, 175, 35)]);
    const collarSide = polyStr([pt(155, 150, 35), pt(155, 150, -35), pt(155, 175, -35), pt(155, 175, 35)]);

    // 6. Handles (Copper)
    const h1 = pt(-90, 75, 62);
    const h2 = pt(30, 75, 62);
    const h3 = pt(75, 75, 62);

    // 7. Dimension Reference Points
    const dTopStart = pt(-180, 150, -60);
    const dTopEnd = pt(180, 150, -60);
    const dSideStart = pt(180, 0, -60);
    const dSideEnd = pt(180, 150, -60);

    return {
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
      dTopStart,
      dTopEnd,
      dSideStart,
      dSideEnd,
    };
  }, []);

  return (
    <div className={`relative w-full aspect-[16/11] max-w-[620px] select-none ${className}`}>
      <svg
        viewBox="0 0 700 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Rough Sketch wobble filter */}
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
              scale="3.2"
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

            {/* Inner Doors */}
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
            strokeWidth="1.6"
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
            <polygon points={geom.m1Door} strokeWidth="1.2" strokeDasharray="3 2" />

            <polygon points={geom.m2Top} />
            <polygon points={geom.m2Front} />
            <polygon points={geom.m2Door} strokeWidth="1.2" strokeDasharray="3 2" />

            <polygon points={geom.m3Top} />
            <polygon points={geom.m3Front} />
            <polygon points={geom.m3Side} />

            <polygon points={geom.collarTop} />
            <polygon points={geom.collarFront} />
            <polygon points={geom.collarSide} />

            {/* Vertical Module Seams */}
            <line x1={geom.m1Front.split(" ")[1].split(",")[0]} y1={geom.m1Front.split(" ")[1].split(",")[1]} x2={geom.m1Front.split(" ")[2].split(",")[0]} y2={geom.m1Front.split(" ")[2].split(",")[1]} stroke="#050505" strokeWidth="1.8" />
            <line x1={geom.m2Front.split(" ")[1].split(",")[0]} y1={geom.m2Front.split(" ")[1].split(",")[1]} x2={geom.m2Front.split(" ")[2].split(",")[0]} y2={geom.m2Front.split(" ")[2].split(",")[1]} stroke="#050505" strokeWidth="1.8" />
          </g>
        )}

        {/* -----------------------------------------------------------
            STAGE 2 WITNESS & DIMENSION LINES: ROYAL #2347E0 (NO NUMBERS)
            ----------------------------------------------------------- */}
        {dimensionOpacity > 0 && (
          <g
            opacity={dimensionOpacity}
            stroke="#2347E0"
            strokeWidth="1.2"
            style={{ willChange: "opacity" }}
          >
            {/* Top Length Dimension Line */}
            {/* Witness Projection Lines */}
            <line x1={geom.dTopStart[0]} y1={geom.dTopStart[1]} x2={geom.dTopStart[0]} y2={geom.dTopStart[1] - 45} strokeDasharray="2 2" />
            <line x1={geom.dTopEnd[0]} y1={geom.dTopEnd[1]} x2={geom.dTopEnd[0]} y2={geom.dTopEnd[1] - 45} strokeDasharray="2 2" />
            {/* Dimension Span Line along isometric angle */}
            <line x1={geom.dTopStart[0]} y1={geom.dTopStart[1] - 38} x2={geom.dTopEnd[0]} y2={geom.dTopEnd[1] - 38} strokeWidth="1.4" />
            {/* 45-degree architectural slash ticks */}
            <line x1={geom.dTopStart[0] - 4} y1={geom.dTopStart[1] - 34} x2={geom.dTopStart[0] + 4} y2={geom.dTopStart[1] - 42} strokeWidth="1.8" />
            <line x1={geom.dTopEnd[0] - 4} y1={geom.dTopEnd[1] - 34} x2={geom.dTopEnd[0] + 4} y2={geom.dTopEnd[1] - 42} strokeWidth="1.8" />

            {/* Height Dimension Line (Right Side) */}
            <line x1={geom.dSideStart[0]} y1={geom.dSideStart[1]} x2={geom.dSideStart[0] + 45} y2={geom.dSideStart[1]} strokeDasharray="2 2" />
            <line x1={geom.dSideEnd[0]} y1={geom.dSideEnd[1]} x2={geom.dSideEnd[0] + 45} y2={geom.dSideEnd[1]} strokeDasharray="2 2" />
            <line x1={geom.dSideStart[0] + 38} y1={geom.dSideStart[1]} x2={geom.dSideEnd[0] + 38} y2={geom.dSideEnd[1]} strokeWidth="1.4" />
            <line x1={geom.dSideStart[0] + 34} y1={geom.dSideStart[1] + 4} x2={geom.dSideStart[0] + 42} y2={geom.dSideStart[1] - 4} strokeWidth="1.8" />
            <line x1={geom.dSideEnd[0] + 34} y1={geom.dSideEnd[1] + 4} x2={geom.dSideEnd[0] + 42} y2={geom.dSideEnd[1] - 4} strokeWidth="1.8" />
          </g>
        )}

        {/* -----------------------------------------------------------
            STAGE 3: COPPER HANDLES (#F0A06A) (Fades in p: 0.75 -> 1.00)
            ----------------------------------------------------------- */}
        {copperOpacity > 0 && (
          <g opacity={copperOpacity} style={{ willChange: "opacity" }}>
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
          </g>
        )}

        {/* -----------------------------------------------------------
            STAGE 1: ROUGH HAND-DRAWN SKETCH (Royal strokes, wobble filter, double strokes)
            (p: 0.00 -> 0.35, fades out 0.35 -> 0.45)
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
              strokeDasharray="1200"
              strokeDashoffset={1200 * (1 - sketchDraw)}
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

            {/* Double Stroke (Slightly offset architectural pencil double-lines) */}
            <g
              stroke="#2347E0"
              strokeWidth="1.2"
              opacity="0.65"
              transform="translate(1.5, -1)"
              strokeDasharray="1200"
              strokeDashoffset={1200 * (1 - sketchDraw)}
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
