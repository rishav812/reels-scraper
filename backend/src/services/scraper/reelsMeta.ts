import { BrowserContext } from 'playwright';
import { ReelMeta } from '../../interfaces';


export async function fetchReelMeta(
  url: string,
  ctx: BrowserContext
): Promise<ReelMeta> {
  const startTime = Date.now();
  const page = await ctx.newPage();

  try {
    // Block unnecessary resources
    await page.route("**/*", (route) => {
      const type = route.request().resourceType();
      if (["image", "font", "stylesheet", "media"].includes(type))
        route.abort();
      else route.continue();
    });

    // Navigate
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });

    let [video, thumb, desc, time] = await Promise.all([
      page
        .$eval("meta[property='og:video']", (m) => m.getAttribute("content"))
        .catch(() => null),
      page
        .$eval("meta[property='og:image']", (m) => m.getAttribute("content"))
        .catch(() => null),
      page
        .$eval("meta[property='og:description']", (m) =>
          m.getAttribute("content")
        )
        .catch(() => null),
      page.$eval("time", (t) => t.getAttribute("datetime")).catch(() => null),
    ]);

    if (!video || !time) {
      const rawJson = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll("script"));
        for (const s of scripts) {
          if (s.textContent && s.textContent.includes("video_versions")) {
            return s.textContent;
          }
        }
        return null;
      });

      if (rawJson) {
        try {
          const match = rawJson.match(/\{.*"video_versions".*\}/);
          if (match) {
            const obj = JSON.parse(match[0]);
            if (!video && obj.video_versions?.[0]?.url) {
              video = obj.video_versions[0].url;
            }
            if (!time && obj.taken_at) {
              time = new Date(obj.taken_at * 1000).toISOString();
            }
          }
        } catch (e) {
          console.error("Failed to parse embedded JSON", e);
        }
      }
    }

    const stats = await page
      .evaluate(() => {
        let views: string | null = null;
        let likes: string | null = null;
        let comments: string | null = null;

        const spans = Array.from(document.querySelectorAll("span"));
        for (const s of spans) {
          const text = s.textContent?.toLowerCase() || "";
          if (!views && text.includes("views")) views = s.textContent || null;
          if (!likes && text.includes("likes")) likes = s.textContent || null;
        }

        const commentNodes = document.querySelectorAll("ul > li");
        if (commentNodes.length > 0) {
          comments = commentNodes.length.toString();
        }

        return { views, likes, comments };
      })
      .catch(() => ({ views: null, likes: null, comments: null }));

    return {
      id: url.split("/").filter(Boolean).pop() || "",
      reel_url: url,
      video_url: video,
      thumbnail_url: thumb,
      caption: desc,
      posted_at: time ? new Date(time).toISOString() : null,
      views: stats.views,
      likes: stats.likes,
      comments: stats.comments,
    };
  } finally {
    await page.close();
  }
}
