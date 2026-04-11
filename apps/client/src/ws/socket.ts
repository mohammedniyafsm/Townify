let socket: WebSocket | null = null;

export const connectSocket = (
  roomId: string,
  userId: string,
  name: string,
  avatarId: string
) => {
  if (socket) {
    return socket;
  }
  const wsUrl = import.meta.env.VITE_WS_SERVER_URL || "ws://localhost:3008";
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    socket?.send(
      JSON.stringify({
        type: "JOIN_ROOM",
        payload: { roomId, userId, name, avatarId },
      })
    );
  };

  socket.onclose = () => {
    socket = null;
  };

  socket.onerror = (err) => {
    console.error("❌ WS error", err);
  };

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = (roomId?: string, userId?: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "LEAVE_ROOM",
        payload: { roomId, userId },
      })
    );
  }

  socket?.close();
  socket = null;
};
