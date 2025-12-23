import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "@/pages/Home";
import { Login } from "@/pages/Auth/Login";
import { SignUp } from "@/pages/Auth/SignUp";
import { OTP } from "./pages/Auth/Otp";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {  useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "./Redux/stroe";
import { useEffect } from "react";
import { fetchUser } from "./Redux/Slice/Auth/AuthThunk";
import Dashboard from "./pages/Dashboard";
import InviteMembers from "./pages/InviteMembers";
import RoomLobby from "./pages/RoomLobby";
import Pricing from "./pages/Pricing";
import Sidebar from "./components/Admin/Sidebar/Sidebar";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Maps from "./pages/Admin/Maps";
import Avatars from "./pages/Admin/Avatar/Avatars";
import UserManagement from "./pages/Admin/UserManagement";
import { fetchAllAvatar } from "./Redux/Slice/Avatars/AvatarThunk";

function App() {
  const dispatch=useDispatch<AppDispatch>()
  const auth=useSelector((state:RootState)=>state.user)
  useEffect(()=>{
    dispatch(fetchUser())
  },[])

  useEffect(()=>{
    if(auth.status!='succeeded') return
    dispatch(fetchAllAvatar())
  },[auth.status])


  const AdminSideBar=()=>{
    return(
      <Sidebar>
        <Outlet/>
      </Sidebar>
    )
  }
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth/otp" element={<OTP />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/invite/:slug" element={<InviteMembers />} />
            <Route path="/lobby/:slug" element={<RoomLobby />} />
            <Route path="/admin" element={<AdminSideBar/>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="maps" element={<Maps />} />
                  <Route path="avatars" element={<Avatars />} />
                  <Route path="user" element={<UserManagement />} />
            </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
