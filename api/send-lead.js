import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const {
    name,
    email,
    phone,
    message,
    summary
  } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"Website Lead" <${process.env.MAIL_USER}>`,
      to: process.env.RECEIVER_MAIL,
      subject: "Neue Immobilien-Anfrage",
      text: `
Name: ${name}
E-Mail: ${email}
Telefon: ${phone}

Zusammenfassung:
${summary}

Optionale Nachricht:
${message || "-"}
      `
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
