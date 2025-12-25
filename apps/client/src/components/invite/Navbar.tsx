import { useNavigate } from 'react-router-dom'

function Navbar() {

    const navigate = useNavigate();
    return (
            <div className="flex items-center px-20 py-8">
                <div
                    onClick={() => navigate("/")}
                    className="flex gap-2 items-center cursor-pointer"
                >
                    <img
                        src="https://res.cloudinary.com/dnkenioua/image/upload/v1764999707/Group_ik1uap.png"
                    />
                    <h1 className="font-inter font-semibold text-sm md:text-lg">
                        Townify
                    </h1>
                </div>
            </div>
    )
}

export default Navbar
