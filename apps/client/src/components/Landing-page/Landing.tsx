import { RainbowButton } from "../ui/rainbow-button"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from "react-router-dom"

function Landing() {
    const navigate = useNavigate();

    useGSAP(() => {
        gsap.from('#text > *', {
            opacity: 0,
            y: 30,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.15,
            delay: 0.2,
        })
    }, [])

    return (
        <>
            <div className="relative flex flex-col h-screen overflow-hidden">

                {/* Background Layer 1 */}
                <img
                    className="absolute w-full h-[77%] md:h-[85%] lg:h-screen top-0 left-0 object-cover"
                    src="https://res.cloudinary.com/dnkenioua/image/upload/v1764994295/Luma_20-_2016_1_y6geiw.png"
                    alt="Background layer 1"
                />

                {/* Background Layer 2 */}
                <img
                    className="absolute w-full h-[77%] md:h-[85%] lg:h-screen top-0 left-0 object-cover"
                    src="https://res.cloudinary.com/dnkenioua/image/upload/v1764994589/Rectangle_1000002486_hqyujp.png"
                    alt="Background layer 2"
                />

                {/* Text Section */}
                <div id="text" className="absolute z-10 top-42 left-4 sm:left-8 md:left-17 lg:left-30 xl:left-32 px-4 sm:px-0 transform -translate-y-1/4 lg:top-1/2 lg:-translate-y-1/2 text-[#1A1B1E] w-[calc(100%-2rem)] sm:w-auto">
                    <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-6xl leading-tight lg:leading-17 tracking-tight">
                        Transform the Way <br className="hidden sm:block" /> You Meet, Work, and Socialize
                    </h1>

                    <p className="text-[#52525C] text-sm sm:text-base md:text-lg lg:text-xl mt-3 lg:mt-4 font-medium lg:font-semibold leading-relaxed lg:leading-8">
                        Bridge remote gaps with spatial video, live interactions, and <br className="hidden lg:block" />
                        Enable collaboration that feels human again.
                    </p>

                    <div className="flex gap-4 items-center py-6 lg:py-8">
                        <RainbowButton
                            onClick={() => navigate('/app')}
                            size="sm"
                            responsiveSize="lg"
                            className="h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
                        >
                            Explore
                        </RainbowButton>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Landing