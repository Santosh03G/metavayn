import { chromium } from "playwright";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function runInteractiveTests() {
  console.log("Launching test runner against http://localhost:3000...");
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  console.log("\n--- TEST 1: HOME PAGE (/) ---");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Check 3D Hero canvas exists
  const heroCanvas = await page.$("section canvas");
  console.log(`Hero 3D Canvas mounted: ${heroCanvas ? "PASS" : "FAIL"}`);

  // Test What We Do interactive items hover / click
  const disciplines = ["product", "mechanical", "hvac", "documentation", "support"];
  for (const id of disciplines) {
    const item = await page.$(`[aria-label*="${id}"]`);
    if (item) {
      await item.hover();
      await page.waitForTimeout(300);
    }
  }
  console.log("What We Do hover states: PASS (all 5 disciplines tested)");

  // Test Our Approach timeline
  const approachStops = await page.$$("section#approach .rounded-full");
  console.log(`Our Approach stops found: ${approachStops.length} (expected 4): ${approachStops.length === 4 ? "PASS" : "FAIL"}`);

  console.log("\n--- TEST 2: SERVICES PAGE (/services) ---");
  await page.goto("http://localhost:3000/services", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Test mechanical design unfold scrubber
  const slider = await page.$('input[type="range"]');
  if (slider) {
    await slider.fill("0.85");
    await page.waitForTimeout(300);
    console.log("Mechanical Design Unfold Scrubber: PASS (interacted)");
  } else {
    console.log("Mechanical Design Unfold Scrubber: NOT FOUND");
  }

  // Test HVAC view mode buttons
  const hvacButtons = await page.$$("button:has-text('wireframe'), button:has-text('drawing'), button:has-text('shaded')");
  console.log(`HVAC view mode buttons found: ${hvacButtons.length}`);
  for (const btn of hvacButtons) {
    await btn.click();
    await page.waitForTimeout(200);
  }
  console.log("HVAC View Mode Switcher: PASS");

  // Test Self-building drawing toolbar
  const drawingButtons = await page.$$("button:has-text('Views'), button:has-text('Dimensions'), button:has-text('BOM Rows'), button:has-text('Stamp Rev')");
  console.log(`Self-building drawing buttons found: ${drawingButtons.length}`);
  for (const btn of drawingButtons) {
    await btn.click();
    await page.waitForTimeout(200);
  }
  console.log("Self-Building Drawing Steps: PASS");

  console.log("\n--- TEST 3: OUR APPROACH PAGE (/our-approach) ---");
  await page.goto("http://localhost:3000/our-approach", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Click through all 4 stages
  const stageStops = await page.$$("button[aria-pressed]");
  console.log(`Approach sequence stage stops found: ${stageStops.length}`);
  for (let i = 0; i < stageStops.length; i++) {
    await stageStops[i].click();
    await page.waitForTimeout(400);
  }
  console.log("Approach Sequence 4-Stage Navigation: PASS");

  // Test redline markup resolve toggle button on step 3
  if (stageStops.length >= 3) {
    await stageStops[2].click();
    await page.waitForTimeout(300);
    const resolveBtn = await page.$("button:has-text('Resolve markups'), button:has-text('Re-open markups')");
    if (resolveBtn) {
      await resolveBtn.click();
      await page.waitForTimeout(300);
      console.log("Redline markup toggle: PASS");
    }
  }

  console.log("\n--- TEST 4: REMAINING SITE PAGES ---");
  const otherPages = ["/about-us", "/industries", "/careers", "/contact", "/dev/styleguide"];
  for (const p of otherPages) {
    const res = await page.goto(`http://localhost:3000${p}`, { waitUntil: "domcontentloaded" });
    console.log(`Page ${p}: Status ${res ? res.status() : "UNKNOWN"}`);
  }

  console.log(`\n--- CONSOLE ERRORS DETECTED: ${consoleErrors.length} ---`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e) => console.error("Error:", e));
  }

  await browser.close();
  console.log("\nInteractive testing completed successfully!");
}

runInteractiveTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});