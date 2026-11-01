"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Scene } from "@/components/canvas/Scene";
import { type SurfaceType } from "@/components/ui/Button";

function ModularTeamBlocks() {
  const rootRef = useRef<THREE.Group>(null);
  const extBlock1Ref = useRef<THREE.Group>(null);
  const extBlock2Ref = useRef<THREE.Group>(null);

  // Exact D2 Palette Tokens
  const COLOR_PAPER = useMemo(() => new THREE.Color("#F1EEE6"), []);
  const COLOR_BLACK = useMemo(() => new THREE.Color("#050505"), []);
  const COLOR_COPPER = useMemo(() => new THREE.Color("#F0A06A"), []);
  const COLOR_PALE_BLUE = useMemo(() => new THREE.Color("#9DB2FF"), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Gentle global isometric hovering rotation
    if (rootRef.current) {
      rootRef.current.rotation.y = -Math.PI / 4 + Math.sin(t * 0.4) * 0.08;
    }

    // Periodic docking cycle for capacity extension blocks
    // Every 4 seconds: slides out slightly, then docks smoothly into place
    const cycle = (Math.sin(t * 1.2) + 1) / 2; // 0 to 1 smooth oscillation
    const eased = Math.pow(cycle, 2);

    // Extension Block 1 (Copper): Slides along X axis to dock
    if (extBlock1Ref.current) {
      extBlock1Ref.current.position.x = 0.72 + eased * 0.4;
    }

    // Extension Block 2 (Pale-Blue): Slides along Y axis to dock on top
    if (extBlock2Ref.current) {
      extBlock2Ref.current.position.y = 0.72 + eased * 0.35;
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.2, 0]} rotation={[0.45, -Math.PI / 4, 0]}>
      {/* 1. Core Internal Engineering Team (3 Fixed Paper Modular Blocks) */}
      {[
        { pos: [0, 0, 0] as [number, number, number], label: "CORE-01" },
        { pos: [-0.72, 0, 0] as [number, number, number], label: "CORE-02" },
        { pos: [0, 0, -0.72] as [number, number, number], label: "CORE-03" },
      ].map((b, idx) => (
        <group key={`core-block-${idx}`} position={b.pos}>
          <mesh>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshBasicMaterial color={COLOR_PAPER} toneMapped={false} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.7, 0.7, 0.7)]} />
            <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
          </lineSegments>
        </group>
      ))}

      {/* 2. Metavayn Extension Capacity Pod 1 (Copper Block, Docks on +X) */}
      <group ref={extBlock1Ref} position={[0.72, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshBasicMaterial color={COLOR_COPPER} toneMapped={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.7, 0.7, 0.7)]} />
          <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
        </lineSegments>
      </group>

      {/* 3. Metavayn Extension Capacity Pod 2 (Pale-Blue Block, Docks on +Y) */}
      <group ref={extBlock2Ref} position={[0, 0.72, 0]}>
        <mesh>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshBasicMaterial color={COLOR_PALE_BLUE} toneMapped={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.7, 0.7, 0.7)]} />
          <lineBasicMaterial color={COLOR_BLACK} linewidth={1.5} />
        </lineSegments>
      </group>

      {/* Grid Floor Projection datum lines */}
      {[-1.44, -0.72, 0, 0.72, 1.44].map((coord, idx) => (
        <group key={`grid-x-${idx}`}>
          <lineSegments position={[0, -0.42, coord]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(3.2, 0.01)]} />
            <lineBasicMaterial color="#9DB2FF" transparent opacity={0.25} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

export function ModularTeamVisual({
  surface = "black",
}: {
  surface?: SurfaceType;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-black text-paper relative select-none overflow-hidden">
      {/* 3D Modular Team Extension Stage */}
      <div className="w-full flex-1 min-h-[260px] sm:min-h-[300px]">
        <Scene
          surface={surface}
          aspectRatio="aspect-[16/10]"
          orthographic={true}
          cameraPosition={[12, 10, 12]}
          borderless={true}
          modelScale={1.3}
        >
          <ModularTeamBlocks />
        </Scene>
      </div>

      {/* Telemetry Bar */}
      <div className="border border-pale-blue/20 bg-black/80 px-3.5 py-2 font-mono text-[10px] sm:text-xs flex flex-wrap items-center justify-between gap-2 mt-3">
        <span className="text-copper flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-copper animate-ping" />
          FLEXIBLE TEAM EXTENSION
        </span>
        <span className="text-paper/80">CORE: 3 PODS • EXTENSION: +2 PODS</span>
        <span className="text-pale-blue">STATUS: DOCKED</span>
      </div>
    </div>
  );
}
