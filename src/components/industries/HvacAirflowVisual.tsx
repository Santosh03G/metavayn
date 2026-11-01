"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Scene } from "@/components/canvas/Scene";
import { M1AirHandlingUnit } from "@/components/canvas/M1AirHandlingUnit";
import { type SurfaceType } from "@/components/ui/Button";

function AirflowStreamlines() {
  const pointsRef = useRef<THREE.Points>(null);

  // Exact D2 Palette Tokens
  const COLOR_PALE_BLUE = useMemo(() => new THREE.Color("#9DB2FF"), []);
  const COLOR_COPPER = useMemo(() => new THREE.Color("#F0A06A"), []);

  // 3 distinct streamline trajectories through the AHU
  const curves = useMemo(() => {
    return [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.4, 0.25, 0.1),
        new THREE.Vector3(-1.15, 0.25, 0.1),
        new THREE.Vector3(0.0, 0.2, 0.1),
        new THREE.Vector3(1.15, 0.15, 0.1),
        new THREE.Vector3(1.3, 0.85, 0.05),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.4, -0.05, -0.15),
        new THREE.Vector3(-1.15, -0.05, -0.15),
        new THREE.Vector3(0.0, -0.05, -0.1),
        new THREE.Vector3(1.15, 0.05, -0.05),
        new THREE.Vector3(1.3, 0.85, -0.05),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.4, -0.3, 0.2),
        new THREE.Vector3(-1.15, -0.3, 0.2),
        new THREE.Vector3(0.0, -0.25, 0.15),
        new THREE.Vector3(1.15, 0.0, 0.1),
        new THREE.Vector3(1.3, 0.85, 0.0),
      ]),
    ];
  }, []);

  // Static streamline guide lines
  const lineGeometries = useMemo(() => {
    return curves.map((curve) => {
      const pts = curve.getPoints(50);
      return new THREE.BufferGeometry().setFromPoints(pts);
    });
  }, [curves]);

  // Moving airflow particles
  const particleCount = 45;
  const { positions, colors, offsets } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const offs = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      offs[i] = i / particleCount;
      col[i * 3] = COLOR_PALE_BLUE.r;
      col[i * 3 + 1] = COLOR_PALE_BLUE.g;
      col[i * 3 + 2] = COLOR_PALE_BLUE.b;
    }
    return { positions: pos, colors: col, offsets: offs };
  }, [COLOR_PALE_BLUE]);

  const particlesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute;

    for (let i = 0; i < particleCount; i++) {
      const curveIndex = i % curves.length;
      const curve = curves[curveIndex];
      // Animate progress smoothly along curve (looping 0 to 1)
      const u = (time * 0.45 + offsets[i]) % 1.0;
      const pt = curve.getPoint(u);

      posAttr.setXYZ(i, pt.x, pt.y, pt.z);

      // Color shifts to copper as air crosses the finned heating/cooling coil (x around 0.0)
      if (pt.x > -0.3 && pt.x < 0.4) {
        colAttr.setXYZ(i, COLOR_COPPER.r, COLOR_COPPER.g, COLOR_COPPER.b);
      } else {
        colAttr.setXYZ(i, COLOR_PALE_BLUE.r, COLOR_PALE_BLUE.g, COLOR_PALE_BLUE.b);
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <group position={[0, -0.05, 0]}>
      {/* 1. Thin aerodynamic guideline streamlines */}
      {lineGeometries.map((geo, idx) => {
        const lineObj = new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({
            color: "#9DB2FF",
            transparent: true,
            opacity: 0.35,
          })
        );
        return <primitive key={`streamline-${idx}`} object={lineObj} />;
      })}

      {/* 2. Moving airflow pulse particles */}
      <points ref={pointsRef} geometry={particlesGeo}>
        <pointsMaterial
          size={0.07}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export function HvacAirflowVisual({
  surface = "black",
}: {
  surface?: SurfaceType;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-black text-paper relative select-none overflow-hidden">
      {/* 3D AHU Model with Airflow Streamlines */}
      <div className="w-full flex-1 min-h-[260px] sm:min-h-[300px]">
        <Scene
          surface={surface}
          aspectRatio="aspect-[16/10]"
          orthographic={true}
          cameraPosition={[16, 13, 16]}
          borderless={true}
          modelScale={1.3}
        >
          <M1AirHandlingUnit
            surface="black"
            explodeFactor={0.35}
            activeDiscipline="hvac"
          />
          <AirflowStreamlines />
        </Scene>
      </div>

      {/* Technical Airflow Telemetry Bar */}
      <div className="border border-pale-blue/20 bg-black/80 px-3.5 py-2 font-mono text-[10px] sm:text-xs flex flex-wrap items-center justify-between gap-2 mt-3">
        <span className="text-pale-blue flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-copper animate-pulse" />
          THERMAL STREAMLINES ACTIVE
        </span>
        <span className="text-paper/80">AIR VELOCITY: 2.4 m/s</span>
        <span className="text-paper/60 hidden sm:inline">ΔT: 11.2 K</span>
      </div>
    </div>
  );
}
