"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { type SurfaceType } from "@/components/ui/Button";

export type CADRenderMode = "shaded" | "wireframe" | "drawing";

interface CADModelViewProps {
  mode?: CADRenderMode;
  surface?: SurfaceType;
  geometry?: THREE.BufferGeometry;
  autoRotate?: boolean;
  color?: string;
  edgeColor?: string;
}

function createParametricFlangeGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const outerRadius = 1.6;
  const innerRadius = 0.7;

  // Outer circular profile
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

  // Central shaft bore hole
  const centerHole = new THREE.Path();
  centerHole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(centerHole);

  // 4 bolt pitch circle mounting holes
  const pcdRadius = 1.2;
  const holeRadius = 0.15;
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const holeX = Math.cos(angle) * pcdRadius;
    const holeY = Math.sin(angle) * pcdRadius;
    const boltHole = new THREE.Path();
    boltHole.absarc(holeX, holeY, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(boltHole);
  }

  const extrudeSettings = {
    steps: 1,
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3,
    curveSegments: 32,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  return geometry;
}

export function CADModelView({
  mode = "shaded",
  surface = "royal",
  geometry: customGeometry,
  autoRotate = true,
  color,
  edgeColor,
}: CADModelViewProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Memoize geometry
  const geometry = useMemo(() => {
    return customGeometry || createParametricFlangeGeometry();
  }, [customGeometry]);

  // Edges
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 25);
  }, [geometry]);

  // Resolve D2 surface color tokens
  const palette = useMemo(() => {
    if (surface === "royal") {
      return {
        fill: color || "#F1EEE6",      // --paper
        edge: edgeColor || "#050505",  // --black
        occlude: "#2347E0",           // --royal
        wire: "#F1EEE6",              // --paper
      };
    }
    if (surface === "black") {
      return {
        fill: color || "#F1EEE6",      // --paper
        edge: edgeColor || "#050505",  // --black
        occlude: "#050505",           // --black
        wire: "#9DB2FF",              // --pale-blue
      };
    }
    // paper
    return {
      fill: color || "#2347E0",        // --royal
      edge: edgeColor || "#050505",    // --black
      occlude: "#F1EEE6",             // --paper
      wire: "#050505",                // --black
    };
  }, [surface, color, edgeColor]);

  // Rotate
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Shaded Mode: Flat token colors with toneMapped={false} */}
      {mode === "shaded" && (
        <>
          <mesh geometry={geometry}>
            <meshBasicMaterial
              color={palette.fill}
              toneMapped={false}
              polygonOffset
              polygonOffsetFactor={1}
              polygonOffsetUnits={1}
            />
          </mesh>
          <lineSegments geometry={edgesGeometry}>
            <lineBasicMaterial color={palette.edge} />
          </lineSegments>
        </>
      )}

      {/* 2. Wireframe Mode */}
      {mode === "wireframe" && (
        <mesh geometry={geometry}>
          <meshBasicMaterial
            color={palette.wire}
            wireframe
            toneMapped={false}
          />
        </mesh>
      )}

      {/* 3. Drawing Mode (Hidden-Line Occlusion) */}
      {mode === "drawing" && (
        <>
          <mesh geometry={geometry}>
            <meshBasicMaterial
              color={palette.occlude}
              toneMapped={false}
              polygonOffset
              polygonOffsetFactor={1}
              polygonOffsetUnits={1}
            />
          </mesh>
          <lineSegments geometry={edgesGeometry}>
            <lineBasicMaterial color={palette.wire} linewidth={1.5} />
          </lineSegments>
        </>
      )}
    </group>
  );
}
