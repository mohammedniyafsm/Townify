
import type WebSocket from "ws";

export interface UserI {
  name: string,
  userId: string,
  avatarId: string,
  x: number,
  y: number,
  neighbours: Set<string>;
  isSitting?: boolean | null,
  chairId?: number | null,
  facing?: string | null,
  spaceId?: string | null
}

export type RoomI = {
  users: Map<string, UserI>,
  sockets: Map<string, WebSocket>,
  chairs: Map<number, string>,
  spaces: Map<string, Set<string>>
}

export interface MessageI<T = any> {
  type: string,
  payload: T
}

export interface BroadcastMessage<T = any> {
  type: string;
  payload: T;
}