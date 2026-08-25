const path = require("path");
const nodemailer = require("nodemailer");

// Ensure environment variables are loaded regardless of current working directory
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

// =======================
// Send Email
// =======================
const sendEmail = async (to, subject, message, html = null) => {
  try {
    const user = process.env.EMAIL_USER;
    const rawPass = process.env.EMAIL_PASS;

    if (!user || !rawPass) {
      console.warn(
        "⚠️ EMAIL_USER or EMAIL_PASS not set in environment variables. Email will not be sent."
      );
      return false;
    }

    const cleanPass = rawPass.replace(/\s+/g, "");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass: cleanPass,
      },
    });

    const mailOptions = {
      from: `"SmileHub Healthcare" <${user}>`,
      to,
      subject,
      text: message,
    };

    if (html) {
      mailOptions.html = html;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log(
      "✅ Email sent successfully to:",
      to,
      "MessageId:",
      info.messageId
    );

    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

// =======================
// Send OTP Email
// =======================
const sendOTPEmail = async (to, otp) => {
  const subject = "SmileHub - Email Verification OTP";

  const message = `
Hello,

Welcome to SmileHub Healthcare.

Your email verification OTP is:

${otp}

This OTP is valid for 10 minutes.

If you did not create a SmileHub account, please ignore this email.

Regards,
SmileHub Healthcare
`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">SmileHub Healthcare</h2>

      <p>Hello,</p>

      <p>Welcome to SmileHub Healthcare.</p>

      <p>Your email verification OTP is:</p>

      <h1 style="letter-spacing: 8px; color: #2563eb;">
        ${otp}
      </h1>

      <p>
        This OTP is valid for <strong>10 minutes</strong>.
      </p>

      <p>
        If you did not create a SmileHub account, please ignore this email.
      </p>

      <p>Regards,<br />SmileHub Healthcare</p>
    </div>
  `;

  return await sendEmail(to, subject, message, html);
};

module.exports = sendEmail;
module.exports.sendOTPEmail = sendOTPEmail;