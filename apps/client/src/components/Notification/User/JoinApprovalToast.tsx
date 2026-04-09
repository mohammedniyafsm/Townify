import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ApprovalPayload = {
  spaceSlug: string;
  spaceName?: string;
};

const AUTO_DISMISS_MS = 10000;

export default function JoinApprovalToast() {
  const [data, setData] = useState<ApprovalPayload | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const approvedHandler = (e: any) => {
      const payload = e.detail;

      // ✅ DO NOT show toast if already inside a space
      if (location.pathname.startsWith("/space/")) {
        console.log("Skipping approval toast — user already inside space");
        return;
      }

      setData(payload);

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = window.setTimeout(() => {
        setData(null);
      }, AUTO_DISMISS_MS);
    };

    const declinedHandler = () => {
      setData(null);
      toast.error("❌ Your join request was declined", {
        position: "top-right",
        className: "bg-red-500 text-white"
      });
    };

    window.addEventListener("JOIN_APPROVED", approvedHandler);
    window.addEventListener("JOIN_DECLINED", declinedHandler);

    return () => {
      window.removeEventListener("JOIN_APPROVED", approvedHandler);
      window.removeEventListener("JOIN_DECLINED", declinedHandler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]); // 👈 react to route change

  if (!data) return null;

  const close = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setData(null);
  };

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50",
      "w-[320px] rounded-lg",
      "bg-neutral-900/90 text-white",
      "backdrop-blur-md",
      "shadow-[0_6px_24px_rgba(0,0,0,0.35)]",
      "animate-in fade-in slide-in-from-top-1"
    )}>
      {/* progress bar */}
      <div className="absolute left-0 top-0 h-[2px] w-full overflow-hidden rounded-t-lg">
        <div className="h-full bg-emerald-400/70 animate-[shrink_10s_linear]" />
      </div>

      <div className="p-4 space-y-2">
        <p className="text-sm font-bricogrotesque font-semibold">
          Request approved ✅
        </p>

        <p className="text-xs text-neutral-400 font-bricogrotesque">
          You can now join{" "}
          <span className="text-white">
            {data.spaceName ?? "the space"}
          </span>
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            className="text-xs text-neutral-400 hover:text-white transition"
            onClick={close}
          >
            Later
          </button>

          <button
            className="text-xs text-emerald-400 hover:text-emerald-300 transition"
            onClick={() => {
              close();
              navigate(`/lobby/${data.spaceSlug}`);
            }}
          >
            Join now
          </button>
        </div>
      </div>
    </div>
  );
}
