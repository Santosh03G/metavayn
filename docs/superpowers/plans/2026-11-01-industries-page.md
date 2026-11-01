# Industries Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Industries page (`/industries`) featuring an interactive master-detail layout, a signature CAD section-cut wipe stage transition, 5 reusable visual representations, and a mobile-friendly stacked fallback.

**Architecture:** A Next.js App Router page alternating between D2 surfaces (Paper header, Black interactive stage, Royal featured block, Black CTA). On desktop ($\ge 1024\text{px}$), the left index list drives a sticky right stage via an animated dual-layer CSS `clip-path` section-cut wipe with datum callout markers. On mobile, it degrades gracefully into a stacked series of lightweight visual cards.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Three.js, `@react-three/fiber`, Playwright.

**Spec:** [`docs/superpowers/specs/2026-11-01-industries-page-design.md`](file:///d:/Santosh/Development/MetavaynBlog/docs/superpowers/specs/2026-11-01-industries-page-design.md)

## Global Constraints
- Exact D2 Palette tokens: `--black: #050505`, `--paper: #F1EEE6`, `--royal: #2347E0`, `--copper: #F0A06A`, `--pale-blue: #9DB2FF`. Zero gradients, zero blue-glow shadows.
- Exact copy from [`content/site-content.md`](file:///d:/Santosh/Development/MetavaynBlog/content/site-content.md#L148-L172). Zero unverified certifications, standards, or tolerances.
- Max line length for body copy: `max-w-[68ch]`. Body scale: 18px at 1280px+, 17px at 768px, 16px at 375px.
- Reuse existing Three.js models and 2D drafting components; no heavy external glTF/bin downloads.
- Respect `prefers-reduced-motion: reduce` by bypassing all clipping line animations.
- 100% WCAG 2.1 AA contrast compliance across all text and interactive states.

---

### Task 1: Data Model & Test Scaffolding

**Files:**
- Create: `src/lib/industries-data.ts`
- Test: `tests/industries/industries-data.test.ts` or Node test script `scripts/test-industries-data.mjs`

**Interfaces:**
- Produces: `IndustryItem`, `INDUSTRIES_DATA: IndustryItem[]`

- [ ] **Step 1: Write the failing unit test**
  Create `scripts/test-industries-data.mjs` checking that all 5 industries exist, contain exact text from `content/site-content.md`, have unique visual IDs, and valid index numbers (`"01"` to `"05"`).
- [ ] **Step 2: Run test to confirm failure**
  Run `node scripts/test-industries-data.mjs` and confirm module missing.
- [ ] **Step 3: Implement `src/lib/industries-data.ts`**
  Define `IndustryItem` interface and export `INDUSTRIES_DATA`.
- [ ] **Step 4: Run test to confirm pass**
  Run `node scripts/test-industries-data.mjs` and verify all assertions pass.
- [ ] **Step 5: Commit**
  `git add src/lib/industries-data.ts scripts/test-industries-data.mjs; git commit -m "feat(industries): add industries data model and unit test"`

---

### Task 2: Visual 1 & Visual 2 (Industrial Equipment & HVAC Airflow)

**Files:**
- Create: `src/components/industries/IndustrialVisual.tsx`
- Create: `src/components/industries/HvacAirflowVisual.tsx`
- Test: Build check via `npm run build` or component rendering test

**Interfaces:**
- Consumes: `M3WeldmentCallout` from `@/components/canvas/M3WeldmentCallout`, `M1AirHandlingUnit` from `@/components/canvas/M1AirHandlingUnit`, `Scene` from `@/components/canvas/Scene`
- Produces: `IndustrialVisual: React.FC<{ surface?: SurfaceType }>`, `HvacAirflowVisual: React.FC<{ surface?: SurfaceType }>`

- [ ] **Step 1: Implement `IndustrialVisual.tsx`**
  Compose the 3D structural ISMC weldment assembly frame in a black Scene with copper weld seams and the CAD weldment callout overlay.
- [ ] **Step 2: Implement `HvacAirflowVisual.tsx`**
  Wrap `M1AirHandlingUnit` in a black isometric Scene with animated streamline paths (`lineSegments` / procedural ribbons in `pale-blue` `#9DB2FF`) flowing across the intake louvers, cooling coil, and discharging through the top collar.
- [ ] **Step 3: Verify TypeScript & Build**
  Run `npm run build` to verify type safety.
- [ ] **Step 4: Commit**
  `git add src/components/industries/IndustrialVisual.tsx src/components/industries/HvacAirflowVisual.tsx; git commit -m "feat(industries): implement Industrial and HVAC visual components"`

---

### Task 3: Visual 3, 4 & 5 (Manufacturing Drawing, OEM Turntable, Modular Blocks)

**Files:**
- Create: `src/components/industries/ManufacturingVisual.tsx`
- Create: `src/components/industries/OemTurntableVisual.tsx`
- Create: `src/components/industries/ModularTeamVisual.tsx`

**Interfaces:**
- Consumes: `BomTable` from `@/components/drawing/BomTable`, `CADModelView` from `@/components/canvas/CADModelView`, `Scene` from `@/components/canvas/Scene`
- Produces: `ManufacturingVisual`, `OemTurntableVisual`, `ModularTeamVisual`

- [ ] **Step 1: Implement `ManufacturingVisual.tsx`**
  Render high-contrast CAD drawing sheet with component orthographic views, part balloon callouts (`①`, `②`, `③`), and structured BOM table.
- [ ] **Step 2: Implement `OemTurntableVisual.tsx`**
  Render `CADModelView` in shaded mode with `autoRotate={true}`, paper body `#F1EEE6`, black wireframe edges, and copper center bore sleeve.
- [ ] **Step 3: Implement `ModularTeamVisual.tsx`**
  Build pure Three.js procedural modular team extension: 3 core cubes (client team) in paper with black edges, and 2 capacity extension cubes in copper and pale-blue smoothly docking into the cluster.
- [ ] **Step 4: Verify TypeScript & Build**
  Run `npm run build` to confirm zero errors.
- [ ] **Step 5: Commit**
  `git add src/components/industries/ManufacturingVisual.tsx src/components/industries/OemTurntableVisual.tsx src/components/industries/ModularTeamVisual.tsx; git commit -m "feat(industries): implement Manufacturing, OEM, and Modular visual components"`

---

### Task 4: Section-Cut Wipe Stage Engine

**Files:**
- Create: `src/components/industries/IndustryStage.tsx`
- Test: Component transition unit test / Playwright test

**Interfaces:**
- Consumes: All 5 industry visual components, `INDUSTRIES_DATA`
- Produces: `IndustryStage: React.FC<{ activeId: string; previousId: string | null; isTransitioning: boolean }>`

- [ ] **Step 1: Implement `IndustryStage.tsx`**
  - Dual-layer layout holding outgoing layer and incoming layer.
  - Hardware-accelerated CSS `clip-path: inset(0 0 0 ${100 - p}%)`.
  - Section-cut hairline in copper `#F0A06A` with top datum `▲ SECTION A–A` and bottom `▼`.
  - Transition duration 400ms (`--ease-cad-deliberate`).
  - Bypass animation under `prefers-reduced-motion: reduce`.
- [ ] **Step 2: Verify animation & clip-path behavior**
  Build and verify zero JSX or Three.js context tearing.
- [ ] **Step 3: Commit**
  `git add src/components/industries/IndustryStage.tsx; git commit -m "feat(industries): implement section-cut wipe stage engine"`

---

### Task 5: Master-Detail Interactive Coordinator & Responsive Mobile Layout

**Files:**
- Create: `src/components/industries/IndustriesInteractiveSection.tsx`

**Interfaces:**
- Consumes: `IndustryStage`, `INDUSTRIES_DATA`, `Container`
- Produces: `IndustriesInteractiveSection: React.FC`

- [ ] **Step 1: Implement `IndustriesInteractiveSection.tsx`**
  - Left column: 5 items with numerals (`01`–`05`), active state weight 600, short copper rule (`h-[2px] w-10 bg-copper`), and hover/focus/scroll triggers.
  - Right column: sticky stage (`lg:sticky lg:top-[calc(50vh-220px)]`).
  - Mobile: clean stacked cards layout with dedicated inline visual for each industry under 1024px.
- [ ] **Step 2: Verify desktop & mobile layouts**
  Check responsive breakpoints (`lg:grid`, mobile `flex-col space-y-12`).
- [ ] **Step 3: Commit**
  `git add src/components/industries/IndustriesInteractiveSection.tsx; git commit -m "feat(industries): implement master-detail interactive section and mobile fallback"`

---

### Task 6: Page Assembly (`/industries`) & Header/Footer Navigation

**Files:**
- Create: `src/app/industries/page.tsx`
- Modify: `src/components/layout/Header.tsx` (ensure route link active highlight works)

- [ ] **Step 1: Assemble `src/app/industries/page.tsx`**
  - Block 1: Paper Header (H1: *"Industries we serve"*, lead paragraph).
  - Block 2: Black Section (`<IndustriesInteractiveSection />`).
  - Block 3: Royal Featured Domain Section (OEM multi-disciplinary integration).
  - Block 4: Black CTA Section (*"Partner with Metavayn"*).
- [ ] **Step 2: Build project**
  Run `npm run build` and ensure `/industries` prerenders cleanly as a static route.
- [ ] **Step 3: Commit**
  `git add src/app/industries/page.tsx src/components/layout/Header.tsx; git commit -m "feat(industries): assemble full industries page route"`

---

### Task 7: Comprehensive Verification, Video Recording & Final Report

**Files:**
- Create: `scripts/verify-industries-page.mjs`
- Create: `reports/industries/`

- [ ] **Step 1: Automated Screenshots**
  Capture screenshots at 375, 768, 1280, 1920 viewports for full page and sections into `reports/industries/`.
- [ ] **Step 2: Motion Review & 4x CPU-Throttled Profiling**
  Record Playwright video of the section-cut wipe transition across all 5 industries; measure FPS under 4x CPU throttle.
- [ ] **Step 3: WCAG 2.1 AA Contrast Audit**
  Audit all text and UI elements across `/industries` for WCAG 2.1 AA compliance (target: 0 failures).
- [ ] **Step 4: Produce Final Report Artifact**
  Write comprehensive verification report in `reports/industries-page-report.md`.
- [ ] **Step 5: Commit**
  `git add scripts/verify-industries-page.mjs reports/industries/; git commit -m "test(industries): add automated verification scripts and performance reports"`
