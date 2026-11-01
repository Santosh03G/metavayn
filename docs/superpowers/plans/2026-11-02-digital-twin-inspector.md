# Interactive 3D Digital Twin & Assembly Inspector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the 3D procedural Air Handling Unit on the Home Page ("What We Do" section) into an interactive CAD Digital Twin featuring manual explosion scrubbing, 4 engineering camera presets (`ISO`, `FRONT`, `PLAN`, `END`), clickable 3D sub-assembly hotspots, and floating technical specification cards.

**Architecture:** A dual-mode state architecture (`story` vs `inspector`) that coordinates with Lenis smooth-scroll. In Story Mode, normal scroll-driven discipline highlights run. Entering Inspector Mode pauses Lenis scroll, unlocks 3D orbit controls, animates the camera to designated presets, expands the unit via a manual slider, and presents a precision industrial HUD with sub-assembly metadata cards.

**Tech Stack:** Next.js 15, React 19, Three.js, React Three Fiber, GSAP, Lenis, Tailwind CSS, Playwright.

**Spec:** [`docs/superpowers/specs/2026-11-02-digital-twin-inspector-design.md`](file:///d:/Santosh/Development/MetavaynBlog/docs/superpowers/specs/2026-11-02-digital-twin-inspector-design.md)

## Global Constraints
- Strictly adhere to Theme D2 tokens: Paper `#F4F0EA` / `#F1EEE6`, Black `#050505`, Royal Blue `#2347E0`, Copper `#F0A06A`.
- No layout-triggering properties animated; animate only `transform`, `opacity`, and Three.js matrices/positions.
- Maintain stable 60 fps on standard desktop and $\ge 45$ fps on 4x CPU throttle.
- Strict WCAG 2.1 AA accessibility: keyboard navigation (`Esc` to exit, `Tab` focus, `Arrow` keys on slider) and `prefers-reduced-motion` compliance.

---

### Task 1: Sub-Assembly Metadata & Digital Twin State Manager

**Files:**
- Create: `src/lib/digital-twin/types.ts`
- Create: `src/lib/digital-twin/data.ts`
- Create: `src/lib/digital-twin/context.tsx`
- Test: `scripts/test-digital-twin-data.mjs`

**Interfaces:**
- Produces: `SubAssemblyMetadata`, `CameraPreset`, `DigitalTwinState`, `SUB_ASSEMBLIES`, `DigitalTwinProvider`, `useDigitalTwin()`.

- [ ] **Step 1: Write the failing unit test for sub-assembly data and state exports**

```javascript
// scripts/test-digital-twin-data.mjs
import assert from "node:assert";

async function run() {
  console.log("Testing Digital Twin data structures and exports...");
  const data = await import("../src/lib/digital-twin/data.ts");
  
  assert.ok(data.SUB_ASSEMBLIES, "SUB_ASSEMBLIES must be defined");
  const keys = Object.keys(data.SUB_ASSEMBLIES);
  assert.deepStrictEqual(keys.sort(), ["centrifugal-fan", "cooling-coil", "filter-bank", "skid-base"].sort(), "Must have all 4 sub-assemblies");
  
  // Verify required engineering spec properties
  for (const [id, item] of Object.entries(data.SUB_ASSEMBLIES)) {
    assert.strictEqual(item.id, id);
    assert.ok(item.name.length > 5, "Name must be descriptive");
    assert.ok(item.materialSpecs.length > 10, "Material specs must be present");
    assert.ok(item.manufacturingProcess.length > 10, "Process must be present");
    assert.ok(item.designTolerances.length > 10, "Tolerances must be present");
    assert.ok(item.validationStandard.length > 5, "Standard must be present");
    assert.strictEqual(item.hotspotAnchor.length, 3, "Hotspot must be [x, y, z]");
  }
  
  console.log("PASS: Sub-assembly data structure validated!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-digital-twin-data.mjs`  
Expected: FAIL with "Cannot find module '../src/lib/digital-twin/data.ts'"

- [ ] **Step 3: Implement `types.ts`, `data.ts`, and `context.tsx`**

```typescript
// src/lib/digital-twin/types.ts
export type CameraPreset = "ISO" | "FRONT" | "PLAN" | "END";

export interface SubAssemblyMetadata {
  id: "filter-bank" | "cooling-coil" | "centrifugal-fan" | "skid-base";
  num: string;
  name: string;
  discipline: string;
  hotspotAnchor: [number, number, number];
  materialSpecs: string;
  manufacturingProcess: string;
  designTolerances: string;
  validationStandard: string;
}

export interface DigitalTwinState {
  mode: "story" | "inspector";
  explodeFactor: number; // 0.0 to 1.0
  cameraPreset: CameraPreset;
  selectedAssemblyId: string | null;
  isFullscreen: boolean;
}
```

```typescript
// src/lib/digital-twin/data.ts
import { SubAssemblyMetadata } from "./types";

export const SUB_ASSEMBLIES: Record<string, SubAssemblyMetadata> = {
  "filter-bank": {
    id: "filter-bank",
    num: "01",
    name: "Air Intake & Filtration Module",
    discipline: "HVAC & Thermal Engineering",
    hotspotAnchor: [-1.4, 0.35, 0.65],
    materialSpecs: "1.6mm Galvanized Steel (GI) Casing, Synthetic Pre-Filters, MERV 14 Bag Filters",
    manufacturingProcess: "CNC Turret Punching, CNC Press-Brake Folding, Polyurethane Gasket Sealing",
    designTolerances: "±0.5 mm diagonal squareness, Air Leakage Class L1 compliant",
    validationStandard: "EN 1886:2007 (Mechanical Performance & Casing Strength)",
  },
  "cooling-coil": {
    id: "cooling-coil",
    num: "02",
    name: "Chilled Water Cooling Coil Section",
    discipline: "Mechanical Design Engineering",
    hotspotAnchor: [0.0, 0.25, 0.65],
    materialSpecs: "Seamless Copper Tubes (Ø12.7mm OD Cu-DHP), Corrugated Al Fins (14 FPI), SS304 Tray",
    manufacturingProcess: "Precision Mechanical Tube Expansion, CNC Hairpin Bending, Orbital TIG Welded Headers",
    designTolerances: "Fin spacing variance < 2%, Hydrostatic pressure tested to 2.5 MPa (360 psi)",
    validationStandard: "AHRI Standard 410 / ASME Boiler & Pressure Vessel Code Sec VIII",
  },
  "centrifugal-fan": {
    id: "centrifugal-fan",
    num: "03",
    name: "Centrifugal Blower & Drive Assembly",
    discipline: "Product Engineering",
    hotspotAnchor: [1.35, -0.05, 0.65],
    materialSpecs: "Backward-Curved DIDW Impeller, Laser-cut Scroll Housing, IE3 Motor, Cast Iron Bearings",
    manufacturingProcess: "Laser Profile Cutting, Dynamic Dual-Plane Balancing, Precision Shaft Turn-Grind",
    designTolerances: "Shaft radial runout < 0.02 mm, Vibration severity < 1.8 mm/s RMS at 1800 RPM",
    validationStandard: "AMCA 210 (Airflow & Static Efficiency) / ISO 1940 Grade G2.5",
  },
  "skid-base": {
    id: "skid-base",
    num: "04",
    name: "Structural C-Channel Foundation Skid",
    discipline: "Manufacturing Readiness",
    hotspotAnchor: [0.0, -0.68, 0.65],
    materialSpecs: "ISMC 100 Structural Steel C-Channels, Hot-Dip Galvanized (85µm minimum coating)",
    manufacturingProcess: "Full-Penetration Structural MIG Welding, Integrated Rigging/Lifting Lugs",
    designTolerances: "Diagonal camber tolerance < 2.0 mm over 4.0 m length, Deflection < L/500",
    validationStandard: "AWS D1.1 (Structural Welding Code - Steel) / ISO 1461",
  },
};
```

```tsx
// src/lib/digital-twin/context.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { CameraPreset, DigitalTwinState } from "./types";

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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-digital-twin-data.mjs`  
Expected: PASS: Sub-assembly data structure validated!

- [ ] **Step 5: Commit**

```bash
git add src/lib/digital-twin/ scripts/test-digital-twin-data.mjs
git commit -m "feat(digital-twin): define sub-assembly metadata, types, and state provider"
```

---

### Task 2: Multi-Axis Explosion Kinematics & Sub-Assembly Isolation in `M1AirHandlingUnit.tsx`

**Files:**
- Modify: `src/components/canvas/M1AirHandlingUnit.tsx`
- Test: `scripts/test-explosion-kinematics.mjs`

**Interfaces:**
- Consumes: `explodeFactor`, `selectedAssemblyId` from `DigitalTwinState`.
- Produces: Dynamic 3D positions with skid vertical drop and component isolation / copper highlight.

- [ ] **Step 1: Write the failing unit test for explosion kinematics coordinate math**

```javascript
// scripts/test-explosion-kinematics.mjs
import assert from "node:assert";

function computeKinematics(explodeFactor) {
  const clamped = Math.max(0, Math.min(1, explodeFactor));
  const spacing = clamped * 1.4;
  return {
    filterX: -1.15 - spacing,
    coilX: 0.0,
    fanX: 1.15 + spacing,
    skidY: -0.7 - clamped * 0.25,
  };
}

console.log("Testing explosion kinematics coordinates...");

// At 0% (assembled)
const assembled = computeKinematics(0);
assert.strictEqual(assembled.filterX, -1.15);
assert.strictEqual(assembled.coilX, 0.0);
assert.strictEqual(assembled.fanX, 1.15);
assert.strictEqual(assembled.skidY, -0.7);

// At 100% (fully exploded)
const exploded = computeKinematics(1.0);
assert.strictEqual(exploded.filterX, -2.55);
assert.strictEqual(exploded.coilX, 0.0);
assert.strictEqual(exploded.fanX, 2.55);
assert.strictEqual(exploded.skidY, -0.95);

console.log("PASS: Explosion kinematics validated!");
```

- [ ] **Step 2: Run test to verify coordinate logic**

Run: `node scripts/test-explosion-kinematics.mjs`  
Expected: PASS: Explosion kinematics validated!

- [ ] **Step 3: Update `M1AirHandlingUnit.tsx` with multi-axis explosion kinematics and sub-assembly highlight**

Update `M1AirHandlingUnit.tsx` so that:
1. `selectedAssemblyId` is supported as an optional prop (`"filter-bank" | "cooling-coil" | "centrifugal-fan" | "skid-base" | null`).
2. When `selectedAssemblyId` is active, that specific sub-assembly transitions to `#F0A06A` (Copper), while non-selected assemblies drop to 35% opacity to focus inspection on the selected part.
3. Skid base drops along Y: `const skidPosY = -0.7 - explodeFactor * 0.25;`.

- [ ] **Step 4: Verify Next.js build passes with updated component**

Run: `npm run build`  
Expected: Compiled successfully with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/M1AirHandlingUnit.tsx scripts/test-explosion-kinematics.mjs
git commit -m "feat(digital-twin): enhance AHU kinematics with vertical skid drop and sub-assembly isolation"
```

---

### Task 3: Camera Presets & Interactive Orbit Controls in `Scene.tsx`

**Files:**
- Modify: `src/components/canvas/Scene.tsx`
- Test: `scripts/test-camera-presets.mjs`

**Interfaces:**
- Consumes: `cameraPreset`, `mode` from `useDigitalTwin()`.
- Produces: Smooth 0.7s GSAP camera repositioning between `ISO`, `FRONT`, `PLAN`, and `END` presets; enables free OrbitControls when `mode === "inspector"`.

- [ ] **Step 1: Write the failing test verifying camera preset target vectors**

```javascript
// scripts/test-camera-presets.mjs
import assert from "node:assert";

const CAMERA_PRESETS = {
  ISO: { position: [4.8, 3.2, 4.8], target: [0, 0, 0] },
  FRONT: { position: [0, 0, 6.4], target: [0, 0, 0] },
  PLAN: { position: [0, 7.2, 0.01], target: [0, 0, 0] },
  END: { position: [6.4, 0, 0], target: [0, 0, 0] },
};

console.log("Testing camera preset vectors...");
assert.deepStrictEqual(CAMERA_PRESETS.ISO.position, [4.8, 3.2, 4.8]);
assert.deepStrictEqual(CAMERA_PRESETS.FRONT.position, [0, 0, 6.4]);
assert.deepStrictEqual(CAMERA_PRESETS.PLAN.position, [0, 7.2, 0.01]);
assert.deepStrictEqual(CAMERA_PRESETS.END.position, [6.4, 0, 0]);
console.log("PASS: Camera presets valid!");
```

- [ ] **Step 2: Run test to verify**

Run: `node scripts/test-camera-presets.mjs`  
Expected: PASS: Camera presets valid!

- [ ] **Step 3: Update `Scene.tsx` to handle preset camera transitions and OrbitControls**

Implement `CameraController` inside `Scene.tsx`:
- When in `inspector` mode, mount Drei `<OrbitControls makeDefault minDistance={2.5} maxDistance={10} enableDamping />`.
- When `cameraPreset` changes, animate the camera position using `gsap.to(camera.position, { ... })` and update the OrbitControls target smoothly.
- When `prefers-reduced-motion` is detected, set camera position immediately without duration.

- [ ] **Step 4: Verify build**

Run: `npm run build`  
Expected: Build passes cleanly.

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/Scene.tsx scripts/test-camera-presets.mjs
git commit -m "feat(digital-twin): add GSAP camera preset transitions and interactive orbit controls"
```

---

### Task 4: Interactive HUD Overlay, Hotspot Pins & Floating Spec Card

**Files:**
- Create: `src/components/digital-twin/DigitalTwinHUD.tsx`
- Create: `src/components/digital-twin/HotspotPin.tsx`
- Create: `src/components/digital-twin/FloatingSpecCard.tsx`
- Test: `scripts/test-hud-components.mjs`

**Interfaces:**
- Produces: Complete HUD overlay with top bar, bottom view presets dock, explosion slider, and floating spec card (desktop) / bottom-sheet (mobile).

- [ ] **Step 1: Write test script checking HUD accessibility attributes and component definitions**

```javascript
// scripts/test-hud-components.mjs
import fs from "node:fs";
import assert from "node:assert";

console.log("Validating HUD component accessibility structures...");
const hudSrc = fs.readFileSync("src/components/digital-twin/DigitalTwinHUD.tsx", "utf-8");
assert.ok(hudSrc.includes('role="slider"'), "Explosion slider must have role='slider'");
assert.ok(hudSrc.includes("aria-valuenow"), "Slider must have aria-valuenow");
assert.ok(hudSrc.includes("aria-label"), "HUD buttons must have accessible labels");
console.log("PASS: HUD accessibility validated!");
```

- [ ] **Step 2: Run test to verify it fails before creation**

Run: `node scripts/test-hud-components.mjs`  
Expected: FAIL (file does not exist)

- [ ] **Step 3: Implement `DigitalTwinHUD.tsx`, `HotspotPin.tsx`, and `FloatingSpecCard.tsx`**

- `DigitalTwinHUD.tsx`:
  - Top status bar: `● LIVE CAD INSPECTION // AHU-M1 MODULAR` + `[ ⛶ Fullscreen ]` + `[ ✕ Resume Story ]`.
  - Bottom dock: 4 View preset buttons (`ISO`, `FRONT`, `PLAN`, `END`) + 0-100% manual explosion slider with `[ Assemble ]` / `[ Explode ]` quick buttons.
- `FloatingSpecCard.tsx`:
  - Renders active sub-assembly title, discipline tag, alloy materials, fabrication method, tolerances, and design standards.
  - Desktop: floating card in bottom-right.
  - Mobile: slide-up bottom-sheet drawer with dismiss handle.
- `HotspotPin.tsx`:
  - Interactive 3D pin placed at `hotspotAnchor` in model space. Clicking selects that assembly and opens the spec card.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-hud-components.mjs`  
Expected: PASS: HUD accessibility validated!

- [ ] **Step 5: Commit**

```bash
git add src/components/digital-twin/ scripts/test-hud-components.mjs
git commit -m "feat(digital-twin): implement HUD overlay, 3D hotspot pins, and engineering spec card"
```

---

### Task 5: Mode Switching Integration in "What We Do" Section

**Files:**
- Modify: `src/components/home/WhatWeDoSection.tsx`
- Test: `scripts/verify-digital-twin-full.mjs`

**Interfaces:**
- Wraps `WhatWeDoSection` with `DigitalTwinProvider`.
- Renders `[ ⊕ Inspect CAD Digital Twin ]` button on the 3D card.
- Pauses Lenis smooth scroll on entry (`lenis.stop()`), resumes on exit (`lenis.start()`).
- Binds `Escape` key listener to exit Inspector Mode.

- [ ] **Step 1: Write integration Playwright test for dual-mode switching**

```javascript
// scripts/verify-digital-twin-full.mjs
import { chromium } from "playwright";
import assert from "node:assert";

async function verify() {
  console.log("Verifying Dual-Mode Digital Twin Inspector on localhost:3000...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto("http://localhost:3000/#what-we-do", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // 1. Check for trigger button
  const triggerBtn = await page.$('button[aria-label="Inspect CAD Digital Twin"]');
  assert.ok(triggerBtn, "Inspect CAD Digital Twin button must exist");

  // 2. Click to enter Inspector Mode
  await triggerBtn.click();
  await page.waitForTimeout(800);

  // 3. Verify HUD elements visible
  const exitBtn = await page.$('button[aria-label="Resume Story"]');
  assert.ok(exitBtn, "Resume Story button must be visible in Inspector Mode");

  // 4. Test View Presets
  const frontPreset = await page.$('button[aria-label="View Front Elevation"]');
  if (frontPreset) await frontPreset.click();
  await page.waitForTimeout(600);

  // 5. Test Hotspot Selection
  const coilPin = await page.$('[data-hotspot-id="cooling-coil"]');
  if (coilPin) await coilPin.click();
  await page.waitForTimeout(600);

  // 6. Test Exit via Escape key
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);

  const exitBtnAfter = await page.$('button[aria-label="Resume Story"]');
  assert.strictEqual(exitBtnAfter, null, "Inspector Mode must be dismissed");

  await browser.close();
  console.log("PASS: Digital Twin integration verified successfully!");
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Update `WhatWeDoSection.tsx` to integrate Digital Twin Provider, HUD, and Lenis coordination**

- Add `[ ⊕ Inspect CAD Digital Twin ]` trigger badge to the 3D canvas container.
- Connect `useLenis` to call `lenis?.stop()` when `mode === "inspector"` and `lenis?.start()` when exiting.
- Add `Escape` key event listener.

- [ ] **Step 3: Run full build and test verification**

Run: `npm run build && node scripts/verify-digital-twin-full.mjs`  
Expected: PASS: Digital Twin integration verified successfully!

- [ ] **Step 4: Commit**

```bash
git add src/components/home/WhatWeDoSection.tsx scripts/verify-digital-twin-full.mjs
git commit -m "feat(digital-twin): integrate dual-mode inspector with Lenis scroll lifecycle"
```

---

### Task 6: Visual Evidence, 60 FPS Benchmark & Video Capture

**Files:**
- Output: `reports/motion-1/videos/digital-twin-inspector.webm`
- Output: `reports/motion-1/digital-twin-desktop.png`
- Output: `reports/motion-1/digital-twin-mobile.png`

**Interfaces:**
- Produces: Recorded high-framerate video and mobile/desktop screenshots verifying all inspection states.

- [ ] **Step 1: Write capture script recording end-to-end inspection walkthrough**

Create `scripts/record-digital-twin.mjs` to record:
1. Entering Inspector Mode from What We Do section.
2. Scrubbing explosion slider from 0% to 100%.
3. Clicking through `ISO`, `FRONT`, `PLAN`, and `END` camera presets.
4. Selecting the Cooling Coil and Centrifugal Fan hotspots to display floating spec cards.
5. Capturing mobile viewport (375px) with bottom-sheet drawer.
6. Benchmarking frame rate (verifying 60 fps target).

- [ ] **Step 2: Execute recording script**

Run: `node scripts/record-digital-twin.mjs`  
Expected: Video saved to `reports/motion-1/videos/digital-twin-inspector.webm` with average fps $\ge 58\text{ fps}$.

- [ ] **Step 3: Commit visual reports**

```bash
git add reports/motion-1/ scripts/record-digital-twin.mjs
git commit -m "chore(digital-twin): add verification video, screenshots, and 60fps benchmark"
```
