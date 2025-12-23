import { useState } from "react";
import { useSelector } from "react-redux";
import { Check, X } from "lucide-react";

import { Button } from "../ui/button";
import { BorderBeam } from "../ui/border-beam";

import type { RootState } from "@/Redux/stroe";
import type { AllAvatarsModalI } from "@/types/type";

function AllAvatarsModal({
    currentAvatar,
    setCurrentAvatars,
    avatars,
    openModal,
    setModal,
}: AllAvatarsModalI) {
    
    const { user } = useSelector((state: RootState) => state.user);
    const [tempCurrent, settempCurrent] = useState(currentAvatar);

    const handleSubmit = () => {
        setCurrentAvatars(tempCurrent);
        setModal(false);
    };

    const handleCancel = () => {
        settempCurrent(currentAvatar);
        setModal(false)
    }

    if (!openModal) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={() => setModal(false)}
                className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-[0_16px_50px_rgba(0,0,0,0.22)] p-6">
                    {/* Close */}
                    <button
                        onClick={() => setModal(false)}
                        className="absolute right-4 top-4 rounded-full p-2 hover:bg-black/5 transition"
                    >
                        <X size={16} />
                    </button>

                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bricogrotesque font-semibold">
                            Choose your avatar
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            This avatar represents you in Bridgeon
                        </p>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                        {/* Selected Avatar */}
                        <div className="flex flex-col items-center">
                            <span className="text-[11px] text-gray-400 mb-2 uppercase">
                                Selected
                            </span>

                            <div className="relative rounded-2xl bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 p-6 shadow-lg">
                                <img
                                    src={tempCurrent?.idle}
                                    alt="Current avatar"
                                    className="h-28 w-28 object-contain"
                                />
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-indigo-400/30" />
                            </div>

                            <p className="mt-3 text-xs text-gray-600">
                                Logged in as <span className="font-medium">{user?.name}</span>
                            </p>
                        </div>

                        {/* Avatar Grid */}
                        <div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[300px] overflow-y-hidden">
                                {avatars.map((avatar) => {
                                    const active = avatar.id === tempCurrent?.id;

                                    return (
                                        <button
                                            key={avatar.id}
                                            onClick={() => settempCurrent(avatar)}
                                            className={`relative rounded-xl p-3 transition-all duration-200 flex items-center justify-center
                        ${active
                                                    ? "bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg scale-[1.06]"
                                                    : "bg-gray-100 hover:bg-gray-200 hover:scale-105"
                                                }`}
                                        >
                                            <img
                                                src={avatar.idle}
                                                alt="avatar"
                                                className="h-14 w-14 object-contain"
                                            />

                                            {active && (
                                                <span className="absolute top-1.5 right-1.5 bg-white rounded-full p-1 shadow">
                                                    <Check size={12} className="text-indigo-600" />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-8">
                        <span className="text-[11px] text-gray-400">
                            You can change this anytime
                        </span>

                        <div className="flex gap-2">
                            <Button
                                size="lg"
                                variant="outline"
                                className="px-4"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>

                            <Button
                                size="lg"
                                className="rounded-lg px-6"
                                onClick={handleSubmit}
                            >
                                Save Avatar
                            </Button>
                        </div>
                    </div>

                    <BorderBeam />
                </div>
            </div>
        </>
    );
}

export default AllAvatarsModal;
