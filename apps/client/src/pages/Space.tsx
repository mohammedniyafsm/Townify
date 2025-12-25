import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Game from "../game/Game";
import Navbar from "@/components/invite/Navbar";

import { fetchSpaceBySlug, checkSpaceAccess } from "@/api/SpaceApi";

import Loading from "@/components/JoinRoom/Loading";
import BlockedUser from "@/components/JoinRoom/BlockedUser";
import SpaceNotFound from "@/components/JoinRoom/SpaceNotFound";

type SpaceState = "loading" | "allowed" | "blocked" | "not-found";

export default function Space() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<SpaceState>("loading");
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const loadSpace = async () => {
      try {
        // 🔐 1️⃣ Access check FIRST
        await checkSpaceAccess(slug);

        // 🗺️ 2️⃣ Load space data
        const res = await fetchSpaceBySlug(slug);
        setMapUrl(res.data.space.map.configJson);

        setState("allowed");
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

    loadSpace();
  }, [slug, navigate]);

  // ---------------- UI STATES ----------------

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

      {/* Content */}
      <div className="relative">
        <Navbar />

        {state === "loading" && (
            <Loading />
        )}

        {state === "blocked" && <BlockedUser />}

        {state === "not-found" && <SpaceNotFound />}

        {state === "allowed" && mapUrl && (
          <div className="w-screen h-screen">
            <Game mapUrl={mapUrl} />
          </div>
        )}
      </div>
    </div>
  );
}
