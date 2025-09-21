import express from 'express';
import { scrapeController } from '../controllers/reelController';
import { apiLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Scrape reels endpoint
router.get('/scrape', apiLimiter, scrapeController);
router.post("/scrape", apiLimiter, scrapeController);

export default router;
