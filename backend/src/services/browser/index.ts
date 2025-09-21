import { Browser, BrowserContext, chromium } from 'playwright';
import { BROWSER_OPTIONS, BROWSER_CONTEXT_OPTIONS } from '../../config/constants';

class BrowserService {
  private browser: Browser | null = null;
  private sharedContext: BrowserContext | null = null;

  /**
   * Get or create a browser instance
   */
  async getBrowser(): Promise<Browser> {
    if (this.browser) return this.browser;
    
    this.browser = await chromium.launch(BROWSER_OPTIONS);
    return this.browser;
  }

 
  async getSharedContext(): Promise<BrowserContext> {
    if (!this.sharedContext) {
      const browser = await this.getBrowser();
      this.sharedContext = await browser.newContext(BROWSER_CONTEXT_OPTIONS);
    }
    
    return this.sharedContext;
  }

  
  async close(): Promise<void> {
    if (this.sharedContext) {
      await this.sharedContext.close();
      this.sharedContext = null;
    }
    
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const browserService = new BrowserService();
