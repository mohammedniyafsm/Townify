import { LocalAudioTrack, RemoteAudioTrack } from "livekit-client";
import { useEffect, useRef } from "react";



function AudioComponent({ track }: { track: LocalAudioTrack | RemoteAudioTrack }) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current && track) {
            track.attach(audioRef.current);
        }

        return () => {
            if (track) {
                track.detach();
            }
        };
    }, [track]);

    return <audio ref={audioRef} className="hidden" autoPlay />;
}

export default AudioComponent;
