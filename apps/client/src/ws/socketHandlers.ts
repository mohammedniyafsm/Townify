import { getMainScene } from "@/game/scenes/sceneRegistry";
import type { ServerMessage } from "./socketTypes";
import { getSocket } from "./socket";

let pending: ServerMessage[] = [];

export const handleSocketMessage = (message: ServerMessage) => {
  const scene = getMainScene();

  if (!scene) {
    pending.push(message);
    return;
  }

  process(scene, message);
};

export const flushPendingMessages = () => {
  const scene = getMainScene();
  if (!scene) return;

  pending.forEach(m => process(scene, m));
  pending = [];
};

function process(scene: any, message: ServerMessage) {
  switch (message.type) {
    case "ROOM_STATE":
      message.payload.forEach((u: any) => {
        scene.isLocalUser(u.userId)
          ? scene.spawnLocalPlayer(u)
          : scene.addRemotePlayer(u);
      });
      break;

    case "USER_JOINED":
      scene.addRemotePlayer(message.payload);
      break;

    case "USER_MOVED":
      scene.moveRemotePlayer(
        message.payload.userId,
        message.payload.x,
        message.payload.y
      );
      break;

    case "USER_LEFT":
      scene.removeRemotePlayer(message.payload.userId);
      break;
  }
}

  export const sendMove = (x: number, y: number) => {
    const socket = getSocket();
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(
      JSON.stringify({
        type: "USER_MOVE",
        payload: { x, y },
      })
    );
  };
