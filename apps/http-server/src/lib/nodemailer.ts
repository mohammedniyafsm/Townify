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

const sendInvitationEmail = async (email:string, spaceName:string, inviterEmail:string,url:string,) => {
  const mailOptions = {
    from: inviterEmail,
    to: email,
    subject: `Invitation to join space: ${spaceName}`,
    html: ` 
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>You're Invited to Join ${spaceName}</h2>
        <p>${inviterEmail} has invited you to join the space "${spaceName}" on Townify.</p>     
        <p>Click the link below to join:</p>
        <a href="${url}" style="display: inline-block; padding: 10px 15px; background-color: #234452; color: #ffffff; text-decoration: none; border-radius: 5px;">Join ${spaceName}</a>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions)
}

export { sendOTPEmail,sendInvitationEmail };