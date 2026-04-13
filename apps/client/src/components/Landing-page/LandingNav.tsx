  import {  useState } from "react"
  import { Button } from "../ui/button"
  import { RainbowButton } from "../ui/rainbow-button"
  import { Menu, X } from "lucide-react"
  import { useNavigate } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import type { RootState } from "@/Redux/stroe";
import { removeAuth } from "@/Redux/Slice/Auth/Auth";
import { LogoutApi } from "@/api/authApi";


  function LandingNav() {
    const [open, setOpen] = useState(false);

    const LoggedIn = useSelector((state: RootState) => state.user.status);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const Logout = async ()=>{
      try {
          await LogoutApi();
          dispatch(removeAuth())
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <div className="fixed top-0 z-100 w-screen bg-white ">
        <div className="flex justify-between px-6 md:px-16 lg:px-24 py-6 items-center bg-background">

          {/* Logo + Nav */}
          <div className="flex items-center gap-10 lg:gap-20">
            {/* Logo */}
            <div onClick={() => navigate('/')} className="flex gap-2 items-center cursor-pointer ">
              <img
                src="https://res.cloudinary.com/dnkenioua/image/upload/v1764999707/Group_ik1uap.png"
                className=" "
              />
              <h1 className="font-inter font-semibold text-sm md:text-lg">Townify</h1>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex gap-6 lg:gap-8 font-inter text-[#52525C] ">
              <h1 onClick={() => navigate('/')} className="cursor-pointer hover:text-foreground hover:underline">Home</h1>
              <h1 className="cursor-pointer hover:text-foreground hover:underline">Features</h1>
              <h1 className="cursor-pointer hover:text-foreground hover:underline">Resources</h1>
              <h1 onClick={() => navigate('/pricing')} className="cursor-pointer hover:text-foreground hover:underline">Pricing</h1>
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-4">
            { LoggedIn === "succeeded" ?
            <Button onClick={Logout} variant="outline">Logout</Button>
            :
            <Button onClick={() => navigate('/login')} variant="outline">Login</Button>
          }
            <RainbowButton onClick={()=>navigate('/app')}>Get Started</RainbowButton>
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
              <h1 onClick={() => { navigate('/'); setOpen(false); }} className="cursor-pointer hover:text-foreground hover:underline">Home</h1>
              <h1 className="cursor-pointer hover:text-foreground hover:underline">Features</h1>
              <h1 className="cursor-pointer hover:text-foreground hover:underline">Resources</h1>
              <h1 onClick={() => { navigate('/pricing'); setOpen(false); }} className="cursor-pointer hover:text-foreground hover:underline">Pricing</h1>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              {LoggedIn === "succeeded" ? (
                <Button onClick={Logout} className="cursor-pointer" variant="outline">Logout</Button>
              ) : (
                <Button onClick={() => { navigate('/login'); setOpen(false); }} className="cursor-pointer" variant="outline">Login</Button>
              )}
              <RainbowButton onClick={() => { navigate('/app'); setOpen(false); }} className="cursor-pointer">Get Started</RainbowButton>
            </div>
          </div>
        )}
      </div>
    )
  }

  export default LandingNav
