import { useNavigate } from "react-router-dom";
import { RainbowButton } from "../ui/rainbow-button";
import { BorderBeam } from "../ui/border-beam";

function RequestSent() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="relative bg-white p-6 rounded-xl shadow-md text-center w-96 overflow-hidden">
        <h2 className="text-2xl font-semibold mb-2 font-bricogrotesque">
          Request Sent
        </h2>

        <p className="text-gray-600 text-sm font-bricogrotesque">
          We’ll notify you when your access request is approved.
        </p>

        {/* Image slot (add later) */}
        {/* 
        <img
          src="/images/request-sent.png"
          alt="Request sent"
          className="w-40 mx-auto my-4"
        />
        */}

        <RainbowButton
          className="mt-4"
          onClick={() => navigate("/")}
        >
          Back to Home
        </RainbowButton>

        {/* ✅ Border stays INSIDE */}
        <BorderBeam />
      </div>
    </div>
  );
}

export default RequestSent;
