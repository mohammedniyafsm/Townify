import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiLogOut,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux/stroe";
import { adminLogout } from "@/Redux/Slice/AdminUsers/UsersThunk";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const auth = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate =useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "dashboard", icon: <FiHome />, label: "Dashboard", path: "/admin" },
    {
      id: "users",
      icon: <FiUsers />,
      label: "User Management",
      path: "/admin/user",
    },
    { id: "maps", icon: <FiBox />, label: "Maps", path: "/admin/maps" },
    {
      id: "avatars",
      icon: <FiShoppingCart />,
      label: "Avatars",
      path: "/admin/avatars",
    },
  ];

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const handleLogout = async () => {
    try {
      await dispatch(adminLogout()).unwrap()
      navigate('/login')
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  // Helper function to check if a menu item is active
  const isActiveItem = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const sidebarVariants = {
    expanded: { width: "250px" },
    collapsed: { width: "64px" },
  };

  const overlayVariants = {
    visible: { opacity: 0.5 },
    hidden: { opacity: 0 },
  };

  return (
    <>
      {isMobile && isExpanded && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-20"
          onClick={toggleSidebar}
        />
      )}
      <AnimatePresence>
        <motion.div
          initial={isExpanded ? "expanded" : "collapsed"}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={sidebarVariants}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-0 h-screen bg-white shadow-lg z-30 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/dnkenioua/image/upload/v1764999707/Group_ik1uap.png"
                alt="Company Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              {isExpanded && (
                <span className="font-bold text-lg text-gray-800">Townify</span>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="Toggle Sidebar"
            >
              <FiMenu size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => {
              const isActive = isActiveItem(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    // Close sidebar on mobile when clicking a link
                    if (isMobile) {
                      setIsExpanded(false);
                    }
                  }}
                  className={`w-full flex items-center p-3 transition-all
                    ${!isExpanded ? "justify-center" : "px-4"}
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isExpanded && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-4">
            {auth.status == "loading" ? (
              <div className="animate-pulse flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                {isExpanded && (
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {auth.user?.profile ? (
                    <img
                      src={auth.user?.profile || ""}
                      alt="User Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                      {auth.user?.name
                        ? auth.user.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  )}
                  {isExpanded && (
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {auth.user?.name}
                      </p>
                      <p className="text-sm text-gray-500">Admin</p>
                    </div>
                  )}
                </div>
              </>
            )}
            <button
            onClick={handleLogout}
              className={`w-full flex items-center p-3 mt-2 rounded-lg hover:bg-red-50 text-red-600
                ${!isExpanded ? "justify-center" : ""}`}
              aria-label="Logout"
            >
              {/* Fixed: Using text-xl class to match menu icon sizes */}
              <span className="text-xl">
                <FiLogOut />
              </span>
              {isExpanded && <span className="ml-3">Logout</span>}
            </button>
          </div>

          {isExpanded && (
            <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
              Version 1.0.0
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="ml-16">{children}</div>
    </>
  );
};

export default Sidebar;
