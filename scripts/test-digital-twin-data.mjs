import assert from "node:assert";

async function run() {
  console.log("Testing Digital Twin data structures and exports...");
  const data = await import("../src/lib/digital-twin/data.ts");
  
  assert.ok(data.SUB_ASSEMBLIES, "SUB_ASSEMBLIES must be defined");
  const keys = Object.keys(data.SUB_ASSEMBLIES);
  assert.deepStrictEqual(keys.sort(), ["centrifugal-fan", "cooling-coil", "filter-bank", "skid-base"].sort(), "Must have all 4 sub-assemblies");
  
  // Verify required engineering spec properties
  for (const [id, item] of Object.entries(data.SUB_ASSEMBLIES)) {
    assert.strictEqual(item.id, id);
    assert.ok(item.name.length > 5, "Name must be descriptive");
    assert.ok(item.materialSpecs.length > 10, "Material specs must be present");
    assert.ok(item.manufacturingProcess.length > 10, "Process must be present");
    assert.ok(item.designTolerances.length > 10, "Tolerances must be present");
    assert.ok(item.validationStandard.length > 5, "Standard must be present");
    assert.strictEqual(item.hotspotAnchor.length, 3, "Hotspot must be [x, y, z]");
  }
  
  console.log("PASS: Sub-assembly data structure validated!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
