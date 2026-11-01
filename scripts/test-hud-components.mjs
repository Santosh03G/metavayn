import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";

console.log("Validating HUD component accessibility structures and component definitions...");

const hudPath = path.resolve("src/components/digital-twin/DigitalTwinHUD.tsx");
const specCardPath = path.resolve("src/components/digital-twin/FloatingSpecCard.tsx");
const hotspotPath = path.resolve("src/components/digital-twin/HotspotPin.tsx");

// 1. DigitalTwinHUD.tsx validation
console.log("Checking DigitalTwinHUD.tsx...");
assert.ok(fs.existsSync(hudPath), "src/components/digital-twin/DigitalTwinHUD.tsx must exist");
const hudSrc = fs.readFileSync(hudPath, "utf-8");

assert.ok(
  hudSrc.includes("export function DigitalTwinHUD") || hudSrc.includes("export const DigitalTwinHUD"),
  "DigitalTwinHUD.tsx must export DigitalTwinHUD"
);

assert.ok(
  hudSrc.includes('role="slider"'),
  "DigitalTwinHUD must contain role=\"slider\""
);

assert.ok(
  hudSrc.includes("aria-valuenow"),
  "DigitalTwinHUD slider must contain aria-valuenow"
);

assert.ok(
  hudSrc.includes('aria-valuemin="0"') || hudSrc.includes("aria-valuemin={0}"),
  "DigitalTwinHUD slider must contain aria-valuemin=\"0\""
);

assert.ok(
  hudSrc.includes('aria-valuemax="100"') || hudSrc.includes("aria-valuemax={100}"),
  "DigitalTwinHUD slider must contain aria-valuemax=\"100\""
);

assert.ok(
  hudSrc.includes('aria-label="Resume Story"'),
  "DigitalTwinHUD must contain aria-label=\"Resume Story\""
);

// Preset buttons accessible labels
const presets = ["ISO", "FRONT", "PLAN", "END"];
for (const preset of presets) {
  assert.ok(
    hudSrc.includes(preset),
    `DigitalTwinHUD must contain preset button for ${preset}`
  );
  assert.ok(
    hudSrc.toLowerCase().includes(`${preset.toLowerCase()} view`) ||
    hudSrc.toLowerCase().includes(`${preset.toLowerCase()} camera`) ||
    hudSrc.toLowerCase().includes(`view ${preset.toLowerCase()}`),
    `DigitalTwinHUD must have accessible label for ${preset} view preset`
  );
}

// 2. FloatingSpecCard.tsx validation
console.log("Checking FloatingSpecCard.tsx...");
assert.ok(fs.existsSync(specCardPath), "src/components/digital-twin/FloatingSpecCard.tsx must exist");
const specCardSrc = fs.readFileSync(specCardPath, "utf-8");

assert.ok(
  specCardSrc.includes("export function FloatingSpecCard") || specCardSrc.includes("export const FloatingSpecCard"),
  "FloatingSpecCard.tsx must export FloatingSpecCard"
);

// Verifies sub-assembly metadata rendering
assert.ok(
  specCardSrc.includes("materialSpecs"),
  "FloatingSpecCard must render materialSpecs"
);
assert.ok(
  specCardSrc.includes("manufacturingProcess"),
  "FloatingSpecCard must render manufacturingProcess"
);
assert.ok(
  specCardSrc.includes("designTolerances"),
  "FloatingSpecCard must render designTolerances"
);
assert.ok(
  specCardSrc.includes("validationStandard"),
  "FloatingSpecCard must render validationStandard"
);

// 3. HotspotPin.tsx validation
console.log("Checking HotspotPin.tsx...");
assert.ok(fs.existsSync(hotspotPath), "src/components/digital-twin/HotspotPin.tsx must exist");
const hotspotSrc = fs.readFileSync(hotspotPath, "utf-8");

assert.ok(
  hotspotSrc.includes("export function HotspotPin") || hotspotSrc.includes("export const HotspotPin"),
  "HotspotPin.tsx must export HotspotPin"
);

assert.ok(
  hotspotSrc.includes("data-hotspot-id"),
  "HotspotPin must set data-hotspot-id"
);

assert.ok(
  hotspotSrc.includes("Html"),
  "HotspotPin must use Drei Html component"
);

console.log("PASS: All HUD components validated successfully!");
