"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Scene } from "@/components/canvas/Scene";
import { M3WeldmentCallout } from "@/components/canvas/M3WeldmentCallout";
import { type SurfaceType } from "@/components/ui/Button";

function StructuralWeldmentJoint() {
  const groupRef = useRef<THREE.Group>(null);

  // Exact D2 Palette Tokens
  const COLOR_PAPER = useMemo(() => new THREE.Color("#F1EEE6"), []);
  const COLOR_BLACK = useMemo(() => new THREE.Color("#050505"), []);
  const COLOR_COPPER = useMemo(() => new THREE.Color("#F0A06A"), []);

  // Subtle gentle idle oscillation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = -Math.PI / 4 + Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} rotation={[0.4, -Math.PI / 4, 0]}>
      {/* 1. Horizontal ISMC 150 Channel Beam */}
      <group position={[0, -0.6, 0]}>
        {/* Web */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 0.12, 1.2]} />
          <meshBasicMaterial color={COLOR_PAPER} toneMapped={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(3.2, 0.12, 1.2)]} />
          <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
        </lineSegments>

        {/* Flanges */}
        {[-0.55, 0.55].map((z, idx) => (
          <group key={`h-flange-${idx}`} position={[0, 0.15, z]}>
            <mesh>
              <boxGeometry args={[3.2, 0.2, 0.1]} />
              <meshBasicMaterial color={COLOR_PAPER} toneMapped={false} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(3.2, 0.2, 0.1)]} />
              <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* 2. Vertical Column Channel Joint */}
      <group position={[0, 0.6, 0]}>
        {/* Web */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 2.2, 0.12]} />
          <meshBasicMaterial color={COLOR_PAPER} toneMapped={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.8, 2.2, 0.12)]} />
          <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
        </lineSegments>

        {/* Column Flanges */}
        {[-0.35, 0.35].map((x, idx) => (
          <group key={`v-flange-${idx}`} position={[x, 0, 0.25]}>
            <mesh>
              <boxGeometry args={[0.1, 2.2, 0.4]} />
              <meshBasicMaterial color={COLOR_PAPER} toneMapped={false} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.1, 2.2, 0.4)]} />
              <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* 3. Gusset Stiffener Triangular Plate */}
      <group position={[0.42, 0.1, 0.15]} rotation={[0, 0, Math.PI / 4]}>
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.08]} />
          <meshBasicMaterial color={COLOR_PAPER} toneMapped={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 0.08)]} />
          <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
        </lineSegments>
      </group>

      {/* 4. Welded Fillet Seams (Highlighted in Copper #F0A06A) */}
      <group position={[0, -0.5, 0.1]}>
        {/* Horizontal Seam Along Web Junction */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.85, 8]} />
          <meshBasicMaterial color={COLOR_COPPER} toneMapped={false} />
        </mesh>
        {/* Left Vertical Joint Weld Bead */}
        <mesh position={[-0.4, 0.4, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.8, 8]} />
          <meshBasicMaterial color={COLOR_COPPER} toneMapped={false} />
        </mesh>
        {/* Right Vertical Joint Weld Bead */}
        <mesh position={[0.4, 0.4, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.8, 8]} />
          <meshBasicMaterial color={COLOR_COPPER} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

export function IndustrialVisual({
  surface = "black",
}: {
  surface?: SurfaceType;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-black text-paper relative select-none overflow-hidden">
      {/* 3D Structural Joint Stage */}
      <div className="w-full flex-1 min-h-[260px] sm:min-h-[300px]">
        <Scene
          surface={surface}
          aspectRatio="aspect-[16/10]"
          orthographic={true}
          cameraPosition={[14, 12, 14]}
          borderless={true}
          modelScale={1.3}
        >
          <StructuralWeldmentJoint />
        </Scene>
      </div>

      {/* CAD Weldment Callout Overlay */}
      <div className="w-full mt-3">
        <M3WeldmentCallout surface={surface} />
      </div>
    </div>
  );
}
