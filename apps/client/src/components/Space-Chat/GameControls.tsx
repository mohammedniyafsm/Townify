import { useState } from "react";
import { Mic, MicOff, Video, VideoOff, MessageSquare, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLiveKit } from "@/contexts/LiveKitContext";
import MembersModal from "./Modal"; // Adjust the import path as needed

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

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLeave = () => {
        disconnect();
        navigate("/app");
    };

    return (
        <>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/95 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-700 shadow-2xl z-[200]">

                {/* Member Count - Clickable trigger */}
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
                    <Users className="w-5 h-5" />
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
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-gray-800/80 hover:bg-gray-700/80 text-white"
                        }`}
                    title={isChatOpen ? "Close chat" : "Open chat"}
                    aria-label={isChatOpen ? "Close chat" : "Open chat"}
                >
                    <MessageSquare className="w-5 h-5" />
                </button>

                {/* Leave Button */}
                <div className="pl-4 border-l border-gray-700">
                    <button
                        onClick={handleLeave}
                        className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg shadow-red-500/20"
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