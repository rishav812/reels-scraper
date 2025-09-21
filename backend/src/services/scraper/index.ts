import pLimit from 'p-limit';
import { ReelMeta } from '../../interfaces';
import { browserService } from '../browser';
import { getReelLinks } from './reelsFetcher';
import { fetchReelMeta } from './reelsMeta';
import { DEFAULT_CONCURRENCY } from '../../config/constants';

export async function scrapeReels(username: string, limit: number): Promise<ReelMeta[]> {
  // Get all reel links first
  const links = await getReelLinks(username);
  const limited = links.slice(0, limit);

  const ctx = await browserService.getSharedContext();
  
  // Set up concurrency limiter
  const limiter = pLimit(DEFAULT_CONCURRENCY);

  const results = await Promise.all(
    limited.map((url) => limiter(() => fetchReelMeta(url, ctx)))
  );

  return results;
}
