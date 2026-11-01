import { chromium } from "playwright";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function verifyApproachTimeline() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:3000/#approach", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  const data = await page.evaluate(() => {
    const sec = document.querySelector("#approach");
    const node1 = sec.querySelectorAll(".rounded-full")[0];
    const node4 = sec.querySelectorAll(".rounded-full")[3];
    const lineWrapper = sec.querySelector(".hidden.lg\\:block.absolute");
    const royalLine = lineWrapper.querySelector(".bg-royal");

    const n1Rect = node1.getBoundingClientRect();
    const n4Rect = node4.getBoundingClientRect();
    const lineRect = lineWrapper.getBoundingClientRect();
    const royalStyle = window.getComputedStyle(royalLine);

    const n1Center = n1Rect.left + n1Rect.width / 2;
    const n4Center = n4Rect.left + n4Rect.width / 2;

    return {
      lineLeft: Math.round(lineRect.left),
      n1Center: Math.round(n1Center),
      lineRight: Math.round(lineRect.right),
      n4Center: Math.round(n4Center),
      leftDelta: Math.abs(Math.round(lineRect.left - n1Center)),
      rightDelta: Math.abs(Math.round(lineRect.right - n4Center)),
      transform: royalStyle.transform,
      transformOrigin: royalStyle.transformOrigin,
    };
  });

  console.log("Approach Timeline Line Geometric Alignment:", data);

  // Test reduced motion
  const reducedMotionContext = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 900 },
  });
  const rmPage = await reducedMotionContext.newPage();
  await rmPage.goto("http://localhost:3000/#approach", { waitUntil: "domcontentloaded" });
  await rmPage.waitForTimeout(1000);

  const rmData = await rmPage.evaluate(() => {
    const sec = document.querySelector("#approach");
    const royalLine = sec.querySelector(".hidden.lg\\:block.absolute .bg-royal");
    const style = window.getComputedStyle(royalLine);
    return {
      transform: style.transform,
    };
  });

  console.log("Reduced motion static fill:", rmData);

  await browser.close();
}

verifyApproachTimeline().catch((err) => {
  console.error("Approach timeline verification failed:", err);
  process.exit(1);
});
