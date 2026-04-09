import ProfileCard from "@/components/Profile/ProfileCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/Redux/stroe";
import ProfileShimmer from "@/components/Profile/ProfileShimmer";
import Footer from "@/components/Dashboard/Footer";
import LandingNav from "@/components/Landing-page/LandingNav";

export default function Profile() {

  const user = useSelector((state: RootState) => state.user);


  return (
    <>
      <LandingNav />
      <div className="relative min-h-screen pt-40"> {/* Add min-h-screen here */}
        {/* Gradient background - make it cover entire screen */}
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
        {
          user.status === 'loading' ? <ProfileShimmer /> : <ProfileCard />
        }
        <Footer />
      </div>
    </>
  );
}

