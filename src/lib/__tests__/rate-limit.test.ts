import { beforeEach, describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimits } from "@/lib/rate-limit";

describe("rate limit", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("permite até o limite e bloqueia depois", () => {
    const now = 1_000;
    expect(checkRateLimit("login:1.2.3.4", 2, 60_000, now).success).toBe(true);
    expect(checkRateLimit("login:1.2.3.4", 2, 60_000, now + 1).success).toBe(true);
    const blocked = checkRateLimit("login:1.2.3.4", 2, 60_000, now + 2);
    expect(blocked.success).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("isola chaves diferentes", () => {
    const now = 1_000;
    expect(checkRateLimit("login:a", 1, 60_000, now).success).toBe(true);
    expect(checkRateLimit("login:a", 1, 60_000, now + 1).success).toBe(false);
    expect(checkRateLimit("login:b", 1, 60_000, now + 1).success).toBe(true);
  });

  it("libera novamente após a janela expirar", () => {
    const now = 1_000;
    expect(checkRateLimit("register:a", 1, 60_000, now).success).toBe(true);
    expect(checkRateLimit("register:a", 1, 60_000, now + 30_000).success).toBe(false);
    expect(checkRateLimit("register:a", 1, 60_000, now + 61_000).success).toBe(true);
  });
});
