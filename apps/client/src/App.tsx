import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "@/pages/Home";
import { Login } from "@/pages/Auth/Login";
import { SignUp } from "@/pages/Auth/SignUp";
import { OTP } from "./pages/Auth/Otp";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "./Redux/stroe";
import { useEffect, useRef } from "react";
import { fetchUser } from "./Redux/Slice/Auth/AuthThunk";
import Dashboard from "./pages/Dashboard";
import InviteMembers from "./pages/InviteMembers";
import RoomLobby from "./pages/RoomLobby";
import Pricing from "./pages/Pricing";
import Sidebar from "./components/Admin/Sidebar/Sidebar";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Maps from "./pages/Admin/Maps";
import UserManagement from "./pages/Admin/UserManagement";
import { fetchAllAvatar } from "./Redux/Slice/Avatars/AvatarThunk";
import { fetchAllMaps } from "./Redux/Slice/Maps/MapThunk";
import { fetchAdminDashboard } from "./Redux/Slice/AdminUsers/UsersThunk";
import Space from "./pages/Space";
import Join from "./pages/Join";
import EditSpace from "./pages/EditSpace";
import AvatarPage from "./pages/Admin/Avatar/Avatars";
import { fetchUserSpacesThunk } from "./Redux/Slice/UserSpace/UserSpaceThunk";
import { AdminProtectedRoute, ProtectedRoute } from "./AuthMiddleware";
import Profile from "./pages/Profile";
import { useNotificationSocket } from "./hooks/useNotificationSocket";
import JoinApprovalToast from "./components/Notification/User/JoinApprovalToast";
import JoinRequestToast from "./components/Notification/Admin/JoinRequestToast";


function App() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.user);
  const userFetched = useRef(false);
  const isFetched = useRef(false);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userFetched.current) return;
    dispatch(fetchUser());
    userFetched.current = true;
  }, []);

  useEffect(() => {
    if (auth.status != "succeeded") return;
    if (isFetched.current) return;
    dispatch(fetchUserSpacesThunk());
    dispatch(fetchAllAvatar());
    dispatch(fetchAllMaps());
    if (auth?.user?.role == "admin" && auth.status == "succeeded") {
      dispatch(fetchAdminDashboard());
    }
    isFetched.current = true;
  }, [auth.status]);

  useNotificationSocket(user?.id);

  const AdminSideBar = () => {
    return (
      <Sidebar>
        <Outlet />
      </Sidebar>
    );
  };
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <BrowserRouter>
        <JoinRequestToast />
        <JoinApprovalToast />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/otp" element={<OTP />} />
          <Route path="/pricing" element={<Pricing />} />


          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/join/:slug" element={<Join />} />
            <Route path="/space/manage/:slug" element={<EditSpace />} />
            <Route path="/invite/:slug" element={<InviteMembers />} />
            <Route path="/lobby/:slug" element={<RoomLobby />} />
            <Route path="/space/:slug" element={<Space />} />
            {/* <Route path="/map" element={<DashBoardChat onOpenSpace={() => { }} activeSpaceId={""} currentSubSpace={null} onClose={() => { }} />} /> */}
          </Route>

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminSideBar />}>
              <Route index element={<AdminDashboard />} />
              <Route path="maps" element={<Maps />} />
              <Route path="avatars" element={<AvatarPage />} />
              <Route path="user" element={<UserManagement />} />
            </Route>
          </Route>



        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
