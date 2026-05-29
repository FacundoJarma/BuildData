import { getUserByPhone } from "./api.service";
import type { User } from "../types/api.types";

interface CacheEntry {
  data: User;
  timestamp: number;
}

const userCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;

export async function ensureUserHasObra(phone: string): Promise<User | null> {
  const cached = userCache.get(phone);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const user = await getUserByPhone(phone);
  if (user) {
    userCache.set(phone, { data: user, timestamp: Date.now() });
  }
  return user;
}

export function invalidateUserCache(phone: string): void {
  userCache.delete(phone);
}
