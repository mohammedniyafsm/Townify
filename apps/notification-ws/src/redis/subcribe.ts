import { redisSubscriber } from "./redis.js";
import { handleRedisEvent } from "../handlers/handleRedisEvent.js";

export async function startRedisSubscription() {
  console.log("[REDIS-SUB] Starting Redis subscription...");

  try {
    await redisSubscriber.subscribe("SPACE_EVENTS", (message) => {
      console.log("[REDIS-SUB] ✅ Received message from SPACE_EVENTS:", message);
      try {
        const event = JSON.parse(message);
        console.log("[REDIS-SUB] Parsed event:", event);
        handleRedisEvent(event);
      } catch (error) {
        console.error("[REDIS-SUB] Error parsing message:", error);
      }
    });
    console.log("[REDIS-SUB] ✅ Successfully subscribed to SPACE_EVENTS channel");
  } catch (error) {
    console.error("[REDIS-SUB] ❌ Failed to subscribe:", error);
  }
}
