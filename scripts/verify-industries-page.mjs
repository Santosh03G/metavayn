import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_REPORT_DIR = path.join(process.cwd(), "reports", "industries");
const VIDEOS_DIR = path.join(BASE_REPORT_DIR, "videos");

fs.mkdirSync(BASE_REPORT_DIR, { recursive: true });
fs.mkdirSync(VIDEOS_DIR, { recursive: true });

const VIEWPORTS = [
  { name: "375", width: 375, height: 667 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1920", width: 1920, height: 1080 },
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

async function setupFpsTracking(page) {
  await page.evaluate(() => {
    window.__fpsSamples = [];
    let lastTime = performance.now();
    let frames = 0;
    function measure(now) {
      frames++;
      if (now - lastTime >= 500) {
        window.__fpsSamples.push((frames * 1000) / (now - lastTime));
        frames = 0;
        lastTime = now;
      }
      requestAnimationFrame(measure);
    }
    requestAnimationFrame(measure);
  });
}

async function getAverageFps(page) {
  const samples = await page.evaluate(() => window.__fpsSamples || []);
  if (!samples.length) return 60;
  const sum = samples.reduce((a, b) => a + b, 0);
  return Math.round((sum / samples.length) * 10) / 10;
}

async function verifyIndustriesPage() {
  console.log("=== STARTING INDUSTRIES PAGE VERIFICATION ===");

  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  // 1. Capture Screenshots across all 4 Viewports
  console.log("1. Capturing multi-viewport screenshots...");
  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    const vpDir = path.join(BASE_REPORT_DIR, vp.name);
    fs.mkdirSync(vpDir, { recursive: true });

    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:3000/industries", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    // Full page
    await page.screenshot({ path: path.join(vpDir, "full-page.png"), fullPage: true });

    // Section specific screenshots
    const sections = [
      { name: "header", selector: "section:first-of-type" },
      { name: "interactive-section", selector: "#industries-interactive" },
      { name: "cross-industry", selector: "#cross-industry" },
      { name: "cta", selector: "#industries-cta" },
      { name: "footer", selector: "footer" },
    ];

    for (const sec of sections) {
      const el = await page.$(sec.selector);
      if (el) {
        await el.screenshot({ path: path.join(vpDir, `${sec.name}.png`) });
      }
    }

    // On 1280px, capture each distinct industry stage visual
    if (vp.name === "1280") {
      const items = await page.$$('#industries-interactive div[role="button"]');
      const visualNames = ["industrial", "hvac", "manufacturing", "oem", "tech"];

      for (let i = 0; i < items.length; i++) {
        await items[i].click();
        await page.waitForTimeout(1000); // let section-cut wipe finish
        const stageEl = await page.$('#industries-interactive div[role="region"]');
        if (stageEl) {
          await stageEl.screenshot({
            path: path.join(vpDir, `stage-${visualNames[i]}.png`),
          });
        }
      }
    }

    console.log(`Saved screenshots for viewport ${vp.name}`);
  }

  await page.close();

  // 2. Motion Recording & 4x CPU Throttled Profiling
  console.log("2. Recording motion video with 4x CPU throttling...");
  const motionContext = await browser.newContext({
    recordVideo: {
      dir: VIDEOS_DIR,
      size: { width: 1280, height: 800 },
    },
    viewport: { width: 1280, height: 800 },
  });

  const motionPage = await motionContext.newPage();
  const cdp = await motionContext.newCDPSession(motionPage);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await motionPage.goto("http://localhost:3000/industries#industries-interactive", {
    waitUntil: "domcontentloaded",
  });
  await motionPage.waitForTimeout(1000);
  await setupFpsTracking(motionPage);

  // Cycle through all 5 industries, observing the Section-Cut Wipe
  const buttons = await motionPage.$$('#industries-interactive div[role="button"]');
  for (let i = 0; i < buttons.length; i++) {
    await buttons[i].scrollIntoViewIfNeeded();
    await buttons[i].hover();
    await buttons[i].click();
    await motionPage.waitForTimeout(1800); // observe transition and stage idle
  }

  // Smooth scroll back up
  for (let s = 0; s < 6; s++) {
    await motionPage.mouse.wheel(0, -120);
    await motionPage.waitForTimeout(400);
  }

  const fps = await getAverageFps(motionPage);
  const video = await motionPage.video();
  await motionContext.close();

  if (video) {
    const rawPath = await video.path();
    const destPath = path.join(VIDEOS_DIR, "section-cut-wipe.webm");
    if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    fs.renameSync(rawPath, destPath);
    console.log(`Saved section-cut-wipe.webm (4x throttled FPS: ${fps})`);
  }

  // 3. WCAG 2.1 AA Contrast Audit on /industries
  console.log("3. Running WCAG 2.1 AA Contrast Audit on /industries...");
  const auditPage = await browser.newPage();
  await auditPage.setViewportSize({ width: 1280, height: 800 });
  await auditPage.goto("http://localhost:3000/industries", { waitUntil: "domcontentloaded" });
  await auditPage.waitForTimeout(1500);

  const elementsData = await auditPage.evaluate(() => {
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

  let totalTested = 0;
  let totalPassed = 0;
  const failures = [];
  const samples = [];

  for (const item of elementsData) {
    const fg = parseRgb(item.color);
    const bg = parseRgb(item.backgroundColor);

    if (!fg || !bg) continue;
    if (fg.r === bg.r && fg.g === bg.g && fg.b === bg.b) continue;

    const ratio = getContrastRatio(fg, bg);
    const required = item.isLarge ? 3.0 : 4.5;
    const pass = ratio >= required;

    totalTested++;
    if (pass) {
      totalPassed++;
      if (samples.length < 15) {
        samples.push({
          text: item.text,
          ratio: Math.round(ratio * 100) / 100,
          required,
          pass: true,
        });
      }
    } else {
      failures.push({
        text: item.text,
        fg: item.color,
        bg: item.backgroundColor,
        ratio: Math.round(ratio * 100) / 100,
        required,
      });
    }
  }

  await auditPage.close();
  await browser.close();

  const auditReport = {
    totalTested,
    totalPassed,
    failureCount: failures.length,
    passRate: `${Math.round((totalPassed / totalTested) * 1000) / 10}%`,
    averageFpsThrottled: fps,
    failures,
    samples,
  };

  const reportJsonPath = path.join(BASE_REPORT_DIR, "verification-summary.json");
  fs.writeFileSync(reportJsonPath, JSON.stringify(auditReport, null, 2), "utf8");

  console.log(`Contrast Check on /industries: ${totalPassed}/${totalTested} passed (${auditReport.passRate}). Failures: ${failures.length}`);
  console.log(`Section-Cut Wipe 4x Throttled Average FPS: ${fps}`);
}

verifyIndustriesPage().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
