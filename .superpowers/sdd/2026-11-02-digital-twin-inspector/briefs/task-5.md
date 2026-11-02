# Task 5: Mode Switching Integration in "What We Do" Section

**Files:**
- Modify: `src/components/home/WhatWeDoSection.tsx`
- Test: `scripts/verify-digital-twin-full.mjs`

**Interfaces:**
- Consumes: `DigitalTwinProvider`, `useDigitalTwin()`, `DigitalTwinHUD`, `DigitalTwinHotspots`, `useLenis`.
- Produces: Seamless dual-mode integration in `WhatWeDoSection.tsx`.

**Step 1: Write integration Playwright test for dual-mode switching**
Create `scripts/verify-digital-twin-full.mjs`:
- Launches browser (using `channel: "msedge"`, headless).
- Navigates to `http://localhost:3000/#what-we-do`.
- Finds `button[aria-label="Inspect CAD Digital Twin"]` and clicks it.
- Asserts `button[aria-label="Resume Story"]` is visible.
- Tests View Preset click (e.g. `FRONT`).
- Tests Hotspot Pin click (`[data-hotspot-id="cooling-coil"]`).
- Tests `Escape` key to exit Inspector Mode.
- Asserts `Resume Story` button is dismissed.

**Step 2: Update `WhatWeDoSection.tsx`**
1. Wrap the section with `<DigitalTwinProvider>` (either split into inner component or wrap root).
2. Inside `WhatWeDoContent`:
   - Connect `const digitalTwin = useDigitalTwin();` and `const lenis = useLenis();`.
   - When `digitalTwin.mode === "inspector"`:
     - Pause Lenis: `lenis?.stop();`.
     - Mount `<DigitalTwinHUD />` over the canvas.
     - Mount `<DigitalTwinHotspots />` inside the `<Scene>`.
     - Pass `explodeFactor={digitalTwin.explodeFactor}` and `selectedAssemblyId={digitalTwin.selectedAssemblyId}` to `<M1AirHandlingUnit />`.
     - Pass `mode={digitalTwin.mode}` and `cameraPreset={digitalTwin.cameraPreset}` to `<Scene />`.
   - When `digitalTwin.mode === "story"`:
     - Resume Lenis: `lenis?.start();`.
     - Render trigger pill in top-right of 3D card:
       ```tsx
       <button
         type="button"
         onClick={() => {
           digitalTwin.setMode("inspector");
           digitalTwin.setExplodeFactor(0.5); // Open to 50% to invite discovery
         }}
         aria-label="Inspect CAD Digital Twin"
         className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-paper/90 backdrop-blur-sm border border-paper-line text-black text-caption font-semibold hover:bg-black hover:text-white transition-all shadow-sm"
       >
         <span className="w-2 h-2 rounded-full bg-royal animate-pulse" />
         <span>Inspect CAD Assembly</span>
       </button>
       ```
   - Keyboard listener for `Escape`:
     - If `digitalTwin.selectedAssemblyId`: `digitalTwin.setSelectedAssemblyId(null);`
     - Else if `digitalTwin.mode === "inspector"`: `digitalTwin.resetInspector();`
   - Fullscreen support:
     - If `digitalTwin.isFullscreen`: style canvas container as `fixed inset-0 z-50 bg-paper p-4 md:p-8 flex flex-col justify-center items-center`.
3. Ensure unmounting or page navigation cleanly resumes Lenis.

**Step 3: Run full build and test verification**
Ensure production server is running or start it, then run:
`npm run build && node scripts/verify-digital-twin-full.mjs`

**Step 4: Commit**
`git add src/components/home/WhatWeDoSection.tsx scripts/verify-digital-twin-full.mjs`
`git commit -m "feat(digital-twin): integrate dual-mode inspector with Lenis scroll lifecycle"`
