/**
 * Rate Limiting Middleware for Edge Functions
 * Prevents abuse and DDoS attacks
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier: string; // user_id, ip, or email
}

const requestCounts = new Map<string, { count: number; resetTime: number }>();

/**
 * Check if request should be rate limited
 * @returns true if rate limit exceeded, false otherwise
 */
export const checkRateLimit = (config: RateLimitConfig): boolean => {
  const now = Date.now();
  const key = config.identifier;
  
  const record = requestCounts.get(key);
  
  // Reset if window has passed
  if (!record || now > record.resetTime) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return false;
  }
  
  // Increment count
  record.count++;
  
  // Check if limit exceeded
  if (record.count > config.maxRequests) {
    return true; // Rate limit exceeded
  }
  
  return false; // Within limits
};

/**
 * Get client identifier from request
 */
export const getClientIdentifier = (req: Request): string => {
  // Try to get user ID from auth header
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    // Extract user ID from JWT if possible
    try {
      const token = authHeader.replace("Bearer ", "");
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.sub) return payload.sub;
    } catch (e) {
      // Continue to IP-based identification
    }
  }
  
  // Fallback to IP address
  const ip = req.headers.get("x-forwarded-for") || 
              req.headers.get("x-real-ip") || 
              "unknown";
  return ip;
};

/**
 * Clean up old entries (call periodically)
 */
export const cleanupRateLimits = () => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);
