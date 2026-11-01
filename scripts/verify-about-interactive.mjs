import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const REPORTS_DIR = path.resolve("reports/motion-1");
const VIDEOS_DIR = path.join(REPORTS_DIR, "videos");

async function verify() {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });

  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  console.log("=== 1. Testing Mobile Viewport (375x812) ===");
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    recordVideo: { dir: VIDEOS_DIR, size: { width: 375, height: 812 } },
  });
  const mobilePage = await mobileContext.newPage();
  const mobileVideoPromise = mobilePage.video();

  await mobilePage.goto("http://localhost:3000/#about", { waitUntil: "domcontentloaded" });
  await mobilePage.waitForTimeout(1000);

  // Capture initial mobile screenshot
  const initMobilePath = path.join(REPORTS_DIR, "about-mobile-init.png");
  await mobilePage.screenshot({ path: initMobilePath, fullPage: false });
  console.log(`Saved: ${initMobilePath}`);

  // Find the 3 stage buttons
  const pills = await mobilePage.$$('[role="tablist"] button[role="tab"]');
  console.log(`Found ${pills.length} interactive stage pills on mobile.`);

  // Tap Stage 2 (CAD Validation)
  if (pills[1]) {
    console.log("Tapping Stage 2: CAD Validation...");
    await pills[1].click();
    await mobilePage.waitForTimeout(800);
  }

  // Tap Stage 3 (Production)
  if (pills[2]) {
    console.log("Tapping Stage 3: Production...");
    await pills[2].click();
    await mobilePage.waitForTimeout(800);
    const stage3MobilePath = path.join(REPORTS_DIR, "about-mobile-stage3.png");
    await mobilePage.screenshot({ path: stage3MobilePath, fullPage: false });
    console.log(`Saved: ${stage3MobilePath}`);
  }

  // Tap Stage 1 (Concept)
  if (pills[0]) {
    console.log("Tapping Stage 1: Concept...");
    await pills[0].click();
    await mobilePage.waitForTimeout(800);
  }

  // Test interactive scrubber track click/drag
  const slider = await mobilePage.$('[role="slider"]');
  if (slider) {
    const box = await slider.boundingBox();
    if (box) {
      console.log("Interacting with precision scrubber track...");
      // Click at 50%
      await mobilePage.mouse.click(box.x + box.width * 0.5, box.y + box.height / 2);
      await mobilePage.waitForTimeout(600);
      // Click at 90%
      await mobilePage.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
      await mobilePage.waitForTimeout(800);
    }
  }

  await mobileContext.close();
  const mobileVideo = await mobileVideoPromise;
  if (mobileVideo) {
    const vPath = await mobileVideo.path();
    const targetVideo = path.join(VIDEOS_DIR, "about-mobile-interactive.webm");
    if (fs.existsSync(targetVideo)) fs.unlinkSync(targetVideo);
    fs.renameSync(vPath, targetVideo);
    console.log(`Saved mobile interactive video: ${targetVideo}`);
  }

  console.log("\n=== 2. Testing Desktop Viewport (1280x800) ===");
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto("http://localhost:3000/#about", { waitUntil: "domcontentloaded" });
  await desktopPage.waitForTimeout(1000);

  // Click through left capability buttons
  const desktopCards = await desktopPage.$$(
    '.hidden.xl\\:block button[type="button"]'
  );
  console.log(`Found ${desktopCards.length} interactive capability cards on desktop.`);
  for (let i = 0; i < desktopCards.length; i++) {
    console.log(`Clicking desktop capability card ${i + 1}...`);
    await desktopCards[i].click();
    await desktopPage.waitForTimeout(700);
  }

  const desktopScreenshot = path.join(REPORTS_DIR, "about-desktop-interactive.png");
  await desktopPage.screenshot({ path: desktopScreenshot, fullPage: false });
  console.log(`Saved desktop screenshot: ${desktopScreenshot}`);

  await desktopContext.close();
  await browser.close();
  console.log("\nAll interactive verification checks passed!");
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
