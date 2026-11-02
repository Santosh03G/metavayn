# Task 2: Multi-Axis Explosion Kinematics & Sub-Assembly Isolation in `M1AirHandlingUnit.tsx`

**Files:**
- Modify: `src/components/canvas/M1AirHandlingUnit.tsx`
- Test: `scripts/test-explosion-kinematics.mjs`

**Interfaces:**
- Consumes: `explodeFactor`, `selectedAssemblyId` from `DigitalTwinState`.
- Produces: Dynamic 3D positions with skid vertical drop and component isolation / copper highlight.

**Step 1: Write the failing unit test for explosion kinematics coordinate math**
Write `scripts/test-explosion-kinematics.mjs` verifying:
- `computeKinematics(0)`: filterX = -1.15, coilX = 0, fanX = 1.15, skidY = -0.7.
- `computeKinematics(1.0)`: filterX = -2.55, coilX = 0, fanX = 2.55, skidY = -0.95.

**Step 2: Run test to verify coordinate logic**
Run: `node scripts/test-explosion-kinematics.mjs`

**Step 3: Update `M1AirHandlingUnit.tsx`**
1. Add `selectedAssemblyId?: "filter-bank" | "cooling-coil" | "centrifugal-fan" | "skid-base" | null;` to `M1AirHandlingUnitProps`.
2. Multi-axis explosion kinematics:
   - Module 1 (filter): $x = -1.15 - \text{spacing}$ where $\text{spacing} = \text{explodeFactor} \times 1.4$.
   - Module 2 (coil): $x = 0.0$.
   - Module 3 (fan): $x = 1.15 + \text{spacing}$.
   - Skid base: $y = -0.7 - \text{explodeFactor} \times 0.25$.
   - Shadow: Scale along X to accommodate explosion: `args={[4.02 + explodeFactor * 2.8, 1.28]}`.
3. Sub-assembly isolation and highlight:
   - When `selectedAssemblyId` is active:
     - If `selectedAssemblyId === "filter-bank"`: highlight filter casing & louvers in `#F0A06A` (Copper), dim non-selected modules to opacity 0.35.
     - If `selectedAssemblyId === "cooling-coil"`: highlight coil & pipes in `#F0A06A` (Copper), dim non-selected modules to opacity 0.35.
     - If `selectedAssemblyId === "centrifugal-fan"`: highlight fan housing, wheel & motor in `#F0A06A` (Copper), dim non-selected modules to opacity 0.35.
     - If `selectedAssemblyId === "skid-base"`: highlight skid beams in `#F0A06A` (Copper), dim non-selected modules to opacity 0.35.
   - When `selectedAssemblyId === null`: standard discipline highlight / neutral opacity applies.
   - Ensure clean continuous lerping (approx 300ms) for opacity and color transitions.

**Step 4: Verify build**
Run: `node scripts/test-explosion-kinematics.mjs && npm run build`

**Step 5: Commit**
`git add src/components/canvas/M1AirHandlingUnit.tsx scripts/test-explosion-kinematics.mjs`
`git commit -m "feat(digital-twin): enhance AHU kinematics with vertical skid drop and sub-assembly isolation"`
