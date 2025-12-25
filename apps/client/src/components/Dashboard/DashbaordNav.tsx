import { useSelector } from "react-redux";
import { Button } from "../ui/button"
import { RainbowButton } from "../ui/rainbow-button"
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/Redux/stroe";
import type { UserSchema } from "@repo/types";
import type React from "react";

interface DashboardNavProps {
    setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
    setJoinRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

function DashbaordNav({ setCreateRoom, setJoinRoom }: DashboardNavProps) {

    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.user) as { user: UserSchema };

    return (
        <div className="fixed top-0 z-100 w-screen bg-white ">
            <div className="flex justify-between px-6 md:px-16 lg:px-24 py-6 items-center bg-background">

                {/* Logo + Nav */}
                <div className="flex items-center gap-10 lg:gap-20">
                    {/* Logo */}
                    <div onClick={()=>navigate('/')} className="flex gap-2 items-center cursor-pointer ">
                        <img
                            src="https://res.cloudinary.com/dnkenioua/image/upload/v1764999707/Group_ik1uap.png"
                            className=" "
                        />
                        <h1 className="font-inter font-semibold text-sm md:text-lg">Townify</h1>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex gap-6 lg:gap-8 font-inter text-[#52525C] ">
                        <h1 onClick={() => navigate('/')} className="cursor-pointer hover:text-foreground hover:underline">My Space</h1>
                    </div>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex gap-4 items-center">
                    <div className="flex items-center gap-4 hover:bg-[#f2f7fc] px-6 py-2 rounded-2xl">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary text-white font-semibold uppercase">
                            {user?.profile ? (
                                <img
                                    src={user.profile}
                                    alt={user.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <span>{user?.name?.charAt(0) ?? "U"}</span>
                            )}
                        </div>

                        <h1 className="font-inter font-semibold">{user?.name}</h1>
                    </div>
                    <Button onClick={() => setJoinRoom(true)} variant="outline">Join Space</Button>
                    <RainbowButton onClick={() => setCreateRoom(true)}>Create Space</RainbowButton>
                </div>

            </div>


        </div>
    )
}

export default DashbaordNav
