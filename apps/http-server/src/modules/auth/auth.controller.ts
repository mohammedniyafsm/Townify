import { type Request, type Response } from "express";
import {
  loginService,
  verifyOtpService,
  signupService,
  googleLoginService,
  resendOtpService,
  verifyTokenService,
} from "./auth.service.js";
import { generateRefreshToken } from "./auth.tokens.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    await loginService(email, password);
    return res.json({ message: "OTP sent" });
  } catch (err: any) {
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    else if (err.message === "USER_BLOCKED") {
      return res.status(403).json({ message: "User account is blocked" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await signupService(email, password, name);
    return res.status(201).json({ message: "User created" });
  } catch (err: any) {
    if (err.message === "USER_EXISTS") {
      return res.status(409).json({ message: "User already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await verifyOtpService(email, otp);

    const refreshToken = generateRefreshToken(user);
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({ user });
  } catch (err: any) {
    if (err.message === "INVALID_OTP") {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await resendOtpService(email);
    return res.status(202).json({ message: "OTP resent" });
  } catch (err: any) {
    if (err.message === "TOO_EARLY") {
      return res.status(429).json({
        message: "Please wait before resending OTP",
        secondsLeft: err.secondsLeft,
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    if (!req.query.code || Array.isArray(req.query.code)) {
      return res.status(400).json({ message: "Google auth code is required" });
    }

    const user = await googleLoginService(req.query.code as string);

    const refreshToken = generateRefreshToken(user);
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({ user });
  } catch (err: any) {
    if (err.message === "USER_BLOCKED") {
      return res.status(403).json({ message: "User account is blocked" });
    }
    return res.status(500).json({ message: "Google login failed" });
  }
};

export const logout = async (_: Request, res: Response) => {
  try {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.json({ message: "Logged out" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const verifyToken = async (req:Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const auth= await verifyTokenService(userId as string);
    res.status(200).json({ message: "User valid", success: true, data: auth });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error, success: false });
  }
};