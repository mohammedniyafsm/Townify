// LiveKitContext.tsx
import React, { createContext, useContext, useState } from "react";
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalVideoTrack,
  LocalAudioTrack,
  AudioPresets,
} from "livekit-client";

import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux/stroe";
import { removeAllnearByUser, removeAllSpaceUser } from "@/Redux/Slice/Visibility/visibilitySlice";
import { getLiveKitToken } from "@/api/livekitApi";
import { toast } from "sonner";

interface LiveKitContextType {
  room: Room | null;
  currentRoomName: string | null;
  setCurrentRoomName: (roomName: string) => void;
  connect: (roomName: string) => Promise<void>;
  disconnect: () => Promise<void>;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  setIsAudioEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVideoEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  participants: RemoteParticipant[];
  localVideoTrack: LocalVideoTrack | null;
  localAudioTrack: LocalAudioTrack | null;
  toggleAudio: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
}

const LiveKitContext = createContext<LiveKitContextType | undefined>(undefined);

export const LiveKitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const [currentRoomName, setCurrentRoomName] = useState<string | null>(null);
  const [activeLkRoom, setActiveLkRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

  // Media State
  const [isAudioEnabled, setIsAudioEnabled] = useState(false); // Default OFF
  const [isVideoEnabled, setIsVideoEnabled] = useState(false); // Default OFF
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";
  console.log("LiveKit URL:", LIVEKIT_URL);

  const disconnect = async () => {
    if (activeLkRoom) {
      activeLkRoom.localParticipant.videoTrackPublications.forEach((pub) => pub.track?.stop());
      activeLkRoom.localParticipant.audioTrackPublications.forEach((pub) => pub.track?.stop());
      await activeLkRoom.disconnect();
    }
    setActiveLkRoom(null);
    setParticipants([]);
    setLocalVideoTrack(null);
    setLocalAudioTrack(null);
    setIsConnected(false);
    setIsAudioEnabled(false);
    setIsVideoEnabled(false);
    dispatch(removeAllSpaceUser());
    dispatch(removeAllnearByUser());
  };

  async function connect(targetRoomName: string) {
    console.log(`[LiveKit] Connecting to: ${targetRoomName}`);
    if (activeLkRoom) {
      await activeLkRoom.disconnect();
    }

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      audioCaptureDefaults: {
        sampleRate: 48000,
        sampleSize: 24,
        channelCount: 2,
        noiseSuppression: false,
        autoGainControl: false,
      },
      publishDefaults: {
        videoEncoding: {
          maxBitrate: 1_200_000,
          maxFramerate: 25,
        },
        audioPreset: AudioPresets.musicHighQualityStereo,
        dtx: false,
        red: true,
      },
    });

    // Event Listeners for Participants
    const updateParticipants = () => {
      setParticipants(Array.from(room.remoteParticipants.values()));
    };

    room.on(RoomEvent.ParticipantConnected, updateParticipants);
    room.on(RoomEvent.ParticipantDisconnected, updateParticipants);
    room.on(RoomEvent.TrackSubscribed, updateParticipants);
    room.on(RoomEvent.TrackUnsubscribed, updateParticipants);
    room.on(RoomEvent.TrackPublished, updateParticipants);
    room.on(RoomEvent.TrackUnpublished, updateParticipants);

    try {
      const avatarImage = user?.avatar?.idle || "";
      const response = await getLiveKitToken(targetRoomName, user?.name || "", user?.id || "", avatarImage);
      await room.connect(LIVEKIT_URL, response.data.token);
      // Apply our pre-existing intent to the room
      if (isAudioEnabled) {
        try {
          await room.localParticipant.setMicrophoneEnabled(true);
          const audioPub = room.localParticipant.audioTrackPublications.values().next().value;
          setLocalAudioTrack(audioPub?.audioTrack ?? null);
        } catch (e) {
          console.error("Failed to enable microphone on join", e);
          setIsAudioEnabled(false); // Revert if failed
        }
      }

      if (isVideoEnabled) {
        try {
          await room.localParticipant.setCameraEnabled(true);
          const videoPub = room.localParticipant.videoTrackPublications.values().next().value;
          setLocalVideoTrack(videoPub?.videoTrack ?? null);
        } catch (e) {
          console.error("Failed to enable camera on join", e);
          toast.error("Unable to access the camera. Please make sure it is not being used by another application.", {
            position: "top-center",
            duration: 1500,
          });
          setIsVideoEnabled(false); // Revert if failed
        }
      }

      setIsConnected(true);
      setActiveLkRoom(room);
      setParticipants(Array.from(room.remoteParticipants.values()));
    } catch (error) {
      console.error("[LiveKit] Connection failed:", error);
      throw error;
    }
  }

  async function toggleAudio() {
    const newValue = !isAudioEnabled;
    setIsAudioEnabled(newValue);

    if (activeLkRoom && activeLkRoom.localParticipant) {
      try {
        await activeLkRoom.localParticipant.setMicrophoneEnabled(newValue);
        if (newValue) {
          const audioPub = activeLkRoom.localParticipant.audioTrackPublications.values().next().value;
          setLocalAudioTrack(audioPub?.audioTrack ?? null);
        } else {
          setLocalAudioTrack(null);
        }
      } catch (error) {
        console.error("Failed to toggle audio", error);
        setIsAudioEnabled(!newValue); // Revert
      }
    }
  }

  async function toggleVideo() {
    const newValue = !isVideoEnabled;
    setIsVideoEnabled(newValue);

    try {
      if (activeLkRoom && activeLkRoom.localParticipant) {
        await activeLkRoom.localParticipant.setCameraEnabled(newValue);
        if (newValue) {
          const videoPub = activeLkRoom.localParticipant.videoTrackPublications.values().next().value;
          setLocalVideoTrack(videoPub?.videoTrack ?? null);
        } else {
          setLocalVideoTrack(null);
        }
      }
    } catch (error) {
      toast.error("Unable to access the camera. Please make sure it is not being used by another application.", {
        position: "top-center",
        duration: 1500,
      });
      console.error("[LiveKit] Failed to toggle video:", error);
      setIsVideoEnabled(!newValue); // Revert
    }
  }

  return (
    <LiveKitContext.Provider value={{
      room: activeLkRoom,
      currentRoomName,
      setCurrentRoomName,
      connect,
      disconnect,
      isAudioEnabled,
      isVideoEnabled,
      setIsAudioEnabled,
      setIsVideoEnabled,
      participants,
      localVideoTrack,
      localAudioTrack,
      toggleAudio,
      toggleVideo,
      isConnected,
      setIsConnected
    }}>
      {children}
    </LiveKitContext.Provider>
  );
};

export const useLiveKit = () => {
  const context = useContext(LiveKitContext);
  if (!context) throw new Error("useLiveKit must be used within a LiveKitProvider");
  return context;
};