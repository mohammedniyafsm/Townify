import { MapPin, Users, MessageSquare } from "lucide-react";
import { MAIN_SPACE } from "./constants";
import type { SpaceInfo } from "./ChatContainer";

interface Props {
  onOpenSpace: (space: SpaceInfo) => void;
  activeSpaceId: string;
  currentSubSpace: SpaceInfo | null;
  onClose: () => void;
  unreadCounts: Record<string, number>;
}

export default function DashBoardChat({
  onOpenSpace,
  activeSpaceId,
  currentSubSpace,
  onClose,
  unreadCounts,
}: Props) {

  // Dynamic list: Always Main Space + Current Sub Space (if in one)
  const availableSpaces: SpaceInfo[] = [MAIN_SPACE];
  if (currentSubSpace) {
    availableSpaces.push(currentSubSpace);
  }

  return (
    <div className="absolute right-0 top-2 z-20 h-[97vh]  w-96 bg-zinc-900 text-white flex flex-col rounded-xl shadow-2xl border border-white/10 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-zinc-950">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-zinc-400" />
          <span className="font-bold text-lg">Conversations</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {availableSpaces.map((space) => {
          const isActive = space.id === activeSpaceId;
          const isMain = space.id === MAIN_SPACE.id;

          return (
            <div
              key={space.id}
              onClick={() => onOpenSpace(space)}
              className={`
                group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${isActive ? "bg-white/5 border border-white/15" : "hover:bg-white/5 border border-transparent"}
              `}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-700">
                {isMain ? <MapPin className="h-5 w-5 text-zinc-300" /> : <Users className="h-5 w-5 text-zinc-300" />}
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="font-semibold text-sm group-hover:text-white transition-colors">
                  {space.name}
                </div>
                <div className="text-xs text-gray-400">
                  {isMain ? "Global Room Chat" : "Private Area Chat"}
                </div>
              </div>

              {/* Unread badge */}
              {(unreadCounts[space.id] ?? 0) > 0 && (
                <span className="min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 shrink-0">
                  {unreadCounts[space.id] > 9 ? "9+" : unreadCounts[space.id]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
