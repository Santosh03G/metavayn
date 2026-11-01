"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { type SurfaceType } from "@/components/ui/Button";
import { DISCIPLINE_HIGHLIGHT_MAPPINGS } from "@/lib/discipline-highlight-mapping";

export interface M1AirHandlingUnitProps {
  surface?: SurfaceType;
  explodeFactor?: number; // 0 = assembled, 1 = fully exploded along length axis
  activeDiscipline?: string | null;
  modelScale?: number; // scale multiplier (default 1.0, hero uses 1.6)
  introAnimation?: boolean; // hero page load: edge lines first (0.8s), then fill with paper (0.5s)
}

export function M1AirHandlingUnit({
  surface = "royal",
  explodeFactor = 0,
  activeDiscipline = null,
  modelScale = 1.0,
  introAnimation = false,
}: M1AirHandlingUnitProps) {
  const rootRef = useRef<THREE.Group>(null);
  const shadowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const introTimerRef = useRef(0);

  // Single-axis explosion along X axis with perfectly even gaps
  const spacing = explodeFactor * 1.4;
  const filterPosX = -1.15 - spacing;
  const coilPosX = 0.0;
  const fanPosX = 1.15 + spacing;

  // Exact D2 Palette Tokens
  const COLOR_PAPER = useMemo(() => new THREE.Color("#F1EEE6"), []);
  const COLOR_BLACK = useMemo(() => new THREE.Color("#050505"), []);
  const COLOR_COPPER = useMemo(() => new THREE.Color("#F0A06A"), []);

  // Highlight mapping from single source of truth
  const mapping = activeDiscipline
    ? DISCIPLINE_HIGHLIGHT_MAPPINGS[activeDiscipline]
    : null;

  // Hero mode (activeDiscipline is null): pipework copper (one highlight per screen)
  const isHeroMode = activeDiscipline === null;

  // Reusable materials with continuous 300ms color lerping and intro animation support
  const materials = useMemo(() => {
    const initialOpacity = introAnimation ? 0 : 1;
    return {
      skid: new THREE.MeshBasicMaterial({ color: "#F1EEE6", toneMapped: false, transparent: true, opacity: initialOpacity }),
      casing: new THREE.MeshBasicMaterial({ color: "#F1EEE6", toneMapped: false, transparent: true, opacity: initialOpacity }),
      filterLouver: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      filterPack: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      coil: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      fanHousing: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      fanWheel: new THREE.MeshBasicMaterial({ color: "#F1EEE6", toneMapped: false, transparent: true, opacity: initialOpacity }),
      motor: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      doors: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      pipe: new THREE.MeshBasicMaterial({ color: "#F0A06A", toneMapped: false, transparent: true, opacity: initialOpacity }),
      edge: new THREE.LineBasicMaterial({ color: "#050505", linewidth: 1.5, transparent: true, opacity: 1 }),
      innerEdge: new THREE.LineBasicMaterial({ color: "#F1EEE6", transparent: true, opacity: initialOpacity }),
    };
  }, [introAnimation]);

  // Frame-driven animation: page load fill & discipline color lerping
  useFrame((_, delta) => {
    const isReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Page Load Intro Animation: Black edge lines first (0.8s), then paper fill (0.5s)
    if (introAnimation && !isReduced) {
      introTimerRef.current += delta;
      const elapsed = introTimerRef.current;

      // 0.0s to 0.8s: edges only (fillProgress = 0). Next 0.5s: fill ramps from 0 to 1
      const fillProgress = elapsed < 0.8 ? 0 : Math.min(1, (elapsed - 0.8) / 0.5);

      materials.skid.opacity = fillProgress;
      materials.casing.opacity = fillProgress;
      materials.filterLouver.opacity = fillProgress;
      materials.filterPack.opacity = fillProgress;
      materials.coil.opacity = fillProgress;
      materials.fanHousing.opacity = fillProgress;
      materials.fanWheel.opacity = fillProgress;
      materials.motor.opacity = fillProgress;
      materials.doors.opacity = fillProgress;
      materials.pipe.opacity = fillProgress;
      materials.innerEdge.opacity = fillProgress;

      if (shadowMatRef.current) {
        shadowMatRef.current.opacity = 0.18 * fillProgress;
      }
    } else if (isReduced) {
      materials.skid.opacity = 1;
      materials.casing.opacity = 1;
      materials.filterLouver.opacity = 1;
      materials.filterPack.opacity = 1;
      materials.coil.opacity = 1;
      materials.fanHousing.opacity = 1;
      materials.fanWheel.opacity = 1;
      materials.motor.opacity = 1;
      materials.doors.opacity = 1;
      materials.pipe.opacity = 1;
      materials.innerEdge.opacity = 1;
      if (shadowMatRef.current) {
        shadowMatRef.current.opacity = 0.18;
      }
    }

    // 2. Lerp factor approximating ~300ms transition time: 1 - exp(-delta * 10)
    const t = Math.min(1, 1 - Math.exp(-delta * 10));

    // Product Engineering: All edges copper, fills remain neutral paper
    const isProduct = Boolean(mapping?.highlightedParts.allEdgesCopper);
    const targetEdgeColor = isProduct ? COLOR_COPPER : COLOR_BLACK;
    materials.edge.color.lerp(targetEdgeColor, t);

    // Mechanical Design Engineering: Casing panels and base skid copper
    const targetSkidColor = mapping?.highlightedParts.skid ? COLOR_COPPER : COLOR_PAPER;
    materials.skid.color.lerp(targetSkidColor, t);

    const targetCasingColor = mapping?.highlightedParts.casing ? COLOR_COPPER : COLOR_PAPER;
    materials.casing.color.lerp(targetCasingColor, t);

    // HVAC & Thermal Engineering: Coil section and fan section copper
    const targetCoilColor = mapping?.highlightedParts.coil ? COLOR_COPPER : COLOR_BLACK;
    materials.coil.color.lerp(targetCoilColor, t);

    const targetFanColor = mapping?.highlightedParts.fan ? COLOR_COPPER : COLOR_BLACK;
    materials.fanHousing.color.lerp(targetFanColor, t);
    const targetFanWheelColor = mapping?.highlightedParts.fan ? COLOR_COPPER : COLOR_PAPER;
    materials.fanWheel.color.lerp(targetFanWheelColor, t);

    // Doors & handles
    const targetDoorsColor = mapping?.highlightedParts.doors ? COLOR_COPPER : COLOR_BLACK;
    materials.doors.color.lerp(targetDoorsColor, t);

    // Pipework: Copper in hero mode or when coil section is active; neutral otherwise
    const targetPipeColor =
      isHeroMode || mapping?.highlightedParts.coil ? COLOR_COPPER : COLOR_PAPER;
    materials.pipe.color.lerp(targetPipeColor, t);
  });

  return (
    <group ref={rootRef} position={[0, -0.05, 0]} scale={modelScale}>
      {/* 0. Tight Flat Contact Shadow Under Unit:
          Extends at most 6% beyond base footprint (3.8 x 1.2 -> 4.02 x 1.28),
          Black at 18% opacity, depthWrite=false, inside container boundaries */}
      <mesh position={[0, -0.765, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.02, 1.28]} />
        <meshBasicMaterial
          ref={shadowMatRef}
          color={COLOR_BLACK}
          transparent
          opacity={introAnimation ? 0 : 0.18}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* 1. Base Skid Frame (ISMC C-Channels) */}
      <group position={[0, -0.7, 0]}>
        {/* Longitudinal beams */}
        {[-0.55, 0.55].map((z, idx) => (
          <group key={`skid-long-${idx}`} position={[0, 0, z]}>
            <mesh material={materials.skid}>
              <boxGeometry args={[3.8, 0.12, 0.1]} />
            </mesh>
            <lineSegments material={materials.edge}>
              <edgesGeometry args={[new THREE.BoxGeometry(3.8, 0.12, 0.1)]} />
            </lineSegments>
          </group>
        ))}

        {/* Transverse crossmembers */}
        {[-1.6, -0.8, 0, 0.8, 1.6].map((x, idx) => (
          <group key={`skid-cross-${idx}`} position={[x, 0, 0]}>
            <mesh material={materials.skid}>
              <boxGeometry args={[0.1, 0.12, 1.0]} />
            </mesh>
            <lineSegments material={materials.edge}>
              <edgesGeometry args={[new THREE.BoxGeometry(0.1, 0.12, 1.0)]} />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* 2. Filter Bank Section (Module 1, Left) */}
      <group position={[filterPosX, 0, 0]}>
        {/* Outer Casing Cabinet */}
        <mesh position={[0, 0, 0]} material={materials.casing}>
          <boxGeometry args={[1.12, 1.3, 1.15]} />
        </mesh>
        <lineSegments material={materials.edge}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.12, 1.3, 1.15)]} />
        </lineSegments>

        {/* Left Intake Air Louvers (End Wall) */}
        {[-0.4, -0.2, 0, 0.2, 0.4].map((y, idx) => (
          <group key={`louver-${idx}`} position={[-0.57, y, 0]} rotation={[0, 0, 0.35]}>
            <mesh material={materials.filterLouver}>
              <boxGeometry args={[0.02, 0.06, 0.9]} />
            </mesh>
          </group>
        ))}

        {/* Internal Pleated Filter Bank Pack (visible when exploded) */}
        <group position={[0.2, 0, 0]}>
          <mesh material={materials.filterPack}>
            <boxGeometry args={[0.15, 1.05, 0.95]} />
          </mesh>
          {/* Pleated Filter Lines */}
          {[-0.4, -0.2, 0, 0.2, 0.4].map((z, idx) => (
            <lineSegments key={`pleat-${idx}`} position={[0.08, 0, z]} material={materials.innerEdge}>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.02, 1.0)]} />
            </lineSegments>
          ))}
        </group>

        {/* Front Access Door Panel Seam & Handle */}
        <group position={[0, 0, 0.58]}>
          <lineSegments material={materials.edge}>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 1.1)]} />
          </lineSegments>
          {/* Door Handle */}
          <mesh position={[0.35, 0, 0.02]} material={materials.doors}>
            <boxGeometry args={[0.04, 0.16, 0.03]} />
          </mesh>
        </group>
      </group>

      {/* 3. Cooling Coil Section (Module 2, Center) */}
      <group position={[coilPosX, 0, 0]}>
        {/* Outer Casing Cabinet */}
        <mesh position={[0, 0, 0]} material={materials.casing}>
          <boxGeometry args={[1.12, 1.3, 1.15]} />
        </mesh>
        <lineSegments material={materials.edge}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.12, 1.3, 1.15)]} />
        </lineSegments>

        {/* Cooling Fin Block (Finned Tube Core) */}
        <group position={[0, -0.05, 0]}>
          <mesh material={materials.coil}>
            <boxGeometry args={[0.7, 0.95, 0.85]} />
          </mesh>
          {/* Aluminum Fin Rows */}
          {[-0.35, -0.15, 0.05, 0.25].map((y, idx) => (
            <lineSegments key={`coil-fin-${idx}`} position={[0, y, 0.43]} material={materials.innerEdge}>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.68, 0.04)]} />
            </lineSegments>
          ))}
        </group>

        {/* Copper Header Manifold & Pipework */}
        <group position={[0.25, 0, 0.59]}>
          {/* Supply Header Cylinder */}
          <mesh position={[-0.1, 0, 0]} material={materials.pipe}>
            <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
          </mesh>
          {/* Return Header Cylinder */}
          <mesh position={[0.1, 0, 0]} material={materials.pipe}>
            <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
          </mesh>
          {/* Connection Nozzles */}
          <mesh position={[-0.1, 0.25, 0.06]} rotation={[Math.PI / 2, 0, 0]} material={materials.pipe}>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 16]} />
          </mesh>
          <mesh position={[0.1, -0.25, 0.06]} rotation={[Math.PI / 2, 0, 0]} material={materials.pipe}>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 16]} />
          </mesh>
        </group>

        {/* Front Access Panel Outline */}
        <group position={[0, 0, 0.58]}>
          <lineSegments material={materials.edge}>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 1.1)]} />
          </lineSegments>
          <mesh position={[-0.35, 0, 0.02]} material={materials.doors}>
            <boxGeometry args={[0.04, 0.16, 0.03]} />
          </mesh>
        </group>
      </group>

      {/* 4. Fan & Blower Section (Module 3, Right) */}
      <group position={[fanPosX, 0, 0]}>
        {/* Outer Casing Cabinet */}
        <mesh position={[0, 0, 0]} material={materials.casing}>
          <boxGeometry args={[1.12, 1.3, 1.15]} />
        </mesh>
        <lineSegments material={materials.edge}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.12, 1.3, 1.15)]} />
        </lineSegments>

        {/* Top Discharge Duct Collar */}
        <group position={[0.15, 0.72, 0]}>
          <mesh material={materials.casing}>
            <boxGeometry args={[0.55, 0.14, 0.65]} />
          </mesh>
          <lineSegments material={materials.edge}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.55, 0.14, 0.65)]} />
          </lineSegments>
        </group>

        {/* Centrifugal Fan Scroll Housing */}
        <group position={[0.05, 0, 0]}>
          <mesh rotation={[0, 0, 0]} material={materials.fanHousing}>
            <cylinderGeometry args={[0.42, 0.42, 0.55, 24]} />
          </mesh>
          <lineSegments material={materials.innerEdge}>
            <edgesGeometry args={[new THREE.CylinderGeometry(0.42, 0.42, 0.55, 24)]} />
          </lineSegments>

          {/* Visible Fan Wheel / Impeller with Curved Blades */}
          <group position={[0, 0, 0.29]}>
            {/* Center Impeller Hub */}
            <mesh material={materials.fanWheel}>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
            </mesh>
            {/* 8 Radial Impeller Blades */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <group key={`blade-${deg}`} rotation={[0, 0, (deg * Math.PI) / 180]}>
                <mesh position={[0.22, 0, 0]} material={materials.fanWheel}>
                  <boxGeometry args={[0.18, 0.02, 0.04]} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Electric Drive Motor */}
          <group position={[-0.32, -0.25, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={materials.motor}>
              <cylinderGeometry args={[0.15, 0.15, 0.35, 16]} />
            </mesh>
            <lineSegments rotation={[0, 0, Math.PI / 2]} material={materials.innerEdge}>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.15, 0.15, 0.35, 16)]} />
            </lineSegments>
          </group>
        </group>

        {/* Front Circular Inspection Viewport Window */}
        <group position={[0, 0, 0.58]}>
          <lineSegments material={materials.edge}>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 1.1)]} />
          </lineSegments>
          {/* Glass Viewport showing fan inside */}
          <lineSegments position={[0.05, 0, 0.01]} material={materials.edge}>
            <edgesGeometry args={[new THREE.CircleGeometry(0.24, 24)]} />
          </lineSegments>
          <mesh position={[-0.35, 0, 0.02]} material={materials.doors}>
            <boxGeometry args={[0.04, 0.16, 0.03]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
