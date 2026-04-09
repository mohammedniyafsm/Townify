import type { RootState } from "@/Redux/stroe"
import type { UserI } from "@repo/types"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";


function RoomLobbyNAv() {

    const { user } = useSelector((state: RootState) => state.user) as { user: UserI };
    const navigate = useNavigate();

    return (
        <div>
            <div  className="flex justify-between items-center px-12 py-2">
                {/* Logo */}
                <div onClick={()=> navigate('/')} className="flex gap-2 items-center cursor-pointer ">
                    <img
                        src="https://res.cloudinary.com/dnkenioua/image/upload/v1764999707/Group_ik1uap.png"
                        className=" "
                    />
                    <h1 className="font-inter font-semibold text-sm md:text-lg">Townify</h1>
                </div>

                <div className="flex items-center gap-1 hover:bg-gray-200  px-4 py-6 rounded-2xl">
                    <h1 className="font-bricogrotesque text-lg font-semibold ">{user?.name} </h1>
                    <button className="  rounded-2xl rotate-90 text-black flex items-center justify-center ">
                        &gt;
                    </button>
                </div>

            </div>
        </div>
    )
}

export default RoomLobbyNAv
