import { Spinner } from "../ui/spinner"
import Navbar from "./Navbar"

function InviteLoading() {
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

            {/* Content */}
            <div className="absolute"><Navbar  /></div> 
            <div className="relative min-h-screen flex items-center justify-center">
               
                    <div className="flex items-center gap-2 text-gray-600 text-lg">
                        <Spinner />
                        Checking access...
                    </div>
            </div>
        </div>
    )
}

export default InviteLoading
