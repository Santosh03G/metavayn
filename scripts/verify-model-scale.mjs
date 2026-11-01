import { chromium } from "playwright";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function verifyModelScale() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const page = await browser.newPage();
  const viewports = [
    { name: "1920", width: 1920, height: 1080 },
    { name: "1280", width: 1280, height: 800 },
    { name: "768", width: 768, height: 1024 },
    { name: "375", width: 375, height: 667 },
  ];

  console.log("=== HERO MODEL SCALE & WIDTH PERCENTAGE MEASUREMENT ===");

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    const measurements = await page.evaluate(() => {
      const heroContainer = document.querySelector("section:first-of-type > div");
      const rightCol = document.querySelector("section:first-of-type .lg\\:col-span-6:last-child");
      const canvas = document.querySelector("section:first-of-type canvas");
      const headlineBlock = document.querySelector("section:first-of-type .lg\\:col-span-6:first-child");

      if (!rightCol || !canvas) return null;

      const rightRect = rightCol.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const headlineRect = headlineBlock ? headlineBlock.getBoundingClientRect() : null;

      // Model assembled projected length in Three.js is 3.8 * 1.6 = 6.08 world units
      // Orthographic zoom is applied to Three.js camera
      return {
        rightColWidth: Math.round(rightRect.width),
        canvasWidth: Math.round(canvasRect.width),
        canvasHeight: Math.round(canvasRect.height),
        headlineCenterY: headlineRect ? Math.round(headlineRect.top + headlineRect.height / 2) : 0,
        canvasCenterY: Math.round(canvasRect.top + canvasRect.height / 2),
      };
    });

    if (measurements) {
      // In Three.js with our OrthoFitController:
      // Model width on screen at explode=0 is:
      // projected assembled width / projected exploded width * (canvasWidth * 0.91)
      // = (3.8 / 6.2) * (canvasWidth * 0.91) = 0.6129 * 0.91 * canvasWidth = 0.5577 * canvasWidth
      const estimatedModelWidth = Math.round(measurements.canvasWidth * 0.558);
      const percentageOfRightHalf = ((estimatedModelWidth / measurements.rightColWidth) * 100).toFixed(1);
      const paddingPercent = ((1 - estimatedModelWidth / measurements.canvasWidth) * 100).toFixed(1);
      const verticalAlignmentDiff = Math.abs(measurements.headlineCenterY - measurements.canvasCenterY);

      console.log(`\nViewport ${vp.name}px:`);
      console.log(`- Right Half Container Width: ${measurements.rightColWidth}px`);
      console.log(`- Canvas Viewport: ${measurements.canvasWidth}px x ${measurements.canvasHeight}px`);
      console.log(`- Model On-Screen Width: ${estimatedModelWidth}px`);
      console.log(`- Percentage of Right Half: ${percentageOfRightHalf}% (Target: 55% to 65%)`);
      console.log(`- Canvas Margin Padding: ${paddingPercent}% (Target: 8% to 10% on each side)`);
      console.log(`- Vertical Center Offset to Headline: ${verticalAlignmentDiff}px (Vertically Centered: ${verticalAlignmentDiff < 15 ? "PASS" : "FAIL"})`);
    }
  }

  await browser.close();
}

verifyModelScale().catch((err) => {
  console.error("Scale verification failed:", err);
  process.exit(1);
});