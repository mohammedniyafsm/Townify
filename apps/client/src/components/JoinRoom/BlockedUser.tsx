import { useNavigate } from "react-router-dom";
import { BorderBeam } from "../ui/border-beam";
import { RainbowButton } from "../ui/rainbow-button";

function BlockedUser() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="bg-white p-6 rounded-xl shadow-md text-center w-96 relative overflow-hidden">
        <h2 className="text-2xl font-semibold text-red-600 mb-2 font-bricogrotesque cursor-not-allowed">
          Access Blocked
        </h2>

        <p className="text-gray-600 text-sm font-bricogrotesque cursor-not-allowed">
          You have been blocked from this space.
        </p>

        <RainbowButton
          className="mt-4"
          onClick={() => navigate("/")}
        >
          Back to Home
        </RainbowButton>

        <BorderBeam />
      </div>
    </div>
  );
}

export default BlockedUser;
