import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MicOff, VideoOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Input } from "../ui/input";
import { RainbowButton } from "../ui/rainbow-button";
import AllAvatarsModal from "./AllAvatarsModal";

import { FetchAllAvatars } from "@/api/avatar";
import type { AppDispatch, RootState } from "@/Redux/stroe";
import type { Avatar } from "@/types/type";
import { fetchSpaceBySlug } from "@/api/SpaceApi";
import { Spinner } from "../ui/spinner";
import { updateUser } from "@/Redux/Slice/Auth/AuthThunk";
import { Button } from "../ui/button";

function LobbyContent() {
  const [openModal, setModal] = useState(false);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [currentAvatar, setCurrentAvatars] = useState<Avatar | null>(null);
  const [name, setName] = useState("");
  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [NoSpaceFound, setNoSpaceFound] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    if (!slug || !user) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [spaceData, avatarData] = await Promise.all([
          fetchSpaceBySlug(slug),
          FetchAllAvatars(),
        ]);

        if (!spaceData?.data?.space) {
          setNoSpaceFound(true);
          return;
        }

        setSpace(spaceData.data.space);
        setAvatars(avatarData.data.avatars);
        setName(user.name || "");

        const selectedAvatar =
          avatarData.data.avatars.find(
            (a: Avatar) => a.id === user.avatarId
          ) || avatarData.data.avatars[0];

        setCurrentAvatars(selectedAvatar);
      } catch (error) {
        console.error(error);
        setNoSpaceFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, user]);

  /* -------------------- JOIN -------------------- */
  const handleSubmit = async () => {
    if (!currentAvatar || !slug) return;

    try {
      setJoinLoading(true);

      const formData = new FormData();
      formData.append("avatarId", currentAvatar.id);
      formData.append("name", name);

      await dispatch(updateUser(formData)).unwrap();

      // ✅ REDIRECT TO PHASER ROOM
      navigate(`/room/${slug}`);
    } catch (error) {
      console.error(error);
    } finally {
      setJoinLoading(false);
    }
  };

  /* -------------------- SKELETON -------------------- */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 animate-pulse">
        <div className="h-10 w-96 bg-gray-300 rounded mb-12" />
      </div>
    );
  }

  /* -------------------- REAL UI -------------------- */
  return (
    <>
      {!NoSpaceFound && (
        <div>
          <AllAvatarsModal
            openModal={openModal}
            setModal={setModal}
            currentAvatar={currentAvatar}
            setCurrentAvatars={setCurrentAvatars}
            avatars={avatars}
          />

          <div className="flex flex-col items-center justify-center">
            <h1 className="font-bricogrotesque text-5xl font-semibold mt-8">
              Welcome to {space?.name}
            </h1>

            <div className="flex justify-center items-center gap-20 mt-20">
              {/* LEFT SIDE */}
              <div>
                <div className="flex flex-col justify-center items-center text-xs bg-black h-56 w-80 font-inter rounded-2xl">
                  <h1 className="text-white">You are Muted</h1>
                  <h1 className="text-white">Your Camera is off</h1>
                </div>

                <div className="flex justify-center items-center gap-2 mt-2">
                  <button className="bg-red-400 p-2 rounded-2xl text-white flex items-center gap-2 px-4">
                    <MicOff size={18} />
                  </button>

                  <button className="bg-red-400 p-2 rounded-2xl text-white flex items-center gap-2 px-4">
                    <VideoOff size={18} />
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col py-4 justify-center items-center hover:bg-gray-500 hover:text-white rounded-lg">
                    <img
                      className="h-16 w-22"
                      src={currentAvatar?.idle}
                      alt=""
                    />
                    <h1
                      onClick={() => setModal(true)}
                      className="text-base font-bricogrotesque cursor-pointer"
                    >
                      Edit
                    </h1>
                  </div>

                  <Input
                    className="bg-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Your username"
                  />
                </div>

                <div className="pl-4">
                  <RainbowButton
                    onClick={handleSubmit}
                    className="font-bricogrotesque w-80 h-10 mt-4 text-base"
                  >
                    {joinLoading ? (
                      <h1 className="flex items-center gap-2">
                        <Spinner /> Joining
                      </h1>
                    ) : (
                      <h1>Join</h1>
                    )}
                  </RainbowButton>
                </div>
              </div>
            </div>

            <div className="mt-36">
              <h1 className="text-center text-xs">
                By joining this space, you agree to our Terms of Service and
                Privacy
                <br />
                Policy, and confirm that you're over 18 years of age.
              </h1>
            </div>
          </div>
        </div>
      )}

      {NoSpaceFound && (
        <div className="flex flex-col justify-center items-center h-[60vh] text-center">
          <h1 className="text-4xl font-bricogrotesque font-bold">
            This space doesn’t exist
          </h1>
          <p className="mt-2 text-sm text-gray-500 flex flex-col">
            The link may be invalid or the space was deleted.
            <Button className="my-4 cursor-pointer" onClick={() => navigate("/")} >Back to Home</Button>
          </p>
        </div>
      )}

    </>
  );
}

export default LobbyContent;
