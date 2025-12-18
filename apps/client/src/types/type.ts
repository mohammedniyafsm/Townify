export interface DashboardNavProps {
  CreateRoom: boolean;
  setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
  JoinRoom: boolean,
  setJoinRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CreateRoomModalI {
  CreateRoom: boolean;
  setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface JoinRoomModalI {
  JoinRoom: boolean,
  setJoinRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface mapTemplateI {
    id : string,
    name : string,
    thumbnail : string,
    configJson : JSON,
    thumbnailId : string
}
