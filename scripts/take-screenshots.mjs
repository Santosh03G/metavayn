import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = "d:/Santosh/Development/MetavaynBlog/verification/approach";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { width: 375, height: 812, name: "approach-375.png" },
  { width: 768, height: 1024, name: "approach-768.png" },
  { width: 1280, height: 800, name: "approach-1280.png" },
  { width: 1920, height: 1080, name: "approach-1920.png" },
];

async function run() {
  console.log("Launching Edge for Our Approach page screenshots...");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
  });

  for (const vp of viewports) {
    console.log(`Rendering ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });
    await page.goto("http://localhost:3000/our-approach", { waitUntil: "domcontentloaded" });
    // Scroll down to trigger all IntersectionObservers
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });
    await page.waitForTimeout(2000); // Allow WebGL & 3D canvas to stabilize
    const target = path.join(outDir, vp.name);
    await page.screenshot({ path: target, fullPage: true });
    console.log(`Saved screenshot: ${target}`);
    await page.close();
  }

  await browser.close();
  console.log("Our Approach page screenshots completed successfully.");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
