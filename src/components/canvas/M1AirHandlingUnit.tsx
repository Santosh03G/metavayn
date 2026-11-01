"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { type SurfaceType } from "@/components/ui/Button";
import { DISCIPLINE_HIGHLIGHT_MAPPINGS } from "@/lib/discipline-highlight-mapping";
import { computeKinematics } from "@/lib/digital-twin/kinematics";
import type { SubAssemblyId } from "@/lib/digital-twin/types";

export { computeKinematics } from "@/lib/digital-twin/kinematics";

export interface M1AirHandlingUnitProps {
  surface?: SurfaceType;
  explodeFactor?: number; // 0 = assembled, 1 = fully exploded along length axis
  activeDiscipline?: string | null;
  modelScale?: number; // scale multiplier (default 1.0, hero uses 1.6)
  introAnimation?: boolean; // hero page load: edge lines first (0.8s), then fill with paper (0.5s)
  selectedAssemblyId?: SubAssemblyId | "filter-bank" | "cooling-coil" | "centrifugal-fan" | "skid-base" | null;
}

export function M1AirHandlingUnit({
  surface = "royal",
  explodeFactor = 0,
  activeDiscipline = null,
  modelScale = 1.0,
  introAnimation = false,
  selectedAssemblyId = null,
}: M1AirHandlingUnitProps) {
  const rootRef = useRef<THREE.Group>(null);
  const shadowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const introTimerRef = useRef(0);

  // Multi-axis explosion kinematics
  const spacing = explodeFactor * 1.4;
  const filterPosX = -1.15 - spacing;
  const coilPosX = 0.0;
  const fanPosX = 1.15 + spacing;
  const skidPosY = -0.7 - explodeFactor * 0.25;
  const shadowScaleX = 4.02 + explodeFactor * 2.8;
  const shadowPosY = -0.765 - explodeFactor * 0.25;

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

  // Reusable materials separated per sub-assembly to support independent isolation and highlight
  const materials = useMemo(() => {
    const initialOpacity = introAnimation ? 0 : 1;
    return {
      // 1. Skid Frame
      skid: new THREE.MeshBasicMaterial({ color: "#F1EEE6", toneMapped: false, transparent: true, opacity: initialOpacity }),
      skidEdge: new THREE.LineBasicMaterial({ color: "#050505", linewidth: 1.5, transparent: true, opacity: 1 }),

      // 2. Filter Bank Section
      filterCasing: new THREE.MeshBasicMaterial({ color: "#F1EEE6", toneMapped: false, transparent: true, opacity: initialOpacity }),
      filterLouver: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      filterPack: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      filterDoors: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      filterEdge: new THREE.LineBasicMaterial({ color: "#050505", linewidth: 1.5, transparent: true, opacity: 1 }),
      filterInnerEdge: new THREE.LineBasicMaterial({ color: "#F1EEE6", transparent: true, opacity: initialOpacity }),

      // 3. Cooling Coil Section
      coilCasing: new THREE.MeshBasicMaterial({ color: "#F1EEE6", toneMapped: false, transparent: true, opacity: initialOpacity }),
      coil: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      pipe: new THREE.MeshBasicMaterial({ color: "#F0A06A", toneMapped: false, transparent: true, opacity: initialOpacity }),
      coilDoors: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      coilEdge: new THREE.LineBasicMaterial({ color: "#050505", linewidth: 1.5, transparent: true, opacity: 1 }),
      coilInnerEdge: new THREE.LineBasicMaterial({ color: "#F1EEE6", transparent: true, opacity: initialOpacity }),

      // 4. Centrifugal Fan Section
      fanCasing: new THREE.MeshBasicMaterial({ color: "#F1EEE6", toneMapped: false, transparent: true, opacity: initialOpacity }),
      fanHousing: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      fanWheel: new THREE.MeshBasicMaterial({ color: "#F1EEE6", toneMapped: false, transparent: true, opacity: initialOpacity }),
      motor: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      fanDoors: new THREE.MeshBasicMaterial({ color: "#050505", toneMapped: false, transparent: true, opacity: initialOpacity }),
      fanEdge: new THREE.LineBasicMaterial({ color: "#050505", linewidth: 1.5, transparent: true, opacity: 1 }),
      fanInnerEdge: new THREE.LineBasicMaterial({ color: "#F1EEE6", transparent: true, opacity: initialOpacity }),
    };
  }, [introAnimation]);

  // Frame-driven animation: page load fill & discipline / sub-assembly isolation color & opacity lerping
  useFrame((_, delta) => {
    const isReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Track intro animation progress
    let fillProgress = 1;
    let elapsed = 10;
    if (introAnimation && !isReduced) {
      introTimerRef.current += delta;
      elapsed = introTimerRef.current;
      fillProgress = elapsed < 0.8 ? 0 : Math.min(1, (elapsed - 0.8) / 0.5);
    }

    // Sub-assembly selection states
    const hasSelection = Boolean(selectedAssemblyId);
    const isFilterSelected = selectedAssemblyId === "filter-bank";
    const isCoilSelected = selectedAssemblyId === "cooling-coil";
    const isFanSelected = selectedAssemblyId === "centrifugal-fan";
    const isSkidSelected = selectedAssemblyId === "skid-base";

    // Opacity targets: Selected sub-assembly or all (if no selection) = 1.0; Non-selected dimmed to 0.35
    const filterTargetOpacity = hasSelection ? (isFilterSelected ? 1.0 : 0.35) : 1.0;
    const coilTargetOpacity = hasSelection ? (isCoilSelected ? 1.0 : 0.35) : 1.0;
    const fanTargetOpacity = hasSelection ? (isFanSelected ? 1.0 : 0.35) : 1.0;
    const skidTargetOpacity = hasSelection ? (isSkidSelected ? 1.0 : 0.35) : 1.0;

    // Scale with page load intro animation fill progress if applicable
    const fillScale = introAnimation && !isReduced ? fillProgress : 1.0;
    const effFilterFillOpacity = filterTargetOpacity * fillScale;
    const effCoilFillOpacity = coilTargetOpacity * fillScale;
    const effFanFillOpacity = fanTargetOpacity * fillScale;
    const effSkidFillOpacity = skidTargetOpacity * fillScale;

    // Outer edges: During intro animation (first 0.8s), edges are 1.0. Otherwise follow module target opacity.
    const effFilterEdgeOpacity = introAnimation && !isReduced && elapsed < 0.8 ? 1.0 : filterTargetOpacity;
    const effCoilEdgeOpacity = introAnimation && !isReduced && elapsed < 0.8 ? 1.0 : coilTargetOpacity;
    const effFanEdgeOpacity = introAnimation && !isReduced && elapsed < 0.8 ? 1.0 : fanTargetOpacity;
    const effSkidEdgeOpacity = introAnimation && !isReduced && elapsed < 0.8 ? 1.0 : skidTargetOpacity;

    const effFilterInnerEdgeOpacity = effFilterFillOpacity;
    const effCoilInnerEdgeOpacity = effCoilFillOpacity;
    const effFanInnerEdgeOpacity = effFanFillOpacity;

    // Color targets: Discipline highlighting vs Sub-assembly isolation
    const isProduct = Boolean(mapping?.highlightedParts.allEdgesCopper);
    const disciplineEdgeColor = isProduct ? COLOR_COPPER : COLOR_BLACK;
    const disciplineSkidColor = mapping?.highlightedParts.skid ? COLOR_COPPER : COLOR_PAPER;
    const disciplineCasingColor = mapping?.highlightedParts.casing ? COLOR_COPPER : COLOR_PAPER;
    const disciplineCoilColor = mapping?.highlightedParts.coil ? COLOR_COPPER : COLOR_BLACK;
    const disciplineFanColor = mapping?.highlightedParts.fan ? COLOR_COPPER : COLOR_BLACK;
    const disciplineFanWheelColor = mapping?.highlightedParts.fan ? COLOR_COPPER : COLOR_PAPER;
    const disciplineDoorsColor = mapping?.highlightedParts.doors ? COLOR_COPPER : COLOR_BLACK;
    const disciplinePipeColor = (isHeroMode || mapping?.highlightedParts.coil) ? COLOR_COPPER : COLOR_PAPER;

    let targetFilterCasing = disciplineCasingColor;
    let targetFilterLouver = COLOR_BLACK;
    let targetFilterPack = COLOR_BLACK;
    let targetFilterDoors = disciplineDoorsColor;
    let targetFilterEdge = disciplineEdgeColor;

    let targetCoilCasing = disciplineCasingColor;
    let targetCoil = disciplineCoilColor;
    let targetPipe = disciplinePipeColor;
    let targetCoilDoors = disciplineDoorsColor;
    let targetCoilEdge = disciplineEdgeColor;

    let targetFanCasing = disciplineCasingColor;
    let targetFanHousing = disciplineFanColor;
    let targetFanWheel = disciplineFanWheelColor;
    let targetMotor = COLOR_BLACK;
    let targetFanDoors = disciplineDoorsColor;
    let targetFanEdge = disciplineEdgeColor;

    let targetSkid = disciplineSkidColor;
    let targetSkidEdge = disciplineEdgeColor;

    if (hasSelection) {
      if (isFilterSelected) {
        // Filter Bank isolated: highlight filter casing & louvers in Copper (#F0A06A)
        targetFilterCasing = COLOR_COPPER;
        targetFilterLouver = COLOR_COPPER;
        targetFilterPack = COLOR_BLACK;
        targetFilterDoors = COLOR_BLACK;
        targetFilterEdge = COLOR_BLACK;

        targetCoilCasing = COLOR_PAPER;
        targetCoil = COLOR_BLACK;
        targetPipe = COLOR_PAPER;
        targetCoilDoors = COLOR_BLACK;
        targetCoilEdge = COLOR_BLACK;

        targetFanCasing = COLOR_PAPER;
        targetFanHousing = COLOR_BLACK;
        targetFanWheel = COLOR_PAPER;
        targetMotor = COLOR_BLACK;
        targetFanDoors = COLOR_BLACK;
        targetFanEdge = COLOR_BLACK;

        targetSkid = COLOR_PAPER;
        targetSkidEdge = COLOR_BLACK;
      } else if (isCoilSelected) {
        // Cooling Coil isolated: highlight coil & pipes in Copper (#F0A06A)
        targetFilterCasing = COLOR_PAPER;
        targetFilterLouver = COLOR_BLACK;
        targetFilterPack = COLOR_BLACK;
        targetFilterDoors = COLOR_BLACK;
        targetFilterEdge = COLOR_BLACK;

        targetCoilCasing = COLOR_PAPER;
        targetCoil = COLOR_COPPER;
        targetPipe = COLOR_COPPER;
        targetCoilDoors = COLOR_BLACK;
        targetCoilEdge = COLOR_BLACK;

        targetFanCasing = COLOR_PAPER;
        targetFanHousing = COLOR_BLACK;
        targetFanWheel = COLOR_PAPER;
        targetMotor = COLOR_BLACK;
        targetFanDoors = COLOR_BLACK;
        targetFanEdge = COLOR_BLACK;

        targetSkid = COLOR_PAPER;
        targetSkidEdge = COLOR_BLACK;
      } else if (isFanSelected) {
        // Centrifugal Fan isolated: highlight fan housing, wheel & motor in Copper (#F0A06A)
        targetFilterCasing = COLOR_PAPER;
        targetFilterLouver = COLOR_BLACK;
        targetFilterPack = COLOR_BLACK;
        targetFilterDoors = COLOR_BLACK;
        targetFilterEdge = COLOR_BLACK;

        targetCoilCasing = COLOR_PAPER;
        targetCoil = COLOR_BLACK;
        targetPipe = COLOR_PAPER;
        targetCoilDoors = COLOR_BLACK;
        targetCoilEdge = COLOR_BLACK;

        targetFanCasing = COLOR_PAPER;
        targetFanHousing = COLOR_COPPER;
        targetFanWheel = COLOR_COPPER;
        targetMotor = COLOR_COPPER;
        targetFanDoors = COLOR_BLACK;
        targetFanEdge = COLOR_BLACK;

        targetSkid = COLOR_PAPER;
        targetSkidEdge = COLOR_BLACK;
      } else if (isSkidSelected) {
        // Skid Base isolated: highlight skid beams in Copper (#F0A06A)
        targetFilterCasing = COLOR_PAPER;
        targetFilterLouver = COLOR_BLACK;
        targetFilterPack = COLOR_BLACK;
        targetFilterDoors = COLOR_BLACK;
        targetFilterEdge = COLOR_BLACK;

        targetCoilCasing = COLOR_PAPER;
        targetCoil = COLOR_BLACK;
        targetPipe = COLOR_PAPER;
        targetCoilDoors = COLOR_BLACK;
        targetCoilEdge = COLOR_BLACK;

        targetFanCasing = COLOR_PAPER;
        targetFanHousing = COLOR_BLACK;
        targetFanWheel = COLOR_PAPER;
        targetMotor = COLOR_BLACK;
        targetFanDoors = COLOR_BLACK;
        targetFanEdge = COLOR_BLACK;

        targetSkid = COLOR_COPPER;
        targetSkidEdge = COLOR_BLACK;
      }
    }

    if (isReduced) {
      materials.filterCasing.opacity = effFilterFillOpacity;
      materials.filterLouver.opacity = effFilterFillOpacity;
      materials.filterPack.opacity = effFilterFillOpacity;
      materials.filterDoors.opacity = effFilterFillOpacity;
      materials.filterEdge.opacity = effFilterEdgeOpacity;
      materials.filterInnerEdge.opacity = effFilterInnerEdgeOpacity;

      materials.coilCasing.opacity = effCoilFillOpacity;
      materials.coil.opacity = effCoilFillOpacity;
      materials.pipe.opacity = effCoilFillOpacity;
      materials.coilDoors.opacity = effCoilFillOpacity;
      materials.coilEdge.opacity = effCoilEdgeOpacity;
      materials.coilInnerEdge.opacity = effCoilInnerEdgeOpacity;

      materials.fanCasing.opacity = effFanFillOpacity;
      materials.fanHousing.opacity = effFanFillOpacity;
      materials.fanWheel.opacity = effFanFillOpacity;
      materials.motor.opacity = effFanFillOpacity;
      materials.fanDoors.opacity = effFanFillOpacity;
      materials.fanEdge.opacity = effFanEdgeOpacity;
      materials.fanInnerEdge.opacity = effFanInnerEdgeOpacity;

      materials.skid.opacity = effSkidFillOpacity;
      materials.skidEdge.opacity = effSkidEdgeOpacity;

      materials.filterCasing.color.copy(targetFilterCasing);
      materials.filterLouver.color.copy(targetFilterLouver);
      materials.filterPack.color.copy(targetFilterPack);
      materials.filterDoors.color.copy(targetFilterDoors);
      materials.filterEdge.color.copy(targetFilterEdge);

      materials.coilCasing.color.copy(targetCoilCasing);
      materials.coil.color.copy(targetCoil);
      materials.pipe.color.copy(targetPipe);
      materials.coilDoors.color.copy(targetCoilDoors);
      materials.coilEdge.color.copy(targetCoilEdge);

      materials.fanCasing.color.copy(targetFanCasing);
      materials.fanHousing.color.copy(targetFanHousing);
      materials.fanWheel.color.copy(targetFanWheel);
      materials.motor.color.copy(targetMotor);
      materials.fanDoors.color.copy(targetFanDoors);
      materials.fanEdge.color.copy(targetFanEdge);

      materials.skid.color.copy(targetSkid);
      materials.skidEdge.color.copy(targetSkidEdge);

      if (shadowMatRef.current) {
        shadowMatRef.current.opacity = 0.18 * (introAnimation ? fillProgress : 1);
      }
    } else {
      // Lerp factor approximating ~300ms transition time: 1 - exp(-delta * 10)
      const t = Math.min(1, 1 - Math.exp(-delta * 10));

      materials.filterCasing.opacity = THREE.MathUtils.lerp(materials.filterCasing.opacity, effFilterFillOpacity, t);
      materials.filterLouver.opacity = THREE.MathUtils.lerp(materials.filterLouver.opacity, effFilterFillOpacity, t);
      materials.filterPack.opacity = THREE.MathUtils.lerp(materials.filterPack.opacity, effFilterFillOpacity, t);
      materials.filterDoors.opacity = THREE.MathUtils.lerp(materials.filterDoors.opacity, effFilterFillOpacity, t);
      materials.filterEdge.opacity = THREE.MathUtils.lerp(materials.filterEdge.opacity, effFilterEdgeOpacity, t);
      materials.filterInnerEdge.opacity = THREE.MathUtils.lerp(materials.filterInnerEdge.opacity, effFilterInnerEdgeOpacity, t);

      materials.coilCasing.opacity = THREE.MathUtils.lerp(materials.coilCasing.opacity, effCoilFillOpacity, t);
      materials.coil.opacity = THREE.MathUtils.lerp(materials.coil.opacity, effCoilFillOpacity, t);
      materials.pipe.opacity = THREE.MathUtils.lerp(materials.pipe.opacity, effCoilFillOpacity, t);
      materials.coilDoors.opacity = THREE.MathUtils.lerp(materials.coilDoors.opacity, effCoilFillOpacity, t);
      materials.coilEdge.opacity = THREE.MathUtils.lerp(materials.coilEdge.opacity, effCoilEdgeOpacity, t);
      materials.coilInnerEdge.opacity = THREE.MathUtils.lerp(materials.coilInnerEdge.opacity, effCoilInnerEdgeOpacity, t);

      materials.fanCasing.opacity = THREE.MathUtils.lerp(materials.fanCasing.opacity, effFanFillOpacity, t);
      materials.fanHousing.opacity = THREE.MathUtils.lerp(materials.fanHousing.opacity, effFanFillOpacity, t);
      materials.fanWheel.opacity = THREE.MathUtils.lerp(materials.fanWheel.opacity, effFanFillOpacity, t);
      materials.motor.opacity = THREE.MathUtils.lerp(materials.motor.opacity, effFanFillOpacity, t);
      materials.fanDoors.opacity = THREE.MathUtils.lerp(materials.fanDoors.opacity, effFanFillOpacity, t);
      materials.fanEdge.opacity = THREE.MathUtils.lerp(materials.fanEdge.opacity, effFanEdgeOpacity, t);
      materials.fanInnerEdge.opacity = THREE.MathUtils.lerp(materials.fanInnerEdge.opacity, effFanInnerEdgeOpacity, t);

      materials.skid.opacity = THREE.MathUtils.lerp(materials.skid.opacity, effSkidFillOpacity, t);
      materials.skidEdge.opacity = THREE.MathUtils.lerp(materials.skidEdge.opacity, effSkidEdgeOpacity, t);

      materials.filterCasing.color.lerp(targetFilterCasing, t);
      materials.filterLouver.color.lerp(targetFilterLouver, t);
      materials.filterPack.color.lerp(targetFilterPack, t);
      materials.filterDoors.color.lerp(targetFilterDoors, t);
      materials.filterEdge.color.lerp(targetFilterEdge, t);

      materials.coilCasing.color.lerp(targetCoilCasing, t);
      materials.coil.color.lerp(targetCoil, t);
      materials.pipe.color.lerp(targetPipe, t);
      materials.coilDoors.color.lerp(targetCoilDoors, t);
      materials.coilEdge.color.lerp(targetCoilEdge, t);

      materials.fanCasing.color.lerp(targetFanCasing, t);
      materials.fanHousing.color.lerp(targetFanHousing, t);
      materials.fanWheel.color.lerp(targetFanWheel, t);
      materials.motor.color.lerp(targetMotor, t);
      materials.fanDoors.color.lerp(targetFanDoors, t);
      materials.fanEdge.color.lerp(targetFanEdge, t);

      materials.skid.color.lerp(targetSkid, t);
      materials.skidEdge.color.lerp(targetSkidEdge, t);

      if (shadowMatRef.current) {
        const targetShadowOpacity = 0.18 * (introAnimation ? fillProgress : 1);
        shadowMatRef.current.opacity = THREE.MathUtils.lerp(shadowMatRef.current.opacity, targetShadowOpacity, t);
      }
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.05, 0]} scale={modelScale}>
      {/* 0. Tight Flat Contact Shadow Under Unit:
          Scales along X to accommodate explosion: args={[4.02 + explodeFactor * 2.8, 1.28]}
          Black at 18% opacity, depthWrite=false, inside container boundaries */}
      <mesh position={[0, shadowPosY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.02 + explodeFactor * 2.8, 1.28]} />
        <meshBasicMaterial
          ref={shadowMatRef}
          color={COLOR_BLACK}
          transparent
          opacity={introAnimation ? 0 : 0.18}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* 1. Base Skid Frame (ISMC C-Channels) - Drops vertically with explosion kinematics */}
      <group position={[0, skidPosY, 0]}>
        {/* Longitudinal beams */}
        {[-0.55, 0.55].map((z, idx) => (
          <group key={`skid-long-${idx}`} position={[0, 0, z]}>
            <mesh material={materials.skid}>
              <boxGeometry args={[3.8, 0.12, 0.1]} />
            </mesh>
            <lineSegments material={materials.skidEdge}>
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
            <lineSegments material={materials.skidEdge}>
              <edgesGeometry args={[new THREE.BoxGeometry(0.1, 0.12, 1.0)]} />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* 2. Filter Bank Section (Module 1, Left) */}
      <group position={[filterPosX, 0, 0]}>
        {/* Outer Casing Cabinet */}
        <mesh position={[0, 0, 0]} material={materials.filterCasing}>
          <boxGeometry args={[1.12, 1.3, 1.15]} />
        </mesh>
        <lineSegments material={materials.filterEdge}>
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
            <lineSegments key={`pleat-${idx}`} position={[0.08, 0, z]} material={materials.filterInnerEdge}>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.02, 1.0)]} />
            </lineSegments>
          ))}
        </group>

        {/* Front Access Door Panel Seam & Handle */}
        <group position={[0, 0, 0.58]}>
          <lineSegments material={materials.filterEdge}>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 1.1)]} />
          </lineSegments>
          {/* Door Handle */}
          <mesh position={[0.35, 0, 0.02]} material={materials.filterDoors}>
            <boxGeometry args={[0.04, 0.16, 0.03]} />
          </mesh>
        </group>
      </group>

      {/* 3. Cooling Coil Section (Module 2, Center) */}
      <group position={[coilPosX, 0, 0]}>
        {/* Outer Casing Cabinet */}
        <mesh position={[0, 0, 0]} material={materials.coilCasing}>
          <boxGeometry args={[1.12, 1.3, 1.15]} />
        </mesh>
        <lineSegments material={materials.coilEdge}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.12, 1.3, 1.15)]} />
        </lineSegments>

        {/* Cooling Fin Block (Finned Tube Core) */}
        <group position={[0, -0.05, 0]}>
          <mesh material={materials.coil}>
            <boxGeometry args={[0.7, 0.95, 0.85]} />
          </mesh>
          {/* Aluminum Fin Rows */}
          {[-0.35, -0.15, 0.05, 0.25].map((y, idx) => (
            <lineSegments key={`coil-fin-${idx}`} position={[0, y, 0.43]} material={materials.coilInnerEdge}>
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
          <lineSegments material={materials.coilEdge}>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 1.1)]} />
          </lineSegments>
          <mesh position={[-0.35, 0, 0.02]} material={materials.coilDoors}>
            <boxGeometry args={[0.04, 0.16, 0.03]} />
          </mesh>
        </group>
      </group>

      {/* 4. Fan & Blower Section (Module 3, Right) */}
      <group position={[fanPosX, 0, 0]}>
        {/* Outer Casing Cabinet */}
        <mesh position={[0, 0, 0]} material={materials.fanCasing}>
          <boxGeometry args={[1.12, 1.3, 1.15]} />
        </mesh>
        <lineSegments material={materials.fanEdge}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.12, 1.3, 1.15)]} />
        </lineSegments>

        {/* Top Discharge Duct Collar */}
        <group position={[0.15, 0.72, 0]}>
          <mesh material={materials.fanCasing}>
            <boxGeometry args={[0.55, 0.14, 0.65]} />
          </mesh>
          <lineSegments material={materials.fanEdge}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.55, 0.14, 0.65)]} />
          </lineSegments>
        </group>

        {/* Centrifugal Fan Scroll Housing */}
        <group position={[0.05, 0, 0]}>
          <mesh rotation={[0, 0, 0]} material={materials.fanHousing}>
            <cylinderGeometry args={[0.42, 0.42, 0.55, 24]} />
          </mesh>
          <lineSegments material={materials.fanInnerEdge}>
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
            <lineSegments rotation={[0, 0, Math.PI / 2]} material={materials.fanInnerEdge}>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.15, 0.15, 0.35, 16)]} />
            </lineSegments>
          </group>
        </group>

        {/* Front Circular Inspection Viewport Window */}
        <group position={[0, 0, 0.58]}>
          <lineSegments material={materials.fanEdge}>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 1.1)]} />
          </lineSegments>
          {/* Glass Viewport showing fan inside */}
          <lineSegments position={[0.05, 0, 0.01]} material={materials.fanEdge}>
            <edgesGeometry args={[new THREE.CircleGeometry(0.24, 24)]} />
          </lineSegments>
          <mesh position={[-0.35, 0, 0.02]} material={materials.fanDoors}>
            <boxGeometry args={[0.04, 0.16, 0.03]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
