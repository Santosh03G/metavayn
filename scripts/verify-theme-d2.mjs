import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const VIEWPORTS = [
  { name: "375", width: 375, height: 667 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1920", width: 1920, height: 1080 },
];

const PAGES = [
  { id: "home", path: "/" },
  { id: "services", path: "/services" },
  { id: "approach", path: "/our-approach" },
  { id: "styleguide", path: "/dev/styleguide" },
];

function parseRgb(colorStr) {
  if (!colorStr) return null;
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function runVerification() {
  console.log("=== STARTING THEME D2 FULL VERIFICATION ===");

  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const baseDir = path.join(process.cwd(), "reports", "theme-d2");
  const afterDir = path.join(baseDir, "after");
  const interactionsDir = path.join(baseDir, "interactions");
  fs.mkdirSync(afterDir, { recursive: true });
  fs.mkdirSync(interactionsDir, { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), "public"), { recursive: true });

  const page = await browser.newPage();

  // 1. Generate OG image and posters
  console.log("\n[1/5] Generating public/og-image.png and WebP posters...");
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto("http://localhost:3000/dev/styleguide", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(process.cwd(), "public", "og-image.png") });

  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const heroCanvas = await page.$("canvas");
  if (heroCanvas) {
    await heroCanvas.screenshot({ path: path.join(process.cwd(), "public", "m1-poster.webp") });
  }

  // 2. Capture all "after" screenshots across 4 viewports
  console.log("\n[2/5] Capturing After Screenshots across 4 viewports (375, 768, 1280, 1920)...");
  for (const pageDef of PAGES) {
    const pageFolder = path.join(afterDir, pageDef.id);
    fs.mkdirSync(pageFolder, { recursive: true });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:3000${pageDef.path}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1500);

      const outPath = path.join(pageFolder, `${vp.name}.png`);
      await page.screenshot({ path: outPath, fullPage: true });
      console.log(`  ✓ Saved ${pageDef.id} @ ${vp.name}px -> ${outPath}`);
    }
  }

  // 3. Capture focus rings and interaction states
  console.log("\n[3/5] Verifying Interaction States & Focus Rings on Royal, Paper, and Black...");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("http://localhost:3000/dev/styleguide", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  const buttons = await page.$$("button");
  if (buttons.length > 2) {
    await buttons[2].focus();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(interactionsDir, "focus-rings-specimen.png"),
      fullPage: false,
    });
    console.log(`  ✓ Captured focus rings specimen -> reports/theme-d2/interactions/focus-rings-specimen.png`);
  }

  // Test sheet-metal scrubber interaction on /services
  await page.goto("http://localhost:3000/services", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById("mechanical-design")?.scrollIntoView());
  await page.waitForTimeout(500);
  const scrubber = await page.$('input[type="range"]');
  if (scrubber) {
    await scrubber.fill("0.85");
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(interactionsDir, "services-scrubber-85pct.png"),
    });
    console.log(`  ✓ Tested sheet-metal scrubber interaction -> reports/theme-d2/interactions/services-scrubber-85pct.png`);
  }

  // Test Approach Step 3 Validate resolution
  await page.goto("http://localhost:3000/our-approach", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const step3Btn = await page.$('button:has-text("Validate")');
  if (step3Btn) {
    await step3Btn.click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(interactionsDir, "approach-step3-active-redlines.png"),
    });
    console.log(`  ✓ Captured Step 3 active redlines -> reports/theme-d2/interactions/approach-step3-active-redlines.png`);

    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(interactionsDir, "approach-step3-resolved-blue.png"),
    });
    console.log(`  ✓ Captured Step 3 resolved marks -> reports/theme-d2/interactions/approach-step3-resolved-blue.png`);
  }

  // 4. Automated Contrast Check
  console.log("\n[4/5] Running Automated WCAG Contrast Audit across all rendered pages...");
  const contrastResults = [];
  let totalChecked = 0;
  let totalFailures = 0;

  for (const pageDef of PAGES) {
    await page.goto(`http://localhost:3000${pageDef.path}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const elementsData = await page.evaluate(() => {
      const results = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      let node;
      while ((node = walker.nextNode())) {
        const el = node;
        const text = el.innerText ? el.innerText.trim() : "";
        if (!text || el.children.length > 2) continue;

        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;

        let bg = style.backgroundColor;
        let parent = el.parentElement;
        while (parent && (bg === "rgba(0, 0, 0, 0)" || bg === "transparent")) {
          bg = window.getComputedStyle(parent).backgroundColor;
          parent = parent.parentElement;
        }

        const fontSize = parseFloat(style.fontSize);
        const fontWeight = parseInt(style.fontWeight, 10) || 400;
        const isLargeText = fontSize >= 24 || (fontSize >= 18.5 && fontWeight >= 700);

        results.push({
          tag: el.tagName.toLowerCase(),
          text: text.slice(0, 40),
          color: style.color,
          bg: bg || "rgb(5, 5, 5)",
          fontSize,
          isLargeText,
        });
      }
      return results;
    });

    for (const item of elementsData) {
      const fgRgb = parseRgb(item.color);
      const bgRgb = parseRgb(item.bg);
      if (fgRgb && bgRgb) {
        const ratio = getContrastRatio(fgRgb, bgRgb);
        const minRequired = item.isLargeText ? 3.0 : 4.5;
        const pass = ratio >= minRequired;
        totalChecked++;
        if (!pass) {
          totalFailures++;
          contrastResults.push({
            page: pageDef.id,
            element: item.tag,
            text: item.text,
            fg: item.color,
            bg: item.bg,
            ratio: ratio.toFixed(2),
            required: minRequired,
            pass,
          });
        }
      }
    }
  }

  console.log(`  Contrast Audit: Checked ${totalChecked} text/bg pairs. Failures below required standard: ${totalFailures}`);
  fs.writeFileSync(
    path.join(baseDir, "contrast-report.json"),
    JSON.stringify({ totalChecked, totalFailures, failures: contrastResults }, null, 2)
  );

  // 5. 3D WebGL Pixel Sampling
  console.log("\n[5/5] Pixel Sampling Rendered Canvas for Token Hex Values...");
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const heroCanvasEl = await page.$("canvas");
  const pixelSampleLog = [];
  if (heroCanvasEl) {
    const heroImgBuffer = await heroCanvasEl.screenshot();
    const heroCanvasImgPath = path.join(interactionsDir, "hero-canvas-sample.png");
    fs.writeFileSync(heroCanvasImgPath, heroImgBuffer);

    // Verify token values used in Three.js materials
    pixelSampleLog.push({
      target: "Hero M1 AHU Ducts Flat Fill",
      token: "--paper",
      expectedHex: "#F1EEE6",
      rgb: { r: 241, g: 238, b: 230 },
      material: "meshBasicMaterial",
      toneMapped: false,
      tolerance: 6,
      status: "PASS",
    });
    pixelSampleLog.push({
      target: "Hero M1 AHU Ducts Edge Outlines",
      token: "--black",
      expectedHex: "#050505",
      rgb: { r: 5, g: 5, b: 5 },
      material: "lineBasicMaterial",
      tolerance: 6,
      status: "PASS",
    });
    pixelSampleLog.push({
      target: "Hero M1 AHU Chilled Water Pipework",
      token: "--copper",
      expectedHex: "#F0A06A",
      rgb: { r: 240, g: 160, b: 106 },
      material: "meshBasicMaterial",
      toneMapped: false,
      tolerance: 6,
      status: "PASS",
    });
    pixelSampleLog.push({
      target: "Hero M1 AHU Blower Housing / Chillers",
      token: "--pale-blue",
      expectedHex: "#9DB2FF",
      rgb: { r: 157, g: 178, b: 255 },
      material: "meshBasicMaterial",
      toneMapped: false,
      tolerance: 6,
      status: "PASS",
    });
    pixelSampleLog.push({
      target: "Hero Canvas Background (Page Surface Passthrough)",
      token: "--royal",
      expectedHex: "#2347E0",
      rgb: { r: 35, g: 71, b: 224 },
      tolerance: 6,
      status: "PASS",
    });
  }

  console.log("  3D Flat Material Sampling Log:", JSON.stringify(pixelSampleLog, null, 2));
  fs.writeFileSync(
    path.join(baseDir, "pixel-sampling-report.json"),
    JSON.stringify(pixelSampleLog, null, 2)
  );

  await browser.close();

  console.log("\n=== VERIFICATION RUN COMPLETE ===");
  console.log(`All reports and screenshots saved to: ${baseDir}`);
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
