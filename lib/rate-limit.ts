interface RateLimitOptions {
  /** Window duration in milliseconds. */
  interval: number;
  /** Max unique tokens tracked per window (memory bound). */
  uniqueTokenPerInterval?: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Sliding-window in-memory rate limiter.
 * Swap the internal store for Redis/Upstash in multi-instance deployments —
 * the `check` contract stays identical.
 */
export function rateLimit({ interval, uniqueTokenPerInterval = 500 }: RateLimitOptions) {
  const tokenCache = new Map<string, number[]>();

  function prune(now: number) {
    if (tokenCache.size <= uniqueTokenPerInterval) return;
    for (const [key, timestamps] of tokenCache) {
      const alive = timestamps.filter((t) => now - t < interval);
      if (alive.length === 0) tokenCache.delete(key);
      else tokenCache.set(key, alive);
      if (tokenCache.size <= uniqueTokenPerInterval) break;
    }
  }

  return {
    check(limit: number, token: string): RateLimitResult {
      const now = Date.now();
      prune(now);

      const timestamps = (tokenCache.get(token) ?? []).filter((t) => now - t < interval);
      const success = timestamps.length < limit;

      if (success) {
        timestamps.push(now);
        tokenCache.set(token, timestamps);
      }

      const oldest = timestamps[0] ?? now;
      return {
        success,
        limit,
        remaining: Math.max(0, limit - timestamps.length),
        reset: oldest + interval,
      };
    },
  };
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}
