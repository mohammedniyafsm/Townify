import { useEffect, useState } from "react";
import Invite from "@/components/invite/Invite";
import { checkSpaceAccess } from "@/api/SpaceApi";
import { useParams } from "react-router-dom";
import InviteLoading from "@/components/invite/InviteLoading";
import AcessDenied from "@/components/invite/AcessDenied";

function InviteMembers() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);

        const res = await checkSpaceAccess(slug as string);
        console.log(res);
        // if API succeeds → user is owner
        setHasAccess(true);

      } catch (error) {
        // if API fails → no access
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  // 1 Loading state
  if (loading) {
    return (
      <InviteLoading />
    );
  }

  //  No access popup
  if (!hasAccess) {
    return (
      <AcessDenied />
    );
  }

  // 3️⃣ Access granted → show Invite UI
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative">
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
        <Invite />
      </div>
    </div>
  );
}

export default InviteMembers;
