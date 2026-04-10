import { useState, useMemo } from "react";
import { Mic, MicOff, Video, VideoOff, MessageSquare, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLiveKit } from "@/contexts/LiveKitContext";
import MembersModal from "./Modal";
import { useSelector } from "react-redux";
import type { RootState } from "@/Redux/stroe";
import { useUnreadCounts } from "@/hooks/useSpaceChat";

interface GameControlsProps {
    totalMembers: number;
    isChatOpen: boolean;
    onToggleChat: () => void;
    gameSlug?: string;
}

export default function GameControls({
    totalMembers,
    isChatOpen,
    onToggleChat,
}: GameControlsProps) {
    const navigate = useNavigate();
    const { isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo, disconnect } = useLiveKit();
    const manageSpace = useSelector((state: RootState) => state.manageSpace);
    const unreadCounts = useUnreadCounts();

    const totalUnread = useMemo(
        () => Object.values(unreadCounts).reduce((a, b) => a + b, 0),
        [unreadCounts]
    );

    const pendingInviteCount = useMemo(() => {
        return manageSpace.spaces?.invites?.filter(
            (i) => i.status === "pending" && i.type === "link"
        ).length ?? 0;
    }, [manageSpace.spaces?.invites]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLeave = () => {
        disconnect();
        navigate("/app");
    };

    return (
        <>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/95 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-700 shadow-2xl z-[200]">

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="
                        flex items-center gap-2 pr-4 border-r border-gray-700 
                        text-gray-300 hover:text-white hover:bg-gray-800/50 
                        rounded-lg px-3 py-2 transition-all duration-200
                        active:scale-95
                    "
                    title="View members and invitations"
                    aria-label={`View ${totalMembers} members and invitations`}
                >
                    <div className="relative">
                        <Users className="w-5 h-5" />
                        {pendingInviteCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                                {pendingInviteCount > 9 ? "9+" : pendingInviteCount}
                            </span>
                        )}
                    </div>
                    <span className="font-semibold">{totalMembers}</span>
                </button>

                {/* Mic Button */}
                <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-xl transition-all ${isAudioEnabled
                        ? "bg-gray-800/80 hover:bg-gray-700/80 text-white"
                        : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                        }`}
                    title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
                    aria-label={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
                >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                {/* Camera Button */}
                <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-xl transition-all ${isVideoEnabled
                        ? "bg-gray-800/80 hover:bg-gray-700/80 text-white"
                        : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                        }`}
                    title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                    aria-label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                {/* Chat Toggle Button */}
                <button
                    onClick={onToggleChat}
                    className={`p-3 rounded-xl transition-all relative ${isChatOpen
                        ? "bg-white/20 ring-1 ring-white/30 text-white"
                        : "bg-gray-800/80 hover:bg-gray-700/80 text-white"
                        }`}
                    title={isChatOpen ? "Close chat" : "Open chat"}
                    aria-label={isChatOpen ? "Close chat" : "Open chat"}
                >
                    <div className="relative">
                        <MessageSquare className="w-5 h-5" />
                        { totalUnread > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                                {totalUnread > 9 ? "9+" : totalUnread}
                            </span>
                        )}
                    </div>
                </button>

                {/* Leave Button */}
                <div className="pl-4 border-l border-gray-700">
                    <button
                        onClick={handleLeave}
                        className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
                        title="Leave space"
                        aria-label="Leave space"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

            </div>

            {/* Members Modal */}
            <MembersModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                totalMembers={totalMembers}
            />
        </>
    );
}