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
                    className="absolute w-full h-full md:h-[85%] lg:h-screen top-0 left-0 object-cover"
                    src="https://res.cloudinary.com/dnkenioua/image/upload/v1764994295/Luma_20-_2016_1_y6geiw.png"
                    alt="Background layer 1"
                />

                {/* Background Layer 2 */}
                <img
                    className="absolute w-full h-full md:h-[85%] lg:h-screen top-0 left-0 object-cover"
                    src="https://res.cloudinary.com/dnkenioua/image/upload/v1764994589/Rectangle_1000002486_hqyujp.png"
                    alt="Background layer 2"
                />

                {/* Text Section */}
                <div
                    id="text"
                    className="
                        absolute z-10 text-[#1A1B1E]
                        inset-x-0 top-[35%] -translate-y-1/4
                        flex flex-col items-center text-center
                        px-6
                        sm:px-10
                        md:inset-x-auto md:left-17 md:right-auto md:top-42 md:items-start md:text-left md:px-0 md:w-auto md:-translate-y-1/4
                        lg:left-30 lg:top-1/2 lg:-translate-y-1/2
                        xl:left-32
                    "
                >
                    <h1 className="font-bold tracking-tight leading-tight text-[1.75rem] sm:text-3xl md:text-4xl lg:text-6xl lg:leading-17 max-w-[90vw] md:max-w-none">
                        Transform the Way <br className="hidden sm:block" /> You Meet, Work, and Socialize
                    </h1>

                    <p className="text-[#52525C] font-medium leading-relaxed mt-4 text-sm sm:text-base md:text-lg lg:text-xl lg:mt-4 lg:font-semibold lg:leading-8 max-w-xs sm:max-w-md md:max-w-none">
                        Bridge remote gaps with spatial video, live interactions, and <br className="hidden lg:block" />
                        Enable collaboration that feels human again.
                    </p>

                    <div className="flex gap-4 items-center pt-6 md:py-6 lg:py-8">
                        <RainbowButton
                            onClick={() => navigate('/app')}
                            size="sm"
                            responsiveSize="lg"
                            className="h-11 sm:h-12 px-8 sm:px-8 text-sm sm:text-base shadow-lg shadow-black/10"
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