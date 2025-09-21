import { Request, Response } from 'express';
import { ReelMeta } from '../interfaces';
import { scrapeReels } from '../services/scraper';
import { cacheService } from '../utils/cache';
import {DEFAULT_REELS_LIMIT} from '../config/constants';

export async function scrapeController(req: Request, res: Response): Promise<void> {
  let username: string | undefined;
  let limit: number;
  
  if (req.method === 'POST') {
    username = req.body?.username;
    limit = req.body?.limit || DEFAULT_REELS_LIMIT;
  } else {
    username = req.query.username as string;
    limit = parseInt(req.query.limit as string) || DEFAULT_REELS_LIMIT;
  }

  if (!username) {
    res.status(400).send("Username is required");
    return;
  }

  try {
    const cacheKey = `${username}:${limit}`;
    const cached = cacheService.get(cacheKey);

    if (cached && cacheService.isValid(cacheKey)) {
      console.log(`Serving from cache: ${username}`);
      res.json({ cached: true, reels: cached.data });
      return;
    }

    const reels = await scrapeReels(username, limit);

    cacheService.set(cacheKey, reels);

    res.json({ cached: false, reels });
  } catch (error: any) {
    if (error.code === 404) {
      res.status(404).send(error.message);
    } else if (error.code === 403) {
      res.status(403).send(error.message);
    } else if (error.code === 429) {
      res.status(429).send(error.message || "CAPTCHA or login required - Instagram has detected automated access");
    } else {
      console.error('Scraping error:', error);
      res.status(500).send(error.message);
    }
  }
}
