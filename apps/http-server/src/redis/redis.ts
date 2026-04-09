import { createClient, type RedisClientType } from "redis";

export const redisPublisher: RedisClientType = createClient({
  url: process.env.REDIS_PUBSUB_URL || "redis://localhost:6379",
});

redisPublisher.on("connect", () => {
  console.log("Redis Publisher connecting...");
});

redisPublisher.on("ready", () => {
  console.log("Redis Publisher ready");
});

redisPublisher.on("error", (err: any) => {
  console.error("Redis Publisher Error", err);
});

redisPublisher.on("end", () => {
  console.warn("Redis disconnected — reconnecting...");
  connectRedisPublisher();
});


export async function connectRedisPublisher() {
  try {
    if (!redisPublisher.isOpen) {
      await redisPublisher.connect();
      console.log("Redis Publisher connected");
    }
  } catch (err) {
    console.error("Redis connect failed — retrying in 3s");
    setTimeout(connectRedisPublisher, 3000);
  }
}



