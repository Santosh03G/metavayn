import { chromium } from "playwright";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function checkNav() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/");
  const items = await page.$$eval("header nav a", (els) => els.map((e) => e.innerText.trim()));
  console.log("Desktop Nav Links:", items);

  await page.setViewportSize({ width: 375, height: 667 });
  await page.click('button[aria-label="Toggle navigation menu"]');
  await page.waitForTimeout(300);
  const mobileItems = await page.$$eval("#mobile-navigation-menu a span:first-child", (els) =>
    els.map((e) => e.innerText.trim())
  );
  console.log("Mobile Nav Links:", mobileItems);

  await browser.close();
}

checkNav();
