"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface M2SheetMetalUnfoldProps {
  unfoldProgress?: number; // 0 = fully bent 90°, 1 = completely flat pattern 0°
  color?: string;
  edgeColor?: string;
}

export function M2SheetMetalUnfold({
  unfoldProgress = 0,
  color = "#F1EEE6",      // --paper
  edgeColor = "#050505",  // --black
}: M2SheetMetalUnfoldProps) {
  const rootRef = useRef<THREE.Group>(null);

  // Subtle rotational tilt
  useFrame((_, delta) => {
    if (rootRef.current) {
      rootRef.current.rotation.y += delta * 0.15;
    }
  });

  // Flange angle: 0 rad (flat) to PI/2 (90 deg formed)
  const bendAngle = (1 - unfoldProgress) * (Math.PI / 2);

  // Base center plate geometry
  const baseGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.2, -0.9);
    shape.lineTo(1.2, -0.9);
    shape.lineTo(1.2, 0.9);
    shape.lineTo(-1.2, 0.9);
    shape.closePath();

    // Central weight reduction slot
    const slot = new THREE.Path();
    slot.absarc(-0.4, 0, 0.25, Math.PI / 2, (3 * Math.PI) / 2, false);
    slot.absarc(0.4, 0, 0.25, (3 * Math.PI) / 2, Math.PI / 2, false);
    slot.closePath();
    shape.holes.push(slot);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: false,
    });
  }, []);

  const baseEdges = useMemo(() => new THREE.EdgesGeometry(baseGeom, 20), [baseGeom]);

  // Left & Right Flange geometry with mounting holes
  const flangeGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.9);
    shape.lineTo(0.9, -0.9);
    shape.lineTo(0.9, 0.9);
    shape.lineTo(0, 0.9);
    shape.closePath();

    // Mounting bolt holes
    const hole1 = new THREE.Path();
    hole1.absarc(0.45, 0.45, 0.12, 0, Math.PI * 2, true);
    shape.holes.push(hole1);

    const hole2 = new THREE.Path();
    hole2.absarc(0.45, -0.45, 0.12, 0, Math.PI * 2, true);
    shape.holes.push(hole2);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: false,
    });
  }, []);

  const flangeEdges = useMemo(() => new THREE.EdgesGeometry(flangeGeom, 20), [flangeGeom]);

  return (
    <group ref={rootRef} position={[0, -0.2, 0]} rotation={[0.45, -0.3, 0]}>
      {/* 1. Base Center Web */}
      <mesh geometry={baseGeom}>
        <meshBasicMaterial
          color={color}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={1}
        />
      </mesh>
      <lineSegments geometry={baseEdges}>
        <lineBasicMaterial color={edgeColor} linewidth={2} />
      </lineSegments>

      {/* 2. Right Bent Flange (Pivot on right edge: x = +1.2) */}
      <group position={[1.2, 0, 0.04]} rotation={[0, -bendAngle, 0]}>
        <mesh geometry={flangeGeom}>
          <meshBasicMaterial
            color={color}
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={1}
          />
        </mesh>
        <lineSegments geometry={flangeEdges}>
          <lineBasicMaterial color={edgeColor} linewidth={2} />
        </lineSegments>

        {/* Bend Line: Accent --copper (#F0A06A) */}
        <lineSegments position={[0, 0, 0.04]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.01, 1.8)]} />
          <lineBasicMaterial color="#F0A06A" />
        </lineSegments>
      </group>

      {/* 3. Left Bent Flange (Pivot on left edge: x = -1.2) */}
      <group position={[-1.2, 0, 0.04]} rotation={[0, bendAngle, 0]}>
        <group position={[-0.9, 0, 0]}>
          <mesh geometry={flangeGeom}>
            <meshBasicMaterial
              color={color}
              toneMapped={false}
              polygonOffset
              polygonOffsetFactor={1}
            />
          </mesh>
          <lineSegments geometry={flangeEdges}>
            <lineBasicMaterial color={edgeColor} linewidth={2} />
          </lineSegments>

          {/* Bend Line: Accent --copper (#F0A06A) */}
          <lineSegments position={[0.9, 0, 0.04]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.01, 1.8)]} />
            <lineBasicMaterial color="#F0A06A" />
          </lineSegments>
        </group>
      </group>
    </group>
  );
}
