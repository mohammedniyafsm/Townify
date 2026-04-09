import nodemailer from "nodemailer";


const gmail = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASSWORD;

if (!gmail || !password) {
  throw new Error("EMAIL_USER or EMAIL_PASSWORD is missing in environment variables");
}


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmail,
    pass: password, // MUST be App Password
  },
});

const sendOTPEmail = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"Townify" <${gmail}>`,
      to: email,
      subject: "Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="color: #234452; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
        </div>
      `,
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("EMAIL_SEND_FAILED");
  }
};


const sendInvitationEmail = async (
  email: string,
  spaceName: string,
  inviterEmail: string,
  url: string
) => {
  try {
    await transporter.sendMail({
      from: `"Townify" <${gmail}>`, // MUST be authenticated email
      replyTo: inviterEmail,        // ✅ replies go to inviter
      to: email,
      subject: `Invitation to join ${spaceName} on Townify`,
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background:#f8fafc; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" style="background:#ffffff; border-radius:14px; padding:40px;">
          <tr>
            <td>
              <h1 style="color:#234452;">You're invited to join ${spaceName}</h1>
              <p>
                <strong>${inviterEmail}</strong> invited you to collaborate on
                <strong>${spaceName}</strong> using Townify.
              </p>

              <div style="margin:30px 0;">
                <a
                  href="${url}"
                  style="
                    padding:14px 32px;
                    background:#234452;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:bold;
                  "
                >
                  Join Space
                </a>
              </div>

              <p style="font-size:13px; color:#555;">
                If the button doesn’t work, copy this link:
                <br />
                ${url}
              </p>

              <p style="font-size:12px; color:#777;">
                This email was sent to ${email}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `You are invited to join ${spaceName}. Visit: ${url}`,
    });
  } catch (error) {
    console.error("Failed to send invitation email:", error);
    throw new Error("EMAIL_SEND_FAILED");
  }
};


const inviteApprovalEmail = async (
  email: string,
  spaceName: string,
  url: string
) => {
  try {
    await transporter.sendMail({
      from: `"Townify" <${gmail}>`,
      to: email,
      subject: `You're approved to join ${spaceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h2>Invitation Approved 🎉</h2>
          <p>
            Your request to join <strong>${spaceName}</strong> has been approved.
          </p>

          <a
            href="${url}"
            style="
              display:inline-block;
              margin-top:16px;
              padding:12px 28px;
              background:#234452;
              color:#ffffff;
              text-decoration:none;
              border-radius:8px;
              font-weight:600;
            "
          >
            Open Space
          </a>

          <p style="margin-top:20px; font-size:13px; color:#555;">
            If the button doesn’t work, use this link:
            <br />
            ${url}
          </p>
        </div>
      `,
      text: `You're approved to join ${spaceName}. Visit: ${url}`,
    });
  } catch (error) {
    console.error("Failed to send approval email:", error);
    throw new Error("EMAIL_SEND_FAILED");
  }
};


export {
  sendOTPEmail,
  sendInvitationEmail,
  inviteApprovalEmail,
};
