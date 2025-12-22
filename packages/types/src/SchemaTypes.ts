

export interface AvatarShema{
  id: string;
  name: string;
}

export interface spaceI {
  id : string,
  name : string,
  creatorId : string,
  mapId : string,
  slug : string
}

export interface UserSchema{
    id: string;
    email: string;
    name: string;
    password?: string | null;
    googleId: string | null;
    authProvider: string;
    createdAt: Date;
    updatedAt: Date;
    profile: string | null;
    role: 'user' | 'admin' | string;
    avatarId: string | null;
    avatar?: AvatarShema;
}
