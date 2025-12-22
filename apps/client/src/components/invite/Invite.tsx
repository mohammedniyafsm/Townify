import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button"
import { RainbowButton } from "../ui/rainbow-button"
import { Check, Link } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { InviteUsers } from "@/api/SpaceApi";

function Invite() {

    const { slug } = useParams();
    const url = `${window.location.origin}`
    const inviteLink = `${url}/join/${slug}`;
    const [copy, setCopy] = useState<boolean>(false);
    const [emailInput, setEmailInput] = useState("");
    const [emails, setEmails] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const copyLink = async () => {
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 2000)
        await navigator.clipboard.writeText(inviteLink);
        toast.success("Invite link copied!");
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

            setEmails([...emails, email]);
            setEmailInput("");
        }
    };

    const removeEmail = (email: string) => {
        setEmails(emails.filter(e => e !== email));
    };

    const handleInvite = async () => {
        try {

            console.log(emails, 'accscs');
            if (!slug || !emails || !url || emails.length == 0) {
                toast.error("Please add at least one email");
                return;
            }
            setLoading(true);
            await InviteUsers(slug, emails, url);
            setTimeout(() => {
                toast.success("Invitations sent successfully");
                setEmails([]);
                setLoading(false);
                navigate('/lobby');
            }, 2000)
        } catch (error : any) {
            toast.error(
                error?.response?.data?.message || "Failed to send invitations"
            );
        }
    }


    return (
        <div>
            <div className="flex items-center px-20 py-8">
                {/* Logo */}
                <div onClick={()=>navigate('/')} className="flex gap-2 items-center cursor-pointer ">
                    <img
                        src="https://res.cloudinary.com/dnkenioua/image/upload/v1764999707/Group_ik1uap.png"
                        className=" "
                    />
                    <h1 className="font-inter font-semibold text-sm md:text-lg">Townify</h1>
                </div>

            </div>

            <div className="flex justify-center gap-10 mt-10">
                <div className="font-bricogrotesque text-4xl font-semibold">
                    <h1 className="text-2xl">Your office has been created.</h1>
                    <h1>Next, let’s bring in your team</h1>
                    <h1 className="text-base">Try inviting some teammates to join the space with you.</h1>
                    <img className="h-20"
                        src="https://res.cloudinary.com/djbawwbzi/image/upload/v1765445208/Framesdgvsdf_2_axssox.png" alt="" />
                </div>

                <div className="flex flex-col gap-2">

                    <div className="border rounded-lg p-2 flex flex-wrap gap-2 bg-background w-96">
                        {emails.map(email => (
                            <div
                                key={email}
                                className="flex items-center gap-2 px-2 py-1 bg-muted rounded-full text-sm"
                            >
                                <span className="text-xs font-bricogrotesque font-bold">{email}</span>
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

                    <div className="flex gap-2 mt-4">
                        <Button onClick={copyLink} className="font-bricogrotesque" variant={"secondary"}>
                            Or copy invite link {copy ? <Check /> : <Link />}
                        </Button>
                        <RainbowButton onClick={handleInvite} className="font-bricogrotesque">
                            {loading ? <h1 className="flex gap-2"> <Spinner /> Sending invites…</h1> : "Next"}
                        </RainbowButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Invite
