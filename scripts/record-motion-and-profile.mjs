import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const VIDEOS_DIR = path.join(process.cwd(), "reports", "refine-3", "videos");

fs.mkdirSync(VIDEOS_DIR, { recursive: true });

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

async function recordMotionAndProfile() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const fpsResults = {};

  // ==========================================
  // 1. HERO VIDEO (Cursor Tilt & Explode)
  // ==========================================
  console.log("Recording hero motion video (1280px)...");
  const heroContext = await browser.newContext({
    recordVideo: {
      dir: VIDEOS_DIR,
      size: { width: 1280, height: 800 },
    },
    viewport: { width: 1280, height: 800 },
  });

  const heroPage = await heroContext.newPage();
  const heroCdp = await heroContext.newCDPSession(heroPage);
  await heroCdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await heroPage.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await heroPage.waitForTimeout(1000);
  await setupFpsTracking(heroPage);

  // Smooth mouse movement across hero canvas
  for (let i = 0; i < 6; i++) {
    await heroPage.mouse.move(750 + i * 50, 300 + (i % 2 === 0 ? 80 : -80), { steps: 20 });
    await heroPage.waitForTimeout(500);
  }

  // Smooth scroll down to explode assembly
  for (let step = 0; step < 8; step++) {
    await heroPage.mouse.wheel(0, 100);
    await heroPage.waitForTimeout(400);
  }

  // Smooth scroll back up to assemble
  for (let step = 0; step < 8; step++) {
    await heroPage.mouse.wheel(0, -100);
    await heroPage.waitForTimeout(400);
  }

  await heroPage.waitForTimeout(1000);
  fpsResults.hero = await getAverageFps(heroPage);

  const heroVideo = await heroPage.video();
  await heroContext.close();

  if (heroVideo) {
    const rawPath = await heroVideo.path();
    const destPath = path.join(VIDEOS_DIR, "hero.webm");
    if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    fs.renameSync(rawPath, destPath);
    console.log(`Saved hero.webm (4x throttled FPS: ${fpsResults.hero})`);
  }

  // ==========================================
  // 2. WHAT WE DO VIDEO (Scroll all 5 items)
  // ==========================================
  console.log("Recording what-we-do motion video (1280px)...");
  const wwdContext = await browser.newContext({
    recordVideo: {
      dir: VIDEOS_DIR,
      size: { width: 1280, height: 800 },
    },
    viewport: { width: 1280, height: 800 },
  });

  const wwdPage = await wwdContext.newPage();
  const wwdCdp = await wwdContext.newCDPSession(wwdPage);
  await wwdCdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await wwdPage.goto("http://localhost:3000/#what-we-do", { waitUntil: "domcontentloaded" });
  await wwdPage.waitForTimeout(1000);
  await setupFpsTracking(wwdPage);

  // Sequence through all 5 items to show 300ms copper transitions & drawing stage
  const items = await wwdPage.$$('#what-we-do div[role="button"]');
  for (let i = 0; i < items.length; i++) {
    await items[i].scrollIntoViewIfNeeded();
    await items[i].hover();
    await items[i].click();
    await wwdPage.waitForTimeout(1500);
  }

  // Smooth continuous scroll back up through list
  for (let s = 0; s < 5; s++) {
    await wwdPage.mouse.wheel(0, -150);
    await wwdPage.waitForTimeout(500);
  }

  fpsResults.whatWeDo = await getAverageFps(wwdPage);

  const wwdVideo = await wwdPage.video();
  await wwdContext.close();

  if (wwdVideo) {
    const rawPath = await wwdVideo.path();
    const destPath = path.join(VIDEOS_DIR, "what-we-do.webm");
    if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    fs.renameSync(rawPath, destPath);
    console.log(`Saved what-we-do.webm (4x throttled FPS: ${fpsResults.whatWeDo})`);
  }

  // ==========================================
  // 3. APPROACH VIDEO (Scroll-driven line fill)
  // ==========================================
  console.log("Recording approach motion video (1280px)...");
  const approachContext = await browser.newContext({
    recordVideo: {
      dir: VIDEOS_DIR,
      size: { width: 1280, height: 800 },
    },
    viewport: { width: 1280, height: 800 },
  });

  const approachPage = await approachContext.newPage();
  const approachCdp = await approachContext.newCDPSession(approachPage);
  await approachCdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await approachPage.goto("http://localhost:3000/#approach", { waitUntil: "domcontentloaded" });
  await approachPage.waitForTimeout(1000);
  await setupFpsTracking(approachPage);

  // Smooth scroll through approach to show the royal line filling to step 4
  for (let s = 0; s < 10; s++) {
    await approachPage.mouse.wheel(0, 80);
    await approachPage.waitForTimeout(500);
  }

  // Pause at complete fill
  await approachPage.waitForTimeout(1500);

  // Scroll back
  for (let s = 0; s < 6; s++) {
    await approachPage.mouse.wheel(0, -100);
    await approachPage.waitForTimeout(400);
  }

  fpsResults.approach = await getAverageFps(approachPage);

  const approachVideo = await approachPage.video();
  await approachContext.close();

  if (approachVideo) {
    const rawPath = await approachVideo.path();
    const destPath = path.join(VIDEOS_DIR, "approach.webm");
    if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    fs.renameSync(rawPath, destPath);
    console.log(`Saved approach.webm (4x throttled FPS: ${fpsResults.approach})`);
  }

  await browser.close();

  const fpsReportPath = path.join(process.cwd(), "reports", "refine-3", "fps-profile.json");
  fs.writeFileSync(fpsReportPath, JSON.stringify(fpsResults, null, 2), "utf8");
  console.log("Motion recording and 4x CPU throttle profiling complete!");
  console.log("Profile Results:", fpsResults);
}

recordMotionAndProfile().catch((err) => {
  console.error("Error during motion recording and profiling:", err);
  process.exit(1);
});
