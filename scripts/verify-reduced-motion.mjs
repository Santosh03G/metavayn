import { chromium } from "playwright";
import assert from "node:assert/strict";

async function run() {
  console.log("Verifying accessibility & reduced motion...");
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  // 1. Reduced Motion Test
  const rmContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const rmPage = await rmContext.newPage();
  await rmPage.emulateMedia({ reducedMotion: "reduce" });
  await rmPage.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await rmPage.waitForTimeout(500);

  const h1Style = await rmPage.evaluate(() => {
    const line = document.querySelector("h1 span span");
    return line ? { opacity: getComputedStyle(line).opacity, transform: getComputedStyle(line).transform } : null;
  });
  console.log("Reduced motion H1 style:", h1Style);
  assert.equal(h1Style?.opacity, "1", "H1 must be fully opaque under reduced motion");
  assert.equal(h1Style?.transform, "none", "H1 must have no transform under reduced motion");

  const quoteWordStyle = await rmPage.evaluate(() => {
    const word = document.querySelector("#about blockquote span");
    return word ? { opacity: getComputedStyle(word).opacity } : null;
  });
  console.log("Reduced motion quote word style:", quoteWordStyle);
  assert.equal(quoteWordStyle?.opacity, "1", "Quote words must be fully opaque under reduced motion");

  // 2. Keyboard Navigation Test
  const normalPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await normalPage.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await normalPage.waitForTimeout(500);

  // Press Tab 6 times to navigate header links
  for (let i = 0; i < 6; i++) {
    await normalPage.keyboard.press("Tab");
  }
  const focusedHref = await normalPage.evaluate(() => document.activeElement?.getAttribute("href"));
  console.log("Tab navigation focused element href:", focusedHref);
  assert.ok(focusedHref !== null, "Tab key must be able to focus navigation elements");

  // Test PageDown
  const scrollBefore = await normalPage.evaluate(() => window.scrollY);
  await normalPage.keyboard.press("PageDown");
  await normalPage.waitForTimeout(300);
  const scrollAfter = await normalPage.evaluate(() => window.scrollY);
  console.log(`PageDown test: ${scrollBefore}px -> ${scrollAfter}px`);
  assert.ok(scrollAfter > scrollBefore, "PageDown must scroll page smoothly without trapping");

  await browser.close();
  console.log("All accessibility and reduced motion checks passed perfectly!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
