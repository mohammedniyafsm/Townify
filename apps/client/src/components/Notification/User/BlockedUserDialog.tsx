import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { ShieldX } from "lucide-react";
import { useLiveKit } from "@/contexts/LiveKitContext";

export function BlockedUserDialog() {
    const [open, setOpen] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const navigate = useNavigate();
    const { disconnect } = useLiveKit()

    useEffect(() => {
        const handleUserBlocked = (e: Event) => {
            const customEvent = e as CustomEvent;
            console.log("[BLOCKING-DIALOG] USER_BLOCKED event received:", customEvent.detail);

            setOpen(true);
            setCountdown(3);
        };

        window.addEventListener("USER_BLOCKED", handleUserBlocked);
        return () => window.removeEventListener("USER_BLOCKED", handleUserBlocked);
    }, []);

    useEffect(() => {
        if (!open) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleRedirect();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [open]);

    const handleRedirect = async () => {
        setOpen(false);
        await disconnect()
        navigate("/app");
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent style={{ width: "25rem" }} className="p-0 overflow-hidden">
                {/* Main content container */}
                <div className="flex flex-col items-center justify-center p-4 text-center space-y-6">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                        <ShieldX className="h-6 w-6 text-red-600" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">
                            Access Blocked
                        </h2>
                        <p className="text-sm text-gray-600">
                            You no longer have access to this space.
                        </p>
                    </div>

                    {/* Button container */}
                    <div className="w-full space-y-2">
                        <AlertDialogAction
                            onClick={handleRedirect}
                            className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
                        >
                            OK
                        </AlertDialogAction>

                        <p className="text-xs text-gray-500 text-center">
                            Redirecting in {countdown}s
                        </p>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}