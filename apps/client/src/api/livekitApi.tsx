import axiosInstance from "./axiosInstance"

export const getLiveKitToken = async (roomName: string, participantName: string, participantId: string, avatarImage?: string) => {
    return axiosInstance.post("/api/livekit/token", { roomName, participantName, participantId, avatarImage })
}