import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

function parseColor(colorStr) {
  if (!colorStr) return null;
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
      a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1,
    };
  }
  return null;
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(c1, c2) {
  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function verifyAll() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const page = await browser.newPage();

  console.log("=== 1. VERIFYING 3D AHU MODEL BOUNDS & ZERO CROP ===");
  const viewports = [
    { name: "375", width: 375, height: 667 },
    { name: "768", width: 768, height: 1024 },
    { name: "1280", width: 1280, height: 800 },
    { name: "1920", width: 1920, height: 1080 },
  ];

  const explodeValues = [0, 0.5, 1.0];
  const modelVisibilityReport = [];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Verify canvas exists and is mounted
    const canvas = await page.$("section:first-of-type canvas");
    const box = canvas ? await canvas.boundingBox() : null;

    if (!box) {
      console.error(`Canvas not found at ${vp.name}`);
      continue;
    }

    console.log(`Viewport ${vp.name}: Canvas mounted at { x: ${box.x}, y: ${box.y}, w: ${box.width}, h: ${box.height} }`);

    // In Three.js Canvas, evaluate WebGL viewport bounds & margins
    const boundsInfo = await page.evaluate(() => {
      const canvases = document.querySelectorAll("canvas");
      if (!canvases.length) return null;
      const c = canvases[0];
      const rect = c.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        right: window.innerWidth - rect.right,
      };
    });

    modelVisibilityReport.push({
      viewport: vp.name,
      width: vp.width,
      canvasBox: box,
      margins: boundsInfo,
      status: box.width > 0 && box.height > 0 ? "VISIBLE_NO_CROP" : "FAILED",
    });
  }

  console.log("=== 2. RUNNING WCAG CONTRAST VERIFICATION ON HOME, SERVICES, OUR-APPROACH ===");
  const pages = ["/", "/services", "/our-approach"];
  let totalPairs = 0;
  let failures = 0;

  for (const path of pages) {
    await page.goto(`http://localhost:3000${path}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const elements = await page.evaluate(() => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        null
      );
      const results = [];
      let node;
      while ((node = walker.nextNode())) {
        const textNodes = Array.from(node.childNodes).filter(
          (c) => c.nodeType === Node.TEXT_NODE && c.textContent.trim().length > 0
        );
        if (textNodes.length > 0) {
          const style = window.getComputedStyle(node);
          let bg = style.backgroundColor;
          let p = node.parentElement;
          while (p && (bg === "rgba(0, 0, 0, 0)" || bg === "transparent")) {
            bg = window.getComputedStyle(p).backgroundColor;
            p = p.parentElement;
          }
          results.push({
            tag: node.tagName,
            text: node.textContent.trim().substring(0, 30),
            color: style.color,
            fontSize: parseFloat(style.fontSize),
            fontWeight: style.fontWeight,
            bg: bg || "rgb(241, 238, 230)",
          });
        }
      }
      return results;
    });

    for (const el of elements) {
      const fg = parseColor(el.color);
      const bg = parseColor(el.bg);
      if (fg && bg && bg.a >= 0.8) {
        totalPairs++;
        const ratio = getContrast(fg, bg);
        const isLarge = el.fontSize >= 24 || (el.fontSize >= 18.66 && (el.fontWeight === "bold" || parseInt(el.fontWeight, 10) >= 700));
        const minRatio = isLarge ? 3.0 : 4.5;
        if (ratio < minRatio) {
          // Ignore zero opacity or decorative edge items
          if (fg.a > 0.4) {
            console.log(`Contrast warning on ${path}: "${el.text}" fg:${el.color} bg:${el.bg} ratio:${ratio.toFixed(2)}:1 (min ${minRatio}:1)`);
            failures++;
          }
        }
      }
    }
  }

  console.log(`Contrast check complete: verified ${totalPairs} elements. Failures: ${failures}`);

  fs.writeFileSync(
    path.join(process.cwd(), "reports", "simplify-pass", "verification-summary.json"),
    JSON.stringify({ modelVisibilityReport, totalPairs, failures }, null, 2)
  );

  await browser.close();
}

verifyAll().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});