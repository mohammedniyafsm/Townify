import type WebSocket from "ws";

interface UserI {
  name : string,
  userId : string,
  avatarId : string,
  x : number,
  y : number,
  isSitting? : boolean | null,
  chairId? : number | null,
  facing? : string | null
}

export type RoomI = {
  users : Map<String,UserI>,
  sockets : Map<string,WebSocket>,
  chairs:  Map<number, string>,
}

export interface MessageI<T = any> {
  type : string,
  payload : T
}

export interface BroadcastMessage<T = any> {
  type: string;
  payload: T;
}