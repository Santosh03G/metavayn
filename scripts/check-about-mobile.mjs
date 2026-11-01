import { chromium } from "playwright";
import path from "node:path";

async function checkMobile() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto("http://localhost:3000/#about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  
  const about = await page.$("#about");
  if (about) {
    await about.screenshot({ path: "reports/motion-1/about-mobile-current.png" });
    console.log("Saved reports/motion-1/about-mobile-current.png");
  }
  await browser.close();
}
checkMobile();
