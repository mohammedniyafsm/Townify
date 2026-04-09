import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux/stroe";
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

import { LocalVideoTrack, RemoteVideoTrack, LocalAudioTrack, RemoteAudioTrack } from "livekit-client";

import ExpandedFocusView from "@/components/LiveKit/ExpandedFocus";
import CollapsedVideoGrid from "@/components/LiveKit/CollapsedVideoGrid";
import ExpandedVideoGrid from "@/components/LiveKit/ExpandedVideoGrid";
import { fetchSpaceDetails } from "@/Redux/Slice/ManageSpace/ManageSpaceThunk";
import { BlockedUserDialog } from "@/components/Notification/User/BlockedUserDialog";

type SpaceState = "loading" | "allowed" | "blocked" | "not-found";
type VideoViewMode = "collapsed" | "expanded-grid" | "expanded-focus";

export default function Space() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.user);
  const { avatars } = useSelector((state: RootState) => state.avatars);
  const dispatch = useDispatch<AppDispatch>()

  const [state, setState] = useState<SpaceState>("loading");
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [spaceId, setSpaceId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Video overlay state
  const [videoViewMode, setVideoViewMode] = useState<VideoViewMode>("collapsed");
  const [focusedParticipantId, setFocusedParticipantId] = useState<string>("local");

  const nearbyUserIds = useSelector((state: RootState) => state.visibility.nearbyUserIds);
  const spaceUserIds = useSelector((state: RootState) => state.visibility.spaceUserIds);
  const selfSpaceId = useSelector((state: RootState) => state.visibility.selfSpaceId);
  const spaceUser = useSelector((state: RootState) => state.manageSpace)
  const isFetched = useRef(false)

  const liveKit = useLiveKit();
  const {
    connect,
    disconnect,
    participants,
    localVideoTrack,
    localAudioTrack,
    currentRoomName,
    setCurrentRoomName,
    setIsConnected
  } = liveKit;

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
    if (isFetched.current) {
      return
    }
    const loadSpace = async () => {
      try {
        setState("loading");

        const accessRes = await checkSpaceAccess(slug);
        const { spaceId, role } = accessRes.data;

        const spaceRes = await fetchSpaceBySlug(slug);

        if (role === "owner" && spaceUser.status !== 'succeeded') {
          await dispatch(fetchSpaceDetails(slug)).unwrap()
        }
        setMapUrl(spaceRes.data.space.map.configJson);
        setSpaceId(spaceId);
        setState("allowed");
        isFetched.current = true
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

  useEffect(() => {
    isFetched.current = false
  }, [slug])

  // Handle LiveKit room switching
  useEffect(() => {
    if (state !== "allowed" || !slug) return;

    const targetRoom = slug;

    if (currentRoomName === targetRoom) return;

    const handleConnect = async () => {
      try {
        await connect(targetRoom);
        setCurrentRoomName(targetRoom);
      } catch (err) {
        console.error("[LiveKit] Switching failed:", err);
      }
    };

    handleConnect();
  }, [slug, state, currentRoomName]);

  // Compute Visible Participants
  const visibleParticipants = useMemo(() => {
    console.log("selfSpaceId", selfSpaceId);
    console.log("participants", participants);
    console.log("nearbyUserIds", nearbyUserIds);
    console.log("spaceUserIds", spaceUserIds);
    if (selfSpaceId) {
      return participants.filter(p => spaceUserIds.includes(p.identity) && p.identity !== user?.id);
    } else {
      return participants.filter(p => nearbyUserIds.includes(p.identity));
    }
  }, [participants, selfSpaceId, nearbyUserIds, spaceUserIds]);



  // Handle keyboard shortcuts (Escape key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (videoViewMode === "expanded-focus") {
          // First press: Exit focus mode
          setVideoViewMode("expanded-grid");
          e.preventDefault();
        } else if (videoViewMode === "expanded-grid") {
          // Second press: Exit expanded mode
          setVideoViewMode("collapsed");
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoViewMode]);

  // Get participant data
  interface ParticipantData {
    id: string;
    name: string;
    videoTrack?: LocalVideoTrack | RemoteVideoTrack;
    audioTrack?: LocalAudioTrack | RemoteAudioTrack;
    isLocal: boolean;
  }

  const getParticipantData = useCallback((participantId: string): ParticipantData | null => {
    if (participantId === "local") {
      return {
        id: "local",
        name: user?.name || "You",
        videoTrack: localVideoTrack || undefined,
        audioTrack: localAudioTrack || undefined,
        isLocal: true
      };
    }

    const participant = visibleParticipants.find(p => p.sid === participantId);
    if (!participant) return null;

    const videoPub = Array.from(participant.videoTrackPublications.values())[0];
    const audioPub = Array.from(participant.audioTrackPublications.values())[0];

    return {
      id: participant.sid,
      name: participant.name || participant.identity,
      videoTrack: videoPub?.track as LocalVideoTrack | RemoteVideoTrack,
      audioTrack: audioPub?.track as LocalAudioTrack | RemoteAudioTrack,
      isLocal: false
    };
  }, [user, localVideoTrack, localAudioTrack, visibleParticipants]);

  const focusedParticipant = getParticipantData(focusedParticipantId);

  const allParticipants = useMemo(() => {
    if (visibleParticipants.length === 0) {
      return visibleParticipants.map(p => {
        const videoPub = Array.from(p.videoTrackPublications.values())[0];
        const audioPub = Array.from(p.audioTrackPublications.values())[0];
        return {
          id: p.sid,
          name: p.name || p.identity,
          videoTrack: videoPub?.track,
          audioTrack: audioPub?.track,
          isLocal: false
        };
      });
    }

    // Include local video at the beginning when others are present
    return [
      {
        id: "local",
        name: user?.name || "You",
        videoTrack: localVideoTrack || undefined,
        audioTrack: localAudioTrack || undefined,
        isLocal: true
      },
      ...visibleParticipants.map(p => {
        const videoPub = Array.from(p.videoTrackPublications.values())[0];
        const audioPub = Array.from(p.audioTrackPublications.values())[0];
        return {
          id: p.sid,
          name: p.name || p.identity,
          videoTrack: videoPub?.track,
          audioTrack: audioPub?.track,
          isLocal: false
        };
      })
    ];
  }, [user, localVideoTrack, localAudioTrack, visibleParticipants]);

  // Handle mode transitions
  const handleEnterExpandedGrid = () => {
    setVideoViewMode("expanded-grid");
  };

  const handleToggleFocus = (participantId: string) => {
    setFocusedParticipantId(participantId);
    setVideoViewMode("expanded-focus");
  };

  const handleExitFocus = () => {
    setVideoViewMode("expanded-grid");
  };

  const handleExitExpanded = () => {
    setVideoViewMode("collapsed");
  };

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


  const shouldShowVideoOverlay = visibleParticipants.length > 0;



  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#0f172a]">
      <BlockedUserDialog />
      <Game
        mapUrl={mapUrl}
        avatarMap={avatarMap}
        localPlayer={localPlayer}
      />

      {/* Modern Video Overlay System */}
      {(shouldShowVideoOverlay || selfSpaceId) && (
        <>
          {/* Collapsed Mode */}
          {videoViewMode === "collapsed" && (
            <CollapsedVideoGrid
              participants={allParticipants}
              onEnterExpandedGrid={handleEnterExpandedGrid}
            />
          )}

          {/* Expanded Grid Mode */}
          {videoViewMode === "expanded-grid" && (
            <ExpandedVideoGrid
              participants={allParticipants}
              onToggleFocus={handleToggleFocus}
              onExitExpanded={handleExitExpanded}
            />
          )}

          {/* Expanded Focus Mode */}
          {videoViewMode === "expanded-focus" && focusedParticipant && (
            <ExpandedFocusView
              participants={allParticipants}
              focusedParticipant={focusedParticipant}
              focusedParticipantId={focusedParticipantId}
              onToggleFocus={handleToggleFocus}
              onExitFocus={handleExitFocus}
              onExitExpanded={handleExitExpanded}
            />
          )}
        </>
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



