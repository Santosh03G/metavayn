import { chromium } from "playwright";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function verifyContainerAlignment() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const page = await browser.newPage();
  const viewports = [1280, 1920];
  const results = {};

  for (const width of viewports) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const alignment = await page.evaluate(() => {
      const getLeft = (sel) => {
        const el = document.querySelector(sel);
        return el ? Math.round(el.getBoundingClientRect().left) : null;
      };

      return {
        navLogo: getLeft("header a[aria-label*='Metavayn']"),
        heroH1: getLeft("section:first-of-type h1"),
        aboutH2: getLeft("section#about h2"),
        whatWeDoH2: getLeft("section#what-we-do h2"),
        approachH2: getLeft("section#approach h2"),
        valuePropH2: getLeft("section#approach div.pt-12 h2"),
        partnerH2: getLeft("section#partner h2"),
        footerHeading: getLeft("footer h2"),
      };
    });

    results[width] = alignment;
    console.log(`\n=== CONTAINER ALIGNMENT AT ${width}px ===`);
    console.table(alignment);
  }

  await browser.close();
}

verifyContainerAlignment().catch((err) => {
  console.error("Alignment check failed:", err);
  process.exit(1);
});