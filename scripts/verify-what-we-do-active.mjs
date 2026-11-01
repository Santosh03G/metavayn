import { chromium } from "playwright";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function verifyWhatWeDoActive() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("http://localhost:3000/#what-we-do", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  const initial = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('#what-we-do div[role="button"]'));
    const firstItem = items[0];
    const h3 = firstItem.querySelector("h3");
    const copperBar = firstItem.querySelector(".bg-copper");

    const h3Style = window.getComputedStyle(h3);
    const barStyle = copperBar ? window.getComputedStyle(copperBar) : null;

    return {
      firstItemTitle: h3.innerText.trim(),
      isFirstItemPressed: firstItem.getAttribute("aria-pressed") === "true",
      h3FontWeight: h3Style.fontWeight,
      hasCopperBar: Boolean(copperBar),
      barWidth: barStyle ? barStyle.width : null,
      barHeight: barStyle ? barStyle.height : null,
      totalItems: items.length,
    };
  });

  console.log("Initial What We Do State on Load:", initial);

  // Test item 4 (Engineering Documentation)
  const items = await page.$$('#what-we-do div[role="button"]');
  await items[3].click();
  await page.waitForTimeout(500);

  const docStage = await page.evaluate(() => {
    const table = document.querySelector("#what-we-do table");
    return {
      hasDrawingTable: Boolean(table),
      tableRows: table ? table.querySelectorAll("tr").length : 0,
    };
  });

  console.log("Engineering Documentation stage verification:", docStage);

  await browser.close();
}

verifyWhatWeDoActive().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
