import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LobbyContent from "@/components/RoomLobby/LobbyContent";
import RoomLobbyNAv from "@/components/RoomLobby/RoomLobbyNAv";

import {Loading} from "@/components/JoinRoom/Loading";
import BlockedUser from "@/components/JoinRoom/BlockedUser";
import SpaceNotFound from "@/components/JoinRoom/SpaceNotFound";

import { checkSpaceAccess } from "@/api/SpaceApi";
import type { AppDispatch, RootState } from "@/Redux/stroe";
import { fetchSpaceDetails } from "@/Redux/Slice/ManageSpace/ManageSpaceThunk";

type LobbyState = "loading" | "allowed" | "blocked" | "not-found";

function RoomLobby() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch=useDispatch<AppDispatch>()
  const spaceUser=useSelector((state:RootState)=>state.manageSpace)

  const [state, setState] = useState<LobbyState>("loading");

  useEffect(() => {
    const verifyAccess = async () => {
      try {
       const res = await checkSpaceAccess(slug as string);
       if(res.data.role === "owner" && spaceUser.status!=='succeeded'){

        await dispatch(fetchSpaceDetails(slug as string)).unwrap()
       }
        setState("allowed"); // ✅ member or owner
      } catch (error: any) {
        const message = error?.response?.data?.message;

        if (message === "BLOCKED") {
          setState("blocked");
        } else if (message === "NO_ACCESS") {
          navigate(`/join/${slug}`);
        } else if (message === "SPACE_NOT_FOUND") {
          setState("not-found");
        } else {
          navigate(`/join/${slug}`);
        }
      }
    };

    verifyAccess();
  }, [slug, navigate]);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(135deg, 
              rgba(248,250,252,1) 0%, 
              rgba(219,234,254,0.7) 30%, 
              rgba(165,180,252,0.5) 60%, 
              rgba(129,140,248,0.6) 100%
            ),
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(199,210,254,0.4) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(224,231,255,0.3) 0%, transparent 60%)
          `,
        }}
      />

      {/* Navbar ALWAYS visible */}
      <div className="relative">
        <RoomLobbyNAv />

        {state === "loading" && <Loading />}

        {state === "blocked" && <BlockedUser />}

        {state === "not-found" && <SpaceNotFound />}

        {state === "allowed" && <LobbyContent />}
      </div>
    </div>
  );
}

export default RoomLobby;
