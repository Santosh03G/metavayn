import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outBase = "d:/Santosh/Development/MetavaynBlog/reports/theme-d2/before";
if (!fs.existsSync(outBase)) {
  fs.mkdirSync(outBase, { recursive: true });
}

const routes = [
  { path: "/", slug: "home" },
  { path: "/services", slug: "services" },
  { path: "/our-approach", slug: "approach" },
  { path: "/dev/styleguide", slug: "styleguide" },
];

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];

async function run() {
  console.log("Capturing BEFORE screenshots across all pages and viewports...");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
  });

  for (const r of routes) {
    const routeDir = path.join(outBase, r.slug);
    if (!fs.existsSync(routeDir)) fs.mkdirSync(routeDir, { recursive: true });

    for (const vp of viewports) {
      console.log(`[BEFORE] ${r.slug} @ ${vp.width}x${vp.height}...`);
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
      });
      await page.goto(`http://localhost:3000${r.path}`, { waitUntil: "domcontentloaded" });
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
          }, 80);
        });
      });
      await page.waitForTimeout(1500);
      const target = path.join(routeDir, `${vp.width}.png`);
      await page.screenshot({ path: target, fullPage: true });
      await page.close();
    }
  }

  await browser.close();
  console.log("All BEFORE screenshots captured successfully.");
}

run().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
