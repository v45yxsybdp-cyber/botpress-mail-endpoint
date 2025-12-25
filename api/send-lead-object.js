import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // === DATEN AUS BOTPRESS ===
    const {
      lead_type,
      contact_name,
      contact_email,
      contact_phone,
      buyer_timeline,
      object_reference,
      optional_message
    } = req.body;

    // === SMTP TRANSPORT (WICHTIG: IDENTISCH ZUM FUNKTIONIERENDEN ENDPOINT) ===
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // === MAIL TEXT ===
    const mailText = `
${lead_type} – Konkrete Kaufanfrage

Name: ${contact_name || "-"}
E-Mail: ${contact_email || "-"}
Telefon: ${contact_phone || "-"}

Zeitrahmen:
${buyer_timeline || "-"}

Bezug auf Immobilie:
${object_reference || "-"}

Zusätzliche Nachricht:
${optional_message || "-"}
`;

    // === MAIL SENDEN ===
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `${lead_type} – Konkrete Kaufanfrage`,
      text: mailText
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mail error:", error);
    return res.status(500).json({ error: "Mail could not be sent" });
  }
}
