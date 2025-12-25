import { BorderBeam } from "../ui/border-beam";
import { RainbowButton } from "../ui/rainbow-button";
import Navbar from "./Navbar";

function AccessDenied() {
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

      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <Navbar />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="relative">
          {/* Card */}
          <div className="bg-white p-6 rounded-xl shadow-md text-center font-bricogrotesque">
            <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">
              You don’t have permission to manage invitations for this space.
            </p>
            <RainbowButton onClick={() => window.history.back()}>
              Go Back
            </RainbowButton>
          </div>

          {/* Border */}
          <BorderBeam />
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;
