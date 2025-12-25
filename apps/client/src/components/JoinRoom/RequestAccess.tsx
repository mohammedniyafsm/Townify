import { requestSpaceAccess } from "@/api/SpaceApi";
import { RainbowButton } from "../ui/rainbow-button";
import { BorderBeam } from "../ui/border-beam";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

function RequestAccess({
  slug,
  onSent,
}: {
  slug: string;
  onSent: () => void;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async () => {
    setLoading(true);
    await requestSpaceAccess(slug);
    setTimeout(() => {
      setLoading(false);
      onSent();
    }, 1000)
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="bg-white p-6 rounded-xl shadow-md text-center w-96 relative">
        <h2 className="text-2xl font-bold font-bricogrotesque mb-2">
          Private Space
        </h2>
        <p className="text-gray-600 text-sm font-bricogrotesque mb-4">
          You don’t have access to this space yet.
          You can request access from the owner.
        </p>

        <div className="flex gap-2 justify-center pt-4">
          <Button className="cursor-pointer" variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <RainbowButton disabled={loading} onClick={handleRequest}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Requesting...
              </span>
            ) : (
              "Request Access"
            )}
          </RainbowButton>
        </div>

        <BorderBeam />
      </div>
    </div>
  );
}

export default RequestAccess;
