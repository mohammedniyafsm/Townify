import type { Request, Response } from "express";
import { prisma } from "@repo/database";
import bcrypt from "bcrypt";
import { oAuthclient } from "../lib/googleConfig.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../lib/nodemailer.js";
import { cacheSet, cacheGet, cacheDel } from "@repo/cache";
import { uploadToCloudinary } from "src/lib/cloudinary.js";
import { signupSchema, loginSchema } from "@repo/zod-schemas";

interface User {
  userId?: string;
  id: string;
  email: string;
  role: string;
}

const getRefereshToken = (user: User) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
};

const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    console.log(parsed);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    if (!user.password) {
      return res.status(400).json({
        message: "User registered via Google login. Please use Google login.",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const otp = Math.floor(10000 + Math.random() * 90000).toString();

    await cacheSet(`otp:${email}`, otp, 5 * 60);
    await cacheSet(`otp:timestamp:${email}`, Date.now().toString(), 5 * 60);
    await sendOTPEmail(email, otp);

    return res
      .status(200)
      .json({ message: "OTP sent to your email. Please verify to login." });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const Signup = async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: email.trim(),
        password: hashedPassword,
        name: name.trim(),
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find user without transaction first
    const user = await prisma.user.findUnique({
      where: { email },
      include: { avatar: true,space:true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedOtp: string | null = await cacheGet<string>(`otp:${email}`);
    if (!storedOtp) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }
    if (storedOtp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await cacheDel(`otp:${email}`);
    const refresh_token = getRefereshToken(user);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      user: {
        id: user.id,
        avatarId: user.avatarId,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
        profile: user.profile,
        space:user.space,   
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const storedOtpTime = await cacheGet<string>(`otp:timestamp:${email}`);
    if (storedOtpTime) {
      const elapsed = (Date.now() - parseInt(storedOtpTime)) / 1000;
      if (elapsed < 60) {
        const secondsLeft = Math.floor(60 - elapsed);
        return res.status(400).json({
          message: `Resend OTP in ${secondsLeft} seconds`,
          seconds: secondsLeft,
        });
      }
    }
    const newOtp = Math.floor(10000 + Math.random() * 90000).toString();
    await cacheSet(`otp:timestamp:${email}`, Date.now().toString(), 5 * 60);
    await cacheSet(`otp:${email}`, newOtp, 5 * 60);
    await sendOTPEmail(email, newOtp);

    res.status(200).json({ message: "Otp resent" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const googleLogin = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code || Array.isArray(code)) {
      return res.status(400).json({ message: "Code is required" });
    }
    const codeStr = code as string;
    const googleResponse = await oAuthclient.getToken(codeStr);
    oAuthclient.setCredentials(googleResponse.tokens);
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleResponse.tokens.access_token}`,
        },
      }
    );
    const googleUser = userRes.data;
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
      include: { avatar: true ,space:true},
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          profile: googleUser.picture,
          authProvider: "google",
          googleId: googleUser.id,
        },
        include: { avatar: true ,space:true},
      });
    }

    const refresh_token = getRefereshToken(user);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "Login successful", user: {
        id: user.id,
        avatarId: user.avatarId,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
        profile: user.profile,
        space:user.space
      }});
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const logOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name, avatarId }: { name: string; avatarId: string } = req.body;
    const profile = req.file;
    const user = await prisma.user.findUnique({ where: { id: userId || "" } , include: { avatar: true ,space:true},});
    if (name.length < 1) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    const updatedData: {
      name?: string;
      profile?: string;
      avatarId?: string | null;
    } = {};
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (profile) {
      const { result, success, error } = await uploadToCloudinary(
        profile.path,
        { folder: "townify/users" }
      );
      if (!success) {
        return res.status(500).json({ message: "User update failed", error });
      }
      updatedData.profile = result?.secure_url || "";
    }
    updatedData.name = name.trim() || user.name;
    updatedData.avatarId = avatarId || user.avatarId;

    const updatedUser = await prisma.user.update({
      where: { id: userId || "" },
      data: updatedData,
      include: { avatar: true ,space:true},
    });
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        avatarId: updatedUser.avatarId,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile,
        space:user.space
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: userId || "",
      },
      include: {
        avatar: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User found",
      user: {
        id: user.id,
        avatarId: user.avatarId,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  login,
  googleLogin,
  Signup,
  verifyOTP,
  resendOtp,
  logOut,
  updateUserProfile,
  getUser
};
