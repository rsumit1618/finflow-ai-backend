const buckets = new Map();

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  maxRequests = 100,
  keyPrefix = "global",
} = {}) => {
  return (req, res, next) => {
    const key = `${keyPrefix}:${req.ip}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });

      return next();
    }

    bucket.count += 1;

    if (bucket.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    return next();
  };
};
