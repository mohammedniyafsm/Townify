import { redisPublisher } from "./redis.js";

export async function publishSpaceEvent(event: {
  type: "JOIN_REQUEST" | "JOIN_APPROVED" | "JOIN_DECLINED";
  spaceId: string;
  payload: any;
}) {
  try {
    if (!redisPublisher.isOpen) {
      console.warn("Redis closed — reconnecting...");
      await redisPublisher.connect();
    }

    await redisPublisher.publish(
      "SPACE_EVENTS",
      JSON.stringify({
        ...event,
        ts: Date.now(),
      })
    );
  } catch (err) {
    console.error("Redis publish failed — skipping event", err);
  }
}
