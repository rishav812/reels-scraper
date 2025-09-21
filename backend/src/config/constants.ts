export const MIN_CONCURRENCY = 3;
export const MAX_CONCURRENCY = 10;
export const DEFAULT_CONCURRENCY = 6;


export const BROWSER_OPTIONS = {
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
};

export const BROWSER_CONTEXT_OPTIONS = {
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  viewport: { width: 1366, height: 768 },
  javaScriptEnabled: true,
  locale: "en-US",
};

// API settings
export const DEFAULT_REELS_LIMIT = 30;
export const SERVER_PORT = 3000;
