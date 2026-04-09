import { useEffect, useRef, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { userVerifyTokenApi } from "./api/authApi";
import { adminVerifyTokenApi } from "./api/adminApi";
import { ProtectedLoading } from "./components/JoinRoom/Loading";


export const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const validateUser = async () => {
      try {
        const response = await userVerifyTokenApi();

        if (response?.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error: unknown) {
        console.error("User authentication error:", error);

        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Authentication failed",{duration:3000}
          );
        } else {
          toast.error("Network error. Please try again.",{duration:3000});
        }

        setIsAuthenticated(false);
      }
    };

    validateUser();
  }, []);

  if (isAuthenticated === null) {
    return <div><ProtectedLoading /></div>;
  }
  const redirectPath = encodeURIComponent(
      location.pathname + location.search
    );
  return isAuthenticated ? <Outlet /> : <Navigate to={`/login?redirect=${redirectPath}`} replace />;
};



export const AdminProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const validateAdmin = async () => {
      try {
        const response = await adminVerifyTokenApi();

        const user = response?.data?.data;

        if (response?.status === 200 && user?.role === "admin") {
          setIsAuthenticated(true);
        } else {
          toast.error("Admin access required",{duration:3000});
          setIsAuthenticated(false);
        }
      } catch (error: unknown) {
        console.error("Admin authentication error:", error);

        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Authentication failed",{duration:3000}
          );
        } else {
          toast.error("Network error. Please try again.",{duration:3000});
        }

        setIsAuthenticated(false);
      }
    };

    validateAdmin();
  }, []);

  if (isAuthenticated === null) {
    return <div><ProtectedLoading /></div>;
  }

  const redirectPath = encodeURIComponent(
      location.pathname + location.search
    );
  return isAuthenticated ? <Outlet /> : <Navigate to={`/login?redirect=${redirectPath}`} replace />;
};
