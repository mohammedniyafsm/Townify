import nodemailer from "nodemailer";


const gmail = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASSWORD;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmail,
    pass: password,
  },
});

const sendOTPEmail = async (email:string, otp:string) => {
  const mailOptions = {
    from: 'townify@gmail.com',
    to: email,
    subject: "Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #234452; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions)
};


export { sendOTPEmail };