import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/ws/socket";
import { handleSocketMessage } from "@/ws/socketHandlers";

export const useSocket = (
  roomId?: string,
  userId?: string,
  name?: string,
  avatarId?: string
) => {
  useEffect(() => {
    if (!roomId || !userId || !name || !avatarId) return;

    const socket = connectSocket(roomId, userId, name, avatarId);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("📡 Socket:", message);
      handleSocketMessage(message);
    };

    return () => {
      disconnectSocket(roomId, userId);
    };
  }, [roomId, userId, name, avatarId]);
};
 