import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/Redux/stroe";
import type { AvatarSchema } from "@/types/type";
import Game from "../game/Game";
import Navbar from "@/components/invite/Navbar";
import { LoadingSpace } from "@/components/JoinRoom/Loading";
import BlockedUser from "@/components/JoinRoom/BlockedUser";
import SpaceNotFound from "@/components/JoinRoom/SpaceNotFound";
import { fetchSpaceBySlug, checkSpaceAccess } from "@/api/SpaceApi";
import { useSocket } from "@/hooks/useSocket";
import ChatContainer from "@/components/Space-Chat/ChatContainer";
import GameControls from "@/components/Space-Chat/GameControls";
import { useLiveKit } from "@/contexts/LiveKitContext";

import VideoComponent from "@/components/LiveKit/VideoComponent";
import AudioComponent from "@/components/LiveKit/AudioComponent";
import { Badge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SpaceState = "loading" | "allowed" | "blocked" | "not-found";

export default function Space() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.user);
  const { avatars } = useSelector((state: RootState) => state.avatars);

  const [state, setState] = useState<SpaceState>("loading");
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [spaceId, setSpaceId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const nearbyUserIds = useSelector((state: RootState) => state.visibility.nearbyUserIds);
  const selfSpaceId = useSelector((state: RootState) => state.visibility.selfSpaceId);

  const {
    connect,
    disconnect,
    participants,
    localVideoTrack,
    localAudioTrack,
    currentRoomName,
    setCurrentRoomName,
    setIsConnected
  } = useLiveKit();

  useSocket(
    state === "allowed" ? spaceId ?? undefined : undefined,
    user?.id,
    user?.name,
    user?.avatarId ? user?.avatarId ?? undefined : undefined,
  );

  const avatarMap = useMemo(() => {
    const map: Record<string, AvatarSchema> = {};
    avatars.forEach(a => (map[a.id] = a));
    return map;
  }, [avatars]);

  const localPlayer = useMemo(() => {
    if (!spaceId || !user) return null;
    return {
      roomId: spaceId,
      userId: user.id,
      name: user.name,
      avatarId: user.avatarId!,
    };
  }, [spaceId, user?.id, user?.name, user?.avatarId]);


  useEffect(() => {
    if (!slug || !user) return;

    const loadSpace = async () => {
      try {
        setState("loading");

        const accessRes = await checkSpaceAccess(slug);
        const { spaceId } = accessRes.data;

        const spaceRes = await fetchSpaceBySlug(slug);

        setMapUrl(spaceRes.data.space.map.configJson);
        setSpaceId(spaceId);
        setState("allowed");

      } catch (err: any) {
        const msg = err?.response?.data?.message;

        if (msg === "BLOCKED") setState("blocked");
        else if (msg === "SPACE_NOT_FOUND") setState("not-found");
        else animateToJoin();
      }
    };

    const animateToJoin = () => navigate(`/join/${slug}`);

    loadSpace();

    return () => {
      disconnect();
      setIsConnected(false);
    };
  }, [slug, user?.id, navigate]);


  useEffect(() => {
    if (!user) navigate(`/lobby/${slug}`);
  }, [user, slug, navigate]);


  // Handle LiveKit room switching (Global vs Space)
  useEffect(() => {
    if (state !== "allowed" || !slug) return;

    const targetRoom = selfSpaceId ? `${slug}/${selfSpaceId}` : slug;

    if (currentRoomName === targetRoom) return;

    const handleConnect = async () => {
      try {
        await connect(targetRoom);
        setCurrentRoomName(targetRoom);
        console.log("[LiveKit] Switching to room:", targetRoom);
      } catch (err) {
        console.error("[LiveKit] Switching failed:", err);
      }
    };

    handleConnect();
  }, [slug, selfSpaceId, state, currentRoomName]);
  // Removed nearbyUserIds from dependency: we don't reconnect on proximity, only on space change.

  // Compute Visible Participants
  const visibleParticipants = useMemo(() => {
    if (selfSpaceId) {
      return participants;
    } else {
      return participants.filter(p => nearbyUserIds.includes(p.identity));
    }
  }, [participants, selfSpaceId, nearbyUserIds]);

  const gridCols = useMemo(() => {
    const totalParticipants = visibleParticipants.length + 1; // +1 for local user
    if (totalParticipants <= 2) return "grid-cols-1";
    if (totalParticipants <= 4) return "grid-cols-2";
    if (totalParticipants <= 6) return "grid-cols-3";
    return "grid-cols-4";
  }, [visibleParticipants]);

  if (state !== "allowed") {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] relative">
        <Navbar />
        {state === "loading" && <LoadingSpace />}
        {state === "blocked" && <BlockedUser />}
        {state === "not-found" && <SpaceNotFound />}
      </div>
    );
  }

  if (!mapUrl || !spaceId || !user || !localPlayer) return null;

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#0f172a]">
      <Game
        mapUrl={mapUrl}
        avatarMap={avatarMap}
        localPlayer={localPlayer}
      />

      {/* Video Overlay Layer */}
      {/* Modern Video Overlay Layer */}
      {(visibleParticipants.length > 0 || selfSpaceId) && (
        <div className="absolute top-6 left-6 z-40 pointer-events-none">
          <div className={`flex justify-center gap-4 pointer-events-auto max-w-[90vw]`}>
            {/* Local User Card */}
            <TooltipProvider >
              <Card className="w-55 bg-gray-900/90 backdrop-blur-sm border-gray-700 overflow-hidden shadow-2xl transition-all hover:scale-[1.02]">
                <CardContent className="p-0 relative">
                  <div className="relative aspect-video">
                    <VideoComponent
                      track={localVideoTrack ?? undefined}
                      participantIdentity={user?.name}
                      local
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate">
                          {user?.name}
                        </span>
                        <Badge className="text-xs">
                          You
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {localVideoTrack && (
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Video on</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {localAudioTrack && (
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Audio on</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Remote Participants */}
              {visibleParticipants.map((participant) => {
                const videoPub = Array.from(participant.videoTrackPublications.values())[0];
                const audioPub = Array.from(participant.audioTrackPublications.values())[0];

                const videoTrack = videoPub?.track as any;
                const audioTrack = audioPub?.track as any;

                return (
                  <Card
                    key={participant.sid}
                    className="w-64 bg-gray-900/90 backdrop-blur-sm border-gray-700 overflow-hidden shadow-2xl transition-all hover:scale-[1.02]"
                  >
                    <CardContent className="p-0 relative">
                      <div className="relative aspect-video">
                        <VideoComponent
                          track={videoTrack}
                          participantIdentity={participant.name || participant.identity}
                        />
                        {audioTrack && <AudioComponent track={audioTrack} />}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white truncate">
                            {participant.name || participant.identity}
                          </span>
                          <div className="flex items-center gap-1">
                            {videoTrack && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Video on</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {audioTrack && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Audio on</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TooltipProvider>
          </div>
        </div>
      )}


      <ChatContainer
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
      />

      <GameControls
        totalMembers={participants.length + 1 || 0}
        isChatOpen={isChatOpen}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        gameSlug={slug}
      />
    </div>
  );
}

