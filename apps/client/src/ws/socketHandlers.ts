import { getMainScene } from "@/game/scenes/sceneRegistry";
import type { ServerMessage } from "./socketTypes";
import { getSocket } from "./socket";
import { pushMessage, bulkAddMessages } from "@/hooks/useSpaceChat";
import { MAIN_SPACE } from "@/components/Space-Chat/constants";
import store from "@/Redux/stroe";
import {
  addNearbyUser,
  removeNearbyUser,
  addSpaceUser,
  removeSpaceUser,
  setSelfSpaceId,
  removeAllSpaceUser
} from "@/Redux/Slice/Visibility/visibilitySlice";


let pending: ServerMessage[] = [];

// Redux handles visibility now, so we don't need these manual callbacks
// but we keep the logic within the store dispatching



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

        if (u.isSitting && u.chairId) {
          scene.remoteSit(u.userId, u.chairId, u.facing);
        }
      });
      break;

    case "USER_NEARBY_ENTER":
      console.log("USER_NEARBY_ENTER", message.payload);
      const enterId = (message.payload as any).targetUserId || (message.payload as any).userId;
      if (enterId) store.dispatch(addNearbyUser(enterId));
      break;

    case "USER_NEARBY_LEAVE":
      console.log("USER_NEARBY_LEAVE", message.payload);
      const leaveId = (message.payload as any).targetUserId || (message.payload as any).userId;
      if (leaveId) store.dispatch(removeNearbyUser(leaveId));

      break;


    case "USER_JOINED_SPACE": {
      const joinUserId = message.payload.userId;
      const joinSpaceId = message.payload.spaceId;
      const currentUserId = store.getState().user.user?.id;
      console.log("USER_JOINED_SPACE", joinUserId, joinSpaceId, currentUserId);

      if (joinUserId === currentUserId) {
        store.dispatch(setSelfSpaceId(joinSpaceId));
      }

      if (joinUserId && joinUserId !== currentUserId) store.dispatch(addSpaceUser(joinUserId));
      break;

    }
    case "USER_LEFT_SPACE": {
      const leftUserId = message.payload.userId;
      const myId = store.getState().user.user?.id;
      console.log("USER_LEFT_SPACE", leftUserId, myId);
      if (leftUserId === myId) {
        store.dispatch(removeAllSpaceUser());
        store.dispatch(setSelfSpaceId(null));
      }
      if (leftUserId) store.dispatch(removeSpaceUser(leftUserId));
      break;
    }




    case "USER_JOINED":
      scene.addRemotePlayer(message.payload);
      if (message.payload.isSitting && message.payload.chairId) {
        scene.remoteSit(
          message.payload.userId,
          message.payload.chairId,
          message.payload.facing
        );
      }
      break;

    case "USER_MOVED":
      scene.moveRemotePlayer(
        message.payload.userId,
        message.payload.x,
        message.payload.y
      );
      break;

    case "USER_SIT":
      scene.remoteSit(
        message.payload.userId,
        message.payload.chairId,
        message.payload.facing
      );
      break;

    case "USER_STAND":
      scene.remoteStand(message.payload.userId);
      break;

    case "USER_LEFT":
      scene.removeRemotePlayer(message.payload.userId);
      if (message.payload.userId) {
        store.dispatch(removeNearbyUser(message.payload.userId));
        store.dispatch(removeSpaceUser(message.payload.userId));
      }
      break;


    case "SIT_REJECTED":
      console.warn("Chair already occupied:", message.payload.chairId);
      break;

    case "SPACE_CHAT":
      console.log("Processing SPACE_CHAT");
      pushMessage(message.payload);
      break;

    case "ROOM_CHAT":
      console.log("Processing ROOM_CHAT");
      pushMessage({
        ...message.payload,
        spaceId: MAIN_SPACE.id,
      });
      break;

    case "SPACE_CHAT_HISTORY":
      console.log("Processing SPACE_CHAT_HISTORY", message.payload.history.length);
      bulkAddMessages(message.payload.history);
      break;

    case "ROOM_CHAT_HISTORY":
      console.log("Processing ROOM_CHAT_HISTORY", message.payload.history.length);
      bulkAddMessages(message.payload.history);
      break;

  }
}

// WebSocket Sender helpers
export const sendMove = (x: number, y: number) => {
  const socket = getSocket();
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "USER_MOVE", payload: { x, y } }));
};

export const sendSit = (chairId: number, facing: "up" | "down" | "left" | "right") => {
  const socket = getSocket();
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "SIT", payload: { chairId, facing } }));
};

export const sendStand = () => {
  const socket = getSocket();
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "STAND", payload: {} }));
};

export const sendJoinSpace = (spaceId: string) => {
  const socket = getSocket();
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "JOIN_SPACE", payload: { spaceId } }));
};

export const sendLeaveSpace = () => {
  const socket = getSocket();
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "LEAVE_SPACE", payload: {} }));
};

export const sendSpaceChat = (text: string) => {
  const socket = getSocket();
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify({
    type: "SPACE_CHAT",
    payload: { text, timestamp: Date.now() },
  }));
};

export const sendRoomChat = (text: string, userId: string, name: string, avatarId: string) => {
  const socket = getSocket();
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify({
    type: "ROOM_CHAT",
    payload: { text, userId, name, avatarId, timestamp: Date.now() },
  }));
};
;
