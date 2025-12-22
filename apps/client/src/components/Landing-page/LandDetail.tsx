import { useNavigate } from "react-router-dom"
import { RainbowButton } from "../ui/rainbow-button"

function LandDetail() {
    const navigate = useNavigate();
    return (

        <div className="">
            <div className="flex justify-center items-center gap-10 py-16 ">

                <div className=" flex flex-col  gap-4">
                    <h1 className="font-bricogrotesque font-semibold text-6xl">Meet, Motivate, and <br /> Manage Remote Teams</h1>

                    <p className="font-inter text-base ">Townify makes managing teams like being in the same   <br />
                        room. Complex projects with tight deadlines? seamlessly <br />
                        with chat or video,Communicate and make your <br />
                        team their most productive selves</p>

                    <div className="">
                        <RainbowButton onClick={()=>navigate('/app')} size={"lg"}>Get Your Space</RainbowButton>
                    </div>
                </div>

                <div className="w-[550px] flex justify-center">
                    <video
                        src="https://res.cloudinary.com/dnkenioua/video/upload/v1765020109/h3yy6rTnJQ_720p_1691443174_jow9zp.mp4"
                        autoPlay
                        muted
                        loop
                        className="w-full rounded-xl"
                    ></video>
                </div>
            </div>

            <div className="">
                
            </div>
        </div>
    )
}

export default LandDetail
