import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

async function main() {
  console.log("Capturing refined About section screenshot...");
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  await page.goto("http://localhost:3000/#about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Scroll into About pinned section so it reveals
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(800);

  const aboutSection = await page.$("#about");
  if (aboutSection) {
    const outPath = path.resolve("reports/motion-1/about-refined.png");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    await aboutSection.screenshot({ path: outPath });
    console.log(`Saved screenshot to: ${outPath}`);
  }

  // Also measure geometry
  const measurements = await page.evaluate(() => {
    const quote = document.querySelector("#about blockquote");
    const graphic = document.querySelector("#about svg");
    const leftCol = document.querySelector("#about .xl\\:col-span-5");
    const rightCol = document.querySelector("#about .xl\\:col-span-7");

    const quoteRect = quote?.getBoundingClientRect();
    const graphicRect = graphic?.getBoundingClientRect();
    const leftRect = leftCol?.getBoundingClientRect();
    const rightRect = rightCol?.getBoundingClientRect();

    return {
      verticalGapBetweenQuoteAndGraphic: graphicRect && quoteRect ? graphicRect.top - quoteRect.bottom : null,
      leftColHeight: leftRect?.height,
      rightColHeight: rightRect?.height,
      graphicRightEdgeToViewport: graphicRect ? window.innerWidth - graphicRect.right : null,
    };
  });

  console.log("Measurements:", measurements);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
