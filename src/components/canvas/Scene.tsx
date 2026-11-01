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
import { OrbitControls } from "@react-three/drei";
import { type SurfaceType } from "@/components/ui/Button";

interface SceneProps {
  children: ReactNode;
  fallback?: ReactNode;
  aspectRatio?: string;
  surface?: SurfaceType;
  className?: string;
  cameraPosition?: [number, number, number];
  frameloop?: "demand" | "always";
  enableControls?: boolean;
}

/**
 * Accessible 2D CAD blueprint fallback SVG
 * rendered when WebGL is absent, loading, or under reduced motion.
 */
function DefaultDrawingFallback({ surface = "royal" }: { surface?: SurfaceType }) {
  const isRoyal = surface === "royal";
  const isBlack = surface === "black";
  const strokeColor = isRoyal ? "var(--paper)" : isBlack ? "var(--pale-blue)" : "var(--black)";

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-6 select-none bg-transparent"
      role="img"
      aria-label="2D Technical Drawing Isometric Blueprint Fallback"
    >
      <svg
        className="w-32 h-32"
        style={{ stroke: strokeColor }}
        viewBox="0 0 100 100"
        fill="none"
        strokeWidth="1.2"
      >
        <ellipse cx="50" cy="50" rx="35" ry="20" />
        <ellipse cx="50" cy="58" rx="35" ry="20" strokeDasharray="3,3" />
        <ellipse cx="50" cy="50" rx="16" ry="9" />
        <ellipse cx="50" cy="58" rx="16" ry="9" strokeDasharray="3,3" />
        <line x1="50" y1="20" x2="50" y2="80" strokeDasharray="2,4" opacity="0.4" />
        <line x1="10" y1="50" x2="90" y2="50" strokeDasharray="2,4" opacity="0.4" />
        <circle cx="28" cy="50" r="3" />
        <circle cx="72" cy="50" r="3" />
      </svg>
      <span
        className="font-mono text-mono-xs mt-2"
        style={{ color: strokeColor, opacity: 0.7 }}
      >
        ISO 128 ORTHOGRAPHIC PROJECTION (STATIC FALLBACK)
      </span>
    </div>
  );
}

export function Scene({
  children,
  fallback,
  aspectRatio = "aspect-video",
  surface = "royal",
  className = "",
  cameraPosition = [3, 2.5, 4],
  frameloop = "always",
  enableControls = true,
}: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", onMotionChange);

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

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "300px" }
    );
    observer.observe(el);

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      observer.disconnect();
    };
  }, []);

  const effectiveFallback = fallback || <DefaultDrawingFallback surface={surface} />;
  const shouldUseFallback =
    hasWebGL === false || reducedMotion || hasWebGL === null;

  const borderClass =
    surface === "royal"
      ? "border-paper/30"
      : surface === "black"
      ? "border-pale-blue/30"
      : "border-paper-line";

  const labelColor =
    surface === "royal"
      ? "text-paper/60"
      : surface === "black"
      ? "text-pale-blue/60"
      : "text-black/50";

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectRatio} overflow-hidden border ${borderClass} bg-transparent ${className}`}
    >
      {shouldUseFallback ? (
        <div className="w-full h-full flex items-center justify-center">
          {effectiveFallback}
        </div>
      ) : isVisible ? (
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              {effectiveFallback}
            </div>
          }
        >
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: cameraPosition, fov: 38 }}
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
            {/* Ambient + Directional lighting without blue-glow bias */}
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 8, 4]} intensity={1.2} />

            {children}

            {enableControls && (
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.8}
              />
            )}
          </Canvas>
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {effectiveFallback}
        </div>
      )}

      {/* CAD Datum corners */}
      <div className={`absolute top-1.5 left-2 font-mono text-[9px] ${labelColor} pointer-events-none select-none`}>
        VIEW: 3D-CAD/GL
      </div>
      <div className={`absolute bottom-1.5 right-2 font-mono text-[9px] ${labelColor} pointer-events-none select-none`}>
        DPR: &le;1.75
      </div>
    </div>
  );
}
