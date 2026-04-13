import { useNavigate } from "react-router-dom";
import { Monitor } from "lucide-react";
import { BorderBeam } from "../ui/border-beam";
import { RainbowButton } from "../ui/rainbow-button";

function MobileRestricted() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center w-96 relative overflow-hidden">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <Monitor className="h-7 w-7 text-gray-600" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2 font-bricogrotesque">
          Open on Desktop
        </h2>

        <p className="text-gray-500 text-sm font-bricogrotesque leading-relaxed">
          Townify spaces require a keyboard and mouse to navigate. Please open
          this link on a desktop.
        </p>

        <RainbowButton className="mt-6 w-full" onClick={() => navigate("/app")}>
          Back to Dashboard
        </RainbowButton>

        <BorderBeam />
      </div>
    </div>
  );
}

export default MobileRestricted;
