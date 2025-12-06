import { Button } from "../ui/button"
import { RainbowButton } from "../ui/rainbow-button"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


function Landing() {

    useGSAP(()=>{
        gsap.from('#text > *',{
            opacity: 0,
            y: 30,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.15,
            delay: 0.2,
        })
    },[])
    return (
        <>
            <div className="relative flex flex-col h-screen">

                {/* Background Layer 1 */}
                <img
                    className="absolute top-32 lg:top-0 lg:w-screen lg:h-screen"
                    src="https://res.cloudinary.com/dnkenioua/image/upload/v1764994295/Luma_20-_2016_1_y6geiw.png"
                    alt=""
                />

                {/* Background Layer 2 */}
                <img
                    className="absolute w-screen top-32 lg:top-0"
                    src="https://res.cloudinary.com/dnkenioua/image/upload/v1764994589/Rectangle_1000002486_hqyujp.png"
                    alt=""
                />

                {/* Background Layer 3 */}
                {/* <img
          className="absolute bottom-0  lg:h-50 top-70 sm:top-70 md:top-84 lg:top-132 w-screen"
          src="https://res.cloudinary.com/dnkenioua/image/upload/v1764995148/Rectangle_1000002566_n7jciq.png"
          alt=""
        /> */}
                {/* <img
                    className="absolute bottom-0 w-screen h-50"
                    src="https://res.cloudinary.com/dnkenioua/image/upload/v1764995148/Rectangle_1000002566_n7jciq.png"
                    alt=""
                /> */}

                {/* Text Section */}
                <div id="text" className="absolute top-32 left-6 lg:left-30 lg:top-50  text-[#1A1B1E]">
                    <h1 className="font-bold text-[20px] lg:text-6xl leading-6  lg:leading-17">
                        Transform the Way <br /> You Meet, Work, and Socialize
                    </h1>

                    <p className="text-[#52525C] text-[9px] md:text-[8px] mt-1 pl-3 lg:text-base font-semibold lg:mt-2 leading-3  lg:leading-6">
                        Bridge remote gaps with spatial video, live interactions, and <br />
                        Enable collaboration that feels human again.
                    </p>

                    <div className="flex gap-2 lg:gap-4 items-center py-3 lg:py-8">
                        <RainbowButton size="sm" responsiveSize="lg" >
                            Explore
                        </RainbowButton>

                        <Button

                            variant="outline"
                            className="font-inter  font-semibold px- py-1 md:px-2 md:py-5.5  text-[10px] md:text-base "
                        >
                            See in Action
                        </Button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Landing
