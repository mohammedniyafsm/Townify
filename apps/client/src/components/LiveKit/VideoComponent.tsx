import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface VideoComponentProps {
    track?: LocalVideoTrack | RemoteVideoTrack;
    participantIdentity: string;
    local?: boolean;
}

function VideoComponent({ track, participantIdentity, local }: VideoComponentProps) {
    const videoElement = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoElement.current && track) {
            track.attach(videoElement.current);
        }

        return () => {
            track?.detach();
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
                    ref={videoElement}
                    id={track.sid}
                    className="w-full h-full object-cover"
                    playsInline
                    muted={local}
                />
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-full p-6">
                    <div className="relative mb-4">
                        <Avatar className="w-20 h-20 border-4 border-gray-700">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participantIdentity}`} />
                            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-blue-600">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        {!track && (
                            <div className="absolute -bottom-1 -right-1 bg-gray-800 rounded-full p-1.5 border-2 border-gray-900">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <span className="text-gray-300 font-medium text-center px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm">
                        {participantIdentity}
                    </span>
                    {local && (
                        <Badge variant="outline" className="mt-2 text-xs border-gray-600 text-gray-400">
                            You
                        </Badge>
                    )}
                </div>
            )}

            {/* Subtle shimmer effect on placeholder */}
            {!track && (
                <div className="absolute inset-0 opacity-5">
                    <div className="animate-shimmer bg-gradient-to-r from-transparent via-gray-400 to-transparent bg-[length:200%_100%] w-full h-full"></div>
                </div>
            )}
        </div>
    );
}

export default VideoComponent;