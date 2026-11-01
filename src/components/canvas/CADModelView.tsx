"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export type CADRenderMode = "shaded" | "wireframe" | "drawing";

interface CADModelViewProps {
  mode?: CADRenderMode;
  geometry?: THREE.BufferGeometry;
  autoRotate?: boolean;
  color?: string;
  edgeColor?: string;
}

/**
 * Procedurally generates a precision engineering flange component
 * with central bore, counterbore, and 4 mounting holes.
 */
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
  geometry: customGeometry,
  autoRotate = true,
  color = "#0D2B52",
  edgeColor = "#7FB2FF",
}: CADModelViewProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Memoize geometry
  const geometry = useMemo(() => {
    return customGeometry || createParametricFlangeGeometry();
  }, [customGeometry]);

  // Generate crisp CAD edge lines using EdgesGeometry
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 25); // 25 degree threshold for CAD feature edges
  }, [geometry]);

  // Slowly rotate if autoRotate enabled
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Shaded Mode: Matte CAD physical material + subtle edge highlights */}
      {mode === "shaded" && (
        <>
          <mesh geometry={geometry}>
            <meshStandardMaterial
              color={color}
              roughness={0.4}
              metalness={0.3}
              polygonOffset
              polygonOffsetFactor={1}
              polygonOffsetUnits={1}
            />
          </mesh>
          <lineSegments geometry={edgesGeometry}>
            <lineBasicMaterial color={edgeColor} transparent opacity={0.7} />
          </lineSegments>
        </>
      )}

      {/* 2. Wireframe Mode: Pure CAD lattice */}
      {mode === "wireframe" && (
        <mesh geometry={geometry}>
          <meshBasicMaterial
            color={edgeColor}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* 3. Drawing Mode (Hidden-Line Blueprint):
          Faces render background color to occlude hidden lines,
          while foreground edges render crisp CAD blueprint strokes */}
      {mode === "drawing" && (
        <>
          <mesh geometry={geometry}>
            <meshBasicMaterial
              color="#06142B" // Matches --color-deep background
              polygonOffset
              polygonOffsetFactor={1}
              polygonOffsetUnits={1}
            />
          </mesh>
          <lineSegments geometry={edgesGeometry}>
            <lineBasicMaterial color={edgeColor} linewidth={1.5} />
          </lineSegments>
        </>
      )}
    </group>
  );
}
