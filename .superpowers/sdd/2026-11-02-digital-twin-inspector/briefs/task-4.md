# Task 4: Interactive HUD Overlay, Hotspot Pins & Floating Spec Card

**Files:**
- Create: `src/components/digital-twin/DigitalTwinHUD.tsx`
- Create: `src/components/digital-twin/HotspotPin.tsx`
- Create: `src/components/digital-twin/FloatingSpecCard.tsx`
- Test: `scripts/test-hud-components.mjs`

**Interfaces:**
- Consumes: `useDigitalTwin()`, `SUB_ASSEMBLIES`.
- Produces: Complete HUD overlay with top bar, bottom view presets dock, explosion slider, floating spec card (desktop) / bottom-sheet (mobile), and 3D hotspot pins.

**Step 1: Write test script checking HUD accessibility attributes and component definitions**
Write `scripts/test-hud-components.mjs` checking:
- `DigitalTwinHUD.tsx` exports `DigitalTwinHUD`.
- Contains `role="slider"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.
- Contains `aria-label="Resume Story"`.
- View preset buttons have accessible labels for ISO, FRONT, PLAN, END.
- `FloatingSpecCard.tsx` exports `FloatingSpecCard` and renders sub-assembly metadata.
- `HotspotPin.tsx` exports `HotspotPin` with `data-hotspot-id`.

**Step 2: Run test to verify it fails**
Run: `node scripts/test-hud-components.mjs`

**Step 3: Implement components**
1. `src/components/digital-twin/HotspotPin.tsx`:
   - Uses `@react-three/drei` `<Html center>` to render a 3D pin in model space.
   - Circular button styled in Theme D2 palette: `#050505` border, `#F1EEE6` background, pulsing `#2347E0` core.
   - When active (`selectedAssemblyId === id`): `#2347E0` background, `#FFFFFF` text.
   - Sets `data-hotspot-id={id}` and `aria-label={`Inspect ${metadata.name}`}`.
2. `src/components/digital-twin/FloatingSpecCard.tsx`:
   - When `selectedAssemblyId` is set, displays the corresponding sub-assembly metadata from `SUB_ASSEMBLIES`.
   - Desktop: floating card in bottom-right corner of canvas with close button `[ ✕ ]`.
   - Mobile (`< 768px`): slides up as a bottom sheet drawer with swipe/close handle.
   - Shows: Assembly Number & Name, Discipline Badge, Materials, Process, Tolerances, and Standard.
3. `src/components/digital-twin/DigitalTwinHUD.tsx`:
   - Top status bar:
     - Left: `● LIVE CAD INSPECTION // AHU-M1 MODULAR` with subtle pulsing royal dot.
     - Right: `[ ⛶ Fullscreen ]` toggle button + `[ ✕ Resume Story ]` button (`aria-label="Resume Story"`).
   - Bottom dock:
     - 4 View preset buttons (`[ ISO ]`, `[ FRONT ]`, `[ PLAN ]`, `[ END ]`). Clicking updates `cameraPreset`.
     - 0-100% manual explosion slider with `role="slider"`, `aria-label="Explosion gap percentage"`, `aria-valuenow`, keyboard arrow handling, and quick buttons `[ Assemble ]` and `[ Explode ]`.
   - Renders `FloatingSpecCard`.

**Step 4: Verify test passes and build succeeds**
Run: `node scripts/test-hud-components.mjs && npm run build`

**Step 5: Commit**
`git add src/components/digital-twin/ scripts/test-hud-components.mjs`
`git commit -m "feat(digital-twin): implement HUD overlay, 3D hotspot pins, and engineering spec card"`
