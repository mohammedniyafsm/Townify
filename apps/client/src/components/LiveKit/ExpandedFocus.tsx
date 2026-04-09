import { Focus, Grid3x3, Minimize2 } from "lucide-react";
import { Button } from "../ui/button";
import VideoTile from "./VideoTile";
import { ScrollArea } from "../ui/scroll-area";

interface ExpandedFocusViewProps {
    participants: any[];
    focusedParticipant: any;
    focusedParticipantId: string;
    onToggleFocus: (participantId: string) => void;
    onExitFocus: () => void;
    onExitExpanded: () => void;
}

function ExpandedFocusView({
    participants,
    focusedParticipant,
    focusedParticipantId,
    onToggleFocus,
    onExitFocus,
    onExitExpanded
}: ExpandedFocusViewProps) {
    const unfocusedParticipants = participants.filter(p => p.id !== focusedParticipantId);

    return (
        <div className="fixed inset-0 z-40 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-purple-500/5" />

            {/* Header Controls - Modern floating */}
            <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onExitFocus}
                    className="group bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white/90 hover:text-white transition-all duration-300 rounded-xl px-4 py-6 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
                    title="Return to grid (Esc)"
                >
                    <Grid3x3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Grid View
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={onExitExpanded}
                    className="group bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 transition-all duration-300 rounded-xl w-12 h-12 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/10"
                    title="Collapse (Esc)"
                >
                    <Minimize2 className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                </Button>
            </div>

            {/* Content Layout */}
            <div className="h-full pt-20 pb-6 px-6 lg:px-8">
                <div className="h-full flex flex-col lg:flex-row gap-6">
                    {/* Main Focused Video */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        <div className="relative group/focused flex-1 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-950/80 border-2 border-white/10 shadow-2xl shadow-blue-500/10 hover:border-white/20 transition-all duration-500">
                            <VideoTile
                                participant={focusedParticipant}
                                mode="expanded-focus"
                                isFocused={true}
                            />
                        </div>
                    </div>

                    {/* Sidebar / Bottom Stack for Unfocused Participants */}
                    {unfocusedParticipants.length > 0 && (
                        <div className="lg:w-80 xl:w-96 flex flex-col lg:h-full h-[200px] shrink-0 min-h-0">

                            <ScrollArea className="flex-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
                                <div className="p-4 flex flex-col gap-3">
                                    {unfocusedParticipants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="group/side relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shrink-0 aspect-video lg:aspect-video"
                                        >
                                            <VideoTile
                                                participant={participant}
                                                mode="expanded-focus-side"
                                            />

                                            {/* Overlay Controls */}
                                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/side:opacity-100 transition-opacity duration-300 flex items-center justify-end">

                                                <Button
                                                    size="icon"
                                                    onClick={() => onToggleFocus(participant.id)}
                                                    className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 text-white border cursor-pointer border-white/10 backdrop-blur-md transition-all hover:scale-105"
                                                    title="Focus View"
                                                >
                                                    <Focus className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExpandedFocusView;