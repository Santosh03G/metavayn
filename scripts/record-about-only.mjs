import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const VIDEO_DIR = path.resolve("reports/motion-1/videos");

async function recordAbout() {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
  console.log("Recording updated About Scroll video (1280x800)...");

  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
  });
  const page = await context.newPage();
  const videoPromise = page.video();

  await page.goto("http://localhost:3000/#about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Scroll smoothly through the 150vh pin to showcase:
  // 1. Rough sketch -> 2. Drafting lines & dimensions -> 3. Tonal Royal shaded CAD & Copper pipes
  for (let i = 0; i < 22; i++) {
    await page.mouse.wheel(0, 90);
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(1500);

  await context.close();
  const video = await videoPromise;
  if (video) {
    const videoPath = await video.path();
    const targetPath = path.join(VIDEO_DIR, "about-scroll.webm");
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
    fs.renameSync(videoPath, targetPath);
    console.log(`Saved updated video: ${targetPath}`);
  }

  await browser.close();
}

recordAbout().catch((err) => {
  console.error(err);
  process.exit(1);
});
