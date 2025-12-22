

export interface AvatarSchema{
  id: string;
  name: string;
  idle:string;
  walkSheet: string;
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
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    profile: string | null;
    role: 'user' | 'admin' | string;
    avatarId: string | null;
    avatar?: AvatarSchema;
}


export interface MapSchema{
    id: string;
    name: string;
    thumbnail: string;
    configJson: JSON;
    spaces: spaceI[];
}