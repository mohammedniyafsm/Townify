
export type ServerMessage =
  | {
    type: "ROOM_STATE";
    payload: {
      userId: string;
      name: string;
      avatarId: string;
      x: number;
      y: number;
      isSitting: boolean;
      chairId: number | null;
      facing: "up" | "down" | "left" | "right" | null;
    }[];
  }
  | {
    type: "USER_JOINED";
    payload: {
      userId: string;
      name: string;
      avatarId: string;
      x: number;
      y: number;
      isSitting: boolean;
      chairId: number | null;
      facing: "up" | "down" | "left" | "right" | null;
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
    type: "USER_SIT";
    payload: {
      userId: string;
      chairId: number;
      facing: "up" | "down" | "left" | "right";
    };
  }
  | {
    type: "USER_STAND";
    payload: {
      userId: string;
    };
  }
  | {
    type: "USER_LEFT";
    payload: {
      userId: string;
    };
  } | {
    type: "SIT_REJECTED";
    payload: {
      chairId: string;
    };
  } | {
    type: "SPACE_CHAT";
    payload: {
      spaceId: string;
      userId: string;
      text: string;
      name : string;
      avatarId : string;
      timestamp : number;
    };
  };


export type SitMessage = {
  type: "SIT";
  payload: {
    chairId: number;
    facing: "up" | "down" | "left" | "right";
  };
};

export type StandMessage = {
  type: "STAND";
  payload: {};
};
