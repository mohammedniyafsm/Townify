import WebSocket from "ws";
import { onlineUsers } from "../onlineUsers.js";

export function handleAuth(ws: WebSocket, raw: WebSocket.RawData) {
  const msg = JSON.parse(raw.toString());

  if (msg.type !== "AUTH") return;

  const { userId } = msg.payload;
  if (!userId) {
    console.log("[AUTH] ❌ No userId provided");
    return;
  }

  (ws as any).userId = userId;
  onlineUsers.set(userId, ws);

  console.log("[AUTH] ✅ User authenticated:", userId);
  console.log("[AUTH] Total online users:", onlineUsers.size);
  console.log("[AUTH] Online user IDs:", Array.from(onlineUsers.keys()));

  ws.send(JSON.stringify({ type: "AUTH_OK" }));
}
