import { randomUUID } from "crypto";

// One-time token store for Telegram login.
// Single-instance only — replace with Redis (Upstash) for clustered / serverless prod.
const store = new Map<string, { userId: string; expiresAt: number }>();

const TTL_MS = 60_000; // токен действует 60 секунд

export function storeTelegramToken(userId: string): string {
  const token = randomUUID();
  store.set(token, { userId, expiresAt: Date.now() + TTL_MS });
  return token;
}

/** Возвращает userId и удаляет токен (одноразовый). Null если истёк или не существует. */
export function consumeTelegramToken(token: string): string | null {
  const entry = store.get(token);
  store.delete(token);
  if (!entry || Date.now() > entry.expiresAt) return null;
  return entry.userId;
}
