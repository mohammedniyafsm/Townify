import { redis } from "./index.js";
import crypto from "crypto";

export interface RoomMessage {
  id: string;
  roomId: string;
  userId: string;
  name: string;
  text: string;
  ts: number;
  avatarId: string,
  spaceId?: string | undefined;
}

function getMessageKey(roomId: string, spaceId?: string) {
  if (spaceId) {
    return `room:${roomId}:sub:${spaceId}:messages`;
  }
  return `room:${roomId}:messages`;
}

export async function addRoomMessage(
  roomId: string,
  userId: string,
  name: string,
  avatarId: string,
  text: string,
  spaceId?: string
): Promise<RoomMessage> {
  const key = getMessageKey(roomId, spaceId);

  const message: RoomMessage = {
    id: crypto.randomUUID(),
    roomId,
    spaceId,
    userId,
    name,
    avatarId,
    text,
    ts: Date.now(),
  };

  await redis.rpush(key, message);
  await redis.ltrim(key, -100, -1);
  await redis.expire(key, 60 * 60 * 24);

  return message;
}

export async function getRoomMessages(
  roomId: string,
  limit = 50,
  spaceId?: string
): Promise<RoomMessage[]> {
  const key = getMessageKey(roomId, spaceId);
  return redis.lrange(key, -limit, -1);
}

export async function handleUserLeaveRoom(
  roomId: string,
  userId: string,
  spaceId?: string
) {
  const membersKey = spaceId
    ? `room:${roomId}:sub:${spaceId}:members`
    : `room:${roomId}:members`;

  const messagesKey = spaceId
    ? `room:${roomId}:sub:${spaceId}:messages`
    : `room:${roomId}:messages`;

  await redis.srem(membersKey, userId);

  const membersCount = await redis.scard(membersKey);

  // 👇 nobody left in room
  if (membersCount === 0) {
    await redis.expire(messagesKey, 60 * 60);
    await redis.expire(membersKey, 60 * 60);
  }
}

export async function handleUserJoinRoom(
  roomId: string,
  userId: string,
  spaceId?: string
) {
  const membersKey = spaceId
    ? `room:${roomId}:sub:${spaceId}:members`
    : `room:${roomId}:members`;

  const messagesKey = spaceId
    ? `room:${roomId}:sub:${spaceId}:messages`
    : `room:${roomId}:messages`;

  await redis.sadd(membersKey, userId);

  await redis.persist(messagesKey);
  await redis.persist(membersKey);
}
