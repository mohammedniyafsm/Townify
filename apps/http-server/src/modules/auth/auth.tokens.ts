import jwt from "jsonwebtoken";

export const generateRefreshToken = (user: any) =>
  jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );
