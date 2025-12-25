import axiosInstance from "./axiosInstance";

// Fetch all available room templates (maps)
export const fetchAllRoomTemplates = async () => {
  return axiosInstance.get("/map");
};

// Create a new space
export const createSpace = async (name: string, mapId: string) => {
  return axiosInstance.post("/spaces", { name, mapId });
};

// Get spaces created by / joined by the current user
export const fetchUserSpaces = async () => {
  return axiosInstance.get("/spaces/user");
};

// Delete a space (owner only)
export const deleteSpace = async (spaceId: string) => {
  return axiosInstance.delete(`/spaces/${spaceId}`);
};

// Send email invitations (owner only)
export const inviteUsersToSpace = async (
  slug: string,
  emails: string[],
  url: string
) => {
  return axiosInstance.post("/spaces/email-invitation", {
    slug,
    email: emails,
    url,
  });
};

// Get space details by slug
export const fetchSpaceBySlug = async (slug: string) => {
  return axiosInstance.get(`/spaces/${slug}`);
};

// ✅ CHECK: Does current user have access to this space?
export const checkSpaceAccess = async (slug: string) => {
  return axiosInstance.get(`/spaces/access/${slug}`);
};

// Try to join a space (entry gate)
export const joinSpace = async (slug: string) => {
  return axiosInstance.post(`/spaces/join/${slug}`);
};

// Request access to a space
export const requestSpaceAccess = async (slug: string) => {
  return axiosInstance.post(`/spaces/request-access/${slug}`);
};

// Leave a space
export const leaveSpace = async (slug: string) => {
  return axiosInstance.post(`/spaces/leave/${slug}`);
};
