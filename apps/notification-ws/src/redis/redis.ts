import { createClient, type RedisClientType } from "redis";

export const redisSubscriber: RedisClientType = createClient({
  url: process.env.REDIS_PUBSUB_URL || "redis://localhost:6379",
});

redisSubscriber.on("connect", () => {
  console.log("Redis Publisher connecting...");
});

redisSubscriber.on("ready", () => {
  console.log("Redis Publisher ready");
});

redisSubscriber.on("error", (err: any) => {
  console.error("Redis Publisher Error", err);
});

redisSubscriber.on("end", () => {
  console.warn("Redis disconnected — reconnecting...");
  connectRedisSubscriber();
});

export async function connectRedisSubscriber() {
  try {
    if (!redisSubscriber.isOpen) {
      await redisSubscriber.connect();
      console.log(" Redis Subscriber connected");
    }
  } catch (error) {
    console.error("Redis connect failed — retrying in 3s");
    setTimeout(connectRedisSubscriber, 3000);
  }
}


