"use client";

import { useRef } from "react";
import * as THREE from "three";
import { type SurfaceType } from "@/components/ui/Button";
import { DISCIPLINE_HIGHLIGHT_MAPPINGS } from "@/lib/discipline-highlight-mapping";

export interface M1AirHandlingUnitProps {
  surface?: SurfaceType;
  explodeFactor?: number; // 0 = assembled, 1 = fully exploded along length axis
  activeDiscipline?: string | null;
  modelScale?: number; // scale multiplier (default 1.0, hero uses 1.6)
}

export function M1AirHandlingUnit({
  surface = "royal",
  explodeFactor = 0,
  activeDiscipline = null,
  modelScale = 1.0,
}: M1AirHandlingUnitProps) {
  const rootRef = useRef<THREE.Group>(null);

  // Single-axis explosion along X axis with perfectly even gaps
  const spacing = explodeFactor * 1.4;
  const filterPosX = -1.15 - spacing;
  const coilPosX = 0.0;
  const fanPosX = 1.15 + spacing;

  // Exact D2 Palette Tokens
  const COLOR_PAPER = "#F1EEE6";
  const COLOR_BLACK = "#050505";
  const COLOR_COPPER = "#F0A06A";

  // Highlight mapping from single source of truth
  const mapping = activeDiscipline
    ? DISCIPLINE_HIGHLIGHT_MAPPINGS[activeDiscipline]
    : null;

  // When activeDiscipline is null (e.g. Hero at rest):
  // all parts paper with black edges; pipework copper (one highlight per screen)
  const isHeroMode = activeDiscipline === null;

  const skidFill = mapping?.highlightedParts.skid ? COLOR_COPPER : COLOR_PAPER;
  const casingFill = mapping?.highlightedParts.casing ? COLOR_COPPER : COLOR_PAPER;
  const filterFill = mapping?.highlightedParts.filter ? COLOR_COPPER : COLOR_PAPER;
  const coilFill = mapping?.highlightedParts.coil ? COLOR_COPPER : COLOR_PAPER;
  const fanFill = mapping?.highlightedParts.fan ? COLOR_COPPER : COLOR_PAPER;
  const doorsFill = mapping?.highlightedParts.doors ? COLOR_COPPER : COLOR_PAPER;

  // Strict Rule: Only the active item's parts are copper. No copper on the other parts.
  const pipeFill = isHeroMode || mapping?.highlightedParts.coil ? COLOR_COPPER : COLOR_PAPER;

  return (
    <group ref={rootRef} position={[0, -0.05, 0]} scale={modelScale}>
      {/* 0. Flat Contact Shadow Under Unit: Black at 20% opacity, depthWrite=false (Zero z-fighting) */}
      <mesh position={[0, -0.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.2, 2.6]} />
        <meshBasicMaterial
          color={COLOR_BLACK}
          transparent
          opacity={0.20}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* 1. Base Skid Frame (ISMC C-Channels) */}
      <group position={[0, -0.7, 0]}>
        {/* Longitudinal beams */}
        {[-0.55, 0.55].map((z, idx) => (
          <group key={`skid-long-${idx}`} position={[0, 0, z]}>
            <mesh>
              <boxGeometry args={[3.8, 0.12, 0.1]} />
              <meshBasicMaterial color={skidFill} toneMapped={false} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(3.8, 0.12, 0.1)]} />
              <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
            </lineSegments>
          </group>
        ))}

        {/* Transverse crossmembers */}
        {[-1.6, -0.8, 0, 0.8, 1.6].map((x, idx) => (
          <group key={`skid-cross-${idx}`} position={[x, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.1, 0.12, 1.0]} />
              <meshBasicMaterial color={skidFill} toneMapped={false} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.1, 0.12, 1.0)]} />
              <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* 2. Filter Bank Section (Module 1, Left) */}
      <group position={[filterPosX, 0, 0]}>
        {/* Outer Casing Cabinet */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.12, 1.3, 1.15]} />
          <meshBasicMaterial color={casingFill} toneMapped={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.12, 1.3, 1.15)]} />
          <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
        </lineSegments>

        {/* Left Intake Air Louvers (End Wall) */}
        {[-0.4, -0.2, 0, 0.2, 0.4].map((y, idx) => (
          <group key={`louver-${idx}`} position={[-0.57, y, 0]} rotation={[0, 0, 0.35]}>
            <mesh>
              <boxGeometry args={[0.02, 0.06, 0.9]} />
              <meshBasicMaterial color={filterFill === COLOR_COPPER ? COLOR_COPPER : COLOR_BLACK} toneMapped={false} />
            </mesh>
          </group>
        ))}

        {/* Internal Pleated Filter Bank Pack (visible when exploded) */}
        <group position={[0.2, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.15, 1.05, 0.95]} />
            <meshBasicMaterial color={COLOR_BLACK} toneMapped={false} />
          </mesh>
          {/* Pleated Filter Lines */}
          {[-0.4, -0.2, 0, 0.2, 0.4].map((z, idx) => (
            <lineSegments key={`pleat-${idx}`} position={[0.08, 0, z]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.02, 1.0)]} />
              <lineBasicMaterial color={filterFill === COLOR_COPPER ? COLOR_COPPER : COLOR_PAPER} />
            </lineSegments>
          ))}
        </group>

        {/* Front Access Door Panel Seam & Handle */}
        <group position={[0, 0, 0.58]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 1.1)]} />
            <lineBasicMaterial color={COLOR_BLACK} />
          </lineSegments>
          {/* Door Handle */}
          <mesh position={[0.35, 0, 0.02]}>
            <boxGeometry args={[0.04, 0.16, 0.03]} />
            <meshBasicMaterial color={doorsFill === COLOR_COPPER ? COLOR_COPPER : COLOR_BLACK} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* 3. Cooling Coil Section (Module 2, Center) */}
      <group position={[coilPosX, 0, 0]}>
        {/* Outer Casing Cabinet */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.12, 1.3, 1.15]} />
          <meshBasicMaterial color={casingFill} toneMapped={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.12, 1.3, 1.15)]} />
          <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
        </lineSegments>

        {/* Cooling Fin Block (Finned Tube Core) */}
        <group position={[0, -0.05, 0]}>
          <mesh>
            <boxGeometry args={[0.7, 0.95, 0.85]} />
            <meshBasicMaterial color={coilFill === COLOR_COPPER ? COLOR_COPPER : COLOR_BLACK} toneMapped={false} />
          </mesh>
          {/* Aluminum Fin Rows */}
          {[-0.35, -0.15, 0.05, 0.25].map((y, idx) => (
            <lineSegments key={`coil-fin-${idx}`} position={[0, y, 0.43]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.68, 0.04)]} />
              <lineBasicMaterial color={COLOR_PAPER} />
            </lineSegments>
          ))}
        </group>

        {/* Copper Header Manifold & Pipework */}
        <group position={[0.25, 0, 0.59]}>
          {/* Supply Header Cylinder */}
          <mesh position={[-0.1, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
            <meshBasicMaterial color={pipeFill} toneMapped={false} />
          </mesh>
          {/* Return Header Cylinder */}
          <mesh position={[0.1, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
            <meshBasicMaterial color={pipeFill} toneMapped={false} />
          </mesh>
          {/* Connection Nozzles */}
          <mesh position={[-0.1, 0.25, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 16]} />
            <meshBasicMaterial color={pipeFill} toneMapped={false} />
          </mesh>
          <mesh position={[0.1, -0.25, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 16]} />
            <meshBasicMaterial color={pipeFill} toneMapped={false} />
          </mesh>
        </group>

        {/* Front Access Panel Outline */}
        <group position={[0, 0, 0.58]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 1.1)]} />
            <lineBasicMaterial color={COLOR_BLACK} />
          </lineSegments>
          <mesh position={[-0.35, 0, 0.02]}>
            <boxGeometry args={[0.04, 0.16, 0.03]} />
            <meshBasicMaterial color={doorsFill === COLOR_COPPER ? COLOR_COPPER : COLOR_BLACK} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* 4. Fan & Blower Section (Module 3, Right) */}
      <group position={[fanPosX, 0, 0]}>
        {/* Outer Casing Cabinet */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.12, 1.3, 1.15]} />
          <meshBasicMaterial color={casingFill} toneMapped={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.12, 1.3, 1.15)]} />
          <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
        </lineSegments>

        {/* Top Discharge Duct Collar */}
        <group position={[0.15, 0.72, 0]}>
          <mesh>
            <boxGeometry args={[0.55, 0.14, 0.65]} />
            <meshBasicMaterial color={casingFill} toneMapped={false} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.55, 0.14, 0.65)]} />
            <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
          </lineSegments>
        </group>

        {/* Centrifugal Fan Scroll Housing */}
        <group position={[0.05, 0, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.55, 24]} />
            <meshBasicMaterial color={fanFill === COLOR_COPPER ? COLOR_COPPER : COLOR_BLACK} toneMapped={false} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.CylinderGeometry(0.42, 0.42, 0.55, 24)]} />
            <lineBasicMaterial color={COLOR_PAPER} />
          </lineSegments>

          {/* Visible Fan Wheel / Impeller with Curved Blades */}
          <group position={[0, 0, 0.29]}>
            {/* Center Impeller Hub */}
            <mesh>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
              <meshBasicMaterial color={fanFill === COLOR_COPPER ? COLOR_COPPER : COLOR_PAPER} toneMapped={false} />
            </mesh>
            {/* 8 Radial Impeller Blades */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <group key={`blade-${deg}`} rotation={[0, 0, (deg * Math.PI) / 180]}>
                <mesh position={[0.22, 0, 0]}>
                  <boxGeometry args={[0.18, 0.02, 0.04]} />
                  <meshBasicMaterial color={fanFill === COLOR_COPPER ? COLOR_COPPER : COLOR_PAPER} toneMapped={false} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Electric Drive Motor */}
          <group position={[-0.32, -0.25, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.15, 0.15, 0.35, 16]} />
              <meshBasicMaterial color={COLOR_BLACK} toneMapped={false} />
            </mesh>
            <lineSegments rotation={[0, 0, Math.PI / 2]}>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.15, 0.15, 0.35, 16)]} />
              <lineBasicMaterial color={COLOR_PAPER} />
            </lineSegments>
          </group>
        </group>

        {/* Front Circular Inspection Viewport Window */}
        <group position={[0, 0, 0.58]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 1.1)]} />
            <lineBasicMaterial color={COLOR_BLACK} />
          </lineSegments>
          {/* Glass Viewport showing fan inside */}
          <lineSegments position={[0.05, 0, 0.01]}>
            <edgesGeometry args={[new THREE.CircleGeometry(0.24, 24)]} />
            <lineBasicMaterial color={COLOR_BLACK} />
          </lineSegments>
          <mesh position={[-0.35, 0, 0.02]}>
            <boxGeometry args={[0.04, 0.16, 0.03]} />
            <meshBasicMaterial color={doorsFill === COLOR_COPPER ? COLOR_COPPER : COLOR_BLACK} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}