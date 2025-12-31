const nodemailer = require("nodemailer");

// Validate SMTP configuration
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || SMTP_PORT === 465;

// Check if email configuration is available
const isEmailConfigured = SMTP_HOST && SMTP_USER && SMTP_PASS;

let transporter = null;

if (isEmailConfigured) {
  try {
  transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // Must be false for Brevo
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});


    // Verify connection on startup (async, won't block)
    transporter.verify((error, success) => {
      if (error) {
        console.warn("[EMAIL] SMTP verification failed:", error.message);
        console.warn("[EMAIL] Emails may still work, but please verify your SMTP configuration");
        console.warn("[EMAIL] Required: SMTP_HOST, SMTP_USER, SMTP_PASS");
        console.warn("[EMAIL] Optional: SMTP_PORT (default: 587), SMTP_SECURE (default: false)");
      } else {
        console.log("[EMAIL] ✓ SMTP server is ready to send emails");
      }
    });
  } catch (error) {
    console.error("[EMAIL] Failed to create email transporter:", error.message);
    transporter = null;
  }
} else {
  console.warn("[EMAIL] SMTP configuration missing. Email functionality will be disabled.");
  console.warn("[EMAIL] Required environment variables: SMTP_HOST, SMTP_USER, SMTP_PASS");
  console.warn("[EMAIL] Optional: SMTP_PORT (default: 587), SMTP_SECURE (default: false for port 587)");
}

module.exports = transporter;
