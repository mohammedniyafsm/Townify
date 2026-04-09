import { joinSpace } from "@/api/SpaceApi";
import Navbar from "@/components/invite/Navbar";
import {Loading} from "@/components/JoinRoom/Loading";
import BlockedUser from "@/components/JoinRoom/BlockedUser";
import RequestAccess from "@/components/JoinRoom/RequestAccess";
import RequestSent from "@/components/JoinRoom/RequestSent";
import SpaceNotFound from "@/components/JoinRoom/SpaceNotFound";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type JoinState =
  | "loading"
  | "blocked"
  | "request"
  | "pending"
  | "not-found";

function Join() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<JoinState>("loading");

  useEffect(() => {
    const attemptJoin = async () => {
      try {
        const res = await joinSpace(slug as string);

        if (res.data?.member) {
          navigate(`/lobby/${slug}`);
        }
      } catch (error: any) {
        const message = error?.response?.data?.message;

        switch (message) {
          case "USER_BLOCKED":
            setState("blocked");
            break;

          case "NOT_INVITED":
            setState("request");
            break;

          case "WAITING_FOR_APPROVAL":
            setState("pending");
            break;

          case "SPACE_NOT_FOUND":
            setState("not-found");
            break;

          default:
            console.error("Unknown error:", message);
            setState("not-found");
        }
      }
    };

    attemptJoin();
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
            )
          `,
        }}
      />

      <div className="relative">
        <Navbar />

        {state === "loading" && (
            <Loading />
        )}

        {state === "blocked" && <BlockedUser />}

        {state === "request" && (
          <RequestAccess
            slug={slug!}
            onSent={() => setState("pending")}
          />
        )}

        {state === "pending" && <RequestSent />}

        {state === "not-found" && <SpaceNotFound />}
      </div>
    </div>
  );
}

export default Join;
