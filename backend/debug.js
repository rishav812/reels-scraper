const { chromium } = require("playwright");

(async () => {
    browser = await chromium.launch({
        headless: false,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-blink-features=AutomationControlled",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--window-size=1366,768"
        ],
      });
      

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36",
    viewport: { width: 1366, height: 768 },
    locale: "en-US"
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, "languages", { get: () => ["en-US", "en"] });
  });

  const page = await context.newPage();

  async function safeGoto(page, url) {
    for (let i = 0; i < 3; i++) {
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        return;
      } catch (e) {
        console.log(`Retrying navigation (${i + 1})...`);
      }
    }
    throw new Error("Failed to load page after 3 attempts");
  }

  await safeGoto(page, "https://www.instagram.com/nike/");

  const html = await page.content();
  console.log(html.substring(0, 1000));

  await browser.close();
})();
