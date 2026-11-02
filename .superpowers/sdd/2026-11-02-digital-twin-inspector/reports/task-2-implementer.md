# Task 2 Report: Multi-Axis Explosion Kinematics & Sub-Assembly Isolation in `M1AirHandlingUnit.tsx`

Task 2 has been completed successfully following strict TDD and engineering practices.

## 1. Summary of Changes
- **Coordinate Kinematics Math (`src/lib/digital-twin/kinematics.ts`)**:
  - Filter Bank (Module 1): x = -1.15 - explodeFactor * 1.4
  - Cooling Coil (Module 2): x = 0.0
  - Centrifugal Fan (Module 3): x = 1.15 + explodeFactor * 1.4
  - Skid Base: drops vertically along y = -0.7 - explodeFactor * 0.25
  - Contact Shadow: scales along x with args={[4.02 + explodeFactor * 2.8, 1.28]} and tracks ground clearance at y = -0.765 - explodeFactor * 0.25.
- **Sub-Assembly Isolation & Copper Highlighting (`src/components/canvas/M1AirHandlingUnit.tsx`)**:
  - Added selectedAssemblyId to M1AirHandlingUnitProps.
  - Refactored material instances into discrete groups per sub-assembly so individual modules can be dimmed to 0.35 opacity while the active assembly remains at 1.0 opacity.
  - Highlights active sub-assembly components in #F0A06A (Copper).
  - Retains existing discipline mapping behavior and hero mode when selectedAssemblyId === null.
  - Continuous 300ms exponential lerping for smooth color & opacity transitions, with instant snap for reduced motion.

## 2. Test Verification
- `scripts/test-explosion-kinematics.mjs`: PASSED.
- `scripts/test-digital-twin-data.mjs`: PASSED.
- `npm run build`: Compiled production build with 0 TypeScript/lint errors.

## 3. Git Commit
- Commit hash: `cc86391`
