import { useState } from "react"
import { Button } from "../ui/button"
import { RainbowButton } from "../ui/rainbow-button"
import { Menu, X } from "lucide-react"
import { useNavigate } from "react-router-dom";


function LandingNav() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="fixed top-0 z-100 w-screen bg-white ">
      <div className="flex justify-between px-6 md:px-16 lg:px-24 py-6 items-center bg-background">

        {/* Logo + Nav */}
        <div className="flex items-center gap-10 lg:gap-20">
          {/* Logo */}
          <div className="flex gap-2 items-center">
            <img
              src="https://res.cloudinary.com/dnkenioua/image/upload/v1764999707/Group_ik1uap.png"
              className=""
            />
            <h1 className="font-inter font-semibold text-sm md:text-lg">Townify</h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 lg:gap-8 font-inter text-[#52525C]">
            <h1>Home</h1>
            <h1>Features</h1>
            <h1>Resources</h1>
            <h1>Pricing</h1>
          </div>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-4">
          <Button onClick={()=>navigate('/login')} variant="outline">Login</Button>
          <RainbowButton>Get Started</RainbowButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden bg-white px-6 py-4 space-y-4 border-t">
          <div className="flex flex-col gap-4 text-[#52525C] font-inter">
            <h1>Home</h1>
            <h1>Features</h1>
            <h1>Resources</h1>
            <h1>Pricing</h1>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button variant="outline">Login</Button>
            <RainbowButton>Get Started</RainbowButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingNav
