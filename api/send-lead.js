import nodemailer from "nodemailer";

export default async function handler(req, res) {
  console.log("➡️ API HIT");

  if (req.method !== "POST") {
    console.log("❌ Wrong method");
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("📦 Body:", req.body);

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ionos.de",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    console.log("🔐 SMTP config loaded");

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.RECEIVER_MAIL,
      subject: "TEST – Botpress Lead",
      text: "Wenn du das liest, funktioniert SMTP."
    });

    console.log("✅ MAIL SENT");

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("🔥 MAIL ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}


