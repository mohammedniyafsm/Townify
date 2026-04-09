import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

// Augment Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: "user" | "admin" | string;
      };
    }
  }
}

// Define your token payload type
interface AuthPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}



const getRefreshToken = (req: Request): string | null => {
  const cookie = req.cookies?.["refresh_token"];

  if (cookie) return cookie;

  return null;
};

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getRefreshToken(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as AuthPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getRefreshToken(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as AuthPayload;

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
