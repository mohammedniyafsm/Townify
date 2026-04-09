import { useNavigate } from "react-router-dom"
import { RainbowButton } from "../ui/rainbow-button"

function LandDetail() {
    const navigate = useNavigate();
    return (
        <div className="">
            <div className="flex justify-center items-center gap-10 py-16 px-10 max-lg:flex-col max-lg:py-10 max-lg:px-6 max-lg:gap-8">

                <div className="flex flex-col gap-4 max-lg:items-center max-lg:text-center max-lg:w-full">
                    <h1 className="font-bricogrotesque font-semibold text-6xl 
                        max-md:text-5xl 
                        max-sm:text-4xl 
                        max-xs:text-3xl 
                        max-lg:leading-tight">
                        Meet, Motivate, and <br className="max-lg:hidden" />
                        <span className="lg:hidden"> </span>Manage Remote Teams
                    </h1>

                    <p className="font-inter text-base 
                        max-lg:text-center 
                        max-lg:mx-auto 
                        max-md:text-sm 
                        max-sm:text-xs 
                        max-lg:leading-relaxed 
                        max-lg:max-w-2xl">
                        Townify makes managing teams like being in the same room.
                        <br className="max-lg:hidden" />
                        Complex projects with tight deadlines? seamlessly
                        <br className="max-lg:hidden" />
                        with chat or video, Communicate and make your
                        <br className="max-lg:hidden" />
                        team their most productive selves
                    </p>

                    <div className="max-lg:flex max-lg:justify-center max-lg:w-full max-lg:mt-2">
                        <RainbowButton
                            onClick={() => navigate('/app')}
                            size={"lg"}
                            className="max-lg:px-8 max-lg:py-6 max-lg:text-base 
                                max-md:px-6 max-md:py-5 
                                max-sm:px-5 max-sm:py-4 
                                hover:scale-[1.02] 
                                transition-transform 
                                duration-200 
                                active:scale-[0.98]"
                        >
                            Get Your Space
                        </RainbowButton>
                    </div>
                </div>

                <div className="w-[550px] flex justify-center 
                    max-lg:w-full 
                    max-lg:max-w-2xl 
                    max-lg:mt-4 
                    max-md:mt-6
                    animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <video
                        src="https://res.cloudinary.com/dnkenioua/video/upload/v1765020109/h3yy6rTnJQ_720p_1691443174_jow9zp.mp4"
                        autoPlay
                        muted
                        loop
                        className="w-full rounded-xl 
                            max-lg:rounded-2xl 
                            max-sm:rounded-xl
                            shadow-lg 
                            hover:shadow-xl 
                            transition-shadow 
                            duration-300"
                    ></video>
                </div>
            </div>

            <div className="">

            </div>
        </div>
    )
}

export default LandDetail