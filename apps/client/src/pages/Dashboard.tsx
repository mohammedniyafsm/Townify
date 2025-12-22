import DashbaordNav from "@/components/Dashboard/DashbaordNav"
import DashContent from "@/components/Dashboard/DashContent"
import { useState } from "react"

function Dashboard() {

  const [CreateRoom, setCreateRoom] = useState<boolean>(false);
  const [JoinRoom, setJoinRoom] = useState<boolean>(false);

  return (
    <div>
      <DashbaordNav
        setJoinRoom={setJoinRoom}
        setCreateRoom={setCreateRoom}
      />
      <div className="min-h-screen w-full bg-[#f8fafc] relative">
        {/* Soft Morning Mist Background */}
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
        {/* Your Content/Components */}
        <div className="pt-28 px-14 relative">
          <DashContent
            JoinRoom={JoinRoom}
            setJoinRoom={setJoinRoom}
            CreateRoom={CreateRoom}
            setCreateRoom={setCreateRoom}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
