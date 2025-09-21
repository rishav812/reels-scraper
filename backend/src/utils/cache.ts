import { CacheEntry, ReelMeta } from '../interfaces';

// Cache TTL in milliseconds
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// In-memory cache implementation
class Cache {
  private cache: Map<string, CacheEntry>;
  
  constructor() {
    this.cache = new Map<string, CacheEntry>();
  }

  get(key: string): CacheEntry | undefined {
    return this.cache.get(key);
  }

  set(key: string, data: ReelMeta[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  isValid(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && (Date.now() - entry.timestamp < CACHE_TTL);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cacheService = new Cache();
