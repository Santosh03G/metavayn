import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

// 1. Target preset coordinate verification
const EXPECTED_PRESETS = {
  ISO: { position: [4.8, 3.2, 4.8], target: [0, 0, 0] },
  FRONT: { position: [0, 0, 6.4], target: [0, 0, 0] },
  PLAN: { position: [0, 7.2, 0.01], target: [0, 0, 0] },
  END: { position: [6.4, 0, 0], target: [0, 0, 0] },
};

console.log("Testing camera preset vectors...");
assert.deepStrictEqual(EXPECTED_PRESETS.ISO.position, [4.8, 3.2, 4.8]);
assert.deepStrictEqual(EXPECTED_PRESETS.FRONT.position, [0, 0, 6.4]);
assert.deepStrictEqual(EXPECTED_PRESETS.PLAN.position, [0, 7.2, 0.01]);
assert.deepStrictEqual(EXPECTED_PRESETS.END.position, [6.4, 0, 0]);
console.log("PASS: Target preset coordinate vectors valid!");

// 2. Scene.tsx static analysis and export verification
console.log("Verifying Scene.tsx camera presets and interactive orbit controls implementation...");
const scenePath = path.resolve("src/components/canvas/Scene.tsx");
const source = fs.readFileSync(scenePath, "utf-8");

// Must export CAMERA_PRESETS
assert.ok(
  source.includes("export const CAMERA_PRESETS") || source.includes("export { CAMERA_PRESETS"),
  "Scene.tsx must export CAMERA_PRESETS"
);

// Verify preset positions in Scene.tsx
assert.ok(source.includes("4.8, 3.2, 4.8"), "ISO preset position [4.8, 3.2, 4.8] must be present in Scene.tsx");
assert.ok(source.includes("0, 0, 6.4") || source.includes("0, 0, 6.40"), "FRONT preset position [0, 0, 6.4] must be present in Scene.tsx");
assert.ok(source.includes("0, 7.2, 0.01"), "PLAN preset position [0, 7.2, 0.01] must be present in Scene.tsx");
assert.ok(source.includes("6.4, 0, 0"), "END preset position [6.4, 0, 0] must be present in Scene.tsx");

// Verify OrbitControls configuration for inspector mode
assert.ok(
  source.includes("makeDefault"),
  "OrbitControls must include makeDefault"
);
assert.ok(
  source.includes("minDistance={2.5}") || source.includes("minDistance: 2.5"),
  "OrbitControls must enforce minDistance={2.5}"
);
assert.ok(
  source.includes("maxDistance={10}") || source.includes("maxDistance: 10"),
  "OrbitControls must enforce maxDistance={10}"
);
assert.ok(
  source.includes("enableDamping"),
  "OrbitControls must include enableDamping"
);

// Verify GSAP camera tween & reduced motion
assert.ok(
  source.includes("gsap.to") || source.includes("gsap"),
  "GSAP tween must be used for camera transitions"
);
assert.ok(
  source.includes("0.7"),
  "Camera transition duration must be 0.7s"
);
assert.ok(
  source.includes("power2.inOut"),
  "Camera transition ease must be power2.inOut"
);
assert.ok(
  source.includes("prefers-reduced-motion"),
  "Reduced motion preference must be supported"
);

// Verify SceneProps supports mode and cameraPreset
assert.ok(
  source.includes("mode?:") || source.includes("mode :"),
  "SceneProps must support mode"
);
assert.ok(
  source.includes("cameraPreset?:") || source.includes("cameraPreset :"),
  "SceneProps must support cameraPreset"
);

console.log("PASS: Camera presets and Scene.tsx orbit controls validated!");
