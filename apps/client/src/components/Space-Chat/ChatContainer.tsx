import { useEffect, useRef, useState } from "react";
import DashBoardChat from "./DashBoardChat";
import SpaceChatPanel from "./SpaceChatPanel";
import { MAIN_SPACE } from "./constants";
import { subscribeToSpace } from "@/game/scenes/sceneRegistry";
import { useUnreadCounts, clearUnreadForSpace } from "@/hooks/useSpaceChat";

export type SpaceInfo = { id: string; name: string };
type ChatView = "dashboard" | "space";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function ChatContainer({ isOpen, onOpen, onClose }: Props) {
  const [view, setView] = useState<ChatView>("space");
  const [activeSpace, setActiveSpace] = useState<SpaceInfo>(MAIN_SPACE);
  const [currentSubSpace, setCurrentSubSpace] = useState<SpaceInfo | null>(null);
  const prevSpaceIdRef = useRef<string | null>(null);
  const unreadCounts = useUnreadCounts();

  useEffect(() => {
    return subscribeToSpace(space => {
      setCurrentSubSpace(space);

      if (space) {
        const isNewSpace = space.id !== prevSpaceIdRef.current;
        prevSpaceIdRef.current = space.id;
        setActiveSpace(space);
        if (isNewSpace) {                          
          setView("space");
        }
        onOpen();
      } else {
        if (prevSpaceIdRef.current) clearUnreadForSpace(prevSpaceIdRef.current);
        prevSpaceIdRef.current = null;
        setActiveSpace(MAIN_SPACE);
        setView("space");
        onClose();
      }
    });
  }, []);

  if (!isOpen) return null;

  if (view === "dashboard") {
    return (
      <DashBoardChat
        activeSpaceId={activeSpace.id}
        currentSubSpace={currentSubSpace}
        unreadCounts={unreadCounts}
        onOpenSpace={space => {
          setActiveSpace(space);
          setView("space");
        }}
        onClose={onClose}
      />
    );
  }

  return (
    <SpaceChatPanel
      space={activeSpace}
      onBack={() => setView("dashboard")}
      onClose={onClose}
    />
  );
}
