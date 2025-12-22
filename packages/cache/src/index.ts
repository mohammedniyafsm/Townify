import {Redis} from '@upstash/redis'

const redis=new Redis({
    url:process.env.UPSTASH_REDIS_REST_URL!,
    token:process.env.UPSTASH_REDIS_REST_TOKEN!
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

export {redis}