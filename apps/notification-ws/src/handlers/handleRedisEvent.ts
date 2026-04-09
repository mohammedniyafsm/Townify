import WebSocket from "ws";
import { onlineUsers } from "../onlineUsers.js";
import type { SpaceEvent } from "../types.js";

export function handleRedisEvent(event: SpaceEvent) {
  const { type, payload } = event;
  console.log("[REDIS-EVENT] Processing event type:", type);

  switch (type) {

    /**   Notify ADMIN when someone requests to join  **/
    case "JOIN_REQUEST": {
      const { adminUserId, requester } = payload;

      const adminWs = onlineUsers.get(adminUserId);

      if (adminWs?.readyState === WebSocket.OPEN) {
        adminWs.send(
          JSON.stringify({
            type: "JOIN_REQUEST_RECEIVED",
            payload: requester
          })
        );
      }
      break;
    }

    /** Notify USER when request is approved **/
    case "JOIN_APPROVED": {
      const userWs = onlineUsers.get(payload.userId);

      if (userWs?.readyState === WebSocket.OPEN) {
        userWs.send(
          JSON.stringify({
            type: "JOIN_APPROVED",
            payload: {
              spaceSlug: payload.spaceSlug,
              spaceName: payload.spaceName,
            },
          })
        );
      }
      break;
    }


    case "USER_BLOCKED": {
      console.log("[USER_BLOCKED] Event received with payload:", payload);
      console.log("[USER_BLOCKED] Target userId:", payload.userId);
      console.log("[USER_BLOCKED] Current online users:", Array.from(onlineUsers.keys()));

      const userWs = onlineUsers.get(payload.userId);
      console.log("[USER_BLOCKED] Found WebSocket:", !!userWs);
      console.log("[USER_BLOCKED] WebSocket ready state:", userWs?.readyState);

      if (userWs?.readyState === WebSocket.OPEN) {
        console.log("[USER_BLOCKED] ✅ Sending USER_BLOCKED message to user:", payload.userId);
        const message = JSON.stringify({
          type: "USER_BLOCKED",
          payload: {
            spaceName: payload.spaceName,
          },
        });
        console.log("[USER_BLOCKED] Message content:", message);
        userWs.send(message);
        console.log("[USER_BLOCKED] ✅ Message sent successfully");
      } else {
        console.log("[USER_BLOCKED] ❌ Cannot send - WebSocket not open or not found");
        console.log("[USER_BLOCKED] User might not be connected to notification-ws");
      }
      break;
    }
  }
}
