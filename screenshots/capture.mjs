import { chromium } from "playwright";

const BASE = "/Users/nakajimasoraera/dev/github.com/soramameen/algo/screenshots";

const targets = [
  { label: "plan1", url: "http://localhost:4273/" },
  { label: "plan2", url: "http://localhost:4274/" },
  { label: "plan3", url: "http://localhost:4275/" },
];

const viewports = [
  { suffix: "desktop", width: 1280, height: 800 },
  { suffix: "mobile", width: 375, height: 812 },
];

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const t of targets) {
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();

      console.log(`Navigating to ${t.url} (${vp.suffix} ${vp.width}px)...`);
      await page.goto(t.url, { waitUntil: "networkidle", timeout: 15000 });

      // Wait a bit more for animations / fonts
      await page.waitForTimeout(1500);

      const path = `${BASE}/${t.label}-${vp.suffix}.png`;
      await page.screenshot({ path, fullPage: true });
      console.log(`  -> saved: ${path}`);

      await context.close();
    }
  }

  await browser.close();
  console.log("Done.");
})();
