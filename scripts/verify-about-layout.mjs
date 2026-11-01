import { chromium } from "playwright";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function verifyAboutLayout() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const page = await browser.newPage();

  // Test at 1280px
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:3000/#about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  const desktop = await page.evaluate(() => {
    const sec = document.querySelector("#about");
    const h2 = sec.querySelector("h2");
    const quote = sec.querySelector("blockquote");

    const h2Rect = h2.getBoundingClientRect();
    const quoteRect = quote.getBoundingClientRect();
    const style = window.getComputedStyle(quote);

    return {
      viewportWidth: window.innerWidth,
      h2Top: Math.round(h2Rect.top),
      quoteTop: Math.round(quoteRect.top),
      topAlignmentDiff: Math.abs(Math.round(quoteRect.top - h2Rect.top)),
      quoteLeft: Math.round(quoteRect.left),
      h2Left: Math.round(h2Rect.left),
      isTwoColumn: quoteRect.left > h2Rect.right,
      quoteFontSize: style.fontSize,
      quoteLineHeight: style.lineHeight,
    };
  });

  console.log("About Desktop (1280px):", desktop);

  // Test below 1280px (e.g. 768px)
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("http://localhost:3000/#about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  const tablet = await page.evaluate(() => {
    const sec = document.querySelector("#about");
    const p = sec.querySelector("p");
    const quote = sec.querySelector("blockquote");

    const pRect = p.getBoundingClientRect();
    const quoteRect = quote.getBoundingClientRect();

    return {
      viewportWidth: window.innerWidth,
      isQuoteBelowParagraph: quoteRect.top > pRect.bottom,
      isSingleColumn: quoteRect.left === pRect.left,
    };
  });

  console.log("About Tablet (768px):", tablet);

  await browser.close();
}

verifyAboutLayout().catch((err) => {
  console.error("About layout verification failed:", err);
  process.exit(1);
});
