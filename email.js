const nodemailer = require("nodemailer");

// Read env vars
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT
  ? parseInt(process.env.SMTP_PORT, 10)
  : 465;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE =
  process.env.SMTP_SECURE === "true" || SMTP_PORT === 465;

// Validate config
const isEmailConfigured =
  SMTP_HOST && SMTP_USER && SMTP_PASS;

let transporter = null;

if (isEmailConfigured) {
  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE, // ✅ true for 465
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        servername: SMTP_HOST,
        rejectUnauthorized: true, // ✅ keep true in production
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });

    // Verify async (non-blocking)
    transporter.verify((error) => {
      if (error) {
        console.warn("[EMAIL] SMTP verification failed:", error.message);
        console.warn("[EMAIL] This usually means outbound SMTP is blocked or TLS failed");
      } else {
        console.log("[EMAIL] ✓ SMTP server is ready to send emails");
      }
    });
  } catch (err) {
    console.error("[EMAIL] Failed to create transporter:", err.message);
    transporter = null;
  }
} else {
  console.warn("[EMAIL] SMTP configuration missing");
  console.warn("[EMAIL] Required: SMTP_HOST, SMTP_USER, SMTP_PASS");
}

module.exports = transporter;
