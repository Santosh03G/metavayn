import { chromium } from "playwright";
import assert from "node:assert";

async function runVerification() {
  console.log("=================================================");
  console.log("Verifying Digital Twin Inspector Mode Switching");
  console.log("=================================================");

  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });

    console.log("1. Navigating to http://localhost:3000/#what-we-do...");
    await page.goto("http://localhost:3000/#what-we-do", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(1000);

    const section = page.locator("#what-we-do");
    await section.waitFor({ state: "visible", timeout: 10000 });
    console.log("✓ What We Do section is visible");

    // 2. Locate trigger pill
    console.log("2. Checking for 'Inspect CAD Digital Twin' button...");
    const inspectBtn = page.locator('button[aria-label="Inspect CAD Digital Twin"]');
    await inspectBtn.scrollIntoViewIfNeeded();
    await inspectBtn.waitFor({ state: "visible", timeout: 10000 });
    console.log("✓ Found 'Inspect CAD Digital Twin' button");

    // 3. Click trigger pill to enter Inspector Mode
    console.log("3. Clicking 'Inspect CAD Digital Twin'...");
    await inspectBtn.click();
    await page.waitForTimeout(800);

    // 4. Assert Resume Story button is visible
    console.log("4. Verifying HUD and 'Resume Story' button...");
    const resumeBtn = page.locator('button[aria-label="Resume Story"]');
    await resumeBtn.waitFor({ state: "visible", timeout: 5000 });
    const isResumeVisible = await resumeBtn.isVisible();
    assert.ok(isResumeVisible, "Resume Story button must be visible in Inspector Mode");
    console.log("✓ 'Resume Story' button is visible");

    // Check HUD title
    const hudHeader = page.locator('text=LIVE CAD INSPECTION // AHU-M1 MODULAR');
    assert.ok(await hudHeader.isVisible(), "HUD Header must be visible");
    console.log("✓ HUD Header is visible");

    // 5. Test Camera View Preset (e.g. FRONT)
    console.log("5. Testing Camera View Preset buttons...");
    const frontPresetBtn = page.locator('button[aria-label="FRONT view preset"]');
    await frontPresetBtn.waitFor({ state: "visible", timeout: 5000 });
    await frontPresetBtn.click();
    await page.waitForTimeout(400);

    const isFrontPressed = await frontPresetBtn.getAttribute("aria-pressed");
    assert.strictEqual(
      isFrontPressed,
      "true",
      "FRONT preset button must have aria-pressed='true' after click"
    );
    console.log("✓ FRONT camera preset button active");

    // 6. Test Hotspot Pin click ([data-hotspot-id="cooling-coil"])
    console.log("6. Testing Hotspot Pin click for cooling-coil...");
    const hotspotPin = page.locator('[data-hotspot-id="cooling-coil"]');
    await hotspotPin.waitFor({ state: "visible", timeout: 10000 });
    await hotspotPin.click();
    await page.waitForTimeout(500);

    const specCard = page.locator('aside[aria-label*="Cooling Coil"]');
    await specCard.waitFor({ state: "visible", timeout: 5000 });
    const isSpecCardVisible = await specCard.isVisible();
    assert.ok(
      isSpecCardVisible,
      "FloatingSpecCard for Cooling Coil must be visible after pin click"
    );
    console.log("✓ Cooling Coil FloatingSpecCard opened");

    // 7. Test Escape key dismissal
    console.log("7. Testing Escape key behavior...");
    // First Escape: dismiss spec card
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    const specAfterFirstEscape = await specCard.isVisible();
    assert.strictEqual(
      specAfterFirstEscape,
      false,
      "Spec card must be dismissed on first Escape key"
    );
    console.log("✓ First Escape dismissed the spec card");

    // Resume Story button should still be visible (still in inspector mode)
    assert.ok(
      await resumeBtn.isVisible(),
      "Inspector Mode should still be active after dismissing spec card"
    );

    // Second Escape: exit inspector mode
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);

    const resumeAfterSecondEscape = await resumeBtn.isVisible();
    assert.strictEqual(
      resumeAfterSecondEscape,
      false,
      "Resume Story button must be dismissed on second Escape key"
    );
    console.log("✓ Second Escape exited Inspector Mode");

    // Trigger button should be back
    await inspectBtn.waitFor({ state: "visible", timeout: 5000 });
    console.log("✓ 'Inspect CAD Digital Twin' button restored in Story Mode");

    // 8. Test direct Escape exit without active selection
    console.log("8. Testing direct Escape exit from Inspector Mode...");
    await inspectBtn.click();
    await resumeBtn.waitFor({ state: "visible", timeout: 5000 });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
    assert.strictEqual(
      await resumeBtn.isVisible(),
      false,
      "Escape without selection should immediately exit Inspector Mode"
    );
    console.log("✓ Direct Escape successfully exited Inspector Mode");

    // 9. Test Resume Story button click
    console.log("9. Testing 'Resume Story' button click...");
    await inspectBtn.click();
    await resumeBtn.waitFor({ state: "visible", timeout: 5000 });
    await resumeBtn.click();
    await page.waitForTimeout(600);
    assert.strictEqual(
      await resumeBtn.isVisible(),
      false,
      "Clicking 'Resume Story' should exit Inspector Mode"
    );
    console.log("✓ 'Resume Story' button click exited Inspector Mode");

    // 10. Test Fullscreen toggle
    console.log("10. Testing Fullscreen toggle in Inspector Mode...");
    await inspectBtn.click();
    await resumeBtn.waitFor({ state: "visible", timeout: 5000 });

    const fullscreenBtn = page.locator('button[aria-label="Enter Fullscreen"]');
    await fullscreenBtn.waitFor({ state: "visible", timeout: 5000 });
    await fullscreenBtn.click();
    await page.waitForTimeout(400);

    const exitFullscreenBtn = page.locator('button[aria-label="Exit Fullscreen"]');
    await exitFullscreenBtn.waitFor({ state: "visible", timeout: 5000 });
    console.log("✓ Fullscreen toggled on successfully");

    await exitFullscreenBtn.click();
    await page.waitForTimeout(400);
    await fullscreenBtn.waitFor({ state: "visible", timeout: 5000 });
    console.log("✓ Fullscreen toggled off successfully");

    // Clean up to story mode
    await resumeBtn.click();
    await page.waitForTimeout(500);

    console.log("\n=================================================");
    console.log("PASS: All Digital Twin Integration tests passed!");
    console.log("=================================================");
  } finally {
    await browser.close();
  }
}

runVerification().catch((err) => {
  console.error("\n❌ Verification failed:", err);
  process.exit(1);
});
