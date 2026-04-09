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
      handleSocketMessage(JSON.parse(event.data));
    };

    return () => {
      disconnectSocket();
    };
  }, [roomId]);
};
