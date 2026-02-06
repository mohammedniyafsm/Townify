import type WebSocket from "ws";
import type { RoomI, UserI } from "./types.js";

const PROXIMITY_RADIUS = 80;



export const isNear = (a: UserI, b: UserI) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy <= PROXIMITY_RADIUS * PROXIMITY_RADIUS;
};

export const userMoved = (room: RoomI, user: UserI, userId: string) => {
  for (const [otherId, otherUser] of room.users) {
    if (userId == otherId) continue;
    // ISOLATION RULE: If either user is in a space, they cannot see each other via proximity
    // (Proximity only works for users in the "global" area)
    if (user.spaceId || otherUser.spaceId) continue;

    const near = isNear(user, otherUser);
    const aldready = user.neighbours.has(otherId);
    if (near && !aldready) {
      user.neighbours.add(otherId);
      otherUser.neighbours.add(userId);
      console.log(`[Proximity] ${userId} Entered ${otherId}`);
      sendToUser(room.sockets, userId, {
        type: "USER_NEARBY_ENTER",
        payload: { targetUserId: otherId },
      });
      sendToUser(room.sockets, otherId, {
        type: "USER_NEARBY_ENTER",
        payload: { targetUserId: userId },
      });
    }
    if (!near && aldready) {
      user.neighbours.delete(otherId);
      otherUser.neighbours.delete(userId);
      console.log(`[Proximity] ${userId} Left ${otherId}`);
      sendToUser(room.sockets, userId, {
        type: "USER_NEARBY_LEAVE",
        payload: { targetUserId: otherId },
      });
      sendToUser(room.sockets, otherId, {
        type: "USER_NEARBY_LEAVE",
        payload: { targetUserId: userId },
      });
    }

  }
};

export const cleanUpUser = (room: RoomI, userId: string) => {
  const user = room.users.get(userId);
  if (!user) return;
  for (const neighborId of user.neighbours) {
    const otherUser = room.users.get(neighborId);
    if (!otherUser) continue;
    console.log(`[Proximity] Force Cleanup: ${userId} Leaving ${neighborId}`);
    sendToUser(room.sockets, neighborId, {
      type: "USER_NEARBY_LEAVE",
      payload: { targetUserId: userId },
    });
    sendToUser(room.sockets, userId, {
      type: "USER_NEARBY_LEAVE",
      payload: { targetUserId: neighborId },
    });
    otherUser.neighbours.delete(userId);

  }
  user.neighbours.clear();
};

const sendToUser = (
  sockets: Map<string, WebSocket>,
  userId: string,
  message: any
) => {
  const socket = sockets.get(userId);
  if (!socket) return;
  socket.send(JSON.stringify(message));
};
