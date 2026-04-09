import type { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

function VideoComponent({
    track,
    participantIdentity,
    local
}: {
    track?: LocalVideoTrack | RemoteVideoTrack;
    participantIdentity: string;
    local?: boolean
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && track) {
            track.attach(videoRef.current);
        }

        return () => {
            if (track) {
                track.detach();
            }
        };
    }, [track]);

    const initials = participantIdentity
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800">
            {track ? (
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted={local}
                    autoPlay
                />
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-full p-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-3">
                        <span className="text-xl font-bold text-white">
                            {initials}
                        </span>
                    </div>
                    <span className="text-gray-300 font-medium text-sm text-center truncate max-w-full">
                        {participantIdentity}
                    </span>
                    {local && (
                        <Badge variant="outline" className="mt-1 text-xs border-gray-600 text-gray-400">
                            You
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}

export default VideoComponent;