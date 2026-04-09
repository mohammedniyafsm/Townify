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
  id: string,
  name: string,
  thumbnail: string,
  configJson: JSON,
  thumbnailId: string
}

interface spaceMembersI {
  id: string,
  isActive: string,
  joinedAt: string,
  slugId: string,
  userId: string
}

export interface UserSpace {
  creatorId: string,
  id: string,
  mapId: string,
  name: string,
  slug: string,
  map: {
    configJson: string,
    id: string,
    name: string,
    thumbnail: string,
    thumbnailId: string,
  }
  spaceMembers: spaceMembersI[]
}

export interface Avatar {
  id: string;
  name: string;
  idle : string;
  walkSheet: string;
}

export interface AllAvatarsModalI {
  openModal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentAvatar: Avatar | null ;
  setCurrentAvatars: React.Dispatch<React.SetStateAction<Avatar | null>>;
  avatars: Avatar[];
}

export interface AvatarSchema {
  id: string;
  name: string;
  idle: string;        
  walkSheet: string;   

  frameWidth?: number;
  frameHeight?: number;
}

export interface PlayerIdentity {
  roomId :string,
  userId: string;
  name: string;
  avatarId: string;
}

