import { Focus, X } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import VideoTile from "./VideoTile";

interface ExpandedVideoGridProps {
    participants: any[];
    onToggleFocus: (participantId: string) => void;
    onExitExpanded: () => void;
}

function ExpandedVideoGrid({ participants, onToggleFocus, onExitExpanded }: ExpandedVideoGridProps) {
    const totalParticipants = participants.length;


    // Calculate grid layout based on participant count
    const getGridLayout = () => {
        if (totalParticipants <= 2) return { cols: 2, rows: 1, scrollable: false };
        if (totalParticipants <= 4) return { cols: 2, rows: 2, scrollable: false };
        if (totalParticipants <= 6) return { cols: 3, rows: 2, scrollable: false };
        if (totalParticipants <= 8) return { cols: 4, rows: 2, scrollable: false };
        return { cols: 4, rows: 2, scrollable: true };
    };

    const gridLayout = getGridLayout();
    return (
        <div className="fixed inset-0 z-40 bg-gradient-to-br from-gray-900 to-black">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

            {/* Header Controls - Modern floating glassmorphism */}
            <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={onExitExpanded}
                    className="group bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:scale-105 hover:border-white/30"
                    title="Collapse (Esc)"
                >
                    <X className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                </Button>
            </div>

            {/* Main Content */}
            <div className="h-full pt-20 pb-8 px-6">
                <ScrollArea className={`h-full ${gridLayout.scrollable ? 'pr-4' : ''}`}>
                    <div
                        className={`grid gap-6 ${gridLayout.scrollable ? 'pb-4' : ''}`}
                        style={{
                            gridTemplateColumns: `repeat(${gridLayout.cols}, minmax(0, 1fr))`,
                            gridTemplateRows: `repeat(${gridLayout.rows}, minmax(0, 1fr))`,
                            minHeight: gridLayout.rows === 1 ? '60vh' : '100vh'
                        }}
                    >
                        {participants.map((participant) => (
                            <div
                                key={participant.id}
                                className="relative group/video-tile rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover/video-tile:opacity-100 transition-opacity duration-500" />

                                <VideoTile
                                    participant={participant}
                                    mode="expanded-grid"
                                />

                                {/* Modern Focus Button Overlay */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover/video-tile:opacity-100 transition-all duration-300 translate-y-2 group-hover/video-tile:translate-y-0 z-10">
                                    <Button
                                        size="icon"
                                        onClick={() => onToggleFocus(participant.id)}
                                        className="relative bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 backdrop-blur-lg border border-white/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 w-10 h-10 group/btn hover:scale-110"
                                        title="Focus on this participant"
                                    >
                                        <Focus className="w-4.5 h-4.5 text-white transition-transform group-hover/btn:scale-110" />

                                        {/* Button glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

                                        {/* Animated ring effect */}
                                        <div className="absolute inset-0 rounded-full border-2 border-white/0 group-hover/btn:border-white/30 transition-all duration-500" />
                                    </Button>
                                </div>

                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Floating info bar */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-6 py-3">
                <div className="flex items-center gap-4">
                    <span className="text-white/90 text-sm font-medium">
                        {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}
                    </span>
                    <div className="w-1 h-1 bg-white/30 rounded-full" />
                    <span className="text-white/70 text-sm">
                        Click <Focus className="w-3 h-3 inline mx-1" /> to focus on a participant
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ExpandedVideoGrid;

