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

const sendOTPEmail = async (email: string, otp: string) => {
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

 const sendInvitationEmail = async (
  email: string,
  spaceName: string,
  inviterEmail: string,
  url: string
) => {
  const mailOptions = {
    from: `"Townify" <${inviterEmail}>`,
    to: email,
    subject: `Invitation to join a Townify space: ${spaceName}`,
    html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:40px 0;">
      <tr>
        <td align="center">

          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:14px; box-shadow:0 12px 40px rgba(15,23,42,0.08); overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="padding:32px 40px 20px;">
                <img
                  src="https://res.cloudinary.com/dnkenioua/image/upload/v1764999707/Group_ik1uap.png"
                  alt="Townify"
                 
                  style="display:block;"
                />
              </td>
            </tr>

            <tr>
              <td style="height:1px; background-color:#e5e7eb;"></td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:36px 40px 20px; color:#0f172a;">
                <h1 style="margin:0 0 14px; font-size:26px; font-weight:700;">
                  You’re invited to join <span style="color:#234452;">${spaceName}</span>
                </h1>

                <p style="margin:0 0 14px; font-size:15px; line-height:1.7; color:#334155;">
                  <strong>${inviterEmail}</strong> has invited you to collaborate in the
                  <strong>${spaceName}</strong> space on <strong>Townify</strong>.
                </p>

                <p style="margin:0; font-size:15px; line-height:1.7; color:#334155;">
                  Join the space to explore, collaborate, and stay connected with your team.
                </p>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td align="center" style="padding:28px 40px 36px;">
                <a
                  href="${url}"
                  style="
                    display:inline-block;
                    padding:14px 34px;
                    background-color:#234452;
                    color:#ffffff;
                    text-decoration:none;
                    font-size:15px;
                    font-weight:600;
                    border-radius:10px;
                    box-shadow:0 8px 20px rgba(35,68,82,0.35);
                  "
                >
                  Join ${spaceName}
                </a>
              </td>
            </tr>

            <!-- Fallback link -->
            <tr>
              <td style="padding:0 40px 32px; font-size:13px; color:#64748b;">
                If the button doesn’t work, copy and paste this link into your browser:
                <br />
                <span style="word-break:break-all;">${url}</span>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px; background-color:#f1f5f9; font-size:12px; color:#64748b; text-align:center;">
                This invitation was sent to <strong>${email}</strong>.
                <br />
                If you weren’t expecting this email, you can safely ignore it.
                <br /><br />
                © ${new Date().getFullYear()} Townify
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export { sendOTPEmail, sendInvitationEmail };