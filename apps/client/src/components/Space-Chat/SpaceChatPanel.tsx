import ChatPanel from "./ChatPanel";
import { useSpaceChat } from "@/hooks/useSpaceChat";
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

  if (!user) return null;

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
    />
  );
}
