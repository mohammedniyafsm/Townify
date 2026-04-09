import WebSocket from "ws";
import { onlineUsers } from "../onlineUsers.js";

export function handleAuth(ws: WebSocket, raw: WebSocket.RawData) {
  const msg = JSON.parse(raw.toString());

  if (msg.type !== "AUTH") return;

  const { userId } = msg.payload;
  if (!userId) {
    return;
  }

  (ws as any).userId = userId;
  onlineUsers.set(userId, ws);

  ws.send(JSON.stringify({ type: "AUTH_OK" }));
}
