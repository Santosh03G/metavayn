"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { type SurfaceType } from "@/components/ui/Button";

export interface M1AirHandlingUnitProps {
  surface?: SurfaceType;
  explodeFactor?: number; // 0 = assembled, 1 = fully exploded
  activeDiscipline?: string | null;
  mode?: "drawing" | "shaded" | "wireframe";
  interactiveTilt?: boolean;
}

export function M1AirHandlingUnit({
  surface = "royal",
  explodeFactor = 0,
  activeDiscipline = null,
  mode = "shaded",
  interactiveTilt = true,
}: M1AirHandlingUnitProps) {
  const rootRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  // Smooth mouse tilt damping
  useFrame((_, delta) => {
    if (!rootRef.current) return;
    if (interactiveTilt) {
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

  // Exact D2 Color Palette Specification:
  // - black: #050505
  // - paper: #F1EEE6
  // - copper: #F0A06A
  // - paleBlue: #9DB2FF
  // - royal: #2347E0
  // - redline: #E5484D
  const isBlackSection = surface === "black";

  const colors = {
    shellLines: isBlackSection ? "#9DB2FF" : "#F1EEE6",
    shellOpacity: isBlackSection ? 0.25 : 0.30,
    ductFill: "#F1EEE6",
    ductOpacity: isBlackSection ? 0.85 : 1.0,
    blackEdges: "#050505",
    pipeworkCopper: "#F0A06A",
    pumpMotorBody: "#050505",
    pumpMotorAccent: "#9DB2FF",
    chillerFill: "#9DB2FF",
    fanBlack: "#050505",
    floorShadow: "#050505",
    flowDashes: "#F1EEE6",
    redline: "#E5484D",
  };

  return (
    <group ref={rootRef} position={[0, -0.4, 0]} scale={1.2}>
      {/* 0. Floor Shadow Plane */}
      <mesh position={[0, -1.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.8, 2.4]} />
        <meshBasicMaterial
          color={colors.floorShadow}
          transparent
          opacity={0.22}
          toneMapped={false}
        />
      </mesh>

      {/* 1. Structural Base Skid Frame (ISMC Channels) */}
      <group position={[0, -0.9, 0]}>
        {/* Longitudinal skid beams: black body with pale-blue or black edges */}
        <mesh position={[0, 0, 0.75]}>
          <boxGeometry args={[4.2, 0.15, 0.15]} />
          <meshBasicMaterial
            color={colors.pumpMotorBody}
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={1}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(4.2, 0.15, 0.15)]} />
          <lineBasicMaterial
            color={isMechActive || isProductActive ? colors.pumpMotorAccent : colors.blackEdges}
            linewidth={1.5}
          />
        </lineSegments>

        <mesh position={[0, 0, -0.75]}>
          <boxGeometry args={[4.2, 0.15, 0.15]} />
          <meshBasicMaterial
            color={colors.pumpMotorBody}
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={1}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(4.2, 0.15, 0.15)]} />
          <lineBasicMaterial
            color={isMechActive || isProductActive ? colors.pumpMotorAccent : colors.blackEdges}
            linewidth={1.5}
          />
        </lineSegments>

        {/* Transverse crossmembers */}
        {[-1.8, -0.6, 0.6, 1.8].map((x, i) => (
          <group key={`cross-${i}`} position={[x, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.15, 0.15, 1.5]} />
              <meshBasicMaterial
                color={colors.pumpMotorBody}
                toneMapped={false}
                polygonOffset
                polygonOffsetFactor={1}
              />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.15, 0.15, 1.5)]} />
              <lineBasicMaterial
                color={isMechActive || isProductActive ? colors.pumpMotorAccent : colors.blackEdges}
              />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* 2. Outer Casing Enclosure (Building shell lines & Ducts) */}
      <group position={[casingOffset.x, casingOffset.y, casingOffset.z]}>
        {/* Ducts: flat --paper fill with --black edges */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.8, 1.6, 1.6]} />
          <meshBasicMaterial
            color={colors.ductFill}
            transparent={isBlackSection}
            opacity={colors.ductOpacity}
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>
        {/* Black edges around duct box */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(3.8, 1.6, 1.6)]} />
          <lineBasicMaterial color={colors.blackEdges} linewidth={2} />
        </lineSegments>

        {/* Building shell edge lines outside casing */}
        <lineSegments position={[0, 0, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(4.0, 1.8, 1.8)]} />
          <lineBasicMaterial
            color={colors.shellLines}
            transparent
            opacity={colors.shellOpacity}
          />
        </lineSegments>

        {/* Access Doors & Inspection Window */}
        <group position={[0.2, 0, 0.81]}>
          <mesh>
            <planeGeometry args={[1.2, 1.3]} />
            <meshBasicMaterial
              color={colors.ductFill}
              toneMapped={false}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 1.3)]} />
            <lineBasicMaterial color={colors.blackEdges} />
          </lineSegments>
          {/* Inspection Viewport */}
          <lineSegments position={[0, 0.3, 0.01]}>
            <edgesGeometry args={[new THREE.CircleGeometry(0.15, 16)]} />
            <lineBasicMaterial color={colors.pumpMotorAccent} />
          </lineSegments>
        </group>
      </group>

      {/* 3. Chilled Water Heat Exchanger Coil Assembly */}
      <group position={[coilOffset.x - 0.2, coilOffset.y, coilOffset.z]}>
        {/* Coil Casing Header */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.3, 1.3, 1.4]} />
          <meshBasicMaterial
            color={colors.pumpMotorBody}
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={1}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.3, 1.3, 1.4)]} />
          <lineBasicMaterial
            color={isHvacActive ? colors.pumpMotorAccent : colors.blackEdges}
            linewidth={2}
          />
        </lineSegments>

        {/* Thermal Aluminum Fin Rows */}
        {[-0.5, -0.3, -0.1, 0.1, 0.3, 0.5].map((y, i) => (
          <lineSegments key={`fin-${i}`} position={[0, y, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.28, 0.02)]} />
            <lineBasicMaterial
              color={colors.pumpMotorAccent}
              opacity={0.6}
            />
          </lineSegments>
        ))}

        {/* Coil Pipework: --copper (#F0A06A) */}
        <group position={[0.18, 0.2, 0.5]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.8, 16]} />
            <meshBasicMaterial
              color={colors.pipeworkCopper}
              toneMapped={false}
            />
          </mesh>
          {/* Flow dashes on pipes: --paper */}
          <lineSegments position={[0.08, 0, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.01, 0.6)]} />
            <lineBasicMaterial color={colors.flowDashes} />
          </lineSegments>
        </group>
      </group>

      {/* 4. Centrifugal Blower Fan Assembly (Chillers & Fans) */}
      <group position={[fanOffset.x + 1.1, fanOffset.y - 0.1, fanOffset.z]}>
        {/* Fan Scroll Housing (Chillers: --pale-blue fill with --black edges) */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.7, 24]} />
          <meshBasicMaterial
            color={colors.chillerFill}
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={1}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.CylinderGeometry(0.55, 0.55, 0.7, 24)]} />
          <lineBasicMaterial color={colors.blackEdges} linewidth={2} />
        </lineSegments>

        {/* Fan Impeller Hub (Fans: --black) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.72, 16]} />
          <meshBasicMaterial
            color={colors.fanBlack}
            toneMapped={false}
          />
        </mesh>
        <lineSegments position={[0, 0, 0]}>
          <edgesGeometry args={[new THREE.CylinderGeometry(0.2, 0.2, 0.72, 16)]} />
          <lineBasicMaterial color={colors.pumpMotorAccent} />
        </lineSegments>

        {/* Fan Discharge Duct: --paper fill with --black edges */}
        <mesh position={[0.2, 0.45, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.65]} />
          <meshBasicMaterial
            color={colors.ductFill}
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={1}
          />
        </mesh>
        <lineSegments position={[0.2, 0.45, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.4, 0.3, 0.65)]} />
          <lineBasicMaterial color={colors.blackEdges} />
        </lineSegments>
      </group>

      {/* 5. Air Intake Damper Assembly (Louver Blades) */}
      <group position={[damperOffset.x - 1.6, damperOffset.y, damperOffset.z]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 1.4, 1.4]} />
          <meshBasicMaterial
            color={colors.pumpMotorBody}
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={1}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.2, 1.4, 1.4)]} />
          <lineBasicMaterial color={colors.blackEdges} />
        </lineSegments>

        {/* Opposed Damper Louver Blades */}
        {[-0.5, -0.25, 0, 0.25, 0.5].map((y, i) => (
          <group key={`louver-${i}`} position={[0, y, 0]} rotation={[0.4, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.02, 0.05, 1.3]} />
              <meshBasicMaterial color={colors.ductFill} toneMapped={false} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.02, 0.05, 1.3)]} />
              <lineBasicMaterial color={colors.blackEdges} />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* 6. Delta Revision / Support Callout Markers (Active on Support Hover) */}
      {isSupportActive && (
        <group position={[0, 1.2, 0]}>
          <lineSegments>
            <edgesGeometry args={[new THREE.OctahedronGeometry(0.15)]} />
            <lineBasicMaterial color={colors.redline} linewidth={2} />
          </lineSegments>
        </group>
      )}
    </group>
  );
}
