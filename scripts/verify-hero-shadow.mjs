import { chromium } from "playwright";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function verifyHeroShadow() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const page = await browser.newPage();

  for (const width of [1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("canvas", { timeout: 10000 });
    await page.waitForTimeout(1000);

    const data = await page.evaluate(() => {
      const heroSection = document.querySelector("section:first-of-type");
      const heroContainer = heroSection.firstElementChild;
      const canvas = heroSection.querySelector("canvas");
      const h1 = heroSection.querySelector("h1");

      const cRect = heroContainer.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const h1Rect = h1.getBoundingClientRect();

      return {
        viewportWidth: window.innerWidth,
        containerRight: cRect.right,
        canvasRight: canvasRect.right,
        distanceFromRightEdge: window.innerWidth - canvasRect.right,
        containerPaddingRight: cRect.right - canvasRect.right,
      };
    });

    console.log(`[Viewport ${width}px] Clearance from right edge: ${data.distanceFromRightEdge}px (Required >= 40px)`);
    console.log(`[Viewport ${width}px] Inside container padding right: ${data.containerPaddingRight}px`);
  }

  await browser.close();
}

verifyHeroShadow().catch((err) => {
  console.error("Hero shadow verification failed:", err);
  process.exit(1);
});
