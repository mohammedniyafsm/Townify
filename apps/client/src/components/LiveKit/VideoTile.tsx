import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Maximize2 } from "lucide-react";
import VideoComponent from "./VideoComponent";
import AudioComponent from "./AudioComponent";
import { Badge } from "../ui/badge";


interface VideoTileProps {
    participant: any;
    mode: 'collapsed' | 'expanded-grid' | 'expanded-focus' | 'expanded-focus-side' | 'expanded-focus-bottom';
    isFocused?: boolean;
    onEnterExpandedGrid?: () => void;
}
function VideoTile({ participant, mode, isFocused = false, onEnterExpandedGrid }: VideoTileProps) {
    // Size classes based on mode
    const getSizeClass = () => {
        switch (mode) {
            case 'collapsed':
                return 'w-full h-full';
            case 'expanded-grid':
                return 'w-full';
            case 'expanded-focus':
                return 'w-full h-full';
            case 'expanded-focus-side':
                return 'w-full aspect-video';
            case 'expanded-focus-bottom':
                return 'w-[160px] sm:w-[180px] md:w-[200px] aspect-video';
        }
    };

    const getCardClasses = () => {
        const base = "bg-gray-900/80 backdrop-blur-sm overflow-hidden transition-all duration-300";
        const size = getSizeClass();
        const border = isFocused
            ? "border-2 border-purple-500/50 shadow-lg shadow-purple-500/10"
            : "border border-gray-700/30 hover:border-gray-500/50";
        const hover = mode === 'collapsed' ? "hover:scale-[1.02] hover:shadow-xl" : "";

        return `${size} ${base} ${border} ${hover} p-0`;
    };

    return (
        <Card className={getCardClasses()}>
            <CardContent className="p-0 relative h-full">
                {/* Expand Button Overlay (only in collapsed mode) */}
                {mode === 'collapsed' && onEnterExpandedGrid && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                        onClick={onEnterExpandedGrid}>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm shadow-lg"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Video Content */}
                <div className="relative w-full h-full">
                    {mode === 'expanded-focus' ? (
                        <div className="absolute inset-0">
                            <VideoComponent
                                track={participant.videoTrack}
                                participantIdentity={participant.name}
                                local={participant.isLocal}
                            />
                            {participant.audioTrack && <AudioComponent track={participant.audioTrack} />}
                        </div>
                    ) : (
                        <div className="relative aspect-video">
                            <VideoComponent
                                track={participant.videoTrack}
                                participantIdentity={participant.name}
                                local={participant.isLocal}
                            />
                            {participant.audioTrack && <AudioComponent track={participant.audioTrack} />}
                        </div>
                    )}
                </div>

            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`font-medium text-white truncate ${mode === 'collapsed' ? 'text-sm' :
                            mode === 'expanded-focus-bottom' ? 'text-xs' : 'text-base'
                            }`}>
                            {participant.name}
                        </span>
                        {participant.isLocal && (
                            <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                                You
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {participant.videoTrack && (
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Video active" />
                        )}
                        {participant.audioTrack && (
                            <div className="w-2 h-2 rounded-full bg-green-500" title="Audio active" />
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default VideoTile;