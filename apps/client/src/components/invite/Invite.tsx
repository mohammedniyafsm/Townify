import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { RainbowButton } from "../ui/rainbow-button";
import { Check, Link } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { inviteUsersToSpace } from "@/api/SpaceApi";
import Navbar from "./Navbar";

function Invite() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const url = `${window.location.origin}`;
    const inviteLink = `${url}/join/${slug}`;

    const [copy, setCopy] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [emails, setEmails] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // ✅ single source of truth
    const canContinue = copy || emails.length > 0;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            toast.success("Invite link copied!");
            setCopy(true);

            setTimeout(() => {
                setCopy(false);
            }, 2000);
        } catch {
            toast.error("Failed to copy invite link");
        }
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "," || e.key === " ") {
            e.preventDefault();

            const email = emailInput.trim().replace(",", "");
            if (!email) return;

            if (!isValidEmail(email)) {
                toast.error("Invalid email address");
                return;
            }

            if (emails.includes(email)) {
                toast.error("Email already added");
                return;
            }

            setEmails(prev => [...prev, email]);
            setEmailInput("");
        }
    };

    const removeEmail = (email: string) => {
        setEmails(prev => prev.filter(e => e !== email));
    };

    const handleInvite = async () => {
        if (!slug) return;

        // ❌ user did nothing
        if (!canContinue) {
            toast.error("Copy invite link or add at least one email");
            return;
        }

        // ✅ copied link only → skip invite API
        if (emails.length === 0 && copy) {
            navigate(`/lobby/${slug}`);
            return;
        }

        // ✅ email invites flow
        try {
            setLoading(true);
            await inviteUsersToSpace(slug, emails, url);
            toast.success("Invitations sent successfully");
            navigate(`/lobby/${slug}`);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to send invitations"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />

            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 lg:gap-10 mt-10 px-4 lg:px-0">
                <div className="font-bricogrotesque text-4xl font-semibold flex flex-col items-center lg:items-start text-center lg:text-left">
                    <h1 className="text-xl lg:text-2xl">Your office has been created.</h1>
                    <h1 className="text-2xl lg:text-4xl mt-1 lg:mt-0">Next, let’s bring in your team</h1>
                    <h1 className="text-sm lg:text-base mt-2 lg:mt-0">
                        Try inviting some teammates to join the space with you.
                    </h1>
                    <img
                        className="h-16 lg:h-20 mt-4 lg:mt-0"
                        src="https://res.cloudinary.com/djbawwbzi/image/upload/v1765445208/Framesdgvsdf_2_axssox.png"
                        alt=""
                    />
                </div>

                <div className="flex flex-col gap-2 w-full max-w-sm lg:w-auto">
                    <div className="border rounded-lg p-2 flex flex-wrap gap-2 bg-background w-full lg:w-96">
                        {emails.map(email => (
                            <div
                                key={email}
                                className="flex items-center gap-2 px-2 py-1 bg-muted rounded-full text-sm"
                            >
                                <span className="text-xs font-bricogrotesque font-bold">
                                    {email}
                                </span>
                                <button
                                    onClick={() => removeEmail(email)}
                                    className="text-xs hover:text-red-500"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <input
                            value={emailInput}
                            onChange={e => setEmailInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ex. email@gmail.com"
                            className="flex-1 outline-none bg-transparent min-w-[150px]"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                        <Button
                            onClick={copyLink}
                            className="font-bricogrotesque w-full sm:w-auto flex-1"
                            variant={"secondary"}
                        >
                            Or copy invite link {copy ? <Check /> : <Link />}
                        </Button>

                        <RainbowButton
                            onClick={handleInvite}
                            disabled={!canContinue || loading}
                            className="font-bricogrotesque w-full sm:w-auto flex-1"
                        >
                            {loading ? (
                                <div className="flex gap-2 justify-center items-center">
                                    <Spinner />
                                    Sending invites…
                                </div>
                            ) : (
                                <span
                                    className={
                                        canContinue
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed text-gray-400"
                                    }
                                >
                                    Next
                                </span>
                            )}
                        </RainbowButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Invite;
