export interface ReelMeta {
  id: string;
  reel_url: string;
  video_url: string | null;
  thumbnail_url: string | null;
  caption: string | null;
  posted_at: string | null;
  views: string | null;
  likes: string | null;
  comments: string | null;
}

export interface CacheEntry {
  data: ReelMeta[];
  timestamp: number; // when it was cached
}
