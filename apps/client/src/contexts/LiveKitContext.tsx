import React, { createContext, useContext, useState } from "react";
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalVideoTrack,
  LocalAudioTrack,
} from "livekit-client";

import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux/stroe";
import { removeAllnearByUser, removeAllSpaceUser } from "@/Redux/Slice/Visibility/visibilitySlice";
import { getLiveKitToken } from "@/api/livekitApi";

interface LiveKitContextType {
  room: Room | null;
  currentRoomName: string | null;
  setCurrentRoomName: (roomName: string) => void;
  connect: (roomName: string) => Promise<void>;
  disconnect: () => Promise<void>;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
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

  const disconnect = async () => {
    if (activeLkRoom) {
      // Explicitly stop tracks
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
      publishDefaults: {
        videoEncoding: {
          maxBitrate: 1_200_000,
          maxFramerate: 25,
        },
      },
    });

    // Event Listeners for Participants
    const updateParticipants = () => {
      setParticipants(Array.from(room.remoteParticipants.values()));
    };

    room.on(RoomEvent.ParticipantConnected, updateParticipants);
    room.on(RoomEvent.ParticipantDisconnected, updateParticipants);
    // Also update on track subscriptions to ensure UI refreshes if a track appears late
    room.on(RoomEvent.TrackSubscribed, updateParticipants);
    room.on(RoomEvent.TrackUnsubscribed, updateParticipants);
    room.on(RoomEvent.TrackPublished, updateParticipants);
    room.on(RoomEvent.TrackUnpublished, updateParticipants);

    try {
      console.log(user)
      const response = await getLiveKitToken(targetRoomName, user?.name || "", user?.id || "");
      console.log(response.data)
      console.log(LIVEKIT_URL)
      await room.connect(LIVEKIT_URL, response.data.token);

      console.log("connected")
      console.log(room)
      setIsAudioEnabled(false);
      setIsVideoEnabled(false);
      setIsConnected(true);
      setActiveLkRoom(room);
      setParticipants(Array.from(room.remoteParticipants.values()));
      console.log("participants", participants)
    } catch (error) {
      console.error("[LiveKit] Connection failed:", error);
      throw error;
    }
  }

  async function toggleAudio() {
    if (activeLkRoom && activeLkRoom.localParticipant) {
      const newValue = !isAudioEnabled;
      await activeLkRoom.localParticipant.setMicrophoneEnabled(newValue);
      setIsAudioEnabled(newValue);

      if (newValue) {
        const audioPub = activeLkRoom.localParticipant.audioTrackPublications.values().next().value;
        setLocalAudioTrack(audioPub?.audioTrack ?? null);
      } else {
        setLocalAudioTrack(null);
      }
    }
  }

  async function toggleVideo() {
    try {
      if (activeLkRoom && activeLkRoom.localParticipant) {
        const newValue = !isVideoEnabled;
        await activeLkRoom.localParticipant.setCameraEnabled(newValue);
        setIsVideoEnabled(newValue);

        if (newValue) {
          const videoPub = activeLkRoom.localParticipant.videoTrackPublications.values().next().value;
          setLocalVideoTrack(videoPub?.videoTrack ?? null);
        } else {
          setLocalVideoTrack(null);
        }
      }
    } catch (error) {
      console.error("[LiveKit] Failed to toggle video:", error);
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

