import { useEffect } from "react";
import ChatPanel from "./ChatPanel";
import { useSpaceChat, useUnreadCounts, setActiveChatSpace, clearUnreadForSpace } from "@/hooks/useSpaceChat";
import { sendRoomChat, sendSpaceChat } from "@/ws/socketHandlers";
import { useSelector } from "react-redux";
import type { RootState } from "@/Redux/stroe";
import { MAIN_SPACE } from "./constants";
import type { SpaceInfo } from "./ChatContainer";

export default function SpaceChatPanel({
  space,
  onBack,
  onClose,
}: {
  space: SpaceInfo;
  onBack: () => void;
  onClose: () => void;
}) {
  const messages = useSpaceChat().filter(m => m.spaceId === space.id);
  const { user } = useSelector((s: RootState) => s.user);
  const { avatars } = useSelector((s: RootState) => s.avatars);
  const unreadCounts = useUnreadCounts();

  useEffect(() => {
    setActiveChatSpace(space.id);
    clearUnreadForSpace(space.id);
    return () => { setActiveChatSpace(null); };
  }, [space.id]);

  if (!user) return null;

  const otherUnreadCount = Object.entries(unreadCounts)
    .filter(([id]) => id !== space.id)
    .reduce((sum, [, n]) => sum + n, 0);

  const send = (text: string) => {
    if (space.id === MAIN_SPACE.id) {
      sendRoomChat(text, user.id, user.name, user.avatarId || "");
    } else {
      sendSpaceChat(text || "");
    }
  };

  return (
    <ChatPanel
      title={space.name}
      messages={messages}
      currentUserId={user.id}
      avatars={avatars}
      onSend={send}
      onBack={onBack}
      onClose={onClose}
      otherUnreadCount={otherUnreadCount > 0 ? otherUnreadCount : undefined}
    />
  );
}
