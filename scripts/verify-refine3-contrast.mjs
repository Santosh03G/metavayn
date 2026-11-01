import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

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

async function verifyContrast() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  const pagesToTest = [
    { name: "home", url: "http://localhost:3000/" },
    { name: "services", url: "http://localhost:3000/services" },
    { name: "approach", url: "http://localhost:3000/our-approach" },
  ];

  let totalTested = 0;
  let totalPassed = 0;
  const failures = [];
  const sampleResults = [];

  for (const p of pagesToTest) {
    await page.goto(p.url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const elementsData = await page.evaluate(() => {
      const results = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      let node;

      while ((node = walker.nextNode())) {
        const el = node;
        const text = (el.innerText || "").trim();
        if (!text || el.children.length > 2) continue;

        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) {
          continue;
        }

        // Get effective background color
        let current = el;
        let bg = style.backgroundColor;
        while (current && (bg === "rgba(0, 0, 0, 0)" || bg === "transparent")) {
          current = current.parentElement;
          if (current) bg = window.getComputedStyle(current).backgroundColor;
        }

        const fontSize = parseFloat(style.fontSize);
        const fontWeight = parseInt(style.fontWeight, 10) || 400;
        const isLarge = fontSize >= 24 || (fontSize >= 18.5 && fontWeight >= 600);

        results.push({
          tag: el.tagName.toLowerCase(),
          text: text.slice(0, 40),
          color: style.color,
          backgroundColor: bg,
          fontSize,
          fontWeight,
          isLarge,
        });
      }

      return results;
    });

    for (const item of elementsData) {
      const fg = parseRgb(item.color);
      const bg = parseRgb(item.backgroundColor);

      if (!fg || !bg) continue;
      // Skip degenerate same color when invisible or background is undefined
      if (fg.r === bg.r && fg.g === bg.g && fg.b === bg.b) continue;

      const ratio = getContrastRatio(fg, bg);
      const required = item.isLarge ? 3.0 : 4.5;
      const pass = ratio >= required;

      totalTested++;
      if (pass) {
        totalPassed++;
        if (sampleResults.length < 25) {
          sampleResults.push({
            page: p.name,
            text: item.text,
            ratio: Math.round(ratio * 100) / 100,
            required,
            pass: true,
          });
        }
      } else {
        failures.push({
          page: p.name,
          text: item.text,
          fg: item.color,
          bg: item.backgroundColor,
          ratio: Math.round(ratio * 100) / 100,
          required,
        });
      }
    }
  }

  await browser.close();

  const report = {
    totalTested,
    totalPassed,
    failureCount: failures.length,
    passRate: `${Math.round((totalPassed / totalTested) * 1000) / 10}%`,
    failures,
    samples: sampleResults,
  };

  const outPath = path.join(process.cwd(), "reports", "refine-3", "contrast-report.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  console.log(`Contrast Check Complete: ${totalPassed}/${totalTested} passed (${report.passRate}). Failures: ${failures.length}`);
}

verifyContrast().catch((err) => {
  console.error("Contrast verification failed:", err);
  process.exit(1);
});
