import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { RainbowButton } from "../ui/rainbow-button";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/Redux/stroe";
import type { UserI } from "@repo/types";
import type React from "react";
import { LogoutApi } from "@/api/authApi";
import { removeAuth } from "@/Redux/Slice/Auth/Auth";

interface DashboardNavProps {
  setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
  setJoinRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

function DashboardNav({ setCreateRoom, setJoinRoom }: DashboardNavProps) {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user) as { user: UserI };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ FIX: Separate refs
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  // ✅ FIXED click outside logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isDropdownOpen) return;

      const target = event.target as Node;

      if (
        desktopDropdownRef.current?.contains(target) ||
        mobileDropdownRef.current?.contains(target)
      ) {
        return;
      }

      setIsDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await LogoutApi();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      dispatch(removeAuth());
      setIsDropdownOpen(false);
      navigate("/");
    }
  };

  const handleProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/dnkenioua/image/upload/v1764999707/Group_ik1uap.png"
                alt="Townify Logo"
                className="h-4 w-4 md:h-6 md:w-6 transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
            </div>
            <h1 className="font-inter font-bold text-lg md:text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Townify
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button className="font-inter text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
              My Space
            </button>

            <Button onClick={() => setJoinRoom(true)} variant="outline" className="border-gray-300 hover:border-gray-400 text-gray-700">
              Join Space
            </Button>

            <RainbowButton onClick={() => setCreateRoom(true)} className="shadow-lg hover:shadow-xl transition-shadow">
              Create Space
            </RainbowButton>

            {/* Desktop Dropdown */}
            <div className="relative ml-4" ref={desktopDropdownRef}>
              <button onClick={toggleDropdown} className="flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200">
    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold uppercase shadow-md">
      {user?.profile ? (
        <img src={user.profile} alt={user.name} className="h-full w-full rounded-full object-cover border-2 border-white" />
      ) : (
        <span className="text-lg">{user?.name?.charAt(0) ?? "U"}</span>
      )}
    </div>
    {/* Username moved HERE, outside the circle */}
    <span className="font-inter font-semibold text-gray-900">
      {user?.name}
    </span>
  </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button onClick={handleProfile} className="w-full px-4 py-3 text-left hover:bg-gray-50">
                    Profile
                  </button>
                  <button onClick={handleLogout} className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="flex md:hidden" ref={mobileDropdownRef}>
            <button onClick={toggleDropdown} className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {user?.name?.charAt(0) ?? "U"}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-4 top-16 w-56 bg-white rounded-xl shadow-lg border py-2 z-50">
                <button onClick={handleProfile} className="w-full px-4 py-3 text-left hover:bg-gray-50">
                  Profile
                </button>
                <button onClick={handleLogout} className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600">
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardNav;
