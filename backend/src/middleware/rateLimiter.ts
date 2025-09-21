import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, 
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,  
});
