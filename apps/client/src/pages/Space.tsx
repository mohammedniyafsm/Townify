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
  }, [spaceId, user]);

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
        else navigate(`/join/${slug}`);
      }
    };

    loadSpace();
  }, [slug, user, navigate]);

  useEffect(() => {
    if (!user) navigate(`/lobby/${slug}`);
  }, [user, slug, navigate]);


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
    <div className="w-screen h-screen relative overflow-hidden">
      <Game
        mapUrl={mapUrl}
        avatarMap={avatarMap}
        localPlayer={localPlayer}
      />

      <ChatContainer
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
      />
 
      <GameControls
        totalMembers={1} 
        isChatOpen={isChatOpen}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        gameSlug={slug}
      />
    </div>
  );
}
