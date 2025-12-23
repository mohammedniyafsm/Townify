import {
  createSpaceRepo,
  findSpaceById,
  findSpaceBySlug,
  updateSpaceRepo,
  deleteSpaceRepo,
  getSpacesByUser,
  addMember,
  findMember,
  removeMember,
  blockMember,
} from "./spaces.repository.js";
import { sendInvitationEmail } from "../../shared/services/nodemailer.service.js";

export const createSpaceService = async (
  userId: string,
  name: string,
  mapId?: string
) => {
  if (!name.trim()) throw new Error("INVALID_NAME");

  if(!name || !userId || !mapId) return;

  const space = await createSpaceRepo({ name, creatorId: userId, mapId });
  await addMember(space.slug, userId);

  return space;
};

export const updateSpaceService = async (
  spaceId: string,
  name?: string,
  mapId?: string
) => {
  const space = await findSpaceById(spaceId);
  if (!space) throw new Error("SPACE_NOT_FOUND");

  return updateSpaceRepo(spaceId, {
    ...(name && { name: name.trim() }),
    ...(mapId && { mapId }),
  });
};

export const deleteSpaceService = async (
  spaceId: string,
  userId: string
) => {
  const space = await findSpaceById(spaceId);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  if (space.creatorId !== userId) throw new Error("FORBIDDEN");

  await deleteSpaceRepo(spaceId, space.slug);
};

export const joinSpaceService = async (slug: string, userId: string) => {
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");

  const member = await findMember(slug, userId);
  if (member) throw new Error("ALREADY_MEMBER");

  return addMember(slug, userId);
};

export const leaveSpaceService = async (slug: string, userId: string) => {
  const member = await findMember(slug, userId);
  if (!member) throw new Error("NOT_MEMBER");

  await removeMember(member.id);
};

export const blockUserService = async (
  slug: string,
  creatorId: string,
  userIdToBlock: string
) => {
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");
  if (space.creatorId !== creatorId) throw new Error("FORBIDDEN");

  const member = await findMember(slug, userIdToBlock);
  if (!member) throw new Error("NOT_MEMBER");

  return blockMember(member.id);
};

export const sendInvitationService = async (
  slug: string,
  emails: string[],
  inviterEmail: string,
  url: string
) => {
  const space = await findSpaceBySlug(slug);
  if (!space) throw new Error("SPACE_NOT_FOUND");

  await Promise.all(
    emails.map((e) =>
      sendInvitationEmail(e.trim(), space.name, inviterEmail, `${url}/${slug}`)
    )
  );
};

export const getUserSpacesService = async (userId: string) => {
  return getSpacesByUser(userId);
};

export const findSpaceBySlugService = async (slug:string)=>{
  return findSpaceBySlug(slug);
}