

export type AuthProvider = 'local' | 'google' | 'both';
export type UserRole = 'user' | 'admin';
export type MemberStatus = 'active' | 'blocked';
export type InviteType = 'email' | 'link';
export type InviteStatus = 'pending' | 'approved' | 'rejected';

export interface AvatarI {
  id: string;
  name: string;
  idle: string;
  walkSheet: string;
  // optional back-reference to users who use this avatar
  user?: UserI[];
}

export interface SpaceI {
  id: string;
  name: string;
  creatorId: string;
  mapId: string;
  slug: string;
  createdAt: string; // ISO date string
  creator?: UserI;
  map?: MapSchemaI;
  members?: SpaceMembersI[];
  invites?: SpaceInviteI[];
}

export interface UserI {
  id: string;
  email: string;
  name: string;
  password?: string | null;
  googleId?: string | null;
  authProvider: AuthProvider;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  profile?: string | null;
  role: UserRole;
  avatarId?: string | null;

  avatar?: AvatarI | null;
  space?: SpaceI[];
  spaceMember?: SpaceMembersI[];
}

export interface MapSchemaI {
  id: string;
  name: string;
  thumbnail: string;
  thumbnailId: string;
  configJson: any;

  spaces?: SpaceI[];
}

export interface SpaceMembersI {
  id: string;
  spaceId: string;
  userId: string;
  status: MemberStatus;
  joinedAt: string; // ISO date string

  space?: SpaceI;
  user?: UserI;
}

export interface SpaceInviteI {
  id: string;
  spaceId: string;
  email?: string | null;
  userId?: string | null;
  type: InviteType;
  inviteId: string;
  status: InviteStatus;
  createdAt: string; // ISO date string
  space?: SpaceI;
  userName: string
}