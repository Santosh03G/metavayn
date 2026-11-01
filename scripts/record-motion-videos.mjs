import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const VIDEO_DIR = path.resolve("reports/motion-1/videos");

async function main() {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });

  console.log("Launching Chromium for Motion Pass 1 verification...");
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const fpsResults = {};

  // -------------------------------------------------------------
  // 1. PAGE LOAD (1280x800)
  // -------------------------------------------------------------
  console.log("Recording 1: Page Load (1280 width)...");
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
    });
    const page = await context.newPage();
    const videoPromise = page.video();

    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    // Watch full page load sequence (Nav -> Headline lines -> 3D wireframe -> paper fill -> buttons)
    await page.waitForTimeout(4000);

    // Subtle cursor tilt demo
    await page.mouse.move(900, 350);
    await page.waitForTimeout(1000);
    await page.mouse.move(700, 450);
    await page.waitForTimeout(1000);

    await context.close();
    const video = await videoPromise;
    if (video) {
      const videoPath = await video.path();
      const targetPath = path.join(VIDEO_DIR, "page-load.webm");
      if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
      fs.renameSync(videoPath, targetPath);
      console.log(`Saved: ${targetPath}`);
    }
  }

  // -------------------------------------------------------------
  // 2. ABOUT SCROLL (1280x800) - Full-Section 150vh Pin & 3-stage Evolution
  // -------------------------------------------------------------
  console.log("Recording 2: About Scroll (1280 width)...");
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
    });
    const page = await context.newPage();
    const videoPromise = page.video();

    await page.goto("http://localhost:3000/#about", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Scroll smoothly through the 150vh pin to see word reveals & 3 graphic states
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 100);
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
      console.log(`Saved: ${targetPath}`);
    }
  }

  // -------------------------------------------------------------
  // 3. WHAT WE DO SCROLL (1280x800) - 3D Rotation & Copper Cross-fade
  // -------------------------------------------------------------
  console.log("Recording 3: What We Do Scroll (1280 width)...");
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
    });
    const page = await context.newPage();
    const videoPromise = page.video();

    await page.goto("http://localhost:3000/#what-we-do", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Click through disciplines to trigger 6-8 deg vertical rotation & copper cross-fade
    const disciplineButtons = await page.$$('[role="button"][aria-label*="capability details"]');
    for (const btn of disciplineButtons) {
      await btn.click();
      await page.waitForTimeout(1200);
    }

    await context.close();
    const video = await videoPromise;
    if (video) {
      const videoPath = await video.path();
      const targetPath = path.join(VIDEO_DIR, "what-we-do-scroll.webm");
      if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
      fs.renameSync(videoPath, targetPath);
      console.log(`Saved: ${targetPath}`);
    }
  }

  // -------------------------------------------------------------
  // 4. APPROACH SCROLL (1280x800) - Horizontal Timeline Fill & Value Prop
  // -------------------------------------------------------------
  console.log("Recording 4: Approach Scroll (1280 width)...");
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
    });
    const page = await context.newPage();
    const videoPromise = page.video();

    await page.goto("http://localhost:3000/#approach", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Scroll through Approach timeline and Value Prop masked line reveal
    for (let i = 0; i < 15; i++) {
      await page.mouse.wheel(0, 80);
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(1500);

    await context.close();
    const video = await videoPromise;
    if (video) {
      const videoPath = await video.path();
      const targetPath = path.join(VIDEO_DIR, "approach-scroll.webm");
      if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
      fs.renameSync(videoPath, targetPath);
      console.log(`Saved: ${targetPath}`);
    }
  }

  // -------------------------------------------------------------
  // 5. CTA SECTION (1280x800) - Plant Room Plan Drift & Magnetic Buttons
  // -------------------------------------------------------------
  console.log("Recording 5: CTA Section (1280 width)...");
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
    });
    const page = await context.newPage();
    const videoPromise = page.video();

    await page.goto("http://localhost:3000/#partner", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Watch plant room plan drift
    await page.waitForTimeout(3000);

    // Test magnetic button hover
    const btn = await page.$('#partner button');
    if (btn) {
      const box = await btn.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.2);
        await page.waitForTimeout(600);
        await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.8);
        await page.waitForTimeout(600);
        await page.mouse.move(box.x - 50, box.y - 50);
        await page.waitForTimeout(600);
      }
    }

    await context.close();
    const video = await videoPromise;
    if (video) {
      const videoPath = await video.path();
      const targetPath = path.join(VIDEO_DIR, "cta.webm");
      if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
      fs.renameSync(videoPath, targetPath);
      console.log(`Saved: ${targetPath}`);
    }
  }

  // -------------------------------------------------------------
  // 6. MOBILE ABOUT SCROLL (375x812)
  // -------------------------------------------------------------
  console.log("Recording 6: Mobile About Scroll (375 width)...");
  {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      recordVideo: { dir: VIDEO_DIR, size: { width: 375, height: 812 } },
    });
    const page = await context.newPage();
    const videoPromise = page.video();

    await page.goto("http://localhost:3000/#about", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    for (let i = 0; i < 18; i++) {
      await page.mouse.wheel(0, 80);
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(1500);

    await context.close();
    const video = await videoPromise;
    if (video) {
      const videoPath = await video.path();
      const targetPath = path.join(VIDEO_DIR, "about-scroll-mobile.webm");
      if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
      fs.renameSync(videoPath, targetPath);
      console.log(`Saved: ${targetPath}`);
    }
  }

  // -------------------------------------------------------------
  // 7. MOBILE APPROACH SCROLL (375x812) - Vertical Timeline Fill
  // -------------------------------------------------------------
  console.log("Recording 7: Mobile Approach Scroll (375 width)...");
  {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      recordVideo: { dir: VIDEO_DIR, size: { width: 375, height: 812 } },
    });
    const page = await context.newPage();
    const videoPromise = page.video();

    await page.goto("http://localhost:3000/#approach", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    for (let i = 0; i < 18; i++) {
      await page.mouse.wheel(0, 80);
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(1500);

    await context.close();
    const video = await videoPromise;
    if (video) {
      const videoPath = await video.path();
      const targetPath = path.join(VIDEO_DIR, "approach-scroll-mobile.webm");
      if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
      fs.renameSync(videoPath, targetPath);
      console.log(`Saved: ${targetPath}`);
    }
  }

  // -------------------------------------------------------------
  // 8. FRAME RATE MEASUREMENTS (Standard 60fps & 4x CPU Throttled)
  // -------------------------------------------------------------
  console.log("Measuring frame rates (Unthrottled vs 4x CPU throttled)...");
  {
    // A. Unthrottled Profile
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

    // FPS counter injected into page
    await page.evaluate(() => {
      window.__fpsData = [];
      let last = performance.now();
      function tick(now) {
        const delta = now - last;
        last = now;
        window.__fpsData.push(1000 / delta);
        if (window.__measureActive) requestAnimationFrame(tick);
      }
      window.__startFps = () => {
        window.__measureActive = true;
        last = performance.now();
        requestAnimationFrame(tick);
      };
      window.__stopFps = () => {
        window.__measureActive = false;
        const valid = window.__fpsData.slice(5); // skip initial warmup frame
        const avg = valid.reduce((a, b) => a + b, 0) / (valid.length || 1);
        return { avg: Math.round(avg), min: Math.round(Math.min(...valid)) };
      };
    });

    await page.evaluate(() => window.__startFps());
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 150);
      await page.waitForTimeout(50);
    }
    const unthrottledFps = await page.evaluate(() => window.__stopFps());
    fpsResults.unthrottled = unthrottledFps;
    console.log("Unthrottled FPS:", unthrottledFps);
    await page.close();

    // B. 4x CPU Throttled Profile via CDP
    const throttledContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const throttledPage = await throttledContext.newPage();
    const cdp = await throttledContext.newCDPSession(throttledPage);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    await throttledPage.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

    await throttledPage.evaluate(() => {
      window.__fpsData = [];
      let last = performance.now();
      function tick(now) {
        const delta = now - last;
        last = now;
        window.__fpsData.push(1000 / delta);
        if (window.__measureActive) requestAnimationFrame(tick);
      }
      window.__startFps = () => {
        window.__measureActive = true;
        last = performance.now();
        requestAnimationFrame(tick);
      };
      window.__stopFps = () => {
        window.__measureActive = false;
        const valid = window.__fpsData.slice(5);
        const avg = valid.reduce((a, b) => a + b, 0) / (valid.length || 1);
        return { avg: Math.round(avg), min: Math.round(Math.min(...valid)) };
      };
    });

    await throttledPage.evaluate(() => window.__startFps());
    for (let i = 0; i < 20; i++) {
      await throttledPage.mouse.wheel(0, 150);
      await throttledPage.waitForTimeout(50);
    }
    const throttledFps = await throttledPage.evaluate(() => window.__stopFps());
    fpsResults.throttled4x = throttledFps;
    console.log("4x CPU Throttled FPS:", throttledFps);

    await throttledContext.close();
  }

  // -------------------------------------------------------------
  // 9. ACCESSIBILITY & REDUCED MOTION VERIFICATION
  // -------------------------------------------------------------
  console.log("Testing accessibility, keyboard navigation, and reduced motion...");
  {
    // A. Keyboard Tab navigation & Page Down test
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

    // Test Tab key movement through Nav links
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(100);
    }
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    console.log("Keyboard Tab navigation focused tag:", focusedTag);

    // Test Page Down
    const initialScrollY = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("PageDown");
    await page.waitForTimeout(300);
    const postPageDownScrollY = await page.evaluate(() => window.scrollY);
    console.log(`PageDown scroll: ${initialScrollY}px -> ${postPageDownScrollY}px (Worked: ${postPageDownScrollY > initialScrollY})`);

    // B. Reduced Motion Mode
    const rmContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      forcedColors: "none",
    });
    const rmPage = await rmContext.newPage();
    await rmPage.emulateMedia({ reducedMotion: "reduce" });
    await rmPage.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

    // Verify SplitLines & Hero headline are immediately fully opaque with transform: none
    const h1Style = await rmPage.evaluate(() => {
      const line = document.querySelector("h1 span span");
      return line ? { opacity: getComputedStyle(line).opacity, transform: getComputedStyle(line).transform } : null;
    });
    console.log("Reduced motion H1 computed style:", h1Style);

    // Verify About quote words are immediately fully opaque
    const wordOpacity = await rmPage.evaluate(() => {
      const word = document.querySelector("#about blockquote span");
      return word ? getComputedStyle(word).opacity : null;
    });
    console.log("Reduced motion About quote word opacity:", wordOpacity);

    await page.close();
    await rmContext.close();
  }

  await browser.close();

  // Save results JSON
  fs.writeFileSync(
    path.join(VIDEO_DIR, "benchmark-results.json"),
    JSON.stringify(fpsResults, null, 2),
    "utf-8"
  );

  console.log("All motion videos and benchmark checks completed successfully!");
}

main().catch((err) => {
  console.error("Recording script failed:", err);
  process.exit(1);
});
