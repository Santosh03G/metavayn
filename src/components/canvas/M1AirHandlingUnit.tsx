"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

export interface M1AirHandlingUnitProps {
  explodeFactor?: number; // 0 = assembled, 1 = fully exploded
  activeDiscipline?: string | null;
  mode?: "drawing" | "shaded" | "wireframe";
  interactiveTilt?: boolean;
}

export function M1AirHandlingUnit({
  explodeFactor = 0,
  activeDiscipline = null,
  mode = "drawing",
  interactiveTilt = true,
}: M1AirHandlingUnitProps) {
  const rootRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  // Smooth mouse tilt damping
  useFrame((_, delta) => {
    if (!rootRef.current) return;
    if (interactiveTilt) {
      // Gentle damping to prevent jarring motion
      const targetRotationY = pointer.x * 0.25 - 0.4;
      const targetRotationX = -pointer.y * 0.15 + 0.35;
      rootRef.current.rotation.y = THREE.MathUtils.damp(
        rootRef.current.rotation.y,
        targetRotationY,
        4,
        delta
      );
      rootRef.current.rotation.x = THREE.MathUtils.damp(
        rootRef.current.rotation.x,
        targetRotationX,
        4,
        delta
      );
    }
  });

  // Calculate explode translations based on explodeFactor (0 to 1)
  const casingOffset = useMemo(
    () => new THREE.Vector3(0, explodeFactor * 1.8, 0),
    [explodeFactor]
  );
  const coilOffset = useMemo(
    () => new THREE.Vector3(0, 0, explodeFactor * 1.5),
    [explodeFactor]
  );
  const fanOffset = useMemo(
    () => new THREE.Vector3(explodeFactor * 1.6, 0, 0),
    [explodeFactor]
  );
  const damperOffset = useMemo(
    () => new THREE.Vector3(-explodeFactor * 1.4, 0, 0),
    [explodeFactor]
  );

  // Subassembly highlight logic
  const isHvacActive = activeDiscipline === "hvac";
  const isMechActive = activeDiscipline === "mechanical";
  const isProductActive = activeDiscipline === "product" || !activeDiscipline;
  const isSupportActive = activeDiscipline === "support";

  // Base Colors
  const normalEdgeColor = "#7FB2FF";
  const activeSignalColor = "#2F7BFF";
  const occludingFaceColor = "#06142B";

  return (
    <group ref={rootRef} position={[0, -0.4, 0]} scale={1.2}>
      {/* 1. Structural Base Skid Frame (ISMC Channels) */}
      <group position={[0, -0.9, 0]}>
        {/* Longitudinal skid beams */}
        <mesh position={[0, 0, 0.75]}>
          <boxGeometry args={[4.2, 0.15, 0.15]} />
          <meshBasicMaterial color={occludingFaceColor} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(4.2, 0.15, 0.15)]} />
          <lineBasicMaterial
            color={isMechActive || isProductActive ? activeSignalColor : normalEdgeColor}
            linewidth={1.5}
          />
        </lineSegments>

        <mesh position={[0, 0, -0.75]}>
          <boxGeometry args={[4.2, 0.15, 0.15]} />
          <meshBasicMaterial color={occludingFaceColor} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(4.2, 0.15, 0.15)]} />
          <lineBasicMaterial
            color={isMechActive || isProductActive ? activeSignalColor : normalEdgeColor}
            linewidth={1.5}
          />
        </lineSegments>

        {/* Transverse crossmembers */}
        {[-1.8, -0.6, 0.6, 1.8].map((x, i) => (
          <group key={`cross-${i}`} position={[x, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.15, 0.15, 1.5]} />
              <meshBasicMaterial color={occludingFaceColor} polygonOffset polygonOffsetFactor={1} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.15, 0.15, 1.5)]} />
              <lineBasicMaterial
                color={isMechActive || isProductActive ? activeSignalColor : normalEdgeColor}
              />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* 2. Outer Casing Enclosure (Removable Sheet Metal Panels) */}
      <group position={[casingOffset.x, casingOffset.y, casingOffset.z]}>
        {/* Main Casing Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.8, 1.6, 1.6]} />
          <meshBasicMaterial
            color={occludingFaceColor}
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(3.8, 1.6, 1.6)]} />
          <lineBasicMaterial
            color={isMechActive ? activeSignalColor : normalEdgeColor}
            linewidth={2}
          />
        </lineSegments>

        {/* Access Doors & Inspection Window */}
        <group position={[0.2, 0, 0.81]}>
          <mesh>
            <planeGeometry args={[1.2, 1.3]} />
            <meshBasicMaterial color={occludingFaceColor} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 1.3)]} />
            <lineBasicMaterial color={normalEdgeColor} />
          </lineSegments>
          {/* Inspection Viewport circular glass */}
          <lineSegments position={[0, 0.3, 0.01]}>
            <edgesGeometry args={[new THREE.CircleGeometry(0.15, 16)]} />
            <lineBasicMaterial color={activeSignalColor} />
          </lineSegments>
        </group>
      </group>

      {/* 3. Chilled Water Heat Exchanger Coil Assembly */}
      <group position={[coilOffset.x - 0.2, coilOffset.y, coilOffset.z]}>
        {/* Coil Casing Header */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.3, 1.3, 1.4]} />
          <meshBasicMaterial color={occludingFaceColor} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.3, 1.3, 1.4)]} />
          <lineBasicMaterial
            color={isHvacActive ? activeSignalColor : normalEdgeColor}
            linewidth={2}
          />
        </lineSegments>

        {/* Thermal Aluminum Fin Rows (Ribs) */}
        {[-0.5, -0.3, -0.1, 0.1, 0.3, 0.5].map((y, i) => (
          <lineSegments key={`fin-${i}`} position={[0, y, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.28, 0.02)]} />
            <lineBasicMaterial
              color={isHvacActive ? activeSignalColor : normalEdgeColor}
              opacity={0.6}
            />
          </lineSegments>
        ))}

        {/* Coil Copper Supply & Return Headers */}
        <group position={[0.18, 0.2, 0.5]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.CylinderGeometry(0.06, 0.06, 0.8, 12)]} />
            <lineBasicMaterial color={activeSignalColor} />
          </lineSegments>
        </group>
      </group>

      {/* 4. Centrifugal Blower Fan Assembly */}
      <group position={[fanOffset.x + 1.1, fanOffset.y - 0.1, fanOffset.z]}>
        {/* Fan Scroll Housing (Volute) */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.7, 24]} />
          <meshBasicMaterial color={occludingFaceColor} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.CylinderGeometry(0.55, 0.55, 0.7, 24)]} />
          <lineBasicMaterial
            color={isHvacActive ? activeSignalColor : normalEdgeColor}
            linewidth={2}
          />
        </lineSegments>

        {/* Fan Impeller Hub */}
        <lineSegments position={[0, 0, 0]}>
          <edgesGeometry args={[new THREE.CylinderGeometry(0.2, 0.2, 0.72, 16)]} />
          <lineBasicMaterial color={activeSignalColor} />
        </lineSegments>

        {/* Fan Discharge Duct */}
        <mesh position={[0.2, 0.45, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.65]} />
          <meshBasicMaterial color={occludingFaceColor} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <lineSegments position={[0.2, 0.45, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.4, 0.3, 0.65)]} />
          <lineBasicMaterial
            color={isHvacActive ? activeSignalColor : normalEdgeColor}
          />
        </lineSegments>
      </group>

      {/* 5. Air Intake Damper Assembly (Louver Blades) */}
      <group position={[damperOffset.x - 1.6, damperOffset.y, damperOffset.z]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 1.4, 1.4]} />
          <meshBasicMaterial color={occludingFaceColor} polygonOffset polygonOffsetFactor={1} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.2, 1.4, 1.4)]} />
          <lineBasicMaterial color={normalEdgeColor} />
        </lineSegments>

        {/* Opposed Damper Louver Blades */}
        {[-0.5, -0.25, 0, 0.25, 0.5].map((y, i) => (
          <group key={`louver-${i}`} position={[0, y, 0]} rotation={[0.4, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.02, 0.05, 1.3]} />
              <meshBasicMaterial color={occludingFaceColor} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.02, 0.05, 1.3)]} />
              <lineBasicMaterial color={normalEdgeColor} />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* 6. Delta Revision / Support Callout Markers (Active on Support Hover) */}
      {isSupportActive && (
        <group position={[0, 1.2, 0]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.OctahedronGeometry(0.15)]} />
            <lineBasicMaterial color="#E5484D" linewidth={2} />
          </lineSegments>
        </group>
      )}
    </group>
  );
}
