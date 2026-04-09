import bcrypt from "bcrypt";
import axios from "axios";
import { prisma } from "@repo/database";
import { cacheSet, cacheGet, cacheDel } from "@repo/cache";
import { sendOTPEmail } from "../../shared/services/nodemailer.service.js";
import { oAuthclient } from "../../shared/services/googleConfig.service.js";

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new Error("INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  if (!user.isActive) throw new Error("USER_BLOCKED");

  const otp = Math.floor(10000 + Math.random() * 90000).toString();

  await cacheSet(`otp:${email}`, otp, 300);
  await cacheSet(`otp:timestamp:${email}`, Date.now().toString(), 300);

  await sendOTPEmail(email, otp);
};

export const signupService = async (
  email: string,
  password: string,
  name: string
) => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("USER_EXISTS");

  const hashed = await bcrypt.hash(password, 10);
  await cacheDel("users:list")

  await prisma.user.create({
    data: {
      email: email.trim(),
      password: hashed,
      name: name.trim(),
    },
  });
};

export const verifyOtpService = async (email: string, otp: string) => {
  const storedOtp = await cacheGet(`otp:${email}`);
  if (!storedOtp || storedOtp != otp) throw new Error("INVALID_OTP");

  await cacheDel(`otp:${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { avatar: true, space: true },
  });

  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
};

export const resendOtpService = async (email: string) => {
  const storedTime = await cacheGet<string>(`otp:timestamp:${email}`);

  if (storedTime) {
    const elapsed = (Date.now() - parseInt(storedTime)) / 1000;
    if (elapsed < 60) {
      const err = new Error("TOO_EARLY") as any;
      err.secondsLeft = Math.floor(60 - elapsed);
      throw err;
    }
  }

  const otp = Math.floor(10000 + Math.random() * 90000).toString();

  await cacheSet(`otp:${email}`, otp, 300);
  await cacheSet(`otp:timestamp:${email}`, Date.now().toString(), 300);

  await sendOTPEmail(email, otp);
};

export const googleLoginService = async (code: string) => {
  const googleRes = await oAuthclient.getToken(code);
  oAuthclient.setCredentials(googleRes.tokens);

  const userInfo = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${googleRes.tokens.access_token}`,
      },
    }
  );

  const googleUser = userInfo.data;

  let user = await prisma.user.findUnique({
    where: { email: googleUser.email },
    include: { avatar: true, space: true },
  });

  if (!user) {
    await cacheDel("users:list")
    user = await prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        profile: googleUser.picture,
        authProvider: "google",
        googleId: googleUser.id,
      },
      include: { avatar: true, space: true },
    });
  }
  if (!user.isActive) throw new Error("USER_BLOCKED");

  return user;
};


export const verifyTokenService = async (userId:string) => {
  const user=await prisma.user.findUnique({
    where:{id:userId},
    include: { avatar: true, space: true }, 
  });
  if(!user) throw new Error("USER_NOT_FOUND");
  if(!user.isActive) throw new Error("USER_BLOCKED");
  return user;
}

