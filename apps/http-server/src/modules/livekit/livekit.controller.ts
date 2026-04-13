import type { Request, Response } from "express";
import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.LIVEKIT_API_KEY;

const apiSecret = process.env.LIVEKIT_API_SECRET;

export const getToken = async (req: Request, res: Response) => {
  const { roomName, participantId, participantName, avatarImage } = req.body;

  if (!roomName || !participantId || !participantName || !avatarImage) {
    res.status(400).json({ errorMessage: "roomName, participantId, participantName, and avatarImage are required" });
    return;
  }
  
  if (!apiKey || !apiSecret) {
    res.status(500).json({ errorMessage: "LiveKit API key or secret not configured" });
    return;
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantId,
      name: participantName,
      metadata: JSON.stringify({ avatarImage: avatarImage || "" }),
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    res.status(500).json({ errorMessage: "Failed to generate token" });
  }
};
