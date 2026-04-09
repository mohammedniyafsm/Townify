import VideoTile from "./VideoTile";
import { ScrollArea } from "../ui/scroll-area";

interface CollapsedVideoGridProps {
    participants: any[];
    onEnterExpandedGrid: () => void;
}

function CollapsedVideoGrid({ participants, onEnterExpandedGrid }: CollapsedVideoGridProps) {
    // Determine grid columns based on screen size (handled via Tailwind classes)
    // Mobile: 1-2, Tablet: 3-4, Desktop: 5 rigid columns

    // We keep the pointer-events-none on the container so clicks pass through to the 3D world,
    // but re-enable them on the grid itself.
    // const allParticipants = [...participants, ...participants, ...participants, ...participants, ...participants, ...participants, ...participants, ...participants, ...participants]

    return (
        <div className="absolute top-3 bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center justify-start w-full max-w-[95vw] xl:max-w-screen-xl">
            {/* 
                Container for the grid. 
                - Max height ensures we don't cover the bottom bar.
                - Centered horizontally.
            */}
            <div className="pointer-events-auto w-full max-h-full flex justify-center">
                <ScrollArea className="w-full rounded-md" type="hover">
                    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 auto-rows-fr justify-items-center">
                        {participants.map((participant) => (
                            <div key={participant.id} className="w-full aspect-video">
                                <VideoTile
                                    participant={participant}
                                    mode="collapsed"
                                    onEnterExpandedGrid={onEnterExpandedGrid}
                                />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

export default CollapsedVideoGrid;