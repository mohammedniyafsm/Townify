import type WebSocket from "ws";

interface UserI {
  name : string,
  userId : string,
  x : number,
  y : number,
}

export type RoomI = {
  users : Map<String,UserI>,
  sockets : Map<string,WebSocket>
}

export interface MessageI<T = any> {
  type : string,
  payload : T
}

export interface BroadcastMessage<T = any> {
  type: string;
  payload: T;
}