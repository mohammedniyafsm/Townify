
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
      id: string;
      spaceId: string;
      userId: string;
      text: string;
      name: string;
      avatarId: string;
      timestamp: number;
    };
  } | {
    type: "ROOM_CHAT";
    payload: {
      id: string;
      spaceId: string;
      userId: string;
      text: string;
      name: string;
      avatarId: string;
      timestamp: number;
    };
  } | {
    type: "SPACE_CHAT_HISTORY";
    payload: {
      history: {
        id: string;
        spaceId: string;
        userId: string;
        text: string;
        name: string;
        avatarId: string;
        timestamp?: number;
        ts?: number;
      }[];
    };
  } | {
    type: "ROOM_CHAT_HISTORY";
    payload: {
      history: {
        id: string;
        userId: string;
        text: string;
        name: string;
        avatarId: string;
        timestamp?: number;
        ts?: number;
      }[];
    };
  } | {
    type: "USER_NEARBY_ENTER";
    payload: {
      userId: string;
      targetUserId: string;
    };
  } | {
    type: "USER_NEARBY_LEAVE";
    payload: {
      targetUserId: string;
    };
  } | {
    type: "USER_JOINED_SPACE";
    payload: {
      userId: string;
      name: string;
      spaceId: string;
    };
  } | {
    type: "USER_LEFT_SPACE";
    payload: {
      userId: string;
      name: string;
      spaceId: string;
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
