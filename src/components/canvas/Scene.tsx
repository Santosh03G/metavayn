"use client";

import {
  useState,
  useEffect,
  useRef,
  Suspense,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import { type SurfaceType } from "@/components/ui/Button";
import type { CameraPreset } from "@/lib/digital-twin/types";
import { useDigitalTwin } from "@/lib/digital-twin/context";

export const CAMERA_PRESETS: Record<
  CameraPreset,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  ISO: { position: [4.8, 3.2, 4.8], target: [0, 0, 0] },
  FRONT: { position: [0, 0, 6.4], target: [0, 0, 0] },
  PLAN: { position: [0, 7.2, 0.01], target: [0, 0, 0] },
  END: { position: [6.4, 0, 0], target: [0, 0, 0] },
};

interface SceneProps {
  children: ReactNode;
  fallback?: ReactNode;
  aspectRatio?: string;
  surface?: SurfaceType;
  className?: string;
  cameraPosition?: [number, number, number];
  frameloop?: "demand" | "always";
  enableControls?: boolean;
  borderless?: boolean;
  orthographic?: boolean;
  modelScale?: number;
  orthoPadding?: number;
  enableSpringTilt?: boolean; // Up to 4 deg tilt toward cursor with spring physics (k=90, c=20)
  mode?: "story" | "inspector";
  cameraPreset?: CameraPreset;
}

/**
 * Safely access digital twin context without throwing if used outside DigitalTwinProvider.
 */
function useOptionalDigitalTwin() {
  try {
    return useDigitalTwin();
  } catch {
    return null;
  }
}

/**
 * Spring-smoothed cursor tilt controller for hero 3D model:
 * Tilts up to 4 degrees toward cursor with spring physics (stiffness 90, damping 20).
 * Disabled on touch and reduced motion.
 */
function SpringTiltWrapper({
  children,
  enabled = false,
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRot = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    // 4 degrees in radians ~ 0.0698 rad
    const maxTilt = (4 * Math.PI) / 180;

    const handlePointerMove = (e: PointerEvent) => {
      // Explicitly disabled on touch screens
      if (e.pointerType === "touch") return;

      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      targetRot.current.y = normX * maxTilt;
      targetRot.current.x = normY * maxTilt;
    };

    const handlePointerLeave = () => {
      targetRot.current.x = 0;
      targetRot.current.y = 0;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [enabled]);

  useFrame((_, delta) => {
    if (!enabled || !groupRef.current) return;

    // Spring physics equations: stiffness = 90, damping = 20
    const k = 90;
    const damping = 20;
    const dt = Math.min(delta, 0.1);

    // X axis tilt
    const forceX =
      -k * (currentRot.current.x - targetRot.current.x) - damping * velocity.current.x;
    velocity.current.x += forceX * dt;
    currentRot.current.x += velocity.current.x * dt;

    // Y axis tilt
    const forceY =
      -k * (currentRot.current.y - targetRot.current.y) - damping * velocity.current.y;
    velocity.current.y += forceY * dt;
    currentRot.current.y += velocity.current.y * dt;

    groupRef.current.rotation.x = currentRot.current.x;
    groupRef.current.rotation.y = currentRot.current.y;
  });

  if (!enabled) return <>{children}</>;

  return <group ref={groupRef}>{children}</group>;
}

/**
 * Responsive orthographic auto-fit camera controller
 * Ensures on-screen model width is 55-65% of container on desktop,
 * with 8-10% padding and zero crop at all explode values (0 to 1).
 */
function OrthoFitController({
  modelScale = 1.0,
  paddingMargin = 0.09,
}: {
  modelScale?: number;
  paddingMargin?: number;
}) {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!("zoom" in camera)) return;
    const ortho = camera as THREE.OrthographicCamera;

    // Projected width of fully exploded assembly (explodeFactor=1.0) in isometric view
    const maxExplodedProjectedWidth = 6.2 * modelScale * 0.7071;
    // targetZoom provides (1 - paddingMargin) fill at explode 1.0
    const targetZoom = (size.width * (1 - paddingMargin)) / maxExplodedProjectedWidth;

    // Responsive bounds protection for mobile/tablet (< 768px)
    const minZoom = size.width < 500 ? size.width / 11.5 : size.width / 13;
    ortho.zoom = Math.max(targetZoom, minZoom);
    ortho.updateProjectionMatrix();
  }, [camera, size.width, size.height, modelScale, paddingMargin]);

  return null;
}

/**
 * Camera preset controller for Inspector Mode.
 * Smoothly tweens camera position to target preset coordinates using GSAP (0.7s, power2.inOut)
 * and resets OrbitControls target to [0, 0, 0].
 */
function CameraPresetController({
  cameraPreset,
  mode,
  controlsRef,
}: {
  cameraPreset: CameraPreset;
  mode: "story" | "inspector";
  controlsRef: React.RefObject<any>;
}) {
  const { camera } = useThree();
  const prevModeRef = useRef<"story" | "inspector">("story");
  const prevPresetRef = useRef<CameraPreset | null>(null);

  useEffect(() => {
    if (mode !== "inspector") {
      prevModeRef.current = "story";
      prevPresetRef.current = null;
      return;
    }

    const targetPreset = CAMERA_PRESETS[cameraPreset] || CAMERA_PRESETS.ISO;
    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    prevModeRef.current = "inspector";
    prevPresetRef.current = cameraPreset;

    if (isReducedMotion) {
      camera.position.set(
        targetPreset.position[0],
        targetPreset.position[1],
        targetPreset.position[2]
      );
      if (controlsRef.current) {
        controlsRef.current.target.set(
          targetPreset.target[0],
          targetPreset.target[1],
          targetPreset.target[2]
        );
        controlsRef.current.update();
      } else {
        camera.lookAt(
          targetPreset.target[0],
          targetPreset.target[1],
          targetPreset.target[2]
        );
      }
      return;
    }

    // GSAP 0.7s power2.inOut tween to target preset coordinates
    gsap.killTweensOf(camera.position);
    gsap.to(camera.position, {
      x: targetPreset.position[0],
      y: targetPreset.position[1],
      z: targetPreset.position[2],
      duration: 0.7,
      ease: "power2.inOut",
      onUpdate: () => {
        if (controlsRef.current) {
          controlsRef.current.update();
        } else {
          camera.lookAt(
            targetPreset.target[0],
            targetPreset.target[1],
            targetPreset.target[2]
          );
        }
      },
    });

    if (controlsRef.current?.target) {
      const target = controlsRef.current.target;
      gsap.killTweensOf(target);
      gsap.to(target, {
        x: targetPreset.target[0],
        y: targetPreset.target[1],
        z: targetPreset.target[2],
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: () => {
          controlsRef.current?.update();
        },
      });
    }

    return () => {
      gsap.killTweensOf(camera.position);
      if (controlsRef.current?.target) {
        gsap.killTweensOf(controlsRef.current.target);
      }
    };
  }, [cameraPreset, mode, camera, controlsRef]);

  return null;
}

/**
 * Accessible 2D CAD drawing fallback SVG
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
        ORTHOGRAPHIC PROJECTION (STATIC FALLBACK)
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
  cameraPosition = [16, 13, 16],
  frameloop = "always",
  enableControls = false,
  borderless = false,
  orthographic = false,
  modelScale = 1.0,
  orthoPadding = 0.09,
  enableSpringTilt = false,
  mode,
  cameraPreset,
}: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDebug, setIsDebug] = useState(false);

  const dt = useOptionalDigitalTwin();
  const effectiveMode = mode ?? dt?.mode ?? "story";
  const effectivePreset = cameraPreset ?? dt?.cameraPreset ?? "ISO";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsDebug(params.get("debug") === "1");
    }

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

  const borderClass = borderless
    ? ""
    : surface === "royal"
    ? "border border-paper/30"
    : surface === "black"
    ? "border border-pale-blue/30"
    : "border border-paper-line";

  const labelColor =
    surface === "royal"
      ? "text-paper/60"
      : surface === "black"
      ? "text-pale-blue/60"
      : "text-black/50";

  const isInspector = effectiveMode === "inspector";
  const isOrtho = orthographic && !isInspector;
  const initialPosition = isInspector
    ? CAMERA_PRESETS[effectivePreset]?.position ?? [4.8, 3.2, 4.8]
    : cameraPosition;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectRatio} overflow-hidden ${borderClass} bg-transparent ${className}`}
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
            key={isOrtho ? "ortho" : "persp"}
            dpr={[1, 1.75]}
            orthographic={isOrtho}
            camera={
              isOrtho
                ? {
                    position: initialPosition,
                    zoom: 50,
                  }
                : {
                    position: initialPosition,
                    fov: 38,
                  }
            }
            frameloop={isInspector ? "always" : frameloop}
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
            {isOrtho && (
              <OrthoFitController
                modelScale={modelScale}
                paddingMargin={orthoPadding}
              />
            )}

            <CameraPresetController
              cameraPreset={effectivePreset}
              mode={effectiveMode}
              controlsRef={controlsRef}
            />

            {/* Directional lighting without blue-glow bias */}
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 8, 4]} intensity={1.2} />

            <SpringTiltWrapper enabled={enableSpringTilt && !isInspector}>
              {children}
            </SpringTiltWrapper>

            {isInspector ? (
              <OrbitControls
                ref={controlsRef}
                makeDefault
                minDistance={2.5}
                maxDistance={10}
                enableDamping
              />
            ) : (
              enableControls && (
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.8}
                />
              )
            )}
          </Canvas>
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {effectiveFallback}
        </div>
      )}

      {/* Debug-only info: visible only when ?debug=1 */}
      {isDebug && (
        <>
          <div className={`absolute top-1.5 left-2 font-mono text-[9px] ${labelColor} pointer-events-none select-none`}>
            DEBUG: 3D-CAD/GL
          </div>
          <div className={`absolute bottom-1.5 right-2 font-mono text-[9px] ${labelColor} pointer-events-none select-none`}>
            DPR: &le;1.75
          </div>
        </>
      )}
    </div>
  );
}
