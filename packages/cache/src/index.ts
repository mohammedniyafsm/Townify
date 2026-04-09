import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})


export async function cacheSet<T>(key: string, value: T, ttlSeconds?: number) {
  if (ttlSeconds) {
    return redis.set(key, value, { ex: ttlSeconds });
  }
  return redis.set(key, value);
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  return redis.get<T>(key);
}

export async function cacheDel(key: string) {
  return redis.del(key);
}

// const data = await cacheWrap("users:list", 300, async () => {
//   return db.user.findMany();
// });
export async function cacheWrap<T>(
  key: string,
  ttlSeconds: number,
  fallback: () => Promise<T>
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;

  const fresh = await fallback();
  await redis.set(key, fresh, { ex: ttlSeconds });
  return fresh;
}

export async function deleteAllUsersCache() {
  let cursor = 0;

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: 'users:*',
      count: 100
    });

    cursor = Number(nextCursor);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== 0);
}

export async function deleteMapCache() {
  let cursor = 0;

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: 'maps:*',
      count: 100
    });

    cursor = Number(nextCursor);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== 0);
}

export async function deleteSpaceCache() {
  let cursor = 0;

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: 'spaces:*',
      count: 100
    });

    cursor = Number(nextCursor);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== 0);
}

export async function deleteAvatarCache() {
  let cursor = 0;

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: 'avatars:*',
      count: 100
    });

    cursor = Number(nextCursor);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== 0);
}

export { redis }
export * from "./chat.redis.js";
