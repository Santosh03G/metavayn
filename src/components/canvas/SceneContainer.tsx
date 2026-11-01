"use client";

import {
  useState,
  useEffect,
  useRef,
  Suspense,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

interface SceneContainerProps {
  children: ReactNode;
  fallback: ReactNode;
  aspectRatio?: string;
  className?: string;
  cameraPosition?: [number, number, number];
  frameloop?: "demand" | "always";
}

export function SceneContainer({
  children,
  fallback,
  aspectRatio = "aspect-square",
  className = "",
  cameraPosition = [4, 3, 5],
  frameloop = "demand",
}: SceneContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Reduced motion check
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", onMotionChange);

    // 2. WebGL support check
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }

    // 3. Intersection Observer to pause rendering when off-screen
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(currentContainer);

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      observer.disconnect();
    };
  }, []);

  const shouldUseFallback =
    hasWebGL === false || reducedMotion || hasWebGL === null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectRatio} overflow-hidden border border-pale-blue/20 bg-black/80 ${className}`}
    >
      {shouldUseFallback ? (
        <div className="w-full h-full flex items-center justify-center p-4">
          {fallback}
        </div>
      ) : isVisible ? (
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center p-4">
              {fallback}
            </div>
          }
        >
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: cameraPosition, fov: 35 }}
            frameloop={frameloop}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: true,
            }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.NoToneMapping;
              gl.outputColorSpace = THREE.SRGBColorSpace;
            }}
          >
            {children}
          </Canvas>
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-4">
          {fallback}
        </div>
      )}

      {/* CAD Datum corners */}
      <div className="absolute top-1 left-1 font-mono text-[8px] text-pale-blue/40 pointer-events-none">
        +0,0
      </div>
      <div className="absolute bottom-1 right-1 font-mono text-[8px] text-pale-blue/40 pointer-events-none">
        R3F/GL
      </div>
    </div>
  );
}
