import { Mic, MicOff, Video, VideoOff, MessageSquare, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLiveKit } from "@/contexts/LiveKitContext";

interface Props {
    totalMembers: number;
    isChatOpen: boolean;
    onToggleChat: () => void;
    gameSlug?: string;
}

export default function GameControls({
    totalMembers,
    isChatOpen,
    onToggleChat,
}: Props) {
    const navigate = useNavigate();
    const { isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo, disconnect } = useLiveKit();

    const handleLeave = () => {
        disconnect();
        navigate("/app");
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#202540]/90 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10 shadow-2xl z-50">

            {/* Member Count */}
            <div className="flex items-center gap-2 pr-4 border-r border-white/10 text-gray-300">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{totalMembers}</span>
            </div>

            {/* Mic */}
            <button
                onClick={toggleAudio}
                className={`p-3 rounded-xl transition-all ${isAudioEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                    }`}
            >
                {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Camera */}
            <button
                onClick={toggleVideo}
                className={`p-3 rounded-xl transition-all ${isVideoEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                    }`}
            >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Chat Toggle */}
            <button
                onClick={onToggleChat}
                className={`p-3 rounded-xl transition-all relative ${isChatOpen ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
            >
                <MessageSquare className="w-5 h-5" />
            </button>

            {/* Leave */}
            <div className="pl-4 border-l border-white/10">
                <button
                    onClick={handleLeave}
                    className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg shadow-red-500/20"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

        </div>
    );
}

