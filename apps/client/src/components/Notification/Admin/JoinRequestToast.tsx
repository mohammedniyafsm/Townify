import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { approveRequestAccess } from "@/api/SpaceApi";

type JoinRequest = {
    userName: string;
    email: string;
    inviteId: string;
    slug: string;
};

const AUTO_DISMISS_MS = 12_000;

export default function JoinRequestToast() {
    const location = useLocation();
    const currentSlug = location.pathname.split("/").pop();


    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    useEffect(() => {
        const handler = (e: any) => {
            console.log("JOIN REQUEST EVENT:", e.detail);

            // ✅ Support BOTH payload formats:
            // event.detail.payload OR event.detail directly
            const payload = e.detail?.payload ?? e.detail;

            if (!payload) {
                console.warn("JOIN REQUEST IGNORED — NO PAYLOAD");
                return;
            }

            console.log("CURRENT SPACE SLUG:", currentSlug);
            console.log("REQUEST SPACE SLUG:", payload.slug);

            // ✅ If inside a space → block other space requests
            if (currentSlug && payload.slug !== currentSlug) {
                console.warn("BLOCKED — WRONG SPACE REQUEST");
                return;
            }

            const req: JoinRequest = {
                userName: payload.userName,
                email: payload.email,
                inviteId: payload.inviteId,
                slug: payload.slug,
            };

            // ✅ Prevent duplicate notifications
            setRequests(prev =>
                prev.some(r => r.inviteId === req.inviteId)
                    ? prev
                    : [...prev, req]
            );

            // ✅ Auto dismiss timer
            timers.current[req.inviteId] = setTimeout(() => {
                remove(req.inviteId);
            }, AUTO_DISMISS_MS);
        };

        window.addEventListener("JOIN_REQUEST_RECEIVED", handler);

        return () => {
            window.removeEventListener("JOIN_REQUEST_RECEIVED", handler);
            Object.values(timers.current).forEach(clearTimeout);
        };
    }, [currentSlug]);

    // ✅ Clear notifications when switching spaces
    useEffect(() => {
        setRequests([]);
        Object.values(timers.current).forEach(clearTimeout);
        timers.current = {};
    }, [currentSlug]);

    const remove = (inviteId: string) => {
        const timer = timers.current[inviteId];
        if (timer) clearTimeout(timer);

        delete timers.current[inviteId];

        setRequests(prev => prev.filter(r => r.inviteId !== inviteId));
    };

    const handleAccept = async (inviteId: string) => {
        try {
            setLoadingId(inviteId);
            await approveRequestAccess(inviteId);
            remove(inviteId);
        } catch (err) {
            console.error("Approve failed", err);
            setLoadingId(null);
        }
    };

    if (requests.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            {requests.map(req => (
                <div
                    key={req.inviteId}
                    className={cn(
                        "relative w-[320px]",
                        "rounded-lg bg-neutral-900/90 text-white",
                        "backdrop-blur-md",
                        "shadow-[0_6px_24px_rgba(0,0,0,0.35)]",
                        "animate-in fade-in slide-in-from-top-1"
                    )}
                    onMouseEnter={() => {
                        const timer = timers.current[req.inviteId];
                        if (timer) clearTimeout(timer);
                    }}
                    onMouseLeave={() => {
                        timers.current[req.inviteId] = setTimeout(
                            () => remove(req.inviteId),
                            AUTO_DISMISS_MS
                        );
                    }}
                >
                    {/* progress bar */}
                    <div className="absolute left-0 top-0 h-[2px] w-full overflow-hidden rounded-t-lg">
                        <div className="h-full bg-emerald-400/70 animate-[shrink_12s_linear]" />
                    </div>

                    <div className="flex items-start gap-3 px-4 py-3">
                        {/* avatar */}
                        <div className="relative mt-0.5">
                            <div className="h-8 w-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-semibold">
                                {req.userName.charAt(0).toUpperCase()}
                            </div>
                            <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-neutral-900" />
                        </div>

                        {/* content */}
                        <div className="flex-1 space-y-1">
                            <p className="text-sm leading-snug">
                                <span className="font-semibold">{req.userName}</span>{" "}
                                <span className="text-neutral-400">
                                    wants to join your space
                                </span>
                            </p>

                            <p className="text-xs text-neutral-500 truncate">
                                {req.email}
                            </p>

                            {/* actions */}
                            <div className="mt-2 flex gap-4">
                                <button
                                    className="text-xs text-neutral-400 hover:text-red-400 transition"
                                    onClick={() => remove(req.inviteId)}
                                    disabled={loadingId === req.inviteId}
                                >
                                    Decline
                                </button>

                                <button
                                    className={cn(
                                        "text-xs transition",
                                        loadingId === req.inviteId
                                            ? "text-neutral-500 cursor-not-allowed"
                                            : "text-emerald-400 hover:text-emerald-300"
                                    )}
                                    onClick={() => handleAccept(req.inviteId)}
                                    disabled={loadingId === req.inviteId}
                                >
                                    {loadingId === req.inviteId ? "Allowing…" : "Allow"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
