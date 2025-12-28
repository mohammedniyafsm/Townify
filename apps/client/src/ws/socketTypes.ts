export type JoinRoomMessage = {
  type: "JOIN_ROOM";
  payload: {
    roomId: string;
    userId: string;
    name: string;
  };
};

export type UserMoveMessage = {
  type: "USER_MOVE";
  payload: {
    x: number;
    y: number;
  };
};

export type LeaveRoomMessage = {
  type: "LEAVE_ROOM";
  payload: {};
};

export type ServerMessage =
  | {
      type: "ROOM_STATE";
      payload: {
        userId: string;
        name: string;
        avatarId : string;
        x: number;
        y: number;
      }[];
    }
  | {
      type: "USER_JOINED";
      payload: {
        userId: string;
        name: string;
        avatarId : string;
        x: number;
        y: number;
      };
    }
  | {
      type: "USER_MOVED";
      payload: {
        userId: string;
        x: number;
        y: number;
      };
    }
  | {
      type: "USER_LEFT";
      payload: {
        userId: string;
      };
    };
