import { redisSubscriber } from "./redis.js";
import { handleRedisEvent } from "../handlers/handleRedisEvent.js";

export async function startRedisSubscription() {

  try {
    await redisSubscriber.subscribe("SPACE_EVENTS", (message) => {
      try {
        const event = JSON.parse(message);
        handleRedisEvent(event);
      } catch (error) {
        console.error("[REDIS-SUB] Error parsing message:", error);
      }
    });
  } catch (error) {
    console.error("[REDIS-SUB] ❌ Failed to subscribe:", error);
  }
}
