# Task 1: Sub-Assembly Metadata & Digital Twin State Manager

**Files:**
- Create: `src/lib/digital-twin/types.ts`
- Create: `src/lib/digital-twin/data.ts`
- Create: `src/lib/digital-twin/context.tsx`
- Test: `scripts/test-digital-twin-data.mjs`

**Interfaces:**
- Produces: `SubAssemblyMetadata`, `CameraPreset`, `DigitalTwinState`, `SUB_ASSEMBLIES`, `DigitalTwinProvider`, `useDigitalTwin()`.

**Step 1: Write the failing unit test for sub-assembly data and state exports**
Write `scripts/test-digital-twin-data.mjs` to test `SUB_ASSEMBLIES` (keys: `filter-bank`, `cooling-coil`, `centrifugal-fan`, `skid-base`, verifying name, materialSpecs, manufacturingProcess, designTolerances, validationStandard, and hotspotAnchor).

**Step 2: Run test to verify it fails**
Run: `node scripts/test-digital-twin-data.mjs`

**Step 3: Implement `types.ts`, `data.ts`, and `context.tsx`**
Implement the exact code as detailed in the implementation plan:
- `src/lib/digital-twin/types.ts`
- `src/lib/digital-twin/data.ts`
- `src/lib/digital-twin/context.tsx`

**Step 4: Run test to verify it passes**
Run: `node scripts/test-digital-twin-data.mjs`

**Step 5: Commit**
`git add src/lib/digital-twin/ scripts/test-digital-twin-data.mjs`
`git commit -m "feat(digital-twin): define sub-assembly metadata, types, and state provider"`
