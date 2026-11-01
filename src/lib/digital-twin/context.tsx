"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { CameraPreset, DigitalTwinState } from "./types";

interface DigitalTwinContextValue extends DigitalTwinState {
  setMode: (mode: "story" | "inspector") => void;
  setExplodeFactor: (factor: number) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setSelectedAssemblyId: (id: string | null) => void;
  toggleFullscreen: () => void;
  resetInspector: () => void;
}

const DigitalTwinContext = createContext<DigitalTwinContextValue | null>(null);

export function DigitalTwinProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"story" | "inspector">("story");
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("ISO");
  const [selectedAssemblyId, setSelectedAssemblyId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const resetInspector = useCallback(() => {
    setMode("story");
    setSelectedAssemblyId(null);
    setCameraPreset("ISO");
    setIsFullscreen(false);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      explodeFactor,
      cameraPreset,
      selectedAssemblyId,
      isFullscreen,
      setMode,
      setExplodeFactor,
      setCameraPreset,
      setSelectedAssemblyId,
      toggleFullscreen,
      resetInspector,
    }),
    [mode, explodeFactor, cameraPreset, selectedAssemblyId, isFullscreen, toggleFullscreen, resetInspector]
  );

  return <DigitalTwinContext.Provider value={value}>{children}</DigitalTwinContext.Provider>;
}

export function useDigitalTwin() {
  const ctx = useContext(DigitalTwinContext);
  if (!ctx) {
    throw new Error("useDigitalTwin must be used within a DigitalTwinProvider");
  }
  return ctx;
}
