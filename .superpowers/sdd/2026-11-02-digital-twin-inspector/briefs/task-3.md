# Task 3: Camera Presets & Interactive Orbit Controls in `Scene.tsx`

**Files:**
- Modify: `src/components/canvas/Scene.tsx`
- Create/Test: `scripts/test-camera-presets.mjs`

**Interfaces:**
- Consumes: `cameraPreset`, `mode` from `useDigitalTwin()`.
- Produces: Smooth 0.7s GSAP camera repositioning between `ISO`, `FRONT`, `PLAN`, and `END` presets; enables free OrbitControls when `mode === "inspector"`.

**Step 1: Write unit test verifying camera preset target vectors**
Create `scripts/test-camera-presets.mjs` checking that `CAMERA_PRESETS` exports:
- `ISO`: position `[4.8, 3.2, 4.8]`, target `[0, 0, 0]`
- `FRONT`: position `[0, 0, 6.4]`, target `[0, 0, 0]`
- `PLAN`: position `[0, 7.2, 0.01]`, target `[0, 0, 0]`
- `END`: position `[6.4, 0, 0]`, target `[0, 0, 0]`

**Step 2: Run test to verify**
Run: `node scripts/test-camera-presets.mjs`

**Step 3: Update `src/components/canvas/Scene.tsx`**
1. Export `CAMERA_PRESETS`.
2. Add camera preset controller inside the Three.js Canvas:
   - When `cameraPreset` changes, tween camera position to target preset coordinates using GSAP (`duration: 0.7s`, `ease: "power2.inOut"` or instant if `prefersReducedMotion`).
   - Also smoothly update `controls.target` to `[0, 0, 0]`.
3. Add `@react-three/drei` `OrbitControls`:
   - When in `inspector` mode: enable `OrbitControls` (`makeDefault`, `minDistance={2.5}`, `maxDistance={10}`, `enableDamping`).
   - When in `story` mode: disable `OrbitControls` and preserve existing cursor/scroll tilt behavior.
4. Ensure `SceneProps` can optionally receive `mode?: "story" | "inspector"` and `cameraPreset?: CameraPreset` (or consume via optional hook/context check).

**Step 4: Verify build**
Run: `node scripts/test-camera-presets.mjs && npm run build`

**Step 5: Commit**
`git add src/components/canvas/Scene.tsx scripts/test-camera-presets.mjs`
`git commit -m "feat(digital-twin): add GSAP camera preset transitions and interactive orbit controls"`
