/**
 * Multi-axis explosion kinematics calculation for M1 Air Handling Unit.
 * 
 * - Module 1 (Filter Bank): moves left along X axis by 1.4 * explodeFactor
 * - Module 2 (Cooling Coil): fixed at X = 0
 * - Module 3 (Centrifugal Fan): moves right along X axis by 1.4 * explodeFactor
 * - Skid Base: drops vertically along Y axis by 0.25 * explodeFactor
 * - Ground Shadow: expands along X axis to cover exploded footprint
 */
export function computeKinematics(explodeFactor: number = 0) {
  const clamped = Math.max(0, Math.min(1, explodeFactor));
  const spacing = clamped * 1.4;
  return {
    filterX: -1.15 - spacing,
    coilX: 0.0,
    fanX: 1.15 + spacing,
    skidY: -0.7 - clamped * 0.25,
    filterPosX: -1.15 - spacing,
    coilPosX: 0.0,
    fanPosX: 1.15 + spacing,
    skidPosY: -0.7 - clamped * 0.25,
    shadowPosY: -0.765 - clamped * 0.25,
    shadowScaleX: 4.02 + clamped * 2.8,
  };
}
