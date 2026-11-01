import { chromium } from "playwright";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function verifyNavChecks() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const page = await browser.newPage();
  const viewports = [1280, 1920];

  console.log("=== CHECK 1: NO DARK STRIP ABOVE NAV ON FRESH LOAD ===");
  for (const width of viewports) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    const headerTop = await page.evaluate(() => {
      const h = document.querySelector("header");
      return h ? h.getBoundingClientRect().top : null;
    });

    console.log(`Viewport ${width}px: Header top coordinate = ${headerTop}px (Expected: 0px) -> ${headerTop === 0 ? "PASS" : "FAIL"}`);
  }

  console.log("\n=== CHECK 2: SCROLL TO SECTIONS (NO ROYAL BAND UNDER NAV AT REST) ===");
  const sections = ["about", "what-we-do", "approach", "partner"];

  await page.setViewportSize({ width: 1280, height: 900 });

  for (const id of sections) {
    await page.goto(`http://localhost:3000/#${id}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    const check = await page.evaluate((secId) => {
      const header = document.querySelector("header");
      const section = document.getElementById(secId);
      if (!header || !section) return null;

      const headerBottom = header.getBoundingClientRect().bottom;
      const sectionTop = section.getBoundingClientRect().top;

      return {
        headerBottom: Math.round(headerBottom),
        sectionTop: Math.round(sectionTop),
        gap: Math.round(sectionTop - headerBottom),
      };
    }, id);

    console.log(`Section #${id}: headerBottom=${check.headerBottom}px, sectionTop=${check.sectionTop}px, gap=${check.gap}px -> ${Math.abs(check.gap) <= 1 ? "PASS (No gap/band)" : "GAP DETECTED: " + check.gap}`);
  }

  await browser.close();
}

verifyNavChecks().catch((err) => {
  console.error("Nav check failed:", err);
  process.exit(1);
});