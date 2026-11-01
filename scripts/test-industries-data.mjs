import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

async function runTest() {
  console.log("Running industries-data unit test...");

  let module;
  try {
    module = await import("../src/lib/industries-data.ts");
  } catch (err) {
    console.error("Failed to import src/lib/industries-data.ts:", err.message);
    process.exit(1);
  }

  const { INDUSTRIES_DATA } = module;

  assert.ok(Array.isArray(INDUSTRIES_DATA), "INDUSTRIES_DATA must be an array");
  assert.equal(INDUSTRIES_DATA.length, 5, "Must contain exactly 5 industries");

  const expected = [
    {
      id: "industrial-equipment",
      number: "01",
      title: "Industrial Equipment",
      description:
        "Engineering support for machinery, equipment, assemblies, and industrial products.",
      visualId: "industrial",
    },
    {
      id: "hvac-thermal",
      number: "02",
      title: "HVAC & Thermal Systems",
      description:
        "Engineering design and documentation support for HVAC and thermal equipment manufacturers.",
      visualId: "hvac",
    },
    {
      id: "manufacturing",
      number: "03",
      title: "Manufacturing",
      description:
        "Production-ready engineering, drawings, BOMs, and manufacturing documentation.",
      visualId: "manufacturing",
    },
    {
      id: "oem-product-development",
      number: "04",
      title: "OEM Product Development",
      description:
        "Dedicated engineering resources for OEMs developing and improving products.",
      visualId: "oem",
    },
    {
      id: "engineering-technology",
      number: "05",
      title: "Engineering & Technology",
      description:
        "Flexible engineering support for companies that require additional design and development capacity.",
      visualId: "tech",
    },
  ];

  expected.forEach((exp, idx) => {
    const actual = INDUSTRIES_DATA[idx];
    assert.equal(actual.id, exp.id, `Item ${idx} ID mismatch`);
    assert.equal(actual.number, exp.number, `Item ${idx} number mismatch`);
    assert.equal(actual.title, exp.title, `Item ${idx} title mismatch`);
    assert.equal(actual.description, exp.description, `Item ${idx} description mismatch`);
    assert.equal(actual.visualId, exp.visualId, `Item ${idx} visualId mismatch`);
  });

  // Verify against content/site-content.md
  const siteContent = fs.readFileSync(path.join(process.cwd(), "content", "site-content.md"), "utf8");
  expected.forEach((exp) => {
    assert.ok(
      siteContent.includes(exp.description),
      `Description for ${exp.title} must exist verbatim in content/site-content.md`
    );
  });

  console.log("All industries-data assertions passed successfully!");
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
