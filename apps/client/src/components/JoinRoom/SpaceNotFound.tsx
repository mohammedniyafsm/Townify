import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";


function SpaceNotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-center h-[60vh] text-center">
            <h1 className="text-4xl font-bricogrotesque font-bold">
                This space doesn’t exist
            </h1>
            <p className="mt-2 text-sm text-gray-500 flex flex-col">
                The link may be invalid or the space was deleted.
                <Button className="my-4 cursor-pointer" onClick={() => navigate("/")} >Back to Home</Button>
            </p>
        </div>
    );
}

export default SpaceNotFound;
