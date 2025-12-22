import { MicOff, VideoOff } from "lucide-react"
import { Input } from "../ui/input"
import { RainbowButton } from "../ui/rainbow-button"

function LobbyContent() {
    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <div className="font-bricogrotesque text-5xl font-semibold mt-8">
                    Welcome to Bridgeon
                </div>

                <div className="flex justify-center items-center gap-20 mt-20">

                    <div className="">
                        <div className="">
                            <div
                                className="flex flex-col justify-center items-center text-xs bg-black h-56 w-80 font-inter rounded-2xl">
                                <h1 className="text-white">You are Muted</h1>
                                <h1 className="text-white">Your Camera is off</h1>
                            </div>

                        </div>
                        <div className="flex justify-center items-center gap-2 mt-2">

                            {/* Mic Off Button */}
                            <button className="bg-red-400 p-2 rounded-2xl text-white flex items-center justify-center gap-2 px-4">
                                <MicOff size={18} />
                                <div className="w-[1px] h-6 bg-gray-400"></div>
                                <button className="  rounded-2xl -rotate-90 text-white flex items-center justify-center ">
                                    &gt;
                                </button>
                            </button>

                            {/* Video Off Button */}
                            <button className="bg-red-400 p-2 rounded-2xl text-white flex items-center justify-center gap-2 px-4">
                                <VideoOff size={18} />
                                <div className="w-[1px] h-6 bg-gray-400"></div>
                                <button className="  rounded-2xl -rotate-90 text-white flex items-center justify-center ">
                                    &gt;
                                </button>
                            </button>

                        </div>
                    </div>


                    <div className="">
                        <div className="flex items-center">
                            <div className="flex flex-col justify-center items-center">
                                <img className="h-16 w-28" src="https://res.cloudinary.com/djbawwbzi/image/upload/v1765449136/Rose_1wave_dvopbz.png" alt="" />
                                <h1 className="text-base font-bricogrotesque cursor-pointer">Edit</h1>
                            </div>
                            <Input className="bg-white" placeholder="Enter Your username" />
                        </div>
                        <div className="pl-4">
                            <RainbowButton className="font-bricogrotesque w-80 h-10 mt-4 text-base">Join</RainbowButton>
                        </div>
                    </div>

                </div>

                <div className="mt-36">
                    <h1 className="text-center text-xs"> By joining this space, you agree to our Terms of Service  and Privacy <br />
                         Policy, and confirm that you're over 18 years of age.
                    </h1>
                </div>
            </div>

        </div>
    )
}

export default LobbyContent
