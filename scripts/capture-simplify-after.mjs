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

async function captureAfter() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const outDir = path.join(process.cwd(), "reports", "simplify-pass", "after", "home");
  fs.mkdirSync(outDir, { recursive: true });

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const outPath = path.join(outDir, `${vp.name}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Saved simplify after: home @ ${vp.name} -> ${outPath}`);
  }

  // Also check Services and Our Approach
  const srvDir = path.join(process.cwd(), "reports", "simplify-pass", "after", "services");
  const appDir = path.join(process.cwd(), "reports", "simplify-pass", "after", "our-approach");
  fs.mkdirSync(srvDir, { recursive: true });
  fs.mkdirSync(appDir, { recursive: true });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("http://localhost:3000/services", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(srvDir, "1280.png"), fullPage: true });
  console.log("Saved simplify after: services @ 1280");

  await page.goto("http://localhost:3000/our-approach", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(appDir, "1280.png"), fullPage: true });
  console.log("Saved simplify after: our-approach @ 1280");

  await browser.close();
}

captureAfter().catch((err) => {
  console.error("Failed to capture after screenshots:", err);
  process.exit(1);
});