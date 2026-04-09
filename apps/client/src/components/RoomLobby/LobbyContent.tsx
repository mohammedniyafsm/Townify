import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { RainbowButton } from "../ui/rainbow-button";
import AllAvatarsModal from "./AllAvatarsModal";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

import { FetchAllAvatars } from "@/api/avatar";
import type { AppDispatch, RootState } from "@/Redux/stroe";
import type { Avatar } from "@/types/type";
import { fetchSpaceBySlug } from "@/api/SpaceApi";
import { updateUser } from "@/Redux/Slice/Auth/AuthThunk";
import { useLiveKit } from "@/contexts/LiveKitContext";

function LobbyContent() {
  const [openModal, setModal] = useState(false);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [currentAvatar, setCurrentAvatars] = useState<Avatar | null>(null);
  const [name, setName] = useState("");
  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [NoSpaceFound, setNoSpaceFound] = useState(false);
  const avatar = useSelector((state: RootState) => state.avatars)
  const isFetched = useRef(false)
  // Local Media State for Preview
  const videoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  // Use LiveKit Context for intent flags
  const { isAudioEnabled, isVideoEnabled, setIsAudioEnabled, setIsVideoEnabled } = useLiveKit();

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    if (!slug || !user) return;
    if (isFetched.current) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        if (avatar.status === 'idle') {
          await FetchAllAvatars();
        }

        const spaceData = await fetchSpaceBySlug(slug);

        if (!spaceData?.data?.space) {
          setNoSpaceFound(true);
          return;
        }

        setSpace(spaceData.data.space);
        setName(user.name || "");
        isFetched.current = true;
      } catch (err) {
        console.error(err);
        setNoSpaceFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, user, avatar.status]);



  useEffect(() => {
    if (avatar.status === 'succeeded' && user) {
      setAvatars(avatar.avatars);
      const selectedAvatar =
        avatar.avatars.find(
          (a: Avatar) => a.id === user?.avatarId
        ) || avatar.avatars[0];

      setCurrentAvatars(selectedAvatar);
    }
  }, [avatar.status, avatar.avatars, user])

  useEffect(() => {
    isFetched.current = false
  }, [slug])

  /* -------------------- MEDIA PREVIEW LOGIC -------------------- */
  useEffect(() => {
    let active = true;
    let stream: MediaStream | null = null;

    const startStream = async () => {
      // Cleanup previous stream if it exists in the ref (handling rapid toggles)
      if (videoRef.current && videoRef.current.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach(t => t.stop());
      }

      // If everything is disabled, just clear state
      if (!isVideoEnabled && !isAudioEnabled) {
        setLocalStream(null);
        if (videoRef.current) videoRef.current.srcObject = null;
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled,
          audio: isAudioEnabled
        });

        if (!active) {
          // Component unmounted orDeps changed while we were waiting
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        setLocalStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error("Failed to access media devices", err);

        // Determine which media failed and revert the appropriate state
        const errorName = err?.name;
        const isPermissionError = errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError';
        const isDeviceInUseError = errorName === 'NotReadableError' || errorName === 'AbortError';

        if (active) {
          setLocalStream(null);

          // If we tried to enable video and it failed, revert video state
          if (isVideoEnabled) {
            setIsVideoEnabled(false);
            if (isPermissionError) {
              toast.error("Camera permission denied. Please allow camera access.", {
                position: "top-center",
                duration: 2000,
              });
            } else if (isDeviceInUseError) {
              toast.error("Camera is already in use by another application.", {
                position: "top-center",
                duration: 2000,
              });
            } else {
              toast.error("Could not access camera. Please check your device.", {
                position: "top-center",
                duration: 2000,
              });
            }
          }

          // If we tried to enable audio and it failed, revert audio state
          if (isAudioEnabled && !isVideoEnabled) {
            setIsAudioEnabled(false);
            toast.error("Could not access microphone. Check permissions.", {
              position: "top-center",
              duration: 2000,
            });
          }
        }
      }
    };

    startStream();

    return () => {
      active = false;
      // Cleanup the stream created in THIS effect cycle
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoEnabled, isAudioEnabled]);

  // Cleanup on pure unmount
  useEffect(() => {
    return () => {
      // We rely on the state to clean up the FINAL stream on unmount
      setLocalStream((prevStream) => {
        if (prevStream) {
          prevStream.getTracks().forEach(t => t.stop());
        }
        return null;
      });
    };
  }, []);

  /* -------------------- JOIN -------------------- */
  const handleSubmit = async () => {
    if (!currentAvatar || !slug) return;

    try {
      setJoinLoading(true);

      const formData = new FormData();
      formData.append("avatarId", currentAvatar.id);
      formData.append("name", name);

      await dispatch(updateUser(formData)).unwrap();

      // Clean up local stream before navigating
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
        setLocalStream(null);
      }

      navigate(`/space/${slug}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to join space");
    } finally {
      setJoinLoading(false);
    }
  };

  /* -------------------- SKELETON -------------------- */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
        <div className="h-12 w-96 bg-gray-200 rounded-lg mb-8" />
        <div className="h-64 w-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (NoSpaceFound) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center">
        <h1 className="text-4xl font-bricogrotesque font-bold text-gray-900">
          This space doesn't exist
        </h1>
        <p className="mt-4 text-gray-500">
          The link may be invalid or the space was deleted.
        </p>
        <Button className="mt-6" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  /* -------------------- REAL UI -------------------- */
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 py-8">
      <AllAvatarsModal
        openModal={openModal}
        setModal={setModal}
        currentAvatar={currentAvatar}
        setCurrentAvatars={setCurrentAvatars}
        avatars={avatars}
      />

      <h1 className="font-bricogrotesque text-4xl md:text-5xl font-bold mb-12 text-center text-gray-900 tracking-tight">
        {space?.name}
      </h1>

      <div className="flex flex-col md:flex-row gap-12 items-center justify-center w-full">
        {/* PREVIEW CARD */}
        <div className="relative group">
          <div className="relative w-[360px] h-[270px] bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5">
            {isVideoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full bg-zinc-900 text-zinc-500">
                <div className="h-24 w-24 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  {currentAvatar ? (
                    <img
                      src={currentAvatar.idle}
                      alt="Avatar"
                      className="h-16 w-16 object-contain opacity-50"
                    />
                  ) : (
                    <VideoOff size={32} />
                  )}
                </div>
                <p className="font-medium">Camera is off</p>
              </div>
            )}

            {/* Media Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-3 rounded-full transition-all duration-200 border ${isAudioEnabled
                  ? "bg-white text-black border-transparent hover:bg-gray-100"
                  : "bg-red-500 text-white border-red-600 hover:bg-red-600 shadow-sm"
                  }`}
              >
                {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button
                onClick={() => { setIsVideoEnabled(!isVideoEnabled) }}
                className={`p-3 rounded-full transition-all duration-200 border ${isVideoEnabled
                  ? "bg-white text-black border-transparent hover:bg-gray-100"
                  : "bg-red-500 text-white border-red-600 hover:bg-red-600 shadow-sm"
                  }`}
              >
                {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
            </div>

            {/* Audio Status Indicator (Top Right) */}
            <div className="absolute top-4 right-4 z-10">
              {!isAudioEnabled && (
                <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                  <MicOff size={14} className="text-red-400" />
                  <span className="text-xs font-medium text-white">Muted</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col py-4 justify-center items-center hover:bg-gray-500 hover:text-white rounded-lg">
              <img
                className="h-16 w-22"
                src={currentAvatar?.idle}
                alt="Avatar"
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
            {joinLoading ? (
              <RainbowButton
                className="font-bricogrotesque w-80 h-10 mt-4 text-base bg-gray-200"
                disabled
              >
                <div className="flex items-center gap-2">
                  <Spinner /> Joining
                </div>
              </RainbowButton>
            ) : (
              <RainbowButton
                onClick={handleSubmit}
                className="font-bricogrotesque w-80 h-10 mt-4 text-base"
              >
                Join
              </RainbowButton>
            )}
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
  );
}

export default LobbyContent;