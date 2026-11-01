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

async function captureRefine2After() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const outBase = path.join(process.cwd(), "reports", "refine-2", "after");
  fs.mkdirSync(outBase, { recursive: true });

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    const vpDir = path.join(outBase, vp.name);
    fs.mkdirSync(vpDir, { recursive: true });

    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    // Full page screenshot
    await page.screenshot({ path: path.join(vpDir, "full-page.png"), fullPage: true });

    // Section specific screenshots
    const sections = [
      { name: "hero", selector: "section:first-of-type" },
      { name: "what-we-do", selector: "section#what-we-do" },
      { name: "approach", selector: "section#approach" },
      { name: "cta", selector: "section#partner" },
      { name: "footer", selector: "footer" },
    ];

    for (const sec of sections) {
      const el = await page.$(sec.selector);
      if (el) {
        await el.screenshot({ path: path.join(vpDir, `${sec.name}.png`) });
      }
    }
    console.log(`Saved refine-2 after screenshots for viewport ${vp.name}`);
  }

  await browser.close();
  console.log("Refine-2 after screenshots complete!");
}

captureRefine2After().catch((err) => {
  console.error("Failed to capture refine-2 after:", err);
  process.exit(1);
});