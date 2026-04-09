import type { Request, Response } from "express";
import {
  adminVerifyTokenService,
  getAdminDashboardService,
  toggleUserStatusService,
} from "./admin.service.js";

export const adminDashboard = async (req: Request, res: Response) => {
  try {
    const data = await getAdminDashboardService();
    return res.status(200).json(data);
  } catch (error: any) {
    if (error?.message) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;
    const updatedUser = await toggleUserStatusService(userId);
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error?.message) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refresh_token", {  
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.json({ message: "Admin logged out" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}


export const adminVerifyToken = async (req:Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const auth= await adminVerifyTokenService(userId as string);
    res.status(200).json({ message: "User valid", success: true, data: auth });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error, success: false });
  }
};