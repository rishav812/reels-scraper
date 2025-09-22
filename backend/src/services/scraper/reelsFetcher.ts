import { BrowserContext } from 'playwright';
import { browserService } from '../browser';


export async function getReelLinks(
  username: string,
  limit: number = 10
): Promise<string[]> {
  const startTime = Date.now();
  const ctx = await browserService.getSharedContext();
  const page = await ctx.newPage();
  const profileUrl = `https://www.instagram.com/${username}/`;

  try {
    await page.goto(profileUrl, { waitUntil: "networkidle", timeout: 45000 });


    const html = await page.content();
    if (
      html.includes("Sorry, this page isn't available") ||
      html.includes("Page Not Found")
    ) {
      const err = new Error("not_found");
      (err as any).code = 404;
      throw err;
    }
    if (html.includes("This Account is Private")) {
      const err = new Error("private");
      (err as any).code = 403;
      throw err;
    }
    
    // if (html.includes("log in")) {
    //   const err = new Error("captcha_or_login_required");
    //   (err as any).code = 429;
    //   throw err;
    // }

    const uniqueLinks = new Set<string>();
    let lastHeight: any = 0;
    let sameHeightCount = 0;

    while (uniqueLinks.size < limit && sameHeightCount < 3) {
      const currentLinks = await page.$$eval("a[href*='/reel/']", (anchors) =>
        anchors.map((a) => (a as HTMLAnchorElement).href)
      );

      currentLinks.forEach((link) => uniqueLinks.add(link));

      if (uniqueLinks.size >= limit) break;

      const newHeight = await page.evaluate("document.body.scrollHeight");
      if (newHeight === lastHeight) {
        sameHeightCount++;
      } else {
        sameHeightCount = 0;
        lastHeight = newHeight;
      }

      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

      await page.waitForTimeout(400);
    }

    const links = Array.from(uniqueLinks).slice(0, limit);

    return links;
  } finally {
    await page.close();
  }
}
